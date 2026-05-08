/* ============================================================
   VANDANA MEDICAL — cart.js
   Products data, cart logic, shop rendering
   ============================================================ */

'use strict';

/* ─── Products Data ─── */
window.PRODUCTS = [
  { id:1,  name:'Vitamin D3 + K2 Complex',        cat:'vitamins', price:34.99, orig:49.99, rating:4.9, rev:2847, stock:5,  tot:33,  img:'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80', badge:'Best Seller', bc:'badge-green', featured:true,  cd:false },
  { id:2,  name:'Essential Oils Wellness Set',     cat:'wellness', price:89.99, orig:120,   rating:4.8, rev:1203, stock:2000,tot:2000,img:'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&q=80', badge:'New',         bc:'badge-blue',  featured:true,  cd:false },
  { id:3,  name:'Biotin Complex + Coconut Oil',    cat:'vitamins', price:28.50, orig:null,  rating:4.7, rev:934,  stock:9,  tot:23,  img:'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&q=80', badge:'Flash Sale',  bc:'badge-red',   featured:false, cd:true  },
  { id:4,  name:'Digital Blood Pressure Monitor',  cat:'devices',  price:65.00, orig:89,    rating:4.9, rev:3210, stock:1,  tot:33,  img:'https://images.unsplash.com/photo-1631563019676-dade0dbdb8b3?w=400&q=80', badge:'Almost Gone',bc:'badge-red',   featured:true,  cd:true  },
  { id:5,  name:'Smart Electric Toothbrush',       cat:'devices',  price:79.99, orig:99.99, rating:4.6, rev:758,  stock:5,  tot:33,  img:'https://images.unsplash.com/photo-1559591937-abc0a7e6f5a0?w=400&q=80', badge:null,          bc:null,          featured:false, cd:true  },
  { id:6,  name:'Premium Home Humidifier',         cat:'wellness', price:45.00, orig:null,  rating:4.5, rev:521,  stock:5,  tot:33,  img:'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80', badge:'Limited',    bc:'badge-gold',  featured:false, cd:false },
  { id:7,  name:'Magnesium Glycinate 400mg',       cat:'minerals', price:22.99, orig:29.99, rating:4.8, rev:1876, stock:45, tot:100, img:'https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&q=80', badge:'Top Rated',   bc:'badge-gold',  featured:true,  cd:false },
  { id:8,  name:'Immunity Booster Bundle',         cat:'vitamins', price:54.99, orig:79.99, rating:4.9, rev:2134, stock:5,  tot:33,  img:'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=400&q=80', badge:'Bundle Deal',bc:'badge-blue',  featured:true,  cd:true  },
  { id:9,  name:'Hatch Baby Rest Night Light',     cat:'wellness', price:72.00, orig:null,  rating:4.7, rev:1456, stock:5,  tot:33,  img:'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&q=80', badge:null,          bc:null,          featured:false, cd:false },
  { id:10, name:'Omega-3 Fish Oil Ultra',          cat:'vitamins', price:38.99, orig:49.99, rating:4.8, rev:3002, stock:78, tot:100, img:'https://images.unsplash.com/photo-1618015357798-c9bfda425a0e?w=400&q=80', badge:'Top Rated',  bc:'badge-green', featured:true,  cd:false },
  { id:11, name:'Zinc + Copper Balance',           cat:'minerals', price:18.99, orig:null,  rating:4.6, rev:678,  stock:60, tot:100, img:'https://images.unsplash.com/photo-1616012480717-5f23c5f39db7?w=400&q=80', badge:null,         bc:null,          featured:false, cd:false },
  { id:12, name:'Digital Pulse Oximeter',          cat:'devices',  price:29.99, orig:45.00, rating:4.7, rev:892,  stock:25, tot:50,  img:'https://images.unsplash.com/photo-1583324113626-70df0f4deaab?w=400&q=80', badge:'Sale',       bc:'badge-gold',  featured:false, cd:false },
];

/* ─── Cart State ─── */
let cart = JSON.parse(localStorage.getItem('vm_cart') || '[]');

function saveCart() {
  localStorage.setItem('vm_cart', JSON.stringify(cart));
  updateCartUI();
}

