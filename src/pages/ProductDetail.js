import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { algeriaCities } from '../data/algeriaCities';
import './ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [orderData, setOrderData] = useState({
    fullName: localStorage.getItem('lastFullName') || '',
    phone: localStorage.getItem('lastPhone') || '',
    wilayaId: '', commune: '', address: ''
  });

  const API_URL = process.env.REACT_APP_API_URL;
  const user_id = localStorage.getItem('user_id') || 'BEEK-GUEST';

  useEffect(() => {
    fetch(`${API_URL}/api/store/api/products/${id}/`)
      .then(res => res.json())
      .then(data => {
        setProduct({
          id: data.product_id,
          name: data.name,
          price: parseFloat(data.price),
          description: data.description,
          category: data.category,
          stock: data.stock_quantity,
          image: data.image_url || 'box'
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, API_URL]);

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    const phoneRegex = /^(05|06|07)[0-9]{8}$/;
    if (!phoneRegex.test(orderData.phone)) {
      alert('رقم الهاتف غير صحيح. يجب أن يبدأ بـ 05 أو 06 أو 07 ويتكون من 10 أرقام');
      return;
    }
    
    setIsSubmitting(true);
    
    const selectedWilaya = algeriaCities[orderData.wilayaId];
    const shippingAddress = `${orderData.address || ''}, ${orderData.commune}, ${selectedWilaya?.name || ''}`;
    
    const orderPayload = {
      full_name: orderData.fullName,
      phone: orderData.phone,
      user_id: user_id,
      shipping_address: shippingAddress,
      items: [{ product_id: product.id, quantity: quantity }]
    };

    try {
      const response = await fetch(`${API_URL}/api/store/api/orders/create/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        setTimeout(() => navigate('/store'), 3000);
      } else {
        alert('فشل إنشاء الطلب: ' + JSON.stringify(data));
      }
    } catch (err) {
      alert('فشل الاتصال: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field, value) => {
    setOrderData({ ...orderData, [field]: value });
    if (field === 'fullName') localStorage.setItem('lastFullName', value);
    if (field === 'phone') localStorage.setItem('lastPhone', value);
  };

  if (loading) return <div className="page-container"><div className="container">جاري التحميل...</div></div>;
  if (!product) return <div className="page-container"><div className="container">المنتج غير موجود</div></div>;

  const totalPrice = product.price * quantity;

  if (submitted) {
    return (
      <div className="page-container">
        <div className="container">
          <div className="success-card">
            <div className="success-icon"><i className="fas fa-check-circle"></i></div>
            <h2>تم استلام طلبك بنجاح!</h2>
            <p>شكراً {orderData.fullName}، سنتواصل معك قريباً</p>
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

        <div className="product-detail-modern">
          <div className="product-image-section">
            <div className="product-main-image">
              <i className={`fas fa-${product.image}`}></i>
            </div>
          </div>

          <div className="product-info-section">
            <div className="product-category-badge">{product.category}</div>
            <h1 className="product-title">{product.name}</h1>
            <p className="product-desc">{product.description}</p>
            
            <div className="product-price-box">
              <span className="current-price">{product.price} دج</span>
              <span className="stock-badge">✓ {product.stock} قطعة متوفرة</span>
            </div>

            <div className="free-shipping-badge">
              <i className="fas fa-truck"></i> شحن مجاني لجميع الولايات
            </div>

            <form onSubmit={handleSubmitOrder} className="compact-order-form">
              <div className="form-row-compact">
                <input type="text" placeholder="الاسم بالكامل" value={orderData.fullName} onChange={(e) => updateField('fullName', e.target.value)} required />
                <input type="tel" placeholder="رقم الهاتف" value={orderData.phone} onChange={(e) => updateField('phone', e.target.value)} required />
              </div>

              <div className="form-row-compact">
                <select value={orderData.wilayaId} onChange={(e) => setOrderData({...orderData, wilayaId: e.target.value, commune: ''})} required>
                  <option value="">اختر الولاية</option>
                  {Object.keys(algeriaCities).map(id => (
                    <option key={id} value={id}>{id} - {algeriaCities[id].name}</option>
                  ))}
                </select>
                <select 
                  value={orderData.commune} 
                  onChange={(e) => setOrderData({...orderData, commune: e.target.value})} 
                  disabled={!orderData.wilayaId} 
                  required
                >
                  <option value="">اختر البلدية</option>
                  {orderData.wilayaId && algeriaCities[orderData.wilayaId].communes.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <input type="text" placeholder="العنوان التفصيلي (اختياري)" value={orderData.address} onChange={(e) => setOrderData({...orderData, address: e.target.value})} />

              <div className="quantity-row">
                <span>الكمية:</span>
                <div className="quantity-control">
                  <button type="button" onClick={() => quantity > 1 && setQuantity(quantity - 1)}>−</button>
                  <span>{quantity}</span>
                  <button type="button" onClick={() => quantity < product.stock && setQuantity(quantity + 1)}>+</button>
                </div>
              </div>

              <div className="invoice-box">
                <div className="invoice-row">
                  <span>سعر المنتج:</span>
                  <span>{product.price * quantity} دج</span>
                </div>
                <div className="invoice-row">
                  <span>الشحن:</span>
                  <span style={{ color: 'var(--neon-green)' }}>مجاني</span>
                </div>
                <div className="invoice-row total">
                  <span>الإجمالي:</span>
                  <strong>{totalPrice} دج</strong>
                </div>
              </div>

              <button type="submit" className="btn-order-submit" disabled={isSubmitting}>
                <i className="fas fa-shopping-cart"></i> {isSubmitting ? 'جاري الإرسال...' : 'طلب الآن'}
              </button>

              <p className="payment-note">
                <i className="fas fa-hand-holding-usd"></i> الدفع عند الاستلام
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
