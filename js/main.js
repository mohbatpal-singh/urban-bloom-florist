/**
 * URBAN BLOOM FLORIST — CLIENT-SIDE JAVASCRIPT
 * BBIS 6105 Web Design & Development — Assignment 2a Alpha Prototype
 * Auckland, New Zealand
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initProductFilter();
  initProductQuickView();
  initSuburbChecker();
  initFaqAccordion();
  initEnquiryForm();
  initUrlParamHandler();
});

/* ==========================================================================
   1. MOBILE NAVIGATION TOGGLE & ACCESSIBILITY
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const siteNav   = document.querySelector('.site-nav');
  if (!toggleBtn || !siteNav) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', String(!isExpanded));
    toggleBtn.classList.toggle('active');
    siteNav.classList.toggle('open');
  });

  // Close when a nav link is tapped (mobile)
  siteNav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggleBtn.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      siteNav.classList.remove('open');
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (siteNav.classList.contains('open') &&
        !siteNav.contains(e.target) &&
        !toggleBtn.contains(e.target)) {
      toggleBtn.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      siteNav.classList.remove('open');
    }
  });
}

/* ==========================================================================
   2. PRODUCT FILTERING & SEARCH (products.html)
      — reads ?filter= URL param on page load
   ========================================================================== */
function initProductFilter() {
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');
  const searchInput  = document.querySelector('#productSearchInput');
  const countBadge   = document.querySelector('#filterCountDisplay');
  const noResults    = document.querySelector('#noResultsMsg');

  if (!filterBtns.length || !productCards.length) return;

  let currentCategory = 'all';
  let currentSearch   = '';

  function applyFilters() {
    let visibleCount = 0;

    productCards.forEach((card) => {
      const cardCategory = card.getAttribute('data-category') || '';
      const cardTitle    = (card.querySelector('.product-card-title')?.textContent || '').toLowerCase();
      const cardDesc     = (card.querySelector('.product-card-desc')?.textContent  || '').toLowerCase();
      const cardOccasion = (card.querySelector('.product-card-occasion')?.textContent || '').toLowerCase();

      const matchesCategory = (currentCategory === 'all') || cardCategory.split(' ').includes(currentCategory);
      const matchesSearch   = !currentSearch ||
        cardTitle.includes(currentSearch) ||
        cardDesc.includes(currentSearch)  ||
        cardOccasion.includes(currentSearch);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        card.style.animation = 'fadeIn 0.3s ease forwards';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (countBadge) {
      countBadge.textContent = `Showing ${visibleCount} item${visibleCount === 1 ? '' : 's'}`;
    }
    if (noResults) {
      noResults.hidden = visibleCount > 0;
    }

    // Update aria-pressed on filter buttons
    filterBtns.forEach(btn => {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-filter') === currentCategory ? 'true' : 'false');
    });
  }

  function setFilter(category) {
    currentCategory = category;
    filterBtns.forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`.filter-btn[data-filter="${category}"]`);
    if (activeBtn) activeBtn.classList.add('active');
    applyFilters();
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setFilter(btn.getAttribute('data-filter') || 'all');
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.trim().toLowerCase();
      applyFilters();
    });
  }

  // Read ?filter= from URL (fixes products.html?filter=birthday etc.)
  const urlFilter = new URLSearchParams(window.location.search).get('filter');
  if (urlFilter) {
    setFilter(urlFilter);
  } else {
    applyFilters(); // set initial aria-pressed states
  }
}

/* ==========================================================================
   3. PRODUCT QUICK VIEW MODAL — with focus management
   ========================================================================== */
