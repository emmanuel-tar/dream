/* ─── PRODUCTION BOOTSTRAP ─── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) loader.classList.add('hidden');
  initializeSlider();
});

/* ─── GLOBAL SCROLL HANDLER (Optimized) ─── */
let scrollTicking = false;
const progressBar = document.getElementById('progress-bar');
const backTop = document.getElementById('back-top');
const navbar = document.getElementById('navbar');
const heroGlow = document.querySelector('.hero-glow');

function handleScroll() {
  const st = window.pageYOffset || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;

  // Progress Bar
  if (progressBar) progressBar.style.width = `${(st / height) * 100}%`;
  // UI States
  if (backTop) backTop.classList.toggle('visible', st > 400);
  if (navbar) navbar.classList.toggle('scrolled', st > 20);
  // Parallax Hero
  if (heroGlow) heroGlow.style.transform = `translate(-50%, calc(-50% + ${st * 0.15}px))`;

  scrollTicking = false;
}

window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    window.requestAnimationFrame(handleScroll);
    scrollTicking = true;
  }
});

/* ─── UI COMPONENTS ─── */
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    themeToggle.textContent = isDark ? '🌙' : '☀️';
  });
}

const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
}
function closeMob() {
  if (hamburger) hamburger.classList.remove('open');
  if (mobileMenu) mobileMenu.classList.remove('open');
}
window.closeMob = closeMob; // Make globally accessible for inline onclick

/* ─── UNIFIED INTERSECTION OBSERVER ─── */
const sections = document.querySelectorAll('section[id], div[id="trust"]');
const navLinks = document.querySelectorAll('.nav-links a');

const sharedObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    // Reveal logic
    if (entry.isIntersecting && entry.target.classList.contains('reveal')) {
      entry.target.classList.add('visible');
    }
    // Scroll Spy logic
    if (entry.isIntersecting) {
      navLinks.forEach(a => {
        if (entry.target.id) a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
      });
    }
    // Counter logic
    if (entry.isIntersecting && entry.target.dataset.count) {
      animateCounter(entry.target, parseInt(entry.target.dataset.count));
      sharedObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.reveal, [data-count], section[id], div[id="trust"]').forEach(el => sharedObserver.observe(el));

/* ─── COUNTER ANIMATION ─── */
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = progress < .5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
    el.textContent = Math.floor(eased * target) + (el.dataset.suffix || '');
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target + (el.dataset.suffix || '');
  };
  requestAnimationFrame(step);
}

/* ─── TESTIMONIALS SLIDER ─── */
const track = document.getElementById('testiTrack');
const dotsContainer = document.getElementById('testiDots');
let current = 0;
let cards = []; // Initialize cards as an empty array
let autoSlideInterval;

function initializeSlider() {
  if (!track || !dotsContainer) return;
  cards = Array.from(track.querySelectorAll('.testi-card')); // Re-query cards if DOM changes
  if (cards.length === 0) return;

  dotsContainer.innerHTML = ''; // Clear existing dots
  cards.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'testi-dot' + (i === 0 ? ' active' : '');
    d.onclick = () => goTo(i);
    dotsContainer.appendChild(d);
  });
  goTo(0); // Initialize to the first slide
  startAutoSlide();
}

const perView = () => window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3;

function goTo(idx) {
  if (cards.length === 0) return;
  const pv = perView();
  const max = cards.length - pv;
  current = Math.max(0, Math.min(idx, max));
  const cardWidth = cards[0] ? cards[0].offsetWidth : 0;
  const gap = 24; // Assuming 1.5rem gap from CSS (1.5 * 16px = 24px)
  if (track) track.style.transform = `translateX(-${current * (cardWidth + gap)}px)`;
  
  const dots = dotsContainer ? dotsContainer.querySelectorAll('.testi-dot') : [];
  dots.forEach((d, i) => d.classList.toggle('active', i === current));
}

const testiPrevBtn = document.getElementById('testiPrev');
const testiNextBtn = document.getElementById('testiNext');
if (testiPrevBtn) testiPrevBtn.onclick = () => goTo(current - 1);
if (testiNextBtn) testiNextBtn.onclick = () => goTo(current + 1);

function startAutoSlide() {
  clearInterval(autoSlideInterval); // Clear any existing interval
  autoSlideInterval = setInterval(() => {
    const next = current + 1 > cards.length - perView() ? 0 : current + 1;
    goTo(next);
  }, 5000);
}

if (track) {
  track.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
  track.addEventListener('mouseleave', () => startAutoSlide());
}
window.addEventListener('resize', () => goTo(0));
window.addEventListener('load', initializeSlider); // Initialize slider after page load

