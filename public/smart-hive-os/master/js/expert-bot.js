// expert-bot.js - Bee Advisor (i18n Ready - 69 Wilayas)
let expertKnowledge = {
    diseases: [], pests: [], laws: [], honey_types: [],
    floral_calendar: [], queen_rearing: null, guide: null, wilayas: []
};

const CACHE_CONFIG = { KEY: 'expert_knowledge_cache', VERSION: 'v2.0.0', TTL: 3600000 };

// ==================== Helper ====================
function _(key, fallback) {
    return (typeof osT === 'function' ? osT(key) : null) || fallback || key;
}

function normalizeArabic(text) {
    if (!text) return '';
    return text.replace(/[أإآا]/g, 'ا').replace(/ة/g, 'ه').replace(/[ىي]/g, 'ي')
        .replace(/\s+/g, ' ').trim().toLowerCase();
}

function levenshteinDistance(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            matrix[i][j] = Math.min(matrix[i-1][j]+1, matrix[i][j-1]+1, matrix[i-1][j-1]+(a[j-1]===b[i-1]?0:1));
        }
    }
    return matrix[b.length][a.length];
}

function fuzzyMatch(text, keyword, threshold = 0.65) {
    if (!text || !keyword) return 0;
    text = normalizeArabic(text); keyword = normalizeArabic(keyword);
    if (text.includes(keyword)) return 1.0;
    const words = text.split(' '); let maxSimilarity = 0;
    for (const word of words) {
        if (word.length < 3) continue;
        const distance = levenshteinDistance(word, keyword);
        const similarity = 1 - (distance / Math.max(word.length, keyword.length));
        maxSimilarity = Math.max(maxSimilarity, similarity);
    }
    return maxSimilarity >= threshold ? maxSimilarity : 0;
}

async function loadKnowledgeBase() {
    const basePath = '/data/knowledge';
    const cached = localStorage.getItem(CACHE_CONFIG.KEY);
    if (cached) {
        try {
            const { data, version, timestamp } = JSON.parse(cached);
            if (version === CACHE_CONFIG.VERSION && (Date.now() - timestamp) < CACHE_CONFIG.TTL) {
                expertKnowledge = data; return true;
            }
        } catch (e) {}
    }
    
    try {
        const [diseasesRes, lawsRes, honeyRes, floralRes, queenRes, guideRes, wilayaRes] = await Promise.all([
            fetch(`${basePath}/diseases.json`), fetch(`${basePath}/bee_laws.json`),
            fetch(`${basePath}/honey_types.json`), fetch(`${basePath}/floral_calendar.json`),
            fetch(`${basePath}/queen_rearing.json`), fetch(`${basePath}/beekeeping_guide.json`),
            fetch(`${basePath}/wilaya_info.json`)
        ]);
        const [diseasesData, lawsData, honeyData, floralData, queenData, guideData, wilayaData] = await Promise.all([
            diseasesRes.json(), lawsRes.json(), honeyRes.json(), floralRes.json(), queenRes.json(), guideRes.json(), wilayaRes.json()
        ]);
        expertKnowledge = {
            diseases: diseasesData.diseases || [], pests: diseasesData.pests || [],
            laws: lawsData.chapters || [], honey_types: honeyData.honey_types || [],
            floral_calendar: floralData.regions || [], queen_rearing: queenData,
            guide: guideData, wilayas: wilayaData.wilayas || []
        };
        localStorage.setItem(CACHE_CONFIG.KEY, JSON.stringify({ data: expertKnowledge, version: CACHE_CONFIG.VERSION, timestamp: Date.now() }));
        return true;
    } catch (error) {
        if (cached) { try { expertKnowledge = JSON.parse(cached).data; return true; } catch (e) {} }
        loadFallbackKnowledge(); return false;
    }
}

function loadFallbackKnowledge() {
    expertKnowledge = {
        diseases: [
            { name_ar: 'الفاروا', keywords: ['فاروا'], symptoms: ['ضعف النحل', 'تشوه الأجنحة'],
              treatment: [{ method: 'حمض الفورميك 65%', timing: ['الخريف'] }], prevention: ['فحص دوري'] },
            { name_ar: 'النوزيما', keywords: ['نوزيما'], symptoms: ['إسهال', 'زحف النحل'],
              treatment: [{ method: 'فوماجلين' }], prevention: ['موقع مشمس'] }
        ],
        pests: [{ name_ar: 'الدبابير', keywords: ['دبور'], damage: ['تفترس النحل'], control: [{ method: 'مصيدة' }] }],
        laws: [{ name: 'المسافات القانونية', articles: [{ subject: 'المسافة عن الطرق', detail: '20 متر' }] }],
        honey_types: [{ name: 'عسل السدر', season: 'الخريف' }, { name: 'عسل الحمضيات', season: 'الربيع' }],
        floral_calendar: [], queen_rearing: null, guide: null, wilayas: [
            { id: 16, name_ar: 'الجزائر العاصمة', region: 'الساحل' },
            { id: 1, name_ar: 'أدرار', region: 'الصحراء', is_desert: true }
        ]
    };
}

