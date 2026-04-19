import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Tilt from 'react-parallax-tilt';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', address: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true, offset: 100 });
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('رسالة:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const features = [
    { icon: 'wifi', title: 'اتصال Mesh محلي', description: 'شبكة قوية بين الأجهزة بدون إنترنت' },
    { icon: 'cloud-upload-alt', title: 'تحديثات OTA', description: 'تحديث عن بعد بدون فتح الجهاز' },
    { icon: 'brain', title: 'ذكاء اصطناعي', description: 'تحليل البيانات وتنبؤات ذكية' },
    { icon: 'shield-alt', title: 'تشفير كامل', description: 'حماية بياناتك من الاختراق' },
    { icon: 'battery-full', title: 'بطارية طويلة', description: 'تدوم حتى 6 أشهر مع النوم العميق' },
    { icon: 'mobile-alt', title: 'تطبيق جوال', description: 'تابع خلاياك من أي مكان' },
  ];

  const plans = [
    { name: 'أساسية', price: '299', features: ['1 ماستر', '2 سلايف', 'دعم فني', 'تحديثات مجانية'] },
    { name: 'متقدمة', price: '499', features: ['1 ماستر', '5 سلايف', 'دعم 24/7', 'تقارير متقدمة', 'تنبيهات ذكية'], popular: true },
    { name: 'مؤسسية', price: '999', features: ['2 ماستر', '10 سلايف', 'دعم VIP', 'API مخصص', 'تدريب مباشر'] },
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero hex-bg">
        <div className="container">
          <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8} glareEnable={true} glareMaxOpacity={0.3} glareColor="#ffc107" scale={1.05}>
            <h1 className="text-gradient" data-aos="fade-down">SMART HIVE</h1>
          </Tilt>
          <p className="hero-subtitle" data-aos="fade-up" data-aos-delay="100">راقب خلايا النحل بذكاء من أي مكان</p>
          <p className="hero-description" data-aos="fade-up" data-aos-delay="200">نظام متكامل لمراقبة النحل مع ذكاء اصطناعي وتحديثات عن بعد وتقارير لحظية</p>
          <div className="hero-buttons" data-aos="fade-up" data-aos-delay="300">
            <Tilt tiltMaxAngleX={15} tiltMaxAngleY={15} scale={1.1} glareEnable={true} glareMaxOpacity={0.4} glareColor="#ffc107">
              <button className="btn-gold" onClick={() => navigate('/store')}>🔥 جرب الآن</button>
            </Tilt>
            <Tilt tiltMaxAngleX={15} tiltMaxAngleY={15} scale={1.1} glareEnable={true} glareMaxOpacity={0.2} glareColor="#ffffff">
              <button className="btn-outline">📹 شاهد الفيديو</button>
            </Tilt>
          </div>
          <div className="stats" data-aos="fade-up" data-aos-delay="400">
            <div className="stat-item"><span className="stat-number">500+</span><span className="stat-label">خلية</span></div>
            <div className="stat-item"><span className="stat-number">99%</span><span className="stat-label">دقة</span></div>
            <div className="stat-item"><span className="stat-number">24/7</span><span className="stat-label">دعم</span></div>
            <div className="stat-item"><span className="stat-number">OTA</span><span className="stat-label">تحديث</span></div>
          </div>
        </div>
      </section>

      {/* Master & Slave */}
      <section className="product-alt">
        <div className="container">
          <div className="product-row">
            <div className="product-img" data-aos="fade-right">
              <Tilt tiltMaxAngleX={12} tiltMaxAngleY={12} glareEnable={true} glareMaxOpacity={0.2} glareColor="#ffc107" scale={1.05}>
                <div className="hex-box"><i className="fas fa-server"></i><span>ماستر</span></div>
              </Tilt>
            </div>
            <div className="product-info" data-aos="fade-left">
              <h2 className="text-gradient">جهاز الماستر</h2>
              <p>وحدة التحكم الرئيسية. تتصل بالإنترنت وتستقبل البيانات من جميع السلايفات.</p>
              <ul>
                <li><i className="fas fa-check-circle"></i> معالج ESP32-S3</li>
                <li><i className="fas fa-check-circle"></i> شاشة TFT 3.5"</li>
                <li><i className="fas fa-check-circle"></i> WiFi + Mesh</li>
                <li><i className="fas fa-check-circle"></i> يدعم حتى 10 سلايف</li>
              </ul>
            </div>
          </div>
          <div className="product-row reverse">
            <div className="product-info" data-aos="fade-right">
              <h2 className="text-gradient">جهاز السلايف</h2>
              <p>وحدة مراقبة توضع داخل الخلية. تقيس الحرارة، الرطوبة، الوزن، وترسلها للماستر.</p>
              <ul>
                <li><i className="fas fa-check-circle"></i> 15 حساس مدمج</li>
                <li><i className="fas fa-check-circle"></i> بطارية 6 أشهر</li>
                <li><i className="fas fa-check-circle"></i> نوم عميق تلقائي</li>
                <li><i className="fas fa-check-circle"></i> مقاوم للماء</li>
              </ul>
            </div>
            <div className="product-img" data-aos="fade-left">
              <Tilt tiltMaxAngleX={12} tiltMaxAngleY={12} glareEnable={true} glareMaxOpacity={0.2} glareColor="#ffc107" scale={1.05}>
                <div className="hex-box"><i className="fas fa-microchip"></i><span>سلايف</span></div>
              </Tilt>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-alt hex-bg">
        <div className="container">
          <h2 className="text-gradient text-center" data-aos="fade-up">مميزات النظام</h2>
          <div className="features-grid">
            {features.map((f, i) => (
              <Tilt key={i} tiltMaxAngleX={8} tiltMaxAngleY={8} glareEnable={true} glareMaxOpacity={0.15} glareColor="#ffc107" scale={1.02}>
                <div className="feature-card" data-aos="flip-up" data-aos-delay={i * 100}>
                  <div className="feature-icon"><i className={`fas fa-${f.icon}`}></i></div>
                  <h3>{f.title}</h3>
                  <p>{f.description}</p>
                </div>
              </Tilt>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="pricing-alt">
        <div className="container">
          <h2 className="text-gradient text-center" data-aos="fade-up">الباقات والأسعار</h2>
          <div className="pricing-grid">
            {plans.map((p, i) => (
              <Tilt key={i} tiltMaxAngleX={8} tiltMaxAngleY={8} glareEnable={true} glareMaxOpacity={0.2} glareColor="#ffc107" scale={1.03}>
                <div className={`pricing-card ${p.popular ? 'popular' : ''}`} data-aos="zoom-in" data-aos-delay={i * 100}>
                  {p.popular && <div className="popular-badge">الأكثر طلباً</div>}
                  <h3>{p.name}</h3>
                  <div className="price">${p.price}</div>
                  <ul>{p.features.map((f, j) => <li key={j}><i className="fas fa-check"></i> {f}</li>)}</ul>
                  <button className={p.popular ? 'btn-gold' : 'btn-outline'} onClick={() => navigate('/store')}>اختر الباقة</button>
                </div>
              </Tilt>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section hex-bg">
        <div className="container">
          <h2 className="text-gradient text-center" data-aos="fade-up">راسلنا</h2>
          <p className="section-subtitle text-center">نحن هنا للإجابة على استفساراتك</p>
          <div className="contact-wrapper">
            <div className="contact-info-side" data-aos="fade-right">
              <div className="info-card"><i className="fas fa-phone"></i><h4>اتصل بنا</h4><p>+966 00 000 0000</p></div>
              <div className="info-card"><i className="fas fa-envelope"></i><h4>البريد الإلكتروني</h4><p>support@smarthive.com</p></div>
              <div className="info-card"><i className="fab fa-whatsapp"></i><h4>واتساب</h4><p>+966 00 000 0000</p></div>
            </div>
            <div className="contact-form-side" data-aos="fade-left">
              {submitted ? (
                <div className="success-message-large">
                  <i className="fas fa-check-circle"></i>
                  <h3>تم الإرسال بنجاح!</h3>
                  <p>سنرد عليك في أقرب وقت ممكن.</p>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-row">
                    <input type="text" name="name" placeholder="الاسم بالكامل" value={formData.name} onChange={handleChange} required />
                    <input type="email" name="email" placeholder="البريد الإلكتروني" value={formData.email} onChange={handleChange} required />
                  </div>
                  <input type="text" name="address" placeholder="العنوان" value={formData.address} onChange={handleChange} />
                  <textarea name="message" placeholder="رسالتك..." rows="5" value={formData.message} onChange={handleChange} required></textarea>
                  <button type="submit" className="btn-gold"><i className="fas fa-paper-plane"></i> إرسال الرسالة</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
