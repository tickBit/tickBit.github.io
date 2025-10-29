import React, { createContext, useState, useContext, useEffect, useMemo } from 'react'
import { db } from '../firebase'
import { ref, onValue, query, limitToFirst } from 'firebase/database'

const EmojiNamesContext = createContext()

export function useEmojiNames() {
    return useContext(EmojiNamesContext)
}

export function EmojiNamesProvider({ children }) {
    
    const [emojiNames, setEmojiNames] = useState([]);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
  
  useEffect(() => {
    const q = query(ref(db, 'users/'), limitToFirst(72))
    const off = onValue(q, (snapshot) => {
      const data = snapshot.val()
      if (!data) {
        setEmojiNames([])
        setLoading(false)
        return
      }
      const names = []
      for (const key in data) {
        names.push((data[key].name || '').trim())
      }
      setEmojiNames(names)
      setLoading(false)
    }, (err) => {
      setError(err)
      setLoading(false)
    })

    return () => off() // unsubscribe on unmount
  }, [])

  // memoize to avoid extra re-renders in consumers
  const value = useMemo(() => ({ emojiNames, setEmojiNames, loading, error }), [emojiNames, loading, error])

  return <EmojiNamesContext.Provider value={value}>{children}</EmojiNamesContext.Provider>
}

export default EmojiNamesContext