function initProductQuickView() {
  const modalOverlay = document.querySelector('#quickViewModal');
  const modalCloseBtn = document.querySelector('#quickViewClose');
  if (!modalOverlay) return;

  let triggerBtn = null;

  document.querySelectorAll('.product-quick-view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      triggerBtn = btn;
      const card = btn.closest('.product-card');
      if (!card) return;

      const title = card.querySelector('.product-card-title')?.textContent || '';
      const price = card.querySelector('.product-price')?.textContent || '';
      const desc = card.querySelector('.product-card-desc')?.textContent || '';
      const occasion = card.querySelector('.product-card-occasion')?.textContent || '';
      const imgSrc = card.querySelector('img')?.getAttribute('src') || '';
      const imgAlt = card.querySelector('img')?.getAttribute('alt') || '';

      document.querySelector('#modalProductTitle').textContent = title;
      document.querySelector('#modalProductPrice').textContent = price;
      document.querySelector('#modalProductDesc').textContent = desc;
      document.querySelector('#modalProductOccasion').textContent = occasion;

      const modalImg = document.querySelector('#modalProductImg');
      if (modalImg && imgSrc) { modalImg.src = imgSrc; modalImg.alt = imgAlt; }

      const modalLink = document.querySelector('#modalEnquireLink');
      if (modalLink) modalLink.href = `contact.html?product=${encodeURIComponent(title)}`;

      openQuickView();
    });
  });

  function getFocusable() {
    return Array.from(modalOverlay.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'));
  }

  function openQuickView() {
    modalOverlay.classList.add('active');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    (modalCloseBtn || getFocusable()[0])?.focus();
  }

  function closeQuickView() {
    modalOverlay.classList.remove('active');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    triggerBtn?.focus();
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeQuickView);
  modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeQuickView(); });
  modalOverlay.addEventListener('keydown', e => {
    if (!modalOverlay.classList.contains('active')) return;
    if (e.key === 'Escape') { closeQuickView(); return; }
    if (e.key === 'Tab') {
      const focusable = getFocusable();
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
}

/* ==========================================================================
   4. SUBURB DELIVERY CHECKER (delivery.html) — textContent only
   ========================================================================== */
function initSuburbChecker() {
  const form      = document.querySelector('#suburbCheckerForm');
  const select    = document.querySelector('#suburbSelect');
  const resultBox = document.querySelector('#suburbResultBox');
  const pills     = document.querySelectorAll('.suburb-pill');
  if (!form || !resultBox) return;

  // Core suburbs — no invented fees or specific dispatch times
  const coreSuburbs = {
    'central auckland': true,
    'ponsonby':         true,
    'grey lynn':        true,
    'parnell':          true,
    'newmarket':        true,
    'mount eden':       true,
    'epsom':            true,
    'remuera':          true
  };

  function buildResult(isCore, suburbName) {
    // Use DOM construction (not innerHTML) to avoid XSS with user input
    resultBox.className = isCore ? 'suburb-result active' : 'suburb-result active not-found';

    const headerDiv = document.createElement('div');
    headerDiv.className = 'suburb-result-header';

    const icon   = document.createElement('span');
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = isCore ? '✓' : 'ℹ';
    icon.className = isCore ? 'suburb-icon suburb-icon--ok' : 'suburb-icon suburb-icon--info';

    const strong = document.createElement('strong');
    strong.textContent = isCore
      ? `Urban Bloom delivers to ${suburbName}`
      : `Delivery to ${suburbName} may be available by arrangement`;

    headerDiv.appendChild(icon);
    headerDiv.appendChild(strong);

    const body = document.createElement('p');
    body.className = 'suburb-result-body';
    body.textContent = isCore
      ? 'This is within our standard delivery area (Monday–Saturday). Delivery charges vary by location. Allow at least one working day\'s notice.'
      : 'This suburb is outside our primary delivery area. Please contact us to discuss arrangements for your location.';

    const link = document.createElement('a');
    link.href = `contact.html?suburb=${encodeURIComponent(suburbName)}`;
    link.className = isCore ? 'btn btn-sm btn-primary suburb-result-btn' : 'btn btn-sm btn-accent suburb-result-btn';
    link.textContent = isCore ? `Enquire for delivery to ${suburbName}` : 'Contact us about delivery';

    resultBox.textContent = ''; // clear
    resultBox.appendChild(headerDiv);
    resultBox.appendChild(body);
    resultBox.appendChild(link);
  }

  function checkSuburb(suburbName) {
    if (!suburbName || suburbName === '') return;
    const clean  = suburbName.trim().toLowerCase();
    const isCore = Boolean(coreSuburbs[clean]);
    buildResult(isCore, suburbName.trim());
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    checkSuburb(select ? select.value : '');
  });

  if (select) select.addEventListener('change', () => checkSuburb(select.value));

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const suburb = pill.getAttribute('data-suburb') || pill.textContent.trim();
      if (select) select.value = suburb;
      checkSuburb(suburb);
    });
  });
}

