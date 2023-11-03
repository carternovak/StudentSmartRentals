import React, { useState } from "react";
import { collection, query, where, getDocs, setDoc, doc, updateDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useUserAuth } from "../context/UserAuthContext";
import DefaultIcon from "../images/DefaultUser.svg";
import SearchIcon from "../images/SearchIcon.svg";

const ChatSearch = () => {
    const[err, setErr] = useState(false);
    const[searchedUser, setSearchedUser] = useState(null);
    const[email, setEmail] = useState("");
    const { user } = useUserAuth();

    const handleSearch = async () => {
        var foundUser = false;
        const q = query(
            collection(db, "users"),
            where("email", "==", email)
          );
        try {
            
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach((doc) => { 
                console.log("Doc: ", doc.data());
                foundUser = true;
                setErr(false);
                setSearchedUser(doc.data());
            });

        } catch(err) {
            setErr(true);
            console.log("Is erroring: ", err);
            console.error(err);
        }
        if(!foundUser) {
            setErr(true);
            setSearchedUser(null);
        }
    };

    const handleSelect = async () => {
        
        const combinedId = user.uid > searchedUser.uid ? user.uid + searchedUser.uid : searchedUser.uid + user.uid;
        try {
            const response = await getDoc(doc(db, "chats", combinedId));
            if(!response.exists()) {
                await setDoc(doc(db, "chats", combinedId), { messages: [] });


                await updateDoc(doc(db, "userChats", user.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: searchedUser.uid,
                        email: searchedUser.email,
                        displayName: searchedUser.displayName? searchedUser.displayName : "",
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                });

                await updateDoc(doc(db, "userChats", searchedUser.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName? user.displayName : "",
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                });

            }

        } catch(err) {
            setErr(true);
            console.log(err);
        }
        
        setSearchedUser(null);
        setEmail("");
    };

    const handleKeyPress = (e) => {
        setErr(false);
        e.code === "Enter" && handleSearch();
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
                id="form1"
                className="form-control"
                />
                <button type="button" onClick={handleSearch} class="btn btn-primary search-button">
                    <img src={SearchIcon} alt="" />
                </button>
            </div>
            {err && (
                <div className="chat-users selected-chat">
                    <div className="user-chat" >
                        <img src={DefaultIcon} alt={"Invalid User"} />
                        <div className="details">
                            <span>User not found</span>
                        </div>
                    </div>
                </div>
            )}
            {searchedUser && (
                <div className="chat-users selected-chat">
                    <div className="user-chat" onClick={handleSelect}>
                        <img src={searchedUser.imgUrl ? searchedUser.imgUrl : DefaultIcon} alt={searchedUser.email} />
                        <div className="details">
                            <span>{searchedUser.email}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatSearch;
