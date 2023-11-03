import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useUserAuth } from "../context/UserAuthContext";
import { updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { ref } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import "../css/Login.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const { signUp, verifyEmail } = useUserAuth();
  const [selectedRole, setSelectedRole] = useState('user');
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(email.trim() === '' && password.trim() === '') {
        throw new Error("Please enter an email and password!");
      } else if (email.trim() === '') {
        throw new Error("Email cannot be empty!");
      } else if (password.trim() === '') {
        throw new Error("Password cannot be empty!");
      }
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
        email: res.user.email,
        phone: res.user.phoneNumber ? res.user.phoneNumber : "",
        displayName: res.user.displayName ? res.user.displayName : "",
        dob: "",
        role: selectedRole,
      });

      await setDoc(doc(db, "userChats", res.user.uid), {});

      navigate("/enroll");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSelectChange = (event) => {
    setSelectedRole(event.target.value);
  };

  return (
    <>
      <div className="login_container">
        <div className="login">
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
              <div>
                <label className="role-label">Please select your role: </label>
                <select className="form-select role-select" value={selectedRole} onChange={handleSelectChange}>
                  <option value="user">Renter</option>
                  <option value="owner">Property Owner</option>
                </select>
              </div>
              <div className="d-grid gap-2">
                <Button variant="primary" type="Submit">
                  Sign up
                </Button>
              </div>
            </Form>
          </div>
          <div className="p-4 box mt-3 text-center login">
            Already have an account? <Link to="/">Log In</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
