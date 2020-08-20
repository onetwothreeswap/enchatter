import React from "react";
import "../assets/login.css"
import * as actions from "../store/actions/auth";
import { Redirect } from "react-router-dom";
import {connect} from "react-redux";
import * as messageActions from "../store/actions/message";

class Register extends React.Component {
    register = e => {
        e.preventDefault();
        this.props.signup(
            e.target.username.value,
            e.target.password1.value,
            e.target.password2.value,
            e.target.key.value,
        );
    };

    showError(field){
        if (this.props.error !== null && this.props.error[field] ){
            return (<span className="field-error">{this.props.error[field]}</span>);
        }
    }

    render() {

        if (this.props.isAuthenticated){
            //TODO REMOVE change to
            // return <Redirect to="/"/>;
            return <Redirect to="/1"/>;
        }
        return (
            <div className="container">
                <div className="login-form">
                    <div className="main-div">
                        <div className="panel">
                            <h2>Register</h2>
                            <p>Please enter your username and password</p>
                        </div>
                        <form method="POST" id="Login" onSubmit={this.register}>
                            {this.showError("non_field_errors")}
                            {this.showError("key")}
                            <input type="hidden" value={this.props.match.params.key} id="key"/>
                            <div className="form-group">
                                <input type="text" className="form-control" id="username"
                                       placeholder="Username"/>
                                {this.showError("username")}
                            </div>

                            <div className="form-group">
                                <input type="password" className="form-control" id="password1"
                                       placeholder="Password"/>
                                {this.showError("password1")}
                            </div>
                            <div className="form-group">
                                <input type="password" className="form-control" id="password2"
                                       placeholder="Repeat password"/>
                                {this.showError("password2")}
                            </div>
                            <button type="submit" className="btn btn-primary">Register</button>
                        </form>
                    </div>
                </div>
            </div>
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
        signup: (username, password1, password2, key) =>
            dispatch(actions.authSignup(username, password1, password2, key))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Register);

