// windows.js - Window Manager (i18n Ready)

let windowZIndex = 1000;

function _(key, fallback) {
    return (typeof osT === 'function' ? osT(key) : null) || fallback || key;
}

function openWindow(pageId) {
    if (document.getElementById(`window-${pageId}`)) { focusWindow(pageId); return; }
    const pageContent = document.getElementById(pageId);
    if (!pageContent) return;
    
    const win = document.createElement('div');
    win.id = `window-${pageId}`;
    win.className = 'os-window';
    win.style.zIndex = ++windowZIndex;
    win.style.left = '100px';
    win.style.top = '100px';
    
    const title = pageContent.querySelector('.page-title')?.innerText || _('desktop.window', 'نافذة');
    win.innerHTML = `
        <div class="os-window-header">
            <div class="os-window-title"><i class="fas fa-window-maximize"></i><span>${title}</span></div>
            <div class="os-window-controls">
                <div class="os-window-control" onclick="minimizeWindow('${pageId}')"><i class="fas fa-minus"></i></div>
                <div class="os-window-control" onclick="maximizeWindow('${pageId}')"><i class="fas fa-square"></i></div>
                <div class="os-window-control close" onclick="closeWindow('${pageId}')"><i class="fas fa-times"></i></div>
            </div>
        </div>
        <div class="os-window-content">${pageContent.innerHTML}</div>
    `;
    document.getElementById('workspace').appendChild(win);
    if (typeof addTaskbarApp === 'function') addTaskbarApp(pageId, title);
    focusWindow(pageId);
}

function closeWindow(pageId) {
    document.getElementById(`window-${pageId}`)?.remove();
    if (typeof removeTaskbarApp === 'function') removeTaskbarApp(pageId);
}

function minimizeWindow(pageId) {
    const win = document.getElementById(`window-${pageId}`);
    if (win) win.style.display = 'none';
}

function focusWindow(pageId) {
    const win = document.getElementById(`window-${pageId}`);
    if (win) {
        win.style.display = 'block';
        win.style.zIndex = ++windowZIndex;
        if (typeof setActiveTaskbarApp === 'function') setActiveTaskbarApp(pageId);
    }
}

function maximizeWindow(pageId) {
    const win = document.getElementById(`window-${pageId}`);
    if (win) {
        if (win.style.width === '100%') {
            win.style.width = '600px'; win.style.height = '450px';
            win.style.left = '100px'; win.style.top = '100px';
        } else {
            win.style.width = '100%'; win.style.height = 'calc(100vh - 40px)';
            win.style.left = '0'; win.style.top = '0';
        }
    }
}

function openDesktopProperties() {
    const modal = document.getElementById('desktopPropertiesModal');
    if (modal) { modal.style.display = 'flex'; if (typeof initWallpaperPresets === 'function') initWallpaperPresets(); }
}

function closeDesktopProperties() {
    const modal = document.getElementById('desktopPropertiesModal');
    if (modal) modal.style.display = 'none';
}

function applyDesktopProperties() {
    triggerAlert('✅ ' + _('wallpaper.applied', 'تم تطبيق إعدادات سطح المكتب'));
    closeDesktopProperties();
}

console.log('✅ Windows Manager loaded (i18n Ready)');