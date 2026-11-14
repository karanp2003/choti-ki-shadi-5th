(function () {
  "use strict";

  const cfg = window.WEDDING_CONFIG || {};
  const hero = cfg.hero || {};
  const story = cfg.story || {};
  const entry = cfg.entry || {};
  const MONTHS = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER",
  ];

  function parseDate(iso) {
    if (!iso || typeof iso !== "string") return { month: "", day: "", year: "" };
    const p = iso.trim().split("-");
    if (p.length < 3) return { month: "", day: "", year: "" };
    const y = p[0];
    const mi = parseInt(p[1], 10) - 1;
    const d = parseInt(p[2], 10);
    return {
      month: MONTHS[mi] || p[1],
      day: isNaN(d) ? "" : String(d),
      year: y,
    };
  }

  function pillDate(iso) {
    if (!iso) return "";
    const p = iso.trim().match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (!p) return "";
    return p[3].padStart(2, "0") + "." + p[2].padStart(2, "0") + "." + p[1];
  }

  function coupleLine() {
    const b = hero.brideName || "Bride";
    const g = hero.groomName || "Groom";
    return hero.displayOrder === "groom-first" ? g + " & " + b : b + " & " + g;
  }

  function shareInvite() {
    const shareCfg = cfg.share || {};
    const names = coupleLine();
    const shareText =
      shareCfg.whatsappText ||
      shareCfg.text ||
      "Save the date! " +
        names +
        " are getting married on 5 December 2026 at " +
        (hero.venue || "Jaipur") +
        ".";

    const shareUrl = (function () {
      if (shareCfg.url) return shareCfg.url;
      try {
        const u = new URL(window.location.href);
        u.search = "";
        u.hash = "";
        return u.toString();
      } catch (_) {
        return window.location.href;
      }
    })();

    const shareData = {
      title: shareCfg.ogTitle || shareCfg.title || names + " — Save the Date",
      text: shareText,
      url: shareUrl,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(function () {});
      return;
    }

    const clipboardText = shareText + "\n\n" + shareUrl;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(clipboardText).then(function () {
        alert("Invitation message copied — paste in WhatsApp!");
      });
      return;
    }

    prompt("Copy this message:", clipboardText);
  }

  const archVideo = document.getElementById("floral-arch-video");
  const overlay = document.getElementById("arch-overlay");
  const heroStage = document.getElementById("hero-stage");
  const ourStory = document.getElementById("our-story");
  const scrollCue = document.getElementById("scroll-cue");
  const audio = document.getElementById("bg-audio");
  const audioBtn = document.getElementById("audio-btn");
  const storyTrack = document.getElementById("story-track");
  const tapToOpen = document.getElementById("tap-to-open");
  const tapLabel = document.getElementById("tap-to-open-label");

  const dParts = parseDate(hero.weddingDate);
  document.getElementById("arch-bride").textContent =
    hero.displayOrder === "groom-first" ? hero.groomName : hero.brideName;
  document.getElementById("arch-groom").textContent =
    hero.displayOrder === "groom-first" ? hero.brideName : hero.groomName;
  document.getElementById("arch-connector").textContent = hero.connector || "&";
  document.getElementById("arch-month").textContent = dParts.month;
  document.getElementById("arch-day").textContent = dParts.day;
  document.getElementById("arch-year").textContent = dParts.year;
  document.getElementById("scroll-tag").textContent = hero.scrollTag || "SCROLL DOWN";

  var venueNameEl = document.getElementById("story-venue-name");
  var venueAreaEl = document.getElementById("story-venue-area");
  var venueTimeEl = document.getElementById("story-venue-time");
  var venueName = hero.venueName || "";
  var venueArea = hero.venueArea || "";
  if (!venueName && hero.venue) {
    var vp = hero.venue.split(",").map(function (s) {
      return s.trim();
    });
    venueName = vp[0] || "";
    venueArea = vp.slice(1).join(", ");
  }
  if (venueNameEl) venueNameEl.textContent = venueName;
  if (venueAreaEl) venueAreaEl.textContent = venueArea;
  if (venueTimeEl) venueTimeEl.textContent = hero.eventTime || "1 PM Onwards";

  if (tapLabel) {
    const hint = entry.tapHint || hero.tapHint || "Tap to Open";
    tapLabel.textContent = hint.toUpperCase();
  }

  document.getElementById("story-title").textContent = story.title || "Our Story";
  document.getElementById("story-script").textContent = story.scriptSubtitle || "";
  document.getElementById("story-lead").textContent = story.leadMessage || "";
  document.getElementById("story-closing").textContent = story.closingMessage || "";
  document.getElementById("pill-date").textContent = pillDate(hero.weddingDate);
  document.getElementById("pill-bg").src =
    cfg.botanicalPillBg ||
    "https://pub-1953a6673e864f3488c645252f75de98.r2.dev/website%20assets/dummy/ChatGPT%20Image%20Sep%2015%2C%202026%2C%2005_49_28%20PM.png";

  document.getElementById("btn-maps").href =
    hero.mapsUrl ||
    "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(hero.venue || "");
  document.getElementById("btn-share").addEventListener("click", shareInvite);

  function mediaSrc(src) {
    if (!src) return "";
    if (/^https?:\/\//i.test(src)) return src;
    return src
      .split("/")
      .map(function (part) {
        return encodeURIComponent(part);
      })
      .join("/");
  }

  var archLogo = document.getElementById("arch-logo");
  if (archLogo && (hero.logo || cfg.coupleLogo)) {
    archLogo.src = mediaSrc(hero.logo || cfg.coupleLogo);
  }

  const slides = (story.slides || []).map(function (s) {
    return typeof s === "string" ? s : s.media || s.url || "";
  }).filter(Boolean);

  if (slides.length) {
    const list = slides.length > 1 ? slides.concat(slides[0]) : slides;
    list.forEach(function (src, i) {
      const slide = document.createElement("div");
      slide.className = "our-story-slide";
      slide.innerHTML =
        '<img src="' +
        mediaSrc(src) +
        '" alt="Our story" class="our-story-photo" loading="' +
        (i === 0 ? "eager" : "lazy") +
        '" decoding="async" />';
      storyTrack.appendChild(slide);
    });
    if (slides.length > 1) {
      let idx = 0;
      setInterval(function () {
        idx++;
        storyTrack.style.transition = "transform 0.75s cubic-bezier(0.25, 1, 0.5, 1)";
        storyTrack.style.transform = "translate3d(-" + 100 * idx + "%, 0, 0)";
        if (idx >= slides.length) {
          storyTrack.addEventListener(
            "transitionend",
            function reset() {
              storyTrack.removeEventListener("transitionend", reset);
              idx = 0;
              storyTrack.style.transition = "none";
              storyTrack.style.transform = "translate3d(0, 0, 0)";
            },
            { once: true }
          );
        }
      }, story.autoPlayInterval || 3800);
    }
  }

  if (cfg.archHeroVideo) archVideo.src = cfg.archHeroVideo;
  if (cfg.audio?.src && cfg.audio.enabled !== false) {
    audio.src = mediaSrc(cfg.audio.src);
    audio.loop = true;
    if (cfg.audio.title) {
      audioBtn.title = cfg.audio.title;
      audioBtn.setAttribute("aria-label", cfg.audio.title);
    }
  }

  let heroStarted = false;
  let heroUnlocked = false;
  let archOverlayShown = false;

  function playMusic() {
    if (!cfg.audio?.enabled || !audio.src) return;
    audio.volume = 0.65;
    audio.play().catch(function () {});
    audioBtn.style.visibility = "visible";
  }

  function unlockLayout() {
    if (!heroStarted || heroUnlocked) return;
    heroUnlocked = true;
    heroStage.classList.remove("stage-locked");
    heroStage.classList.add("stage-unlocked");
    ourStory.classList.remove("hidden-until-unlock");
    document.body.classList.remove("hero-locked");
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.inset = "";
    document.body.style.width = "";
    document.documentElement.style.overflow = "";
  }

  function startArchHero() {
    if (!archVideo) return;
    archVideo.setAttribute("playsinline", "");
    archVideo.setAttribute("webkit-playsinline", "");
    archVideo.playsInline = true;
    archVideo.muted = true;
    try {
      archVideo.currentTime = 0;
    } catch (_) {}
    var revealFallbackMs = 5500;
    var revealTimer = setTimeout(function () {
      if (heroStarted) showArchOverlay();
    }, revealFallbackMs);
    archVideo.play().catch(function () {
      clearTimeout(revealTimer);
      showArchOverlay();
    });
    archVideo.addEventListener(
      "timeupdate",
      function onT() {
        if (archVideo.duration && archVideo.currentTime >= archVideo.duration - 0.6) {
          archVideo.removeEventListener("timeupdate", onT);
          clearTimeout(revealTimer);
          showArchOverlay();
        }
      }
    );
    archVideo.addEventListener(
      "ended",
      function () {
        clearTimeout(revealTimer);
        showArchOverlay();
      },
      { once: true }
    );
  }

  function showArchOverlay() {
    if (!heroStarted || archOverlayShown) return;
    archOverlayShown = true;
    overlay.classList.remove("overlay-hidden");
    overlay.classList.add("overlay-visible");
    scrollCue.classList.remove("hidden");
    unlockLayout();
    try {
      archVideo.pause();
    } catch (_) {}
  }

  function openFromFloralHero() {
    if (heroStarted) return;
    heroStarted = true;
    if (tapToOpen) {
      tapToOpen.classList.add("is-hidden");
      tapToOpen.setAttribute("aria-hidden", "true");
    }
    playMusic();
    startArchHero();
  }

  if (tapToOpen) {
    tapToOpen.addEventListener("click", openFromFloralHero);
  }

  if (archVideo) {
    archVideo.preload = "metadata";
    function primeClosedFrame() {
      try {
        archVideo.pause();
        archVideo.currentTime = 0;
      } catch (_) {}
    }
    archVideo.addEventListener("loadedmetadata", primeClosedFrame, { once: true });
    if (archVideo.readyState >= 1) {
      primeClosedFrame();
    }
  }

  function updateHeroChrome() {
    if (!heroStage) return;
    if (!heroUnlocked) {
      heroStage.classList.remove("hero-past-fold");
      return;
    }
    const storyTop = ourStory.getBoundingClientRect().top;
    const fold = storyTop <= window.innerHeight * 0.72;
    if (fold) {
      heroStage.classList.add("hero-past-fold");
      scrollCue.classList.add("hidden");
    } else if (archOverlayShown) {
      heroStage.classList.remove("hero-past-fold");
      scrollCue.classList.remove("hidden");
    }
  }

  window.addEventListener("scroll", updateHeroChrome, { passive: true });
  window.addEventListener("resize", updateHeroChrome, { passive: true });

  scrollCue.addEventListener("click", function (e) {
    e.stopPropagation();
    scrollCue.classList.add("hidden");
    heroStage.classList.add("hero-past-fold");
    ourStory.scrollIntoView({ behavior: "smooth" });
    requestAnimationFrame(updateHeroChrome);
  });

  audioBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    if (!audio.src) return;
    if (audio.paused) {
      audio.play();
      audioBtn.classList.add("playing");
    } else {
      audio.pause();
      audioBtn.classList.remove("playing");
    }
  });

  audioBtn.style.visibility = "hidden";
  document.body.classList.add("hero-locked");

  if (tapToOpen) {
    tapToOpen.setAttribute("aria-hidden", "false");
  }

  window.addEventListener("pageshow", function (ev) {
    if (ev.persisted && heroStarted) {
      location.reload();
    }
  });

  requestAnimationFrame(updateHeroChrome);
})();
