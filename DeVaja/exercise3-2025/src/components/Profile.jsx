import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { deleteUser } from 'firebase/auth';
import { db, auth } from '../firebase';
import { ref, remove, query, orderByChild, equalTo, get } from "firebase/database";
import { useNavigate } from 'react-router-dom';
import MyOKPrompt from './MyOKPrompt';
import MyConfirm from './MyConfirm';
import Header from './Header';

export default function Profile() {
    
    const { currentUser, user } = useAuth()
    const [newpassword, setNewPassword] = React.useState("")
    const [currentpassword, setCurrentPassword] = React.useState("")
    const [message, setMessage] = React.useState("")
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [showAlert, setShowAlert] = React.useState(false);
    const [isReAuth, setIsReAuth] = React.useState(false);
    const [isOKPromptOpen, setIsOKPromptOpen] = React.useState(false)
    const [isConfirmOpen, setIsConfirmOpen] = React.useState(false)
    const [promptContent, setPromptContent] = React.useState({})
    
    const navigate = useNavigate();
    
    const handleOKClose = () => {
        setIsOKPromptOpen(false);
    };
    
    const deleteAccount = () => {
        setPromptContent({ title: "Confirm", content: "Are you sure you want to delete your account? This action cannot be undone.\nYour emojis will be deleted, too." });
        setIsConfirmOpen(true);
    };
    
    const handleConfirmYes = async () => {
        setIsConfirmOpen(false);
        
        handleDeleteAccount();
    };

    const handleConfirmNo = () => {
        setIsConfirmOpen(false);
    };
  
    async function changePassword() {
        
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
    
        setIsReAuth(false);
            
        const passwordEnteredByUser = currentpw;
        const credential = EmailAuthProvider.credential(
            user.email,
            passwordEnteredByUser
        );

        await reauthenticateWithCredential(user, credential)
        .then((result) => {
            //Password entered is correct
            console.log("result")
            console.log(result)
            
            // Call the updatePassword function from AuthContext
            updatePassword(user, newpw)
                    .then(() => {
                        setMessage("Password updated successfully.")
                        setIsSuccess(true)
                        setShowAlert(true)
                        setNewPassword("")
                        setCurrentPassword("")
                        currentpw = ""
                        newpw = ""
                        setCurrentPassword("")
                        setNewPassword("")
                        return
                    })
                    .catch((error) => {
                        //console.error("Error updating password:", error)
                        setMessage("Failed to update password: " + error.message)
                        setIsSuccess(false)
                        setShowAlert(true)
                        
                        currentpw = ""
                        newpw = ""
                        setCurrentPassword("")
                        setNewPassword("")
                        return;
                    })
            
        })
        .catch((error) => {
            //Incorrect password or some other error
            console.log("error")
            console.log(error)
            setIsReAuth(true)
            setMessage("The current password was wrong")
            setIsSuccess(false)
            setShowAlert(true)
            return;
        });
            
        // navigate("/") // redirect to main page
    }
    
const handleDeleteAccount = async () => {
  try {
    const userEmail = currentUser;
    console.log("Deleting account for:", userEmail);
    // 1. Poista kaikki tämän käyttäjän emojit 'author' emailin perusteella:
    const usersSnap = await get(ref(db, 'users'));
    if (usersSnap.exists()) {
        const removals = [];
        usersSnap.forEach(child => {
        const val = child.val();
        if (val && val.author === userEmail) {
            removals.push(remove(ref(db, `users/${child.key}`)));
        }
    });
    await Promise.all(removals);
    }


    // 2. Poista auth-tunnus
    await deleteUser(user);

    setPromptContent({ title: "Account deleted", content: "All your emojis are also deleted." });
    setIsOKPromptOpen(true);
//    navigate("/");
  } catch (error) {
    console.error(error);
  }
};

    
  return (
    <div>
        <Header main={true} />
        <MyOKPrompt 
                isOpen={isOKPromptOpen}
                content={promptContent}
                onClose={handleOKClose}
            />
        <MyConfirm isConfirmOpen={isConfirmOpen} content={promptContent} onConfirm={handleConfirmYes} onCancel={handleConfirmNo} />
        
        <h2 style={{textAlign: "center"}}>Profile</h2>
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
        <input type="password" onChange={() => setShowAlert(false)} placeholder='Current password' width="8em" style={{marginTop: "1rem", paddingInline: "4em"}} id="currentPassword" />
        <br />
        <input type="password" onChange={() => setShowAlert(false)} placeholder='New password' style={{marginTop: "1rem", paddingInline: "4em"}} id="newPassword" />
        <br />
        <button className="btn btn-primary" onClick={() => changePassword()} style={{marginTop: "1rem"}}>Change password</button>
        <hr />
        <button className="btn btn-danger" style={{marginTop: "1rem"}} onClick={() => deleteAccount()}>Delete account</button>
        </div>
    </div>
  )
}
