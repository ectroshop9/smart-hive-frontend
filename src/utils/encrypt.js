// مفتاح تشفير بسيط
const SECRET_KEY = 'smart-hive-secret-key-2026';

// تشفير النص
export const encrypt = (text) => {
  try {
    const encrypted = btoa(text + SECRET_KEY);
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    return text;
  }
};

// فك التشفير
export const decrypt = (encryptedText) => {
  try {
    const decrypted = atob(encryptedText);
    return decrypted.replace(SECRET_KEY, '');
  } catch (error) {
    console.error('Decryption error:', error);
    return encryptedText;
  }
};

// تخزين مشفر
export const setSecureItem = (key, value) => {
  const encrypted = encrypt(value);
  localStorage.setItem(key, encrypted);
};

// قراءة مشفرة
export const getSecureItem = (key) => {
  const encrypted = localStorage.getItem(key);
  if (!encrypted) return null;
  return decrypt(encrypted);
};

// حذف عنصر
export const removeSecureItem = (key) => {
  localStorage.removeItem(key);
};
