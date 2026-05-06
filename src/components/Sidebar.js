import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ userName, onLogout }) {
  const navigate = useNavigate();

  const menuItems = [
    { path: '/dashboard', icon: 'tachometer-alt', label: 'لوحة التحكم', end: true },
    { path: '/dashboard/my-hive', icon: 'hive', label: 'منحلي' },
    { path: '/dashboard/certificates', icon: 'certificate', label: 'شهادات المنشأ' },
    { path: '/dashboard/my-devices', icon: 'microchip', label: 'أجهزتي' },
    { path: '/dashboard/alerts', icon: 'bell', label: 'التنبيهات' },
    { path: '/dashboard/profile', icon: 'user-circle', label: 'حسابي' },
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
          <span className="user-role">نحال</span>
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

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={onLogout}>
          <i className="fas fa-sign-out-alt"></i>
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;