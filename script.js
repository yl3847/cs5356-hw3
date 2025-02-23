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
for (let i = 1; i <= 26; i++) {
  photoURLs.push(`./images/photo${i}.jpg`);
}

photoURLs.forEach((url, index) => {
  const img = document.createElement("img");
  img.src = url;
  img.alt = `Photo ${index + 1}`;
  img.addEventListener("click", () => {
    openLightbox(index);
  });
  photoGallery.appendChild(img);
});

photoGallery.classList.add("single-row");
let isGridView = false;

galleryToggle.addEventListener("change", (e) => {
  if (e.target.checked) {
    photoGallery.classList.remove("single-row");
    photoGallery.classList.add("grid-layout");
    isGridView = true;
  } else {
    photoGallery.classList.remove("grid-layout");
    photoGallery.classList.add("single-row");
    isGridView = false;
  }
});

/*** LIGHTBOX LOGIC ***/
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");

let currentPhotoIndex = 0;

function openLightbox(index) {
  currentPhotoIndex = index;
  lightboxImg.src = photoURLs[currentPhotoIndex];
  lightbox.classList.remove("hidden");
}

lightboxClose.addEventListener("click", () => {
  lightbox.classList.add("hidden");
});

lightboxPrev.addEventListener("click", () => {
  currentPhotoIndex = (currentPhotoIndex - 1 + photoURLs.length) % photoURLs.length;
  lightboxImg.src = photoURLs[currentPhotoIndex];
});
lightboxNext.addEventListener("click", () => {
  currentPhotoIndex = (currentPhotoIndex + 1) % photoURLs.length;
  lightboxImg.src = photoURLs[currentPhotoIndex];
});

// Keyboard left/right arrow for lightbox
document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("hidden")) {
    if (e.key === "ArrowLeft") {
      currentPhotoIndex = (currentPhotoIndex - 1 + photoURLs.length) % photoURLs.length;
      lightboxImg.src = photoURLs[currentPhotoIndex];
    } else if (e.key === "ArrowRight") {
      currentPhotoIndex = (currentPhotoIndex + 1) % photoURLs.length;
      lightboxImg.src = photoURLs[currentPhotoIndex];
    }
  }
});


/********************************************************
 *  4) COLLAPSIBLE SIDEBAR
 ********************************************************/
const sidebar = document.getElementById("sidebar");
const toggleSidebarBtn = document.getElementById("toggleSidebarBtn");
const unfoldSidebarBtn = document.getElementById("unfoldSidebarBtn");

toggleSidebarBtn.addEventListener("click", () => {
  // Hide the "expanded" state => become "collapsed"
  sidebar.classList.remove("expanded");
  sidebar.classList.add("collapsed");

  // Show the unfold button on desktop
  unfoldSidebarBtn.classList.remove("hidden");
});

unfoldSidebarBtn.addEventListener("click", () => {
  // Hide the "collapsed" state => become "expanded"
  sidebar.classList.remove("collapsed");
  sidebar.classList.add("expanded");

  // Hide the unfold button on desktop
  unfoldSidebarBtn.classList.add("hidden");
});


/********************************************************
 *  5) BACKGROUND COLOR: Single Hue (HSL) via colorPicker
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
    s = (l > 0.5) ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  s *= 100;
  l *= 100;
  return { 
    h: Math.round(h),
    s: Math.round(s),
    l: Math.round(l)
  };
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
