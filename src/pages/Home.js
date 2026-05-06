import React, { useEffect, useState, useRef } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Home.css';



function Home() {
  const [phase, setPhase] = useState('intro');
  const [showCTA, setShowCTA] = useState(false);
  const [orderStep, setOrderStep] = useState(1);
  const [orderData, setOrderData] = useState({ hives: '', beeType: '', location: '', name: '', phone: '', email: '' });
  const [orderErrors, setOrderErrors] = useState({});
  const heroRef = useRef(null);
  const storyRef = useRef(null);

  useEffect(() => { AOS.init({ duration: 800, once: true, offset: 100 }); }, []);

  const validatePhone = (phone) => /^(05|06|07)[0-9]{8}$/.test(phone);
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleIntroEnded = () => {
    setPhase('hero');
    setTimeout(() => { if (heroRef.current) heroRef.current.play(); setShowCTA(true); }, 150);
  };

  const scrollToStory = () => storyRef.current?.scrollIntoView({ behavior: 'smooth' });

  const handleOrderChange = (e) => {
    setOrderData({ ...orderData, [e.target.name]: e.target.value });
    if (orderErrors[e.target.name]) setOrderErrors({ ...orderErrors, [e.target.name]: '' });
  };

  const validateOrderStep = (step) => {
    const errors = {};
    if (step === 1) { if (!orderData.hives) errors.hives = 'اختر عدد الخلايا'; if (!orderData.beeType) errors.beeType = 'اختر نوع النحل'; }
    else if (step === 2) { if (!orderData.location.trim()) errors.location = 'الموقع مطلوب'; }
    else if (step === 3) {
      if (!orderData.name.trim()) errors.name = 'الاسم مطلوب';
      if (!validatePhone(orderData.phone)) errors.phone = 'رقم هاتف جزائري غير صالح';
      if (!validateEmail(orderData.email)) errors.email = 'بريد إلكتروني غير صالح';
    }
    setOrderErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => { if (validateOrderStep(orderStep)) setOrderStep(orderStep + 1); };
  const prevStep = () => setOrderStep(orderStep - 1);

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    if (!validateOrderStep(3)) return;
    alert('✅ تم استلام طلبك! سنتواصل معك قريباً.');
    setOrderData({ hives: '', beeType: '', location: '', name: '', phone: '', email: '' });
    setOrderStep(1);
  };

  const sensorGroups = [
    {
      icon: 'temperature-high',
      title: '🌡️ حساسات المناخ (7)',
      desc: 'حرارة (3 أنواع) - رطوبة - ثاني أكسيد الكربون - ضوء - أشعة فوق بنفسجية',
    },
    {
      icon: 'ear-listen',
      title: '🔊 حساسات المراقبة (3)',
      desc: 'صوت - اهتزاز - حركة',
    },
    {
      icon: 'weight-scale',
      title: '⚖️ حساسات الإنتاج (2)',
      desc: 'ميزان - عداد النحل',
    },
    {
      icon: 'battery-full',
      title: '🔋 حساسات النظام (1)',
      desc: 'حساس البطارية',
    },
  ];

  const features = [
    { icon: 'wifi', title: 'اتصال Mesh محلي', desc: 'شبكة قوية بين الأجهزة بدون إنترنت' },
    { icon: 'cloud-upload-alt', title: 'تحديثات OTA', desc: 'تحديث عن بعد بدون فتح الجهاز' },
    { icon: 'brain', title: 'ذكاء اصطناعي', desc: 'تحليل البيانات وتنبؤات ذكية' },
    { icon: 'shield-alt', title: 'تشفير كامل', desc: 'حماية بياناتك من الاختراق' },
    { icon: 'battery-full', title: 'بطارية طويلة', desc: 'تدوم حتى 6 أشهر مع النوم العميق' },
    { icon: 'mobile-alt', title: 'تطبيق جوال', desc: 'تابع خلاياك من أي مكان' },
  ];

  

  const warrantyItems = [
    { icon: 'shield-alt', title: 'ضمان شامل', desc: 'سنتين على جميع المكونات' },
    { icon: 'file-contract', title: 'ترخيص رسمي', desc: 'منتج مسجل ومعتمد قانونياً' },
    { icon: 'headset', title: 'دعم فني 24/7', desc: 'فريق متخصص للرد على استفساراتك' },
    { icon: 'undo-alt', title: 'استرجاع 30 يوم', desc: 'ضمان استرجاع كامل للمبلغ' },
  ];

  return (
    <div className="landing-page">
      <section className="hero-video">
        {phase === 'intro' && (
          <video className="hero-video-bg" poster="/images/hero-poster.jpg" autoPlay muted playsInline preload="auto" onEnded={handleIntroEnded}>
            <source src="/intro.mp4" type="video/mp4" />
          </video>
        )}
        {phase === 'hero' && (
          <video ref={heroRef} className="hero-video-bg fade-in" poster="/images/hero-poster.jpg" autoPlay muted loop playsInline preload="auto">
            <source src="/hero.mp4" type="video/mp4" />
          </video>
        )}
        <div className="hero-video-overlay"></div>
        {showCTA && (
          <div className="scroll-indicator" onClick={scrollToStory} title="اكتشف قصتنا">
            <i className="fas fa-chevron-down"></i>
          </div>
        )}
      </section>

      <section className="story-section hex-bg" ref={storyRef}>
        <div className="container">
          <div className="story-grid">
            <div className="story-image" data-aos="fade-right">
              <img src="/story.png" alt="النحال في المنحل" style={{ width: '100%', borderRadius: 16 }} />
            </div>
            <div className="story-content" data-aos="fade-left">
              <h2 className="section-title">لماذا SMART HIVE؟</h2>
              <p className="story-text">النحال التقليدي يعاني من المسافات الطويلة بين المناحل، ويقضي ساعات يومياً في التنقل لمراقبة الخلايا. مع Smart Hive، يمكنك مراقبة كل خلاياك من هاتفك وأنت في منزلك. وفر وقتك وجهدك، وركز على ما يهم حقاً - إنتاج عسل عالي الجودة.</p>
              <ul className="story-points">
                <li><i className="fas fa-check-circle"></i> مراقبة جميع الخلايا من مكان واحد</li>
                <li><i className="fas fa-check-circle"></i> تنبيهات فورية عند أي مشكلة</li>
                <li><i className="fas fa-check-circle"></i> توفير 90% من وقت التنقل بين المناحل</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      

      <section className="sensors-section hex-bg">
        <div className="container">
          <h2 className="section-title" data-aos="fade-up">📊 مؤشرات المراقبة</h2>
          <p className="section-subtitle text-center" data-aos="fade-up">15 حساس في جهاز واحد</p>
          <div className="features-list">
            {sensorGroups.map((group, i) => (
              <div key={i} className="feature-row" data-aos="fade-up" data-aos-delay={i * 100}>
                <div className="feature-row-icon"><i className={`fas fa-${group.icon}`}></i></div>
                <div className="feature-row-text">
                  <h3>{group.title}</h3>
                  <p>{group.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mesh-section">
        <div className="container">
          <h2 className="section-title" data-aos="fade-up">شبكة Mesh الذكية</h2>
          <p className="section-subtitle text-center" data-aos="fade-up">كيف تتصل الأجهزة ببعضها البعض؟</p>
          <div className="mesh-diagram" data-aos="zoom-in">
            <img src="/mesh-network.png" alt="شبكة Mesh" style={{ maxWidth: '100%', borderRadius: 16 }} />
          </div>
          <div className="mesh-info" data-aos="fade-up"><p>الماستر يتصل بالسلايفات عبر شبكة Mesh محلية، وتصل البيانات إلى هاتفك عبر WiFi.</p></div>
        </div>
      </section>

      <section className="features-alt">
        <div className="container">
          <h2 className="section-title" data-aos="fade-up">مميزات النظام</h2>
          <div className="features-list">
            {features.map((f, i) => (
              <div key={i} className="feature-row" data-aos="fade-up" data-aos-delay={i * 100}>
                <div className="feature-row-icon"><i className={`fas fa-${f.icon}`}></i></div>
                <div className="feature-row-text"><h3>{f.title}</h3><p>{f.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="warranty-section hex-bg">
        <div className="container">
          <h2 className="section-title" data-aos="fade-up">ضمان وأمان</h2>
          <p className="section-subtitle text-center" data-aos="fade-up">نحن نضمن لك راحة البال</p>
          <div className="warranty-strip">
            {warrantyItems.map((item, i) => (
              <div key={i} className="warranty-strip-item" data-aos="fade-up" data-aos-delay={i * 100}>
                <div className="warranty-strip-icon"><i className={`fas fa-${item.icon}`}></i></div>
                <div className="warranty-strip-text"><h3>{item.title}</h3><p>{item.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="smart-order-section">
        <div className="container">
          <h2 className="section-title" data-aos="fade-up">اطلب جهازك الآن</h2>
          <p className="section-subtitle text-center" data-aos="fade-up">أجب عن الأسئلة التالية وسنرسل لك عرض السعر المناسب</p>
          <div className="features-list">
            <div className="feature-row" data-aos="fade-up">
              <div className="feature-row-icon"><span style={{fontSize:'1.5rem',fontWeight:'bold'}}>1</span></div>
              <div className="feature-row-text">
                <h3>معلومات عن المنحل</h3>
                {orderStep >= 1 && (
                  <div style={{marginTop:15}}>
                    <select name="hives" value={orderData.hives} onChange={handleOrderChange} className="order-select">
                      <option value="">كم خلية لديك؟</option>
                      <option value="1-5">1 - 5 خلايا</option>
                      <option value="5-10">5 - 10 خلايا</option>
                      <option value="10-20">10 - 20 خلية</option>
                      <option value="20+">أكثر من 20 خلية</option>
                    </select>
                    {orderErrors.hives && <span className="error-message">{orderErrors.hives}</span>}
                    <select name="beeType" value={orderData.beeType} onChange={handleOrderChange} className="order-select">
                      <option value="">نوع النحل</option>
                      <option value="local">نحل محلي</option>
                      <option value="italian">نحل إيطالي</option>
                      <option value="carniolan">نحل كارنيولي</option>
                    </select>
                    {orderErrors.beeType && <span className="error-message">{orderErrors.beeType}</span>}
                  </div>
                )}
              </div>
            </div>

            <div className="feature-row" data-aos="fade-up" data-aos-delay="100">
              <div className="feature-row-icon"><span style={{fontSize:'1.5rem',fontWeight:'bold'}}>2</span></div>
              <div className="feature-row-text">
                <h3>معلومات الموقع</h3>
                {orderStep >= 2 && (
                  <div style={{marginTop:15}}>
                    <input type="text" name="location" placeholder="موقع المنحل (المدينة/المنطقة)" value={orderData.location} onChange={handleOrderChange} className="order-input" />
                    {orderErrors.location && <span className="error-message">{orderErrors.location}</span>}
                  </div>
                )}
              </div>
            </div>

            <div className="feature-row" data-aos="fade-up" data-aos-delay="200">
              <div className="feature-row-icon"><span style={{fontSize:'1.5rem',fontWeight:'bold'}}>3</span></div>
              <div className="feature-row-text">
                <h3>معلومات التواصل</h3>
                {orderStep >= 3 && (
                  <div style={{marginTop:15}}>
                    <input type="text" name="name" placeholder="الاسم الكامل" value={orderData.name} onChange={handleOrderChange} className="order-input" />
                    {orderErrors.name && <span className="error-message">{orderErrors.name}</span>}
                    <input type="tel" name="phone" placeholder="رقم الهاتف (05xxxxxxxx)" value={orderData.phone} onChange={handleOrderChange} className="order-input" />
                    {orderErrors.phone && <span className="error-message">{orderErrors.phone}</span>}
                    <input type="email" name="email" placeholder="البريد الإلكتروني" value={orderData.email} onChange={handleOrderChange} className="order-input" />
                    {orderErrors.email && <span className="error-message">{orderErrors.email}</span>}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="text-center" style={{marginTop:30}}>
            {orderStep > 1 && <button className="btn-outline" onClick={prevStep} style={{marginRight:10}}>السابق</button>}
            {orderStep < 3 ? (
              <button className="btn-gold" onClick={nextStep}>التالي</button>
            ) : (
              <button className="btn-gold" onClick={handleOrderSubmit}>🚀 اطلب العرض الآن</button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;