import React, { useState, useContext, useEffect } from "react";
import { useUserAuth } from "../context/UserAuthContext";
import { ChatContext } from "../context/ChatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import DefaultIcon from "../images/DefaultUser.svg";

const Chats = () => { 
    const [chats, setChats] = useState([]);
    console.log("User Auth: ", useUserAuth());
    const { currentUser } = useUserAuth();
    const { dispatch } = useContext(ChatContext);

    useEffect(() => {
        const getAllChats = () => {
            const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
                setChats(doc.data());
            });

            return () => {
                unsub();
            };
        };
        currentUser && getAllChats();
    }, [currentUser.uid]);

    const handleSelect = (chat) => {
        dispatch({type: "SELECT_CHAT", payload: chat});
    };

    return (
        <div className="chats">
            {Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map((chat) => (
                <div 
                    className="user-chat"
                    key={chat[0]}
                    onClick={() => handleSelect(chat[1].userInfo)}
                >
                    <img src={DefaultIcon} alt="user" className="user-image" />
                    <span>{chat[1].userInfo.email}</span>
                </div>
                
            ))}
        </div>
    );
}

export default Chats;