/* ─── FAQ ACCORDION ─── */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

/* ─── FORM VALIDATION (Contact Form) ─── */
function validateContactForm(id, errId, check) {
  const el = document.getElementById(id);
  const err = document.getElementById(errId);
  const ok = check(el.value.trim());
  if (el) el.classList.toggle('error', !ok);
  if (err) err.classList.toggle('show', !ok);
  return ok;
}

function handleSubmit() {
  const v1 = validateContactForm('fname', 'err-fname', v => v.length > 0);
  const v2 = validateContactForm('email', 'err-email', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
  const v3 = validateContactForm('service', 'err-service', v => v !== '');
  const v4 = validateContactForm('message', 'err-message', v => v.length > 5);
  if (!v1 || !v2 || !v3 || !v4) return;

  const btn = document.getElementById('submitBtn');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Sending...';
  }

  const fname = document.getElementById('fname') ? document.getElementById('fname').value.trim() : '';
  const lname = document.getElementById('lname') ? document.getElementById('lname').value.trim() : '';
  const email = document.getElementById('email') ? document.getElementById('email').value.trim() : '';
  const phone = document.getElementById('phone') ? document.getElementById('phone').value.trim() : '';
  const company = document.getElementById('company') ? document.getElementById('company').value.trim() : '';
  const service = document.getElementById('service') ? document.getElementById('service').value : '';
  const message = document.getElementById('message') ? document.getElementById('message').value.trim() : '';

  // EmailJS integration for contact form
  if (EMAILJS_CONFIGURED && typeof emailjs !== 'undefined') {
    const templateParams = {
      from_name: fname + ' ' + lname,
      from_email: email,
      from_phone: phone,
      from_company: company,
      service_requested: service,
      message: message,
      to_email: 'emmanuel.tar@outlook.com'
    };

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_CONTACT, templateParams)
      .then((response) => {
        console.log('Contact form email sent successfully!', response.status, response.text);
        const formBody = document.getElementById('formBody');
        const successMsg = document.getElementById('successMsg');
        if (formBody) formBody.style.display = 'none';
        if (successMsg) successMsg.style.display = 'block';
      })
      .catch((error) => {
        console.error('Contact form email failed to send:', error);
        alert('Failed to send message. Please try again or contact us directly.');
        if (btn) {
          btn.disabled = false;
          btn.textContent = 'Send Message →';
        }
      });
  } else {
    // Fallback to mailto if EmailJS is not configured for the contact form
    const subject = encodeURIComponent('T Square Hub Enquiry: ' + service);
    const body = encodeURIComponent(`Name: ${fname} ${lname}\nEmail: ${email}\nPhone: ${phone}\nCompany: ${company}\nService: ${service}\n\nMessage:\n${message}`);
    window.location.href = `mailto:emmanuel.tar@outlook.com?subject=${subject}&body=${body}`;
    const formBody = document.getElementById('formBody');
    const successMsg = document.getElementById('successMsg');
    if (formBody) formBody.style.display = 'none';
    if (successMsg) successMsg.style.display = 'block';
  }
}
window.handleSubmit = handleSubmit; // Make globally accessible for inline onclick

/* ── REAL-TIME VALIDATION (Contact Form) ─── */
['fname', 'email', 'service', 'message'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', () => el.classList.remove('error'));
});

/* ── WHATSAPP WIDGET ─── */
function toggleWA() {
  const waPopup = document.getElementById('waPopup');
  if (waPopup) waPopup.classList.toggle('open');
}
window.toggleWA = toggleWA; // Make globally accessible for inline onclick

document.addEventListener('click', e => {
  const widget = document.querySelector('.wa-widget');
  const waPopup = document.getElementById('waPopup');
  if (widget && waPopup && !widget.contains(e.target)) {
    waPopup.classList.remove('open');
  }
});

/* ── COOKIE BANNER ─── */
if (!localStorage.getItem('ds_cookie')) {
  setTimeout(() => {
    const cookieBanner = document.getElementById('cookie');
    if (cookieBanner) cookieBanner.classList.add('show');
  }, 2500);
}
function acceptCookie() {
  localStorage.setItem('ds_cookie', '1');
  const cookieBanner = document.getElementById('cookie');
  if (cookieBanner) cookieBanner.classList.remove('show');
}
window.acceptCookie = acceptCookie; // Make globally accessible for inline onclick

