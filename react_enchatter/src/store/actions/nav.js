import * as actionTypes from "./actionTypes";

export const openAddChatPopup = () => {
  return {
    type: actionTypes.OPEN_ADD_CHAT_POPUP
  };
};

export const closeAddChatPopup = () => {
  return {
    type: actionTypes.CLOSE_ADD_CHAT_POPUP
  };
};


export const openAddUserToChatPopup = (chat) => {
  return {
    type: actionTypes.OPEN_ADD_USER_TO_CHAT_POPUP,
    chat: chat,
  };
};

export const closeAddUserToChatPopup = () => {
  return {
    type: actionTypes.CLOSE_ADD_USER_TO_CHAT_POPUP
  };
};

export const openChatUsersListPopup = () => {
  return {
    type: actionTypes.OPEN_CHAT_USERS_LIST_POPUP
  };
};

export const closeChatUsersListPopup = () => {
  return {
    type: actionTypes.CLOSE_CHAT_USERS_LIST_POPUP
  };
};

export const openUserPasswordPopup = (user) => {
  return {
    type: actionTypes.OPEN_USER_PASSWORD_POPUP,
    user: user
  };
};

export const closeUserPasswordPopup = () => {
  return {
    type: actionTypes.CLOSE_USER_PASSWORD_POPUP
  };
};

