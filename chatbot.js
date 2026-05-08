/* ============================================================
   VANDANA MEDICAL — chatbot.js
   Offline AI Health Advisor (MedBot)
   No API key required — smart keyword-based responses
   ============================================================ */

'use strict';

/* ─── Knowledge Base ─── */
const KB = {
  'vitamin d': `Great question! Our **Vitamin D3 + K2 Complex** ($34.99) is our #1 best seller.
D3 supports bone density, immunity, and mood — while K2 directs calcium to your bones (not arteries).
💡 Pro tip: Take with a fatty meal in the morning for 40% better absorption!`,

  'magnesium': `Our **Magnesium Glycinate 400mg** ($22.99) is perfect for sleep and muscle recovery.
Glycinate is the most bioavailable form — gentle on the stomach.
💡 Take 1–2 capsules 30 mins before bed. 78% of customers report better sleep within 2 weeks!`,

  'omega': `**Omega-3 Fish Oil Ultra** ($38.99) — triple-strength with 2000mg EPA+DHA per serving.
Excellent for heart health, brain function, and reducing inflammation.
💡 Most effective when taken with your largest meal of the day!`,

  'sleep': `For better sleep, I recommend:
1. **Magnesium Glycinate** ($22.99) — relaxes muscles and calms the nervous system
2. **Hatch Baby Rest Night Light** ($72) — for consistent sleep schedule

💡 Avoid screens 1 hour before bed for best results!`,

  'immunity': `Our top immunity picks:
1. **Immunity Booster Bundle** ($54.99) — Vitamin C + Zinc + Elderberry + Quercetin
2. **Vitamin D3 + K2** ($34.99) — low D3 linked to 50% higher infection risk
3. **Omega-3 Fish Oil** ($38.99) — powerful anti-inflammatory

Use code **FIRST10** for 10% off your first order! 🛡`,

  'blood pressure': `Our **Digital Blood Pressure Monitor** ($65) is clinically validated with Bluetooth sync.
Features: irregular heartbeat detection, memory for 2 users, OLED display.
⚡ Flash sale today — only 1 unit left! Also check your sodium, exercise regularly, and manage stress.`,

  'biotin': `**Biotin Complex + Coconut Oil** ($28.50) is excellent for hair, skin, and nail health.
High-potency formula with organic coconut oil for better absorption.
💡 Results typically visible within 8–12 weeks of consistent use!`,

  'humidifier': `**Premium Home Humidifier** ($45) — ultrasonic cool-mist with aromatherapy diffuser.
Ideal for dry winters, sinusitis, and better sleep quality.
Works with our Essential Oils Set for maximum benefit! 🌿`,

  'zinc': `**Zinc + Copper Balance** ($18.99) maintains the ideal zinc-to-copper ratio.
Essential for immune function, wound healing, and hormone balance.
💡 Always pair zinc with copper to prevent imbalance with long-term use.`,

  'price': `Our products range from $18.99 to $89.99.
💰 Use code **FIRST10** for 10% off your first order!
Free delivery on all orders above ₹999.`,

  'delivery': `✅ Free delivery on orders above ₹999
🚀 Same-day dispatch for orders before 2 PM
📦 Delivery in 2–3 business days pan-India
🔄 Easy 30-day returns`,

  'best seller': `Our top sellers right now:
1. 🥇 **Omega-3 Fish Oil Ultra** — 3,002 reviews ⭐
2. 🥈 **Blood Pressure Monitor** — 3,210 reviews
3. 🥉 **Vitamin D3 + K2** — 2,847 reviews
4. **Immunity Bundle** — 2,134 reviews

All available with free delivery! 🏆`,

  'contact': `You can reach Vandana Medical at:
📍 Main Market, Near Civil Hospital, Lakhimpur Kheri, UP — 262701
📞 +91 98765 43210
✉️ hello@vandanamedical.com
🕐 Mon–Sat: 9 AM – 8 PM | AI Support: 24/7`,

  'owner': `Vandana Medical is owned by **Anmol Agnihotri**, based in **Lakhimpur Kheri, Uttar Pradesh**.
We've been serving the community since 2012 with pharmaceutical-grade health products and honest wellness guidance. 🌿`,

  'discount': `💰 Current offers:
• Use code **FIRST10** for 10% off your first order
• Flash sale on Biotin Complex — limited stock!
• Bundle deals on immunity products
• Free delivery above ₹999`,

  'toothbrush': `**Smart Electric Toothbrush** ($79.99 — was $99.99):
5 brushing modes, UV sanitizer base, pressure sensor, and smart timer.
10x more effective than manual brushing! Perfect for complete oral care. 🦷`,

  'pulse oximeter': `**Digital Pulse Oximeter** ($29.99 — was $45):
Measures SpO2 (blood oxygen) and heart rate in 1 second.
OLED display, long battery life. Essential for home health monitoring! 💓`,

  'essential oil': `**Essential Oils Wellness Set** ($89.99) — 12 pure therapeutic-grade oils.
Includes: Lavender, Peppermint, Eucalyptus, Tea Tree, and more!
Perfect for aromatherapy, stress relief, and better sleep. 🌸`,

  'default': `Thanks for your question! I'm here to help you find the right health products.

At Vandana Medical, we carry:
💊 **Vitamins** — D3, Omega-3, Biotin, and more
⚗️ **Minerals** — Magnesium, Zinc, and more
🩺 **Medical Devices** — BP Monitor, Pulse Oximeter
🌿 **Wellness** — Essential Oils, Humidifier

Could you tell me more about your specific health goal? I'll recommend the best products for you! 😊`,
};

