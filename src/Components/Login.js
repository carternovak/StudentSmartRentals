import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import { Button } from "react-bootstrap";
import GoogleButton from "react-google-button";
import { useUserAuth } from "../context/UserAuthContext";
import { getMultiFactorResolver, PhoneAuthProvider } from "firebase/auth";
import "../css/Login.css";
import MultiFactorLogin from "./MultiFactorLogin";
import { auth, db } from "../firebase";
import { updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [resolver, setResolver] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const { logIn, googleSignIn, setUpRecaptha, user } = useUserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (user !== null) {
      navigate("/");
    } else {
      logIn(email, password)
        .then(function (userCredential) {
          navigate("/");
        })
        .catch(async function (error) {
          if (error.code === "auth/multi-factor-auth-required") {
            const newResolver = await getMultiFactorResolver(auth, error);
            setResolver(newResolver);
            const phoneInfoOptions = {
              multiFactorHint: newResolver.hints[0],
              session: newResolver.session,
            };
            const phoneAuthProvider = new PhoneAuthProvider(auth);
            // Send SMS verification code
            const verifier = await setUpRecaptha();

            const newVerificationId = await phoneAuthProvider.verifyPhoneNumber(
              phoneInfoOptions,
              verifier
            );
            setVerificationId(newVerificationId);
            setIsVerifying(true);
          } else if (error.code === "auth/invalid-login-credentials") {
            setError(
              "Invalid Login Credentials. Please re-enter your email and password."
            );
          } else if (error.code === "auth/user-not-found") {
            setError(
              "User not found. Please re-enter your email and password."
            );
          } else if (error.code === "auth/too-many-requests") {
            setError("Too many failed attempts. Please try again later.");
          }
        });
    }
  };

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await googleSignIn();

      const res = userCredential;

      const userDocRef = doc(db, "users", res.user.uid);
      const docSnapshot = await getDoc(userDocRef);

      if (!docSnapshot.exists()) {
        // Set user data in Firestore only if the document doesn't exist
        await updateProfile(res.user, {
          email: email,
        });
        await setDoc(userDocRef, {
          uid: res.user.uid,
          email: res.user.email,
          phone: res.user.phoneNumber ? res.user.phoneNumber : "",
          displayName: res.user.displayName ? res.user.displayName : "",
          dob: "",
          role: "user",
        });
      }

      await setDoc(doc(db, "userChats", res.user.uid), {});
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <div className="login_container">
        {!isVerifying ? (
          <div className="login">
            <div className="p-4 box">
              <h2 className="mb-5 text-center">Log In</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Control
                    type="email"
                    placeholder="Email address"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button variant="primary" type="Submit">
                    Log In
                  </Button>
                </div>
              </Form>
              <hr />
              <div>
                <GoogleButton
                  className="g-btn"
                  type="dark"
                  onClick={handleGoogleSignIn}
                />
              </div>
            </div>
            <div className="p-4 box mt-3 text-center">
              Don't have an account? <Link to="/signup">Sign up</Link>
            </div>
            <div className="p-4 box mt-3 text-center">
              Forgot Password? <Link to="/passwordreset">Reset Password</Link>
            </div>
          </div>
        ) : (
          <MultiFactorLogin
            resolver={resolver}
            verificationId={verificationId}
          />
        )}
        <div id={isVerifying && "hide-captcha" ? "hide-captcha" : ""}>
          <div id="recaptcha-container"></div>
        </div>
      </div>
    </>
  );
};

export default Login;
