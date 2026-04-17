import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa'; 
import logo from '../../assets/logo.png';
import "./HomeNavbar.css";

function HomeNavbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo and Name Group */}
        <Link to="/" className="nav-logo">
          <img src={logo} alt="Temple Logo" />
          <span>Shree Mahavishnu Temple</span>
        </Link>

        {/* Mobile Toggle Button */}
        <div className="menu-icon" onClick={toggleMenu}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* Navigation Actions */}
        <div className={`nav-actions ${menuOpen ? 'active' : ''}`}>
          <button className="login-link-btn" onClick={() => { navigate('/login'); setMenuOpen(false); }}>
            Login
          </button>
          <button className="register-btn" onClick={() => { navigate('/register'); setMenuOpen(false); }}>
            Register
          </button>
        </div>
      </div>
    </nav>
  );
}

export default HomeNavbar;