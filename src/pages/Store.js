import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Store.css';

function Store() {
  const navigate = useNavigate();

  const [products] = useState([
    { id: 1, name: 'حساس حرارة ورطوبة', price: 29, image: 'thermometer-half', category: 'sensor' },
    { id: 2, name: 'حساس وزن HX711', price: 49, image: 'weight-scale', category: 'sensor' },
    { id: 3, name: 'حساس CO2', price: 79, image: 'wind', category: 'sensor' },
    { id: 4, name: 'لوحة ESP32-S3', price: 25, image: 'microchip', category: 'board' },
    { id: 5, name: 'بطارية ليثيوم 18650', price: 19, image: 'battery-full', category: 'power' },
    { id: 6, name: 'شاحن بطاريات', price: 15, image: 'charging-station', category: 'power' },
  ]);

  const categories = ['الكل', 'sensor', 'board', 'power'];
  const [activeCategory, setActiveCategory] = useState('الكل');

  const filteredProducts = activeCategory === 'الكل' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="page-container hex-bg">
      <div className="container">
        <div className="page-header">
          <h1 className="text-gradient">المتجر</h1>
          <p className="page-subtitle">قطع غيار وإكسسوارات أصلية</p>
        </div>

        <div className="store-categories">
          {categories.map(cat => (
            <button key={cat} className={`category-btn ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>
              {cat === 'الكل' ? 'الكل' : cat === 'sensor' ? 'حساسات' : cat === 'board' ? 'لوحات' : 'طاقة'}
            </button>
          ))}
        </div>

        <div className="products-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="store-product" onClick={() => navigate(`/product/${product.id}`)}>
              <div className="product-hex-image">
                <i className={`fas fa-${product.image}`}></i>
              </div>
              <h3>{product.name}</h3>
              <p className="product-price">${product.price}</p>
              <button className="btn-order-now">
                <i className="fas fa-shopping-cart"></i> طلب الآن
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Store;
