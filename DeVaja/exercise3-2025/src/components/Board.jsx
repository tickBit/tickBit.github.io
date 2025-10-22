import React, { useMemo, useState } from 'react'
import { useDrawColor } from '../contexts/DrawColorContext'
import { auth, db } from "../firebase";
import { ref, set, push } from "firebase/database";
import { useEmojiNames } from '../contexts/EmojiNamesContext';
import Colors from './Colors'
import MyPrompt from './MyPrompt';

const MAX_EMOJIS = 72;

export default function Board() {
    
    const colors = useMemo(() => ['#010101', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#EEEEFF'], []);
    const { drawColor } = useDrawColor();
    const { emojiNames } = useEmojiNames();
    
    // define 8 x 8 board with zeros
    const [board, setBoard] = useState(Array(64).fill(0));
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [emojiName, setEmojiName] = useState("");
    
    const [isPromptOpen, setIsPromptOpen] = useState(false)
    const [promptContent, setPromptContent] = useState({})
    
    const handlePromptSubmit = (value) => {
        console.log('prompt submit:', value.trim());
                
        // limit number of emojis to be saved to 72
        if (emojiNames.length >= MAX_EMOJIS) {
            setIsSuccess(false)
            setMessage("Max number of emojis saved!")
            setShowAlert(true)
            setIsPromptOpen(false)
            return
        }
        
        const name = value.trim().toLowerCase();
        
        // limit name to 10 characters
        if (name.length > 10) {
            setIsSuccess(false);
            setMessage("Too long emoji name");
            setShowAlert(true);
            setIsPromptOpen(false);
            return;
        }
        
        // require alphanumeric name
        const regex = /^[a-z0-9]+$/

        if (regex.test(name) === false) {
            setIsSuccess(false);
            setMessage("The name must be alphanumeric");
            setShowAlert(true);
            setIsPromptOpen(false);
            return;
        }
        
        setEmojiName(name);
        
        if (name !== '') {
            setIsPromptOpen(false);
            saveToFirebase(name);
        } else {
            setIsPromptOpen(false);
            setIsSuccess(false);
            setMessage("Not saved: emoji name empty");
            setShowAlert(true);
        }
    };
        
        const closePrompt = () => {
            setIsPromptOpen(false);
            setMessage("User canceled saving");
            setIsSuccess(false);
            setShowAlert(true);
        };
        
        const openPrompt = () => {
            setPromptContent({title: "Give a name to the emoji", content: "Name must unique and alphanumeric"});
            setIsPromptOpen(true);
        };
        
    // save board to firebase
    function saveToFirebase(emojiName) {
            
            // check, that emoji board is not empty
            if (board.every(cell => cell === 0)) {
                setIsSuccess(false);
                setMessage("Emoji board is empty!");
                setShowAlert(true);
                return;
            }
            
            if (!auth.currentUser) {
                setIsSuccess(false);
                setMessage("You must be logged in to save emoji!");
                setShowAlert(true);
                return;
            }
            
            //console.log("name to be saved: "+emojiName);
            
            // define emoji object
            const emoji = {
                // board as an array
                board: Array.from(board),
                author: auth.currentUser.email,
                name: emojiName
            };
            
            // check, that is emoji.name in emojiNames array
            function checker(name) {
                return name.trim().toLowerCase() === emoji.name;
            }
            if (emojiNames.some(checker)) {
                setIsSuccess(false);
                setMessage("Emoji name already exists! Please choose a different name.");
                setShowAlert(true);
                return;
            }
            
            // write to firebase database under "users" node with push
            const emojiListRef = ref(db, 'users/');
            const newEmojiRef = push(emojiListRef);
            set(newEmojiRef, emoji)
            
            .then(() => {
                setIsSuccess(true);
                setMessage("Emoji saved to Firebase!");
                setShowAlert(true);
                setEmojiName("");
            })
            .catch((error) => {
                setIsSuccess(false);
                setMessage("Error saving emoji: " + error.message);
                setShowAlert(true);
                setEmojiName("");
            });
        
    }    
            
    // handle mouse move
    function handleMouseClick(e) {
        
        setShowAlert(false);
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // if the cell already has the selected color, set it to 0 (erase)
        if (board[Math.floor(y / 50) * 8 + Math.floor(x / 50)] === drawColor + 1) {
            board[Math.floor(y / 50) * 8 + Math.floor(x / 50)] = 0;
            setBoard([...board]);
            return;
        }
        
        // set the cell to the selected color
        setBoard(prevBoard => {
            const newBoard = [...prevBoard];
            const cellX = Math.floor(x / 50);
            const cellY = Math.floor(y / 50);
            newBoard[cellY * 8 + cellX] = drawColor + 1;
            return newBoard;
        });
        
    }
    
    // draw board on canvas
    React.useEffect(() => {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const cellSize = 50;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // draw board
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                
                if (board[j * 8 + i] === 0) {
                    ctx.fillStyle = (i + j) % 2 === 0 ? '#CCCCCC' : '#777777';
                    ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
                } else {
                    ctx.fillStyle = colors[board[j * 8 + i] - 1];
                    ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
                }
            }
        }
        
        // draw contents of board as emoji next to the board, one cell 4x4 px
        const emojiCanvas = document.getElementById('emojiCanvas');
        const emojiCtx = emojiCanvas.getContext('2d');
        const emojiCellSize = 4;
        
        emojiCtx.clearRect(0, 0, emojiCanvas.width, emojiCanvas.height);
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (board[j * 8 + i] !== 0) {
                    emojiCtx.fillStyle = colors[board[j * 8 + i] - 1];
                    emojiCtx.fillRect(i * emojiCellSize, j * emojiCellSize, emojiCellSize, emojiCellSize);
                }
            }
        }
        
    }, [board, colors]);
  
    
  return (
      <>
        <MyPrompt isPromptOpen={isPromptOpen} onClose={closePrompt} content={promptContent} onSubmit={handlePromptSubmit} />
        
        {showAlert === true ? <>
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
            </>
        :
        <div className="alert alert-info" role="alert" style={{textAlign: "center", width: "55%"}}>
            Ready to use...
        </div>
        }
        <div id="button-group">
            <button style={{marginLeft: "1rem", marginBottom: "1rem"}} className="btn btn-primary" onClick={() => openPrompt()}>Save to Firebase</button>
            <button style={{marginLeft: "1rem", marginBottom: "1rem"}} className="btn btn-secondary" onClick={() => setBoard(Array(64).fill(0))}>Clear Board</button>
        </div>
      
      <div style={{textAlign: "center", margintop: "1rem"}}>Emoji Preview (4x4 px per cell)   
        <div className="emojiPreview">
            <canvas id="emojiCanvas" width="40" height="40" margintop="14rem"></canvas>
        </div>
      </div>
    
    <div>
        <div className='drawing-area'>
            <canvas id="canvas" width="400" height="400" onClick={(e) => handleMouseClick(e)}></canvas>
        <Colors />
        </div>
    </div>
    </>
    
  )
}
