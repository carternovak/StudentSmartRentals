import React, {useState, useRef, useEffect} from "react";
import { useUserAuth } from "../context/UserAuthContext";
import Nav from "./Nav";
import ChatSearch from "./ChatSearch";
import DefaultUser from "../images/DefaultUser.svg";
import SendIcon from '../images/SendIcon.svg'
import { getFirestore, collection } from "firebase/firestore";
import app from "../firebase";
import { useCollectionData } from 'react-firebase-hooks/firestore';
import Chats from "./Chats";
import "../css/Chat.css";

const Chat = () => {

    //initializeApp(app);
    const firestore = getFirestore(app);
    //const messagesRef = firestore.collection('messages');
    // const query = messagesRef.orderBy('createdAt').limit(25);

    // const [newMessages] = useCollectionData(query, { idField: 'id' });


    const dummy = useRef();
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [chats, setChats] = useState([{
        messages: [],
        userIds: [users]
    }]);
    const [selectedChat, setSelectedChat] = useState({
        messages: [],
        userIds: []
    });
    const [formInput, setFormInput] = useState("");
    const { user } = useUserAuth();
    const[test] = useCollectionData();

    function ChatMessage(props) {
        const {text, uid} = props.message;
        return uid === user.uid ? <p className="user-msg">{text}</p> :<p className="msg">{text}</p>;
    }

    function User(props) {
        const { uid, imgUrl, name } = props.user;

        // Modify the changeChat function to update the selected chat
        function changeChat() {
            const newSelectedChat = chats.find(chat => chat.userIds.includes(uid));
            setSelectedChat(newSelectedChat);
        }

        return (
            <img src={imgUrl.DefaultUser} className='user-image'  alt={name} onClick={changeChat} />
        );
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
        selectedChat.messages.push(message);
        setFormInput("");
        dummy.current.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        if (selectedChat !== undefined) {
            setMessages(selectedChat.messages);
        } else {
            setMessages([]);
        }
    }, [selectedChat]);

    // Dummy data for users
    useEffect(() => {
        setUsers([
            { uid: "test", name: "User 1", imgUrl: {DefaultUser} },
            { uid: "test2", name: "User 2", imgUrl: {DefaultUser} },
            { uid: "test3", name: "User 3", imgUrl: {DefaultUser} },
        ]);
    }, []);

    // Dummy data for messages
    useEffect(() => {
        setMessages([
            { id: 1, text: "Hello", uid: "test" },
            { id: 2, text: "how are you?", uid: "test" },
        ]);
    }, []);

    useEffect(() => {
        setChats([
            {
                messages: [
                    { id: 1, text: "Hello", uid: "test" },
                    { id: 2, text: "how are you?", uid: "test" },
                ],
                userIds: [user.uid, "test"],
            },
            {
                messages: [
                    { id: 1, text: "Hey there!", uid: "test2" },
                    { id: 2, text: "I'm doing well, how about you?", uid: "test2" },
                ],
                userIds: [user.uid, "test2"],
            },
            {
                messages: [
                    { id: 1, text: "Hey there!", uid: "test3" },
                    { id: 2, text: "I'm doing well, how about you?", uid: "test3" },
                    { id: 3, text: "That's great to hear!", uid: "test" },
                    { id: 4, text: "I just got back from a nice vacation.", uid: "test" },
                    { id: 5, text: "Sounds amazing! Where did you go?", uid: "test3" },
                ],
                userIds: [user.uid, "test3"],
            },
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
                    <ChatSearch />
                    <Chats />
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
            <button onClick={sendFakeMessage}>Debug: Send message from other person</button>
        </>
    );
}

export default Chat;