import React, {useState, useRef, useContext} from "react";
import { useUserAuth } from "../context/UserAuthContext";
import SendIcon from '../images/SendIcon.svg'
import { serverTimestamp, Timestamp } from "firebase/firestore";
import { ChatContext } from "../context/ChatContext";
import "../css/Chat.css";
import ChatMessages from "./ChatMessages";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";
import { v4 as uuid } from "uuid";

const Chat = () => {
    const { data } = useContext(ChatContext);
    const { user } = useUserAuth();
    const dummy = useRef();
    const [formInput, setFormInput] = useState("");

    const sendMessage = async (e) => {
        e.preventDefault();
        try {
            await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion({
                id: uuid(),
                formInput,
                senderId: user.uid,
                date: Timestamp.now(),
                }),
            });
        
            await updateDoc(doc(db, "userChats", user.uid), {
            [data.chatId + ".lastMessage"]: {
                formInput,
            },
            [data.chatId + ".date"]: serverTimestamp(),
            });
        
            await updateDoc(doc(db, "userChats", data.user.uid), {
            [data.chatId + ".lastMessage"]: {
                formInput,
            },
            [data.chatId + ".date"]: serverTimestamp(),
            });
        } catch(err) {
            console.error(err);
        }
        setFormInput("");
      };

    return (
        <>
            <div className="chat-box">
                <h1> {data.user?.displayName ? data.user.displayName : data.user.email}</h1>
                <div className="chat">
                    {data.user.email !== undefined && <ChatMessages/> ? <ChatMessages/> : <div className="no-chat-selected"><h2 style={{textAlign:"center"}}>Select a chat to start messaging</h2></div>}
                    <span id="scroll-spot" ref={dummy}></span>
                </div>
                <div className="chat-input-box">
                    <form onSubmit={sendMessage}>
                        <input className="chat-input" onChange={(e) => setFormInput(e.target.value)} value={formInput} placeholder="Enter your message..." type="text" />
                        <button type="submit" className="send-button" disabled={!formInput} ><img className="send-icon" alt="Send Message" src={SendIcon} /></button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Chat;