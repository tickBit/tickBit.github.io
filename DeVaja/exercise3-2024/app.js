/*
  DeVaja exercise 3 2024 version

*/
import { firebaseConfig } from './config.js';

// make savingConfirmed global
window.savingConfirmed = savingConfirmed;

const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database(app);

// https://jsfiddle.net/ghvj4gy9/
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const MAX_AMOUNT_OF_EMOJIS = 48;
const MAX_AMOUNT_OF_USERS = 25;
var canvas;
var ctx;
var editedEmoji = new Uint8Array(64);
var drawColor = 1;
var maxNumberOfEmojis = false;
let userCount = 0;

function toggleSignIn() {
    // if a user is logged in, log the user out, otherwise log user in
    if (firebase.auth().currentUser) {

        firebase.auth().signOut();

        document.getElementById("emojiName").value = "";
        document.getElementById("enterName").style.display = "none";
        document.getElementById("checkConfirm").checked = false;
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";

        document.getElementById("error-login").style.display = "none";
        document.getElementById("i-am-human").checked = false;

        // stop listening changes on emojis in Firebase
        //firebase.database().ref("/emojis/").off("value");
    } else {

      if (document.getElementById("i-am-human").checked == false) {
        printErrorMessage("Please confirm, that you are human", 8000);
        return;
      }

      let email = document.getElementById('email').value;
      let password = document.getElementById('password').value;

      if (!EMAIL_REGEX.test(email)) {
        blinkEmail();
        printErrorMessage("Email was invalid", 8000);
        clearEmailAndPasswordFields();
        return;
      }

      if (password.length < 4) {
        blinkPassword();
        printErrorMessage("Password was too short", 8000);
        clearEmailAndPasswordFields();
        return;
      }
    
      // Sign in with email and password
      firebase.auth().signInWithEmailAndPassword(email, password).then((userCredential) => {
          // Signed in
          //const user = userCredential.user;
        })
        .catch((error) => {
          
          let errorCode = error.code;
          //let errorMessage = error.message;

          if (errorCode === 'auth/wrong-password') {
            blinkPassword();
            printErrorMessage("Password was wrong", 8000);
            clearEmailAndPasswordFields();
          } else {
            blinkEmail();
            blinkPassword();

            printErrorMessage("There was login error", 8000);
  
          }
        
          }).finally(() => {
              clearEmailAndPasswordFields();
          });

    }
  
}



  /**
   * Handles the signing up
   */
 async function handleSignUp() {
    
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    if (document.getElementById("i-am-human").checked == false) {
      printErrorMessage("Please confirm, that you are human", 8000);
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      printErrorMessage("Email address was not valid", 8000);
      blinkEmail();
      return;
    }
    if (password.length < 4) {
      printErrorMessage("Password was too short", 8000);
      blinkPassword();
      return;
    }


    if (userCount < MAX_AMOUNT_OF_USERS) {
        
        // creates a new user with an eamil and password...
        firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {

          increaseUserCountAndCheckAmountUsers();

          return;
          })
        .catch((error) => {
          // Error codes and messages...
          let errorCode = error.code;
          //let errorMessage = error.message;
          if (errorCode == 'auth/weak-password') {

            blinkPassword();
            printErrorMessage("Password was too weak", 8000);
            document.getElementById("i-am-human").checked = false;
            clearEmailAndPasswordFields();
            return;
          }
      
          if (errorCode == 'auth/email-already-in-use') {

            blinkEmail();
            printErrorMessage("Account with used email already exists", 10000);
            document.getElementById("i-am-human").checked = false;
            clearEmailAndPasswordFields();
            return;

          } else {
            blinkEmail();
            printErrorMessage("There was problem with email", 8000);
            document.getElementById("i-am-human").checked = false;
            clearEmailAndPasswordFields();
            return;
          }

          });
      } else {

        printErrorMessage("Maximum number of users registered!", 12000);
        clearEmailAndPasswordFields();
        return;
      }
    }

  function printEmojiError(message, duration) {
    document.getElementById("io-text").textContent = message;
    document.getElementById("io-div").style.display = "inline-block";
    setTimeout(function () {
    document.getElementById("io-div").style.display = "none";
  }, duration);
  }

  function printErrorMessage(message, duration) {
    document.getElementById("error-login").textContent = message;
    document.getElementById("error-login").style.display = "inline";
      setTimeout(function () {
        document.getElementById("error-login").style.display = "none";
      }, duration);
  }

  function clearEmailAndPasswordFields() {
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.getElementById("i-am-human").checked = false;
  }
  

  /**
   *   The main function: Handles auhtentication and signup
   */
  function App() {
    
    // Auth state change handling
    firebase.auth().onAuthStateChanged(function(user) {

      if (user) {

        document.getElementById('sign-in-status').textContent = 'Signed in';

        document.getElementsByClassName("frontPage")[0].style.display = "none";
        document.getElementsByClassName("emoji-page")[0].style.display = "block";

        for (let k = 0; k < editedEmoji.length; k++) {
          editedEmoji[k] = 0;
        }
        
        drawEditorCanvas();
        readEmojis();
        
      } else {

        // User is signed out
        document.getElementById('sign-in-status').textContent = 'Signed out';

        document.getElementsByClassName("frontPage")[0].style.display = "block";
        document.getElementsByClassName("emoji-page")[0].style.display = "none";

        document.getElementById("i-am-human").checked = false;
        
        // remove the emojis from the page
        let items = document.getElementsByClassName("items")[0];
        while (items.firstChild != null) {
          items.removeChild(items.lastChild);
        }
      }


    });

    // handle cancel saving emoji...
    document.getElementById('cancel-saving').addEventListener('click', function(e) {
      document.getElementById("emojiName").value = "";
      document.getElementById("enterName").style.display = "none";
      document.getElementById("checkConfirm").checked = false;
    });

    // handle clear editor event...
    document.getElementById("clear").addEventListener('click', function(e) {

      for (let i = 0; i < editedEmoji.length; i++) {
        editedEmoji[i] = 0;
      }
      drawBoard();

    });

    // event listeners for sign in, sign out and sign up and reset password
    document.getElementById('sign-in').addEventListener('click', toggleSignIn, false);
    document.getElementById('sign-out').addEventListener('click', toggleSignIn, false);
    document.getElementById('sign-up').addEventListener('click', handleSignUp, false);
    document.getElementById('reset-password').addEventListener('click', handleResetPassword, false);

    // event listener for deleting account
    document.getElementById('delete-me').addEventListener('click', handleDeleteAccount, false);

    // delete account for good
    document.getElementById('confirm-delete').addEventListener('click', deleteAccount, false);

    // cancel delete account
    document.getElementById('cancel-delete').addEventListener('click', cancelDelete, false);

    // handle the clicks on the colors for the editor
    document.getElementById("black").addEventListener('click', function(e) {
      drawColor = 1
    });

    document.getElementById("yellow").addEventListener('click', function(e) {
      drawColor = 2;
    });
  }

  function savingConfirmed() {

    const name = document.getElementById("emojiName").value;
    
    saveEmoji(name.trim());

  }

  // set up the editor canvas
  function drawEditorCanvas() {

    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgba(255, 255, 255, 0.0)";
    ctx.clearRect(0,0,256,256)
    canvas.addEventListener("click", toggleSqauare);

    document.getElementById("save").addEventListener("click", enterName);

  }

  // for saving the emoji, get the name for it
  function enterName(e) {
    e.preventDefault();

    let empty = true;
    
    for (let i = 0; i < editedEmoji.length; i++) {
      if (editedEmoji[i] != 0) empty = false;
    }

    if (empty) {
      // inform, that editor is empty, will not save empty "emoji"
      printEmojiError("Editor is empty, can't save", 8000);
    } else {
      // show field for entering the name for emoji
      document.getElementById("enterName").style.display = "block";
    }

  }

  // drawing into editor
  function toggleSqauare(e) {

    // first check if editor is empty

    let rect = canvas.getBoundingClientRect();
    let x = parseInt((e.clientX - rect.left) / 32);
    let y = parseInt((e.clientY - rect.top) / 32);

    if (editedEmoji[x + y * 8] != drawColor) {
      editedEmoji[x + y * 8] = drawColor;
    } else {
      editedEmoji[x + y * 8] = 0;
    }
    
    let empty = true;
    
    for (let i = 0; i < editedEmoji.length; i++) {
      if (editedEmoji[i] != 0) empty = false;
    }
    
    if (!empty) {
      document.getElementById("io-div").style.display = "none";
    } else {
      document.getElementById("enterName").style.display = "none";
    }

    
    drawBoard();

  }

  // drawing of the emoji to the board
  function drawBoard() {
    
    ctx.clearRect(0,0,256,256);

    ctx.fillStyle = "rgba(255, 255, 0, 1.0)";

    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            if (editedEmoji[x + y * 8] == 1) {
              ctx.fillStyle = "black";
              ctx.fillRect(x * 32, y * 32, 32, 32);
            } else {
              if (editedEmoji[x + y * 8] == 2) {
                ctx.fillStyle = "yellow";
                ctx.fillRect(x * 32, y * 32, 32, 32);
              }
            }
        }
    }
  }

  // save emoji to the Firebase realtime database
  function saveEmoji(name) {

    if (maxNumberOfEmojis) {
      // write error to Firebase
      printEmojiError("Max number of emojis saved to Firebase", 8000);
      return;
    }

    let emoji = "";

    // save emoji as string of numbers
    for (let i = 0; i < editedEmoji.length; i++) {
      emoji+=editedEmoji[i].toString();
    }
  

    database.ref("/emojis/").push({
        emoji: emoji,
        name: name.trim().toString()
    }, (error) => {
        if (error) {
            // write error to Firebase
            printEmojiError("Write error to Firebase!", 8000);
        } else {
          //console.log("Data saved successfully.");
        }
      });
    
    document.getElementById("emojiName").value = "";
    document.getElementById("enterName").style.display = "none";
    document.getElementById("checkConfirm").checked = false;

  }

  // read emojis from the Firebase realtime database
  async function readEmojis() {
          
    await database.ref("/emojis/").limitToFirst(MAX_AMOUNT_OF_EMOJIS).on("value", (snapshot) => {
      
      let emojis = snapshot.val();
      
      if (emojis === null) {
        //console.log("No emojis yet.");
        return;
      }

      let i = 0;

      let items = document.getElementsByClassName("items")[0];
        while (items.firstChild != null) {
          items.removeChild(items.lastChild);
      }

      for (let key in emojis) {
        let emoji = emojis[key]["emoji"];
        let entry = [];
        for (let k of emoji) {
          let value = parseInt(k);
          if (value in [0,1,2]) entry.push(value);
        }

        i++;

        drawCanvasByEntry(entry, i);
      }

      // max number of emojis, 4 rows
      if (i >= MAX_AMOUNT_OF_EMOJIS) maxNumberOfEmojis = true;

    }, (errorObject) => {
      // read error from Firebase
      printEmojiError("Read error from Firebase!", 12000);
    });

  
  }

  /*
    Each read emoji is drawn to canvas of its own
  */
  function drawCanvasByEntry(entry, i) {

    let enc = document.getElementsByClassName("items")[0];

    let can = document.createElement("canvas");
    can.setAttribute("width", 256);
    can.setAttribute("height", 256);
    can.style.width = "4em";
    can.style.height = "4em";
    can.style.padding = "2em";

    let cx = can.getContext("2d");

    // canvas bg color (128, 128, 128) (grey), alpha 0.0 
    cx.fillStyle = "rgba(128, 128, 128, 0.0)";
    cx.fillRect(0,0,256,256);


    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {

        if (entry[x+y*8] == 1) {
          cx.fillStyle = "black";
          cx.fillRect(x*32, y*32, 32, 32);
        }

        if (entry[x+y*8] == 2) {
          cx.fillStyle = "yellow";
          cx.fillRect(x*32, y*32, 32, 32);
        }
      }
    }
    let item = document.createElement("div");
    item.setAttribute("width", "100em");
    item.setAttribute("height", "100em");
    item.setAttribute("id","i"+i);
    item.appendChild(can);
    
    enc.appendChild(item);
    
  }
  
  // disable context menu to prevent downloading the images
  window.oncontextmenu = function () {
    return false;
  }

  // if the page is refreshed, the user is signed out
  window.onbeforeunload = function(e) {
    firebase.auth().signOut();
    
    document.getElementById("emojiName").value = "";
    document.getElementById("enterName").style.display = "none";
    document.getElementById("checkConfirm").checked = false;
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";

    // stop listening changes on emojis in Firebase
    //firebase.database().ref("/emojis/").off("value");
  }

  // the entry point of app
  window.onload = function() {

    // the following code prevents the page for refresing after submit
    let form = document.getElementById("confirmForm");
    function handleForm(event) { event.preventDefault(); } 
    form.addEventListener('submit', handleForm);

    App();
  
  }

