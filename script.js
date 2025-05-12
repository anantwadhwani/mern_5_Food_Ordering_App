// Omnifood JavaScript
'use strict';

// Set current year for copyright
const yearEl = document.querySelector('.year');
const currentYear = new Date().getFullYear();
yearEl.textContent = currentYear;

///////////////////////////////////////////////////////////
// Mobile Navigation
///////////////////////////////////////////////////////////
const btnNavEl = document.querySelector('.btn-mobile-nav');
const headerEl = document.querySelector('.header');

btnNavEl.addEventListener('click', function() {
  headerEl.classList.toggle('nav-open');
});

///////////////////////////////////////////////////////////
// Smooth Scrolling Animation
///////////////////////////////////////////////////////////
const allLinks = document.querySelectorAll('a:link');

allLinks.forEach(function(link) {
  link.addEventListener('click', function(e) {
    const href = link.getAttribute('href');
    
    // Scroll back to top
    if (href === '#') {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
    
    // Scroll to other links
    if (href !== '#' && href.startsWith('#')) {
      e.preventDefault();
      const sectionEl = document.querySelector(href);
      sectionEl.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Close mobile navigation
    if (link.classList.contains('main-nav-link')) {
      headerEl.classList.remove('nav-open');
    }
  });
});

///////////////////////////////////////////////////////////
// Sticky Navigation
///////////////////////////////////////////////////////////
const sectionHeroEl = document.querySelector('.section-hero');

const obs = new IntersectionObserver(
  function(entries) {
    const ent = entries[0];
    
    if (!ent.isIntersecting) {
      document.body.classList.add('sticky');
    } else {
      document.body.classList.remove('sticky');
    }
  },
  {
    // In the viewport
    root: null,
    threshold: 0,
    rootMargin: '-80px'
  }
);
obs.observe(sectionHeroEl);

///////////////////////////////////////////////////////////
// Testimonial Slider
///////////////////////////////////////////////////////////
const testimonialsContainer = document.querySelector('.testimonials');
const testimonials = document.querySelectorAll('.testimonial');
const dotsContainer = document.querySelector('.dots');

// Create dots for slider
if (testimonialsContainer && testimonials.length > 0) {
  const createDots = function() {
    testimonials.forEach(function(_, i) {
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dot" data-slide="${i}"></button>`
      );
    });
  };
  
  // Activate dot
  const activateDot = function(slide) {
    document
      .querySelectorAll('.dot')
      .forEach(dot => dot.classList.remove('dot--active'));
    
    document
      .querySelector(`.dot[data-slide="${slide}"]`)
      .classList.add('dot--active');
  };
  
  // Go to slide
  const goToSlide = function(slide) {
    testimonials.forEach(
      (t, i) => (t.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };
  
  // Initialize slider
  const initSlider = function() {
    createDots();
    activateDot(0);
    goToSlide(0);
  };
  
  initSlider();
  
  // Event handlers
  dotsContainer.addEventListener('click', function(e) {
    if (e.target.classList.contains('dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
}

///////////////////////////////////////////////////////////
// Reveal sections on scroll
///////////////////////////////////////////////////////////
const allSections = document.querySelectorAll('.section');

const revealSection = function(entries, observer) {
  const [entry] = entries;
  
  if (!entry.isIntersecting) return;
  
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15
});

allSections.forEach(function(section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

///////////////////////////////////////////////////////////
// Form validation
///////////////////////////////////////////////////////////
const form = document.querySelector('.cta-form');

if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nameInput = form.querySelector('input[name="full-name"]');
    const emailInput = form.querySelector('input[name="email"]');
    
    let isValid = true;
    
    // Simple validation
    if (nameInput && nameInput.value.trim() === '') {
      isValid = false;
      nameInput.classList.add('error');
    } else if (nameInput) {
      nameInput.classList.remove('error');
    }
    
    if (emailInput && !validateEmail(emailInput.value)) {
      isValid = false;
      emailInput.classList.add('error');
    } else if (emailInput) {
      emailInput.classList.remove('error');
    }
    
    if (isValid) {
      // Submit the form or show success message
      form.innerHTML = `<p class="success-message">Thank you! Your submission has been received!</p>`;
    }
  });
  
  // Helper function to validate email
  function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
}

///////////////////////////////////////////////////////////
// Lazy loading images
///////////////////////////////////////////////////////////
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function(entries, observer) {
  const [entry] = entries;
  
  if (!entry.isIntersecting) return;
  
  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;
  
  entry.target.addEventListener('load', function() {
    entry.target.classList.remove('lazy-img');
  });
  
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px'
});

imgTargets.forEach(img => imgObserver.observe(img));

///////////////////////////////////////////////////////////
// Modal window
///////////////////////////////////////////////////////////
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

if (modal && overlay) {
  const openModal = function(e) {
    e.preventDefault();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
  };
  
  const closeModal = function() {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
  };
  
  btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
  btnCloseModal.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
}

///////////////////////////////////////////////////////////
// Pricing toggle (Monthly/Yearly)
///////////////////////////////////////////////////////////
const pricingToggle = document.querySelector('.pricing-toggle');
const monthlyPrices = document.querySelectorAll('.price-monthly');
const yearlyPrices = document.querySelectorAll('.price-yearly');

if (pricingToggle) {
  pricingToggle.addEventListener('change', function() {
    if (this.checked) {
      // Show yearly prices
      monthlyPrices.forEach(el => el.classList.add('hidden'));
      yearlyPrices.forEach(el => el.classList.remove('hidden'));
    } else {
      // Show monthly prices
      monthlyPrices.forEach(el => el.classList.remove('hidden'));
      yearlyPrices.forEach(el => el.classList.add('hidden'));
    }
  });
}

///////////////////////////////////////////////////////////
// FAQ accordion
///////////////////////////////////////////////////////////
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  
  question.addEventListener('click', function() {
    // Toggle current item
    item.classList.toggle('open');
    
    // Close other items
    faqItems.forEach(otherItem => {
      if (otherItem !== item && otherItem.classList.contains('open')) {
        otherItem.classList.remove('open');
      }
    });
  });
});

///////////////////////////////////////////////////////////
// Cookie consent
///////////////////////////////////////////////////////////
const cookieContainer = document.querySelector('.cookie-consent');
const cookieButton = document.querySelector('.cookie-btn');

if (cookieContainer && cookieButton) {
  // Check if user has already accepted cookies
  if (!localStorage.getItem('cookieConsent')) {
    setTimeout(() => {
      cookieContainer.classList.add('show');
    }, 2000);
  }
  
  cookieButton.addEventListener('click', () => {
    cookieContainer.classList.remove('show');
    localStorage.setItem('cookieConsent', 'true');
  });
}
