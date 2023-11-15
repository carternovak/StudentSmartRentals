import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import { Button } from "react-bootstrap";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { useUserAuth } from "../context/UserAuthContext";
import {
  multiFactor,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
} from "firebase/auth";
import "../css/PhoneSignup.css";
import { auth } from "../firebase";

const PhoneRegistration = () => {
  const [error, setError] = useState("");
  const [number, setNumber] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [flag, setFlag] = useState(false);
  const { user } = useUserAuth();
  const [otp, setOtp] = useState("");
  const { setUpRecaptha } = useUserAuth();
  const navigate = useNavigate();

  const enrollUser = async (e) => {
    e.preventDefault();
    setError("");
    if (number === "" || number === undefined) {
      return setError("Please enter a valid phone number!");
    }

    const multiFactorSession = await multiFactor(user).getSession();
    const phoneOpts = {
      phoneNumber: number,
      session: multiFactorSession,
    };
    const phoneAuthProvider = new PhoneAuthProvider(auth);
    const verifier = await setUpRecaptha();
    const newVerificationId = await phoneAuthProvider.verifyPhoneNumber(
      phoneOpts,
      verifier
    );

    setVerificationId(newVerificationId);
    alert("SMS Text Sent!");
    setFlag(true);
  };

  const verifyUser = async (e) => {
    e.preventDefault();
    setError("");
    const cred = PhoneAuthProvider.credential(verificationId, otp);
    const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
    await multiFactor(user).enroll(multiFactorAssertion, number);
    navigate("/");
  };

  return (
    <div className="auth_container">
      <div className="p-4 box auth">
        <h2 className="mb-3">2FA Enrollment</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form
          onSubmit={enrollUser}
          style={{ display: !flag ? "block" : "none" }}
        >
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <PhoneInput
              defaultCountry="US"
              value={number}
              onChange={setNumber}
              placeholder="Enter Phone Number"
            />
            <div id="recaptcha-container"></div>
          </Form.Group>
          <div className="button-right">
            <Link to="/">
              <Button variant="secondary">Cancel</Button>
            </Link>
            &nbsp;
            <Button type="submit" variant="primary">
              Send Verification Code
            </Button>
          </div>
        </Form>

        <Form
          onSubmit={verifyUser}
          style={{ display: flag ? "block" : "none" }}
        >
          <Form.Group className="mb-3" controlId="formBasicOtp">
            <Form.Control
              type="otp"
              placeholder="Enter OTP"
              onChange={(e) => setOtp(e.target.value)}
            />
          </Form.Group>
          <div className="button-right">
            <Link to="/">
              <Button variant="secondary">Cancel</Button>
            </Link>
            &nbsp;
            <Button type="submit" variant="primary">
              Verify
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default PhoneRegistration;
