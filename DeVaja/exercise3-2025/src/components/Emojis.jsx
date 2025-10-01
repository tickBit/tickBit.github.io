import { useState, useEffect } from 'react'
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";
import EmojiCanvas from './EmojiCanvas';

export default function Emojis() {
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
                console.log(data[key]);
                emojiArr.push({
                    emoji: data[key]["board"],
                    name: data[key]["name"]
                });
              }
              setEmojis(emojiArr);
        })
        
        
      } catch (error) {
        console.error("Error fetching emojis:", error);
      }
    }, []);

    return (
        <div className="emoji-grid">
            {emojis.map((item, index) => (
                <div className="emoji-item" key={item.name}>
                    <EmojiCanvas emoji={{ board: item.emoji, index }} />
                    <p>{item.name}</p>
                </div>
            ))}
        </div>
    );
}