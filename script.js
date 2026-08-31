/* ==========================================================================
   BUBU & DUDU BIRTHDAY SITE — JAVASCRIPT
   Mobile Story Deck Engine, Card-by-Card Coupons, Anger Meter & Tease Game
   ========================================================================== */

// ─── 1. AUDIO & SOUND EFFECTS SYNTHESIZER ───
const CuteAudio = (function () {
  let audioCtx = null;
  let isPlaying = false;
  let timerId = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playNote(freq, start, duration, type = 'triangle', gainVal = 0.12) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);

    gain.gain.setValueAtTime(0.001, start);
    gain.gain.exponentialRampToValueAtTime(gainVal, start + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(start);
    osc.stop(start + duration);
  }

  const notes = [
    { f: 261.63, d: 0.35 }, { f: 261.63, d: 0.25 }, { f: 293.66, d: 0.6 }, { f: 261.63, d: 0.6 },
    { f: 349.23, d: 0.6 }, { f: 329.63, d: 1.1 },

    { f: 261.63, d: 0.35 }, { f: 261.63, d: 0.25 }, { f: 293.66, d: 0.6 }, { f: 261.63, d: 0.6 },
    { f: 392.00, d: 0.6 }, { f: 349.23, d: 1.1 },

    { f: 261.63, d: 0.35 }, { f: 261.63, d: 0.25 }, { f: 523.25, d: 0.6 }, { f: 440.00, d: 0.6 },
    { f: 349.23, d: 0.6 }, { f: 329.63, d: 0.6 }, { f: 293.66, d: 0.8 },

    { f: 466.16, d: 0.35 }, { f: 466.16, d: 0.25 }, { f: 440.00, d: 0.6 }, { f: 349.23, d: 0.6 },
    { f: 392.00, d: 0.6 }, { f: 349.23, d: 1.4 },
  ];

  function playMelodyLoop() {
    if (!isPlaying) return;
    initAudio();
    let now = audioCtx.currentTime;
    let totalTime = 0;

    notes.forEach((n) => {
      playNote(n.f, now + totalTime, n.d, 'triangle', 0.12);
      playNote(n.f * 2, now + totalTime + 0.02, n.d * 0.5, 'sine', 0.03);
      totalTime += n.d + 0.08;
    });

    timerId = setTimeout(() => {
      if (isPlaying) playMelodyLoop();
    }, (totalTime + 1) * 1000);
  }

  function toggle(button, textSpan) {
    initAudio();
    isPlaying = !isPlaying;
    if (isPlaying) {
      button.classList.add('playing');
      textSpan.textContent = 'Pause ⏸️';
      playMelodyLoop();
    } else {
      button.classList.remove('playing');
      textSpan.textContent = 'Music 🎵';
      clearTimeout(timerId);
    }
  }

  function playCutePop() {
    initAudio();
    if (!audioCtx) return;
    let now = audioCtx.currentTime;
    playNote(523.25, now, 0.12, 'sine', 0.18);
    playNote(659.25, now + 0.08, 0.18, 'sine', 0.18);
    playNote(783.99, now + 0.16, 0.25, 'sine', 0.2);
  }

  function playSlamSound() {
    initAudio();
    if (!audioCtx) return;
    let now = audioCtx.currentTime;
    playNote(220, now, 0.1, 'triangle', 0.25);
    playNote(440, now + 0.05, 0.2, 'sine', 0.2);
  }

  return { toggle, playCutePop, playSlamSound };
})();

// Music Button listener
const musicBtn = document.getElementById('musicBtn');
const musicText = document.getElementById('musicText');
if (musicBtn) {
  musicBtn.addEventListener('click', () => {
    CuteAudio.toggle(musicBtn, musicText);
  });
}


// ─── 2. FLOATING HEARTS & CONFETTI ENGINE ───
(function initFloating() {
  const container = document.getElementById('floatingLayer');
  if (!container) return;
  const emojis = ['💖', '🌸', '✨', '🎂', '💕', '🍓', '🧸', '🍬'];
  function spawnItem() {
    const el = document.createElement('span');
    el.className = 'floating-icon';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = Math.random() * 95 + 'vw';
    const duration = Math.random() * 6 + 6;
    el.style.animationDuration = duration + 's';
    el.style.fontSize = (Math.random() * 14 + 14) + 'px';
    container.appendChild(el);
    setTimeout(() => el.remove(), duration * 1000);
  }
  for (let i = 0; i < 8; i++) setTimeout(spawnItem, i * 300);
  setInterval(spawnItem, 1000);
})();

