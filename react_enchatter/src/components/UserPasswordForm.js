import React from "react";
import "../assets/login.css"
import * as actions from "../store/actions/auth";
import {Redirect} from "react-router-dom";
import {connect} from "react-redux";
import * as messageActions from "../store/actions/message";
import {HOST_URL} from "../settings";
import {getHttpClient} from "../common/http_client";
import {closeUserPasswordPopup} from "../store/actions/nav";

class UserPasswordForm extends React.Component {
    state = {
        error: null
    };

    componentDidUpdate(prevProps) {
      if (prevProps.user !== this.props.user) {
          document.getElementById("change_password").reset();
          this.setState({error:null});
      }
    }



    handleSubmit = e => {
        e.preventDefault();
        let data = {
            new_password1: e.target.new_password1.value,
            new_password2: e.target.new_password2.value,
        };
        if (this.props.user !== null) {
            data["user_id"] = this.props.user.id;
        }
        getHttpClient().post(`${HOST_URL}/api/rest-auth/password/change/`, data
        )
            .then(res => {
                this.props.closeUserPasswordPopup();
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
            <form method="POST" id="change_password" onSubmit={this.handleSubmit}>
                {this.showError("non_field_errors")}
                {/*<div className="form-group">*/}
                {/*<input type="password" className="form-control" id="old_password" placeholder="Old password"/>*/}
                {/*{this.showError("old_password")}*/}
                {/*</div>*/}
                <div className="form-group">
                    <input type="password" className="form-control" id="new_password1" placeholder="New password"/>
                    {this.showError("new_password1")}
                </div>

                <div className="form-group">
                    <input type="password" className="form-control" id="new_password2" placeholder="Repeat password"/>
                    {this.showError("new_password2")}
                </div>
                <button type="submit" className="btn btn-primary">Change</button>
            </form>
        );
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null,
        error: state.auth.error
    };
};

const mapDispatchToProps = dispatch => {
    return {
        login: (username, password) => dispatch(actions.authLogin(username, password)),
        closeUserPasswordPopup: () => dispatch(closeUserPasswordPopup()),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserPasswordForm);

