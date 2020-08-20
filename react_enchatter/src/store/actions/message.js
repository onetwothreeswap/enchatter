import axios from "axios";
import * as actionTypes from "./actionTypes";
import { HOST_URL } from "../../settings";

export const addMessage = message => {
  return {
    type: actionTypes.ADD_MESSAGE,
    message: message
  };
};

export const setMessages = messages => {
  return {
    type: actionTypes.SET_MESSAGES,
    messages: messages
  };
};

const getUserChatsSuccess = chats => {
  return {
    type: actionTypes.GET_CHATS_SUCCESS,
    chats: chats
  };
};

export const setActiveChat = chat => {
  return {
    type: actionTypes.SET_ACTIVE_CHAT,
    activeChat: chat
  };
};

export const deleteUser = user => {
  return {
    type: actionTypes.DELETE_USER,
    user: user
  };
};

export const updatedUser = user => {
  return {
    type: actionTypes.SET_UPDATE_USER,
    user: user
  };
};

export const deleteMessage = id => {
  return {
    type: actionTypes.DELETE_MESSAGE,
    id: id
  };
};



export const getUserChats = (username, token) => {
  return dispatch => {
    axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios.defaults.xsrfCookieName = "csrftoken";
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    };
    axios
      .get(`${HOST_URL}/chat/`)
      .then(res => dispatch(getUserChatsSuccess(res.data)));
  };
};