const ConfettiEngine = (function () {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return { shoot: () => { } };
  const ctx = canvas.getContext('2d');
  let W = (canvas.width = window.innerWidth);
  let H = (canvas.height = window.innerHeight);
  let particles = [];
  let isRunning = false;

  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  const colors = ['#ff6584', '#ff477e', '#ffd166', '#a8dadc', '#d8b4e2', '#ff9a8b', '#ffffff'];

  function createParticle(x, y) {
    return {
      x: x !== undefined ? x : Math.random() * W,
      y: y !== undefined ? y : Math.random() * H - H,
      r: Math.random() * 7 + 4,
      d: Math.random() * 50,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.floor(Math.random() * 10) - 10,
      tiltAngle: 0,
      tiltAngleInc: Math.random() * 0.08 + 0.04,
      shape: Math.random() > 0.4 ? 'circle' : (Math.random() > 0.5 ? 'rect' : 'heart'),
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2.5,
    };
  }

  function drawHeart(x, y, size, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size / 15, size / 15);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-5, -5, -10, 0, -10, 5);
    ctx.bezierCurveTo(-10, 10, 0, 15, 0, 20);
    ctx.bezierCurveTo(0, 15, 10, 10, 10, 5);
    ctx.bezierCurveTo(10, 0, 5, -5, 0, 0);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    if (particles.length === 0) {
      isRunning = false;
      return;
    }

    particles.forEach((p, index) => {
      p.tiltAngle += p.tiltAngleInc;
      p.y += p.vy;
      p.x += p.vx + Math.sin(p.tiltAngle) * 0.5;

      ctx.beginPath();
      if (p.shape === 'heart') {
        drawHeart(p.x, p.y, p.r * 1.4, p.color);
      } else if (p.shape === 'circle') {
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      } else {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.tiltAngle);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
        ctx.restore();
      }

      if (p.y > H + 30) {
        particles.splice(index, 1);
      }
    });

    requestAnimationFrame(loop);
  }

  function shoot(amount = 70) {
    for (let i = 0; i < amount; i++) {
      particles.push(createParticle());
    }
    if (!isRunning) {
      isRunning = true;
      requestAnimationFrame(loop);
    }
  }

  return { shoot };
})();


// ─── 3. STORY DECK NAVIGATION (1 PAGE AT A TIME) ───
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.slide');
const indicatorDots = document.querySelectorAll('.indicator-dot');

window.goToSlide = function (targetIndex) {
  if (targetIndex < 0 || targetIndex >= slides.length) return;

  slides.forEach((s, idx) => {
    s.classList.remove('active', 'previous');
    if (idx < targetIndex) s.classList.add('previous');
    else if (idx === targetIndex) s.classList.add('active');
  });

  indicatorDots.forEach((dot, idx) => {
    dot.classList.toggle('active', idx === targetIndex);
  });

  currentSlideIndex = targetIndex;
  CuteAudio.playCutePop();
  ConfettiEngine.shoot(30);
};


// ─── 4. SLIDE 1: DISTINCT STEP-BY-STEP GUSSA METER (EVERY TAP IS UNIQUE!) ───
let gussaStep = 0; // 0 -> 1 -> 2 -> 3 -> 4 (Finished)

const gussaStepsData = [
  // Initial state (Step 0)
  {
    percent: 100,
    valText: '100% (Extreme Danger 🚨)',
    caption: 'Arey re! Itna zyada gussa?!',
    btnText: 'Thoda Rahem Karo Bacchi🥺'
  },
  // After Tap 1 (Step 1)
  {
    percent: 75,
    valText: '75% (Danger Zone ⚠️)',
    caption: 'Thoda sa kam hua... par abhi bhi aankhein laal hain aapki!',
    btnText: 'Kar bhi lo ab 😞'
  },
  // After Tap 2 (Step 2)
  {
    percent: 50,
    valText: '50% (Pout Mode Activated 😤)',
    caption: 'abhi bhi gussa bacha hai...lagta hai momos aur ice-cream khilane padenge! 🥟🍦',
    btnText: 'Kam kar lo na betu 😣 '
  },
  // After Tap 3 (Step 3)
  {
    percent: 25,
    valText: '25% (Almost Smiling 😊)',
    caption: 'Arey waah! Almost shaant! Bas ek pyaari si smile bachi hai meri bacchi! 🌸',
    btnText: 'Soni si bacchi bano aap ab 🌸'
  },
  // After Tap 4 (Step 4 — Finished!)
  {
    percent: 0,
    valText: '0% (Totally Calm & In Love 🍯🥰)',
    caption: 'Chalo Shaant toh hue aap 💖',
    btnText: 'HEHE, meri cutiepie'
  }
];

