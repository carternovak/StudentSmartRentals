import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, setDoc, doc, updateDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useUserAuth } from "../context/UserAuthContext";
import DefaultIcon from "../images/DefaultUser.svg";
import SearchIcon from "../images/SearchIcon.svg";

const ChatSearch = () => {
    const [err, setErr] = useState(false);
    const [searchedUsers, setSearchedUsers] = useState([]);
    const [email, setEmail] = useState("");
    const { user } = useUserAuth();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (email.length > 0) {
                handleSearch();
            } else {
                setSearchedUsers([]);
            }
        }, 300); // Adjust the debounce time as needed

        return () => clearTimeout(timer);
    }, [email]); // Run the effect when the email changes

    const handleSearch = async () => {
        const users = [];
        const q = query(
            collection(db, "users"),
            where("email", ">=", email.toLowerCase()),
            where("email", "<=", email.toLowerCase() + "\uf8ff")
        );

        try {
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach((doc) => {
                console.log("Doc: ", doc.data());
                users.push(doc.data());
            });

            setSearchedUsers(users);
            setErr(users.length === 0);
        } catch (err) {
            setErr(true);
            console.error(err);
        }
    };

    const handleSelect = async (selectedUser) => {
        const combinedId = user.uid > selectedUser.uid ? user.uid + selectedUser.uid : selectedUser.uid + user.uid;

        try {
            const response = await getDoc(doc(db, "chats", combinedId));
            if (!response.exists()) {
                await setDoc(doc(db, "chats", combinedId), { messages: [] });

                await updateDoc(doc(db, "userChats", user.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: selectedUser.uid,
                        email: selectedUser.email,
                        displayName: selectedUser.displayName ? selectedUser.displayName : "",
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                });

                await updateDoc(doc(db, "userChats", selectedUser.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName ? user.displayName : "",
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                });
            }
        } catch (err) {
            setErr(true);
            console.log(err);
        }

        setSearchedUsers([]);
        setEmail("");
    };

    return (
        <div className="search">
            <div className="search-input">
                <input
                    type="text"
                    placeholder="Search for a user by email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    id="form1"
                    className="form-control"
                />
                <button type="button" onClick={handleSearch} className="btn btn-primary search-button">
                    <img src={SearchIcon} alt="" />
                </button>
            </div>
            <div className={`search-results ${searchedUsers.length > 0 ? 'active' : ''}`}>
                {err && (
                    <div className="chat-users searched-chat">
                        <div className="user-chat">
                            <img src={DefaultIcon} alt={"Invalid User"} />
                            <div className="details">
                                <span>No users found</span>
                            </div>
                        </div>
                    </div>
                )}
                {searchedUsers.map((chatUser) => (
                    chatUser.email !== user.email &&
                    (<div key={chatUser.uid} className="chat-users searched-chat">
                        <div className="user-chat" onClick={() => handleSelect(chatUser)}>
                            <img src={chatUser.imgUrl ? chatUser.imgUrl : DefaultIcon} alt={chatUser.email} />
                            <div className="details">
                                <span>{chatUser.email}</span>
                            </div>
                        </div>
                    </div>)
                ))}
            </div>
        </div>
    );
};

export default ChatSearch;
