import React from "react";
import { IoMdClose } from "react-icons/io";
import 'bootstrap/dist/css/bootstrap.min.css';
import './MyOKPrompt';
import MyOKPrompt from "./MyOKPrompt";

const MyPrompt = ({ isPromptOpen, onClose, content, onSubmit }) => {

  const [isOKPromptOpen, setIsOKPromptOpen] = React.useState(false);
      
  const handleOKClose = () => {
    setIsOKPromptOpen(false);
  };
     
  const handleSubmit = (e) => {
    e.preventDefault();

    //const value = (e.target.elements['my-emoji-name'].value || '').trim();
    const value = document.getElementById("my-emoji-name").value.trim();
    const sure = document.getElementById("check-i-a-am-sure").checked;
    
    if (sure !== true) {
        setIsOKPromptOpen(true);
        return;
    }
    
    onSubmit(value);
  };
  
 if (isPromptOpen !== true) {
   return null;
 }
 
 return (
   <div className="my-prompt">
      <MyOKPrompt isOpen={isOKPromptOpen}  content={{title: "Confirmation needed", content: "Please confirm by checking the 'I am sure' checkbox before saving."}} onClose={handleOKClose} />
      <div className="my-prompt-content">
          <div className="exit-icon">
            <IoMdClose size={24} color="#333" onClick={onClose} />
          </div>
          <h5>{content.title}</h5>
          <hr />
          <form onSubmit={handleSubmit}>
          <input name="my-emoji-name" id="my-emoji-name" autoFocus />
          <div style={{ marginTop: '1rem' }}>
            <p>{content.content}</p>
            <button type="submit" className="btn btn-primary">Save</button>
            <button type="button" className="btn btn-secondary" onClick={onClose} style={{ marginLeft: '0.5rem' }}>Cancel</button>
            <div style={{ textAlign: "right" }}>
              <input type="checkbox" id="check-i-a-am-sure" name="check-i-a-am-sure" />
              <label htmlFor="check-i-a-am-sure" style={{ marginLeft: '0.35rem' }}>I am sure</label>
            </div>
          </div>
        </form>
      </div>
  </div>
 );
};

export default MyPrompt;