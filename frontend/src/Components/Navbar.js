import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { FaHome, FaServicestack, FaPhone, FaSignInAlt } from "react-icons/fa";


const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false); 
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const role = localStorage.getItem('user_role');
    if (token && role) {
      setIsLoggedIn(true);
      setUserRole(role);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
    setIsLoggedIn(false);
    closeMenu();           // Close menu after logout
    navigate('/login');    // Navigate after logout
  };

  return (
    <nav className="navbar-section">
      <div className="logo">Classify</div>

      <div className="menu-toggle" onClick={toggleMenu}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="30"
          viewBox="0 0 24 24"
          width="30"
          fill="white"
        >
          <path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" />
        </svg>
      </div>

      {/* Nav Links */}
      <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
        {!isLoggedIn ? (
          <>
            <li><Link to="/" onClick={closeMenu}> Home</Link></li>
            <li><Link to="/services" onClick={closeMenu}>Services</Link></li>
            <li><Link to="/contact" onClick={closeMenu}>Contact</Link></li>
            <li><Link to="/login" onClick={closeMenu}>Log In</Link></li>
          </>
        ) : (
          <>
            {userRole === "teacher" && (
              <li><Link to="/teacher-dashboard" onClick={closeMenu}>Teacher Dashboard</Link></li>
            )}
            {userRole === "student" && (
              <li><Link to="/student-dashboard" onClick={closeMenu}>Student Dashboard</Link></li>
            )}
            <li className="logout-button-li">
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
