import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './SmartHiveOS.css';

function SmartHiveOS() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    localStorage.setItem('os-language', i18n.language);
  }, [i18n.language]);

  return (
    <div className="os-page-container">
      <h1 className="os-page-title">{t('os.title')}</h1>
      <p className="os-page-subtitle">{t('os.subtitle')}</p>
      
      <div className="os-frame-container">
        <iframe 
          src="/smart-hive-os/master/" 
          title="Smart Hive OS"
          className="os-iframe"
        />
      </div>
    </div>
  );
}

export default SmartHiveOS;