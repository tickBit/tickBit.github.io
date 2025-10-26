import 'bootstrap/dist/css/bootstrap.min.css';

const MyOKPrompt =  ({ isOpen, content, onClose }) => {

    if (!isOpen) return null;
 
return (
   <div className="my-ok-prompt">
      <div className="my-ok-prompt-content">
          <h5>{content.title}</h5>
          <p>{content.content}</p>
          <button type="button" className="btn btn-primary" onClick={onClose} >Ok</button>
      </div>
  </div>
 );
};

export default MyOKPrompt;