window.handleGussaClick = function () {
  const btn = document.getElementById('btnCoolDown');
  const gussaVal = document.getElementById('gussaVal');
  const gussaFill = document.getElementById('gussaFill');
  const gussaCaption = document.getElementById('gussaCaption');
  const heroBubuImg = document.getElementById('heroBubuImg');

  if (gussaStep < 4) {
    gussaStep++;
    const state = gussaStepsData[gussaStep];

    gussaFill.style.width = state.percent + '%';
    gussaVal.textContent = state.valText;
    gussaCaption.textContent = state.caption;
    btn.textContent = state.btnText;

    CuteAudio.playCutePop();
    ConfettiEngine.shoot(25);

    if (gussaStep === 4) {
      // 0% Unlocked!
      btn.classList.add('btn-unlocked-next');
      if (heroBubuImg) {
        heroBubuImg.src = 'https://media1.tenor.com/m/q_Sav516k1IAAAAC/bubu-dudu-dudu-dancing.gif';
      }
      ConfettiEngine.shoot(80);
      CuteAudio.playCutePop();
    }
  } else {
    // Navigates smoothly to Slide 2!
    goToSlide(1);
  }
};

const gussaTrack = document.getElementById('gussaTrack');
if (gussaTrack) {
  gussaTrack.addEventListener('click', window.handleGussaClick);
}


// ─── 5. SLIDE 2: POLAROIDS CAROUSEL (WITH SLEEPYHEAD FOODIE CARD) ───
(function initPolaroids() {
  const polaroids = [
    {
      title: 'The Drama Queen 👑',
      desc: 'Jab aap gussa hoti ho toh aapse dar bhi lagta hai aur aap cute bhi😋!',
      img: 'https://media1.tenor.com/m/wWerB2KmHSMAAAAC/angry-bubu.gif'
    },
    {
      title: 'Sotlu Bacchi😴🍕',
      desc: 'Din bhar bas neend hi toh ghumti hai aapke dimaag mein! Neend aur khane ke baad meri baari aati hai 😏',
      img: 'https://media.tenor.com/8NdKLwX37kAAAAAm/dudu-sleep-dudu-bubu.webp'
    },
    {
      title: 'Supreme Court Judge ⚖️',
      desc: 'Chahe galti kisi ki bhi ho, last me jeetna toh aapko hi hai bhutki shahiba! 😌',
      img: 'https://media.tenor.com/sF1uq611JBUAAAAi/bubu-dudu-bubu.webp'
    },
    {
      title: 'Meri Laado 💞',
      desc: 'Chahe kitni bhi ladai ho jaye, I still hate you the most in the entire world! 💖',
      img: 'https://media.tenor.com/Zrr4L_Wd4JkAAAAi/bubu-rub-bubu-love-dudu.gif'
    }
  ];

  let pIndex = 0;
  const polaroidImg = document.getElementById('polaroidImg');
  const polaroidTitle = document.getElementById('polaroidTitle');
  const polaroidDesc = document.getElementById('polaroidDesc');
  const polaroidCount = document.getElementById('polaroidCount');
  const btnPrev = document.getElementById('btnPrevPolaroid');
  const btnNext = document.getElementById('btnNextPolaroid');

  function renderPolaroid() {
    const item = polaroids[pIndex];
    polaroidImg.src = item.img;
    polaroidTitle.textContent = item.title;
    polaroidDesc.textContent = item.desc;
    polaroidCount.textContent = `${pIndex + 1} / ${polaroids.length}`;
    CuteAudio.playCutePop();
  }

  if (btnPrev && btnNext) {
    btnPrev.addEventListener('click', () => {
      pIndex = (pIndex - 1 + polaroids.length) % polaroids.length;
      renderPolaroid();
    });
    btnNext.addEventListener('click', () => {
      pIndex = (pIndex + 1) % polaroids.length;
      renderPolaroid();
    });
  }
})();


// ─── 6. SLIDE 3: LOVE COUPONS (FORCED CARD-BY-CARD ACCEPTANCE FOR BACCHI) ───
(function initCouponsDeck() {
  const coupons = [
    {
      icon: '👑',
      title: "Chalo Aap Jiti",
      desc: 'Valid especially for today. Jo bologe woh sar aankhon par! Koi behes nahi.'
    },
    {
      icon: '🫂',
      title: 'Cutiepie Accessibility',
      desc: 'Whenever you are sad, angry, or just want warmth. Non-stop tight cuddles!(Iski mereko jyada jarurat hai btw 🫣)'
    },
    {
      icon: '🍦',
      title: 'Ghumne Chalna Hai',
      desc: "Let's plan, itna dur mat rakh mereko 😾"
    },
    {
      icon: '💆‍♀️',
      title: 'Head Massage & Pampering Champi',
      desc: 'Meri Teraf se thodi si helping 😁'
    }
  ];

  let cIndex = 0;
  const cardEl = document.getElementById('currentCouponCard');
  const iconEl = document.getElementById('couponIcon');
  const titleEl = document.getElementById('couponTitle');
  const descEl = document.getElementById('couponDesc');
  const btnAccept = document.getElementById('btnAcceptCoupon');
  const stampEl = document.getElementById('couponStamp');
  const progressEl = document.getElementById('couponProgress');
  const btnAfterCoupons = document.getElementById('btnAfterCoupons');

  function showCoupon(index) {
    const item = coupons[index];
    iconEl.textContent = item.icon;
    titleEl.textContent = item.title;
    descEl.textContent = item.desc;
    progressEl.textContent = `Coupon ${index + 1} of ${coupons.length}`;

    btnAccept.style.display = 'block';
    stampEl.style.display = 'none';
    cardEl.classList.remove('stamped');
  }

  window.acceptCurrentCoupon = function () {
    btnAccept.style.display = 'none';
    stampEl.style.display = 'inline-block';
    cardEl.classList.add('stamped');

    CuteAudio.playSlamSound();
    ConfettiEngine.shoot(45);

    setTimeout(() => {
      if (cIndex < coupons.length - 1) {
        cIndex++;
        showCoupon(cIndex);
      } else {
        progressEl.innerHTML = '🎉 <strong>All 4 Coupons Accepted by Bacchi!</strong>';
        btnAfterCoupons.style.display = 'inline-flex';
        ConfettiEngine.shoot(80);
      }
    }, 900);
  };

  showCoupon(0);
})();


