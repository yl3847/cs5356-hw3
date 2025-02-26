/**
* 1) RANDOM DOG IMAGE LOGIC
**/
const dogImage = document.getElementById("dogImage");
const getDogBtn = document.getElementById("getDogBtn");
function fetchRandomDogImage() {
  fetch("https://dog.ceo/api/breeds/image/random")
    .then((response) => response.json())
    .then((data) => {
      dogImage.src = data.message;
    })
    .catch((error) => {
      console.error("Error fetching dog image:", error);
    });
}
getDogBtn.addEventListener("click", fetchRandomDogImage);
window.addEventListener("load", fetchRandomDogImage);

/**
* 2) DIALOG ELEMENT LOGIC
**/
const cityDialog = document.getElementById("cityDialog");
const closeDialogBtn = document.getElementById("closeDialogBtn");
if (closeDialogBtn) {
  closeDialogBtn.addEventListener("click", () => {
    cityDialog.close();
  });
}

/**
* 3) PHOTOGRAPHY GALLERY: Single Row vs. Grid + Lightbox
**/
const photoGallery = document.getElementById("photoGallery");
const galleryToggle = document.getElementById("galleryToggle");
const photoURLs = [];
for (let i = 1; i <=68; i++) {
  photoURLs.push(`./images/photo${i}.jpg`);
}
// Create images with lazy loading
photoURLs.forEach((url, index) => {
  const img = document.createElement("img");
  img.alt = `Photo ${index + 1}`;
  
  // Add native lazy loading attribute
  img.loading = "lazy";
  
  // For browsers that support it, use data-src pattern for Intersection Observer
  img.dataset.src = url;
  
  // Add placeholder or low-resolution image until loaded
  img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' %3E%3Crect width='400' height='300' fill='%23f0f0f0'/%3E%3C/svg%3E";
  
  // Add event listener for lightbox
  img.addEventListener("click", () => {
    openLightbox(index);
  });
  
  // Add class for the IntersectionObserver
  img.classList.add("lazy-image");
  
  photoGallery.appendChild(img);
});
// Default single-row
photoGallery.classList.add("single-row");
let isGridView = false;
galleryToggle.addEventListener("change", () => {
  if (galleryToggle.checked) {
    photoGallery.classList.remove("single-row");
    photoGallery.classList.add("grid-layout");
    photoGallery.scrollLeft = 0; // Reset scroll position
    isGridView = true;
  } else {
    photoGallery.classList.remove("grid-layout");
    photoGallery.classList.add("single-row");
    isGridView = false;
  }
});

/**
* 4) LIGHTBOX
**/
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");
// Zoom controls
const zoomInBtn = document.getElementById("zoomInBtn");
const zoomOutBtn = document.getElementById("zoomOutBtn");
let zoomFactor = 1; // default scale
let currentPhotoIndex = 0;
function openLightbox(index) {
  currentPhotoIndex = index;
  zoomFactor = 1; // reset zoom on open/switch
  applyZoom();
  lightboxImg.src = photoURLs[currentPhotoIndex];
  lightbox.classList.remove("hidden");
}
lightboxClose.addEventListener("click", () => {
  lightbox.classList.add("hidden");
});
function showPrevPhoto() {
  currentPhotoIndex = (currentPhotoIndex - 1 + photoURLs.length) % photoURLs.length;
  zoomFactor = 1; // reset zoom when switching
  applyZoom();
  lightboxImg.src = photoURLs[currentPhotoIndex];
}
function showNextPhoto() {
  currentPhotoIndex = (currentPhotoIndex + 1) % photoURLs.length;
  zoomFactor = 1; // reset zoom when switching
  applyZoom();
  lightboxImg.src = photoURLs[currentPhotoIndex];
}
lightboxPrev.addEventListener("click", showPrevPhoto);
lightboxNext.addEventListener("click", showNextPhoto);
// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("hidden")) {
    if (e.key === "ArrowLeft") showPrevPhoto();
    else if (e.key === "ArrowRight") showNextPhoto();
  }
});
// Swipe navigation
let touchStartX = 0;
let touchEndX = 0;
lightbox.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].clientX;
});
lightbox.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].clientX;
  const diff = touchEndX - touchStartX;
  if (Math.abs(diff) > 50) {
    if (diff < 0) showNextPhoto();
    else showPrevPhoto();
  }
});
// Zoom in/out
zoomInBtn.addEventListener("click", () => {
  zoomFactor += 0.2;
  if (zoomFactor > 5) zoomFactor = 5;
  applyZoom();
});
zoomOutBtn.addEventListener("click", () => {
  zoomFactor -= 0.2;
  if (zoomFactor < 0.2) zoomFactor = 0.2;
  applyZoom();
});
function applyZoom() {
  lightboxImg.style.transform = `scale(${zoomFactor})`;
}