function handleDeleteAccount() {
  document.getElementById("confirm-delete-me").style.display = "inline";
}

async function increaseUserCountAndCheckAmountUsers() {

  const userCountRef = database.ref('/userCount');
  await userCountRef.once('value', (snap) => {

  if (snap.val()) {
          userCount = snap.val().cnt;

  } else {
          userCount = 0;
        }

  });

  userCount++;
  userCountRef.set({cnt: userCount}).catch((error) => {
    // if userCount can't be written to Firebase, the user count has been probably exceeded, and
    // created user will be deleted
    firebase.auth().currentUser.delete().then(() => {
      printErrorMessage("User count exceeded! Registering canceled.", 12000);
      clearEmailAndPasswordFields();
      document.getElementById("i-am-human").checked = false;

      // no need to decrease userCount value, because writing the increased value failed

    }).catch((error) => {
      printErrorMessage("Something unexpected happened", 8000);
      clearEmailAndPasswordFields();
      document.getElementById("i-am-human").checked = false;
    });
  });

}

async function decreaseUserCount() {

  const userCountRef = database.ref('/userCount');
  await userCountRef.once('value', (snap) => {

  if (snap.val()) {
          userCount = snap.val().cnt;
          userCount--;
          userCountRef.set({cnt: userCount});

  } else {
         // fatal error!
          //console.log("fatal error!");
        }

      });

}

