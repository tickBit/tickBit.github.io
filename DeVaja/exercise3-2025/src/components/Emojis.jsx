import { useState, useEffect } from 'react'
import { db } from "../firebase";
import { ref, onValue, query, limitToFirst } from "firebase/database";
import { useEmojiNames } from '../contexts/EmojiNamesContext';
import EmojiCanvas from './EmojiCanvas';

const MAX_EMOJIS = 72

export default function Emojis() {
    
    // current emoji names are stored in context so,
    // that when saving, the app can check, that each name is unique
    const { setEmojiNames } = useEmojiNames();
        
    const [emojis, setEmojis] = useState([]);
    const [isError, setIsError] = useState(false);
    
    useEffect(() => {
      
      try {
        const q = query(ref(db, 'users/'), limitToFirst(MAX_EMOJIS));  
        const unsubscribe = onValue(q, (snapshot) => {
            const data = snapshot.val();
            if (!data) {
              setEmojis([]);
              setEmojiNames([]);
              setIsError(false);
              return;
            }

            const emojiArr = [];
            const namesLocal = [];
            for (let key in data) {
                emojiArr.push({
                    emoji: data[key].board,
                    name: data[key].name
                });
                namesLocal.push(data[key].name);
            }
            setEmojis(emojiArr);
            setEmojiNames(namesLocal);
            setIsError(false);
        });

        return () => unsubscribe(); // cleanup
         
      } catch (error) {
        console.error("Error fetching emojis:", error);
        setIsError(true);
      }
      
    }, [setEmojiNames]);

    return (
      <>
        <h2 style={{textAlign: "center"}}>Saved Emojis</h2>
        {isError === true ? <p>There was an error fetcing emojis.</p>
         :
         <>
        {emojis && emojis.length > 0 ?
          <div className="emoji-grid">
            {emojis.map((item, index) => (
                <div className="emoji-item" key={item.name}>
                    <EmojiCanvas emoji={{ board: item.emoji, index }} />
                    <p>{item.name}</p>
                </div>
            ))}
          </div>
          :
          <p>No saved emojis yet</p>
        }
      </>
      }
      </>
    );
}