import { useNavigate } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';


const MyOKPrompt = ({ isOKPromptOpen, content }) => {

    const navigate = useNavigate()
    
    const handleOK = () => {
        navigate("/")    
    }


    if (isOKPromptOpen !== true) {
        return null;
    }
 
return (
   <div className="my-ok-prompt">
      <div className="my-ok-prompt-content">
          <h5>{content.title}</h5>
            <p>{content.content}</p>
            <button type="button" className="btn btn-primary" onClick={handleOK} >Ok</button>
      </div>
  </div>
 );
};

export default MyOKPrompt;