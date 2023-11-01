import { createContext, useReducer } from "react";
import { useUserAuth } from "./UserAuthContext";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
    const { user } = useUserAuth();
    console.log("Current chat user: ", user);
    const INIT_STATE = {
        chatId: "null",
        user: {},
    }

    const chatReducer = (state, action) => {
        switch(action.type) {
            case "SELECT_CHAT":
                return {
                    user: action.payload,
                    chatId: user.uid > action.payload.uid ? user.uid + action.payload.uid : action.payload.uid + user.uid,
                };
            default:
                return state;
        }
    };

    const [state, dispatch] = useReducer(chatReducer, INIT_STATE);

    return (
        <ChatContext.Provider value={{ data:state, dispatch }}>
            {children}
        </ChatContext.Provider>
    );
};