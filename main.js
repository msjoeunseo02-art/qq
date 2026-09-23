/* ===================================================
   main.js — 인터랙션 로직
   고래잇 X 이마트 보물찾기 포트폴리오 쇼케이스
   =================================================== */

/* ── CONFIG: 파일 경로 수정 시 이 객체만 변경 ──────── */
const CONFIG = {
  images: {
    cardnews: [
      '카드뉴스1.png',
      '카드뉴스2.png',
      '카드뉴스3.png',
      '카드뉴스4.png',
      '카드뉴스5.png',
      '카드뉴스6.png',
    ],
    poster: '카드뉴스1.png', // 포스터 이미지 경로
  },
  pdfs: {
    plan: '고래잇_x_이마트_보물찾기_홍보실행기획서_표제목색상수정본.pdf',
    brief: '고래잇_x_이마트_보물찾기_홍보실행기획서_표제목색상수정본.pdf',
  },
  video: '5조.mp4', // ← web 폴더 내에 5조.mp4 파일을 넣으면 바로 재생됩니다
};

/* ── 부산 이마트 지점 데이터 ─────────────────────── */
const EMART_BRANCHES = [
  {
    id: 1,
    name: '이마트 해운대점',
    address: '부산 해운대구 해운대로 772',
    lat: 35.1794,
    lng: 129.1755,
    type: 'flagship',
    typeLabel: '프리미엄',
    hours: '영업시간: 10:00 ~ 23:00',
    features: ['트레이더스', '이마트몰'],
  },
  {
    id: 2,
    name: '이마트 연제점',
    address: '부산 연제구 연산동 연제로 2',
    lat: 35.1810,
    lng: 129.0774,
    type: 'flagship',
    typeLabel: '플래그십',
    hours: '영업시간: 10:00 ~ 23:00',
    features: ['이마트몰', '스타벅스'],
  },
  {
    id: 3,
    name: '이마트 사상점',
    address: '부산 사상구 학장동 사상로 261',
    lat: 35.1548,
    lng: 128.9952,
    type: 'regular',
    typeLabel: '일반점',
    hours: '영업시간: 10:00 ~ 22:00',
    features: ['이마트몰'],
  },
  {
    id: 4,
    name: '이마트 금정점',
    address: '부산 금정구 구서동 공단1로 7',
    lat: 35.2367,
    lng: 129.0882,
    type: 'regular',
    typeLabel: '일반점',
    hours: '영업시간: 10:00 ~ 22:00',
    features: ['이마트몰', '노브랜드'],
  },
  {
    id: 5,
    name: '이마트 서면점',
    address: '부산 부산진구 부전동 서면문화로 33',
    lat: 35.1569,
    lng: 129.0597,
    type: 'flagship',
    typeLabel: '도심형',
    hours: '영업시간: 10:00 ~ 23:00',
    features: ['이마트몰', '스타벅스', '이마트24'],
  },
  {
    id: 6,
    name: '이마트 문현점',
    address: '부산 남구 문현동 수영로 30',
    lat: 35.1364,
    lng: 129.0571,
    type: 'regular',
    typeLabel: '일반점',
    hours: '영업시간: 10:00 ~ 22:00',
    features: ['이마트몰'],
  },
  {
    id: 7,
    name: '이마트 부산점',
    address: '부산 동래구 온천동 아시아드대로 255',
    lat: 35.2012,
    lng: 129.0784,
    type: 'flagship',
    typeLabel: '프리미엄',
    hours: '영업시간: 10:00 ~ 23:00',
    features: ['트레이더스', '이마트몰', '노브랜드'],
  },
];

/* ────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHero();
  initCarousel();
  initPoster();
  initLightbox();
  initMap();
  initScrollReveal();
});

/* ===================================================
   NAVBAR
   =================================================== */
function initNavbar() {
  const nav     = document.getElementById('navbar');
  const links   = document.querySelectorAll('.nav-links a');
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks  = document.getElementById('nav-links');
  const sections  = document.querySelectorAll('section[id]');

  // Scroll — sticky + active link
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
    highlightNav(sections, links);
  }, { passive: true });

  // Hamburger
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Close menu on link click
  links.forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

function highlightNav(sections, links) {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  links.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}

/* ===================================================
   HERO CTA SCROLL
   =================================================== */
function initHero() {
  const btn = document.getElementById('hero-cta');
  if (btn) {
    btn.addEventListener('click', () => {
      document.getElementById('plan').scrollIntoView({ behavior: 'smooth' });
    });
  }
}

/* ===================================================
   CAROUSEL
   =================================================== */
let carouselIdx     = 0;
let carouselTimer   = null;
let carouselImages  = [];

