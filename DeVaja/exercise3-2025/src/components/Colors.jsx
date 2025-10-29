import React, { useMemo } from 'react'
import { useDrawColor } from '../contexts/DrawColorContext'

export default function Colors() {
    
    const colors = useMemo(() => ['#010101', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#EEEEFF'], []);
    const { drawColor, setDrawColor } = useDrawColor();
        
    // handle mouse move
    function handleMouseClick(e) {
        const rect = e.target.getBoundingClientRect();
        //const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        setDrawColor(parseInt(y / 50));

        //console.log(`Mouse position: (${x}, ${y})`);
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
            ctx.fillRect(0, i * cellSize, cellSize, cellSize);
            
            // rectangle around selected color
            if (i === drawColor) {
                ctx.strokeStyle = '#656580cf';
                ctx.lineWidth = 2;
                ctx.strokeRect(1, i * cellSize + 1, cellSize-2, cellSize-2);
            }
        }
        
                
    }, [colors, drawColor]);
    
  return (
    <div className='drawing-area' style={{marginLeft: "1rem"}}>
        <canvas id="canvasCol" width="50" height="400" onClick={(e) => handleMouseClick(e)}></canvas>
    </div>
  )
}
