import React from "react";
import {connect} from "react-redux";
import WebSocketInstance from "../websocket";
import Hoc from "../hoc/hoc";
import Profile from "./Profile";
import Circle from "../components/Circle";
import * as messageActions from "../store/actions/message";
import {HOST_URL} from "../settings";
import {getHttpClient} from "../common/http_client";


class Chat extends React.Component {
    state = {message: "", fetchingNewMessages: false, pageNum: 0};
    messageChangeHandler = event => {
        this.setState({message: event.target.value});
    };
    sendMessageHandler = e => {
        e.preventDefault();
        this.scrollToBottom();
        const messageObject = {
            from: this.props.username,
            content: this.state.message,
            chatId: this.props.match.params.chatID
        };
        WebSocketInstance.newChatMessage(messageObject);
        this.setState({message: ""});
    };
    renderTimestamp = timestamp => {
        let prefix = "";
        const timeDiff = Math.round(
            (new Date().getTime() - new Date(timestamp).getTime()) / 60000
        );
        if (timeDiff < 1) {
            // less than one minute ago
            prefix = "just now...";
        } else if (timeDiff < 60 && timeDiff > 1) {
            // less than sixty minutes ago
            prefix = `${timeDiff} minutes ago`;
        } else if (timeDiff < 24 * 60 && timeDiff > 60) {
            // less than 24 hours ago
            prefix = `${Math.round(timeDiff / 60)} hours ago`;
        } else if (timeDiff < 31 * 24 * 60 && timeDiff > 24 * 60) {
            // less than 7 days ago
            prefix = `${Math.round(timeDiff / (60 * 24))} days ago`;
        } else {
            prefix = `${new Date(timestamp)}`;
        }
        return prefix;
    };
    renderMessages = messages => {
        const currentUser = this.props.username;
        return messages.map((message, i, arr) => (
            <li
                key={message.id}
                style={{marginBottom: arr.length - 1 === i ? "300px" : "15px"}}
                className={message.author === currentUser ? "sent" : "replies"}
            >
                <Circle username={message.author} size={42}/>
                <p>
                    {message.content}
                    {this.renderDeleteButton(message.id)}
                    <br/>
                    <small>{this.renderTimestamp(message.timestamp)}</small>
                </p>
            </li>
        ));
    };
    deleteMessage = (id) => {
        getHttpClient().delete(`${HOST_URL}/admin/messages/${id}/`)
            .then(res => {
                this.props.deleteMessage(id);
            })
            .catch(err => {
                this.setState({
                    error: err
                });
            });
    };
    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({behavior: "smooth"});
    };

    handleScroll = (e) => {
        if (e.target.scrollTop === 0 && this.props.endReached !== true) {
            this.setState({pageNum: this.state.pageNum + 1});
            if (WebSocketInstance.state() === 1) {
                WebSocketInstance.fetchMessages(
                    this.props.match.params.chatID,
                    this.state.pageNum + 1,
                );
            }
            e.target.scrollTop = 100;
        }
    };

    constructor(props) {
        super(props);
        this.initialiseChat();
    }

    initialiseChat() {
        this.waitForSocketConnection(() => {
            WebSocketInstance.fetchMessages(
                this.props.match.params.chatID
            );
        });
        WebSocketInstance.connect(this.props.match.params.chatID);
    }

    waitForSocketConnection(callback) {
        const component = this;
        setTimeout(function () {
            if (WebSocketInstance.state() === 1) {
                console.log("Connection is made");
                callback();
                return;
            } else {
                console.log("wait for connection...");
                component.waitForSocketConnection(callback);
            }
        }, 1000);
    }

    renderDeleteButton(id) {
        if (this.props.isStaff === true) {
            return (
                <i className="delete-symbol fa fa-times" onClick={() => this.deleteMessage(id)} aria-hidden="true"/>);
        }
    }

    componentDidMount() {
        this.props.setActiveChat(this.props.match.params.chatID);
        this.scrollToBottom();
    }

    componentDidUpdate() {
        if (this.state.pageNum === 0){
            this.scrollToBottom();
        }
    }

    componentWillReceiveProps(newProps) {
        if (this.props.match.params.chatID !== newProps.match.params.chatID) {
            WebSocketInstance.disconnect();
            this.waitForSocketConnection(() => {
                WebSocketInstance.fetchMessages(
                    newProps.match.params.chatID
                );
            });
            WebSocketInstance.connect(newProps.match.params.chatID);
            this.props.setActiveChat(newProps.match.params.chatID);
        }
    }

    render() {
        return (
            <Hoc>
                <Profile match={this.props.match}/>

                <div className="messages" onScroll={this.handleScroll}>
                    <ul id="chat-log">
                        {this.props.messages && this.renderMessages(this.props.messages)}
                        <div
                            style={{float: "left", clear: "both"}}
                            ref={el => {
                                this.messagesEnd = el;
                            }}
                        />
                    </ul>
                </div>
                <div className="message-input">
                    <form onSubmit={this.sendMessageHandler}>
                        <div className="wrap">
                            <input
                                onChange={this.messageChangeHandler}
                                value={this.state.message}
                                required
                                id="chat-message-input"
                                type="text"
                                placeholder="Write your message..."
                            />
                            <i className="fa fa-paperclip attachment" aria-hidden="true"/>
                            <button id="chat-message-submit" className="submit">
                                <i className="fa fa-paper-plane" aria-hidden="true"/>
                            </button>
                        </div>
                    </form>
                </div>
            </Hoc>
        );
    }
}

const mapStateToProps = state => {
    return {
        username: state.auth.username,
        messages: state.message.messages,
        endReached: state.message.endReached,
        chats: state.message.chats,
        isStaff: state.auth.isStaff,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setActiveChat: (chat) => dispatch(messageActions.setActiveChat(chat)),
        deleteMessage: (id) => dispatch(messageActions.deleteMessage(id))
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(Chat);
