import React from "react";
import {Spin, Icon} from "antd";
import {connect} from "react-redux";
import * as actions from "../store/actions/auth";
import * as navActions from "../store/actions/nav";
import * as messageActions from "../store/actions/message";
import Contact from "../components/Contact";
import Circle from "../components/Circle";

const antIcon = <Icon type="loading" style={{fontSize: 24}} spin/>;

class Sidepanel extends React.Component {
    state = {
        loginForm: true
    };

    waitForAuthDetails() {
        const component = this;
        setTimeout(function () {
            if (
                component.props.token !== null &&
                component.props.token !== undefined
            ) {
                component.props.getUserChats(
                    component.props.username,
                    component.props.token
                );
                return;
            } else {
                console.log("waiting for authentication details...");
                component.waitForAuthDetails();
            }
        }, 100);
    }

    componentDidMount() {
        this.waitForAuthDetails();
    }

    openAddChatPopup() {
        this.props.addChat();
    }

    render() {
        let activeChats = this.props.chats.map(c => {
            return (
                <Contact
                    key={c.id}
                    name="Harvey Specter"
                    picURL="http://emilcarlsson.se/assets/louislitt.png"
                    status="busy"
                    chatURL={`/${c.id}`}
                    participants={c.participants}
                />
            );
        });
        return (
            <div id="sidepanel">
                <div id="profile">
                    <div className="wrap">
                        <Circle username={this.props.username} size={50}/>
                        <p>{this.props.username}</p>
                        <div id="status-options">
                            <ul>
                                <li id="status-online" className="active">
                                    <span className="status-circle"/> <p>Online</p>
                                </li>
                                <li id="status-away">
                                    <span className="status-circle"/> <p>Away</p>
                                </li>
                                <li id="status-busy">
                                    <span className="status-circle"/> <p>Busy</p>
                                </li>
                                <li id="status-offline">
                                    <span className="status-circle"/> <p>Offline</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div id="search">
                    <label htmlFor="">
                        <i className="fa fa-search" aria-hidden="true"/>
                    </label>
                    <input type="text" placeholder="Search Chats..."/>
                </div>
                <div id="contacts">
                    <ul>{activeChats}</ul>
                </div>
                {/*<div id="bottom-bar">*/}
                    {/*<button id="addChat" onClick={() => this.openAddChatPopup()}>*/}
                        {/*<i className="fa fa-user-plus fa-fw" aria-hidden="true"/>*/}
                        {/*<span>Create chat</span>*/}
                    {/*</button>*/}
                    {/*<button id="settings">*/}
                        {/*<i className="fa fa-cog fa-fw" aria-hidden="true"/>*/}
                        {/*<span>Settings</span>*/}
                    {/*</button>*/}
                {/*</div>*/}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null,
        loading: state.auth.loading,
        token: state.auth.token,
        username: state.auth.username,
        chats: state.message.chats
    };
};

const mapDispatchToProps = dispatch => {
    return {
        login: (userName, password) =>
            dispatch(actions.authLogin(userName, password)),
        logout: () => dispatch(actions.logout()),
        signup: (username, email, password1, password2) =>
            dispatch(actions.authSignup(username, email, password1, password2)),
        addChat: () => dispatch(navActions.openAddChatPopup()),
        getUserChats: (username, token) =>
            dispatch(messageActions.getUserChats(username, token))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Sidepanel);
