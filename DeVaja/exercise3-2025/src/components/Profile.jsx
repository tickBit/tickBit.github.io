import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { updatePassword } from 'firebase/auth';
import { deleteUser } from 'firebase/auth';
import { db, auth } from '../firebase';
import { ref, remove, query, orderByChild, equalTo, get } from "firebase/database";
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    
    const { currentUser } = useAuth()
    const [newpassword, setNewPassword] = React.useState("")
    const [currentpassword, setCurrentPassword] = React.useState("")
    
    const navigate = useNavigate()
    
    function changePassword() {
        
        setNewPassword(document.getElementById("newPassword").value)
        setCurrentPassword(document.getElementById("currentPassword").value)
        
        if (newpassword.length < 6) {
            alert("Password should be at least 6 characters long.")
            return
        }
        
        if (newpassword === currentpassword) {
            alert("New password must be different from current password.")
            return
        }
        
        // Call the updatePassword function from AuthContext
        updatePassword(newpassword)
            .then(() => {
                alert("Password updated successfully.")
                setNewPassword("")
                setCurrentPassword("")
            })
            .catch((error) => {
                console.error("Error updating password:", error)
                alert("Failed to update password: " + error.message)
            })
            
        navigate("/") // redirect to main page
    }
    
    function deleteAccount() {
    
        if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.\nYour emojis will be deleted, too")) {
            return
        }
        
        // delete user's emojis from database, each emoji under "users" node has author field with user's email
        const emojisRef = ref(db, 'users/');
        const q = query(emojisRef, orderByChild('author'), equalTo(currentUser));
        get(q).then((snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach((child) => {
                remove(ref(db, `users/${child.key}`)); // Only remove this emoji
            });
        }
        }).catch((error) => {
            console.error("Error deleting user's emojis:", error);
        });
        
        const user = auth.currentUser;
        deleteUser(user).then(() => {
            alert("Account deleted successfully.")
        }).catch((error) => {
            console.error("Error deleting account:", error)
            alert("Failed to delete account: " + error.message)
        });
        
        navigate("/") // redirect to main page
    }
    
  return (
    <div>
        <h2 style={{textAlign: "center"}}>Profile</h2>
        <p style={{textAlign: "center"}}>Logged in as: {currentUser}</p>
        <div style={{textAlign: "center", marginTop: "2rem"}}>
        <input type="password" placeholder='Current password' width="8em" style={{marginTop: "1rem", paddingInline: "4em"}} id="currentPassword" />
        <br />
        <input type="password" placeholder='New password' style={{marginTop: "1rem", paddingInline: "4em"}} id="newPassword" />
        <br />
        <button className="btn btn-primary" onClick={() => changePassword()} style={{marginTop: "1rem"}}>Change password</button>
        <hr />
        <button className="btn btn-danger" style={{marginTop: "1rem"}} onClick={() => deleteAccount()}>Delete account</button>
        </div>
    </div>
  )
}
