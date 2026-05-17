import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Home.css';

function Home() {
  const { t } = useTranslation();
  const [phase, setPhase] = useState('intro');
  const [showCTA, setShowCTA] = useState(false);
  const heroRef = useRef(null);
  const storyRef = useRef(null);

  useEffect(() => {
    AOS.init({ duration: 800, once: true, offset: 100 });
    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';
  }, []);

  const handleIntroEnded = () => {
    setPhase('hero');
    setTimeout(() => {
      if (heroRef.current) {
        heroRef.current.play().catch(() => {});
      }
      setShowCTA(true);
    }, 150);
  };

  const scrollToStory = () => storyRef.current?.scrollIntoView({ behavior: 'smooth' });

  const sensorGroups = [
    { icon: 'temperature-high', title: t('sensors.groups.climate.title'), desc: t('sensors.groups.climate.desc') },
    { icon: 'ear-listen', title: t('sensors.groups.monitoring.title'), desc: t('sensors.groups.monitoring.desc') },
    { icon: 'weight-scale', title: t('sensors.groups.production.title'), desc: t('sensors.groups.production.desc') },
    { icon: 'battery-full', title: t('sensors.groups.system.title'), desc: t('sensors.groups.system.desc') },
  ];

  return (
    <div className="landing-page">
      {/* ========== 1. HERO ========== */}
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
          <div className="scroll-indicator" onClick={scrollToStory} title={t('hero.scrollDown')}>
            <i className="fas fa-chevron-down"></i>
          </div>
        )}
      </section>

      {/* ========== 2. المشكلة ========== */}
      <section className="problem-section" ref={storyRef}>
        <div className="container">
          <h2 className="section-title text-center" data-aos="fade-up">{t('problem.title')}</h2>
          <p className="section-subtitle text-center" data-aos="fade-up">{t('problem.subtitle')}</p>
          <div className="problem-grid">
            {[
              { key: 'beesDying', icon: 'skull', color: '#ff4d4d' },
              { key: 'honeyDrop', icon: 'chart-line-down', color: '#ffc107' },
              { key: 'energy', icon: 'bolt', color: '#ff9800' }
            ].map((p, i) => (
              <div key={p.key} className="problem-card" data-aos="fade-up" data-aos-delay={i * 100}>
                <div className="problem-icon" style={{ background: `${p.color}20`, color: p.color }}>
                  <i className={`fas fa-${p.icon}`}></i>
                </div>
                <h3>{t(`problem.${p.key}.title`)}</h3>
                <p>{t(`problem.${p.key}.desc`)}</p>
                <div className="problem-stat">
                  <span className="stat-number">{t(`problem.${p.key}.stat`)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 3. لماذا Smart Hive ========== */}
      <section className="story-section hex-bg">
        <div className="container">
          <div className="story-grid">
            <div className="story-image" data-aos="fade-right">
              <img src="/story.png" alt="Beekeeper" style={{ width: '100%', borderRadius: 16 }} />
            </div>
            <div className="story-content" data-aos="fade-left">
              <h2 className="section-title">{t('story.title')}</h2>
              <p className="story-text">{t('story.description')}</p>
              <ul className="story-points">
                {t('story.points', { returnObjects: true }).map((point, i) => (
                  <li key={i}><i className="fas fa-check-circle"></i> {point}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 4. 15 حساس ========== */}
      <section className="sensors-section hex-bg">
        <div className="container">
          <h2 className="section-title" data-aos="fade-up">{t('sensors.title')}</h2>
          <p className="section-subtitle text-center" data-aos="fade-up">{t('sensors.subtitle')}</p>
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
          <div className="sensors-image" data-aos="zoom-in" style={{ marginTop: 40, textAlign: 'center' }}>
            <img src="/images/sensors-diagram.png" alt="15 Sensors" style={{ maxWidth: '100%', borderRadius: 16 }} />
          </div>
        </div>
      </section>

      {/* ========== 5. الطاقة الشمسية + Deep Sleep ========== */}
      <section className="energy-section">
        <div className="container">
          <h2 className="section-title" data-aos="fade-up">{t('energy.title')}</h2>
          <p className="section-subtitle text-center" data-aos="fade-up">{t('energy.subtitle')}</p>
          <div className="energy-grid">
            <div className="energy-card" data-aos="fade-up">
              <div className="energy-icon"><i className="fas fa-solar-panel"></i></div>
              <h3>{t('energy.solar.title')}</h3>
              <p>{t('energy.solar.desc')}</p>
            </div>
            <div className="energy-card" data-aos="fade-up" data-aos-delay="100">
              <div className="energy-icon"><i className="fas fa-moon"></i></div>
              <h3>{t('energy.deepsleep.title')}</h3>
              <p>{t('energy.deepsleep.desc')}</p>
              <div className="energy-stat">6 {t('energy.deepsleep.months')}</div>
            </div>
            <div className="energy-card" data-aos="fade-up" data-aos-delay="200">
              <div className="energy-icon"><i className="fas fa-plug"></i></div>
              <h3>{t('energy.poe.title')}</h3>
              <p>{t('energy.poe.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 6. Mesh ========== */}
      <section className="mesh-section">
        <div className="container">
          <h2 className="section-title" data-aos="fade-up">{t('mesh.title')}</h2>
          <p className="section-subtitle text-center" data-aos="fade-up">{t('mesh.subtitle')}</p>
          <div className="mesh-diagram" data-aos="zoom-in">
            <img src="/mesh-network.png" alt="Mesh Network" style={{ maxWidth: '100%', borderRadius: 16 }} />
          </div>
          <div className="mesh-stats" data-aos="fade-up">
            <div className="mesh-stat-item">
              <span className="mesh-stat-number">300m</span>
              <span>{t('mesh.range')}</span>
            </div>
            <div className="mesh-stat-item">
              <span className="mesh-stat-number">1.5km</span>
              <span>{t('mesh.totalRange')}</span>
            </div>
          </div>
          <div className="mesh-info" data-aos="fade-up">
            <p>{t('mesh.description')}</p>
          </div>
        </div>
      </section>

      {/* ========== 7. الذكاء الاصطناعي ========== */}
      <section className="ai-section hex-bg">
        <div className="container">
          <h2 className="section-title" data-aos="fade-up">{t('ai.title')}</h2>
          <p className="section-subtitle text-center" data-aos="fade-up">{t('ai.subtitle')}</p>
          <div className="ai-grid">
            <div className="ai-diseases" data-aos="fade-right">
              <h3>{t('ai.diseases.title')}</h3>
              <ul className="ai-disease-list">
                {t('ai.diseases.list', { returnObjects: true }).map((d, i) => (
                  <li key={i}><i className="fas fa-virus"></i> {d}</li>
                ))}
              </ul>
            </div>
            <div className="ai-nvidia" data-aos="fade-left">
              <div className="ai-nvidia-badge">
                <i className="fas fa-microchip"></i>
                <span>{t('ai.nvidia')}</span>
              </div>
              <p>{t('ai.nvidiaDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 8. الأمان ========== */}
      <section className="security-section hex-bg">
        <div className="container">
          <h2 className="section-title" data-aos="fade-up">{t('security.title')}</h2>
          <p className="section-subtitle text-center" data-aos="fade-up">{t('security.subtitle')}</p>
          <div className="security-grid">
            {['aes', 'ecdsa', 'rolling', 'ssl'].map((s, i) => (
              <div key={s} className="security-card" data-aos="fade-up" data-aos-delay={i * 100}>
                <div className="security-icon"><i className="fas fa-lock"></i></div>
                <h3>{t(`security.items.${s}.title`)}</h3>
                <p>{t(`security.items.${s}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 9. وثيقة المنشأ الرقمية ========== */}
      <section className="vault-section">
        <div className="container">
          <h2 className="section-title" data-aos="fade-up">{t('vault.title')}</h2>
          <p className="section-subtitle text-center" data-aos="fade-up">{t('vault.subtitle')}</p>
          <div className="vault-content">
            <div className="vault-image" data-aos="fade-right">
              <img src="/images/certificate-preview.png" alt="Digital Certificate" style={{ maxWidth: '100%', borderRadius: 16 }} />
            </div>
            <div className="vault-features" data-aos="fade-left">
              {t('vault.features', { returnObjects: true }).map((f, i) => (
                <div key={i} className="vault-feature-item">
                  <i className="fas fa-check-circle"></i>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== 10. تربية الملكات ========== */}
      <section className="queen-section hex-bg">
        <div className="container">
          <h2 className="section-title" data-aos="fade-up">{t('queen.title')}</h2>
          <p className="section-subtitle text-center" data-aos="fade-up">{t('queen.subtitle')}</p>
          <div className="queen-grid">
            <div className="queen-card" data-aos="fade-up">
              <i className="fas fa-crown"></i>
              <h3>{t('queen.monitoring')}</h3>
              <p>{t('queen.monitoringDesc')}</p>
            </div>
            <div className="queen-card" data-aos="fade-up" data-aos-delay="100">
              <i className="fas fa-temperature-high"></i>
              <h3>{t('queen.precision')}</h3>
              <p>{t('queen.precisionDesc')}</p>
            </div>
            <div className="queen-card" data-aos="fade-up" data-aos-delay="200">
              <i className="fas fa-bell"></i>
              <h3>{t('queen.alerts')}</h3>
              <p>{t('queen.alertsDesc')}</p>
            </div>
          </div>
        </div>
      </section>

     
    </div>
  );
}

export default Home;