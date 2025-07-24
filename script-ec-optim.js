
// Parallax del títol
function initParallax() {
  const title = document.getElementById("siteTitle");
  if (!title) return;
  window.addEventListener("scroll", () => {
    const offset = window.scrollY * 0.5;
    title.style.transform = `translateY(${offset}px)`;
  });
}

// Scroll suau cap a "about"
function scrollToAbout() {
  const about = document.getElementById("about");
  if (about) about.scrollIntoView({ behavior: "smooth" });
}

// Botó flotant "Esteve Climent"
function initScrollButton() {
  const scrollBtn = document.createElement("h1");
  scrollBtn.id = "scrollToTop";
  scrollBtn.textContent = "Esteve Climent";
  scrollBtn.className = "site-title";
  scrollBtn.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
  scrollBtn.style.display = "none";
  document.body.appendChild(scrollBtn);

  let lastScrollTop = 0;
  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    scrollBtn.style.display = currentScroll < lastScrollTop && currentScroll > 300 ? "block" : "none";
    lastScrollTop = currentScroll;
  });
}

// Previsualització flotant per desktop
function initFloatingPreview() {
  if (window.matchMedia("(pointer: coarse)").matches) return;

  const rows = document.querySelectorAll('.text-row');
  const preview = document.getElementById('floating-preview');
  let currentMedia = null, textTimeout = null, mediaTimeout = null;

  rows.forEach(row => {
    const imgUrl = row.dataset.img;
    const videoUrl = row.dataset.video;

    row.addEventListener('mouseenter', () => {
      clearTimeout(textTimeout);
      clearTimeout(mediaTimeout);
      row.dataset.originalColor = row.style.color;

      textTimeout = setTimeout(() => row.style.color = 'transparent', 50);
      mediaTimeout = setTimeout(() => {
        if (currentMedia) currentMedia.remove();

        const rect = row.getBoundingClientRect();
        const scrollY = window.scrollY;
        const topPosition = rect.top + scrollY + rect.height / 2;

        currentMedia = imgUrl ? document.createElement('img') : document.createElement('video');
        currentMedia.src = imgUrl || videoUrl;
        if (videoUrl) {
          Object.assign(currentMedia, { autoplay: true, loop: true, muted: true, playsInline: true });
        }
        currentMedia.style.opacity = '1';
        preview.style.top = `${topPosition}px`;
        preview.innerHTML = '';
        preview.appendChild(currentMedia);
      }, 300);
    });

    row.addEventListener('mouseleave', () => {
      clearTimeout(textTimeout);
      clearTimeout(mediaTimeout);
      row.style.color = row.dataset.originalColor || '#000';
      if (currentMedia) {
        currentMedia.style.opacity = '0';
        const temp = currentMedia;
        setTimeout(() => {
          if (preview.contains(temp)) temp.remove();
          if (currentMedia === temp) currentMedia = null;
        }, 400);
      }
    });
  });
}

// Inicialització unificada
function initializeECInteractions() {
  initParallax();
  initScrollButton();
  initFloatingPreview();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeECInteractions);
} else {
  initializeECInteractions();
}
