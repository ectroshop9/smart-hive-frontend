// desktop.js - إدارة سطح المكتب الحر (Free Desktop)
let isDragging = false;
let currentIcon = null;
let dragOffsetX = 0;
let dragOffsetY = 0;
let iconStartLeft = 0;
let iconStartTop = 0;
let selectedIcon = null;

// حدود سطح المكتب
const DESKTOP_PADDING = 10;

// ========== تهيئة سطح المكتب ==========
function initFreeDesktop() {
    const icons = document.querySelectorAll('.desktop-icon');
    
    // تحميل المواقع المحفوظة
    loadIconsPositions();
    
    // تعيين المواقع الافتراضية للأيقونات الجديدة
    icons.forEach((icon, index) => {
        if (!icon.style.left || !icon.style.top) {
            setDefaultIconPosition(icon, index);
        }
        
        // جعل الأيقونة قابلة للسحب
        makeIconDraggable(icon);
        
        // النقر المزدوج للفتح
        icon.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            const pageId = icon.getAttribute('data-page');
            if (pageId) {
                if (typeof openWindow === 'function') {
                    openWindow(pageId);
                }
            } else {
                // للأيقونات الخاصة
                const onclick = icon.getAttribute('onclick');
                if (onclick) {
                    eval(onclick);
                }
            }
        });
        
        // النقر للتحديد
        icon.addEventListener('click', (e) => {
            e.stopPropagation();
            selectIcon(icon);
        });
    });
    
    // النقر على سطح المكتب لإلغاء التحديد
    document.querySelector('.desktop').addEventListener('click', () => {
        deselectAllIcons();
    });
    
    // حفظ المواقع قبل الخروج
    window.addEventListener('beforeunload', () => {
        saveIconsPositions();
    });
}

// ========== جعل الأيقونة قابلة للسحب ==========
function makeIconDraggable(icon) {
    icon.addEventListener('mousedown', (e) => {
        // الزر الأيسر فقط
        if (e.button !== 0) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        startDrag(icon, e.clientX, e.clientY);
    });
}

// ========== بدء السحب ==========
function startDrag(icon, mouseX, mouseY) {
    isDragging = true;
    currentIcon = icon;
    
    // حساب موقع الأيقونة الحالي
    const rect = icon.getBoundingClientRect();
    const desktopRect = document.querySelector('.desktop').getBoundingClientRect();
    
    iconStartLeft = rect.left - desktopRect.left;
    iconStartTop = rect.top - desktopRect.top;
    
    // حساب الإزاحة بين الماوس وحافة الأيقونة
    dragOffsetX = mouseX - rect.left;
    dragOffsetY = mouseY - rect.top;
    
    // إضافة كلاس السحب
    icon.classList.add('dragging');
    
    // تحديد الأيقونة
    selectIcon(icon);
    
    // إضافة مستمعين للحركة والإفلات
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', onDragEnd);
}

// ========== أثناء السحب ==========
function onDrag(e) {
    if (!isDragging || !currentIcon) return;
    
    e.preventDefault();
    
    const desktop = document.querySelector('.desktop');
    const desktopRect = desktop.getBoundingClientRect();
    
    // حساب الموقع الجديد
    let newLeft = e.clientX - desktopRect.left - dragOffsetX;
    let newTop = e.clientY - desktopRect.top - dragOffsetY;
    
    // منع خروج الأيقونة من سطح المكتب
    const iconWidth = currentIcon.offsetWidth;
    const iconHeight = currentIcon.offsetHeight;
    
    newLeft = Math.max(DESKTOP_PADDING, Math.min(newLeft, desktopRect.width - iconWidth - DESKTOP_PADDING));
    newTop = Math.max(DESKTOP_PADDING, Math.min(newTop, desktopRect.height - iconHeight - DESKTOP_PADDING));
    
    // تطبيق الموقع الجديد
    currentIcon.style.left = newLeft + 'px';
    currentIcon.style.top = newTop + 'px';
    currentIcon.style.right = 'auto';
    currentIcon.style.bottom = 'auto';
}

// ========== نهاية السحب ==========
function onDragEnd(e) {
    if (!isDragging || !currentIcon) {
        resetDrag();
        return;
    }
    
    // إزالة كلاس السحب
    currentIcon.classList.remove('dragging');
    
    // حفظ المواقع
    saveIconsPositions();
    
    resetDrag();
}

// ========== إعادة ضبط حالة السحب ==========
function resetDrag() {
    isDragging = false;
    currentIcon = null;
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', onDragEnd);
}

// ========== تحديد أيقونة ==========
function selectIcon(icon) {
    deselectAllIcons();
    icon.classList.add('selected');
    selectedIcon = icon;
}

// ========== إلغاء تحديد جميع الأيقونات ==========
function deselectAllIcons() {
    document.querySelectorAll('.desktop-icon').forEach(i => {
        i.classList.remove('selected');
    });
    selectedIcon = null;
}