/* ─── Add / Remove / Qty ─── */
function addToCart(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const ex = cart.find(x => x.id === id);
  if (ex) ex.qty++;
  else cart.push({ id, qty: 1, name: p.name, price: p.price, img: p.img });
  saveCart();

  // Button feedback
  const btn = document.getElementById('add-btn-' + id);
  if (btn) {
    btn.classList.add('added');
    btn.textContent = '✓ Added!';
    setTimeout(() => {
      btn.classList.remove('added');
      btn.innerHTML = '🛒 Add';
    }, 1500);
  }
  openCart();
}

function removeFromCart(id) {
  cart = cart.filter(x => x.id !== id);
  saveCart();
}

function changeQty(id, delta) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty < 1) removeFromCart(id);
  else saveCart();
}

function clearCart() {
  cart = [];
  saveCart();
}

/* ─── Cart UI ─── */
function updateCartUI() {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);

  // Badge
  document.querySelectorAll('.cart-badge-count').forEach(el => el.textContent = count);

  // Totals
  const sub = document.getElementById('cart-subtotal');
  const tot = document.getElementById('cart-total');
  const cnt = document.getElementById('cart-drawer-count');
  if (sub) sub.textContent = '$' + total.toFixed(2);
  if (tot) tot.textContent = '$' + total.toFixed(2);
  if (cnt) cnt.textContent = count;

  const body = document.getElementById('cart-body');
  const foot = document.getElementById('cart-foot');
  if (!body) return;

  if (!cart.length) {
    body.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-ico">🛒</div>
        <h3>Your cart is empty</h3>
        <p style="font-size:1.3rem;color:var(--text-3)">Add some health essentials!</p>
        <button class="btn-primary" onclick="closeCart();showPage('shop')"><span>Shop Now</span></button>
      </div>`;
    if (foot) foot.style.display = 'none';
    return;
  }

  if (foot) foot.style.display = 'block';
  body.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img"><img src="${item.img}" alt="${item.name}" loading="lazy"></div>
      <div style="flex:1;min-width:0">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
        <div class="cart-qty">
          <button class="qty-btn" onclick="changeQty(${item.id},-1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id},1)">+</button>
        </div>
      </div>
      <div>
        <div class="cart-item-total">$${(item.price * item.qty).toFixed(2)}</div>
        <div class="cart-remove" onclick="removeFromCart(${item.id})">Remove</div>
      </div>
    </div>`).join('');
}

/* ─── Cart Drawer ─── */
function openCart() {
  document.getElementById('cart-overlay').classList.add('open');
  document.getElementById('cart-drawer').classList.add('open');
  updateCartUI();
}
function closeCart() {
  document.getElementById('cart-overlay').classList.remove('open');
  document.getElementById('cart-drawer').classList.remove('open');
}

/* ─── Wishlist ─── */
let wishlist = JSON.parse(localStorage.getItem('vm_wish') || '[]');

function toggleWishlist(id, btn) {
  const idx = wishlist.indexOf(id);
  if (idx === -1) {
    wishlist.push(id);
    if (btn) { btn.classList.add('wished'); }
  } else {
    wishlist.splice(idx, 1);
    if (btn) { btn.classList.remove('wished'); }
  }
  localStorage.setItem('vm_wish', JSON.stringify(wishlist));
}

/* ─── Countdown Timer ─── */
let timerVals = { h: 4, m: 21, s: 35 };
setInterval(() => {
  let { h, m, s } = timerVals;
  s--;
  if (s < 0) { s = 59; m--; }
  if (m < 0) { m = 59; h--; }
  if (h < 0) { h = 23; m = 59; s = 59; }
  timerVals = { h, m, s };
  const pad = n => String(n).padStart(2, '0');
  document.querySelectorAll('.cd-time').forEach(el => {
    el.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
  });
}, 1000);

