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

getDogBtn.addEventListener("click", fetchRandomDogImage);
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
for (let i = 1; i <=68; i++) {
  photoURLs.push(`./images/photo${i}.jpg`);
}

// Create images
photoURLs.forEach((url, index) => {
  const img = document.createElement("img");
  img.src = url;
  img.alt = `Photo ${index + 1}`;
  img.addEventListener("click", () => {
    openLightbox(index);
  });
  photoGallery.appendChild(img);
});

// Default single-row
photoGallery.classList.add("single-row");
let isGridView = false;

galleryToggle.addEventListener("change", () => {
  if (galleryToggle.checked) {
    photoGallery.classList.remove("single-row");
    photoGallery.classList.add("grid-layout");
    isGridView = true;
  } else {
    photoGallery.classList.remove("grid-layout");
    photoGallery.classList.add("single-row");
    isGridView = false;
  }
});

/********************************************************
 *  4) LIGHTBOX
 ********************************************************/
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

/********************************************************
 *  5) COLLAPSIBLE SIDEBAR (MENU BUTTON)
 ********************************************************/
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

/********************************************************
 *  6) BACKGROUND COLOR (HSL) via colorPicker
 ********************************************************/
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
  const lightness  = 40 + ((y / height) * 20);

  document.body.style.backgroundColor = `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
});
