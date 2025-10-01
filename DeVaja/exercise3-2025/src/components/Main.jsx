import React from 'react'
import "./App.css"
import { DrawColorProvider } from '../contexts/DrawColorContext';
import { useAuth } from '../contexts/AuthContext'
import Header from './Header'
import Board from './Board'
import Colors from './Colors'
import Emojis from './Emojis';
import { EmojiNamesProvider } from '../contexts/EmojiNamesContext';

const Main = () => {
  
  const { currentUser } = useAuth()
    
  return (
    <DrawColorProvider>
    <EmojiNamesProvider>
    <div>
        <Header />
        <div className="mainpage">
        {currentUser ? <div>
          <Colors />
          <Board />
          <Emojis />
          </div>
          :
          <> 
          <p>Please log in to use the emoji editor.</p>
          </>
        }
        </div>
    </div>
    </EmojiNamesProvider>
    </DrawColorProvider>
  )
}

export default Main