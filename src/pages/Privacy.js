import React from 'react';
import { useTranslation } from 'react-i18next';
import './Privacy.css';

function Privacy() {
  const { t } = useTranslation();

  return (
    <div className="page-container hex-bg">
      <div className="container">
        <div className="page-header">
          <h1 className="text-gradient">{t('privacy.title')}</h1>
          <p className="page-subtitle">{t('privacy.lastUpdate')}</p>
        </div>

        <div className="policy-content">
          <section className="policy-section">
            <h2>{t('privacy.sections.collect.title')}</h2>
            <p>{t('privacy.sections.collect.desc')}</p>
            <ul>
              {t('privacy.sections.collect.items', { returnObjects: true }).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="policy-section">
            <h2>{t('privacy.sections.usage.title')}</h2>
            <p>{t('privacy.sections.usage.desc')}</p>
            <ul>
              {t('privacy.sections.usage.items', { returnObjects: true }).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="policy-section">
            <h2>{t('privacy.sections.protection.title')}</h2>
            <p>{t('privacy.sections.protection.desc')}</p>
            <ul>
              {t('privacy.sections.protection.items', { returnObjects: true }).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="policy-section">
            <h2>{t('privacy.sections.cookies.title')}</h2>
            <p>{t('privacy.sections.cookies.desc')}</p>
          </section>

          <section className="policy-section">
            <h2>{t('privacy.sections.rights.title')}</h2>
            <p>{t('privacy.sections.rights.desc')}</p>
            <ul>
              {t('privacy.sections.rights.items', { returnObjects: true }).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="policy-section">
            <h2>{t('privacy.sections.contact.title')}</h2>
            <p>{t('privacy.sections.contact.desc')}</p>
            <p>📧 support@smarthive.com</p>
            <p>📞 0673310066</p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Privacy;