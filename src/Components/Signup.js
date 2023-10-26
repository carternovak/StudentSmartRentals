import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useUserAuth } from "../context/UserAuthContext";
import { updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { ref } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const { signUp, verifyEmail } = useUserAuth();
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await signUp(email, password);
      await verifyEmail(userCredential.user);
      alert("Link has been sent to Email ID! Kindly verify using link and signIn!");
      const res = userCredential;
      console.log("User id: ", res.user.uid);
      const date = new Date().getTime();
      const storageRef = ref(storage, `${email.id + date}`);

      await updateProfile(res.user, {
        displayName: email,
      });

      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        email,
      });
      
      await setDoc(doc(db, "userChats", res.user.uid), {});
      
    } catch (err) {
      setError(err.message);
    }
    navigate("/enroll");
  };

  return (
    <>
      <div className="p-4 box">
        <h2 className="mb-3 text-center"> Signup </h2>
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
              Sign up
            </Button>
          </div>
        </Form>
      </div>
      <div className="p-4 box mt-3 text-center">
        Already have an account? <Link to="/">Log In</Link>
      </div>
    </>
  );
};

export default Signup;
