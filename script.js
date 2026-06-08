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
  progressBar.style.width = `${(st / height) * 100}%`;
  // UI States
  backTop.classList.toggle('visible', st > 400);
  navbar.classList.toggle('scrolled', st > 20);
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
themeToggle.addEventListener('click', () => {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  themeToggle.textContent = isDark ? '🌙' : '☀️';
});

const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
function closeMob() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
}

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
        a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
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
const cards = track.querySelectorAll('.testi-card');
const dotsContainer = document.getElementById('testiDots');
let current = 0;
const perView = () => window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3;
cards.forEach((_, i) => {
  const d = document.createElement('div');
  d.className = 'testi-dot' + (i === 0 ? ' active' : '');
  d.onclick = () => goTo(i);
  dotsContainer.appendChild(d);
});
function goTo(idx) {
  const pv = perView();
  const max = cards.length - pv;
  current = Math.max(0, Math.min(idx, max));
  const w = cards[0].offsetWidth + 24;
  track.style.transform = `translateX(-${current * w}px)`;
  dotsContainer.querySelectorAll('.testi-dot').forEach((d, i) => d.classList.toggle('active', i === current));
}
document.getElementById('testiPrev').onclick = () => goTo(current - 1);
document.getElementById('testiNext').onclick = () => goTo(current + 1);

const startAutoSlide = () => setInterval(() => {
  const next = current + 1 > cards.length - perView() ? 0 : current + 1;
  goTo(next);
}, 5000);

let autoSlide = startAutoSlide();
track.addEventListener('mouseenter', () => clearInterval(autoSlide));
track.addEventListener('mouseleave', () => { autoSlide = setInterval(() => goTo(current + 1 > cards.length - perView() ? 0 : current + 1), 5000); });
window.addEventListener('resize', () => goTo(0));

/* ─── FAQ ACCORDION ─── */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

/* ─── FORM VALIDATION ─── */
function validate(id, errId, check) {
  const el = document.getElementById(id);
  const err = document.getElementById(errId);
  const ok = check(el.value.trim());
  el.classList.toggle('error', !ok);
  err.classList.toggle('show', !ok);
  return ok;
}
function handleSubmit() {
  const v1 = validate('fname', 'err-fname', v => v.length > 0);
  const v2 = validate('email', 'err-email', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
  const v3 = validate('service', 'err-service', v => v !== '');
  const v4 = validate('message', 'err-message', v => v.length > 5);
  if (!v1 || !v2 || !v3 || !v4) return;
  const btn = document.getElementById('submitBtn');
  btn.disabled = true; btn.textContent = 'Sending...';
  const fname = document.getElementById('fname').value.trim();
  const lname = document.getElementById('lname').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const company = document.getElementById('company').value.trim();
  const service = document.getElementById('service').value;
  const message = document.getElementById('message').value.trim();
  const subject = encodeURIComponent('Dream Space Enquiry: ' + service);
  const body = encodeURIComponent(`Name: ${fname} ${lname}\nEmail: ${email}\nPhone: ${phone}\nCompany: ${company}\nService: ${service}\n\nMessage:\n${message}`);
  setTimeout(() => {
    window.location.href = `mailto:emmanuel.tar@outlook.com?subject=${subject}&body=${body}`;
    document.getElementById('formBody').style.display = 'none';
    document.getElementById('successMsg').style.display = 'block';
  }, 800);
}

/* ── REAL-TIME VALIDATION ─── */
['fname','email','service','message'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', () => el.classList.remove('error'));
});

/* ── WHATSAPP WIDGET ─── */
function toggleWA() {
  document.getElementById('waPopup').classList.toggle('open');
}
document.addEventListener('click', e => {
  const widget = document.querySelector('.wa-widget');
  if (!widget.contains(e.target)) document.getElementById('waPopup').classList.remove('open');
});

/* ── COOKIE ─── */
if (!localStorage.getItem('ds_cookie')) {
  setTimeout(() => document.getElementById('cookie').classList.add('show'), 2500);
}
function acceptCookie() {
  localStorage.setItem('ds_cookie', '1');
  document.getElementById('cookie').classList.remove('show');
}

