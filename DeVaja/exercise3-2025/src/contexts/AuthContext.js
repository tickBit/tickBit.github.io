import React, { useContext, useState, useEffect } from "react";
import { auth } from "../firebase";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateEmail as fbUpdateEmail,
  updatePassword as fbUpdatePassword,
  onAuthStateChanged,
} from "firebase/auth";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auth-funktiot
  function signup(email, password) {
    // Tämä palauttaa Promise<UserCredential>
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function updateEmail(email) {
    if (!currentUser) return Promise.reject(new Error("No current user"));
    return fbUpdateEmail(currentUser, email);
  }

  function updatePassword(password) {
    if (!currentUser) return Promise.reject(new Error("No current user"));
    return fbUpdatePassword(currentUser, password);
  }

  // Auth-state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {

      if (user) setCurrentUser(user.email); else setCurrentUser(null);
      
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
