import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { logout } from '../../utils/auth';
import { FaChevronDown, FaSignOutAlt, FaHandsHelping, FaUserPlus, FaInfoCircle, FaHome } from 'react-icons/fa';
import logo from '../../assets/logo.png';
import "./Navbar.css";

function DevoteeNavbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setActiveDropdown(null);
  };

  const handleDropdownToggle = (name, e) => {
    if (window.innerWidth <= 1024) {
      e.preventDefault();
      setActiveDropdown(activeDropdown === name ? null : name);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <Link to="/home">
          <img src={logo} alt="Temple Logo" />
        </Link>
        <span>Temple Portal</span>
      </div>

      <div className="hamburger" onClick={toggleMenu}>
        {menuOpen ? '✕' : '☰'}
      </div>

      <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
        <li><Link to="/sevas" onClick={() => setMenuOpen(false)}><FaHome /> Home</Link></li>

        {/* Services Group */}
        <li className="nav-item dropdown" 
            onMouseEnter={() => window.innerWidth > 1024 && setActiveDropdown('services')} 
            onMouseLeave={() => window.innerWidth > 1024 && setActiveDropdown(null)}>
          <span className="nav-link-trigger" onClick={(e) => handleDropdownToggle('services', e)}>
            <FaHandsHelping /> Services <FaChevronDown className={`arrow ${activeDropdown === 'services' ? 'up' : ''}`} />
          </span>
          <ul className={`dropdown-menu ${activeDropdown === 'services' ? 'show' : ''}`}>
            <li><Link to="/sevas" onClick={() => setMenuOpen(false)}>Book Seva</Link></li>
            <li><Link to="/BookingManager" onClick={() => setMenuOpen(false)}>Booking Manager</Link></li>
            {/* <li><Link to="/PropertyBooking" onClick={() => setMenuOpen(false)}>Property Booking</Link></li> */}
          </ul>
        </li>

        {/* Registration Group */}
        <li className="nav-item dropdown" 
            onMouseEnter={() => window.innerWidth > 1024 && setActiveDropdown('registration')} 
            onMouseLeave={() => window.innerWidth > 1024 && setActiveDropdown(null)}>
          <span className="nav-link-trigger" onClick={(e) => handleDropdownToggle('registration', e)}>
            <FaUserPlus /> Devotees <FaChevronDown className={`arrow ${activeDropdown === 'registration' ? 'up' : ''}`} />
          </span>
          <ul className={`dropdown-menu ${activeDropdown === 'registration' ? 'show' : ''}`}>
            <li><Link to="/DevoteeMaster" onClick={() => setMenuOpen(false)}>New Registration</Link></li>
            <li><Link to="/DevoteeDirectory" onClick={() => setMenuOpen(false)}>Devotee Directory</Link></li>
          </ul>
        </li>

        {/* Information Group */}
        <li className="nav-item dropdown" 
            onMouseEnter={() => window.innerWidth > 1024 && setActiveDropdown('info')} 
            onMouseLeave={() => window.innerWidth > 1024 && setActiveDropdown(null)}>
          <span className="nav-link-trigger" onClick={(e) => handleDropdownToggle('info', e)}>
            <FaInfoCircle /> Info <FaChevronDown className={`arrow ${activeDropdown === 'info' ? 'up' : ''}`} />
          </span>
          <ul className={`dropdown-menu ${activeDropdown === 'info' ? 'show' : ''}`}>
            <li><Link to="/priests" onClick={() => setMenuOpen(false)}>Priest Directory</Link></li>
            {/* <li><Link to="/events" onClick={() => setMenuOpen(false)}>News & Events</Link></li> */}
          </ul>
        </li>

        <li className="logout-item">
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default DevoteeNavbar;