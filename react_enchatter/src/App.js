import React from "react";
import {connect} from "react-redux";
import {BrowserRouter as Router} from "react-router-dom";
import * as actions from "./store/actions/auth";
import "./assets/style.css";
import {Route, Switch} from "react-router-dom";
import Login from "./containers/Login";
import Register from "./containers/Register";
import {Redirect} from "react-router-dom";
import ChatWrapper from "./containers/ChatWrapper";


class App extends React.Component {
    componentDidMount() {
        this.props.onTryAutoSignup();
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/register/:key" component={Register}/>
                    <Route path="/login" component={Login}/>
                    <Route path="/" component={ChatWrapper}>
                </Route>
            </Switch>
    </Router>
    )
        ;
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onTryAutoSignup: () => dispatch(actions.authCheckState()),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
