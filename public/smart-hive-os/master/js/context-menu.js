// context-menu.js - Right Click Context Menu with i18n

let contextMenu = null;
let currentTarget = null;
let currentTargetType = null;

function initContextMenu() {
    contextMenu = document.getElementById('contextMenu');
    document.addEventListener('contextmenu', (e) => { e.preventDefault(); showContextMenu(e); });
    document.addEventListener('click', (e) => { if (contextMenu && !contextMenu.contains(e.target)) hideContextMenu(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hideContextMenu(); });
}

function showContextMenu(e) {
    if (!contextMenu) return;
    const target = e.target;
    let targetType = 'desktop', targetElement = null;
    if (target.closest('.desktop-icon')) { targetType = 'icon'; targetElement = target.closest('.desktop-icon'); }
    else if (target.closest('.os-window')) { targetType = 'window'; targetElement = target.closest('.os-window'); }
    else if (target.closest('.desktop')) { targetType = 'desktop'; targetElement = target.closest('.desktop'); }
    else return;
    currentTarget = targetElement; currentTargetType = targetType;
    showMenuByType(targetType);
    contextMenu.style.display = 'block';
    let x = e.clientX, y = e.clientY;
    const rect = contextMenu.getBoundingClientRect();
    if (x + rect.width > window.innerWidth) x = window.innerWidth - rect.width - 5;
    if (y + rect.height > window.innerHeight) y = window.innerHeight - rect.height - 5;
    contextMenu.style.left = Math.max(5, x) + 'px';
    contextMenu.style.top = Math.max(5, y) + 'px';
}

function showMenuByType(type) {
    document.getElementById('desktop-menu').style.display = type === 'desktop' ? 'block' : 'none';
    document.getElementById('icon-menu').style.display = type === 'icon' ? 'block' : 'none';
    document.getElementById('window-menu').style.display = type === 'window' ? 'block' : 'none';
}

function hideContextMenu() { if (contextMenu) contextMenu.style.display = 'none'; currentTarget = null; }

function contextAction(action) {
    const refreshText = typeof osT === 'function' ? osT('context.refresh') || 'تحديث' : 'تحديث';
    const iconText = typeof osT === 'function' ? osT('context.icon') || 'أيقونة' : 'أيقونة';
    const windowText = typeof osT === 'function' ? osT('context.window') || 'نافذة' : 'نافذة';
    const desktopText = typeof osT === 'function' ? osT('desktop.desktop') || 'سطح المكتب' : 'سطح المكتب';
    
    switch (action) {
        case 'refresh': 
            triggerAlert('🔄 ' + refreshText + '...'); 
            if (typeof fetchData === 'function') fetchData(); 
            if (typeof fetchHives === 'function') fetchHives(); 
            break;
        case 'open': 
            if (currentTargetType === 'icon') { 
                const page = currentTarget.getAttribute('data-page'); 
                if (page) openWindow(page); 
            } 
            break;
        case 'pin': 
            if (currentTargetType === 'icon') { 
                const page = currentTarget.getAttribute('data-page'); 
                const name = currentTarget.querySelector('span')?.innerText; 
                if (page && name) { 
                    addTaskbarApp(page, name); 
                    const pinnedText = typeof osT === 'function' ? osT('context.pinned') || 'تم تثبيت' : 'تم تثبيت';
                    triggerAlert(`📌 ${pinnedText} ${name}`); 
                } 
            } 
            break;
        case 'close-window': 
            if (currentTargetType === 'window') { 
                const id = currentTarget.id.replace('window-', ''); 
                closeWindow(id); 
            } 
            break;
        case 'minimize': 
            if (currentTargetType === 'window') { 
                const id = currentTarget.id.replace('window-', ''); 
                minimizeWindow(id); 
            } 
            break;
        case 'maximize': 
            if (currentTargetType === 'window') { 
                const id = currentTarget.id.replace('window-', ''); 
                maximizeWindow(id); 
            } 
            break;
        case 'properties':
            if (currentTargetType === 'desktop') { 
                if (typeof openDesktopProperties === 'function') openDesktopProperties(); 
                else triggerAlert('🖥️ Smart Hive OS - ' + desktopText); 
            }
            else if (currentTargetType === 'icon') {
                const iconName = currentTarget.querySelector('span')?.innerText || iconText;
                triggerAlert(`📁 ${iconName}`);
            }
            else if (currentTargetType === 'window') {
                const windowName = currentTarget.querySelector('.os-window-title span')?.innerText || windowText;
                triggerAlert(`🪟 ${windowName}`);
            }
            break;
    }
    hideContextMenu();
}

function initDesktopIcons() {
    document.querySelectorAll('.desktop-icon').forEach(icon => {
        const span = icon.querySelector('span');
        if (span) {
            const text = span.innerText;
            const dashLabel = typeof osT === 'function' ? osT('desktop.dashboard') : 'لوحة المعلومات';
            const hivesLabel = typeof osT === 'function' ? osT('desktop.activeHives') : 'الخلايا النشطة';
            const aiLabel = typeof osT === 'function' ? osT('desktop.aiAdvisor') : 'مستشار النحل';
            const setLabel = typeof osT === 'function' ? osT('desktop.settings') : 'الإعدادات';
            
            if (text.includes(dashLabel)) icon.setAttribute('data-page', 'dash');
            else if (text.includes(hivesLabel)) icon.setAttribute('data-page', 'hives');
            else if (text.includes(aiLabel)) icon.setAttribute('data-page', 'ai');
            else if (text.includes(setLabel)) icon.setAttribute('data-page', 'set');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => { initContextMenu(); initDesktopIcons(); });
console.log('✅ Context Menu loaded with i18n');