function searchKnowledgeBase(question) {
    const normalizedQ = normalizeArabic(question);
    const results = [];
    
    for (const disease of expertKnowledge.diseases) {
        const keywords = disease.keywords || [disease.name_ar];
        for (const kw of keywords) {
            if (kw && normalizedQ.includes(normalizeArabic(kw))) {
                results.push({ type: 'disease', priority: 10, data: disease }); break;
            }
        }
    }
    for (const pest of expertKnowledge.pests) {
        for (const kw of (pest.keywords || [pest.name_ar])) {
            if (kw && normalizedQ.includes(normalizeArabic(kw))) {
                results.push({ type: 'pest', priority: 8, data: pest }); break;
            }
        }
    }
    for (const honey of expertKnowledge.honey_types) {
        if (normalizedQ.includes(normalizeArabic(honey.name)) || normalizedQ.includes('عسل')) {
            results.push({ type: 'honey', priority: 6, data: honey });
        }
    }
    for (const wilaya of expertKnowledge.wilayas) {
        if (normalizedQ.includes(normalizeArabic(wilaya.name_ar))) {
            results.push({ type: 'wilaya', priority: 10, data: wilaya });
        }
    }
    results.sort((a, b) => b.priority - a.priority);
    return results;
}

function formatAnswer(results) {
    if (results.length === 0) {
        return _('ai.noAnswer', '✅ لم أجد إجابة دقيقة. جرب:\n• "ما علاج الفاروا؟"\n• "أعراض النوزيما"\n• "المسافة القانونية"\n• "أنواع العسل الجزائري"');
    }
    const best = results[0]; let answer = '';
    switch (best.type) {
        case 'disease':
            const d = best.data;
            answer = `🦠 **${d.name_ar}**\n\n`;
            if (d.symptoms?.length) answer += `📝 ${_('ai.symptoms', 'الأعراض')}:\n${d.symptoms.map(s => '• '+s).join('\n')}\n\n`;
            if (d.treatment?.length) {
                answer += `💊 ${_('ai.treatment', 'العلاج')}:\n`;
                d.treatment.forEach(t => answer += `• ${t.method || t}\n`);
            }
            if (d.prevention?.length) answer += `\n🛡️ ${_('ai.prevention', 'الوقاية')}:\n${d.prevention.map(p => '• '+p).join('\n')}`;
            break;
        case 'wilaya':
            const w = best.data;
            answer = `📍 ${_('ai.wilaya', 'ولاية')} ${w.name_ar}\n\n`;
            answer += `🌍 ${_('ai.region', 'المنطقة')}: ${w.region}\n`;
            if (w.nectar_plants?.length) answer += `\n🌿 ${_('ai.plants', 'النباتات')}:\n${w.nectar_plants.map(p => '• '+p).join('\n')}`;
            break;
        case 'honey':
            const h = best.data;
            answer = `🍯 **${h.name}**\n\n🌸 ${_('ai.season', 'الموسم')}: ${h.season || '-'}`;
            if (h.flavor) answer += `\n😋 ${_('ai.flavor', 'الطعم')}: ${h.flavor}`;
            break;
        default: answer = JSON.stringify(best.data);
    }
    return answer;
}

function findExpertAnswer(q) { return formatAnswer(searchKnowledgeBase(q)); }

function addMessage(container, text, sender) {
    const div = document.createElement('div');
    div.className = sender === 'user' ? 'user-bubble' : 'ai-bubble';
    if (sender === 'user') { div.textContent = text; }
    else { div.innerHTML = text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); }
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

async function sendMessageFromPage() {
    const input = document.getElementById('aiChatInput');
    const body = document.getElementById('aiChatBody');
    const msg = input.value.trim();
    if (!msg) return;
    addMessage(body, msg, 'user'); input.value = '';
    
    const thinkingText = _('ai.thinking', 'جاري التفكير...');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'ai-bubble typing';
    typingDiv.innerHTML = `<i class="fas fa-spinner fa-pulse"></i> ${thinkingText}`;
    body.appendChild(typingDiv);
    
    setTimeout(() => {
        typingDiv.remove();
        addMessage(body, findExpertAnswer(msg), 'bot');
    }, 800);
}

function askExpertFromPage(q) { document.getElementById('aiChatInput').value = q; sendMessageFromPage(); }
function diagnoseCurrentHive() { askExpertFromPage(_('ai.diagnoseCurrent', 'تشخيص الخلية الحالية')); }
function getCurrentHive() { const s = document.getElementById('hive-selector'); return s?.value ? { id: s.value } : { id: 'HIVE-01' }; }
function clearKnowledgeCache() { localStorage.removeItem(CACHE_CONFIG.KEY); return true; }
async function refreshKnowledgeBase() { clearKnowledgeCache(); return await loadKnowledgeBase(); }

document.addEventListener('DOMContentLoaded', async () => { await loadKnowledgeBase(); });

window.clearKnowledgeCache = clearKnowledgeCache;
window.refreshKnowledgeBase = refreshKnowledgeBase;
window.getCurrentHive = getCurrentHive;

console.log('✅ Expert Bot loaded (i18n Ready)');