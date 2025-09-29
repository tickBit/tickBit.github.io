import { createContext, useState, useContext } from 'react'

const DrawColorContext = createContext()

export function useDrawColor() {
    return useContext(DrawColorContext)
}

export function DrawColorProvider({ children }) {
    
    const [drawColor, setDrawColor] = useState(0);
    
    const value = {
        drawColor,
        setDrawColor
    };
    
    return (
        <DrawColorContext.Provider value={value}>
            {children}
        </DrawColorContext.Provider>
    )
}

export default DrawColorContext