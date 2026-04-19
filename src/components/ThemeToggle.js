import React, { useState, useEffect } from 'react';
import './ThemeToggle.css';

function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'light') {
      setIsDark(false);
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    setIsDark(!isDark);
  };

  return (
    <button className="theme-toggle" onClick={toggleTheme} title={isDark ? 'الوضع النهاري' : 'الوضع الليلي'}>
      <i className={`fas fa-${isDark ? 'sun' : 'moon'}`}></i>
    </button>
  );
}

export default ThemeToggle;
