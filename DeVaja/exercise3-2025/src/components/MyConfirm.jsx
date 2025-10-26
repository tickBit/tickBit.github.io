import { IoMdClose } from "react-icons/io";
import 'bootstrap/dist/css/bootstrap.min.css';

const MyConfirm = ({ isConfirmOpen, content, onConfirm, onCancel }) => {
    
    if (isConfirmOpen !== true) {
        return null;
    }
 
    const handleYes = () => {
        onConfirm && onConfirm();
    };

    const handleNo = () => {
        onCancel && onCancel();
    };
  
 return (
   <div className="my-confirm">
      <div className="my-confirm-content">
          <div className="exit-icon">
            <IoMdClose size={24} color="#333" onClick={handleNo} />
          </div>
          <h5>{content.title}</h5>
          <p>{content.content}</p>
          <div style={{ marginTop: '1rem' }}>
            <button type="button" className="btn btn-danger" onClick={handleYes} >Yes</button>
            <button type="button" className="btn btn-primary" onClick={handleNo} style={{ marginLeft: '0.5rem' }}>No</button>
          </div>
      </div>
  </div>
 );
};

export default MyConfirm;