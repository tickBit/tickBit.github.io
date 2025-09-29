import React from 'react'
import "./App.css"

import { useAuth } from '../contexts/AuthContext'
import Header from './Header'
import Board from './Board'


const Main = () => {
  
  const { currentUser } = useAuth()
    
  return (
    <div>
        <Header />
        <div className="mainpage">
        <h1>Emoji Editor II</h1>
        {currentUser ?
          <Board />
          :
          <p>Please log in to use the emoji editor.</p>
        }
        </div>
    </div>
  )
}

export default Main