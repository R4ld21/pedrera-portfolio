// ---------- Footer year ----------
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- Typing effect ----------
const roles = ['Web Developer', 'Student', 'Creative Thinker', 'Problem Solver'];
const typingEl = document.getElementById('typing');
let roleIndex = 0, charIndex = 0, deleting = false;

function type() {
    const word = roles[roleIndex];
    typingEl.textContent = word.substring(0, charIndex);
    if (!deleting && charIndex < word.length) {
        charIndex++; setTimeout(type, 90);
    } else if (!deleting) {
        deleting = true; setTimeout(type, 1400);
    } else if (charIndex > 0) {
        charIndex--; setTimeout(type, 45);
    } else {
        deleting = false; roleIndex = (roleIndex + 1) % roles.length; setTimeout(type, 300);
    }
}
type();

// ---------- Mobile menu ----------
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
function closeMenu() {
    menuBtn.classList.remove('open');
    navLinks.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
}
menuBtn.addEventListener('click', () => {
    const open = menuBtn.classList.toggle('open');
    navLinks.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

// ---------- Scroll: progress bar, navbar shrink, back-to-top ----------
const progress = document.getElementById('progress');
const navbar = document.getElementById('navbar');
const toTop = document.getElementById('toTop');

window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (window.scrollY / max) * 100 + '%';
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    toTop.classList.toggle('show', window.scrollY > 500);
}, { passive: true });
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ---------- Active nav link (scroll spy) ----------
const links = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('main section');
const spy = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id));
        }
    });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => spy.observe(s));

// ---------- Reveal on scroll + animated counters and skill bars ----------
function animateCount(el) {
    const target = +el.dataset.count, suffix = el.dataset.suffix || '';
    const start = performance.now(), duration = 1400;
    (function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        el.textContent = Math.round(target * p) + suffix;
        if (p < 1) requestAnimationFrame(tick);
    })(start);
}

const revealer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add('visible');
        el.querySelectorAll('.fill').forEach(f => f.style.width = f.dataset.width + '%');
        el.querySelectorAll('[data-count]').forEach(animateCount);
        revealer.unobserve(el);
    });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => revealer.observe(el));

// ---------- Project filters ----------
const filterBtns = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('.project-card');
filterBtns.forEach(btn => btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    cards.forEach(c => c.classList.toggle('hide', f !== 'all' && c.dataset.status !== f));
}));

// ---------- Card tilt on mouse move (desktop only) ----------
if (window.matchMedia('(hover: hover)').matches) {
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            card.style.transform = `translateY(-10px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
        });
        card.addEventListener('mouseleave', () => card.style.transform = '');
    });
}

// ---------- Project modal ----------
const projectInfo = {
    nasa: {
        title: 'NASA Information Website',
        img: 'images/apollo.jpg', alt: 'Apollo spacecraft orbiting Earth at night',
        text: "A multi-section page that presents NASA science highlights and historic achievements, with a space-themed background.",
        points: ['Sticky navigation with smooth scroll', 'Sections for science, achievements and programs', 'Built with plain HTML and CSS'],
        link: 'nasa-project/index.html'
    },
    portal: {
        title: 'Student Portal Website',
        img: '', alt: '',
        text: 'A multi-page student portal made to practice HTML structure, forms, tables and CSS layout.',
        points: ['Home, Registration, Grades and Profile pages', 'Registration form with inputs, radio buttons, dropdown and checkboxes', 'Grade report table with colored rows', 'One shared stylesheet for every page'],
        link: 'student-portal/peds.html'
    }
};

const modal = document.getElementById('modal');
function openModal(key) {
    const p = projectInfo[key];
    if (!p) return;
    document.getElementById('modalTitle').textContent = p.title;
    document.getElementById('modalText').textContent = p.text;
    const img = document.getElementById('modalImg');
    img.src = p.img; img.alt = p.alt;
    const list = document.getElementById('modalList');
    list.innerHTML = '';
    p.points.forEach(t => { const li = document.createElement('li'); li.textContent = t; list.appendChild(li); });
    document.getElementById('modalLink').href = p.link;
    modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false');
}
function closeModal() { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); }
document.querySelectorAll('[data-modal]').forEach(b => b.addEventListener('click', () => openModal(b.dataset.modal)));
document.getElementById('modalClose').addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ---------- Copy email ----------
const toast = document.getElementById('toast');
document.getElementById('copyEmail').addEventListener('click', async e => {
    const email = e.currentTarget.dataset.email;
    try { await navigator.clipboard.writeText(email); toast.textContent = 'Email copied!'; }
    catch (err) { toast.textContent = email; }
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2200);
});
