import { Container, Row, Col } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import "./css/App.css";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import ProtectedRoute from "./Components/ProtectedRoute";
import { ChatContextProvider } from "./context/ChatContext";
import { UserAuthContextProvider } from "./context/UserAuthContext";
import PasswordReset from "./Components/PasswordReset";
import SellForm from "./Components/SellForm";
import Chat from "./Components/Chat"
import PhoneRegistration from "./Components/PhoneRegistration";
import UserProfilePage from "./Components/Users/UserProfile";

function App() {
  return (
    <Container>
      <Row>
        <Col>
          <UserAuthContextProvider>
            <Routes>
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Login />} />
              <Route
                path="/phonesignup"
                element={
                  <ProtectedRoute>
                    <PhoneRegistration />
                  </ProtectedRoute>
                }
              />
              <Route path="/signup" element={<Signup />} />
              <Route path="/enroll" element={<PhoneRegistration />} />
              <Route path="/passwordreset" element={<PasswordReset />} />
              <Route
                path="/sell"
                element={
                  <ProtectedRoute>
                    <SellForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chat"
                element={
                  
                  <ProtectedRoute>
                    <ChatContextProvider>
                      <Chat />
                    </ChatContextProvider>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <UserProfilePage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </UserAuthContextProvider>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
