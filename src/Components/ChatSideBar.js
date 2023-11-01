import React from "react";
import ChatSearch from "./ChatSearch";
import Chats from "./Chats";

const ChatSideBar = () => {
    return (
        <>
            <div className="sidebar">
                <ChatSearch />
                <Chats />
            </div>
        </>
    )
}

export default ChatSideBar;