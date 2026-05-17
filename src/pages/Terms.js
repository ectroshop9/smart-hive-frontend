import React from 'react';
import { useTranslation } from 'react-i18next';
import './Terms.css';

function Terms() {
  const { t } = useTranslation();

  return (
    <div className="page-container hex-bg">
      <div className="container">
        <div className="page-header">
          <h1 className="text-gradient">{t('terms.title')}</h1>
          <p className="page-subtitle">{t('terms.lastUpdate')}</p>
        </div>

        <div className="terms-content">
          <section className="terms-section">
            <h2>{t('terms.sections.acceptance.title')}</h2>
            <p>{t('terms.sections.acceptance.desc')}</p>
          </section>

          <section className="terms-section">
            <h2>{t('terms.sections.usage.title')}</h2>
            <p>{t('terms.sections.usage.desc')}</p>
            <ul>
              {t('terms.sections.usage.items', { returnObjects: true }).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="terms-section">
            <h2>{t('terms.sections.accounts.title')}</h2>
            <p>{t('terms.sections.accounts.desc')}</p>
            <ul>
              {t('terms.sections.accounts.items', { returnObjects: true }).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="terms-section">
            <h2>{t('terms.sections.orders.title')}</h2>
            <p>{t('terms.sections.orders.desc')}</p>
            <ul>
              {t('terms.sections.orders.items', { returnObjects: true }).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="terms-section">
            <h2>{t('terms.sections.ip.title')}</h2>
            <p>{t('terms.sections.ip.desc')}</p>
          </section>

          <section className="terms-section">
            <h2>{t('terms.sections.liability.title')}</h2>
            <p>{t('terms.sections.liability.desc')}</p>
            <ul>
              {t('terms.sections.liability.items', { returnObjects: true }).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="terms-section">
            <h2>{t('terms.sections.law.title')}</h2>
            <p>{t('terms.sections.law.desc')}</p>
          </section>

          <section className="terms-section">
            <h2>{t('terms.sections.modifications.title')}</h2>
            <p>{t('terms.sections.modifications.desc')}</p>
          </section>

          <section className="terms-section">
            <h2>{t('terms.sections.contact.title')}</h2>
            <p>{t('terms.sections.contact.desc')}</p>
            <p>📧 support@smarthive.com</p>
            <p>📞 0673310066</p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Terms;