/* ══════════════════════════════════════
   ⚙️  EMAILJS CONFIGURATION
   Replace these 4 values after setting
   up your EmailJS account (see guide)
══════════════════════════════════════ */
const EMAILJS_PUBLIC_KEY = 'ynAKx0CuhnGcuNjz-';        // From EmailJS → Account → API Keys
const EMAILJS_SERVICE_ID = 'service_default';         // Updated placeholder
const EMAILJS_TEMPLATE_COMPANY = 'ds_company_alert';    // Template for T Square Hub notification
const EMAILJS_TEMPLATE_CUSTOMER = 'ds_customer_confirm'; // Template for customer confirmation
const EMAILJS_TEMPLATE_CONTACT = 'contact_form_template'; // Added for contact form consistency

const EMAILJS_CONFIGURED = (EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY' && EMAILJS_SERVICE_ID !== 'YOUR_SERVICE_ID');

// Initialize EmailJS
function initializeEmailJS() {
  // Ensure DOM is loaded before trying to access elements
  document.addEventListener('DOMContentLoaded', () => {
    if (EMAILJS_CONFIGURED && typeof emailjs !== 'undefined') {
      emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    } else if (!EMAILJS_CONFIGURED) {
      const setupNotice = document.getElementById('setup-notice');
      if (setupNotice) setupNotice.style.display = 'flex'; // Show setup notice if not configured
    }
  });
}
initializeEmailJS(); // Call it to set up the DOMContentLoaded listener

/* ══════════════════════════════════════
   BOOKING STATE & LOCAL STORAGE
══════════════════════════════════════ */
const state = {
  step: 1, service: null, servicePrice: 0,
  priority: 'Normal', priorityMult: 1,
  date: null, dateLabel: null, time: null,
  duration: '1 hour', durationMult: 1,
  fname: '', lname: '', email: '', phone: '',
  photos: [],
  company: '', location: '', desc: '', source: '', contactPref: 'Phone Call'
};
loadState();

let saveTimeout;
function saveState() {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    const { date, photos, ...toSave } = state;
    const serializableState = {
      ...toSave,
      date: state.date ? state.date.toISOString() : null // Convert Date to ISO string
    };
    localStorage.setItem('ds_booking_progress', JSON.stringify(serializableState));
  }, 500);
}

function loadState() {
  const saved = localStorage.getItem('ds_booking_progress');
  if (saved) {
    const parsed = JSON.parse(saved);
    // Convert ISO string back to Date object
    if (parsed.date) {
      parsed.date = new Date(parsed.date);
    }
    // Only restore if we are not on the final step
    if (parsed.step < 5) Object.assign(state, parsed);
  }
}

/* ══════════════════════════════════════
   STEP 1 — SERVICE & PRIORITY
══════════════════════════════════════ */
function selectService(el) {
  document.querySelectorAll('.service-option').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  state.service = el.dataset.svc;
  state.servicePrice = parseInt(el.dataset.price) || 0;
  const next1Btn = document.getElementById('next1');
  if (next1Btn) next1Btn.disabled = false;
  updateSummary();
  saveState();
}

function selectPriority(el, name) {
  document.querySelectorAll('.priority-opt').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  state.priority = name;
  state.priorityMult = name === 'Urgent' ? 1.25 : name === 'Emergency' ? 1.5 : 1;
  saveState();
}

/* ══════════════════════════════════════
   STEP 2 — CALENDAR
══════════════════════════════════════ */
let calYear, calMonth;
function initCal() {
  const now = new Date();
  calYear = now.getFullYear();
  calMonth = now.getMonth();
  renderCal();
}

function renderCal() {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const calMonthEl = document.getElementById('calMonth');
  if (calMonthEl) calMonthEl.textContent = months[calMonth] + ' ' + calYear;
  const grid = document.getElementById('calGrid');
  if (!grid) return;
  grid.innerHTML = '';
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const first = new Date(calYear, calMonth, 1);
  const last = new Date(calYear, calMonth + 1, 0);
  const startDay = first.getDay();
  for (let i = 0; i < startDay; i++) { const e = document.createElement('div'); e.className = 'cal-day empty'; grid.appendChild(e); }
  for (let d = 1; d <= last.getDate(); d++) {
    const dt = new Date(calYear, calMonth, d);
    const el = document.createElement('div');
    el.className = 'cal-day';
    el.textContent = d;
    if (dt.toDateString() === today.toDateString()) el.classList.add('today');
    // Disable past dates and Sundays
    if (dt <= today || dt.getDay() === 0) {
      el.classList.add('disabled');
    } else {
      el.classList.add('has-slots'); // Assuming all future weekdays have slots for simplicity
      el.addEventListener('click', () => selectDay(el, d, dt));
    }
    grid.appendChild(el);
  }
}

function prevMonth() {
  calMonth--;
  if (calMonth < 0) { calMonth = 11; calYear--; }
  renderCal();
  clearTimeSelection();
}
function nextMonth() {
  calMonth++;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  renderCal();
  clearTimeSelection();
}