// ========== تعيين موقع افتراضي للأيقونة ==========
function setDefaultIconPosition(icon, index) {
    const defaultPositions = [
        { left: 30, top: 30 },
        { left: 30, top: 130 },
        { left: 30, top: 230 },
        { left: 30, top: 330 },
        { left: 130, top: 30 },
        { left: 130, top: 130 },
        { left: 130, top: 230 }
    ];
    
    const pos = defaultPositions[index] || { left: 30 + (index * 100), top: 30 };
    
    icon.style.left = pos.left + 'px';
    icon.style.top = pos.top + 'px';
    icon.style.right = 'auto';
    icon.style.bottom = 'auto';
}

// ========== حفظ مواقع الأيقونات ==========
function saveIconsPositions() {
    const icons = document.querySelectorAll('.desktop-icon');
    const positions = {};
    
    icons.forEach(icon => {
        const span = icon.querySelector('span');
        if (span) {
            const name = span.innerText;
            positions[name] = {
                left: icon.style.left || '30px',
                top: icon.style.top || '30px'
            };
        }
    });
    
    localStorage.setItem('desktopIconsPositions', JSON.stringify(positions));
    console.log('💾 تم حفظ مواقع الأيقونات');
}

// ========== تحميل مواقع الأيقونات ==========
function loadIconsPositions() {
    const saved = localStorage.getItem('desktopIconsPositions');
    if (!saved) return;
    
    try {
        const positions = JSON.parse(saved);
        const icons = document.querySelectorAll('.desktop-icon');
        
        icons.forEach(icon => {
            const span = icon.querySelector('span');
            if (span && positions[span.innerText]) {
                icon.style.left = positions[span.innerText].left;
                icon.style.top = positions[span.innerText].top;
                icon.style.right = 'auto';
                icon.style.bottom = 'auto';
            }
        });
        
        console.log('📂 تم تحميل مواقع الأيقونات');
    } catch (e) {
        console.warn('⚠️ فشل تحميل مواقع الأيقونات');
    }
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
    triggerAlert('📂 تم ترتيب الأيقونات حسب الاسم');
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
    triggerAlert('📂 تم ترتيب الأيقونات حسب النوع');
}

function snapIconsToGrid() {
    const icons = document.querySelectorAll('.desktop-icon');
    const gridSize = 100;
    
    icons.forEach(icon => {
        let left = parseInt(icon.style.left) || 30;
        let top = parseInt(icon.style.top) || 30;
        
        left = Math.round(left / gridSize) * gridSize;
        top = Math.round(top / gridSize) * gridSize;
        
        icon.style.left = left + 'px';
        icon.style.top = top + 'px';
    });
    
    saveIconsPositions();
    triggerAlert('📐 تم محاذاة الأيقونات للشبكة');
}

function rearrangeIcons(sortedIcons) {
    const container = document.querySelector('.desktop-icons');
    let topOffset = 30;
    let leftOffset = 30;
    
    sortedIcons.forEach((icon, index) => {
        if (index > 0 && index % 7 === 0) {
            leftOffset += 100;
            topOffset = 30;
        }
        
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
    const icons = document.querySelectorAll('.desktop-icon');
    
    icons.forEach((icon, index) => {
        setDefaultIconPosition(icon, index);
    });
    
    saveIconsPositions();
    triggerAlert('🔄 تم إعادة الأيقونات إلى الوضع الافتراضي');
}

// ========== عرض قائمة الترتيب ==========
function showArrangeMenu(x, y) {
    const existingMenu = document.querySelector('.desktop-arrange-menu');
    if (existingMenu) existingMenu.remove();
    
    const menu = document.createElement('div');
    menu.className = 'desktop-arrange-menu';
    menu.innerHTML = `
        <div class="desktop-arrange-item" onclick="arrangeIconsByName(); this.parentElement.remove();">
            <i class="fas fa-sort-alpha-down"></i>
            <span>ترتيب حسب الاسم</span>
        </div>
        <div class="desktop-arrange-item" onclick="arrangeIconsByType(); this.parentElement.remove();">
            <i class="fas fa-folder"></i>
            <span>ترتيب حسب النوع</span>
        </div>
        <div class="desktop-arrange-divider"></div>
        <div class="desktop-arrange-item" onclick="snapIconsToGrid(); this.parentElement.remove();">
            <i class="fas fa-th"></i>
            <span>محاذاة للشبكة</span>
        </div>
        <div class="desktop-arrange-item" onclick="resetIconsToDefault(); this.parentElement.remove();">
            <i class="fas fa-undo-alt"></i>
            <span>إعادة إلى الوضع الافتراضي</span>
        </div>
    `;
    
    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
    
    document.body.appendChild(menu);
    
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 10);
}

// ========== تهيئة ==========
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initFreeDesktop, 500);
});

// تصدير الدوال للاستخدام العام
window.arrangeIconsByName = arrangeIconsByName;
window.arrangeIconsByType = arrangeIconsByType;
window.snapIconsToGrid = snapIconsToGrid;
window.resetIconsToDefault = resetIconsToDefault;
window.showArrangeMenu = showArrangeMenu;

console.log('✅ Free Desktop loaded');