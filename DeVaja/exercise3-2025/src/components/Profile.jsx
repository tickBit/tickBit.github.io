import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { deleteUser } from 'firebase/auth';
import { db } from '../firebase';
import { ref, remove, get } from "firebase/database";
import { Card, Container } from 'react-bootstrap';
import MyOKPrompt from './MyOKPrompt';
import MyConfirm from './MyConfirm';
import Header from './Header';
import ForgotPassword from './ForgotPassword';

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
        let newpw2 = document.getElementById("newPassword2").value.trim()
        
        if (newpw.length < 6) {
            setMessage("Password should be at least 6 characters long.")
            setIsSuccess(false)
            setShowAlert(true)
            window.scrollTo(0, 0);
            return
        }
        
        if (newpw === currentpw) {
            setMessage("New password must be different from current password.")
            setIsSuccess(false)
            setShowAlert(true)
            window.scrollTo(0, 0);
            return
        }
    
        if (newpw !== newpw2) {
            setMessage("New passwords do not match.")
            setIsSuccess(false)
            setShowAlert(true)
            
            window.scrollTo(0, 0);
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
                        window.scrollTo(0, 0);
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
                        window.scrollTo(0, 0);
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
        
        // clear input fields
        document.getElementById("currentPassword").value = ""
        document.getElementById("newPassword").value = ""
        document.getElementById("newPassword2").value = ""
        
        // scroll to top
        window.scrollTo(0, 0);
    }
    
const handleDeleteAccount = async () => {
  try {
    const userEmail = currentUser;

    // Remove user's data according to author's email
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


    // remove auth
    await deleteUser(user);

    setPromptContent({ title: "Account deleted", content: "All your emojis are also deleted." });
    setIsOKPromptOpen(true);
//    navigate("/");
  } catch (error) {
    console.error(error);
  }
};

    
  return (
    <>
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
        
        <ForgotPassword />
        <hr />
        <Container style={{width: "30rem"}}>
        <Card>
        <h2 style={{textAlign: "center"}}>Change password</h2>
        <Card.Body style={{textAlign: "center"}}>
            <input type="password" onChange={() => setShowAlert(false)} placeholder='Current password' width="8em" style={{marginTop: "1rem", paddingInline: "4em"}} id="currentPassword" />
            <br />
            <input type="password" onChange={() => setShowAlert(false)} placeholder='New password' style={{marginTop: "1rem", paddingInline: "4em"}} id="newPassword" />
            <br />
            <input type="password" onChange={() => setShowAlert(false)} placeholder='Re-enter new password' style={{marginTop: "1rem", paddingInline: "4em"}} id="newPassword2" />
            <br />
            <button className="btn btn-primary" onClick={() => changePassword()} style={{marginTop: "1rem"}}>Change password</button>
        </Card.Body>
        </Card>
        </Container>
        <hr />
        <div style={{textAlign: "center", marginBottom: "4rem" }}>
            <button className="btn btn-danger" style={{marginTop: "1rem"}} onClick={() => deleteAccount()}>Delete account</button>
        </div>
    </>
  )
}
