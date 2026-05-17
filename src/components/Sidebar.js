import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Sidebar.css';

function Sidebar({ userName, onLogout }) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  const menuItems = [
    { path: '/dashboard', icon: 'tachometer-alt', label: t('sidebar.dashboard'), end: true },
    { path: '/dashboard/my-hive', icon: 'hive', label: t('sidebar.myHive') },
    { path: '/dashboard/certificates', icon: 'certificate', label: t('sidebar.certificates') },
    { path: '/dashboard/my-devices', icon: 'microchip', label: t('sidebar.myDevices') },
    { path: '/dashboard/alerts', icon: 'bell', label: t('sidebar.alerts') },
    { path: '/dashboard/profile', icon: 'user-circle', label: t('sidebar.profile') },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo" onClick={() => navigate('/')}>
          <i className="fas fa-hive"></i>
          <span>SMART HIVE</span>
        </div>
      </div>

      <div className="sidebar-user">
        <div className="user-avatar">
          <i className="fas fa-user-circle"></i>
        </div>
        <div className="user-info">
          <span className="user-name">{userName}</span>
          <span className="user-role">{t('sidebar.role')}</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            end={item.end}
          >
            <i className={`fas fa-${item.icon}`}></i>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* زر تبديل اللغة */}
      <div className="sidebar-lang-switcher">
        <button className="lang-toggle-btn" onClick={toggleLanguage}>
          <i className="fas fa-language"></i>
          <span>{i18n.language === 'ar' ? 'English' : 'العربية'}</span>
        </button>
      </div>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={onLogout}>
          <i className="fas fa-sign-out-alt"></i>
          <span>{t('sidebar.logout')}</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;