function selectDay(el, d, dt) {
  document.querySelectorAll('.cal-day.selected').forEach(e => e.classList.remove('selected'));
  el.classList.add('selected');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  state.date = dt;
  state.dateLabel = days[dt.getDay()] + ', ' + d + ' ' + months[calMonth] + ' ' + calYear;
  renderTimeSlots(dt.getDay());
  updateSummary();
  saveState(); // Save state after date selection
}

function renderSlots(cId, slots, taken) {
  const c = document.getElementById(cId);
  if (!c) return;
  c.innerHTML = '';
  slots.forEach(s => {
    const el = document.createElement('div');
    el.className = 'time-slot' + (taken.includes(s) ? ' taken' : '');
    el.textContent = s;
    if (!taken.includes(s)) el.addEventListener('click', () => {
      document.querySelectorAll('.time-slot.selected').forEach(e => e.classList.remove('selected'));
      el.classList.add('selected');
      state.time = s;
      const next2Btn = document.getElementById('next2');
      if (next2Btn) next2Btn.disabled = false;
      updateSummary();
      saveState();
    });
    c.appendChild(el);
  });
}

function renderTimeSlots(dow) {
  const timeSection = document.getElementById('timeSection');
  if (timeSection) timeSection.style.display = 'block';

  const isSat = dow === 6; // Saturday
  const morningSlots = ['8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'];
  const afternoonSlots = ['12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM'];

  // Mock taken slots (can be dynamic based on actual bookings)
  const takenSlots = isSat ? ['9:00 AM', '10:30 AM', '2:00 PM'] : ['9:30 AM', '11:00 AM', '1:00 PM', '3:00 PM'];

  renderSlots('slotsMorning', morningSlots, takenSlots);
  renderSlots('slotsAfternoon', isSat ? afternoonSlots.slice(0, 5) : afternoonSlots, takenSlots);
  renderDurations(); // Ensure durations are rendered
  state.time = null; // Reset time selection
  const next2Btn = document.getElementById('next2');
  if (next2Btn) next2Btn.disabled = true;
}

function renderDurations() {
  const durations = [
    { l: '30 min', m: 0.7 },
    { l: '1 hour', m: 1 },
    { l: '2 hours', m: 1.8 },
    { l: 'Half day', m: 3.5 },
    { l: 'Full day', m: 6 }
  ];
  const durationRow = document.getElementById('durationRow');
  if (!durationRow) return;
  durationRow.innerHTML = '';

  durations.forEach((d) => {
    const el = document.createElement('div');
    el.className = 'dur-opt' + (d.l === state.duration ? ' selected' : '');
    el.textContent = d.l;
    el.addEventListener('click', () => {
      document.querySelectorAll('.dur-opt').forEach(e => e.classList.remove('selected'));
      el.classList.add('selected');
      state.duration = d.l;
      state.durationMult = d.m;
      saveState();
    });
    durationRow.appendChild(el);
  });
}

function clearTimeSelection() {
  state.time = null; state.date = null; state.dateLabel = null;
  const timeSection = document.getElementById('timeSection');
  if (timeSection) timeSection.style.display = 'none';
  const next2Btn = document.getElementById('next2');
  if (next2Btn) next2Btn.disabled = true;
}

/* ══════════════════════════════════════
   PHOTO UPLOAD
══════════════════════════════════════ */
function handlePhotoUpload(input) {
  const container = document.getElementById('photoPreviewContainer');
  if (!container) return;
  const files = Array.from(input.files).slice(0, 4 - state.photos.length);

  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      state.photos.push(data);

      const div = document.createElement('div');
      div.style = "width:100px;height:100px;border-radius:var(--radius-sm);border:1px solid var(--border);position:relative;overflow:hidden;";
      div.innerHTML = `<img src="${data}" style="width:100%;height:100%;object-fit:cover">
                       <button onclick="removePhoto(this, '${data}')" style="position:absolute;top:2px;right:2px;background:var(--danger);color:#fff;border:none;border-radius:4px;width:18px;height:18px;font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center">✕</button>`;
      container.appendChild(div);
    };
    reader.readAsDataURL(file);
  });
}
window.handlePhotoUpload = handlePhotoUpload; // Make globally accessible

function removePhoto(btn, data) {
  state.photos = state.photos.filter(p => p !== data);
  if (btn && btn.parentElement) btn.parentElement.remove();
}
window.removePhoto = removePhoto; // Make globally accessible

