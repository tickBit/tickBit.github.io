import React from "react";
import { IoMdClose } from "react-icons/io";
import 'bootstrap/dist/css/bootstrap.min.css';

const MyPrompt = ({ isPromptOpen, onClose, content, onSubmit }) => {
 
  const handleSubmit = (e) => {
    e.preventDefault();
    const value = (e.target.elements['my-emoji-name'].value || '').trim();
    onSubmit(value);
  };
  
 if (isPromptOpen !== true) {
   return null;
 }
 
 return (
   <div className="my-prompt">
      <div className="my-prompt-content">
          <div className="exit-icon">
            <IoMdClose size={24} color="#333" onClick={onClose} />
          </div>
          <h5>{content.title}</h5>
          <hr />
          <form onSubmit={handleSubmit}>
          <input name="my-emoji-name" id="my-emoji-name" autoFocus />
          <div style={{ marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary">Save</button>
            <button type="button" className="btn btn-secondary" onClick={onClose} style={{ marginLeft: '0.5rem' }}>Cancel</button>
          </div>
        </form>
      </div>
  </div>
 );
};

export default MyPrompt;