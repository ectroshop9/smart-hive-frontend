// config.js - إعدادات Smart Hive OS
const CONFIG = {
    API_BASE: '/api',
    APP_NAME: 'Smart Hive OS',
    VERSION: '6.0.0',
    DEFAULT_USER: 'admin',
    DEFAULT_PASS: '1234',
    WILAYA_LIST: [
        "1 - أدرار", "2 - الشلف", "3 - الأغواط", "4 - أم البواقي",
        "5 - باتنة", "6 - بجاية", "7 - بسكرة", "8 - بشار",
        "9 - البليدة", "10 - البويرة", "11 - تمنراست", "12 - تبسة",
        "13 - تلمسان", "14 - تيارت", "15 - تيزي وزو", "16 - الجزائر"
    ]
};

function triggerAlert(message, type = 'info') {
    const toast = document.getElementById('alertToast');
    const msg = document.getElementById('alertMsg');
    const title = document.querySelector('.toast-title');
    if (toast && msg) {
        msg.innerText = message;
        title.innerText = type === 'error' ? '❌ خطأ' : 'تنبيه النظام';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }
}

function formatDateTime() {
    const d = new Date();
    return {
        date: `${d.getFullYear()}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getDate().toString().padStart(2,'0')}`,
        time: `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}:${d.getSeconds().toString().padStart(2,'0')}`
    };
}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
    } else {
        document.exitFullscreen();
    }
}

console.log(`✅ ${CONFIG.APP_NAME} v${CONFIG.VERSION} loaded`);