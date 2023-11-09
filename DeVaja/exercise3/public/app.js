/*
  DeVaja exercise 3

  This program is not exactly the Firebase cloud version, but a Firebase emulator version of it.
  This code can be tested via the Firebase emulator, when the needed Firebase modules are installed and Node.js is installed
  into the root of the app. When that is done, just type:

  firebase emulators:start

  Then go with your browser to localhost:5000

  The Firebase services this app uses are authentication, realtime database and hosting, please pay attention to those,
  when installing the Firebase environment.

  Please notice, that if you want to write to emulated Firebase realtime database, you must create
  to a user a role at "127.0.0.1:9000" like this: {"role": 1}, when the Firebase emulator is running and you've signed up a user.

*/

// https://jsfiddle.net/ghvj4gy9/
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

var canvas;
var ctx;
var editedEmoji = new Uint8Array(64);
var lastRead;
var drawColor = 1;
var userRole = undefined;
var maxNumberOfEmojis = false;

function toggleSignIn() {

    // if a user is logged in, log the user out, otherwise log user in
    if (firebase.auth().currentUser) {
        firebase.auth().signOut();

        document.getElementById("emojiName").value = "";
        document.getElementById("enterName").style.display = "none";
        document.getElementById("checkConfirm").checked = false;
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";

    } else {
        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;

        if (!EMAIL_REGEX.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }
      if (password.length < 4) {
        alert('Please enter a password.');
        return;
      }


      // Sign in with email and pass.
      firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {

        console.log(error.code);
        
        // Error codes
        let errorCode = error.code;
        let errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
          alert('Wrong password.');
        } else {
          alert(errorMessage);
        }

        console.log(error);
      });
    }
  }

  /**
   * Handles the signing up
   */
  function handleSignUp() {

    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    if (!EMAIL_REGEX.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    if (password.length < 5) {
      alert("Password too short. And please don't use weak passwords.");
      return;
    }
 
    // creates a new user with an eamil and password...
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
      
      // Error codes and messages...
      let errorCode = error.code;
      let errorMessage = error.message;
      if (errorCode == 'auth/weak-password') {
        alert('The password is too weak.');
        return;
      }
      
      if (errorCode == 'auth/email-already-in-use') {
        alert('Account with this email already exists.');
        return;

      } else {
        alert(errorMessage);
      }

      console.log(error);
    });
  }


  /**
   *   The main function: Handles auhtentication and signup
   */
  function App() {
    
    // Auth state change handling
    firebase.auth().onAuthStateChanged(function(user) {

      if (user) {

        /* 
          User is signed in, but only "admin" role users can write
          to the Firebase realtime database
        */
        user.getIdTokenResult(true).then(function(result) {
          userRole = result["claims"]["role"]; // get the role of the user
        });

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

    // event listeners for sign in, sign out and sign up
    document.getElementById('sign-in').addEventListener('click', toggleSignIn, false);
    document.getElementById('sign-out').addEventListener('click', toggleSignIn, false);
    document.getElementById('sign-up').addEventListener('click', handleSignUp, false);


    // handle the clicks on the colors for the editor

    document.getElementById("black").addEventListener('click', function(e) {
      drawColor = 1
    });

    document.getElementById("yellow").addEventListener('click', function(e) {
      drawColor = 2;
    });
  }

  function savingConfirmed() {

    // only special user account have permission to write
    // these accounts must set up manually
    if (userRole != 1) {
      alert("No permission to write. Only admin role users can write.\nThe developer of the app, has given limited amount of admin role accounts to selected people only.\nThis app is only an exercise, so don't worry :-)");
      return;
    }
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
      document.getElementById("empty").style.display = "block";
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
      document.getElementById("empty").style.display = "none";
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
      alert("Max number of emojis saved.")
      return;
    }

    let emoji = "";

    // save emoji as string of numbers
    for (let i = 0; i < editedEmoji.length; i++) {
      emoji+=editedEmoji[i].toString();
    }
  

    firebase.database().ref("/emojis/").push({
        emoji: emoji,
        name: name.trim().toString()
      }, (error) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Data saved successfully.");
        }
      });
    
    document.getElementById("emojiName").value = "";
    document.getElementById("enterName").style.display = "none";
    document.getElementById("checkConfirm").checked = false;
    
  }

  // read emojis from the Firebase realtime database
  function readEmojis() {
       
    
    firebase.database().ref("/emojis/").limitToFirst(72).on("value", (snapshot) => {
      let emojis = snapshot.val();
    
      if (emojis === null) {
        console.log("No emojis yet.");
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
      if (i >= 72) maxNumberOfEmojis = true;

  }, (errorObject) => {
    console.log('The read failed: ' + errorObject.name);
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
    cx.fillStyle = "rgba(128, 128, 128, 0.0)";;
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
  }

  // the entry point of app
  window.onload = function() {

    // the following code prevents the page for refresing after submit
    let form = document.getElementById("confirmForm");
    function handleForm(event) { event.preventDefault(); } 
    form.addEventListener('submit', handleForm);

    App();
  
  }