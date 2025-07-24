<script>
document.addEventListener("DOMContentLoaded", () => {
  // Parallax del títol
  const title = document.getElementById("siteTitle");
  window.addEventListener("scroll", () => {
    if (title) {
      const offset = window.scrollY * 0.5;
      title.style.transform = `translateY(${offset}px)`;
    }
  });

  // Scroll suau cap a #about
  const aboutLinks = document.querySelectorAll('a[href="#about"]');
  aboutLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const about = document.getElementById("about");
      if (about) {
        about.scrollIntoView({ behavior: "smooth" });
        history.replaceState(null, "", window.location.pathname);
      }
    });
  });

  // Botó flotant “Esteve Climent”
  const scrollBtn = document.createElement("h1");
  scrollBtn.id = "scrollToTop";
  scrollBtn.textContent = "Esteve Climent";
  scrollBtn.className = "site-title";
  scrollBtn.style.display = "none";
  scrollBtn.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
  document.body.appendChild(scrollBtn);

  let lastScrollTop = 0;
  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (currentScroll < lastScrollTop && currentScroll > 300) {
      scrollBtn.style.display = "block";
    } else {
      scrollBtn.style.display = "none";
    }
    lastScrollTop = currentScroll;
  });

  // Previsualització d’imatges (només desktop)
  const isMobile = window.matchMedia("(pointer: coarse)").matches;
  if (!isMobile) {
    setupHoverPreview();
  }

  // Reconfigura les previsualitzacions si es canvia de pàgina via Cargo SPA
  document.addEventListener("cargo:page-load", () => {
    if (!isMobile) {
      setupHoverPreview();
    }
  });

  function setupHoverPreview() {
    const rows = document.querySelectorAll('.text-row');
    const preview = document.getElementById('floating-preview');
    let currentMedia = null;
    let textTimeout = null;
    let mediaTimeout = null;

    rows.forEach(row => {
      const imgUrl = row.dataset.img;
      const videoUrl = row.dataset.video;

      row.addEventListener('mouseenter', () => {
        clearTimeout(textTimeout);
        clearTimeout(mediaTimeout);

        row.dataset.originalColor = row.style.color;

        textTimeout = setTimeout(() => {
          row.style.color = 'transparent';
        }, 50);

        mediaTimeout = setTimeout(() => {
          if (currentMedia) {
            currentMedia.remove();
            currentMedia = null;
          }

          const rect = row.getBoundingClientRect();
          const scrollY = window.scrollY;
          const topPosition = rect.top + scrollY + rect.height / 2;

          if (imgUrl) {
            currentMedia = document.createElement('img');
            currentMedia.src = imgUrl;
          } else if (videoUrl) {
            currentMedia = document.createElement('video');
            currentMedia.src = videoUrl;
            currentMedia.autoplay = true;
            currentMedia.loop = true;
            currentMedia.muted = true;
            currentMedia.playsInline = true;
          }

          if (currentMedia) {
            currentMedia.style.opacity = '1';
            preview.style.top = `${topPosition}px`;
            preview.innerHTML = '';
            preview.appendChild(currentMedia);
          }
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
            if (temp && preview.contains(temp)) {
              temp.remove();
              if (currentMedia === temp) currentMedia = null;
            }
          }, 400);
        }
      });
    });
  }
});
</script>
