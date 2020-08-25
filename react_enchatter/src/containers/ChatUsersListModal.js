import React from "react";
import {Modal} from "antd";

import {connect} from "react-redux";
import {getChatName, getUserRole} from "../store/utility";
import {getHttpClient} from "../common/http_client";
import {HOST_URL} from "../settings";
import {closeChatUsersListPopup, closeUserPasswordPopup, openUserPasswordPopup} from "../store/actions/nav";
import {deleteUser, updatedUser} from "../store/actions/message";
import ReactTooltip from "react-tooltip";


class ChatUsersListModal extends React.Component {
    deleteUser = (user) => {
        getHttpClient().delete(`${HOST_URL}/admin/users/${user.id}/`)
            .then(res => {
                this.props.deleteUser(user);
                this.props.getUserChats(this.props.username, this.props.token);
            })
            .catch(err => {
                this.setState({
                    error: err
                });
            });
    };

    toggleUserActivation = (user) => {
        user.is_active = !user.is_active;
        getHttpClient().patch(`${HOST_URL}/admin/users/${user.id}/`,
            {"is_active": user.is_active})
            .then(res => {
                this.props.updateUser(user);
                this.props.getUserChats(this.props.username, this.props.token);
            })
            .catch(err => {
                this.setState({
                    error: err
                });
            });
    };

    changeRole = (user, role) =>{
        let params = {};
        if (role === "USER"){
            user.is_staff = false;
            user.is_superuser = false;
            params = {"is_staff": false, "is_superuser": false};
        }
        if (role === "STAFF"){
            user.is_staff = true;
            user.is_superuser = false;
            params = {"is_staff": true, "is_superuser": false};
        }
        if (role === "ADMIN"){
            user.is_staff = true;
            user.is_superuser = true;
            params = {"is_staff": true, "is_superuser": true};
        }
         getHttpClient().patch(`${HOST_URL}/admin/users/${user.id}/`, params)
            .then(res => {
                this.props.updateUser(user);
                this.props.getUserChats(this.props.username, this.props.token);
            })
            .catch(err => {
                this.setState({
                    error: err
                });
            });
    };

    renderActivationButton = (user) => {
        if (this.canUserEditUser(user)) {
            return (<button type="button" className={user.is_active ? `btn btn-success` : `btn btn-warning`}
                            onClick={() => this.toggleUserActivation(user)}>{user.is_active ? `Active` : `Disabled`}</button>)
        }
    };

    renderAssignRoleDropdown = (user) => {
        if (this.canUserEditUser(user)) {
            return (
                <div className="btn-group btn-group-sm" role="group">
                    <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{getUserRole(user)}</button>
                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        {this.props.isAdmin && user.is_staff && !user.is_admin ? (<a className="dropdown-item" onClick={() => this.changeRole(user, "USER")}>User</a>) : null}
                        {(this.props.isAdmin || this.props.isStaff)&& !user.is_staff ? (<a className="dropdown-item" onClick={() =>this.changeRole(user, "STAFF")}>Admin</a>) : null }
                        {this.props.isAdmin && !user.is_admin ? (<a className="dropdown-item" onClick={() =>this.changeRole(user, "ADMIN")}>Super Admin</a>) : null }
                    </div>
                </div>
            )
        } else {
            return (
                <div className="btn-group btn-group-sm" role="group">
                    <button className="btn btn-secondary" type="button" id="dropdownMenuButton">{getUserRole(user)}</button>
                </div>
            );
        }
    };

    canUserEditUser(user){
        if (this.props.isAdmin === true){
            return !user.is_admin
        }
        if (this.props.isStaff){
            return !user.is_admin && !user.is_staff
        }
        return false
    }

    renderUserList() {
        if (this.props.activeChat !== null) {
            let users = this.props.activeChat.participants.map(p => {
                return (
                    <li key={p.id} className="list-group-item">
                        <span data-tip data-for={'mb'+p.id}>{p.username}</span>
                        <ReactTooltip id={'mb'+p.id} type='info' place="right" effect='solid'>
                          <span>Username: {p.first_name}</span>
                            <br/>
                          <span>Comment: {p.last_name}</span>
                        </ReactTooltip>
                        <div className="btn-group btn-group-sm pull-right" role="group" aria-label="...">
                            {this.renderAssignRoleDropdown(p)}
                            {this.canUserEditUser(p) ? (
                                <button type="button" className="btn btn-light" onClick={() => this.props.openUserPasswordPopup(p)}>Password</button>) : null}
                            {this.renderActivationButton(p)}
                            {this.canUserEditUser(p) ? (
                                <button type="button" className="btn btn-danger" onClick={() => this.deleteUser(p)}>Delete</button>) : null}
                        </div>
                    </li>
                );
            });
            return (<ul className="list-group list-group-flush">{users}</ul>);
        }
    }

    render() {
        let activeChat = "";
        if (this.props.activeChat !== null && this.props.activeChat !== undefined) {
            activeChat = getChatName(this.props.activeChat.participants);
        }
        return (
            <Modal
                centered
                footer={null}
                visible={this.props.isVisible}
                onCancel={this.props.close}>
                <h2>Chat members</h2>
                {this.renderUserList()}
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        username: state.auth.username,
        token: state.auth.token,
        isStaff: state.auth.isStaff,
        isAdmin: state.auth.isAdmin,
        activeChat: state.message.activeChat
    };
};

const mapDispatchToProps = dispatch => {
    return {
        openUserPasswordPopup: (user) => dispatch(openUserPasswordPopup(user)),
        closeChatUsersListPopup: () => dispatch(closeChatUsersListPopup()),
        deleteUser: (user) => dispatch(deleteUser(user)),
        updateUser: (user) => dispatch(updatedUser(user))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChatUsersListModal);