/* ==========================================================================
   5. FAQ ACCORDION (delivery.html)
   ========================================================================== */
function initFaqAccordion() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;
    const answerId = answer.id || `faq-answer-${Array.from(document.querySelectorAll('.faq-item')).indexOf(item) + 1}`;
    answer.id = answerId;
    btn.setAttribute('aria-controls', answerId);

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item').forEach(other => {
        other.classList.remove('open');
        other.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   6. ENQUIRY FORM — validation, live estimate, wedding fields, confirmation
   ========================================================================== */
function initEnquiryForm() {
  const form = document.querySelector('#enquiryForm');
  if (!form) return;

  const productSelect     = document.querySelector('#productSelect');
  const addonCheckboxes   = document.querySelectorAll('.addon-checkbox');
  const totalAmountEl     = document.querySelector('#estimatedTotal');
  const deliveryNote      = document.querySelector('#deliveryNote');
  const enquiryTypeRadios = document.querySelectorAll('input[name="enquiryType"]');
  const weddingFields     = document.querySelector('#weddingEventFields');

  // Prices in NZD matching Case Pack Appendix A2, A4, A5
  const productPrices = {
    'Auckland Sunrise':            69,
    'Soft Blush':                  79,
    'Native Grace':                85,
    'Celebration Mix':             75,
    'Classic Rose Collection':     95,
    'Peaceful Wishes':             89,
    'Urban Statement Arrangement': 120,
    "Seasonal Designer's Choice":  70,
    'Bridal Bouquet':              180,
    'Bridesmaid Bouquet':          110,
    'Table Arrangement':           95,
    'Corporate Weekly Arrangement': 120,
    'General Enquiry':             0
  };

  // Add-on prices matching Appendix A3
  const addonPrices = { vase: 25, card: 8, chocolates: 18, wrapping: 12 };

  function updateEstimate() {
    let total = 0;
    const selected = productSelect ? productSelect.value : '';
    if (productPrices[selected] !== undefined) total += productPrices[selected];

    addonCheckboxes.forEach(cb => {
      if (cb.checked && addonPrices[cb.value]) total += addonPrices[cb.value];
    });

    if (totalAmountEl) {
      totalAmountEl.textContent = total > 0
        ? `Estimated from $${total} NZD`
        : 'Quotation on enquiry';
    }
    // Delivery fee: never added — varies by location
    if (deliveryNote) {
      deliveryNote.textContent = 'Delivery charges vary by location and will be confirmed on enquiry.';
    }
  }

  if (productSelect) productSelect.addEventListener('change', updateEstimate);
  addonCheckboxes.forEach(cb => cb.addEventListener('change', updateEstimate));

  // Show/hide wedding-specific fields based on service type
  function toggleWeddingFields() {
    if (!weddingFields) return;
    const checked = form.querySelector('input[name="enquiryType"]:checked');
    const isEvent = checked && (checked.value === 'wedding' || checked.value === 'event');
    weddingFields.hidden = !isEvent;
    weddingFields.setAttribute('aria-hidden', String(!isEvent));
    weddingFields.querySelectorAll('input, select, textarea').forEach(el => {
      el.required = isEvent;
    });
  }

  enquiryTypeRadios.forEach(r => r.addEventListener('change', toggleWeddingFields));
  toggleWeddingFields(); // run on load

  // Date validation — ensure at least 1 working day ahead
  const dateInput = document.querySelector('#preferredDate');
  if (dateInput) {
    function getNextWorkingDay() {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      // Skip Sunday (0)
      if (d.getDay() === 0) d.setDate(d.getDate() + 1);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    const nextWorking = getNextWorkingDay();
    dateInput.min = nextWorking;
    if (!dateInput.value) {
      dateInput.value = nextWorking;
    }
    dateInput.addEventListener('change', () => {
      if (!dateInput.value) return;
      const chosen = new Date(dateInput.value + 'T00:00:00');
      if (chosen.getDay() === 0) {
        dateInput.value = '';
        dateInput.classList.add('error');
        dateInput.setAttribute('aria-invalid', 'true');
      }
    });
  }

  // Clear validation errors live as user types/selects
  form.querySelectorAll('.form-control').forEach(ctrl => {
    ctrl.addEventListener('input', () => {
      ctrl.classList.remove('error');
      ctrl.removeAttribute('aria-invalid');
    });
    ctrl.addEventListener('change', () => {
      ctrl.classList.remove('error');
      ctrl.removeAttribute('aria-invalid');
    });
  });

  // Phone validation helper
  function isValidNZPhone(val) {
    // Allow NZ formats: 09 000 0000, 021 000 0000, +64 9 000 0000 etc.
    return /^(\+?64|0)[2-9][\d]{6,11}$/.test(val.replace(/[\s().-]/g, ''));
  }

  // Form submission
  form.addEventListener('submit', e => {
    e.preventDefault();

    let isValid = true;

    // Clear previous errors
    form.querySelectorAll('.form-control').forEach(el => el.classList.remove('error'));

    // Required field check
    form.querySelectorAll('[required]').forEach(input => {
      if (!input.value.trim()) {
        isValid = false;
        input.classList.add('error');
        input.setAttribute('aria-invalid', 'true');
      } else {
        input.removeAttribute('aria-invalid');
      }
    });

    // Email format
    const emailEl = form.querySelector('#customerEmail');
    if (emailEl && emailEl.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
      isValid = false;
      emailEl.classList.add('error');
      emailEl.setAttribute('aria-invalid', 'true');
    }

    // Phone format
    const phoneEl = form.querySelector('#customerPhone');
    if (phoneEl && phoneEl.value && !isValidNZPhone(phoneEl.value)) {
      isValid = false;
      phoneEl.classList.add('error');
      phoneEl.setAttribute('aria-invalid', 'true');
    }

    // Date — at least next working day
    if (dateInput && dateInput.value) {
      const chosen = new Date(dateInput.value);
      const minDate = new Date(dateInput.min);
      if (chosen < minDate) {
        isValid = false;
        dateInput.classList.add('error');
        dateInput.setAttribute('aria-invalid', 'true');
      }
    }

    if (!isValid) {
      // Focus first error field (no alert())
      const firstError = form.querySelector('.error');
      firstError?.focus();
      return;
    }

    // Build confirmation data using textContent (not innerHTML)
    const customerName = form.querySelector('#customerName')?.value || 'Customer';
    const chosenProd   = productSelect?.value || 'Floral arrangement';
    const estimate     = totalAmountEl ? totalAmountEl.textContent : '';

    showConfirmationModal({ name: customerName, product: chosenProd, total: estimate });
    form.reset();
    if (dateInput) dateInput.value = dateInput.min;
    toggleWeddingFields();
    updateEstimate();
  });
}

/* --------------------------------------------------------------------------
   Show Confirmation Modal — all text via textContent (no innerHTML for user data)
   -------------------------------------------------------------------------- */
function showConfirmationModal(data) {
  let overlay = document.querySelector('#confirmationModal');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'confirmationModal';
    overlay.className = 'modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'confirmTitle');
    document.body.appendChild(overlay);
  }

  // Build the modal structure safely (no innerHTML with user data)
  const box = document.createElement('div');
  box.className = 'modal-box';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'modal-close-btn';
  closeBtn.id = 'confirmModalClose';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.textContent = '×';

  const body = document.createElement('div');
  body.className = 'modal-body text-center';

  const iconDiv = document.createElement('div');
  iconDiv.className = 'modal-success-icon';
  iconDiv.setAttribute('aria-hidden', 'true');
  iconDiv.textContent = '✓';

  const h3 = document.createElement('h3');
  h3.id = 'confirmTitle';
  h3.className = 'confirm-modal-title';
  h3.textContent = 'Form Checked';

  const protoNote = document.createElement('p');
  protoNote.className = 'confirm-proto-note';
  protoNote.textContent = 'This is a prototype, so your enquiry has not been sent. Here is what you entered.';

  const detailBox = document.createElement('div');
  detailBox.className = 'confirm-detail-box';

  function detailRow(label, value) {
    const p = document.createElement('p');
    p.className = 'confirm-detail-row';
    const strong = document.createElement('strong');
    strong.textContent = label + ': ';
    const span = document.createElement('span');
    span.textContent = value;
    p.appendChild(strong);
    p.appendChild(span);
    return p;
  }

  detailBox.appendChild(detailRow('Name',        data.name));
  detailBox.appendChild(detailRow('Selection',   data.product));
  if (data.total) detailBox.appendChild(detailRow('Estimate', data.total));

  const followupNote = document.createElement('p');
  followupNote.className = 'confirm-followup-note';
  followupNote.textContent = 'To enquire now, please call 09 000 0001 or email hello@urbanbloom.kiwi.';

  const okBtn = document.createElement('button');
  okBtn.id = 'confirmModalOkBtn';
  okBtn.className = 'btn btn-primary';
  okBtn.textContent = 'Close';

  body.appendChild(iconDiv);
  body.appendChild(h3);
  body.appendChild(protoNote);
  body.appendChild(detailBox);
  body.appendChild(followupNote);
  body.appendChild(okBtn);

  box.appendChild(closeBtn);
  box.appendChild(body);
  overlay.textContent = ''; // clear
  overlay.appendChild(box);

  let prevFocus = document.activeElement;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  closeBtn.focus();

  function closeConfirm() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    prevFocus?.focus();
  }

  closeBtn.addEventListener('click', closeConfirm);
  okBtn.addEventListener('click', closeConfirm);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeConfirm(); });
  // Close with Escape and keep keyboard focus inside the confirmation dialog.
  overlay.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeConfirm(); return; }
    if (e.key === 'Tab') {
      const focusable = [closeBtn, okBtn];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
}

