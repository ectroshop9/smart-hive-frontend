// desktop.js - Free Desktop Manager (i18n Ready)
let isDragging = false;
let currentIcon = null;
let dragOffsetX = 0;
let dragOffsetY = 0;
let iconStartLeft = 0;
let iconStartTop = 0;
let selectedIcon = null;

const DESKTOP_PADDING = 10;

// ==================== Helper ====================
function _(key, fallback) {
    return (typeof osT === 'function' ? osT(key) : null) || fallback || key;
}

// ========== تهيئة سطح المكتب ==========
function initFreeDesktop() {
    const icons = document.querySelectorAll('.desktop-icon');
    loadIconsPositions();
    
    icons.forEach((icon, index) => {
        if (!icon.style.left || !icon.style.top) {
            setDefaultIconPosition(icon, index);
        }
        makeIconDraggable(icon);
        
        icon.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            const pageId = icon.getAttribute('data-page');
            if (pageId && typeof openWindow === 'function') {
                openWindow(pageId);
            } else {
                const onclick = icon.getAttribute('onclick');
                if (onclick) eval(onclick);
            }
        });
        
        icon.addEventListener('click', (e) => {
            e.stopPropagation();
            selectIcon(icon);
        });
    });
    
    const desktop = document.querySelector('.desktop');
    if (desktop) desktop.addEventListener('click', deselectAllIcons);
    
    window.addEventListener('beforeunload', saveIconsPositions);
}

function makeIconDraggable(icon) {
    icon.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();
        startDrag(icon, e.clientX, e.clientY);
    });
}

function startDrag(icon, mouseX, mouseY) {
    isDragging = true;
    currentIcon = icon;
    
    const rect = icon.getBoundingClientRect();
    const desktopRect = document.querySelector('.desktop').getBoundingClientRect();
    
    iconStartLeft = rect.left - desktopRect.left;
    iconStartTop = rect.top - desktopRect.top;
    dragOffsetX = mouseX - rect.left;
    dragOffsetY = mouseY - rect.top;
    
    icon.classList.add('dragging');
    selectIcon(icon);
    
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', onDragEnd);
}

function onDrag(e) {
    if (!isDragging || !currentIcon) return;
    e.preventDefault();
    
    const desktop = document.querySelector('.desktop');
    const desktopRect = desktop.getBoundingClientRect();
    
    let newLeft = e.clientX - desktopRect.left - dragOffsetX;
    let newTop = e.clientY - desktopRect.top - dragOffsetY;
    
    const iconWidth = currentIcon.offsetWidth;
    const iconHeight = currentIcon.offsetHeight;
    
    newLeft = Math.max(DESKTOP_PADDING, Math.min(newLeft, desktopRect.width - iconWidth - DESKTOP_PADDING));
    newTop = Math.max(DESKTOP_PADDING, Math.min(newTop, desktopRect.height - iconHeight - DESKTOP_PADDING));
    
    currentIcon.style.left = newLeft + 'px';
    currentIcon.style.top = newTop + 'px';
    currentIcon.style.right = 'auto';
    currentIcon.style.bottom = 'auto';
}

function onDragEnd(e) {
    if (!isDragging || !currentIcon) { resetDrag(); return; }
    currentIcon.classList.remove('dragging');
    saveIconsPositions();
    resetDrag();
}

function resetDrag() {
    isDragging = false;
    currentIcon = null;
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', onDragEnd);
}

function selectIcon(icon) {
    deselectAllIcons();
    icon.classList.add('selected');
    selectedIcon = icon;
}

function deselectAllIcons() {
    document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
    selectedIcon = null;
}

function setDefaultIconPosition(icon, index) {
    const defaultPositions = [
        { left: 30, top: 30 }, { left: 30, top: 130 }, { left: 30, top: 230 },
        { left: 30, top: 330 }, { left: 130, top: 30 }, { left: 130, top: 130 }, { left: 130, top: 230 }
    ];
    const pos = defaultPositions[index] || { left: 30 + (index * 100), top: 30 };
    icon.style.left = pos.left + 'px';
    icon.style.top = pos.top + 'px';
    icon.style.right = 'auto';
    icon.style.bottom = 'auto';
}

function saveIconsPositions() {
    const icons = document.querySelectorAll('.desktop-icon');
    const positions = {};
    icons.forEach(icon => {
        const span = icon.querySelector('span');
        if (span) {
            positions[span.innerText] = { left: icon.style.left || '30px', top: icon.style.top || '30px' };
        }
    });
    localStorage.setItem('desktopIconsPositions', JSON.stringify(positions));
}

function loadIconsPositions() {
    const saved = localStorage.getItem('desktopIconsPositions');
    if (!saved) return;
    try {
        const positions = JSON.parse(saved);
        document.querySelectorAll('.desktop-icon').forEach(icon => {
            const span = icon.querySelector('span');
            if (span && positions[span.innerText]) {
                icon.style.left = positions[span.innerText].left;
                icon.style.top = positions[span.innerText].top;
                icon.style.right = 'auto';
                icon.style.bottom = 'auto';
            }
        });
    } catch (e) {}
}

