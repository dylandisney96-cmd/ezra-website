// Form submission handler — tries API first, falls back to localStorage
const API_ENDPOINT = 'https://www.ezramobilitygroup.com/api/submit';

async function submitForm(formElement, storageKey, formType, successMsg) {
  const formData = new FormData(formElement);
  const data = Object.fromEntries(formData);
  data._formType = formType;

  // Try API first
  let apiSuccess = false;
  try {
    const res = await fetch(API_ENDPOINT, {
      method: 'POST',
      body: new URLSearchParams(data),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    apiSuccess = res.ok;
  } catch {
    // API unavailable — fall through to localStorage
  }

  // Fallback to localStorage
  if (!apiSuccess) {
    const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
    stored.push({
      ...data,
      _fallback: true,
      id: Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString()
    });
    localStorage.setItem(storageKey, JSON.stringify(stored));
  }

  showToast(successMsg);
  formElement.reset();
}

document.addEventListener('DOMContentLoaded', () => {
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    const params = new URLSearchParams(window.location.search);
    const planParam = params.get('plan');
    if (planParam) {
      const planSelect = document.getElementById('plan');
      if (planSelect) {
        const option = planSelect.querySelector(`option[value="${planParam}"]`);
        if (option) option.selected = true;
      }
    }

    bookingForm.addEventListener('submit', e => {
      e.preventDefault();
      submitForm(bookingForm, 'ezra_bookings', 'booking', 'Booking inquiry submitted! We will contact you within 24 hours.');
    });
  }

  const appForm = document.getElementById('driverAppForm');
  if (appForm) {
    appForm.addEventListener('submit', e => {
      e.preventDefault();
      submitForm(appForm, 'ezra_applications', 'application', 'Application submitted! We will review and get back to you within 48 hours.');
    });
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      submitForm(contactForm, 'ezra_messages', 'contact', 'Message sent! We will get back to you shortly.');
    });
  }
});