/* ══════════════════════════════════════
   ⚙️  EMAILJS CONFIGURATION
   Replace these 4 values after setting
   up your EmailJS account (see guide)
══════════════════════════════════════ */
const EMAILJS_PUBLIC_KEY     = 'ynAKx0CuhnGcuNjz-';        // From EmailJS → Account → API Keys
const EMAILJS_SERVICE_ID     = 'YOUR_SERVICE_ID';        // From EmailJS → Email Services
const EMAILJS_TEMPLATE_COMPANY  = 'ds_company_alert';    // Template for Dream Space notification
const EMAILJS_TEMPLATE_CUSTOMER = 'ds_customer_confirm'; // Template for customer confirmation

const EMAILJS_CONFIGURED = EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY';

// Initialize EmailJS
function initializeEmailJS() { // Run this after the DOM is fully loaded, but not necessarily after all images etc.
  document.addEventListener('DOMContentLoaded', () => {
    if (EMAILJS_CONFIGURED && typeof emailjs !== 'undefined') {
      emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    } else if (!EMAILJS_CONFIGURED) {
      const setupNotice = document.getElementById('setup-notice');
      if (setupNotice) setupNotice.style.display = 'flex'; // Show setup notice if not configured
    }
  });
}
initializeEmailJS(); // Call it directly, DOMContentLoaded will ensure elements are there.

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
    const { date, photos, ...toSave } = state; // 'date' is a Date object, can't be directly JSON.stringified
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
  }
}
window.addEventListener('load', initializeEmailJS); // Initialize after all resources are loaded

/* ══════════════════════════════════════
   BOOKING STATE & LOCAL STORAGE
══════════════════════════════════════ */
const state = {
  step:1, service:null, servicePrice:0,
  priority:'Normal', priorityMult:1,
  date:null, dateLabel:null, time:null, 
  duration:'1 hour', durationMult:1,
  fname:'', lname:'', email:'', phone:'', 
  photos:[],
  company:'', location:'', desc:'', source:'', contactPref:'Phone Call'
};

let saveTimeout;
function saveState() {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    const { date, photos, ...toSave } = state;
    localStorage.setItem('ds_booking_progress', JSON.stringify(toSave));
  }, 500);
}

