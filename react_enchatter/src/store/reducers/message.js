import * as actionTypes from "../actions/actionTypes";
import {updateObject} from "../utility";

const initialState = {
    messages: [],
    chats: [],
    activeChat: null,
    activeChatID: null,
    endReached: false,
};

const addMessage = (state, action) => {


    return updateObject(state, {
        messages: [...state.messages, action.message]
    });
};

const setMessages = (state, action) => {
    let endReached = action.messages.length === 0;
    return {...state, messages:[...action.messages.reverse(), ...state.messages], endReached: endReached};
};

const setChats = (state, action) => {
    if (state.activeChatID !== null) {
        let activeChat = action.chats.filter((val) => {
            if (val.id.toString() === state.activeChatID) {
                return val;
            }
        });
        if (activeChat.length > 0) {
            return updateObject(state, {
                activeChat: activeChat[0],
                chats: action.chats
            });
        }
    }

    return updateObject(state, {
        chats: action.chats
    });
};

const setActiveChat = (state, action) => {
    let currentActive = null;
    let activeChat = state.chats.filter((val) => {
        if (val.id.toString() === action.activeChat) {
            return val;
        }
    });
    if (activeChat.length > 0) {
        currentActive = activeChat[0];
    }

    return updateObject(state, {
        activeChat: currentActive,
        activeChatID: action.activeChat,
    });
};

const updateUser = (state, action) => {
    return {
        ...state,
        activeChat:{
            ...state.activeChat,
            participants: {...state.activeChat.participants,
            [0]:[...action.user]}}};
};

const deleteUser = (state, action) => {
    let newParticipans = state.activeChat.participants.filter(v => (v.id !== action.user.id ? v : null));
    return {...state, activeChat: {...state.activeChat, participants: newParticipans}};
};

const deleteMessage = (state, action) => {
    let messages = state.messages.filter(v => (v.id !== action.id ? v : null));
    return {...state, messages:messages};
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_MESSAGE:
            return addMessage(state, action);
        case actionTypes.SET_MESSAGES:
            return setMessages(state, action);
        case actionTypes.GET_CHATS_SUCCESS:
            return setChats(state, action);
        case actionTypes.SET_ACTIVE_CHAT:
            return setActiveChat(state, action);
        case actionTypes.SET_UPDATE_USER:
            return updateUser(state, action);
        case actionTypes.DELETE_USER:
            return deleteUser(state, action);
        case actionTypes.DELETE_MESSAGE:
            return deleteMessage(state, action);
        default:
            return state;
    }
};

export default reducer;
