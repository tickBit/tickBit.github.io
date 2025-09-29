import React, { useMemo, useState } from 'react'
import { useDrawColor } from '../contexts/DrawColorContext'

export default function Board() {
    
    const colors = useMemo(() => ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#EEEEFF'], []);
    const { drawColor } = useDrawColor();
        
    // define 8 x 8 board with zeros
    const [board, setBoard] = useState(Array(64).fill(0));
    
    // handle mouse move
    function handleMouseClick(e) {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // if the cell already has the selected color, set it to 0 (erase)
        if (board[Math.floor(y / 50) * 8 + Math.floor(x / 50)] === drawColor) {
            board[Math.floor(y / 50) * 8 + Math.floor(x / 50)] = 0;
            setBoard([...board]);
            return;
        }
        
        // set the cell to the selected color
        setBoard(prevBoard => {
            const newBoard = [...prevBoard];
            const cellX = Math.floor(x / 50);
            const cellY = Math.floor(y / 50);
            newBoard[cellY * 8 + cellX] = drawColor;
            return newBoard;
        });
        
        console.log(`Mouse position: (${x}, ${y})`);
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
                    ctx.fillStyle = colors[board[j * 8 + i]];
                    ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
                }
            }
        }
        
    }, [board, colors]);
    
  return (
    <div>
        <div className="board">
            <canvas id="canvas" width="400" height="400" onClick={(e) => handleMouseClick(e)}></canvas>
        </div> 
    </div>
  )
}
