import React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import * as navActions from "../store/actions/nav";
import * as messageActions from "../store/actions/message";
import {HOST_URL} from "../settings";
import {getHttpClient} from "../common/http_client";

class HorizontalAddUserToChatForm extends React.Component {
    state = {
        username: "",
        comment: "",
        is_staff: "",
        is_admin: "",
        error: null,
        inviteLink: ""
    };

    handleSubmit = e => {
        e.preventDefault();

        getHttpClient().post(`${HOST_URL}/api/rest-auth/registration/create/`, {
            username: e.target.username.value,
            comment: e.target.comment.value,
            // TODO remove when multi chat is supported
            chat: 1,
        })
            .then(res => {
                this.setState({inviteLink: res.data.link});
            })
            .catch(err => {
                this.setState({
                    error: err.response.data
                });
            });

    };

    showError(field) {
        if (this.state.error !== null && this.state.error[field]) {
            return (<span className="field-error">{this.state.error[field]}</span>);
        }
    }

    render() {
        return (
            this.state.inviteLink === "" ? (
                <form method="POST" id="create_invite" onSubmit={this.handleSubmit}>
                    {this.showError("non_field_errors")}
                    <div className="form-group">
                        <input type="text" className="form-control" id="username" placeholder="Username"/>
                        {this.showError("username")}
                    </div>

                    <div className="form-group">
                        <input type="text" className="form-control" id="comment" placeholder="Comment"/>
                        {this.showError("comment")}
                    </div>

                    <button type="submit" className="btn btn-primary">Change</button>
                </form>
            ) : (<input type="text" className="form-control" disabled value={this.state.inviteLink}/>)
        );
    }
}


const mapStateToProps = state => {
    return {
        username: state.auth.username,
        token: state.auth.token,
        isStaff: state.auth.isStaff,
        isAdmin: state.auth.isAdmin,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        closeAddUserToChatPopup: () => dispatch(navActions.closeAddUserToChatPopup())
    };
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(HorizontalAddUserToChatForm)
);
