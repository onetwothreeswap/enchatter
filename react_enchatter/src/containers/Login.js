import React from "react";
import "../assets/login.css"
import * as actions from "../store/actions/auth";
import { Redirect } from "react-router-dom";
import {connect} from "react-redux";
import * as messageActions from "../store/actions/message";

class Login extends React.Component {
    login = e => {
        e.preventDefault();
        this.props.login(
            e.target.username.value,
            e.target.password.value,
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
                            <h2>Login</h2>
                            <p>Please enter your username and password</p>
                        </div>
                        <form method="POST" id="Login" onSubmit={this.login}>
                            {this.showError("non_field_errors")}
                            <div className="form-group">
                                <input type="text" className="form-control" id="username"
                                       placeholder="Username"/>
                                {this.showError("username")}
                            </div>

                            <div className="form-group">
                                <input type="password" className="form-control" id="password"
                                       placeholder="Password"/>
                                {this.showError("password")}
                            </div>
                            <button type="submit" className="btn btn-primary">Login</button>
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
        login: (username, password) =>
            dispatch(actions.authLogin(username, password))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);

