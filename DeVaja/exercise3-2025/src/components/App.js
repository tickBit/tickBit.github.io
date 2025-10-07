import React from "react"
import Main from "./Main"
import Signup from "./Signup"
import { AuthProvider } from "../contexts/AuthContext"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Login from "./Login"
import Profile from "./Profile"
import ForgotPassword from "./ForgotPassword"

function App() {
  return (
      <div>
        <Router>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Routes>
          </AuthProvider>
        </Router>
      </div>
  )
}

export default App