// ========== ترتيب الأيقونات ==========
function arrangeIconsByName() {
    const container = document.querySelector('.desktop-icons');
    const icons = [...container.querySelectorAll('.desktop-icon')];
    icons.sort((a, b) => {
        const nameA = a.querySelector('span')?.innerText || '';
        const nameB = b.querySelector('span')?.innerText || '';
        return nameA.localeCompare(nameB, 'ar');
    });
    rearrangeIcons(icons);
    triggerAlert('📂 ' + _('desktop.arrangedByName', 'تم ترتيب الأيقونات حسب الاسم'));
}

function arrangeIconsByType() {
    const container = document.querySelector('.desktop-icons');
    const icons = [...container.querySelectorAll('.desktop-icon')];
    const typeOrder = { 'dash': 1, 'hives': 2, 'ai': 3, 'set': 4 };
    icons.sort((a, b) => {
        const typeA = a.getAttribute('data-page') || 'zzz';
        const typeB = b.getAttribute('data-page') || 'zzz';
        return (typeOrder[typeA] || 99) - (typeOrder[typeB] || 99);
    });
    rearrangeIcons(icons);
    triggerAlert('📂 ' + _('desktop.arrangedByType', 'تم ترتيب الأيقونات حسب النوع'));
}

function snapIconsToGrid() {
    const gridSize = 100;
    document.querySelectorAll('.desktop-icon').forEach(icon => {
        let left = parseInt(icon.style.left) || 30;
        let top = parseInt(icon.style.top) || 30;
        left = Math.round(left / gridSize) * gridSize;
        top = Math.round(top / gridSize) * gridSize;
        icon.style.left = left + 'px';
        icon.style.top = top + 'px';
    });
    saveIconsPositions();
    triggerAlert('📐 ' + _('desktop.snapped', 'تم محاذاة الأيقونات للشبكة'));
}

function rearrangeIcons(sortedIcons) {
    const container = document.querySelector('.desktop-icons');
    let topOffset = 30, leftOffset = 30;
    sortedIcons.forEach((icon, index) => {
        if (index > 0 && index % 7 === 0) { leftOffset += 100; topOffset = 30; }
        icon.style.left = leftOffset + 'px';
        icon.style.top = topOffset + 'px';
        icon.style.right = 'auto';
        icon.style.bottom = 'auto';
        container.appendChild(icon);
        topOffset += 100;
    });
    saveIconsPositions();
}

function resetIconsToDefault() {
    document.querySelectorAll('.desktop-icon').forEach((icon, index) => setDefaultIconPosition(icon, index));
    saveIconsPositions();
    triggerAlert('🔄 ' + _('desktop.resetDefault', 'تم إعادة الأيقونات إلى الوضع الافتراضي'));
}

// ========== قائمة الترتيب ==========
function showArrangeMenu(x, y) {
    const existingMenu = document.querySelector('.desktop-arrange-menu');
    if (existingMenu) existingMenu.remove();
    
    const menu = document.createElement('div');
    menu.className = 'desktop-arrange-menu';
    menu.innerHTML = `
        <div class="desktop-arrange-item" onclick="arrangeIconsByName(); this.parentElement.remove();">
            <i class="fas fa-sort-alpha-down"></i>
            <span>${_('desktop.arrangeByName', 'ترتيب حسب الاسم')}</span>
        </div>
        <div class="desktop-arrange-item" onclick="arrangeIconsByType(); this.parentElement.remove();">
            <i class="fas fa-folder"></i>
            <span>${_('desktop.arrangeByType', 'ترتيب حسب النوع')}</span>
        </div>
        <div class="desktop-arrange-divider"></div>
        <div class="desktop-arrange-item" onclick="snapIconsToGrid(); this.parentElement.remove();">
            <i class="fas fa-th"></i>
            <span>${_('desktop.snapGrid', 'محاذاة للشبكة')}</span>
        </div>
        <div class="desktop-arrange-item" onclick="resetIconsToDefault(); this.parentElement.remove();">
            <i class="fas fa-undo-alt"></i>
            <span>${_('desktop.resetDefaultBtn', 'إعادة إلى الوضع الافتراضي')}</span>
        </div>
    `;
    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
    document.body.appendChild(menu);
    
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target)) { menu.remove(); document.removeEventListener('click', closeMenu); }
        });
    }, 10);
}

document.addEventListener('DOMContentLoaded', () => setTimeout(initFreeDesktop, 500));

window.arrangeIconsByName = arrangeIconsByName;
window.arrangeIconsByType = arrangeIconsByType;
window.snapIconsToGrid = snapIconsToGrid;
window.resetIconsToDefault = resetIconsToDefault;
window.showArrangeMenu = showArrangeMenu;

console.log('✅ Free Desktop loaded (i18n Ready)');