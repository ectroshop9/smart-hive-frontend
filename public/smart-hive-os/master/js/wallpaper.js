// wallpaper.js - إدارة خلفية سطح المكتب
const DEFAULT_WALLPAPER = 'radial-gradient(circle at 30% 30%, #1a1a2e, #05050a)';
const wallpapers = [
    { name: 'الأصلي', color: '#1a1a2e' },
    { name: 'ذهبي', color: '#2a1a0a' },
    { name: 'أزرق', color: '#0a1a2e' },
    { name: 'أخضر', color: '#0a2a1a' }
];

let currentWallpaper = DEFAULT_WALLPAPER;

function initWallpaper() {
    const saved = localStorage.getItem('desktopWallpaper');
    if (saved) currentWallpaper = saved;
    applyWallpaper();
    const input = document.getElementById('wallpaper-input');
    if (input) input.addEventListener('change', handleWallpaperUpload);
}

function applyWallpaper() {
    const desktop = document.getElementById('desktop');
    if (!desktop) return;
    desktop.style.background = currentWallpaper.startsWith('radial-gradient') ? currentWallpaper : `url('${currentWallpaper}')`;
    desktop.style.backgroundSize = 'cover';
    desktop.style.backgroundPosition = 'center';
}

function handleWallpaperUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => { currentWallpaper = event.target.result; applyWallpaper(); saveWallpaper(); triggerAlert('✅ تم تغيير الخلفية'); };
    reader.readAsDataURL(file);
}

function saveWallpaper() { try { localStorage.setItem('desktopWallpaper', currentWallpaper); } catch (e) {} }
function resetWallpaper() { currentWallpaper = DEFAULT_WALLPAPER; applyWallpaper(); saveWallpaper(); triggerAlert('🖼️ تم استعادة الخلفية الافتراضية'); }
function applyPresetWallpaper(index) {
    const wp = wallpapers[index];
    if (wp) { currentWallpaper = `radial-gradient(circle at 30% 30%, ${wp.color}, #05050a)`; applyWallpaper(); saveWallpaper(); triggerAlert(`🖼️ ${wp.name}`); }
}
function initWallpaperPresets() {
    const container = document.getElementById('wallpaper-presets');
    if (!container) return;
    container.innerHTML = wallpapers.map((wp, i) => `<div class="wallpaper-preset" onclick="applyPresetWallpaper(${i})" style="background: radial-gradient(circle at 30% 30%, ${wp.color}, #05050a);" title="${wp.name}"></div>`).join('');
}

document.addEventListener('DOMContentLoaded', initWallpaper);
console.log('✅ Wallpaper module loaded');