// ─── 7. SLIDE 4: FORGIVENESS GAME WITH EVADING "NAHI" & "ITNI JALDI?!" TEASE ───
(function initApologyGame() {
  const btnYes = document.getElementById('btnYesMobile');
  const btnNo = document.getElementById('btnNoMobile');
  const tauntBubble = document.getElementById('tauntBubbleMobile');
  const buttonsArena = document.getElementById('buttonsArenaMobile');
  const teaseModal = document.getElementById('teaseModal');
  const btnRealForgive = document.getElementById('btnRealForgive');
  const celebrationBox = document.getElementById('celebrationBoxMobile');
  const apologyGif = document.getElementById('apologyGifMobile');
  const apologyTitle = document.getElementById('apologyTitleMobile');
  const apologySub = document.getElementById('apologySubMobile');

  if (!btnYes || !btnNo) return;

  let noCount = 0;
  let hasTeasedOnce = false;

  const taunts = [
    'Arey pakad ke dikha bhutki tu pehle! 😏',
    'Nahi wala button bas showpiece hai! 😜',
    'Dekho bechara ro raha hai kone me jaake 😞',
    'Kitna bhav khaaogi aaj? Birthday hai reham kar bacchi! 🥺👉👈',
    'Haath dukh jayenge tap karte karte, maan jao na! 😂',
    'Main chocolate aur momos bhi khilaunga pakka! 🥺',
    'Nahi bolne ka koi option hi nahi hai! 💕',
    'Bas ab Haan pe tap karo meri betu! 🥰',
  ];

  function evadeNoButton(e) {
    if (e) e.preventDefault();
    noCount++;
    tauntBubble.textContent = taunts[Math.min(noCount - 1, taunts.length - 1)];

    const maxDeltaX = 90;
    const maxDeltaY = 40;

    const randomX = (Math.random() * 2 - 1) * maxDeltaX;
    const randomY = (Math.random() * 2 - 1) * maxDeltaY;
    const randomRot = (Math.random() - 0.5) * 25;

    btnNo.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRot}deg) scale(0.9)`;
    btnNo.style.background = '#ffe5ec';

    const currentScale = 1 + Math.min(noCount * 0.05, 0.25);
    btnYes.style.transform = `scale(${currentScale})`;

    CuteAudio.playCutePop();
  }

  btnNo.addEventListener('mouseenter', evadeNoButton);
  btnNo.addEventListener('touchstart', evadeNoButton);
  btnNo.addEventListener('click', evadeNoButton);

  // Yes Button Click (First time: Tease modal!)
  btnYes.addEventListener('click', () => {
    if (!hasTeasedOnce) {
      hasTeasedOnce = true;
      teaseModal.classList.add('active');
      CuteAudio.playCutePop();
    } else {
      triggerFinalCelebration();
    }
  });

  if (btnRealForgive) {
    btnRealForgive.addEventListener('click', () => {
      teaseModal.classList.remove('active');
      triggerFinalCelebration();
    });
  }

  function triggerFinalCelebration() {
    buttonsArena.style.display = 'none';
    tauntBubble.style.display = 'none';
    apologyTitle.style.display = 'none';
    apologySub.style.display = 'none';

    if (apologyGif) {
      apologyGif.src = 'https://media1.tenor.com/m/hlr3kptkdu4AAAAC/bubu-dudu.gif';
    }

    celebrationBox.style.display = 'block';

    ConfettiEngine.shoot(120);
    setTimeout(() => ConfettiEngine.shoot(100), 500);
    setTimeout(() => ConfettiEngine.shoot(120), 1100);

    CuteAudio.playCutePop();
  }
})();
