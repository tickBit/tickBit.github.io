import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { deleteUser } from 'firebase/auth';
import { db, auth } from '../firebase';
import { ref, remove, query, orderByChild, equalTo, get } from "firebase/database";
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    
    const { currentUser, user } = useAuth()
    const [newpassword, setNewPassword] = React.useState("")
    const [currentpassword, setCurrentPassword] = React.useState("")
    const [message, setMessage] = React.useState("")
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [showAlert, setShowAlert] = React.useState(false);
        
    const navigate = useNavigate()
    
    function changePassword() {
        
        let newpw = document.getElementById("newPassword").value.trim()
        let currentpw = document.getElementById("currentPassword").value.trim()
        
        if (newpw.length < 6) {
            setMessage("Password should be at least 6 characters long.")
            setIsSuccess(false)
            setShowAlert(true)
            console.log(newpassword);
            return
        }
        
        if (newpw === currentpw) {
            setMessage("New password must be different from current password.")
            setIsSuccess(false)
            setShowAlert(true)
            return
        }
        
        const passwordEnteredByUser = currentpw;
        const credential = EmailAuthProvider.credential(
            user.email,
            passwordEnteredByUser
        );

        reauthenticateWithCredential(user, credential)
        .then((result) => {
            //Password entered is correct
            console.log(result)
        })
        .catch((error) => {
            //Incorrect password or some other error
            console.log(error)
            
            setMessage("The current password was wrong")
            setIsSuccess(false)
            setShowAlert(true)
            return;
        });
        
        // Call the updatePassword function from AuthContext
        updatePassword(user, newpw)
            .then(() => {
                setMessage("Password updated successfully.")
                setIsSuccess(true)
                setShowAlert(true)
                setNewPassword(newpw)
                setCurrentPassword(currentpw)
            })
            .catch((error) => {
                //console.error("Error updating password:", error)
                setMessage("Failed to update password: " + error.message)
                setIsSuccess(false)
                setShowAlert(true)
            })
            
        //navigate("/") // redirect to main page
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
        {showAlert && showAlert === true ? <>
            <div style={{textAlign: "center"}}>
            {isSuccess === false ?
            <div className="my-alerts">
            <div className="alert alert-danger" role="alert" style={{width: "55%"}}>
            {message}
            </div>
            </div>
            :
            <div className="my-alerts">
            <div className="alert alert-success" role="alert" style={{width: "55%"}}>
            {message}
            </div>
            </div>
            }
            </div>
            </>
        :
        <div style={{textAlign: "center"}}>
        <div className="alert alert-info" role="alert" style={{textAlign: "center", width: "55%"}}>
            Review your account
        </div>
        </div>
        }
        
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