function loadState() {
  const saved = localStorage.getItem('ds_booking_progress');
  if (saved) {
    const parsed = JSON.parse(saved);
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
  document.getElementById('next1').disabled = false;
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
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  document.getElementById('calMonth').textContent = months[calMonth] + ' ' + calYear;
  const grid = document.getElementById('calGrid');
  grid.innerHTML = '';
  const today = new Date(); today.setHours(0,0,0,0);
  const first = new Date(calYear, calMonth, 1);
  const last = new Date(calYear, calMonth+1, 0);
  const startDay = first.getDay();
  for (let i = 0; i < startDay; i++) { const e = document.createElement('div'); e.className='cal-day empty'; grid.appendChild(e); }
  for (let d = 1; d <= last.getDate(); d++) {
    const dt = new Date(calYear, calMonth, d);
    const el = document.createElement('div');
    el.className = 'cal-day';
    el.textContent = d;
    if (dt.toDateString() === today.toDateString()) el.classList.add('today');
    if (dt <= today || dt.getDay() === 0) {
      el.classList.add('disabled');
    } else {
      el.classList.add('has-slots');
      el.addEventListener('click', () => selectDay(el, d, dt));
    }
    grid.appendChild(el);
  }
}

function prevMonth() { calMonth--; if (calMonth<0){calMonth=11;calYear--;} renderCal(); clearTimeSelection(); }
function nextMonth() { calMonth++; if (calMonth>11){calMonth=0;calYear++;} renderCal(); clearTimeSelection(); }

function selectDay(el, d, dt) {
  document.querySelectorAll('.cal-day.selected').forEach(e => e.classList.remove('selected'));
  el.classList.add('selected');
  const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  state.date = dt;
  state.dateLabel = days[dt.getDay()] + ', ' + d + ' ' + months[calMonth] + ' ' + calYear;
  renderTimeSlots(dt.getDay());
  updateSummary();
}

function renderSlots(cId, slots, taken) {
  const c = document.getElementById(cId); if(!c) return;
  c.innerHTML = '';
  slots.forEach(s => {
    const el = document.createElement('div');
    el.className = 'time-slot' + (taken.includes(s) ? ' taken' : '');
    el.textContent = s;
    if (!taken.includes(s)) el.addEventListener('click', () => {
      document.querySelectorAll('.time-slot.selected').forEach(e=>e.classList.remove('selected'));
      el.classList.add('selected');
      state.time = s;
      document.getElementById('next2').disabled = false;
      updateSummary();
      saveState();
    });
    c.appendChild(el);
  });
}

function renderTimeSlots(dow) {
  document.getElementById('timeSection').style.display = 'block';
  const isSat = dow === 6;
  const morning = ['8:00 AM','8:30 AM','9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM'];
  const afternoon = ['12:00 PM','12:30 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM'];
  const taken = isSat ? ['9:00 AM','10:30 AM','2:00 PM'] : ['9:30 AM','11:00 AM','1:00 PM','3:00 PM'];
  renderSlots('slotsMorning', morning, taken);
  renderSlots('slotsAfternoon', isSat ? afternoon.slice(0,5) : afternoon, taken);
  state.time = null;
  document.getElementById('next2').disabled = true;
}

function clearTimeSelection() {
  state.time = null; state.date = null; state.dateLabel = null;
  document.getElementById('timeSection').style.display = 'none';
  document.getElementById('next2').disabled = true;
}

/* ── SPA VIEW NAVIGATION ── */
function showBooking(svcName) {
  document.getElementById('landing-page').style.display = 'none';
  document.getElementById('booking-flow').style.display = 'block';
  document.body.style.overflow = 'auto';
  window.scrollTo({top:0});
  initCal(); 
  
  if(svcName) {
    // Track when the booking flow is opened
    if (window.va) {
      window.va('event', { name: 'booking_started', data: { service: svcName } });
    }

    const opt = Array.from(document.querySelectorAll('.service-option')).find(el => el.dataset.svc === svcName);
    if(opt) selectService(opt);
  }
}

function hideBooking() {
  // Show confirmation dialog before abandoning
  const confirmAbandon = confirm("Are you sure you want to leave the booking process? Your progress will be lost.");
  
  if (confirmAbandon) {
    document.getElementById('landing-page').style.display = 'block';
    document.getElementById('booking-flow').style.display = 'none';
    window.scrollTo({top:0});

    // Track when the user abandons the booking flow
    if (window.va) {
      window.va('event', { name: 'booking_abandoned', data: { current_step: state.step, service: state.service } });
    }
  }
}

/* ── NAVIGATION ── */
function goNext(step) {
  if (step === 3) { if (!validateStep3()) return; populateReview(); }
  setStep(step + 1);
}
function goBack(step) { setStep(step - 1); }
function jumpTo(step) {
  const item = document.querySelector(`.step-item[data-step="${step}"]`);
  if (item && (item.classList.contains('done') || step < state.step)) setStep(step);
}

function setStep(n) {
  state.step = n;
  document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('panel' + n);
  if(target) target.classList.add('active');

  // Track progress through the funnel
  if (window.va) {
    window.va('event', { name: 'booking_step_reached', data: { step: n } });
  }
  
  for (let i=1;i<=4;i++){
    const item=document.querySelector(`.step-item[data-step="${i}"]`);
    const circle=document.getElementById('sc'+i);
    if(!item||!circle)continue;
    item.classList.remove('active','done');
    if(i<n){item.classList.add('done');circle.textContent='✓';}
    else if(i===n){item.classList.add('active');circle.textContent=i;}
    else{circle.textContent=i;}
  }
  updateSummary();
  window.scrollTo({top:0,behavior:'smooth'});
}

/* ── REVIEW & CONFIRM ── */
function populateReview() {
  document.getElementById('rv-svc').textContent = state.service || '—';
  document.getElementById('rv-date').textContent = state.dateLabel || '—';
  document.getElementById('rv-name').textContent = state.fname + ' ' + state.lname;
  document.getElementById('rv-phone').textContent = state.phone;
  document.getElementById('pt-total').textContent = state.servicePrice > 0 ? '₦' + state.servicePrice.toLocaleString() : 'On Request';
}

function toggleTerms() {
  document.getElementById('next4').disabled = !document.getElementById('termsCheck').checked;
}

async function confirmBooking() {
  const ref = 'DS-' + Math.floor(100000 + Math.random()*900000);
  document.getElementById('sendingOverlay').classList.add('show');

  // Mock sending - Connect your EmailJS here as per previous turn
  setTimeout(() => {
    document.getElementById('sendingOverlay').classList.remove('show');
    document.getElementById('bookingRef').textContent = ref;
    
    const wamsg = encodeURIComponent(`Hello Dream Space! 👋\n\nI just made a booking:\n📋 *Ref:* ${ref}\n🔧 *Service:* ${state.service}\n👤 *Name:* ${state.fname} ${state.lname}\n📞 *Phone:* ${state.phone}\n\nPlease confirm my appointment. Thank you!`);
    document.getElementById('waConfirmBtn').href = `https://wa.me/2347018812186?text=${wamsg}`;
    
    setStep(5);
    localStorage.removeItem('ds_booking_progress');

    // Track successful conversion
    if (window.va) {
      window.va('event', { name: 'booking_completed', data: { service: state.service } });
    }
  }, 1500);
}

function updateSummary() {
  const hasSvc = !!state.service;
  const summary = document.getElementById('bookingSummary');
  if(summary) summary.style.display = hasSvc ? 'flex' : 'none';
  
  const svcVal = document.getElementById('sum-svc-val');
  if(svcVal) svcVal.textContent = state.service || '—';
  
  const dateVal = document.getElementById('sum-date-val');
  if(dateVal) dateVal.textContent = state.dateLabel || '—';
}

function newBooking() {
  localStorage.removeItem('ds_booking_progress');
  location.reload();
}

/* ── GLOBAL ATTACHMENTS ── */
window.showBooking = showBooking;
window.hideBooking = hideBooking;
window.selectService = selectService;
window.selectPriority = selectPriority;
window.goNext = goNext;
window.goBack = goBack;
window.jumpTo = jumpTo;
window.prevMonth = prevMonth;
window.nextMonth = nextMonth;
window.toggleTerms = toggleTerms;
window.confirmBooking = confirmBooking;
window.newBooking = newBooking;

// Additional functions from booking.js that need to be globally accessible or used
function validateStep3() {
  const validationRules = {
    fname: v => v.length > 0,
    lname: v => v.length > 0,
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    phone: v => v.length > 6,
    location: v => v.length > 2,
    desc: v => v.length > 5
  };

  let ok=true;
  Object.keys(validationRules).forEach(key => {
    const el = document.getElementById(`d_${key}`);
    const err = document.getElementById(`e_${key}`);
    const valid = el ? validationRuleskey : false;
    
    if(el) el.classList.toggle('err',!valid);
    if(err) err.classList.toggle('show',!valid);
    if(!valid)ok=false;
  });

  if(ok){
    state.fname=document.getElementById('d_fname').value.trim();
    state.lname=document.getElementById('d_lname').value.trim();
    state.email=document.getElementById('d_email').value.trim();
    state.phone=document.getElementById('d_phone').value.trim();
    state.company=document.getElementById('d_company').value.trim();
    state.location=document.getElementById('d_location').value.trim();
    state.desc=document.getElementById('d_desc').value.trim();
    state.source=document.getElementById('d_source').value;
    state.contactPref=document.getElementById('d_contact_pref').value;
  }
  saveState();
  return ok;
}
window.validateStep3 = validateStep3;

function handlePhotoUpload(input) {
  const container = document.getElementById('photoPreviewContainer');
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
      if(container) container.appendChild(div);
    };
    reader.readAsDataURL(file);
  });
}
window.handlePhotoUpload = handlePhotoUpload;

