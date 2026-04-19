import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Pricing.css';

function Pricing() {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'أساسية',
      price: '299',
      description: 'للمبتدئين في تربية النحل',
      features: ['1 جهاز ماستر', '2 جهاز سلايف', 'تطبيق جوال', 'دعم فني', 'تحديثات مجانية'],
      popular: false
    },
    {
      name: 'متقدمة',
      price: '499',
      description: 'للمحترفين والمزارع الصغيرة',
      features: ['1 جهاز ماستر', '5 جهاز سلايف', 'تطبيق جوال', 'دعم فني 24/7', 'تحديثات مجانية', 'تقارير متقدمة', 'تنبيهات ذكية'],
      popular: true
    },
    {
      name: 'مؤسسية',
      price: '999',
      description: 'للمزارع الكبيرة والشركات',
      features: ['2 جهاز ماستر', '10 جهاز سلايف', 'تطبيق جوال', 'دعم فني VIP', 'تحديثات مجانية', 'تقارير متقدمة', 'تنبيهات ذكية', 'API مخصص', 'تدريب مباشر'],
      popular: false
    }
  ];

  return (
    <div className="page-container hex-bg">
      <div className="container">
        <div className="page-header">
          <h1 className="text-gradient">الباقات والأسعار</h1>
          <p className="page-subtitle">اختر الباقة المناسبة لاحتياجاتك</p>
        </div>

        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <div key={index} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
              {plan.popular && <div className="popular-badge">الأكثر طلباً</div>}
              <h2>{plan.name}</h2>
              <p className="plan-description">{plan.description}</p>
              <div className="plan-price">
                <span className="currency">$</span>
                <span className="amount">{plan.price}</span>
              </div>
              <ul className="plan-features">
                {plan.features.map((feature, i) => (
                  <li key={i}>
                    <i className="fas fa-check-circle"></i>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className={`btn-plan ${plan.popular ? 'btn-gold' : 'btn-outline-gold'}`} onClick={() => navigate('/activate')}>
                {plan.popular ? '🔥 ابدأ الآن' : 'اختر الباقة'}
              </button>
            </div>
          ))}
        </div>

        <div className="money-back">
          <i className="fas fa-shield-alt"></i>
          <p>ضمان استرجاع كامل خلال 30 يوم • دعم فني 24/7 • تحديثات مجانية مدى الحياة</p>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
