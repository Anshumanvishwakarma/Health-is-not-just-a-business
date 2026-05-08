/* ============================================================
   VANDANA MEDICAL — main.js
   Navigation, page routing, scroll effects, animations
   ============================================================ */

'use strict';

/* ─── Page Router ─── */
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pg = document.getElementById('page-' + name);
  if (pg) pg.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Update active nav link
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === name);
  });

  // Lazy render page-specific content
  if (name === 'shop')      renderShop();
  if (name === 'dashboard') renderDashboard();
  closeMobileMenu();
  closeCart();
}

/* ─── Nav Scroll Effect ─── */
window.addEventListener('scroll', () => {
  document.getElementById('main-nav')
    .classList.toggle('scrolled', window.scrollY > 20);
});

/* ─── Mobile Menu ─── */
function toggleMobileMenu() {
  document.getElementById('mobile-menu').classList.toggle('open');
}
function closeMobileMenu() {
  document.getElementById('mobile-menu').classList.remove('open');
}

/* ─── Category Filter → Shop ─── */
function filterAndShow(cat) {
  window._shopCat = cat;
  showPage('shop');
  // Highlight correct tab after render
  setTimeout(() => {
    document.querySelectorAll('.cat-filter-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.cat === cat);
    });
    renderShop();
  }, 50);
}

/* ─── Dashboard Tab Switcher ─── */
function setDashTab(id, el) {
  document.querySelectorAll('[id^="dt-"]').forEach(t => t.style.display = 'none');
  const tab = document.getElementById('dt-' + id);
  if (tab) tab.style.display = 'block';
  document.querySelectorAll('.sb-btn').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
}

/* ─── Auth ─── */
function doSignIn() {
  const email = document.getElementById('auth-email').value;
  const pwd   = document.getElementById('auth-pwd').value;
  const err   = document.getElementById('auth-err');

  if (email === 'demo@vandanamedical.com' && pwd === 'demo123') {
    err.classList.remove('show');
    const user = { name: 'Demo User', email, avatar: 'DU' };
    localStorage.setItem('vm_user', JSON.stringify(user));
    showPage('dashboard');
    renderDashboard();
  } else {
    err.classList.add('show');
  }
}

function demoLogin() {
  document.getElementById('auth-email').value = 'demo@vandanamedical.com';
  document.getElementById('auth-pwd').value   = 'demo123';
  doSignIn();
}

function doSignOut() {
  localStorage.removeItem('vm_user');
  showPage('home');
}

/* ─── Settings Save ─── */
function saveSettings() {
  const u = JSON.parse(localStorage.getItem('vm_user') || '{}');
  u.name  = document.getElementById('set-name').value  || u.name;
  u.email = document.getElementById('set-email').value || u.email;
  localStorage.setItem('vm_user', JSON.stringify(u));
  renderDashboard();
  const btn = document.getElementById('save-settings-btn');
  const orig = btn.innerHTML;
  btn.innerHTML = '<span>Saved ✓</span>';
  setTimeout(() => btn.innerHTML = orig, 2000);
}

/* ─── Contact Form ─── */
function submitContact() {
  document.getElementById('contact-form-wrap').style.display = 'none';
  document.getElementById('contact-success').classList.add('show');
}
function resetContact() {
  document.getElementById('contact-form-wrap').style.display = 'block';
  document.getElementById('contact-success').classList.remove('show');
}

/* ─── Location ─── */
function saveLocation() {
  const loc = {
    storeName: document.getElementById('loc-store-name').value,
    address:   document.getElementById('loc-address').value,
    city:      document.getElementById('loc-city').value,
    state:     document.getElementById('loc-state').value,
    pin:       document.getElementById('loc-pin').value,
    phone:     document.getElementById('loc-phone').value,
  };
  localStorage.setItem('vm_location', JSON.stringify(loc));
  updateLocationDisplay(loc);
  const btn = document.getElementById('save-location-btn');
  const orig = btn.innerHTML;
  btn.innerHTML = '<span>Location Saved ✓</span>';
  setTimeout(() => btn.innerHTML = orig, 2000);
}

function updateLocationDisplay(loc) {
  const el = document.getElementById('loc-display');
  if (!el || !loc) return;
  const addr = document.getElementById('loc-display-addr');
  const sub  = document.getElementById('loc-display-sub');
  if (addr) addr.textContent = loc.storeName || 'Vandana Medical Store';
  if (sub)  sub.textContent  = `${loc.address || ''}, ${loc.city || 'Lakhimpur Kheri'}, ${loc.state || 'UP'} - ${loc.pin || '262701'}`;
}

