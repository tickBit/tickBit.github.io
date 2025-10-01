import React, { useMemo, useEffect, use } from 'react'
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";
import EmojiCanvas from './EmojiCanvas';

/*
  TODO:
   - grid layout
   - 
*/

const MAX_AMOUNT_OF_EMOJIS = 20;

export default function Emojis() {

    let emoji_collection = useMemo(() => [], []);
    const [emojis, setEmojis] = React.useState(emoji_collection)
    
    useEffect(() => {
      
      const fetchEmojis = () => {
            const emojiRef = ref(db, 'users/');
            onValue(emojiRef, (snapshot) => {
                let emojis = snapshot.val();
                if (emojis === null) {
                    console.log("No emojis yet.");
                    return;
                }
                for (let key in emojis) {
                    const emoji = emojis[key]["board"];
                    const name = emojis[key]["name"];
                    emoji_collection.push({emoji: emoji, name: name});
                }
                setEmojis(emoji_collection);
            });
          }
      
        fetchEmojis();
    }, [emoji_collection]);
    
  return (
    <div>
      <h2 style={{textAlign: "center"}}>Emojis</h2>
      <div className="emoji-grid">
        {emojis.map((item, index) => (
          <div className="emoji-item">
            <EmojiCanvas emoji={item.emoji} index={index} key={index} />
            <p>{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
