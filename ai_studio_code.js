import { CONFIG } from './config.js';

/* ====================================================================
   1. GLOBAL LINK HYDRATION (DISCORD & CONFIG)
   ==================================================================== */
function initLinks() {
  const joinTriggers = document.querySelectorAll('.join-discord-trigger');
  joinTriggers.forEach((el) => {
    el.href = CONFIG.DISCORD_INVITE_URL || 'https://discord.gg/adoreme';
    // Fallback protection: inform if clicked with placeholder
    el.addEventListener('click', (e) => {
      if (el.href.includes('discord.gg/adoreme') && CONFIG.DISCORD_INVITE_URL === "https://discord.gg/adoreme") {
        console.info('[Adoreme] Using default Discord invite link:', CONFIG.DISCORD_INVITE_URL);
      }
    });
  });

  // Footer year dynamic injection
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ====================================================================
   2. MOBILE DRAWER NAVIGATION
   ==================================================================== */
function initMobileNavigation() {
  const toggleBtn = document.getElementById('menuToggle');
  const drawer = document.getElementById('mobileDrawer');
  const mobileLinks = drawer.querySelectorAll('a');

  if (!toggleBtn || !drawer) return;

  function closeMenu() {
    toggleBtn.setAttribute('aria-expanded', 'false');
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
  }

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', (!isExpanded).toString());
    drawer.classList.toggle('open');
    drawer.setAttribute('aria-hidden', isExpanded.toString());
  });

  mobileLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
}

/* ====================================================================
   3. POPULATE TEAM SECTION (With Role Accents & Smooth Fallbacks)
   ==================================================================== */
function renderTeam() {
  const container = document.getElementById('teamContainer');
  if (!container) return;

  container.innerHTML = '';

  CONFIG.TEAM.forEach((member, index) => {
    const card = document.createElement('article');
    card.className = 'team-card';
    card.setAttribute('data-accent', member.accent || 'magenta');
    card.setAttribute('role', 'listitem');
    card.style.animationDelay = `${index * 80}ms`;

    card.innerHTML = `
      <div class="team-avatar-wrapper">
        <img 
          src="${member.avatar}" 
          alt="${member.name} Profile Picture" 
          class="team-avatar"
          loading="lazy"
          onerror="this.onerror=null;this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(
            member.name
          )}&background=2b081c&color=ff2a85&size=200&bold=true';"
        />
      </div>
      <h3 class="team-name">${member.name}</h3>
      <span class="role-badge">${member.role}</span>
      <p class="team-bio">${member.bio || 'Adoreme Community Leader'}</p>
    `;

    container.appendChild(card);
  });
}

/* ====================================================================
   4. POPULATE COMMUNITY EVENTS
   ==================================================================== */
function renderEvents() {
  const container = document.getElementById('eventsContainer');
  if (!container) return;

  container.innerHTML = '';

  CONFIG.EVENTS.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'event-card';

    card.innerHTML = `
      <div class="event-header">
        <span class="event-time">${item.schedule}</span>
        ${item.isLive ? '<span class="pulse-indicator" title="Live Now"></span>' : ''}
      </div>
      <h3 class="event-title">${item.title}</h3>
      <p class="event-desc">${item.description}</p>
      <button class="event-btn event-action-trigger" data-link="${item.link}">
        <span>View Details</span> &rarr;
      </button>
    `;

    container.appendChild(card);
  });

  // Event trigger listener
  container.querySelectorAll('.event-action-trigger').forEach((btn) => {
    btn.addEventListener('click', () => {
      const link = btn.getAttribute('data-link');
      if (link && link.trim() !== '') {
        window.open(link, '_blank', 'noopener,noreferrer');
      } else {
        openEventModal('Server Schedule Notice', 'This event takes place directly inside our Discord server voice channels. Tap below to join our Discord!');
      }
    });
  });
}

/* ====================================================================
   5. POPULATE FAQ ACCORDION
   ==================================================================== */