/* ══════════════════════════════════════
   SPA VIEW NAVIGATION
══════════════════════════════════════ */
function showBooking(svcName) {
  const landingPage = document.getElementById('landing-page');
  const bookingFlow = document.getElementById('booking-flow');

  // Prevent “background scattering” by freezing the landing page layout
  // and locking body scroll while booking flow is open.
  document.body.classList.add('ds-booking-open');

  if (landingPage) landingPage.style.display = 'none';
  if (bookingFlow) bookingFlow.style.display = 'block';

  // Force top and avoid parallax/scroll side-effects.
  window.scrollTo({ top: 0 });
  initCal();


  // Load state and set step to ensure continuity
  loadState();
  setStep(state.step);

  if (svcName) {
    // Track when the booking flow is opened
    if (window.va) {
      window.va('event', { name: 'booking_started', data: { service: svcName } });
    }

    const opt = Array.from(document.querySelectorAll('.service-option')).find(el => el.dataset.svc === svcName);
    if (opt) selectService(opt);
  }
}
window.showBooking = showBooking; // Make globally accessible

function hideBooking() {
  // Show confirmation dialog before abandoning
  const confirmAbandon = confirm("Are you sure you want to leave the booking process? Your progress will be lost.");

  if (confirmAbandon) {
    document.body.classList.remove('ds-booking-open');
    const landingPage = document.getElementById('landing-page');
    const bookingFlow = document.getElementById('booking-flow');
    if (landingPage) landingPage.style.display = 'block';
    if (bookingFlow) bookingFlow.style.display = 'none';
    document.body.style.overflow = ''; // Restore scrolling
    window.scrollTo({ top: 0 });


    // Track when the user abandons the booking flow
    if (window.va) {
      window.va('event', { name: 'booking_abandoned', data: { current_step: state.step, service: state.service } });
    }
    newBooking(false); // Silent reset
  }
}
window.hideBooking = hideBooking; // Make globally accessible

/* ══════════════════════════════════════
   NAVIGATION (Booking Flow)
══════════════════════════════════════ */
function goNext(step) {
  if (step === 3) { if (!validateStep3()) return; populateReview(); }
  setStep(step + 1);
}
window.goNext = goNext; // Make globally accessible

function goBack(step) { setStep(step - 1); }
window.goBack = goBack; // Make globally accessible

function jumpTo(step) {
  const item = document.querySelector(`.step-item[data-step="${step}"]`);
  // Allow jumping to previous steps or current step if it's already done
  if (item && (item.classList.contains('done') || step < state.step)) {
    setStep(step);
  }
}
window.jumpTo = jumpTo; // Make globally accessible

