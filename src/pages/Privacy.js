import React from 'react';
import './Privacy.css';

function Privacy() {
  return (
    <div className="page-container hex-bg">
      <div className="container">
        <div className="page-header">
          <h1 className="text-gradient">سياسة الخصوصية</h1>
          <p className="page-subtitle">آخر تحديث: 20 أبريل 2026</p>
        </div>

        <div className="policy-content">
          <section className="policy-section">
            <h2>1. المعلومات التي نجمعها</h2>
            <p>نقوم بجمع المعلومات التالية عند استخدامك لموقع Smart Hive:</p>
            <ul>
              <li>الاسم الكامل</li>
              <li>البريد الإلكتروني</li>
              <li>رقم الهاتف</li>
              <li>العنوان (لأغراض الشحن)</li>
              <li>بيانات الطلبات والمشتريات</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>2. كيفية استخدام المعلومات</h2>
            <p>نستخدم معلوماتك للأغراض التالية:</p>
            <ul>
              <li>معالجة طلباتك وتوصيل المنتجات</li>
              <li>التواصل معك بخصوص طلباتك</li>
              <li>تحسين خدماتنا ومنتجاتنا</li>
              <li>إرسال تحديثات وعروض (بموافقتك)</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>3. حماية المعلومات</h2>
            <p>نحن نلتزم بحماية بياناتك الشخصية من خلال:</p>
            <ul>
              <li>استخدام تشفير SSL لجميع البيانات المرسلة</li>
              <li>تخزين البيانات في خوادم آمنة</li>
              <li>عدم مشاركة بياناتك مع أطراف ثالثة دون موافقتك</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>4. ملفات تعريف الارتباط (Cookies)</h2>
            <p>نستخدم ملفات تعريف الارتباط لتحسين تجربتك على موقعنا. يمكنك تعطيلها من إعدادات المتصفح.</p>
          </section>

          <section className="policy-section">
            <h2>5. حقوقك</h2>
            <p>لديك الحق في:</p>
            <ul>
              <li>الوصول إلى بياناتك الشخصية</li>
              <li>تصحيح أي بيانات غير دقيقة</li>
              <li>طلب حذف بياناتك</li>
              <li>الاعتراض على معالجة بياناتك</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>6. اتصل بنا</h2>
            <p>إذا كان لديك أي أسئلة حول سياسة الخصوصية، يرجى التواصل معنا:</p>
            <p>📧 support@smarthive.com</p>
            <p>📞 0673310066</p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Privacy;
