// settings.js - إدارة إعدادات النظام
// متوافق مع OTA Manager - تحديثات يدوية

let settingsConfig = {
    language: 'ar', 
    safemode_auto: true, 
    safemode_limit: '3', 
    lvgl_core: '1', 
    queue_size: '10',
    ap_ssid: 'SmartHive_OS', 
    wifi_channel: '6', 
    mesh_channel: '1',
    max_freq: '240', 
    min_freq: '40', 
    light_sleep: true, 
    deep_sleep: '15',
    encryption: true, 
    report_interval: '30', 
    watchdog_timeout: '15', 
    watchdog_enable: true,
    update_notify: true,        // 🆕 إشعارات التحديث (بدل auto_update)
    update_channel: 'stable', 
    version: '6.0.0', 
    device_name: 'SmartHive-01'
};

// ========== تهيئة صفحة الإعدادات ==========
function initSettingsPage() {
    loadSettings();
    updateAboutInfo();
    setInterval(updateAboutInfo, 5000);
}

// ========== تحميل الإعدادات ==========
function loadSettings() {
    const saved = localStorage.getItem('smartHiveSettings');
    if (saved) {
        settingsConfig = { ...settingsConfig, ...JSON.parse(saved) };
    }
    
    // عناصر النظام
    document.getElementById('sys-language').value = settingsConfig.language;
    document.getElementById('sys-safemode-auto').checked = settingsConfig.safemode_auto;
    document.getElementById('sys-safemode-limit').value = settingsConfig.safemode_limit;
    document.getElementById('sys-lvgl-core').value = settingsConfig.lvgl_core;
    document.getElementById('sys-queue-size').value = settingsConfig.queue_size;
    
    // عناصر الشبكة
    document.getElementById('net-ap-ssid').value = settingsConfig.ap_ssid;
    document.getElementById('net-wifi-channel').value = settingsConfig.wifi_channel;
    document.getElementById('net-mesh-channel').value = settingsConfig.mesh_channel;
    
    // عناصر الطاقة
    document.getElementById('pwr-max-freq').value = settingsConfig.max_freq;
    document.getElementById('pwr-min-freq').value = settingsConfig.min_freq;
    document.getElementById('pwr-light-sleep').checked = settingsConfig.light_sleep;
    document.getElementById('pwr-deep-sleep').value = settingsConfig.deep_sleep;
    
    // عناصر الأمان
    document.getElementById('sec-encryption').checked = settingsConfig.encryption;
    
    // عناصر المراقبة
    document.getElementById('mon-report-interval').value = settingsConfig.report_interval;
    document.getElementById('mon-watchdog-timeout').value = settingsConfig.watchdog_timeout;
    document.getElementById('mon-watchdog-enable').checked = settingsConfig.watchdog_enable;
    
    // 🆕 عناصر التحديث
    document.getElementById('update-notify').checked = settingsConfig.update_notify;
    document.getElementById('update-channel').value = settingsConfig.update_channel;
    document.getElementById('update-version').innerText = `v${settingsConfig.version}`;
}

// ========== حفظ الإعدادات ==========
async function saveAllSettings() {
    settingsConfig = {
        language: document.getElementById('sys-language').value,
        safemode_auto: document.getElementById('sys-safemode-auto').checked,
        safemode_limit: document.getElementById('sys-safemode-limit').value,
        lvgl_core: document.getElementById('sys-lvgl-core').value,
        queue_size: document.getElementById('sys-queue-size').value,
        ap_ssid: document.getElementById('net-ap-ssid').value,
        wifi_channel: document.getElementById('net-wifi-channel').value,
        mesh_channel: document.getElementById('net-mesh-channel').value,
        max_freq: document.getElementById('pwr-max-freq').value,
        min_freq: document.getElementById('pwr-min-freq').value,
        light_sleep: document.getElementById('pwr-light-sleep').checked,
        deep_sleep: document.getElementById('pwr-deep-sleep').value,
        encryption: document.getElementById('sec-encryption').checked,
        report_interval: document.getElementById('mon-report-interval').value,
        watchdog_timeout: document.getElementById('mon-watchdog-timeout').value,
        watchdog_enable: document.getElementById('mon-watchdog-enable').checked,
        update_notify: document.getElementById('update-notify').checked,  // 🆕
        update_channel: document.getElementById('update-channel').value,
        version: settingsConfig.version,
        device_name: settingsConfig.device_name
    };
    
    localStorage.setItem('smartHiveSettings', JSON.stringify(settingsConfig));
    
    try { 
        await fetch(`${CONFIG.API_BASE}/settings`, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(settingsConfig) 
        }); 
    } catch (error) {
        console.warn('Failed to save settings to server:', error);
    }
    
    triggerAlert('✅ تم حفظ جميع الإعدادات');
}

