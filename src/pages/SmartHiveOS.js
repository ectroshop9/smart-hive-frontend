import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './SmartHiveOS.css';

function SmartHiveOS() {
  const { t } = useTranslation();
  const [active, setActive] = useState('master');

  return (
    <div className="os-page-container">
      <h1 className="os-page-title">{t('os.title')}</h1>
      <p className="os-page-subtitle">{t('os.subtitle')}</p>
      
      <div className="os-tabs">
        <button 
          className={`os-tab ${active === 'master' ? 'active' : ''}`}
          onClick={() => setActive('master')}
        >
          <i className="fas fa-server"></i> {t('os.master')}
        </button>
        <button 
          className={`os-tab ${active === 'slave' ? 'active' : ''}`}
          onClick={() => setActive('slave')}
        >
          <i className="fas fa-microchip"></i> {t('os.slave')}
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