import React from 'react'
import "./App.css"
import { DrawColorProvider } from '../contexts/DrawColorContext';
import { useAuth } from '../contexts/AuthContext'
import Header from './Header'
import Board from './Board'
import Colors from './Colors'

const Main = () => {
  
  const { currentUser } = useAuth()
    
  return (
    <DrawColorProvider>
    <div>
        <Header />
        <div className="mainpage">
        {currentUser ? <div>
          <Colors />
          <Board />
          </div>
          :
          <> 
          <p>Please log in to use the emoji editor.</p>
          </>
        }
        </div>
    </div>
    </DrawColorProvider>
  )
}

export default Main