function loadSavedLocation() {
  const saved = JSON.parse(localStorage.getItem('vm_location') || 'null');
  if (!saved) {
    // Default
    const def = {
      storeName: 'Vandana Medical Store',
      address:   'Main Market, Near Civil Hospital',
      city:      'Lakhimpur Kheri',
      state:     'Uttar Pradesh',
      pin:       '262701',
      phone:     '+91 98765 43210',
    };
    updateLocationDisplay(def);
    return;
  }
  ['store-name','address','city','pin','phone'].forEach(id => {
    const el = document.getElementById('loc-' + id);
    const key = id.replace('-','_');
    const val = saved[key] || saved[id.replace('-','')];
    if (el && val) el.value = val;
  });
  const stateEl = document.getElementById('loc-state');
  if (stateEl && saved.state) stateEl.value = saved.state;
  updateLocationDisplay(saved);
}

/* ─── Dashboard Render ─── */
function renderDashboard() {
  const user = JSON.parse(localStorage.getItem('vm_user') || 'null');

  if (user) {
    const ava   = document.getElementById('dash-ava');
    const name  = document.getElementById('dash-name');
    const email = document.getElementById('dash-email');
    if (ava)   ava.textContent   = user.avatar || user.name[0].toUpperCase();
    if (name)  name.textContent  = user.name;
    if (email) email.textContent = user.email;

    const sn = document.getElementById('set-name');
    const se = document.getElementById('set-email');
    if (sn) sn.value = user.name;
    if (se) se.value = user.email;
  }

  // Health recommendations
  const hrg = document.getElementById('health-recs-grid');
  if (hrg && window.PRODUCTS) {
    hrg.innerHTML = window.PRODUCTS.filter(p => p.featured).slice(0, 4).map(p => `
      <div style="display:flex;align-items:center;gap:1.2rem;padding:1rem;border-radius:1.4rem;border:1px solid var(--border);background:#fff;transition:all .2s"
           onmouseover="this.style.borderColor='rgba(201,168,76,.3)'" onmouseout="this.style.borderColor='var(--border)'">
        <img src="${p.img}" style="width:4.4rem;height:4.4rem;border-radius:1rem;object-fit:cover;flex-shrink:0" alt="${p.name}">
        <div style="flex:1;min-width:0">
          <p style="font-size:1.2rem;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text)">${p.name}</p>
          <p style="font-size:1.1rem;color:var(--green-mid);font-weight:700">$${p.price.toFixed(2)}</p>
        </div>
        <button onclick="addToCart(${p.id})" style="background:rgba(20,83,45,.08);color:var(--green-mid);border:none;padding:.5rem 1rem;border-radius:.8rem;font-size:1.1rem;font-weight:600;cursor:pointer;font-family:var(--font-body)">Add</button>
      </div>`).join('');
  }

  // Wishlist
  const wg = document.getElementById('wishlist-grid');
  if (wg && window.PRODUCTS) {
    wg.innerHTML = window.PRODUCTS.slice(0, 6).map(p => `
      <div style="display:flex;align-items:center;gap:1.2rem;padding:1.2rem;border-radius:1.4rem;border:1px solid var(--border);background:#fff">
        <img src="${p.img}" style="width:5.2rem;height:5.2rem;border-radius:1.2rem;object-fit:cover;flex-shrink:0" alt="${p.name}">
        <div style="flex:1;min-width:0">
          <p style="font-size:1.2rem;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text)">${p.name}</p>
          <p style="font-size:1.3rem;font-weight:700;color:var(--green-mid)">$${p.price.toFixed(2)}</p>
        </div>
        <button onclick="addToCart(${p.id})" class="btn-primary" style="font-size:1.1rem;padding:.6rem 1.2rem;flex-shrink:0"><span>Add</span></button>
      </div>`).join('');
  }
}

/* ─── Scroll-triggered Reveal ─── */
function initReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity .6s ease ${i * 0.1}s, transform .6s ease ${i * 0.1}s`;
    obs.observe(el);
  });
}

/* ─── Init ─── */
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  loadSavedLocation();
  updateCartUI();
});
