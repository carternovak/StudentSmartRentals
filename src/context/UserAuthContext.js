import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  //PhoneAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  RecaptchaVerifier,
  //signInWithPhoneNumber,
  sendPasswordResetEmail,
  //signInWithCredential,
} from "firebase/auth";
import { auth } from "../firebase";

const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState({});

  function logIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }
  function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }
  function logOut() {
    return signOut(auth); 
  }
  function googleSignIn() {
    const googleAuthProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleAuthProvider);
  }
  function verifyEmail() {
    return sendEmailVerification(auth.currentUser);
  }

  function setUpRecaptha() {
    const recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {}
    );
    recaptchaVerifier.render();
    return recaptchaVerifier;
  }

  function passwordResetEmail(emailId) {
    return sendPasswordResetEmail(auth, emailId);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      setUser(currentuser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <userAuthContext.Provider
      value={{
        user,
        logIn,
        signUp,
        logOut,
        googleSignIn,
        verifyEmail,
        setUpRecaptha,
        passwordResetEmail,
      }}
    >
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}
