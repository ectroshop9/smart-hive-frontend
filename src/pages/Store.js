import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Store.css';

function Store() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('الكل');

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

  const categories = ['الكل', ...new Set(products.map(p => p.category))];

  const filteredProducts = activeCategory === 'الكل' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  if (loading) {
    return (
      <div className="page-container hex-bg">
        <div className="container">
          <div className="loading">جاري تحميل المنتجات...</div>
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
              {cat === 'الكل' ? 'الكل' : cat === 'SENSOR' ? 'حساسات' : cat === 'BOARD' ? 'لوحات' : cat === 'CABLE' ? 'كوابل' : 'إكسسوارات'}
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
              <p className="product-price">{product.price}دج</p>
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
