import React from 'react';
import './HexButton.css';

function HexButton({ children, onClick, variant = 'primary' }) {
  return (
    <button className={`hex-btn hex-btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  );
}

export default HexButton;
