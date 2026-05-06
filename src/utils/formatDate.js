// تنسيق التاريخ بالعربية
export const formatDateArabic = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  
  // أسماء الشهور بالعربية
  const arabicMonths = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];
  
  return `${day} ${arabicMonths[month - 1]} ${year}`;
};

// تنسيق الوقت بالعربية
export const formatTimeArabic = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  
  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const period = hours >= 12 ? 'مساءً' : 'صباحاً';
  
  // تحويل إلى نظام 12 ساعة
  hours = hours % 12;
  hours = hours ? hours : 12;
  
  return `${hours}:${minutes} ${period}`;
};

// تنسيق التاريخ والوقت معاً
export const formatDateTimeArabic = (date) => {
  if (!date) return '';
  
  return `${formatDateArabic(date)} - ${formatTimeArabic(date)}`;
};

// تنسيق التاريخ نسبياً (منذ 5 دقائق، منذ ساعتين...)
export const formatRelativeTimeArabic = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  
  const now = new Date();
  const diffMs = now - d;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);
  
  if (diffSec < 60) return 'الآن';
  if (diffMin < 60) return `منذ ${diffMin} ${diffMin === 1 ? 'دقيقة' : 'دقائق'}`;
  if (diffHour < 24) return `منذ ${diffHour} ${diffHour === 1 ? 'ساعة' : 'ساعات'}`;
  if (diffDay < 30) return `منذ ${diffDay} ${diffDay === 1 ? 'يوم' : 'أيام'}`;
  if (diffMonth < 12) return `منذ ${diffMonth} ${diffMonth === 1 ? 'شهر' : 'أشهر'}`;
  return `منذ ${diffYear} ${diffYear === 1 ? 'سنة' : 'سنوات'}`;
};
