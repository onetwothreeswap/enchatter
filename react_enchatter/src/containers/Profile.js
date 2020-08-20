import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Hoc from "../hoc/hoc";
import * as navActions from "../store/actions/nav";
import Circle from "../components/Circle";
import {getChatName} from "../store/utility";
import {logout} from "../store/actions/auth";

class Profile extends React.Component {
  render() {
    let participants = "";
    for (const chat of this.props.chats){
        if (chat.id.toString() === this.props.match.params.chatID){
          participants = getChatName(chat.participants);
        }
    }

    return (
      <div className="contact-profile">
        {this.props.username !== null ? (
          <Hoc>
            <Circle username={this.props.username} size={60}/>
            <p>{participants}</p>
            <div className="social-media">
                <i onClick={() => this.props.openChatUsersList()} className="fa fa-users" aria-hidden="true" />
                {this.props.isStaff === true ? (<i onClick={() => this.props.addUserToChat()} className="fa fa-user-plus" aria-hidden="true" />) : null}

                    <div className="dropdown expand-button profile-dropdown" style={{display:"inline-block"}}>
                      <button className="btn btn-link dropdown-toggle profile-dropdown" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      </button>
                      <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <a className="dropdown-item" href="#" onClick={() => this.props.openUserPasswordPopup()}>Change password</a>
                        <a className="dropdown-item" href="#" onClick={() => this.props.logout()}>Logout</a>
                      </div>
                    </div>

            </div>
          </Hoc>
        ) : null}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(logout()),
        addUserToChat: (chat) => dispatch(navActions.openAddUserToChatPopup(chat)),
        openChatUsersList: (chat) => dispatch(navActions.openChatUsersListPopup(chat)),
        openUserPasswordPopup: () => dispatch(navActions.openUserPasswordPopup(null)),
    };
};


const mapStateToProps = state => {
  return {
    username: state.auth.username,
    token: state.auth.token,
    chats:  state.message.chats,
    isStaff: state.auth.isStaff,
    isAdmin: state.auth.isAdmin,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
