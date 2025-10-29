import "./App.css"
import { DrawColorProvider } from '../contexts/DrawColorContext';
import { useAuth } from '../contexts/AuthContext'
import Header from './Header'
import Board from './Board'
import Emojis from './Emojis';
import { EmojiNamesProvider } from '../contexts/EmojiNamesContext';

const Main = () => {
  
  const { currentUser } = useAuth()
    
  return (
    <EmojiNamesProvider>
    <DrawColorProvider>
    <div>
        <Header main={false} />
        <div className="mainpage">
        {currentUser ?
         <div>
          <div style={{width: "100%", textAlign: "center"}}>
          <Board />
          <Emojis />
          </div>
          </div>
          :
          <> 
          <img src="emojititle.jpg" alt="Emoji Editor" style={{display: "block", marginLeft: "auto", marginRight: "auto"}} />
          <br />
          <p style={{textAlign: "center"}}>Please log in to use the emoji editor.</p>
          </>
        }
        </div>
    </div>
    </DrawColorProvider>
    </EmojiNamesProvider>
  )
}

export default Main