function renderFAQ() {
  const container = document.getElementById('faqAccordion');
  if (!container) return;

  container.innerHTML = '';

  CONFIG.FAQS.forEach((faq, index) => {
    const item = document.createElement('div');
    item.className = 'accordion-item';

    item.innerHTML = `
      <button class="accordion-header" id="faq-header-${index}" aria-expanded="false" aria-controls="faq-body-${index}">
        <span>${faq.question}</span>
        <span class="accordion-chevron">⌄</span>
      </button>
      <div class="accordion-content" id="faq-body-${index}" role="region" aria-labelledby="faq-header-${index}">
        <p>${faq.answer}</p>
      </div>
    `;

    container.appendChild(item);
  });

  // Accordion Expand/Collapse Behavior
  const headers = container.querySelectorAll('.accordion-header');
  headers.forEach((header) => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const content = item.querySelector('.accordion-content');
      const isExpanded = header.getAttribute('aria-expanded') === 'true';

      // Close all other items
      container.querySelectorAll('.accordion-item').forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
          otherItem.querySelector('.accordion-content').style.maxHeight = null;
        }
      });

      if (!isExpanded) {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        item.classList.remove('active');
        header.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = null;
      }
    });
  });
}

/* ====================================================================
   6. EVENT LIVE MODAL CONTROLLER
   ==================================================================== */
const modal = document.getElementById('eventModal');
const modalClose = document.getElementById('closeModalBtn');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');

function openEventModal(title, message) {
  if (title) modalTitle.textContent = title;
  if (message) modalBody.textContent = message;
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
}

function closeEventModal() {
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
}

function initEventModal() {
  const liveEventBtn = document.getElementById('viewEventBtn');
  if (liveEventBtn) {
    liveEventBtn.addEventListener('click', () => {
      if (CONFIG.EVENT_URL && CONFIG.EVENT_URL.trim() !== '') {
        window.open(CONFIG.EVENT_URL, '_blank', 'noopener,noreferrer');
      } else {
        openEventModal(
          'No Live Event In Progress',
          'We do not currently have a live stage running. Head into the server lounge to chat with members and catch the next scheduled voice night!'
        );
      }
    });
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeEventModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeEventModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeEventModal();
    }
  });
}

/* ====================================================================
   7. AMBIENT PARTICLES & ROSE PETALS CANVAS (Mobile Optimized)
   ==================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Check user preference for reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Mobile device optimization: fewer particles on narrow screens
  const isMobile = width < 768;
  const particleCount = isMobile ? 18 : 35;
  const elements = [];

  class FloatingParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -20;
      this.size = Math.random() * 8 + 4; // Petal/mote size
      this.speedY = Math.random() * 0.7 + 0.3;
      this.speedX = Math.random() * 0.6 - 0.3;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.02;
      this.opacity = Math.random() * 0.5 + 0.2;
      this.isPetal = Math.random() > 0.4; // 60% rose petals, 40% neon motes
    }

    update() {
      this.y += this.speedY;
      this.x += Math.sin(this.y * 0.01) * 0.4 + this.speedX;
      this.rotation += this.rotationSpeed;

      if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;

      if (this.isPetal) {
        // Draw soft romantic rose petal curve
        ctx.fillStyle = '#ff2a85';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(this.size, -this.size / 2, this.size * 1.2, this.size, 0, this.size * 1.4);
        ctx.bezierCurveTo(-this.size * 1.2, this.size, -this.size, -this.size / 2, 0, 0);
        ctx.fill();
      } else {
        // Glowing magenta ambient mote
        ctx.fillStyle = '#ff66b2';
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    elements.push(new FloatingParticle());
  }

  function renderLoop() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < elements.length; i++) {
      elements[i].update();
      elements[i].draw();
    }
    requestAnimationFrame(renderLoop);
  }

  requestAnimationFrame(renderLoop);
}

/* ====================================================================
   INITIALIZE ON DOM CONTENT LOADED
   ==================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initLinks();
  initMobileNavigation();
  renderTeam();
  renderEvents();
  renderFAQ();
  initEventModal();
  initAmbientCanvas();
});