import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  showAddChatPopup: false,
  showAddUserToChatPopup: false,
  showChatUsersListPopup: false,
  showUsersPasswordPopup: false,
  editingUserId : null,
};

const openAddChatPopup = (state, action) => {
  return updateObject(state, { showAddChatPopup: true });
};

const closeAddChatPopup = (state, action) => {
  return updateObject(state, { showAddChatPopup: false });
};

const openAddUserToChatPopup = (state, action) => {
  return updateObject(state, { showAddUserToChatPopup: true });
};

const closeAddUserToChatPopup = (state, action) => {
  return updateObject(state, { showAddUserToChatPopup: false });
};

const openChatUsersListPopup = (state, action) => {
  return updateObject(state, { showChatUsersListPopup: true });
};

const closeChatUsersListPopup = (state, action) => {
  return updateObject(state, { showChatUsersListPopup: false });
};

const openUserPasswordPopup = (state, action) => {
  return updateObject(state, { showUsersPasswordPopup: true, editingUserId: action.user });
};

const closeUserPasswordPopup = (state, action) => {
  return updateObject(state, { showUsersPasswordPopup: false, editingUserId: null });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.OPEN_ADD_CHAT_POPUP:
      return openAddChatPopup(state, action);
    case actionTypes.CLOSE_ADD_CHAT_POPUP:
      return closeAddChatPopup(state, action);
    case actionTypes.OPEN_ADD_USER_TO_CHAT_POPUP:
      return openAddUserToChatPopup(state, action);
    case actionTypes.CLOSE_ADD_USER_TO_CHAT_POPUP:
      return closeAddUserToChatPopup(state, action);
    case actionTypes.OPEN_CHAT_USERS_LIST_POPUP:
      return openChatUsersListPopup(state, action);
    case actionTypes.CLOSE_CHAT_USERS_LIST_POPUP:
      return closeChatUsersListPopup(state, action);
    case actionTypes.OPEN_USER_PASSWORD_POPUP:
      return openUserPasswordPopup(state, action);
    case actionTypes.CLOSE_USER_PASSWORD_POPUP:
      return closeUserPasswordPopup(state, action);
    default:
      return state;
  }
};

export default reducer;
