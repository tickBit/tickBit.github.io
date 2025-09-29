import React, { useMemo, useState } from 'react'
import { useDrawColor } from '../contexts/DrawColorContext'

export default function Colors() {
    
    const colors = useMemo(() => ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#EEEEFF'], []);
    const { drawColor, setDrawColor } = useDrawColor();
        
    // handle mouse move
    function handleMouseClick(e) {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        setDrawColor(parseInt(x / 50));

        console.log(`Mouse position: (${x}, ${y})`);
    }
    
    // draw board on canvas
    React.useEffect(() => {
        const canvas = document.getElementById('canvasCol');
        const ctx = canvas.getContext('2d');
        const cellSize = 50;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // draw color selector
        for (let i = 0; i < colors.length; i++) {
            ctx.fillStyle = colors[i];
            ctx.fillRect(i * cellSize, 0, cellSize, cellSize);
            if (i === drawColor) {
                ctx.strokeStyle = '#FFFF00';
                ctx.lineWidth = 3;
                ctx.strokeRect(drawColor * cellSize + 1, 1, cellSize - 2, cellSize - 2);
            }
        }

                
    }, [colors, drawColor]);
    
  return (
    <div>
        <canvas id="canvasCol" width="406" height="56" onClick={(e) => handleMouseClick(e)}></canvas>
    </div>
  )
}