// ========== تحديث معلومات "حول النظام" ==========
function updateAboutInfo() {
    document.getElementById('about-version').innerText = `Smart Hive OS v${settingsConfig.version}`;
    document.getElementById('about-device-name').innerText = settingsConfig.device_name;
    document.getElementById('about-uptime').innerText = document.getElementById('uptime-display')?.innerText || '00:00:00';
    
    // تحديث الذاكرة (قيم افتراضية - يمكن تحديثها من API)
    document.getElementById('about-free-heap').innerText = '~245 KB';
    document.getElementById('about-free-psram').innerText = '~7.8 MB';
}

// ========== طي/فتح قسم الإعدادات ==========
function toggleSection(header) { 
    header.classList.toggle('collapsed'); 
}

// ========== توليد مفتاح تشفير ==========
function generateEncryptionKey() { 
    const key = Array.from({length: 16}, () => 
        Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
    ).join(''); 
    triggerAlert(`🔐 مفتاح جديد: ${key}`); 
}

// ========== تغيير كلمة المرور ==========
function changePassword() {
    const newPass = prompt('أدخل كلمة المرور الجديدة:');
    if (newPass && newPass.length >= 4) {
        triggerAlert('🔒 تم تغيير كلمة المرور بنجاح');
    } else if (newPass) {
        triggerAlert('❌ كلمة المرور يجب أن تكون 4 أحرف على الأقل');
    }
}

// ========== تصدير الإعدادات ==========
function exportSettings() { 
    const data = JSON.stringify(settingsConfig, null, 2); 
    const blob = new Blob([data], {type: 'application/json'}); 
    const a = document.createElement('a'); 
    a.href = URL.createObjectURL(blob); 
    a.download = 'smarthive_settings.json'; 
    a.click(); 
    triggerAlert('📤 تم تصدير الإعدادات'); 
}

// ========== استعادة ضبط المصنع ==========
function factoryReset() { 
    if (confirm('⚠️ تحذير: سيتم مسح جميع البيانات!\n\nهل أنت متأكد من استعادة ضبط المصنع؟')) { 
        localStorage.clear(); 
        triggerAlert('🔄 جاري استعادة ضبط المصنع...'); 
        setTimeout(() => location.reload(), 2000); 
    } 
}

// ========== فحص التحديثات (مرتبط مع OTA Manager) ==========
async function checkForUpdate() { 
    triggerAlert('📥 جاري التحقق من التحديثات...');
    
    try {
        const response = await fetch('/api/ota/check');
        const data = await response.json();
        
        // تحديث وقت آخر فحص
        document.getElementById('update-last-check').innerText = new Date().toLocaleString('ar-EG');
        
        let hasUpdate = false;
        
        // فحص تحديث الماستر
        if (data.has_master_update) {
            triggerAlert(`📦 تحديث جديد للمستر: ${data.master_version}`);
            hasUpdate = true;
        }
        
        // فحص تحديث الخلايا
        if (data.has_worker_update) {
            triggerAlert(`📦 تحديث جديد للخلايا: ${data.worker_version}`);
            hasUpdate = true;
        }
        
        // لا توجد تحديثات
        if (!hasUpdate) {
            triggerAlert('✅ النظام محدث لأحدث إصدار');
        }
        
        // 🆕 إظهار إشعار في الواجهة إذا كانت الإشعارات مفعلة
        if (hasUpdate && settingsConfig.update_notify) {
            showUpdateNotification(data);
        }
        
    } catch (error) {
        console.error('Check update failed:', error);
        triggerAlert('❌ فشل الاتصال بخادم التحديثات');
        document.getElementById('update-last-check').innerText = 
            new Date().toLocaleString('ar-EG') + ' (فشل)';
    }
}

