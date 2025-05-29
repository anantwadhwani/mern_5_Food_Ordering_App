// Omnifood JavaScript
'use strict';

// Set current year for copyright
const yearEl = document.querySelector('.year');
const currentYear = new Date().getFullYear();
yearEl.textContent = currentYear;

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
// Reveal sections on scroll
///////////////////////////////////////////////////////////
const allSections = document.querySelectorAll('.section');
console.log(allSections);

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