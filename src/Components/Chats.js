import React, { useState, useContext, useEffect } from "react";
import { useUserAuth } from "../context/UserAuthContext";
import { ChatContext } from "../context/ChatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import DefaultIcon from "../images/DefaultUser.svg";
import "../css/Chat.css"

const Chats = () => { 
    const [chats, setChats] = useState([]);
    const [uid, setUid] = useState("");
    const { user } = useUserAuth();
    console.log("User: ", user);
    const { dispatch } = useContext(ChatContext);

    useEffect(() => {
        setUid(user.uid);
        console.log("User UID: ", uid);
        const getAllChats = () => {
            if(user.uid) {
                const unsub = onSnapshot(doc(db, "userChats", user.uid), (doc) => {
                    console.log("Chats: ", chats);
                    setChats(doc.data());
                });

                return () => {
                    unsub();
                };
            }
        };
        if(user.uid) {
            getAllChats();
        }
    }, [user.uid, chats, uid]);

    const handleSelect = (chat) => {
        dispatch({type: "SELECT_CHAT", payload: chat});
    };

    return (
        <div className="chat-users">
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