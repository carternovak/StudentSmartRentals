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
    const { dispatch } = useContext(ChatContext);
    const [currChat, setCurrChat] = useState({});

    useEffect(() => {
        setUid(user.uid);
        const getAllChats = () => {
            if(user.uid) {
                const unsub = onSnapshot(doc(db, "userChats", user.uid), (doc) => {
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

    const handleSelect = (u) => {
        setCurrChat(u);
        dispatch({type: "CHANGE_USER", payload: u});
        console.log(currChat);
    };


    return (
        <div className="chat-users">
            {Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map((chat) => (
                chat[1].userInfo.email !== user.email &&
                (<div 
                    className={`user-chat${currChat.email === chat[1].userInfo.email ? " selected-chat" : ""}`}
                    key={chat[0]}
                    onClick={() => handleSelect(chat[1].userInfo)}
                >
                    <img src={DefaultIcon} alt="user" className="user-image" />
                    <span>{chat[1].userInfo.email}</span>
                </div>)
                
            ))}
        </div>
    );
}

export default Chats;