/**
* 5) COLLAPSIBLE SIDEBAR (MENU BUTTON)
**/
const sidebar = document.getElementById("sidebar");
const menuBtn = document.getElementById("menuBtn");
menuBtn.addEventListener("click", () => {
  if (sidebar.classList.contains("expanded")) {
    sidebar.classList.remove("expanded");
    sidebar.classList.add("collapsed");
  } else {
    sidebar.classList.remove("collapsed");
    sidebar.classList.add("expanded");
  }
  menuBtn.blur();
});
// On smartphone: fold sidebar by swiping left
let sideStartX = 0;
sidebar.addEventListener("touchstart", (e) => {
  if (sidebar.classList.contains("expanded")) {
    sideStartX = e.changedTouches[0].clientX;
  }
});
sidebar.addEventListener("touchend", (e) => {
  if (!sidebar.classList.contains("expanded")) return;
  const sideEndX = e.changedTouches[0].clientX;
  const diff = sideEndX - sideStartX;
  if (diff < -40) {
    sidebar.classList.remove("expanded");
    sidebar.classList.add("collapsed");
  }
});

/**
* 6) BACKGROUND COLOR (HSL) via colorPicker
**/
function hexToHSL(hex) {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex[0]+hex[0] + hex[1]+hex[1] + hex[2]+hex[2];
  }
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  s *= 100;
  l *= 100;
  return { h: Math.round(h), s: Math.round(s), l: Math.round(l) };
}
let baseHue = 0;
const colorPicker = document.getElementById("colorPicker");
colorPicker.addEventListener("input", (e) => {
  const { h } = hexToHSL(e.target.value);
  baseHue = h;
});
colorPicker.dispatchEvent(new Event("input"));
document.addEventListener("mousemove", (event) => {
  const x = event.clientX;
  const y = event.clientY;
  const width = window.innerWidth;
  const height = window.innerHeight;
  const saturation = 30 + ((x / width) * 50);
  const lightness = 40 + ((y / height) * 20);
  document.body.style.backgroundColor = `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
});

/**
* 7) ACTIVE MENU HIGHLIGHTING - NEW
**/
document.addEventListener('DOMContentLoaded', function() {
  const sections = document.querySelectorAll('.section-container');
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Create a map of section IDs to their corresponding nav links
  const sectionToNavMap = {};
  navLinks.forEach(link => {
    const sectionId = link.getAttribute('href').substring(1);
    sectionToNavMap[sectionId] = link;
  });
  
  // Options for the Intersection Observer
  const observerOptions = {
    root: null, // Use the viewport as the root
    rootMargin: '-20% 0px -70% 0px', // Adjust to control when a section is considered "active"
    threshold: 0 // Trigger when any part of the element is visible
  };
  
  // Callback function for the Intersection Observer
  const observerCallback = (entries) => {
    entries.forEach(entry => {
      // Add active-section class to the section itself for visual indication
      if (entry.isIntersecting) {
        entry.target.classList.add('active-section');
        
        // Find the corresponding nav link and add the active class
        const sectionId = entry.target.id;
        const activeLink = sectionToNavMap[sectionId];
        
        if (activeLink) {
          // Remove active class from all nav links
          navLinks.forEach(link => link.classList.remove('active'));
          
          // Add active class to the current nav link
          activeLink.classList.add('active');
        }
      } else {
        // Remove active-section class when section is not in view
        entry.target.classList.remove('active-section');
      }
    });
  };
  
  // Create the Intersection Observer
  const observer = new IntersectionObserver(observerCallback, observerOptions);
  
  // Observe all sections
  sections.forEach(section => {
    observer.observe(section);
  });
  
  // Handle click events on nav links to add active class immediately
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Remove active class from all links
      navLinks.forEach(navLink => navLink.classList.remove('active'));
      
      // Add active class to clicked link
      this.classList.add('active');
    });
  });
});

/**
* 8) SKILLS SECTION ANIMATION - NEW
**/
document.addEventListener('DOMContentLoaded', function() {
  // Find all skill bars
  const skillBars = document.querySelectorAll('.skill-bar');
  
  // Function to animate skill bars when they come into view
  const animateSkillBars = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Get the width value from the inline style
        const targetWidth = entry.target.style.width;
        
        // Reset width to 0 and then animate to target
        entry.target.style.width = '0%';
        
        // Use setTimeout to ensure there's a delay before animation starts
        // This allows the browser to register the 0% width first
        setTimeout(() => {
          entry.target.style.width = targetWidth;
        }, 50);
        
        // Once animated, no need to observe this element anymore
        observer.unobserve(entry.target);
      }
    });
  };
  
  // Create observer for skill bars
  const skillObserver = new IntersectionObserver(animateSkillBars, {
    threshold: 0.1 // Trigger when at least 10% of the element is visible
  });
  
  // Start observing each skill bar
  skillBars.forEach(bar => {
    skillObserver.observe(bar);
  });
  
  // Animate skill tags when they come into view
  const skillTags = document.querySelectorAll('.skill-tag');
  const animateSkillTags = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  };
  
  // Create observer for skill tags
  const tagObserver = new IntersectionObserver(animateSkillTags, {
    threshold: 0.1
  });
  
  // Set initial state and start observing each skill tag
  skillTags.forEach((tag, index) => {
    // Set initial state - staggered opacity and transform
    tag.style.opacity = '0';
    tag.style.transform = 'translateY(20px)';
    tag.style.transitionDelay = `${index * 50}ms`;
    tag.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    
    tagObserver.observe(tag);
  });
});

/**
* 9) LAZY LOADING IMPLEMENTATION
**/
document.addEventListener('DOMContentLoaded', function() {
  // Check for IntersectionObserver support
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.dataset.src;
          
          if (src) {
            img.src = src;
            img.classList.add('loaded');
            
            // Once the image is loaded, we don't need to observe it anymore
            observer.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '200px 0px', // Start loading images when they're 200px from entering the viewport
      threshold: 0.01
    });
    
    // Target all images with the lazy-image class
    document.querySelectorAll('.lazy-image').forEach(img => {
      imageObserver.observe(img);
    });
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    // Just load all images immediately
    document.querySelectorAll('.lazy-image').forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
    });
  }
});

/**
* 10) SECTION REVEAL ANIMATION
**/
document.addEventListener("DOMContentLoaded", function() {
  const sections = document.querySelectorAll("section");
  const observerOptions = {
    // Lower threshold so that on mobile the section is considered out of view sooner.
    threshold: 0.05
  };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      // If it's the photography section and grid mode is active, always show it.
      if (
        entry.target.id === "photography" &&
        document.getElementById("photoGallery").classList.contains("grid-layout")
      ) {
        entry.target.classList.add("reveal");
      } else {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal");
        } else {
          entry.target.classList.remove("reveal");
        }
      }
    });
  }, observerOptions);
  sections.forEach(section => {
    observer.observe(section);
  });
});

// Auto-scroll photo gallery when in non-grid (single-row) mode
setInterval(function() {
  const gallery = document.getElementById("photoGallery");
  if (gallery && gallery.classList.contains("single-row")) {
    // Check if we've reached the end; if so, reset to beginning.
    if (gallery.scrollLeft >= gallery.scrollWidth - gallery.clientWidth) {
      gallery.scrollLeft = 0;
    } else {
      gallery.scrollLeft += 1; // Adjust this value for desired speed.
    }
  }
}, 50); // Runs every 50ms; adjust interval as needed.

/**
* TOGGLE "READ MORE" DETAILS
**/
document.querySelectorAll('.toggle-details').forEach(button => {
  button.addEventListener('click', () => {
    const details = button.nextElementSibling; // The .project-details div
    if (details.classList.contains('hidden')) {
      details.classList.remove('hidden');
      button.textContent = "Show Less";
    } else {
      details.classList.add('hidden');
      button.textContent = "Read More";
    }
  });
});

/**
* TIMELINE ITEMS REVEAL (Intersection Observer)
**/
document.addEventListener('DOMContentLoaded', function() {
  const timelineItems = document.querySelectorAll('.timeline-item');
  const observerOptions = {
    threshold: 0.2
  };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add .reveal to trigger the CSS transition
        entry.target.classList.add('reveal');
      } else {
        // Remove it if you want the animation to replay
        // or keep it if you only want the animation once
        entry.target.classList.remove('reveal');
      }
    });
  }, observerOptions);
  timelineItems.forEach(item => {
    observer.observe(item);
  });
});

/**
* HERO: Smooth Scroll to "About" 
**/
const heroCtaBtn = document.getElementById("heroCtaBtn");
if (heroCtaBtn) {
  heroCtaBtn.addEventListener("click", () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  });
}

/**
* OPTIONAL: Typewriter Effect for Hero H2
**/
const heroTypewriterEl = document.getElementById("heroTypewriter");
if (heroTypewriterEl) {
  const heroText = "Hello, I'm Yize Lu, a full-stack developer in training…";
  let idx = 0;
  function typeChar() {
    heroTypewriterEl.textContent = heroText.slice(0, idx);
    idx++;
    if (idx <= heroText.length) {
      setTimeout(typeChar, 50); // Speed of typing (milliseconds)
    }
  }
  // Initialize if the element is on the page
  typeChar();
}

/**
* BACK TO TOP BUTTON
**/
document.addEventListener('DOMContentLoaded', function() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  
  // Function to check scroll position and show/hide button
  function handleScroll() {
    // Show button when scrolled down 300px from top
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }
  
  // Add scroll event listener
  window.addEventListener('scroll', handleScroll);
  
  // Scroll to top when button is clicked
  backToTopBtn.addEventListener('click', function() {
    // Smooth scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // Initial check in case page is refreshed mid-scroll
  handleScroll();
});