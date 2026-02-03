document.addEventListener("DOMContentLoaded", () => {
  window.scrollTo(0, 0); 
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  const songForm = document.getElementById("songForm");
  const occasionForm = document.getElementById("occasionForm");
  const nameInput = document.getElementById("personName");
  const formSection = document.getElementById("formSection");
  const successSection = document.getElementById("successSection");
  const scrollIndicator = document.querySelector(".scroll-down");
  const aboutSection = document.querySelector(".about-section");
  const scrollText = scrollIndicator?.querySelector("span");
  const loadingOverlay = document.getElementById("loadingOverlay");
  const openOccasion = document.getElementById("openOccasion");
  const closeOccasion = document.getElementById("closeOccasion");
  const occasionOverlay = document.getElementById("occasionOverlay");

  let cachedName = "";

  /* ---------------- NAME CACHE ---------------- */
  if (nameInput) {
    nameInput.addEventListener("input", () => {
      cachedName = nameInput.value.trim();
    });
  }

  /* ---------------- MODAL LOGIC ---------------- */
  if (openOccasion) {
    openOccasion.addEventListener("click", () => {
      // Sync values from main form to modal before opening
      document.getElementById("occ_your_name").value = nameInput.value;
      document.getElementById("occ_song").value = songForm.querySelector('input[name="entry.1776646019"]').value;
      document.getElementById("occ_artist").value = songForm.querySelector('input[name="entry.181281543"]').value;

      occasionOverlay.classList.remove("hidden");
      occasionOverlay.style.opacity = "0";
      requestAnimationFrame(() => {
        occasionOverlay.style.transition = "opacity 0.3s ease";
        occasionOverlay.style.opacity = "1";
        occasionOverlay.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

if (closeOccasion) {
    closeOccasion.addEventListener("click", () => {
      // 1. Scroll the main window back to the absolute top
      window.scrollTo({ top: 0, behavior: "smooth" });

      // 2. Fade out the modal
      occasionOverlay.style.opacity = "0";
      
      // 3. Hide it after the fade animation finishes
      setTimeout(() => {
        occasionOverlay.classList.add("hidden");
      }, 400);
    });
  }

  /* ---------------- SUCCESS UI ---------------- */
  function showSuccessUI(displayName) {
    if (loadingOverlay) loadingOverlay.classList.add("hidden");
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (scrollIndicator) scrollIndicator.style.display = "none";
    if (aboutSection) aboutSection.style.display = "none";
    
    occasionOverlay.classList.add("hidden");
    formSection.style.display = "none";

    const msg = displayName 
      ? `Thanks, ${displayName}! We've got your request and shout-out. 🎤🎶`
      : `Thanks for the suggestion! Get ready! 🎤🎸`;

    successSection.innerHTML = `
      <h2>✅ Request Received!</h2>
      <p>${msg}</p>
      <button id="backBtn" class="back-btn">⬅ Back</button>
      <div class="socials">
        <a href="https://instagram.com/philbertbrothers" target="_blank" class="social-btn insta">
          📸 Follow on Instagram
        </a>
      </div>
    `;

    successSection.style.display = "flex";
    setTimeout(() => successSection.classList.add("show"), 10);

    const backBtn = document.getElementById("backBtn");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        location.reload(); // Cleanest way to reset everything for a new request
      });
    }

    launchConfetti();
    songForm.reset();
    occasionForm.reset();
    cachedName = "";
  }

  /* ---------------- SUBMISSION LOGIC ---------------- */
  
  // Listen for the iframe to load (this means Google received the data)
  const iframe = document.getElementsByName("hidden_iframe")[0];
  if (iframe) {
    iframe.onload = () => {
      // Only trigger success if the loader is actually visible (prevents false triggers)
      if (!loadingOverlay.classList.contains("hidden")) {
        const nameToUse = document.getElementById("occ_your_name").value || nameInput.value || cachedName;
        showSuccessUI(nameToUse);
      }
    };
  }

  // Handle Main Form Submit
  songForm.addEventListener("submit", () => {
    loadingOverlay.classList.remove("hidden");
  });

  // Handle Occasion Form Submit
  occasionForm.addEventListener("submit", () => {
    loadingOverlay.classList.remove("hidden");
  });

  /* ---------------- CONFETTI & SCROLL ---------------- */
  function launchConfetti() {
    for (let i = 0; i < 80; i++) {
      const c = document.createElement("div");
      c.className = "confetti";
      c.style.left = Math.random() * 100 + "vw";
      c.style.backgroundColor = `hsl(${Math.random() * 360},100%,60%)`;
      c.style.animationDuration = 2 + Math.random() * 2 + "s";
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 4000);
    }
  }

  window.addEventListener("scroll", () => {
    if (!scrollIndicator || !aboutSection || !scrollText) return;
    const aboutTop = aboutSection.getBoundingClientRect().top;
    if (aboutTop <= window.innerHeight / 1.5) {
      scrollText.textContent = "Click the 'Celebrating an occasion?' button at the top to input your shout-out!";
    } else {
      scrollText.textContent = "Scroll down to learn more";
    }
  });

  /* ---------------- COPY TO CLIPBOARD ---------------- */
  const copyBtn = document.getElementById("copyPhone");
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const phone = copyBtn.getAttribute("data-phone");
      const textSpan = copyBtn.querySelector(".text");
      const originalText = textSpan.textContent;

      navigator.clipboard.writeText(phone).then(() => {
        copyBtn.classList.add("copied");
        textSpan.textContent = "Copied!";
        setTimeout(() => {
          copyBtn.classList.remove("copied");
          textSpan.textContent = originalText;
        }, 2000);
      });
    });
  }
});