/* ─── Product Card HTML ─── */
function makeProductCard(p) {
  const pct  = Math.round((p.stock / p.tot) * 100);
  const low  = pct < 20;
  const disc = p.orig ? Math.round((1 - p.price / p.orig) * 100) : 0;
  const wished = wishlist.includes(p.id);

  return `
<div class="prod-card" data-reveal>
  <div class="prod-img">
    <img src="${p.img}" alt="${p.name}" loading="lazy">
    ${p.badge ? `<span class="prod-badge ${p.bc}">${p.badge}</span>` : ''}
    ${disc > 0 ? `<span class="prod-badge badge-navy" style="top:${p.badge ? '3.8rem' : '1rem'}">${disc}% OFF</span>` : ''}
    <button class="prod-wish ${wished ? 'wished' : ''}"
            onclick="event.stopPropagation();toggleWishlist(${p.id},this)"
            title="Wishlist">♡</button>
    ${p.cd ? `<div class="prod-countdown"><span class="cd-dot"></span><span class="cd-time">04:21:35</span></div>` : ''}
  </div>
  <div class="prod-body">
    <div class="prod-cat">${p.cat}</div>
    <div class="prod-name">${p.name}</div>
    <div class="prod-stars">
      <span class="stars">${'★'.repeat(Math.floor(p.rating))}${'☆'.repeat(5 - Math.floor(p.rating))}</span>
      <span class="reviews">(${p.rev.toLocaleString()})</span>
    </div>
    <div class="prod-stock">
      <div class="stock-info">
        <span>${p.stock} left</span>
        <span class="${low ? 'stock-low' : ''}">${low ? '⚡ Almost gone' : `${p.tot - p.stock} sold`}</span>
      </div>
      <div class="stock-bar">
        <div class="stock-fill ${low ? 'red' : 'green'}" style="width:${Math.max(5, pct)}%"></div>
      </div>
    </div>
    <div class="prod-foot">
      <div>
        <span class="prod-price">$${p.price.toFixed(2)}</span>
        ${p.orig ? `<span class="prod-orig">$${p.orig.toFixed(2)}</span>` : ''}
      </div>
      <button class="add-btn" id="add-btn-${p.id}" onclick="addToCart(${p.id})">🛒 Add</button>
    </div>
  </div>
</div>`;
}

/* ─── Render Home Featured ─── */
function renderHomeProducts() {
  const el = document.getElementById('home-products-grid');
  if (!el) return;
  el.innerHTML = PRODUCTS.filter(p => p.featured).map(makeProductCard).join('');
}

/* ─── Shop State ─── */
let shopCat  = 'all';
let shopGrid = 4;

function renderShop() {
  if (window._shopCat) { shopCat = window._shopCat; window._shopCat = null; }

  const q   = (document.getElementById('shop-search') || {}).value?.toLowerCase() || '';
  const srt = (document.getElementById('shop-sort') || {}).value || 'default';

  let list = [...PRODUCTS];
  if (shopCat !== 'all') list = list.filter(p => p.cat === shopCat);
  if (q) list = list.filter(p => p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q));

  switch (srt) {
    case 'price-asc':  list.sort((a, b) => a.price - b.price); break;
    case 'price-desc': list.sort((a, b) => b.price - a.price); break;
    case 'rating':     list.sort((a, b) => b.rating - a.rating); break;
    case 'reviews':    list.sort((a, b) => b.rev - a.rev); break;
  }

  const grid = document.getElementById('shop-grid');
  const rc   = document.getElementById('shop-result-count');
  if (!grid) return;

  if (rc) rc.innerHTML = `Showing <strong style="color:#fff">${list.length}</strong> products`;
  grid.className = shopGrid === 4 ? 'products-grid' : 'products-grid';
  grid.style.gridTemplateColumns = shopGrid === 4
    ? 'repeat(4,1fr)' : 'repeat(3,1fr)';

  if (!list.length) {
    grid.innerHTML = `
      <div class="no-results" style="grid-column:1/-1">
        <div class="no-results-icon">🔍</div>
        <h3>No products found</h3>
        <p style="color:rgba(255,255,255,.5);font-size:1.4rem">Try adjusting your search or filters</p>
      </div>`;
    return;
  }

  grid.innerHTML = list.map(makeProductCard).join('');
}

function setCat(cat, el) {
  shopCat = cat;
  document.querySelectorAll('.cat-filter-tab').forEach(t => t.classList.remove('active'));
  if (el) el.classList.add('active');
  renderShop();
}

function setGrid(n) {
  shopGrid = n;
  document.getElementById('grid-btn-4').classList.toggle('active', n === 4);
  document.getElementById('grid-btn-3').classList.toggle('active', n === 3);
  renderShop();
}

/* ─── Init ─── */
document.addEventListener('DOMContentLoaded', () => {
  renderHomeProducts();
  updateCartUI();
});
