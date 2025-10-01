import React, { useMemo } from 'react'

export default function EmojiCanvas({emoji: boardData, index}) {
    
  const colors = useMemo(() => ['#010101', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#EEEEFF'], []);
  
    // draw emoji on canvas
    React.useEffect(() => {
        const canvas = document.getElementById("emoji-canvas-"+index.toString());
        const ctx = canvas.getContext('2d');
        const cellSize = 4;
        const board = boardData;
        console.log(board);
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (board[j * 8 + i] !== 0) {
                    ctx.fillStyle = colors[board[j * 8 + i] - 1];
                    ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
                } else {
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
                }
            }
        }
        }, [boardData, index, colors]);
  return (
    <>
            <canvas width="50" height="50" id={"emoji-canvas-"+index.toString()} key={index}></canvas>
    </>
    );
  
}
