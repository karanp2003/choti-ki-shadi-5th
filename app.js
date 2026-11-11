/**
 * ====================================================================
 * BLUSH & GOLD WEDDING INVITATION LOGIC (app.js)
 * InviteVibes Exact Replication for Antima Gupta & Saksham Mathur
 * ====================================================================
 * Key Features:
 * 1. Exact Video Envelope Gate:
 *    - Uncropped full video
 *    - Plays until envelope is FULLY OPENED
 *    - Only then fades out and reveals main content (#main-content.visible)
 * 2. Exact 3-Card Scratch Date (Month, Day, Year):
 *    - Destination-out canvas with blush-gold gradient foil
 *    - Card glows upon reveal
 *    - When all 3 cards scratched, #locked is revealed with countdown!
 * 3. Live Countdown Timer (5 Dec 2026)
 * 4. Ambient Rose Petals & Golden Dust Canvas
 * 5. Polaroid Photos with Captions (5 uncropped photos)
 * 6. Native Share API & Fallback
 */

document.addEventListener("DOMContentLoaded", () => {
  const config = window.WEDDING_CONFIG || {};

  // ==========================================
  // 1. Background Music (ReelAudio-14254.mp3)
  // ==========================================
  const audioEl = document.getElementById("wedding-audio");
  const audioBtn = document.getElementById("audio-btn");
  let isAudioPlaying = false;

  const audioSrc = config.audio?.src || "https://pub-1953a6673e864f3488c645252f75de98.r2.dev/April/Kriti%20%26%20Manmeet/ReelAudio-14254.mp3";

  if (audioEl) {
    audioEl.src = audioSrc;
    audioEl.loop = true;
    audioEl.preload = "auto";
  }

  function playAudio() {
    if (!audioEl) return;
    audioEl.play().then(() => {
      isAudioPlaying = true;
      if (audioBtn) {
        audioBtn.classList.add("playing");
        audioBtn.setAttribute("title", "Pause Music");
        audioBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spin-disc">
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          <span class="audio-waves">
            <span></span><span></span><span></span>
          </span>
        `;
      }
    }).catch((err) => {
      console.warn("Autoplay blocked:", err);
    });
  }

  function pauseAudio() {
    if (!audioEl) return;
    audioEl.pause();
    isAudioPlaying = false;
    if (audioBtn) {
      audioBtn.classList.remove("playing");
      audioBtn.setAttribute("title", "Play Music");
      audioBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <line x1="23" y1="9" x2="17" y2="15"></line>
          <line x1="17" y1="9" x2="23" y2="15"></line>
        </svg>
      `;
    }
  }

  if (audioBtn) {
    audioBtn.addEventListener("click", () => {
      if (isAudioPlaying) {
        pauseAudio();
      } else {
        playAudio();
      }
    });
  }

  // ==========================================
  // 2. Exact Envelope Gate Timing & Transition
  // ==========================================
  const entryGate = document.getElementById("entry-gate");
  const entryVideo = document.getElementById("entry-video");
  const mainContent = document.getElementById("main-content");
  let isEnvelopeOpening = false;
  let isEnvelopeFinished = false;

  function finishEnvelope() {
    if (isEnvelopeFinished) return;
    isEnvelopeFinished = true;

    if (entryGate) {
      entryGate.classList.add("fade-out");
      setTimeout(() => {
        entryGate.style.display = "none";
        document.body.classList.remove("gate-locked");
        if (mainContent) {
          mainContent.classList.add("visible");
        }
        // Initialize scratch cards once layout is rendered and visible
        setTimeout(initScratchCards, 100);
      }, 800);
    }
  }

  function startOpenEnvelope() {
    if (isEnvelopeOpening) return;
    isEnvelopeOpening = true;

    // Start background music immediately on user gesture
    playAudio();

    if (entryGate) {
      entryGate.classList.add("video-playing");
    }

    if (entryVideo) {
      entryVideo.muted = true;
      entryVideo.currentTime = 0.001;
      const playPromise = entryVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          entryVideo.play().catch(() => finishEnvelope());
        });
      }

      // Exact timing: reduced by 2 seconds from end (d - 2.8s) so user doesn't wait
      entryVideo.addEventListener("timeupdate", () => {
        const d = entryVideo.duration;
        if (Number.isFinite(d) && d > 2.5 && entryVideo.currentTime >= d - 2.8) {
          try { entryVideo.pause(); } catch (e) {}
          finishEnvelope();
        }
      });

      entryVideo.addEventListener("ended", finishEnvelope);

      // Fallback safety timeout if video stalls
      setTimeout(() => {
        if (!isEnvelopeFinished) {
          finishEnvelope();
        }
      }, 9000);
    } else {
      finishEnvelope();
    }
  }

  if (entryGate) {
    entryGate.addEventListener("click", startOpenEnvelope);
  }

  // Preload video frame on ready
  if (entryVideo) {
    entryVideo.addEventListener("loadeddata", () => {
      if (entryVideo.currentTime === 0) {
        try { entryVideo.currentTime = 0.001; } catch (e) {}
      }
    });
  }

  // ==========================================
  // 3. Exact InviteVibes Scratch Cards
  // ==========================================
  let totalCardsScratched = 0;

  function initScratchCards() {
    const cards = [
      { canvasId: "canvas-day",   cardId: "card-day",   unitId: "unit-day"   },
      { canvasId: "canvas-month", cardId: "card-month", unitId: "unit-month" },
      { canvasId: "canvas-year",  cardId: "card-year",  unitId: "unit-year"  }
    ];

    cards.forEach((item) => {
      setupSingleScratchCard(item.canvasId, item.cardId, item.unitId);
    });
  }

  function setupSingleScratchCard(canvasId, cardId, unitId) {
    const canvas = document.getElementById(canvasId);
    const card = document.getElementById(cardId);
    const unit = document.getElementById(unitId);
    if (!canvas || !card) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const rect = card.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const w = rect.width || 110;
    const h = rect.height || 150;

    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.scale(dpr, dpr);

    // Exact InviteVibes Blush-Gold Gradient Foil
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#EAC9C7");
    grad.addColorStop(0.5, "#BA7A76");
    grad.addColorStop(1, "#EAC9C7");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Subtle luxury diagonal highlight
    ctx.fillStyle = "rgba(255, 255, 255, 0.22)";
    ctx.fillRect(w * 0.18, 0, w * 0.16, h);

    ctx.globalCompositeOperation = "destination-out";
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = Math.max(38, Math.round(w * 0.38));

    let isDrawing = false;
    let isDone = false;

    function getCoords(e) {
      const r = canvas.getBoundingClientRect();
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const cy = e.touches ? e.touches[0].clientY : e.clientY;
      return { x: cx - r.left, y: cy - r.top };
    }

    function checkScratchedPercentage() {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let clearPixels = 0;
      for (let i = 3; i < imgData.length; i += 4) {
        if (imgData[i] === 0) clearPixels++;
      }
      const ratio = clearPixels / (canvas.width * canvas.height);
      if (ratio > 0.45 && !isDone) {
        isDone = true;
        card.classList.add("glow");

        // Hide hint
        const hint = unit ? unit.querySelector(".scratch-hint") : null;
        if (hint) hint.style.display = "none";

        // Fade out canvas smoothly
        canvas.style.transition = "opacity 0.4s ease";
        canvas.style.opacity = "0";
        setTimeout(() => { canvas.style.display = "none"; }, 400);

        totalCardsScratched++;
        if (totalCardsScratched >= 3) {
          unlockRestOfInvitation();
        }
      }
    }

    function draw(e) {
      if (!isDrawing || isDone) return;
      if (e.cancelable && e.type.startsWith("touch")) e.preventDefault();
      const pos = getCoords(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      checkScratchedPercentage();
    }

    function startDraw(e) {
      if (isDone) return;
      isDrawing = true;
      const pos = getCoords(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      draw(e);
    }

    function stopDraw() {
      isDrawing = false;
    }

    // Mouse Listeners
    canvas.addEventListener("mousedown", startDraw);
    canvas.addEventListener("mousemove", draw);
    window.addEventListener("mouseup", stopDraw);

    // Touch Listeners
    canvas.addEventListener("touchstart", startDraw, { passive: false });
    canvas.addEventListener("touchmove", draw, { passive: false });
    window.addEventListener("touchend", stopDraw);
  }

  // Celebration Crackers / Confetti Blast (InviteVibes Exact Effect)
  function fireCelebrationCrackers() {
    const colors = ["#E2B4B1", "#fdfbf7", "#D4AF37", "#BA7A76", "#FFD700", "#FF69B4", "#FFF8DC"];

    if (typeof window.confetti === "function") {
      // 1. Center burst
      window.confetti({
        particleCount: 180,
        spread: 100,
        origin: { x: 0.5, y: 0.6 },
        colors: colors,
        zIndex: 99999,
        disableForReducedMotion: false
      });

      // 2. Left side cannon
      setTimeout(() => {
        window.confetti({
          particleCount: 120,
          angle: 60,
          spread: 70,
          origin: { x: 0.05, y: 0.65 },
          colors: colors,
          zIndex: 99999
        });
      }, 300);

      // 3. Right side cannon
      setTimeout(() => {
        window.confetti({
          particleCount: 120,
          angle: 120,
          spread: 70,
          origin: { x: 0.95, y: 0.65 },
          colors: colors,
          zIndex: 99999
        });
      }, 550);
    }
  }

  function unlockRestOfInvitation() {
    const lockedEl = document.getElementById("locked");
    if (!lockedEl) return;

    // Shatter crackers / confetti!
    fireCelebrationCrackers();

    lockedEl.classList.add("unlocked");
    requestAnimationFrame(() => {
      lockedEl.classList.add("visible");
      // Smooth scroll to countdown section
      const cdSection = document.getElementById("countdown-section");
      if (cdSection) {
        setTimeout(() => {
          cdSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 600);
      }
    });
  }

  // ==========================================
  // 4. Live Countdown (Target: 5 Dec 2026)
  // ==========================================
  function initCountdown() {
    const targetStr = config.countdown?.targetDate || "2026-12-05T10:30:00+05:30";
    const targetDate = new Date(targetStr).getTime();

    const daysEl = document.getElementById("countdown-days");
    const hoursEl = document.getElementById("countdown-hours");
    const minsEl = document.getElementById("countdown-mins");
    const secsEl = document.getElementById("countdown-secs");

    function update() {
      const now = Date.now();
      const distance = targetDate - now;

      if (distance <= 0) {
        if (daysEl) daysEl.innerText = "00";
        if (hoursEl) hoursEl.innerText = "00";
        if (minsEl) minsEl.innerText = "00";
        if (secsEl) secsEl.innerText = "00";
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((distance % (1000 * 60)) / 1000);

      const pad = (n) => String(n).padStart(2, "0");

      if (daysEl) daysEl.innerText = pad(days);
      if (hoursEl) hoursEl.innerText = pad(hours);
      if (minsEl) minsEl.innerText = pad(mins);
      if (secsEl) secsEl.innerText = pad(secs);
    }

    update();
    setInterval(update, 1000);
  }
  initCountdown();

  // ==========================================
  // 5. Romantic Petals & Gold Sparkles Canvas
  // ==========================================
  function initPetalsCanvas() {
    const canvas = document.getElementById("petals-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = Math.min(30, Math.floor(width / 36));

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 4 + 2,
        speedX: Math.random() * 0.8 - 0.4,
        speedY: Math.random() * 0.8 + 0.3,
        opacity: Math.random() * 0.55 + 0.25,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.02 + 0.01,
        color: Math.random() > 0.45 ? "#E2B4B1" : "#D4AF37",
        isPetal: Math.random() > 0.5,
      });
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.wobble += p.wobbleSpeed;
        p.x += p.speedX + Math.sin(p.wobble) * 0.6;
        p.y += p.speedY;

        if (p.y > height + 10) {
          p.y = -10;
          p.x = Math.random() * width;
        }
        if (p.x > width + 10) p.x = -10;
        if (p.x < -10) p.x = width + 10;

        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;

        if (p.isPetal) {
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, p.size * 1.5, p.size, p.wobble, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2);
          ctx.shadowBlur = 4;
          ctx.shadowColor = "#D4AF37";
          ctx.fill();
        }

        ctx.restore();
      });

      requestAnimationFrame(animate);
    }
    animate();
  }
  initPetalsCanvas();

  // ==========================================
  // 6. Scroll Reveal Observer
  // ==========================================
  function initScrollReveal() {
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -20px 0px" }
    );

    reveals.forEach((el) => observer.observe(el));
  }
  initScrollReveal();

  // ==========================================
  // 7. Share Invitation Link
  // ==========================================
  const shareBtn = document.getElementById("share-btn");
  if (shareBtn) {
    shareBtn.addEventListener("click", () => {
      const bride = config.hero?.bride?.name || "Antima Gupta";
      const groom = config.hero?.groom?.name || "Saksham Mathur";
      const shareData = {
        title: `${bride} & ${groom} — Wedding Invitation`,
        text: `With love and blessings, join us as we celebrate the wedding of ${bride} & ${groom} on 04 & 05 December 2026!`,
        url: window.location.href,
      };

      if (navigator.share) {
        navigator.share(shareData).catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href).then(() => {
          alert("Wedding Invitation link copied to clipboard!");
        });
      }
    });
  }
});
