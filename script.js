/**********************************/
/*     COLLAPSIBLE SIDEBAR LOGIC  */
/**********************************/
const sidebar = document.getElementById("sidebar");
const toggleSidebarBtn = document.getElementById("toggleSidebarBtn");
const unfoldSidebarBtn = document.getElementById("unfoldSidebarBtn");

toggleSidebarBtn.addEventListener("click", () => {
  sidebar.classList.remove("expanded");
  sidebar.classList.add("collapsed");
  unfoldSidebarBtn.classList.remove("hidden"); 
});

unfoldSidebarBtn.addEventListener("click", () => {
  sidebar.classList.remove("collapsed");
  sidebar.classList.add("expanded");
  unfoldSidebarBtn.classList.add("hidden");
});

/**********************************/
/*       RANDOM DOG IMAGE LOGIC   */
/**********************************/
const dogImage = document.getElementById("dogImage");
const getDogBtn = document.getElementById("getDogBtn");

// Fetch a random dog image from the API
function fetchRandomDogImage() {
  fetch("https://dog.ceo/api/breeds/image/random")
    .then(response => response.json())
    .then(data => {
      dogImage.src = data.message;
    })
    .catch(error => {
      console.error("Error fetching dog image:", error);
    });
}

getDogBtn.addEventListener("click", fetchRandomDogImage);
// Optionally fetch one on page load
window.addEventListener("load", fetchRandomDogImage);

/**********************************/
/*     DIALOG ELEMENT (CITY)      */
/**********************************/
const cityDialog = document.getElementById("cityDialog");
const closeDialogBtn = document.getElementById("closeDialogBtn");
if (closeDialogBtn) {
  closeDialogBtn.addEventListener("click", () => {
    cityDialog.close();
  });
}

/**********************************/
/*     PHOTO GALLERY & LIGHTBOX   */
/**********************************/
// Photo container
const photoGallery = document.getElementById("photoGallery");
// Toggle layout button
const toggleGalleryLayoutBtn = document.getElementById("toggleGalleryLayoutBtn");

// Let’s load your local photos from photo1 to photo26
for (let i = 1; i <= 26; i++) {
  const img = document.createElement("img");
  img.src = `./images/photo${i}.jpg`;
  photoGallery.appendChild(img);
}

// Default layout: single-row
photoGallery.classList.add("single-row");
toggleGalleryLayoutBtn.textContent = "Show All My Photos";

toggleGalleryLayoutBtn.addEventListener("click", () => {
  if (photoGallery.classList.contains("single-row")) {
    // Switch to grid
    photoGallery.classList.remove("single-row");
    photoGallery.classList.add("grid");
    toggleGalleryLayoutBtn.textContent = "Show Single Row";
  } else {
    // Switch back to single-row
    photoGallery.classList.remove("grid");
    photoGallery.classList.add("single-row");
    toggleGalleryLayoutBtn.textContent = "Show All My Photos";
  }
});

// LIGHTBOX
const lightbox = document.getElementById("lightbox");
const lightboxImg = lightbox.querySelector("img");
const lightboxCloseBtn = document.getElementById("lightboxCloseBtn");

// When user clicks any photo in gallery, open lightbox
photoGallery.addEventListener("click", (e) => {
  if (e.target.tagName === "IMG") {
    lightboxImg.src = e.target.src;
    lightbox.classList.remove("hidden");
  }
});

// Close button in lightbox
lightboxCloseBtn.addEventListener("click", () => {
  lightbox.classList.add("hidden");
});

/**********************************/
/*  BACKGROUND COLOR (SAME HUE)   */
/**********************************/
// Convert hex => HSL
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
    h = h * 60;
  }
  s = s * 100;
  l = l * 100;
  return { 
    h: Math.round(h),
    s: Math.round(s),
    l: Math.round(l)
  };
}

let baseHue = 0;
const colorPicker = document.getElementById("colorPicker");

// Update baseHue when user picks a new color
colorPicker.addEventListener("input", (e) => {
  const { h } = hexToHSL(e.target.value);
  baseHue = h;
});
// Initialize baseHue from default color
colorPicker.dispatchEvent(new Event("input"));

// Move saturation & lightness with mouse
document.addEventListener("mousemove", (event) => {
  const x = event.clientX;
  const y = event.clientY;
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Example ranges for mild variation
  const saturation = 30 + ((x / width) * 50);  // 30..80
  const lightness  = 40 + ((y / height) * 20); // 40..60

  document.body.style.backgroundColor = `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
});
