import { useState, useEffect, useMemo } from 'react'
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";
import { useEmojiNames } from '../contexts/EmojiNamesContext';
import EmojiCanvas from './EmojiCanvas';

export default function Emojis() {
    
    const { setEmojiNames } = useEmojiNames();
    let names = useMemo(() => [], []);
    
    const [emojis, setEmojis] = useState([]);

    useEffect(() => {
      try {  
        onValue(ref(db, 'users/'), (snapshot) => {

            const data = snapshot.val();
            if (!data) {
              setEmojis([]);
              return;
            }
            
            const emojiArr = [];
              for (let key in data) {
                emojiArr.push({
                    emoji: data[key]["board"],
                    name: data[key]["name"]
                });
                names.push(data[key]["name"]);
                setEmojis(emojiArr);
        }});
        
        setEmojiNames(names);
        
      } catch (error) {
        console.error("Error fetching emojis:", error);
      }
    }, [names, setEmojiNames]);

    return (
      <>
        <h2 style={{textAlign: "center"}}>Saved Emojis</h2>
        <div className="emoji-grid">
            {emojis.map((item, index) => (
                <div className="emoji-item" key={item.name}>
                    <EmojiCanvas emoji={{ board: item.emoji, index }} />
                    <p>{item.name}</p>
                </div>
            ))}
        </div>
      </>
    );
}