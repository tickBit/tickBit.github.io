import { createContext, useState, useContext } from 'react'

const EmojiNamesContext = createContext()

export function useEmojiNames() {
    return useContext(EmojiNamesContext)
}

export function EmojiNamesProvider({ children }) {
    
    const [emojiNames, setEmojiNames] = useState([]);
    
    const value = {
        emojiNames,
        setEmojiNames
    };
    
    return (
        <EmojiNamesContext.Provider value={value}>
            {children}
        </EmojiNamesContext.Provider>
    )
}

export default EmojiNamesContext