document.addEventListener("DOMContentLoaded", () => {
  const songForm = document.getElementById("songForm");
  const occasionForm = document.getElementById("occasionForm");
  const nameInput = document.getElementById("personName");
  const formSection = document.getElementById("formSection");
  const successSection = document.getElementById("successSection");
  const scrollIndicator = document.querySelector(".scroll-down");
  const aboutSection = document.querySelector(".about-section");
  const scrollText = scrollIndicator?.querySelector("span");
  const loadingOverlay = document.getElementById("loadingOverlay"); // Added this

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
      document.querySelector(".overlay").scrollIntoView({ behavior: "smooth", block: "start" });
      occasionOverlay.style.opacity = "0";
      setTimeout(() => {
        occasionOverlay.classList.add("hidden");
      }, 400);
    });
  }

  /* ---------------- SUCCESS UI ---------------- */
  function showSuccessUI(displayName) {
    // 1. Hide the loader immediately
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
        successSection.classList.remove("show");
        setTimeout(() => {
          successSection.style.display = "none";
          formSection.style.display = "block";
          if (scrollIndicator) scrollIndicator.style.display = "block";
          if (aboutSection) aboutSection.style.display = "block";
          
          formSection.style.animation = 'none';
          formSection.offsetHeight; 
          formSection.style.animation = 'popIn 0.5s ease';
        }, 300);
      });
    }

    launchConfetti();
    songForm.reset();
    occasionForm.reset();
    cachedName = "";
  }

  /* ---------------- UNIFIED SUBMIT (OCCASION) ---------------- */
  if (occasionForm) {
    occasionForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      // SHOW LOADER
      if (loadingOverlay) loadingOverlay.classList.remove("hidden");

      const formData = new FormData();

      const sName = songForm.querySelector('input[name="entry.868369003"]')?.value || "";
      const sSong = songForm.querySelector('input[name="entry.1776646019"]')?.value || "";
      const sArtist = songForm.querySelector('input[name="entry.181281543"]')?.value || "";

      const oPerson = occasionForm.querySelector('input[name="entry.389682099"]')?.value || "";
      const oMsg = occasionForm.querySelector('input[name="entry.805932371"]')?.value || "";
      const selectedRadio = occasionForm.querySelector('input[name="entry.1223390077"]:checked');
      const oType = selectedRadio ? selectedRadio.value : "";

      formData.append('entry.868369003', sName);
      formData.append('entry.1776646019', sSong);
      formData.append('entry.181281543', sArtist);
      formData.append('entry.389682099', oPerson);
      formData.append('entry.805932371', oMsg);
      formData.append('entry.1223390077', oType);

      try {
        await fetch(songForm.action, { method: 'POST', mode: 'no-cors', body: formData });
        showSuccessUI(sName || cachedName);
      } catch (err) {
        if (loadingOverlay) loadingOverlay.classList.add("hidden");
        console.error("Submission failed", err);
        alert("Oops! Something went wrong. Check your connection.");
      }
    });
  }

  /* ---------------- SIMPLE SUBMIT (SONG ONLY) ---------------- */
  songForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // SHOW LOADER
    if (loadingOverlay) loadingOverlay.classList.remove("hidden");

    const formData = new FormData(songForm);
    const currentName = songForm.querySelector('input[name="entry.868369003"]')?.value || "";

    try {
      await fetch(songForm.action, { method: 'POST', mode: 'no-cors', body: formData });
      showSuccessUI(currentName);
    } catch (err) {
      if (loadingOverlay) loadingOverlay.classList.add("hidden");
      console.error("Submission failed", err);
      alert("Oops! Something went wrong.");
    }
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
      scrollText.textContent = "Scroll down to send your occasion";
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