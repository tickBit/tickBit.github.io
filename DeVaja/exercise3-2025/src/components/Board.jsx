import React, { useState } from 'react'

export default function Board() {
    
    // define 8 x 8 board with zeros
    const [board, setBoard] = useState(Array(64).fill(0));
    
    // read mouse position
    const [mousePos, setMousePos] = useState({x: 0, y: 0});
    
    // handle mouse move
    function handleMouseClick(e) {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePos({x, y});
        
        console.log(`Mouse position: (${x}, ${y})`);
    }
    
    // draw board on canvas
    React.useEffect(() => {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const cellSize = 50;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                ctx.fillStyle = (i + j) % 2 === 0 ? '#CCCCCC' : '#777777';
                ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
            }
        }
    }, [board]);
    
  return (
    <div>
        <div className="board">
            <canvas id="canvas" width="400" height="400" onClick={(e) => handleMouseClick(e)}></canvas>
        </div> 
    </div>
  )
}
