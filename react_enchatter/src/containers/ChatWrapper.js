import React from "react";
import {connect} from "react-redux";
import WebSocketInstance from "../websocket";
import {Redirect} from "react-router-dom";
import Sidepanel from "./Sidepanel";
import AddChatModal from "./Popup";
import AddUserToChatModal from "../components/AddUserToChatModal";
import BaseRouter from "../routes";
import * as navActions from "../store/actions/nav";
import * as messageActions from "../store/actions/message";
import ChatUsersListModal from "./ChatUsersListModal";
import UserPasswordModal from "./UserPasswordModal";


class ChatWrapper extends React.Component {
    constructor(props) {
        super(props);
        WebSocketInstance.addCallbacks(
            this.props.setMessages.bind(this),
            this.props.addMessage.bind(this),
        );
    }

    render() {
        if (this.props.isAuthenticated !== true) {
            return <Redirect to="login"/>
        }
        return (<div id="frame">
            <Sidepanel/>
            <div className="content">
                <AddChatModal
                    isVisible={this.props.showAddChatPopup}
                    close={() => this.props.closeAddChatPopup()}
                />
                <AddUserToChatModal
                    isVisible={this.props.showAddUserToChatPopup}
                    close={() => this.props.closeAddUserToChatPopup()}
                />
                <ChatUsersListModal
                    isVisible={this.props.showChatUsersListPopup}
                    close={() => this.props.closeChatUsersListPopup()}
                />
                <UserPasswordModal
                    className="user-password-modal"
                    isVisible={this.props.showUsersPasswordPopup}
                    close={() => this.props.closeUserPasswordPopup()}
                />
                <BaseRouter/>
            </div>
        </div>)
    }
}

const mapStateToProps = state => {
    return {
        showAddChatPopup: state.nav.showAddChatPopup,
        showAddUserToChatPopup: state.nav.showAddUserToChatPopup,
        showChatUsersListPopup: state.nav.showChatUsersListPopup,
        showUsersPasswordPopup: state.nav.showUsersPasswordPopup,
        isAuthenticated: state.auth.token !== null,
        activeChat: state.auth.token !== null,
        chats: state.auth.token !== null,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        closeAddChatPopup: () => dispatch(navActions.closeAddChatPopup()),
        closeAddUserToChatPopup: () => dispatch(navActions.closeAddUserToChatPopup()),
        closeChatUsersListPopup: () => dispatch(navActions.closeChatUsersListPopup()),
        closeUserPasswordPopup: () => dispatch(navActions.closeUserPasswordPopup()),
        addMessage: message => dispatch(messageActions.addMessage(message)),
        setMessages: messages => dispatch(messageActions.setMessages(messages)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChatWrapper);