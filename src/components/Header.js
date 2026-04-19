import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MobileMenu from './MobileMenu';
import ThemeToggle from './ThemeToggle';
import './Header.css';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const isActive = (path) => location.pathname === path ? 'active' : '';
  
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const name = localStorage.getItem('userName') || '';
    setIsLoggedIn(loggedIn);
    setUserName(name);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    setDropdownOpen(false);
    navigate('/');
  };

  const scrollToContact = () => {
    if (location.pathname === '/') {
      document.querySelector('.contact-section')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => document.querySelector('.contact-section')?.scrollIntoView({ behavior: 'smooth' }), 300);
    }
  };

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">🐝</span>
          <span className="logo-text">SMART HIVE</span>
        </Link>
        
        <nav className="nav-menu">
          <Link to="/" className={`nav-link ${isActive('/')}`}>الرئيسية</Link>
          <Link to="/store" className={`nav-link ${isActive('/store')}`}>المتجر</Link>
          <Link to="/updates" className={`nav-link ${isActive('/updates')}`}>التحديثات</Link>
          <button className="nav-link" onClick={scrollToContact}>راسلنا</button>
        </nav>
        
        <div className="header-actions">
          <ThemeToggle />
          {!isLoggedIn ? (
            <>
              <Link to="/activate" className="btn-activate"><i className="fas fa-key"></i><span>تفعيل</span></Link>
              <Link to="/login" className="btn-login"><i className="fas fa-user"></i></Link>
            </>
          ) : (
            <div className="user-menu" ref={dropdownRef}>
              <button className="btn-user" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <i className="fas fa-user-circle"></i>
                <span>{userName}</span>
                <i className={`fas fa-chevron-${dropdownOpen ? 'up' : 'down'}`} style={{ marginRight: '5px', fontSize: '0.8rem' }}></i>
              </button>
              {dropdownOpen && (
                <div className="user-dropdown">
                  <Link to="/dashboard" onClick={() => setDropdownOpen(false)}>لوحة التحكم</Link>
                  <Link to="/profile" onClick={() => setDropdownOpen(false)}>الملف الشخصي</Link>
                  <button onClick={handleLogout}>تسجيل الخروج</button>
                </div>
              )}
            </div>
          )}
        </div>

        <MobileMenu isLoggedIn={isLoggedIn} userName={userName} onLogout={handleLogout} scrollToContact={scrollToContact} />
      </div>
    </header>
  );
}

export default Header;
