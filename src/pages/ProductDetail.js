import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const products = {
    1: { 
      id: 1, 
      name: 'حساس حرارة ورطوبة DHT22', 
      price: 29, 
      category: 'حساسات', 
      description: 'حساس عالي الدقة لقياس درجة الحرارة والرطوبة.',
      stock: 15,
      rating: 4.7,
      images: ['thermometer-half', 'temperature-high'],
      features: ['دقة ±0.5°C', 'نطاق -40 إلى 80°C'],
      specs: { 'نطاق الحرارة': '-40°C إلى 80°C', 'دقة الحرارة': '±0.5°C' }
    },
    2: { 
      id: 2, 
      name: 'حساس وزن HX711', 
      price: 49, 
      category: 'حساسات', 
      description: 'مضخم إشارة لخلايا الوزن.',
      stock: 8,
      rating: 4.8,
      images: ['weight-scale', 'balance-scale'],
      features: ['دقة 24-bit', 'معدل تحديث 80Hz'],
      specs: { 'الدقة': '24-bit', 'جهد التشغيل': '2.7V - 5.5V' }
    },
    4: { 
      id: 4, 
      name: 'لوحة ESP32-S3', 
      price: 25, 
      category: 'لوحات', 
      description: 'لوحة تطوير ESP32-S3.',
      stock: 12,
      rating: 4.9,
      images: ['microchip', 'wifi'],
      features: ['WiFi 6', 'Bluetooth 5'],
      specs: { 'المعالج': '240MHz', 'الذاكرة': '512KB SRAM' }
    },
  };

  const product = products[id] || products[1];
  const totalPrice = product.price * quantity;

  const [orderData, setOrderData] = useState({
    fullName: '', phone: '', wilaya: '', commune: '', address: '', notes: ''
  });

  const wilayas = [
    { id: 16, name: 'الجزائر', communes: ['الجزائر الوسطى', 'باب الوادي'] },
    { id: 31, name: 'وهران', communes: ['وهران', 'السانية'] },
  ];

  const [selectedWilaya, setSelectedWilaya] = useState(null);
  const [availableCommunes, setAvailableCommunes] = useState([]);

  const handleWilayaChange = (wilayaId) => {
    const wilaya = wilayas.find(w => w.id === parseInt(wilayaId));
    setSelectedWilaya(wilaya);
    setAvailableCommunes(wilaya ? wilaya.communes : []);
    setOrderData({ ...orderData, wilaya: wilaya ? wilaya.name : '', commune: '' });
  };

  const nextStep = () => {
    if (currentStep === 1 && orderData.fullName && orderData.phone) setCurrentStep(2);
    else if (currentStep === 2 && orderData.wilaya && orderData.commune && orderData.address) setCurrentStep(3);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => navigate('/'), 3000);
  };

  const renderStars = (rating) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  if (submitted) {
    return (
      <div className="page-container hex-bg">
        <div className="container">
          <div className="success-message">
            <div className="success-icon"><i className="fas fa-check-circle"></i></div>
            <h2 className="text-gradient">تم استلام طلبك بنجاح!</h2>
            <p>شكراً {orderData.fullName} على طلبك</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container hex-bg">
      <div className="container">
        <button className="btn-back" onClick={() => navigate('/store')}>
          <i className="fas fa-arrow-right"></i> العودة للمتجر
        </button>

        <div className="product-detail">
          <div className="product-gallery">
            <div className="main-image">
              <i className={`fas fa-${product.images[selectedImage]}`}></i>
            </div>
            <div className="thumbnail-list">
              {product.images.map((img, idx) => (
                <div key={idx} className={`thumbnail ${selectedImage === idx ? 'active' : ''}`} onClick={() => setSelectedImage(idx)}>
                  <i className={`fas fa-${img}`}></i>
                </div>
              ))}
            </div>
          </div>

          <div className="product-info">
            <div className="product-category">{product.category}</div>
            <h1 className="text-gradient">{product.name}</h1>
            <div className="product-rating">
              <span className="stars">{renderStars(product.rating)}</span>
              <span className="rating-value">{product.rating}</span>
            </div>
            <div className="product-price-large">${product.price}</div>
            <p className="product-description">{product.description}</p>
            <div className="product-features">
              {product.features.map((f, i) => <div key={i} className="feature-item"><i className="fas fa-check-circle"></i><span>{f}</span></div>)}
            </div>
            <div className="product-stock">
              <i className="fas fa-check-circle"></i> {product.stock} قطعة متوفرة
            </div>
            {!showOrderForm && (
              <div className="product-actions">
                <div className="quantity-selector">
                  <button onClick={() => quantity > 1 && setQuantity(quantity - 1)}>-</button>
                  <span>{quantity}</span>
                  <button onClick={() => quantity < product.stock && setQuantity(quantity + 1)}>+</button>
                </div>
                <button className="btn-buy-now" onClick={() => setShowOrderForm(true)}>
                  <i className="fas fa-shopping-cart"></i> طلب الآن
                </button>
              </div>
            )}
          </div>
        </div>

        {showOrderForm && (
          <div className="order-form-section">
            <h2 className="form-title text-gradient">إتمام الطلب</h2>
            <div className="order-summary-bar">
              <span><strong>{product.name}</strong> × {quantity}</span>
              <span className="total-price">الإجمالي: ${totalPrice}</span>
            </div>
            <div className="step-progress">
              <div className={`step ${currentStep >= 1 ? 'active' : ''}`}><span className="step-number">1</span><span className="step-label">المعلومات</span></div>
              <div className={`step-line ${currentStep >= 2 ? 'active' : ''}`}></div>
              <div className={`step ${currentStep >= 2 ? 'active' : ''}`}><span className="step-number">2</span><span className="step-label">العنوان</span></div>
              <div className={`step-line ${currentStep >= 3 ? 'active' : ''}`}></div>
              <div className={`step ${currentStep >= 3 ? 'active' : ''}`}><span className="step-number">3</span><span className="step-label">تأكيد</span></div>
            </div>

            <form onSubmit={handleSubmit}>
              {currentStep === 1 && (
                <div className="step-content">
                  <div className="form-row">
                    <div className="form-group"><label>الاسم الكامل *</label><input type="text" value={orderData.fullName} onChange={(e) => setOrderData({...orderData, fullName: e.target.value})} /></div>
                    <div className="form-group"><label>رقم الهاتف *</label><input type="tel" value={orderData.phone} onChange={(e) => setOrderData({...orderData, phone: e.target.value})} /></div>
                  </div>
                </div>
              )}
              {currentStep === 2 && (
                <div className="step-content">
                  <div className="form-row">
                    <div className="form-group"><label>الولاية *</label><select value={selectedWilaya?.id || ''} onChange={(e) => handleWilayaChange(e.target.value)}><option value="">اختر الولاية</option>{wilayas.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}</select></div>
                    <div className="form-group"><label>البلدية *</label><select value={orderData.commune} onChange={(e) => setOrderData({...orderData, commune: e.target.value})} disabled={!selectedWilaya}><option value="">اختر البلدية</option>{availableCommunes.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                  </div>
                  <div className="form-group"><label>العنوان التفصيلي *</label><textarea value={orderData.address} onChange={(e) => setOrderData({...orderData, address: e.target.value})} rows="2"></textarea></div>
                </div>
              )}
              {currentStep === 3 && (
                <div className="step-content">
                  <div className="order-review">
                    <h4>مراجعة الطلب</h4>
                    <div className="review-item"><span>المنتج:</span><strong>{product.name} × {quantity}</strong></div>
                    <div className="review-item"><span>الإجمالي:</span><strong>${totalPrice}</strong></div>
                    <div className="review-item"><span>الاسم:</span><strong>{orderData.fullName}</strong></div>
                    <div className="review-item"><span>الهاتف:</span><strong>{orderData.phone}</strong></div>
                  </div>
                </div>
              )}
              <div className="payment-info"><i className="fas fa-hand-holding-usd"></i><span>الدفع عند الاستلام</span></div>
              <div className="form-actions">
                {currentStep > 1 && <button type="button" className="btn-secondary" onClick={() => setCurrentStep(currentStep - 1)}>السابق</button>}
                <button type="button" className="btn-cancel" onClick={() => setShowOrderForm(false)}>إلغاء</button>
                {currentStep < 3 ? <button type="button" className="btn-submit" onClick={nextStep}>التالي</button> : <button type="submit" className="btn-submit">تأكيد الطلب</button>}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;
