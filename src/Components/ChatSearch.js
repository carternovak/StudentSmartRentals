import React, { useState, useContext } from "react";
import { collection, query, where, getDocs, setDoc, doc, updateDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useUserAuth } from "../context/UserAuthContext";
import DefaultIcon from "../images/DefaultUser.svg";

const ChatSearch = () => {
    const[err, setErr] = useState(false);
    const[user, setUser] = useState(null);
    const[email, setEmail] = useState("");
    const { currentUser } = useUserAuth();
    console.log("Current user: ", currentUser);

    const handleSearch = async () => {
        const query = query(collection(db, "users"), where("email", "==", email));

        try {
            const querySnapshot = await getDocs(query);
            querySnapshot.forEach((doc) => { 
                setUser(doc.data());
            });

        } catch(err) {
            console.log(err);
        }
    };

    const handleSelect = async () => {
        
        const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;
        try {
            const response = await getDoc(doc(db, "chats", combinedId));

            if(!response.exists()) {
                await setDoc(doc(db, "chats", combinedId), { messages: [] });

                await updateDoc(doc(db, "users", currentUser.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: user.uid,
                        email: user.email,
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                });

                await updateDoc(doc(db, "users", user.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: user.uid,
                        email: user.email,
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                });

            }

        } catch(err) {
            console.log(err);
        }

        setUser(null);
        setEmail("");
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className="search">
            <div className="search-input">
                <input 
                type="text" 
                placeholder="Search for a user" 
                onKeyDown={handleKeyPress}
                onChange={(e) => setEmail(e.target.value)} 
                value={email}
                />
            </div>
            {err && <span>Not found</span>}
            {user && (
                <div className="user-chat" onClick={handleSelect}>
                    <img src={user.imgUrl ? user.imgUrl : DefaultIcon} alt={user.email} />
                    <div className="user-chat-details">
                        <span>{user.email}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatSearch;