/* ==========================================================================
   7. URL PARAMETER HANDLER
   ========================================================================== */
function initUrlParamHandler() {
  const params       = new URLSearchParams(window.location.search);
  const productParam = params.get('product');
  const suburbParam  = params.get('suburb');
  const serviceParam = params.get('service');
  const filterParam  = params.get('filter'); // handled by initProductFilter

  if (productParam) {
    const productSelect = document.querySelector('#productSelect');
    if (productSelect) {
      for (let i = 0; i < productSelect.options.length; i++) {
        if (productSelect.options[i].value === productParam ||
            productSelect.options[i].text.includes(productParam)) {
          productSelect.selectedIndex = i;
          break;
        }
      }
      productSelect.dispatchEvent(new Event('change'));
    }
  }

  if (suburbParam) {
    const deliverySelect = document.querySelector('#deliverySelect');
    if (deliverySelect) {
      for (let i = 0; i < deliverySelect.options.length; i++) {
        if (deliverySelect.options[i].value.toLowerCase() === suburbParam.toLowerCase()) {
          deliverySelect.selectedIndex = i;
          break;
        }
      }
    }
  }

  if (serviceParam) {
    const radio = document.querySelector(`input[name="enquiryType"][value="${serviceParam}"]`);
    if (radio) {
      radio.checked = true;
      radio.dispatchEvent(new Event('change'));
    }
    const serviceDefaults = { wedding: 'Bridal Bouquet', event: 'Table Arrangement', corporate: 'Corporate Weekly Arrangement' };
    const defaultProduct = serviceDefaults[serviceParam];
    const productSelect = document.querySelector('#productSelect');
    if (defaultProduct && productSelect && !productSelect.value) {
      const option = Array.from(productSelect.options).find(opt => opt.value === defaultProduct || opt.text.includes(defaultProduct));
      if (option) { productSelect.value = option.value; productSelect.dispatchEvent(new Event('change')); }
    }
  }
}
