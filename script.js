/********************************************************
 *  1) RANDOM DOG IMAGE LOGIC
 ********************************************************/
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

// Fetch on button click
getDogBtn.addEventListener("click", fetchRandomDogImage);
// Optionally, fetch on page load
window.addEventListener("load", fetchRandomDogImage);


/********************************************************
 *  2) DIALOG ELEMENT LOGIC
 ********************************************************/
const cityDialog = document.getElementById("cityDialog");
const closeDialogBtn = document.getElementById("closeDialogBtn");

if (closeDialogBtn) {
  closeDialogBtn.addEventListener("click", () => {
    cityDialog.close();
  });
}


/********************************************************
 *  3) PHOTOGRAPHY GALLERY: Single Row vs. Grid + Lightbox
 ********************************************************/
const photoGallery = document.getElementById("photoGallery");
const galleryToggle = document.getElementById("galleryToggle");

const photoURLs = [];
for (let i = 1; i <= 26; i++) {
  photoURLs.push(`./images/photo${i}.jpg`);
}

// Create <img> elements for each photo
photoURLs.forEach((url, index) => {
  const img = document.createElement("img");
  img.src = url;
  img.alt = `Photo ${index + 1}`;
  // On click => open Lightbox
  img.addEventListener("click", () => {
    openLightbox(index);
  });
  photoGallery.appendChild(img);
});

// Default layout is single row
photoGallery.classList.add("single-row");
let isGridView = false;

galleryToggle.addEventListener("change", (e) => {
  if (e.target.checked) {
    // Switch to grid layout
    photoGallery.classList.remove("single-row");
    photoGallery.classList.add("grid-layout");
    isGridView = true;
  } else {
    // Switch back to single-row layout
    photoGallery.classList.remove("grid-layout");
    photoGallery.classList.add("single-row");
    isGridView = false;
  }
});

/*** LIGHTBOX ***/
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");

let currentPhotoIndex = 0;

// Open
function openLightbox(index) {
  currentPhotoIndex = index;
  lightboxImg.src = photoURLs[currentPhotoIndex];
  lightbox.classList.remove("hidden");
}

// Close
lightboxClose.addEventListener("click", () => {
  lightbox.classList.add("hidden");
});

// Prev/Next by clicking arrows
lightboxPrev.addEventListener("click", showPrevPhoto);
lightboxNext.addEventListener("click", showNextPhoto);

function showPrevPhoto() {
  currentPhotoIndex = (currentPhotoIndex - 1 + photoURLs.length) % photoURLs.length;
  lightboxImg.src = photoURLs[currentPhotoIndex];
}
function showNextPhoto() {
  currentPhotoIndex = (currentPhotoIndex + 1) % photoURLs.length;
  lightboxImg.src = photoURLs[currentPhotoIndex];
}

// Keyboard left/right
document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("hidden")) {
    if (e.key === "ArrowLeft") {
      showPrevPhoto();
    } else if (e.key === "ArrowRight") {
      showNextPhoto();
    }
  }
});

// Touch swipe (mobile) in the lightbox
let touchStartX = 0;
let touchEndX = 0;

lightbox.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].clientX;
});
lightbox.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].clientX;
  const diff = touchEndX - touchStartX;
  // If swipe is significantly left or right
  if (Math.abs(diff) > 50) {
    if (diff < 0) {
      // swiped left => next photo
      showNextPhoto();
    } else {
      // swiped right => prev photo
      showPrevPhoto();
    }
  }
});


/********************************************************
 *  4) COLLAPSIBLE SIDEBAR via single "menuBtn" in header
 ********************************************************/
const sidebar = document.getElementById("sidebar");
const menuBtn = document.getElementById("menuBtn");

/* By default, #sidebar has class "expanded" from HTML. 
   We toggle between "expanded" and "collapsed" on click. */
menuBtn.addEventListener("click", () => {
  if (sidebar.classList.contains("expanded")) {
    sidebar.classList.remove("expanded");
    sidebar.classList.add("collapsed");
  } else {
    sidebar.classList.remove("collapsed");
    sidebar.classList.add("expanded");
  }
});


/********************************************************
 *  5) BACKGROUND COLOR (HSL) via colorPicker
 ********************************************************/
function hexToHSL(hex) {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex[0]+hex[0] + hex[1]+hex[1] + hex[2]+hex[2];
  }
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b),
        min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = (l > 0.5)
      ? d / (2 - max - min)
      : d / (max + min);
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
colorPicker.dispatchEvent(new Event("input")); // initialize

document.addEventListener("mousemove", (event) => {
  const x = event.clientX;
  const y = event.clientY;
  const width = window.innerWidth;
  const height = window.innerHeight;

  const saturation = 30 + ((x / width) * 50);
  const lightness  = 40 + ((y / height) * 20);

  document.body.style.backgroundColor = `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
});

// Optional: track finger movement on mobile too
// document.addEventListener("touchmove", (event) => {
//   // similar logic to mousemove
// });
