import React from "react";
import { useContext, useEffect, useRef, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { useUserAuth } from "../context/UserAuthContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import DefaultIcon from "../images/DefaultUser.svg";


const Message = ({ message }) => {
  const { user } = useUserAuth();
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const GetMessageTime = (message) => {
    const seconds = message?.date?.seconds;
    const nanoseconds = message?.date?.nanoseconds;
    const date = new Date(seconds * 1000 + nanoseconds / 1000000);
    var hours = date.getHours();
    const minutes = date.getMinutes();
    if(hours > 12) {
      hours -= 12;
      return `${hours}:${minutes} PM`;
    }
    return `${hours}:${minutes}`;
  }

  return (
    <div className={`message-container ${message.senderId === user.uid && "owner"}`}>
      <div
        ref={ref}
        className={`message ${message.senderId === user.uid && "msg-owner"}`}
      >
      
        <div className="messageInfo">
          <img
            src={
              message.senderId === user.uid
                ? /*user.photoURL*/ DefaultIcon
                : /*data.user.photoURL*/ DefaultIcon
            }
            alt=""
          />
        </div>
        <div className="messageContent">
          <p>{message.formInput}</p>
          {message.img && <img src={message.img} alt="" />}
        </div>
      </div>
      <span className="timestamp">{GetMessageTime(message)}</span>
    </div>
  );
};

const ChatMessages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);

  return (
    <div className="messages">
      {messages.map((m) => (
        <Message message={m} key={m.id} />
      ))}
    </div>
  );
};

export default ChatMessages;