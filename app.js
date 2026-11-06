import { CONFIG } from './config.js';

/* ====================================================================
   1. GLOBAL LINKS
==================================================================== */
function initLinks() {
  const invite = CONFIG.DISCORD_INVITE_URL || 'https://discord.gg/adoreme';

  document.querySelectorAll('.join-discord-trigger').forEach((el) => {
    el.href = invite;
  });

  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ====================================================================
   2. MOBILE NAVIGATION
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
    const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', String(!expanded));
    drawer.classList.toggle('open', !expanded);
    drawer.setAttribute('aria-hidden', String(expanded));
  });

  mobileLinks.forEach((link) => link.addEventListener('click', closeMenu));

  document.addEventListener('click', (event) => {
    if (!drawer.contains(event.target) && !toggleBtn.contains(event.target)) {
      closeMenu();
    }
  });
}

/* ====================================================================
   3. TEAM RENDERING
==================================================================== */
function renderTeam() {
  const container = document.getElementById('teamContainer');
  if (!container) return;

  container.innerHTML = '';

  (CONFIG.TEAM || []).forEach((member, index) => {
    const card = document.createElement('article');
    card.className = 'team-card';
    card.dataset.accent = member.accent || 'magenta';
    card.setAttribute('role', 'listitem');
    card.style.animationDelay = `${index * 60}ms`;

    const wrapper = document.createElement('div');
    wrapper.className = 'team-avatar-wrapper';

    const avatar = document.createElement('img');
    avatar.className = 'team-avatar';
    avatar.src = member.avatar || '';
    avatar.alt = `${member.name} icon`;
    avatar.loading = 'lazy';
    avatar.onerror = () => {
      avatar.onerror = null;
      avatar.src = 'https://ui-avatars.com/api/?name=' +
        encodeURIComponent(member.name || 'Adoreme') +
        '&background=2b081c&color=ff2a85&size=200&bold=true';
    };

    wrapper.appendChild(avatar);

    const details = document.createElement('div');
    details.className = 'team-details';

    const name = document.createElement('h3');
    name.className = 'team-name';
    name.textContent = member.name || '';

    const role = document.createElement('span');
    role.className = 'role-badge';
    role.textContent = member.role || '';

    details.append(name, role);
    card.append(wrapper, details);
    container.appendChild(card);
  });
}

/* ====================================================================
   4. EVENTS
==================================================================== */
function renderEvents() {
  const container = document.getElementById('eventsContainer');
  if (!container) return;

  container.innerHTML = '';

  (CONFIG.EVENTS || []).forEach((item) => {
    const card = document.createElement('article');
    card.className = 'event-card';

    const header = document.createElement('div');
    header.className = 'event-header';

    const time = document.createElement('span');
    time.className = 'event-time';
    time.textContent = item.schedule || '';

    header.appendChild(time);

    if (item.isLive) {
      const live = document.createElement('span');
      live.className = 'pulse-indicator';
      live.title = 'Live Now';
      header.appendChild(live);
    }

    const title = document.createElement('h3');
    title.className = 'event-title';
    title.textContent = item.title || '';

    const description = document.createElement('p');
    description.className = 'event-desc';
    description.textContent = item.description || '';

    const button = document.createElement('button');
    button.className = 'event-btn';
    button.type = 'button';
    button.textContent = 'View Details →';

    button.addEventListener('click', () => {
      if (item.link && item.link.trim()) {
        window.open(item.link, '_blank', 'noopener,noreferrer');
      } else {
        openEventModal(
          'Server Schedule Notice',
          'This event takes place directly inside our Discord server voice channels. Tap below to join our Discord!'
        );
      }
    });

    card.append(header, title, description, button);
    container.appendChild(card);
  });
}

/* ====================================================================
   5. FAQ
==================================================================== */
function renderFAQ() {
  const container = document.getElementById('faqAccordion');
  if (!container) return;

  container.innerHTML = '';

  (CONFIG.FAQS || []).forEach((faq, index) => {
    const item = document.createElement('div');
    item.className = 'accordion-item';

    const header = document.createElement('button');
    header.className = 'accordion-header';
    header.type = 'button';
    header.id = `faq-header-${index}`;
    header.setAttribute('aria-expanded', 'false');
    header.textContent = faq.question || '';

    const chevron = document.createElement('span');
    chevron.className = 'accordion-chevron';
    chevron.textContent = '⌄';
    header.appendChild(chevron);

    const content = document.createElement('div');
    content.className = 'accordion-content';
    content.id = `faq-body-${index}`;
    content.setAttribute('role', 'region');

    const answer = document.createElement('p');
    answer.textContent = faq.answer || '';
    content.appendChild(answer);

    header.addEventListener('click', () => {
      const isOpen = header.getAttribute('aria-expanded') === 'true';

      container.querySelectorAll('.accordion-item').forEach((other) => {
        other.classList.remove('active');
        other.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
        other.querySelector('.accordion-content').style.maxHeight = '';
      });

      if (!isOpen) {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = `${content.scrollHeight}px`;
      }
    });

    item.append(header, content);
    container.appendChild(item);
  });
}

/* ====================================================================
   6. EVENT MODAL
==================================================================== */
const modal = document.getElementById('eventModal');
const modalClose = document.getElementById('closeModalBtn');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');

function openEventModal(title, message) {
  if (!modal) return;
  if (modalTitle && title) modalTitle.textContent = title;
  if (modalBody && message) modalBody.textContent = message;
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  if (modalClose) modalClose.focus();
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
      if (CONFIG.EVENT_URL && CONFIG.EVENT_URL.trim()) {
        window.open(CONFIG.EVENT_URL, '_blank', 'noopener,noreferrer');
      } else {
        openEventModal(
          'No Live Event Scheduled',
          'There is no live stream or voice stage happening at this exact moment. Join our Discord community to get notified when the next event begins!'
        );
      }
    });
  }

  if (modalClose) modalClose.addEventListener('click', closeEventModal);

  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeEventModal();
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal?.classList.contains('active')) {
      closeEventModal();
    }
  });
}

/* ====================================================================
   7. AMBIENT PARTICLES
==================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let width = 0;
  let height = 0;
  let animationId;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  const count = width < 768 ? 12 : 25;
  const particles = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 5 + 2,
    speed: Math.random() * 0.45 + 0.2,
    drift: Math.random() * 0.5 - 0.25,
    opacity: Math.random() * 0.35 + 0.15,
    heart: Math.random() > 0.72
  }));

  function draw() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      p.y += p.speed;
      p.x += p.drift + Math.sin(p.y * 0.01) * 0.25;

      if (p.y > height + 15) {
        p.y = -15;
        p.x = Math.random() * width;
      }
      if (p.x < -15) p.x = width + 15;
      if (p.x > width + 15) p.x = -15;

      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = '#ff2a85';

      if (p.heart) {
        ctx.translate(p.x, p.y);
        ctx.scale(p.size / 8, p.size / 8);
        ctx.beginPath();
        ctx.moveTo(0, 3);
        ctx.bezierCurveTo(-8, -3, -5, -8, 0, -3);
        ctx.bezierCurveTo(5, -8, 8, -3, 0, 3);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.35, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    animationId = requestAnimationFrame(draw);
  }

  draw();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animationId);
    else draw();
  });
}

/* ====================================================================
   INITIALIZE
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
