import React from 'react';
import './Terms.css';

function Terms() {
  return (
    <div className="page-container hex-bg">
      <div className="container">
        <div className="page-header">
          <h1 className="text-gradient">شروط الاستخدام</h1>
          <p className="page-subtitle">آخر تحديث: 20 أبريل 2026</p>
        </div>

        <div className="terms-content">
          <section className="terms-section">
            <h2>1. قبول الشروط</h2>
            <p>باستخدامك لموقع Smart Hive، فإنك توافق على الالتزام بشروط الاستخدام هذه. إذا كنت لا توافق على هذه الشروط، يرجى عدم استخدام الموقع.</p>
          </section>

          <section className="terms-section">
            <h2>2. استخدام الموقع</h2>
            <p>أنت توافق على استخدام الموقع للأغراض المشروعة فقط. يحظر:</p>
            <ul>
              <li>انتحال شخصية شخص آخر</li>
              <li>تحميل فيروسات أو أكواد ضارة</li>
              <li>محاولة الوصول غير المصرح به لخوادمنا</li>
              <li>استخدام الموقع لأي غرض غير قانوني</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>3. الحسابات</h2>
            <p>عند إنشاء حساب، أنت مسؤول عن:</p>
            <ul>
              <li>الحفاظ على سرية بيانات الدخول</li>
              <li>جميع الأنشطة التي تحدث تحت حسابك</li>
              <li>إبلاغنا فوراً عن أي استخدام غير مصرح به</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>4. المنتجات والطلبات</h2>
            <p>نحن نحتفظ بالحق في:</p>
            <ul>
              <li>رفض أو إلغاء أي طلب</li>
              <li>تعديل أسعار المنتجات دون إشعار مسبق</li>
              <li>تحديد كميات المنتجات المباعة</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>5. الملكية الفكرية</h2>
            <p>جميع المحتويات على موقع Smart Hive (نصوص، صور، شعارات) محمية بحقوق الملكية الفكرية ولا يجوز استخدامها دون إذن كتابي.</p>
          </section>

          <section className="terms-section">
            <h2>6. تحديد المسؤولية</h2>
            <p>Smart Hive غير مسؤولة عن:</p>
            <ul>
              <li>أي أضرار ناتجة عن استخدام الموقع</li>
              <li>انقطاع الخدمة لأسباب خارجة عن إرادتنا</li>
              <li>أي خسائر غير مباشرة</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>7. القانون المطبق</h2>
            <p>تخضع هذه الشروط لقوانين الجمهورية الجزائرية. أي نزاع يخضع لاختصاص محاكم ورقلة.</p>
          </section>

          <section className="terms-section">
            <h2>8. تعديل الشروط</h2>
            <p>نحتفظ بالحق في تعديل هذه الشروط في أي وقت. استمرارك في استخدام الموقع يعني قبولك للتعديلات.</p>
          </section>

          <section className="terms-section">
            <h2>9. اتصل بنا</h2>
            <p>للأسئلة حول شروط الاستخدام:</p>
            <p>📧 support@smarthive.com</p>
            <p>📞 0673310066</p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Terms;
