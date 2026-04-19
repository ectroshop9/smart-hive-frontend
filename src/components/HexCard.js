import React from 'react';
import './HexCard.css';

function HexCard({ icon, title, description }) {
  return (
    <div className="hex-card">
      <div className="hex-icon">
        <i className={icon}></i>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default HexCard;
