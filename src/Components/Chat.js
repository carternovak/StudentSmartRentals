import React from "react";
import Nav from "./Nav";
import "../css/Chat.css";
import { Helmet } from "react-helmet";
import UserChat from "./UserChat";
import ChatSideBar from "./ChatSideBar";

const Chat = () => {
    
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