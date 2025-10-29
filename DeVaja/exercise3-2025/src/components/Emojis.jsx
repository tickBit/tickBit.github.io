import React, { useState, useEffect } from 'react'
import { db } from "../firebase"
import { ref, onValue, query, limitToFirst } from "firebase/database"
import { useEmojiNames } from '../contexts/EmojiNamesContext'
import EmojiCanvas from './EmojiCanvas'

export default function Emojis() {
  const { emojiNames, setEmojiNames, loading, error } = useEmojiNames()
  const [emojis, setEmojis] = useState([])

  useEffect(() => {
    // fetch up to MAX (provider uses limitToFirst(72) too — keep consistent)
    const q = query(ref(db, 'users/'), limitToFirst(72))
    const unsubscribe = onValue(
      q,
      (snapshot) => {
        const data = snapshot.val()
        if (!data) {
          setEmojis([])
          setEmojiNames([])
          return
        }

        const list = []
        const names = []
        for (const key in data) {
          const item = data[key]
          const name = (item.name || '').trim()
          list.push({ board: item.board || [], name, key })
          names.push(name)
        }

        setEmojis(list)
        setEmojiNames(names) // keep context up-to-date
      },
      (err) => {
        console.error('Failed to read emojis:', err)
      }
    )

    return () => unsubscribe()
  }, [setEmojiNames])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error loading emojis</p>

  return (
    <>
      <h2 style={{ textAlign: 'center' }}>Saved Emojis</h2>
      {emojis.length > 0 ? (
        <div className="emoji-grid">
          {emojis.map((item, index) => (
            <div className="emoji-item" key={item.name || item.key}>
              <EmojiCanvas emoji={{ board: item.board, index }} />
              <p>{item.name}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No saved emojis yet</p>
      )}
    </>
  )
}