import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import { Button } from "react-bootstrap";
import "react-phone-number-input/style.css";
import { PhoneAuthProvider, PhoneMultiFactorGenerator } from 'firebase/auth';
import "../css/PhoneSignup.css";

const MultiFactorLogin = (props) => {
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const [resolver] = useState(props.resolver);
  const [verificationId] = useState(props.verificationId);
  const navigate = useNavigate();

  const verifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    const cred = PhoneAuthProvider.credential(verificationId, otp);
    const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
    await resolver.resolveSignIn(multiFactorAssertion);
    navigate("/home");
  }

  return (
    <>
      <div className="auth_container">
        <div className="p-4 box auth">
          <h2 className="mb-3">Firebase Phone Auth</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={verifyOtp}>
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
    </>
  );
};

export default MultiFactorLogin;