/* ─── Find Best Response ─── */
function getBotReply(message) {
  const m = message.toLowerCase();
  for (const [key, val] of Object.entries(KB)) {
    if (m.includes(key)) return val;
  }
  // Fuzzy: check individual words
  const words = m.split(/\s+/);
  const partialKeys = {
    'sleep': 'sleep', 'immune': 'immunity', 'bone': 'vitamin d',
    'hair': 'biotin', 'brain': 'omega', 'heart': 'omega',
    'offer': 'discount', 'sale': 'discount', 'coupon': 'discount',
    'ship': 'delivery', 'deliver': 'delivery', 'return': 'delivery',
    'owner': 'owner', 'anmol': 'owner', 'location': 'contact',
    'address': 'contact', 'phone': 'contact',
    'popular': 'best seller', 'trending': 'best seller',
  };
  for (const word of words) {
    if (partialKeys[word]) return KB[partialKeys[word]];
  }
  return KB.default;
}

/* ─── Format Markdown-lite ─── */
function formatReply(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
}

/* ─── Append Message ─── */
function appendMessage(role, text) {
  const msgs = document.getElementById('chatbot-messages');
  if (!msgs) return;

  const div = document.createElement('div');
  div.className = 'chat-msg' + (role === 'user' ? ' user' : '');
  div.innerHTML = `
    <div class="chat-msg-ava ${role}">${role === 'user' ? '👤' : '🤖'}</div>
    <div class="chat-bubble ${role}">${formatReply(text)}</div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;

  // Hide suggestions after first user message
  if (role === 'user') {
    const sugs = document.getElementById('chatbot-suggestions');
    if (sugs) sugs.style.display = 'none';
  }
}

/* ─── Show Typing ─── */
function showTyping() {
  const msgs = document.getElementById('chatbot-messages');
  if (!msgs) return;
  const div = document.createElement('div');
  div.className = 'chat-msg'; div.id = 'typing-indicator';
  div.innerHTML = `
    <div class="chat-msg-ava bot">🤖</div>
    <div class="chat-bubble bot"><div class="chat-typing"><span></span><span></span><span></span></div></div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function removeTyping() {
  const t = document.getElementById('typing-indicator');
  if (t) t.remove();
}

/* ─── Send Message ─── */
function sendChatMessage() {
  const inp = document.getElementById('chatbot-input');
  if (!inp) return;
  const msg = inp.value.trim();
  if (!msg) return;
  inp.value = '';

  appendMessage('user', msg);
  showTyping();

  setTimeout(() => {
    removeTyping();
    const reply = getBotReply(msg);
    appendMessage('bot', reply);
  }, 600 + Math.random() * 600);
}

/* ─── Suggestion Click ─── */
function sendSuggestion(el) {
  const inp = document.getElementById('chatbot-input');
  if (inp) inp.value = el.textContent;
  sendChatMessage();
}

/* ─── Clear Chat ─── */
function clearChatMessages() {
  const msgs = document.getElementById('chatbot-messages');
  if (!msgs) return;
  msgs.innerHTML = `
    <div class="chat-msg">
      <div class="chat-msg-ava bot">🤖</div>
      <div class="chat-bubble bot">Hello! I'm <strong>MedBot</strong>, your AI health advisor at Vandana Medical.
I can help you find the right supplements, explain product benefits, or answer health questions.
How can I help you today? 💊</div>
    </div>`;
  const sugs = document.getElementById('chatbot-suggestions');
  if (sugs) sugs.style.display = 'flex';
}

/* ─── Enter Key ─── */
document.addEventListener('DOMContentLoaded', () => {
  const inp = document.getElementById('chatbot-input');
  if (inp) {
    inp.addEventListener('keydown', e => {
      if (e.key === 'Enter') sendChatMessage();
    });
  }
});
