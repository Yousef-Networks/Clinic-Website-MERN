import { Link } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'
import { FaShoppingCart } from 'react-icons/fa';
import { FaBell } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faCog } from '@fortawesome/free-solid-svg-icons';


const Navbar = () => {
  const { logout } = useLogout()
  const { user } = useAuthContext()




  const handleClick = () => {
    logout()

  }

  return (
    <header>
      <div className="left-container">
        <Link to="/" style={{ display: 'flex', alignItems: 'flex-end' }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" style={{ height: '50px', marginRight: '5px', marginBottom: '10px' }}>
            <title>doctor</title>
            <g id="doctor">
              <path fill="#FFFFFF" d="M21.14,14A6.45,6.45,0,0,0,23,9.5V4.43A2.43,2.43,0,0,0,20.57,2H12.43A2.43,2.43,0,0,0,10,4.43V9.5A6.49,6.49,0,0,0,11.82,14h-.09A8.73,8.73,0,0,0,3,22.73v3.74A3.53,3.53,0,0,0,6.53,30H25.47A3.53,3.53,0,0,0,29,26.47V22.73A8.74,8.74,0,0,0,21.14,14ZM12.43,4h8.14a.43.43,0,0,1,.43.43V8H12V4.43A.43.43,0,0,1,12.43,4Zm-.38,6H21a4.48,4.48,0,0,1-8.9,0ZM11,21a1,1,0,1,1-1,1A1,1,0,0,1,11,21Zm16,5.47A1.54,1.54,0,0,1,25.47,28H6.53A1.54,1.54,0,0,1,5,26.47V22.73a6.75,6.75,0,0,1,5-6.5v2.95a3,3,0,1,0,2,0V16h8v3.18A3,3,0,0,0,18,22v2a1,1,0,0,0,2,0V22a1,1,0,0,1,2,0v2a1,1,0,0,0,2,0V22a3,3,0,0,0-2-2.82V16.23a6.75,6.75,0,0,1,5,6.5ZM14,6a1,1,0,0,1,1-1h3a1,1,0,0,1,0,2H15A1,1,0,0,1,14,6Z" />
            </g>
          </svg>
          <h1 style={{ fontSize: '25px', fontWeight: '600', color: 'White', marginBottom: '10px' }}>On-The-Run</h1>
        </Link>

      </div>
      <div className="right-container">
        {user && (
          <div>
            <FontAwesomeIcon icon={faUser} style={{ color: 'White', stroke: 'white', strokeWidth: '2' }} />
            <h3> {user.user}</h3>
            {user.role === 'doctor' && (
              <Link to={`/doctorSettings/${user.user}`}>
                <FontAwesomeIcon icon={faCog} style={{ color: 'White', stroke: 'white', strokeWidth: '2', marginLeft: '10px' }} />
              </Link>
            )}
            {user.role === 'patient' && (
              <Link to={`/patientSettings/${user.user}`}>
                <FontAwesomeIcon icon={faCog} style={{ color: 'White', stroke: 'white', strokeWidth: '2', marginLeft: '10px' }} />
              </Link>
            )}
             {user.role === 'admin' && (
              <Link to={`/adminSettings/${user.user}`}>
                <FontAwesomeIcon icon={faCog} style={{ color: 'White', stroke: 'white', strokeWidth: '2', marginLeft: '10px' }} />
              </Link>
            )}
            <Link to={`/notifications/${user.user}`} className="notification-icon">
              <FaBell />
            </Link>
            <button onClick={handleClick}>Log out</button>
          </div>
        )}
        {!user && (
          <div>
            <Link to="/register/doctor" className="signup-link">
              Signup as Doctor
            </Link>
            <Link to="/register/patient" className="signup-link">
              Signup as Patient
            </Link>
          </div>
        )}
      </div>

    </header>
  );
};
export default Navbar