function removePhoto(btn, data) {
  state.photos = state.photos.filter(p => p !== data);
  btn.parentElement.remove();
}
window.removePhoto = removePhoto;

function renderDurations() {
  const durs = [
    {l:'30 min', m:0.7},
    {l:'1 hour', m:1},
    {l:'2 hours', m:1.8},
    {l:'Half day', m:3.5},
    {l:'Full day', m:6}
  ];
  const c = document.getElementById('durationRow'); if(!c) return;
  c.innerHTML = '';
  durs.forEach((d) => {
    const el = document.createElement('div');
    el.className = 'dur-opt' + (d.l === state.duration ? ' selected' : '');
    el.textContent = d.l;
    el.addEventListener('click', () => {
      document.querySelectorAll('.dur-opt').forEach(e=>e.classList.remove('selected'));
      el.classList.add('selected'); 
      state.duration = d.l;
      state.durationMult = d.m;
      saveState();
    });
    c.appendChild(el);
  });
}

window.renderDurations = renderDurations;

// Real-time validation clear for booking form
['d_fname','d_lname','d_email','d_phone','d_location','d_desc'].forEach(id=>{
  const el=document.getElementById(id);
  if(el)el.addEventListener('input',()=>{
    el.classList.remove('err');
    const e=document.getElementById('e_'+id.replace('d_',''));
    if(e)e.classList.remove('show');
  });
});

// EmailJS Setup Guide Modal
function showSetupGuide(){
  const modal = document.getElementById('setupModal');
  if(modal) modal.style.display='flex';
}
window.showSetupGuide = showSetupGuide;