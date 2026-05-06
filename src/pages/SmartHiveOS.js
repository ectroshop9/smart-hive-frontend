import React, { useState } from 'react';
import './SmartHiveOS.css';

function SmartHiveOS() {
  const [active, setActive] = useState('master');

  return (
    <div className="os-page-container">
      <h1 className="os-page-title">نظام Smart Hive OS</h1>
      <p className="os-page-subtitle">شاهد النظام الحقيقي من الداخل</p>
      
      <div className="os-tabs">
        <button 
          className={`os-tab ${active === 'master' ? 'active' : ''}`}
          onClick={() => setActive('master')}
        >
          <i className="fas fa-server"></i> واجهة الماستر
        </button>
        <button 
          className={`os-tab ${active === 'slave' ? 'active' : ''}`}
          onClick={() => setActive('slave')}
        >
          <i className="fas fa-microchip"></i> واجهة السلايف
        </button>
      </div>
      
      <div className="os-frame-container">
        <iframe 
          src={`/smart-hive-os/${active}/`} 
          title={`Smart Hive ${active}`}
          className="os-iframe"
        />
      </div>
    </div>
  );
}

export default SmartHiveOS;