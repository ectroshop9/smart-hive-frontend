import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Product.css';

function Product() {
  const navigate = useNavigate();
  
  const features = [
    { icon: 'wifi', title: 'اتصال Mesh', description: 'شبكة محلية قوية بدون إنترنت' },
    { icon: 'microchip', title: 'معالج ESP32-S3', description: 'أداء عالي واستهلاك منخفض' },
    { icon: 'battery-full', title: 'بطارية تدوم طويلاً', description: 'نوم عميق تلقائي لتوفير الطاقة' },
    { icon: 'cloud-upload-alt', title: 'تحديثات OTA', description: 'تحديث عن بعد بدون فتح الجهاز' },
    { icon: 'shield-alt', title: 'تشفير البيانات', description: 'حماية كاملة لبياناتك' },
    { icon: 'brain', title: 'ذكاء اصطناعي', description: 'تحليل البيانات وتنبؤات ذكية' },
  ];

  return (
    <div className="page-container hex-bg">
      <div className="container">
        <div className="page-header">
          <h1 className="text-gradient">ماستر وسلايف</h1>
          <p className="page-subtitle">أجهزة ذكية لمراقبة خلايا النحل</p>
        </div>

        <div className="products-showcase">
          <div className="product-hero">
            <div className="product-hero-content">
              <h2>جهاز الماستر</h2>
              <p className="product-description">
                وحدة التحكم الرئيسية. تتصل بالإنترنت وتستقبل البيانات من جميع السلايفات.
                مزودة بشاشة LCD و WiFi و Mesh.
              </p>
              <ul className="product-specs">
                <li><i className="fas fa-check-circle"></i> معالج ESP32-S3</li>
                <li><i className="fas fa-check-circle"></i> شاشة TFT 3.5"</li>
                <li><i className="fas fa-check-circle"></i> WiFi + Bluetooth</li>
                <li><i className="fas fa-check-circle"></i> يدعم حتى 10 سلايف</li>
                <li><i className="fas fa-check-circle"></i> تحديثات OTA</li>
              </ul>
              <div className="product-price">
                <span className="price">$299</span>
                <button className="btn-gold" onClick={() => navigate('/store')}>
                  <i className="fas fa-shopping-cart"></i> شراء الآن
                </button>
              </div>
            </div>
            <div className="product-hero-image">
              <div className="hex-placeholder">
                <i className="fas fa-server"></i>
                <span>ماستر</span>
              </div>
            </div>
          </div>

          <div className="product-hero reverse">
            <div className="product-hero-image">
              <div className="hex-placeholder">
                <i className="fas fa-hive"></i>
                <span>سلايف</span>
              </div>
            </div>
            <div className="product-hero-content">
              <h2>جهاز السلايف</h2>
              <p className="product-description">
                وحدة مراقبة توضع داخل الخلية. تقيس الحرارة، الرطوبة، الوزن، الصوت، وترسلها للماستر.
              </p>
              <ul className="product-specs">
                <li><i className="fas fa-check-circle"></i> 15 حساس مدمج</li>
                <li><i className="fas fa-check-circle"></i> بطارية تدوم 6 أشهر</li>
                <li><i className="fas fa-check-circle"></i> نوم عميق تلقائي</li>
                <li><i className="fas fa-check-circle"></i> مقاوم للماء والغبار</li>
                <li><i className="fas fa-check-circle"></i> تحديثات OTA عبر الماستر</li>
              </ul>
              <div className="product-price">
                <span className="price">$149</span>
                <button className="btn-gold" onClick={() => navigate('/store')}>
                  <i className="fas fa-shopping-cart"></i> شراء الآن
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="features-section">
          <h2 className="section-title text-gradient">المميزات</h2>
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
