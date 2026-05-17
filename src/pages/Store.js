import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Store.css';

function Store() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/api/store/api/products/`)
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(p => ({
          id: p.product_id,
          name: p.name,
          price: parseFloat(p.price),
          image: p.image_url || 'box',
          category: p.category,
          stock: p.stock_quantity
        }));
        setProducts(formatted);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch products:', err);
        setLoading(false);
      });
  }, [API_URL]);

  const categories = ['all', ...new Set(products.map(p => p.category))];

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const categoryLabels = {
    'all': t('store.categories.all'),
    'SENSOR': t('store.categories.sensors'),
    'BOARD': t('store.categories.boards'),
    'CABLE': t('store.categories.cables'),
    'ACCESSORY': t('store.categories.accessories')
  };

  if (loading) {
    return (
      <div className="page-container hex-bg">
        <div className="container">
          <div className="loading">{t('store.loading')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container hex-bg">
      <div className="container">
        <div className="store-categories">
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {categoryLabels[cat] || cat}
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
              <p className="product-price">{product.price} {t('store.currency')}</p>
              <button className="btn-order-now">
                <i className="fas fa-shopping-cart"></i> {t('store.orderNow')}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Store;