async function handleResetPassword() {

  if (document.getElementById("i-am-human").checked == false) {
    printErrorMessage("Please confirm, that you're human", 8000);
    return;
  }

  const email = document.getElementById("email").value
  if (!EMAIL_REGEX.test(email)) {
    blinkEmail();
    printErrorMessage("Email was invalid", 8000);
    clearEmailAndPasswordFields();
    return;
  }

  await firebase.auth().sendPasswordResetEmail(email).then(() => {
    document.getElementById("error-login").textContent = "Email sent successfully! Check your inbox.";
    document.getElementById("error-login").style.display = "inline";
    document.getElementById("error-login").style.color = "green"
    setTimeout(function () {
        document.getElementById("error-login").style.display = "none";
    }, 13000);
    document.getElementById("i-am-human").checked = false;

  }).catch(function(error) {
    printErrorMessage("Email reset failed for some reason", 8000);
    clearEmailAndPasswordFields();
    document.getElementById("i-am-human").checked = false;
  });
}

function deleteAccount() {

  decreaseUserCount();
  
  firebase.auth().currentUser.delete().then(() => {
    document.getElementById("confirm-delete-me").style.display = "none";
    clearEmailAndPasswordFields();

  }).catch((error) => {
    printEmojiError("Deleting account failed. Try again later.", 8000);
    return;
  });
}

function cancelDelete() {
  document.getElementById("confirm-delete-me").style.display = "none";
}

function blinkEmail() {
  document.getElementById("email").classList.add("animateDescriptor");
  document.getElementById("email").addEventListener( "animationend",  function() {
    document.getElementById("email").classList.remove("animateDescriptor");    
  });
}

function blinkPassword() {
  document.getElementById("password").classList.add("animateDescriptor");
  document.getElementById("password").addEventListener( "animationend",  function() {
    document.getElementById("password").classList.remove("animateDescriptor");    
  });
}