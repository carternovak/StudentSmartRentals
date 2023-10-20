import React, {useState, useRef, useEffect} from "react";
import { useUserAuth } from "../context/UserAuthContext";
import Nav from "./Nav";
import DefaultUser from "../images/DefaultUser.svg";
import SendIcon from '../images/SendIcon.svg'
import "../css/Chat.css";

const Chat = () => {
    const dummy = useRef();
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [formInput, setFormInput] = useState("");
    const { user } = useUserAuth();
    console.log("Check user in Private: ", user);

    function ChatMessage(props) {
        const {text, uid} = props.message;
        return uid === user.uid ? <p className="user-msg">{text}</p> :<p className="msg">{text}</p>;
    }

    function User(props) {
        const {uid, imgUrl, name} = props.user;
        console.log(imgUrl.DefaultUser);
        return <img src={imgUrl.DefaultUser} className="user-image" alt={name} />
    }

    const sendMessage = (e) => {
        e.preventDefault();
        const {uid} = user;
        const text = e.target.value;
        const message = {
            id: messages[messages.length - 1].id + 1,
            text: formInput,
            uid
        };
        setMessages([...messages, message]);
        console.log("Messages array: ", messages);
        setFormInput("");
        dummy.current.scrollIntoView({ behavior: "smooth" });
    }

    // Dummy data for users
    useEffect(() => {
        setUsers([
            { uid: 1, name: "User 1", imgUrl: {DefaultUser} },
            { uid: 2, name: "User 2", imgUrl: {DefaultUser} },
            { uid: 3, name: "User 3", imgUrl: {DefaultUser} },
        ]);
    }, []);

    // Dummy data for messages
    useEffect(() => {
        setMessages([
            { id: 1, text: "Hello", uid: "test" },
            { id: 2, text: "how are you?", uid: "test" },
        ]);
    }, []);

    function sendFakeMessage() {
        const uid = String(Math.floor(Math.random() * 10));
        const text = "This is a fake message";
        const message = {
            id: messages[messages.length - 1].id + 1,
            text: text,
            uid: uid
        };
        
        setMessages([...messages, message]);
        console.log("Messages array: ", messages);
        dummy.current.scrollIntoView({ behavior: "smooth" });
    }



    return (
        <>
            <Nav />
            <div className="chat-container">
                
                <div className="chat-users">
                    {users && users.map(user => <User key={user.uid} user={user} />)}
                </div>
                <div className="chat-box">
                <h1>Chat</h1>
                    <div className="chat">
                        
                        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
                        <span id="scroll-spot" ref={dummy}></span>
                    </div>
                    <div className="chat-input-box">
                        <form onSubmit={sendMessage}>
                            <input className="chat-input" onChange={(e) => setFormInput(e.target.value)} value={formInput} placeholder="Enter your message..." type="text" />
                            <button type="submit" className="send-button" disabled={!formInput} ><img className="send-icon" alt="Send Message" src={SendIcon} /></button>
                        </form>
                    </div>
                </div>
            </div>
            {/* <button onClick={sendFakeMessage}>Debug: Send message from other person</button> */}
        </>
    );
}

export default Chat;