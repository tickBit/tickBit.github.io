import React, { useMemo, useState } from 'react'
import { useDrawColor } from '../contexts/DrawColorContext'

export default function Board() {
    
    const colors = useMemo(() => ['#010101', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#EEEEFF'], []);
    const { drawColor } = useDrawColor();
        
    // define 8 x 8 board with zeros
    const [board, setBoard] = useState(Array(64).fill(0));
    
    // handle mouse move
    function handleMouseClick(e) {
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
                    emojiCtx.fillStyle = colors[board[j * 8 + i]];
                    emojiCtx.fillRect(i * emojiCellSize, j * emojiCellSize, emojiCellSize, emojiCellSize);
                }
            }
        }
        
    }, [board, colors]);
    
  return (
      <>
      <div style={{textAlign: "center", marginTop: "1rem"}}>Emoji Preview (4x4 px per cell)   
        <div className="emojiPreview">
            <canvas id="emojiCanvas" width="40" height="40" marginTop="14rem"></canvas>
        </div>
    </div>
    <div className="d-flex justify-content-center">
        <div className="board">
            <canvas id="canvas" width="400" height="400" onClick={(e) => handleMouseClick(e)}></canvas>
        </div>
    </div>
    </>
  )
}
