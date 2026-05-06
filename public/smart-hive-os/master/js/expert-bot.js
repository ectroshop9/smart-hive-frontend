// expert-bot.js - مستشار النحل
const expertKnowledge = {
    varroa: { keywords: ['فاروا', 'varroa'], answer: '🦠 **الفاروا**\n\n📝 طفيلي خارجي.\n💊 **العلاج:** حمض الفورميك 65% - الخريف.' },
    nosema: { keywords: ['نوزيما', 'nosema'], answer: '🔬 **النوزيما**\n\n📝 مرض معوي.\n💊 **العلاج:** الفوماجلين.' },
    distance: { keywords: ['مسافة', 'قانون', 'ترخيص'], answer: '⚖️ **المسافات:** 500م من التجمعات، 100م من الطرق.' },
    honey: { keywords: ['عسل', 'قطف'], answer: '🍯 **القطف:** مايو-يونيو (ربيعي)، أغسطس-سبتمبر (صيفي).' }
};

function findExpertAnswer(q) {
    q = q.toLowerCase();
    for (let k in expertKnowledge) for (let kw of expertKnowledge[k].keywords) if (q.includes(kw.toLowerCase())) return expertKnowledge[k].answer;
    return '✅ لم أجد. جرب: "ما علاج الفاروا؟"';
}

function addMessage(container, text, sender) {
    const div = document.createElement('div');
    div.className = sender === 'user' ? 'user-bubble' : 'ai-bubble';
    div.innerHTML = text.replace(/\n/g,'<br>').replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>');
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

async function sendMessageFromPage() {
    const input = document.getElementById('aiChatInput'), body = document.getElementById('aiChatBody');
    const msg = input.value.trim(); if (!msg) return;
    addMessage(body, msg, 'user'); input.value = '';
    try {
        const response = await fetch(`${CONFIG.API_BASE}/expert/ask`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: msg }) });
        const data = await response.json();
        addMessage(body, data.answer, 'bot');
    } catch (error) {
        setTimeout(() => addMessage(body, findExpertAnswer(msg), 'bot'), 800);
    }
}

function askExpertFromPage(q) { document.getElementById('aiChatInput').value = q; sendMessageFromPage(); }
function diagnoseCurrentHive() { askExpertFromPage(`تشخيص ${getCurrentHive()?.id || 'HIVE-01'}`); }

console.log('✅ Expert Bot loaded');