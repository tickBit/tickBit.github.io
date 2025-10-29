import { Link } from 'react-router';
import Container from 'react-bootstrap/Container';
import { Navbar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../contexts/AuthContext'

function Header({main = true}) {
  
  const { currentUser, logout } = useAuth()
  
  return (
    <Navbar fixed="top" className="bg-primary main-header">
      <Container>
        <Navbar.Brand className="text-white">Create and watch emojis</Navbar.Brand>
        <Navbar.Text className="text-white">This is only an exercise</Navbar.Text>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          {currentUser ? <div>
              <Navbar.Text className="text-white">
                Signed in as: {currentUser}
              </Navbar.Text>
              {" "}
              {main === false ?
              <Navbar.Text className="text-white" style={{marginLeft: "2rem"}}>
                <Link to="/profile" className="text-white">Profile</Link>
              </Navbar.Text>
              :
              <Navbar.Text className="text-white" style={{marginLeft: "2rem"}}>
                <Link to="/" className="text-white">Main page</Link>
              </Navbar.Text>
              }
              {" "}
              <Navbar.Text>
                <Link to="/" onClick={logout} className='text-white' style={{marginLeft: "1rem"}}>Logout</Link>
              </Navbar.Text>
              </div>
              :
              <div>
              <Navbar.Text>
                <Link to="/login" className="text-white">Login</Link>
              </Navbar.Text>
              {" "}
              <Navbar.Text className="text-white" style={{marginLeft: "1rem"}}>
                <Link to="/signup" className="text-white">Signup</Link>
              </Navbar.Text>
              </div>
          }
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;