function setStep(n) {
  state.step = n;
  document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
  const targetPanel = document.getElementById('panel' + n);
  if (targetPanel) targetPanel.classList.add('active');

  // Update step indicators in sidebar
  for (let i = 1; i <= 5; i++) {
    const item = document.querySelector(`.step-item[data-step="${i}"]`);
    const circle = document.getElementById('sc' + i);
    if (!item || !circle) continue;

    item.classList.remove('active', 'done');
    if (i < n) {
      item.classList.add('done');
      circle.textContent = '✓';
    } else if (i === n) {
      item.classList.add('active');
      circle.textContent = i.toString();
    } else {
      circle.textContent = i.toString();
    }
  }
  // Update connectors
  for (let i = 1; i <= 4; i++) {
    const connector = document.getElementById('conn' + i);
    if (connector) connector.classList.toggle('done', i < n);
  }

  // Track progress through the funnel
  if (window.va) {
    window.va('event', { name: 'booking_step_reached', data: { step: n, service: state.service } });
  }

  updateSummary();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ══════════════════════════════════════
   STEP 3 VALIDATION (Booking Flow)
══════════════════════════════════════ */
function validateStep3() {
  const validationRules = {
    fname: v => v.length > 0,
    lname: v => v.length > 0,
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    phone: v => v.length > 6,
    location: v => v.length > 2,
    desc: v => v.length > 5
  };

  let ok = true;
  Object.keys(validationRules).forEach(key => {
    const el = document.getElementById(`d_${key}`);
    const err = document.getElementById(`e_${key}`);
    // Corrected: Access validationRules as a function and pass el.value
    const valid = el ? validationRules[key](el.value.trim()) : false;

    if (el) el.classList.toggle('err', !valid);
    if (err) err.classList.toggle('show', !valid);
    if (!valid) ok = false;
  });

  if (ok) {
    state.fname = document.getElementById('d_fname') ? document.getElementById('d_fname').value.trim() : '';
    state.lname = document.getElementById('d_lname') ? document.getElementById('d_lname').value.trim() : '';
    state.email = document.getElementById('d_email') ? document.getElementById('d_email').value.trim() : '';
    state.phone = document.getElementById('d_phone') ? document.getElementById('d_phone').value.trim() : '';
    state.company = document.getElementById('d_company') ? document.getElementById('d_company').value.trim() : '';
    state.location = document.getElementById('d_location') ? document.getElementById('d_location').value.trim() : '';
    state.desc = document.getElementById('d_desc') ? document.getElementById('d_desc').value.trim() : '';
    state.source = document.getElementById('d_source') ? document.getElementById('d_source').value : '';
    state.contactPref = document.getElementById('d_contact_pref') ? document.getElementById('d_contact_pref').value : '';
  }
  saveState();
  return ok;
}
window.validateStep3 = validateStep3; // Make globally accessible

/* ══════════════════════════════════════
   REVIEW & CONFIRM (Booking Flow)
══════════════════════════════════════ */
function populateReview() {
  // Populate review section elements
  const rvSvc = document.getElementById('rv-svc'); if (rvSvc) rvSvc.textContent = state.service || '—';
  const rvPri = document.getElementById('rv-pri'); if (rvPri) rvPri.textContent = state.priority;
  const rvDate = document.getElementById('rv-date'); if (rvDate) rvDate.textContent = state.dateLabel || '—';
  const rvTime = document.getElementById('rv-time'); if (rvTime) rvTime.textContent = state.time || '—';
  const rvDur = document.getElementById('rv-dur'); if (rvDur) rvDur.textContent = state.duration || '1 hour';
  const rvName = document.getElementById('rv-name'); if (rvName) rvName.textContent = state.fname + ' ' + state.lname;
  const rvEmail = document.getElementById('rv-email'); if (rvEmail) rvEmail.textContent = state.email;
  const rvPhone = document.getElementById('rv-phone'); if (rvPhone) rvPhone.textContent = state.phone;
  const rvLoc = document.getElementById('rv-loc'); if (rvLoc) rvLoc.textContent = state.location;
  const rvDesc = document.getElementById('rv-desc'); if (rvDesc) rvDesc.textContent = state.desc;
  const rvPhotos = document.getElementById('rv-photos'); if (rvPhotos) rvPhotos.textContent = state.photos.length > 0 ? `${state.photos.length} photo(s) attached` : 'No photos attached';
  const confirmEmailPreview = document.getElementById('confirm-email-preview'); if (confirmEmailPreview) confirmEmailPreview.textContent = state.email;

  // Calculate pricing
  const base = Math.round(state.servicePrice * (state.durationMult || 1));
  const sur = base > 0 ? Math.round(base * (state.priorityMult - 1)) : 0;
  const sub = base + sur;
  const vat = Math.round(sub * 0.075); // Assuming 7.5% VAT
  const total = sub + vat;
  const fmt = n => n === 0 ? 'On Request' : '₦' + n.toLocaleString();

  const ptSvc = document.getElementById('pt-svc'); if (ptSvc) ptSvc.textContent = state.service + ' fee';
  const ptBase = document.getElementById('pt-base'); if (ptBase) ptBase.textContent = fmt(base);
  const ptPriRow = document.getElementById('pt-pri-row');
  const ptPriLabel = document.getElementById('pt-pri-label');
  const ptPri = document.getElementById('pt-pri');
  if (sur > 0) {
    if (ptPriRow) ptPriRow.style.display = '';
    if (ptPriLabel) ptPriLabel.textContent = state.priority + ' surcharge';
    if (ptPri) ptPri.textContent = fmt(sur);
  } else {
    if (ptPriRow) ptPriRow.style.display = 'none';
  }
  const ptSub = document.getElementById('pt-sub'); if (ptSub) ptSub.textContent = fmt(sub);
  const ptVat = document.getElementById('pt-vat'); if (ptVat) ptVat.textContent = base > 0 ? '₦' + vat.toLocaleString() : '—';
  const ptTotal = document.getElementById('pt-total'); if (ptTotal) ptTotal.textContent = base > 0 ? '₦' + total.toLocaleString() : 'On Request';
}
window.populateReview = populateReview; // Make globally accessible

function toggleTerms() {
  const termsCheck = document.getElementById('termsCheck');
  const next4Btn = document.getElementById('next4');
  if (next4Btn && termsCheck) next4Btn.disabled = !termsCheck.checked;
}
window.toggleTerms = toggleTerms; // Make globally accessible

async function confirmBooking() {
  const ref = 'TSH-' + Math.floor(100000 + Math.random() * 900000); // Changed prefix to TSH
  const base = Math.round(state.servicePrice * (state.durationMult || 1));
  const sur = base > 0 ? Math.round(base * (state.priorityMult - 1)) : 0;
  const sub = base + sur;
  const vat = Math.round(sub * 0.075);
  const total = sub + vat;
  const fmt = n => n === 0 ? 'On Request' : '₦' + n.toLocaleString();

  const sendingOverlay = document.getElementById('sendingOverlay');
  const next4Btn = document.getElementById('next4');
  if (sendingOverlay) sendingOverlay.classList.add('show');
  if (next4Btn) next4Btn.disabled = true;

  const params = {
    booking_ref: ref,
    client_name: state.fname + ' ' + state.lname,
    client_email: state.email,
    client_phone: state.phone,
    company: state.company || 'N/A',
    service: state.service,
    priority: state.priority,
    date: state.dateLabel,
    time: state.time,
    duration: state.duration,
    location: state.location,
    description: state.desc,
    photo_count: state.photos.length || 0,
    source: state.source || 'Not specified',
    contact_pref: state.contactPref,
    estimated_fee: fmt(base),
    estimated_total: fmt(total),
    company_email: 'emmanuel.tar@outlook.com',
    to_email: state.email, // customer's email
    reply_to: state.email,
  };

  let companySent = false;
  let customerSent = false;

  if (EMAILJS_CONFIGURED && typeof emailjs !== 'undefined') {
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_COMPANY, {
        ...params,
        to_email: 'emmanuel.tar@outlook.com',
      });
      companySent = true;
    } catch (e) { console.error('Company email failed:', e); }

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_CUSTOMER, {
        ...params,
        to_email: state.email,
      });
      customerSent = true;
    } catch (e) { console.error('Customer email failed:', e); }
  }

  if (sendingOverlay) sendingOverlay.classList.remove('show');

  const bookingRefEl = document.getElementById('bookingRef');
  if (bookingRefEl) bookingRefEl.textContent = ref;

  const emailStatusWrap = document.getElementById('emailStatusWrap');
  if (emailStatusWrap) {
    emailStatusWrap.innerHTML = ''; // Clear previous status
    if (EMAILJS_CONFIGURED) {
      emailStatusWrap.innerHTML = `
        <div class="email-status ${customerSent ? 'sent' : 'failed'}">
          <span class="email-status-icon">${customerSent ? '📧' : '❌'}</span>
          <div class="email-status-text">
            <div class="email-status-title">${customerSent ? 'Confirmation Sent!' : 'Customer Email Failed'}</div>
            <div class="email-status-sub">${customerSent ? 'Sent to ' + state.email : 'Check your EmailJS config'}</div>
          </div>
        </div>
        <div class="email-status ${companySent ? 'sent' : 'failed'}">
          <span class="email-status-icon">${companySent ? '🏢' : '❌'}</span>
          <div class="email-status-text">
            <div class="email-status-title">${companySent ? 'T Square Hub Notified!' : 'Company Email Failed'}</div>
            <div class="email-status-sub">${companySent ? 'Sent to emmanuel.tar@outlook.com' : 'Check your EmailJS config'}</div>
          </div>
        </div>`;
    } else {
      const fallbackNotice = document.getElementById('fallbackNotice');
      const emailFallbackBtn = document.getElementById('emailFallbackBtn');
      if (fallbackNotice) fallbackNotice.classList.add('show');
      if (emailFallbackBtn) emailFallbackBtn.style.display = 'inline-flex';

      const esub = encodeURIComponent('Booking Request — ' + ref);
      const ebody = encodeURIComponent(
        `Booking Reference: ${ref}\nService: ${state.service}\nPriority: ${state.priority}\nDate: ${state.dateLabel}\nTime: ${state.time}\nDuration: ${state.duration}\n\nClient Details:\nName: ${state.fname} ${state.lname}\nEmail: ${state.email}\nPhone: ${state.phone}\nCompany: ${state.company || 'N/A'}\nLocation: ${state.location}\n\nDescription:\n${state.desc}\n\nEstimated Fee: ${fmt(base)}\nEstimated Total (incl. VAT): ${fmt(total)}`
      );
      if (emailFallbackBtn) emailFallbackBtn.href = `mailto:emmanuel.tar@outlook.com?subject=${esub}&body=${ebody}`;
    }
  }

  const confirmDetailsEl = document.getElementById('confirmDetails');
  if (confirmDetailsEl) {
    const dets = [
      { k: 'Booking Ref', v: ref }, { k: 'Service', v: state.service },
      { k: 'Date', v: state.dateLabel }, { k: 'Time', v: state.time },
      { k: 'Name', v: state.fname + ' ' + state.lname }, { k: 'Phone', v: state.phone },
      { k: 'Location', v: state.location }, { k: 'Priority', v: state.priority },
    ];
    confirmDetailsEl.innerHTML = dets.map(d => `<div class="cd-item"><div class="cd-key">${d.k}</div><div class="cd-val">${d.v || '—'}</div></div>`).join('');
  }

  const waConfirmBtn = document.getElementById('waConfirmBtn');
  if (waConfirmBtn) {
    const wamsg = encodeURIComponent(
      `Hello T Square Hub! 👋\n\nI just made a booking:\n📋 *Ref:* ${ref}\n🔧 *Service:* ${state.service}\n⚡ *Priority:* ${state.priority}\n📅 *Date:* ${state.dateLabel}\n⏰ *Time:* ${state.time}\n👤 *Name:* ${state.fname} ${state.lname}\n📸 *Photos:* ${state.photos.length} attached\n📞 *Phone:* ${state.phone}\n📍 *Location:* ${state.location}\n\nPlease confirm my appointment. Thank you!`
    );
    waConfirmBtn.href = `https://wa.me/2347018812186?text=${wamsg}`;
  }

  localStorage.removeItem('ds_booking_progress');
  setStep(5);

  // Track successful conversion
  if (window.va) {
    window.va('event', { name: 'booking_completed', data: { service: state.service, booking_ref: ref } });
  }
}
window.confirmBooking = confirmBooking; // Make globally accessible

