import React, { useContext } from "react";
import Nav from "./Nav";
import { ChatContext } from "../context/ChatContext";
import "../css/Chat.css";
import { Helmet } from "react-helmet";
import UserChat from "./UserChat";
import ChatSideBar from "./ChatSideBar";

const Chat = () => {
    const { data } = useContext(ChatContext);
    console.log("Data: ", data);
    
    return (
        <>
            <Helmet>
            <title>Chat | StudentSmart Rentals</title>
            </Helmet>
            <Nav />
            <div className="chat-container">
                <ChatSideBar />
                <UserChat />
            </div>
        </>
    );
}

export default Chat;