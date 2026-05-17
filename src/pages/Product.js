import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Product.css';

function Product() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const features = [
    { icon: 'wifi', title: t('product.features.mesh.title'), description: t('product.features.mesh.desc') },
    { icon: 'microchip', title: t('product.features.chip.title'), description: t('product.features.chip.desc') },
    { icon: 'battery-full', title: t('product.features.battery.title'), description: t('product.features.battery.desc') },
    { icon: 'cloud-upload-alt', title: t('product.features.ota.title'), description: t('product.features.ota.desc') },
    { icon: 'shield-alt', title: t('product.features.security.title'), description: t('product.features.security.desc') },
    { icon: 'brain', title: t('product.features.ai.title'), description: t('product.features.ai.desc') },
  ];

  return (
    <div className="page-container hex-bg">
      <div className="container">
        <div className="page-header">
          <h1 className="text-gradient">{t('product.title')}</h1>
          <p className="page-subtitle">{t('product.subtitle')}</p>
        </div>

        <div className="products-showcase">
          {/* ماستر */}
          <div className="product-hero">
            <div className="product-hero-content">
              <h2>{t('product.master.title')}</h2>
              <p className="product-description">{t('product.master.desc')}</p>
              <ul className="product-specs">
                {t('product.master.specs', { returnObjects: true }).map((spec, i) => (
                  <li key={i}><i className="fas fa-check-circle"></i> {spec}</li>
                ))}
              </ul>
              <div className="product-price">
                <span className="price">$299</span>
                <button className="btn-gold" onClick={() => navigate('/store')}>
                  <i className="fas fa-shopping-cart"></i> {t('product.buyNow')}
                </button>
              </div>
            </div>
            <div className="product-hero-image">
              <div className="hex-placeholder">
                <i className="fas fa-server"></i>
                <span>{t('product.master.label')}</span>
              </div>
            </div>
          </div>

          {/* سلايف */}
          <div className="product-hero reverse">
            <div className="product-hero-image">
              <div className="hex-placeholder">
                <i className="fas fa-hive"></i>
                <span>{t('product.slave.label')}</span>
              </div>
            </div>
            <div className="product-hero-content">
              <h2>{t('product.slave.title')}</h2>
              <p className="product-description">{t('product.slave.desc')}</p>
              <ul className="product-specs">
                {t('product.slave.specs', { returnObjects: true }).map((spec, i) => (
                  <li key={i}><i className="fas fa-check-circle"></i> {spec}</li>
                ))}
              </ul>
              <div className="product-price">
                <span className="price">$149</span>
                <button className="btn-gold" onClick={() => navigate('/store')}>
                  <i className="fas fa-shopping-cart"></i> {t('product.buyNow')}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="features-section">
          <h2 className="section-title text-gradient">{t('product.featuresTitle')}</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  <i className={`fas fa-${feature.icon}`}></i>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;