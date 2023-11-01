import React, { useState } from "react";
import { collection, query, where, getDocs, setDoc, doc, updateDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useUserAuth } from "../context/UserAuthContext";
import DefaultIcon from "../images/DefaultUser.svg";

const ChatSearch = () => {
    const[err, setErr] = useState(false);
    const[searchedUser, setSearchedUser] = useState(null);
    const[email, setEmail] = useState("");
    const { user } = useUserAuth();
    //console.log("Current user: ", currentUser);

    const handleSearch = async () => {
        console.log("Email: ", email);
        const q = query(
            collection(db, "users"),
            where("email", "==", email)
          );
        try {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => { 
                console.log("Doc: ", doc.data());
                setSearchedUser(doc.data());
            });

        } catch(err) {
            console.log("EREREORO");
            console.log(err);
        }
        console.log("Searched user: ", searchedUser);
    };

    const handleSelect = async () => {
        
        const combinedId = user.uid > searchedUser.uid ? user.uid + searchedUser.uid : searchedUser.uid + user.uid;
        try {
            const response = await getDoc(doc(db, "chats", combinedId));

            if(!response.exists()) {
                await setDoc(doc(db, "chats", combinedId), { messages: [] });

                await updateDoc(doc(db, "users", user.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: searchedUser.uid,
                        email: searchedUser.email,
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                });

                await updateDoc(doc(db, "users", searchedUser.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: searchedUser.uid,
                        email: searchedUser.email,
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                });

            }

        } catch(err) {
            setErr(err);
            console.log(err);
        }

        setSearchedUser(null);
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
            {searchedUser && (
                <div className="user-chat" onClick={handleSelect}>
                    <img src={searchedUser.imgUrl ? searchedUser.imgUrl : DefaultIcon} alt={searchedUser.email} />
                    <div className="user-chat-details">
                        <span>{searchedUser.email}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatSearch;
