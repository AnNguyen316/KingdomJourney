const pages = Array.from(document.querySelectorAll('.page'));
const mobileMenu = document.getElementById('mobileMenu');
const navLinks = Array.from(document.querySelectorAll('nav a[href^="#"], footer a[href^="#"]'));
const revealSelectors = [
  '.section-inner',
  '.what-card',
  '.update-card',
  '.project-card',
  '.project-full-card',
  '.support-card',
  '.donate-box',
  '.story-chapter',
  '.contact-info',
  '.contact-form',
  '.newsletter-wrap',
  '.cta-band h2',
  '.cta-band p',
  '.cta-band .btn-primary'
];

function getPageFromHash() {
  const hash = window.location.hash.replace('#', '');
  return hash || 'home';
}

function setActiveNav(id) {
  navLinks.forEach(link => {
    const isActive = link.getAttribute('href') === '#' + id;
    link.classList.toggle('active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

function showPage(id, updateHash = true) {
  const target = document.getElementById('page-' + id);
  if (!target) return;

  pages.forEach(page => page.classList.remove('active'));
  target.classList.add('active');
  setActiveNav(id);

  if (mobileMenu) mobileMenu.classList.remove('open');

  if (updateHash && window.location.hash !== '#' + id) {
    history.pushState(null, '', '#' + id);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMenu() {
  if (mobileMenu) mobileMenu.classList.toggle('open');
}

function sendContactEmail() {
  const name = document.getElementById('contact-name').value;
  const email = document.getElementById('contact-email').value;
  const message = document.getElementById('contact-message').value;
  if (!name || !email || !message) {
    alert('Please fill in all fields before sending.');
    return;
  }
  const mailto = `mailto:an@agoraministries.com?subject=Message from ${encodeURIComponent(name)} via Kingdom Journey&body=${encodeURIComponent(message + '\n\nFrom: ' + name + '\nEmail: ' + email)}`;
  window.location.href = mailto;
}

function initScrollReveals() {
  const revealItems = Array.from(document.querySelectorAll(revealSelectors.join(',')));
  revealItems.forEach((item, index) => {
    item.classList.add('reveal');
    item.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 80}ms`);
  });

  if (!('IntersectionObserver' in window)) {
    revealItems.forEach(item => item.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -40px 0px' });

  revealItems.forEach(item => observer.observe(item));
}

navLinks.forEach(link => {
  link.addEventListener('click', event => {
    const id = link.getAttribute('href').replace('#', '');
    if (document.getElementById('page-' + id)) {
      event.preventDefault();
      showPage(id);
    }
  });
});

window.addEventListener('popstate', () => showPage(getPageFromHash(), false));
window.addEventListener('DOMContentLoaded', () => {
  showPage(getPageFromHash(), false);
  initScrollReveals();
});