function initCarousel() {
  const track  = document.getElementById('carousel-track');
  const dotsEl = document.getElementById('carousel-dots');

  carouselImages = CONFIG.images.cardnews;

  // Build slides
  carouselImages.forEach((src, i) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    const img = document.createElement('img');
    img.src = src;
    img.alt = `카드뉴스 ${i + 1}`;
    img.loading = 'lazy';
    img.addEventListener('click', () => openLightbox(src));
    slide.appendChild(img);
    track.appendChild(slide);

    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `슬라이드 ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
  });

  startAutoplay();

  // Pause on hover
  const container = document.querySelector('.carousel-container');
  container.addEventListener('mouseenter', stopAutoplay);
  container.addEventListener('mouseleave', startAutoplay);
}

function goTo(idx) {
  const track = document.getElementById('carousel-track');
  const dots  = document.querySelectorAll('.carousel-dot');
  carouselIdx = (idx + carouselImages.length) % carouselImages.length;
  track.style.transform = `translateX(-${carouselIdx * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === carouselIdx));
}

window.carouselPrev = () => goTo(carouselIdx - 1);
window.carouselNext = () => goTo(carouselIdx + 1);

function startAutoplay() {
  stopAutoplay();
  carouselTimer = setInterval(() => goTo(carouselIdx + 1), 5000);
}
function stopAutoplay() {
  clearInterval(carouselTimer);
}

/* ===================================================
   POSTER
   =================================================== */
function initPoster() {
  const wrap = document.getElementById('poster-wrap');
  const img  = document.getElementById('poster-img');
  if (!wrap || !img) return;
  img.src = CONFIG.images.poster;
  wrap.addEventListener('click', () => openLightbox(CONFIG.images.poster));
}

/* ===================================================
   LIGHTBOX
   =================================================== */
function initLightbox() {
  const lb = document.getElementById('lightbox');
  lb.addEventListener('click', e => {
    if (e.target === lb) closeLightbox();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });
}

function openLightbox(src) {
  const lb  = document.getElementById('lightbox');
  const img = document.getElementById('lb-img');
  img.src   = src;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

window.closeLightbox = closeLightbox;

/* ===================================================
   MAP (Leaflet.js)
   =================================================== */
let mapInstance = null;
let mapMarkers  = [];
let activeBranch = null;

function initMap() {
  // Custom marker icons
  function makeIcon(color, size = 38) {
    return L.divIcon({
      className: '',
      html: `
        <div style="
          width:${size}px; height:${size}px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          background: ${color};
          border: 3px solid rgba(255,255,255,0.85);
          box-shadow: 0 4px 16px rgba(0,0,0,0.5);
          display:flex; align-items:center; justify-content:center;
        ">
          <span style="
            transform:rotate(45deg);
            font-size:${size * 0.38}px;
            line-height:1;
            display:block;
            margin-top:2px;
          ">🏬</span>
        </div>`,
      iconSize:   [size, size],
      iconAnchor: [size / 2, size],
      popupAnchor:[0, -size],
    });
  }

  const flagshipIcon = makeIcon('#E31837', 40);
  const regularIcon  = makeIcon('#C8A96E', 34);

  // Init map centered on Busan
  mapInstance = L.map('emart-map', {
    center: [35.1795, 129.0756],
    zoom: 12,
    zoomControl: true,
  });

  // 다크 배경 지도 타일 (한국어 지명 표기)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '지도 데이터 © <a href="https://www.openstreetmap.org/copyright">오픈스트리트맵</a> 기여자, 지도 © <a href="https://carto.com/attributions">카르토</a>',
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(mapInstance);

  // 지점 마커 추가
  EMART_BRANCHES.forEach((branch) => {
    const icon   = branch.type === 'flagship' ? flagshipIcon : regularIcon;
    const marker = L.marker([branch.lat, branch.lng], { icon }).addTo(mapInstance);

    const featuresHtml = branch.features.map(f =>
      `<span class="popup-badge pb-gold">${f}</span>`
    ).join('');

    marker.bindPopup(`
      <div style="min-width:200px; font-family:'Noto Sans KR',sans-serif;">
        <div class="popup-name">🏬 ${branch.name}</div>
        <div class="popup-addr">📍 ${branch.address}</div>
        <div class="popup-addr">🕙 ${branch.hours}</div>
        <div class="popup-meta" style="margin-top:8px;">
          <span class="popup-badge pb-red">${branch.typeLabel}</span>
          ${featuresHtml}
        </div>
      </div>
    `, { maxWidth: 280 });

    marker.on('click', () => {
      setActiveBranch(branch.id);
    });

    mapMarkers.push({ branch, marker });
  });

  // Sidebar items
  renderBranchList();
}

function renderBranchList() {
  const list = document.getElementById('branch-list');
  list.innerHTML = '';
  EMART_BRANCHES.forEach(branch => {
    const item = document.createElement('div');
    item.className = 'branch-item';
    item.id = `branch-item-${branch.id}`;
    item.innerHTML = `
      <div class="branch-num">${branch.id}</div>
      <div class="branch-info">
        <div class="branch-name">${branch.name}</div>
        <div class="branch-addr">${branch.address}</div>
      </div>
      <span class="branch-tag ${branch.type === 'flagship' ? 'tag-flagship' : 'tag-regular'}">
        ${branch.typeLabel}
      </span>
    `;
    item.addEventListener('click', () => {
      setActiveBranch(branch.id);
      const found = mapMarkers.find(m => m.branch.id === branch.id);
      if (found) {
        mapInstance.setView([branch.lat, branch.lng], 15, { animate: true });
        found.marker.openPopup();
      }
    });
    list.appendChild(item);
  });
}

function setActiveBranch(id) {
  // Update sidebar active state
  document.querySelectorAll('.branch-item').forEach(el => el.classList.remove('active'));
  const activeEl = document.getElementById(`branch-item-${id}`);
  if (activeEl) {
    activeEl.classList.add('active');
    activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

/* ===================================================
   SCROLL-REVEAL (Intersection Observer)
   =================================================== */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => observer.observe(el));
}
