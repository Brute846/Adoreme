
import { CONFIG } from './config.js';

/* ====================================================================
   1. GLOBAL LINK HYDRATION (DISCORD & CONFIG)
   ==================================================================== */
function initLinks() {
  const joinTriggers = document.querySelectorAll('.join-discord-trigger');

  joinTriggers.forEach((el) => {
    el.href = CONFIG.DISCORD_INVITE_URL || 'https://discord.gg/adoreme';

    el.addEventListener('click', () => {
      if (
        el.href.includes('discord.gg/adoreme') &&
        CONFIG.DISCORD_INVITE_URL === 'https://discord.gg/adoreme'
      ) {
        console.info(
          '[Adoreme] Using default Discord invite link:',
          CONFIG.DISCORD_INVITE_URL
        );
      }
    });
  });

  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ====================================================================
   2. MOBILE DRAWER NAVIGATION
   ==================================================================== */
function initMobileNavigation() {
  const toggleBtn = document.getElementById('menuToggle');
  const drawer = document.getElementById('mobileDrawer');

  if (!toggleBtn || !drawer) return;

  const mobileLinks = drawer.querySelectorAll('a');

  function closeMenu() {
    toggleBtn.setAttribute('aria-expanded', 'false');
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
  }

  toggleBtn.addEventListener('click', () => {
    const isExpanded =
      toggleBtn.getAttribute('aria-expanded') === 'true';

    toggleBtn.setAttribute('aria-expanded', (!isExpanded).toString());
    drawer.classList.toggle('open');
    drawer.setAttribute('aria-hidden', isExpanded.toString());
  });

  mobileLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
}

/* ====================================================================
   3. POPULATE TEAM SECTION — COMPACT RECTANGULAR LAYOUT
   ==================================================================== */
function renderTeam() {
  const container = document.getElementById('teamContainer');
  if (!container) return;

  container.innerHTML = '';

  CONFIG.TEAM.forEach((member, index) => {
    const card = document.createElement('article');
    card.className = 'team-card team-card-horizontal';
    card.dataset.accent = member.accent || 'magenta';
    card.setAttribute('role', 'listitem');
    card.style.animationDelay = `${index * 60}ms`;

    // Profile picture
    const wrapper = document.createElement('div');
    wrapper.className = 'team-avatar-wrapper';

    const avatar = document.createElement('img');
    avatar.className = 'team-avatar';
    avatar.src = member.avatar;
    avatar.alt = `${member.name} icon`;
    avatar.loading = 'lazy';

    // Fallback if profile picture fails
    avatar.onerror = () => {
      avatar.onerror = null;
      avatar.src =
        'https://ui-avatars.com/api/?name=' +
        encodeURIComponent(member.name) +
        '&background=2b081c&color=ff2a85&size=200&bold=true';
    };

    wrapper.appendChild(avatar);

    // Member name
    const name = document.createElement('h3');
    name.className = 'team-name';
    name.textContent = member.name;

    // Role badge
    const role = document.createElement('span');
    role.className = 'role-badge';
    role.textContent = member.role;

    // Name and role container
    const details = document.createElement('div');
    details.className = 'team-details';
    details.append(name, role);

    // Assemble card
    card.append(wrapper, details);
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

  container.querySelectorAll('.event-action-trigger').forEach((btn) => {
    btn.addEventListener('click', () => {
      const link = btn.getAttribute('data-link');

      if (link && link.trim() !== '') {
        window.open(link, '_blank', 'noopener,noreferrer');
      } else {
        openEventModal(
          'Server Schedule Notice',
          'This event takes place directly inside our Discord server voice channels. Tap below to join our Discord!'
        );
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

  const headers = container.querySelectorAll('.accordion-header');

  headers.forEach((header) => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const content = item.querySelector('.accordion-content');
      const isExpanded =
        header.getAttribute('aria-expanded') === 'true';

      // Close other items
      container.querySelectorAll('.accordion-item').forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem
            .querySelector('.accordion-header')
            .setAttribute('aria-expanded', 'false');

          otherItem.querySelector(
            '.accordion-content'
          ).style.maxHeight = null;
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
  if (!modal) return;

  if (title && modalTitle) modalTitle.textContent = title;
  if (message && modalBody) modalBody.textContent = message;

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
}

function closeEventModal() {
  if (!modal) return;

  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
}

function initEventModal() {
  const liveEventBtn = document.getElementById('viewEventBtn');

  if (liveEventBtn) {
    liveEventBtn.addEventListener('click', () => {
      if (CONFIG.EVENT_URL && CONFIG.EVENT_URL.trim() !== '') {
        window.open(
          CONFIG.EVENT_URL,
          '_blank',
          'noopener,noreferrer'
        );
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
    if (
      e.key === 'Escape' &&
      modal &&
      modal.classList.contains('active')
    ) {
      closeEventModal();
    }
  });
}

/* ====================================================================
   7. AMBIENT PARTICLES & ROSE PETALS CANVAS
   ==================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  if (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return;
  }

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

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
      this.size = Math.random() * 8 + 4;
      this.speedY = Math.random() * 0.7 + 0.3;
      this.speedX = Math.random() * 0.6 - 0.3;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.02;
      this.opacity = Math.random() * 0.5 + 0.2;
      this.isPetal = Math.random() > 0.4;
    }

    update() {
      this.y += this.speedY;
      this.x += Math.sin(this.y * 0.01) * 0.4 + this.speedX;
      this.rotation += this.rotationSpeed;

      if (
        this.y > height + 20 ||
        this.x < -20 ||
        this.x > width + 20
      ) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;

      if (this.isPetal) {
        ctx.fillStyle = '#ff2a85';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(
          this.size,
          -this.size / 2,
          this.size * 1.2,
          this.size,
          0,
          this.size * 1.4
        );
        ctx.bezierCurveTo(
          -this.size * 1.2,
          this.size,
          -this.size,
          -this.size / 2,
          0,
          0
        );
        ctx.fill();
      } else {
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

    elements.forEach((element) => {
      element.update();
      element.draw();
    });

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