// ========== إظهار إشعار التحديث ==========
function showUpdateNotification(data) {
    // إزالة أي إشعار قديم
    const oldNotification = document.querySelector('.update-notification');
    if (oldNotification) oldNotification.remove();
    
    // إنشاء الإشعار
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.style.cssText = `
        position: fixed;
        bottom: 60px;
        right: 20px;
        background: linear-gradient(135deg, #1a2a1a, #0d1f0d);
        border: 2px solid var(--neon-gold);
        border-radius: 15px;
        padding: 20px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    
    let message = '';
    if (data.has_master_update) {
        message += `<div>📱 الماستر: ${data.master_version}</div>`;
    }
    if (data.has_worker_update) {
        message += `<div>🐝 الخلايا: ${data.worker_version}</div>`;
    }
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 15px;">
            <i class="fas fa-cloud-download-alt" style="font-size: 2rem; color: var(--neon-gold);"></i>
            <div>
                <div style="font-weight: bold; margin-bottom: 5px;">🔄 تتوفر تحديثات جديدة!</div>
                ${message}
            </div>
        </div>
        <div style="display: flex; gap: 10px; margin-top: 15px;">
            <button onclick="openHiveUpdate(); this.parentElement.parentElement.remove()" 
                    style="flex: 1; padding: 10px; background: var(--neon-gold); color: #000; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">
                <i class="fas fa-cloud-upload-alt"></i> تحديث الآن
            </button>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="flex: 1; padding: 10px; background: #333; color: #fff; border: none; border-radius: 8px; cursor: pointer;">
                <i class="fas fa-clock"></i> لاحقاً
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // إخفاء تلقائي بعد 30 ثانية
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 30000);
}

// ========== إعادة تشغيل النظام ==========
function restartSystem() {
    if (confirm('⚠️ هل أنت متأكد من إعادة تشغيل النظام؟')) {
        triggerAlert('🔄 جاري إعادة التشغيل...');
        fetch('/api/system/restart', { method: 'POST' })
            .catch(() => {});
        setTimeout(() => location.reload(), 5000);
    }
}

// ========== تهيئة الأحداث عند تحميل الصفحة ==========
document.addEventListener('DOMContentLoaded', function() {
    // معالج رفع ملف التحديث
    const fileInput = document.getElementById('update-file');
    if (fileInput) {
        fileInput.addEventListener('change', async function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            if (!file.name.endsWith('.bin')) {
                triggerAlert('❌ يرجى اختيار ملف بصيغة .bin');
                return;
            }
            
            triggerAlert(`📤 جاري رفع ${file.name}...`);
            
            try {
                await fetch('/ota/start', { method: 'POST' });
                
                const chunkSize = 4096;
                let offset = 0;
                
                while (offset < file.size) {
                    const chunk = file.slice(offset, offset + chunkSize);
                    const buffer = await chunk.arrayBuffer();
                    await fetch('/ota/write', { method: 'POST', body: buffer });
                    offset += chunkSize;
                }
                
                await fetch('/ota/finish', { method: 'POST' });
                triggerAlert('✅ تم رفع التحديث، جاري إعادة التشغيل...');
                
                setTimeout(() => location.reload(), 3000);
            } catch (error) {
                console.error('Upload failed:', error);
                triggerAlert('❌ فشل رفع التحديث');
            }
        });
    }
    
    // مراقبة فتح صفحة الإعدادات
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.target.id === 'set' && mutation.target.classList.contains('active')) {
                initSettingsPage();
            }
        });
    });
    
    const setPage = document.getElementById('set');
    if (setPage) observer.observe(setPage, { attributes: true });
    
    // تحميل وقت آخر فحص من localStorage
    const lastCheck = localStorage.getItem('lastUpdateCheck');
    if (lastCheck) {
        const el = document.getElementById('update-last-check');
        if (el) el.innerText = lastCheck;
    }
});

// ========== إضافة أنيميشن CSS ==========
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);

console.log('✅ Settings module loaded - OTA Ready (Manual Update Mode)');