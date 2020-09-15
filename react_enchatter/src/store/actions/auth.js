import axios from "axios";
import * as actionTypes from "./actionTypes";
import { HOST_URL } from "../../settings";

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  };
};

export const authSuccess = (username, token, isStaff, isAdmin) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    token: token,
    username: username,
    isStaff: isStaff,
    isAdmin: isAdmin,
  };
};

export const authFail = error => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error
  };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("isStaff");
  localStorage.removeItem("isAdmin");
  localStorage.removeItem("expirationDate");
  return {
    type: actionTypes.AUTH_LOGOUT
  };
};

export const checkAuthTimeout = expirationTime => {
  return dispatch => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  };
};

export const authLogin = (username, password) => {
  return dispatch => {
    dispatch(authStart());
    axios
      .post(`${HOST_URL}/api/rest-auth/login/`, {
        username: username,
        password: password
      })
      .then(res => {
        const token = res.data.key;
        const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        localStorage.setItem("isStaff", res.data.staff);
        localStorage.setItem("isAdmin", res.data.admin);
        localStorage.setItem("expirationDate", expirationDate);
        localStorage.setItem("public", res.data.public);
        dispatch(authSuccess(username, token, res.data.staff, res.data.admin));
        dispatch(checkAuthTimeout(3600));
      })
      .catch(err => {
        dispatch(authFail(err.response.data));
      });
  };
};

export const authSignup = (username, password1, password2, key) => {
  return dispatch => {
    dispatch(authStart());
    axios
      .post(`${HOST_URL}/api/rest-auth/registration/`, {
        username: username,
        key: key,
        password1: password1,
        password2: password2
      })
      .then(res => {
        const token = res.data.key;
        const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        localStorage.setItem("isStaff", res.data.staff);
        localStorage.setItem("isAdmin", res.data.admin);
        localStorage.setItem("expirationDate", expirationDate);
        dispatch(authSuccess(username, token, res.data.staff, res.data.admin));
        dispatch(checkAuthTimeout(3600));
      })
      .catch(err => {
        dispatch(authFail(err.response.data));
      });
  };
};

export const authCheckState = () => {


  return dispatch => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const isStaff =    localStorage.getItem("isStaff");
    const isAdmin =   localStorage.getItem("isAdmin");
    if (token === undefined) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem("expirationDate"));
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        dispatch(authSuccess(username, token, isStaff, isAdmin));
        dispatch(
          checkAuthTimeout(
            (expirationDate.getTime() - new Date().getTime()) / 1000
          )
        );
      }
    }
  };
};