function newBooking(reload = true) {
  localStorage.removeItem('ds_booking_progress');
  if (reload) {
    location.reload();
  } else {
    // Manual Reset
    Object.assign(state, { 
      step: 1, service: null, servicePrice: 0, priority: 'Normal', priorityMult: 1, 
      date: null, dateLabel: null, time: null, photos: [] 
    });
    document.querySelectorAll('.service-option, .priority-opt, .time-slot, .cal-day').forEach(el => el.classList.remove('selected'));
    document.querySelectorAll('input, textarea').forEach(el => el.value = '');
    const container = document.getElementById('photoPreviewContainer');
    if (container) container.innerHTML = '<label>...</label>'; // Re-add the upload button
    setStep(1);
    document.body.classList.remove('ds-booking-open');
    document.getElementById('landing-page').style.display = 'block';
    document.getElementById('booking-flow').style.display = 'none';
  }
}
window.newBooking = newBooking; // Make globally accessible

/* ══════════════════════════════════════
   SIDEBAR SUMMARY (Booking Flow)
══════════════════════════════════════ */
function updateSummary() {
  const hasSvc = !!state.service;
  const bookingSummary = document.getElementById('bookingSummary');
  if (bookingSummary) bookingSummary.style.display = hasSvc ? 'flex' : 'none';

  const showSummaryItem = (id, val) => {
    const row = document.getElementById(`sum-${id}`);
    const valueEl = document.getElementById(`sum-${id}-val`);
    if (row) row.style.display = val ? '' : 'none';
    if (valueEl && val) valueEl.textContent = val;
  };

  showSummaryItem('service-val', state.service);
  showSummaryItem('priority', state.priority !== 'Normal' ? state.priority : null);
  const sumDiv1 = document.getElementById('sum-div1');
  if (sumDiv1) sumDiv1.style.display = (state.date || state.time) ? '' : 'none';
  showSummaryItem('date-val', state.dateLabel);
  showSummaryItem('time-val', state.time);
  const sumDiv2 = document.getElementById('sum-div2');
  if (sumDiv2) sumDiv2.style.display = state.fname ? '' : 'none';
  showSummaryItem('name', state.fname ? state.fname + ' ' + state.lname : null);
}
window.updateSummary = updateSummary; // Make globally accessible

/* ══════════════════════════════════════
   REAL-TIME VALIDATION CLEAR (Booking Flow)
══════════════════════════════════════ */
['d_fname', 'd_lname', 'd_email', 'd_phone', 'd_location', 'd_desc'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', () => {
    el.classList.remove('err');
    const err = document.getElementById('e_' + id.replace('d_', ''));
    if (err) err.classList.remove('show');
  });
});

/* ── URL param: auto-select service ── */
(function checkURLParam() {
  const p = new URLSearchParams(window.location.search).get('service');
  if (!p) return;
  const cards = document.querySelectorAll('.service-option');
  cards.forEach(c => {
    if (c.dataset.svc.toLowerCase().includes(p.toLowerCase())) {
      setTimeout(() => showBooking(c.dataset.svc), 300); // Call showBooking with the service
    }
  });
})();

/* ── Setup guide modal ── */
function showSetupGuide() {
  const modal = document.getElementById('setupModal');
  if (modal) modal.style.display = 'flex';
}
window.showSetupGuide = showSetupGuide; // Make globally accessible