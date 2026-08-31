/* ==========================================================================
   BUBU & DUDU BIRTHDAY & APOLOGY SITE — JAVASCRIPT
   - Web Audio synthesizer for cute birthday melody
   - Confetti & Floating Hearts Engine
   - Interactive Gussa Meter (99% -> 0%)
   - Forgiveness Game with Evading "Nahi" Button & "Itni Jaldi?!" Tease Modal
   - Coupon Redemption Stamps
   ========================================================================== */

// ─── 1. FLOATING HEARTS & DOODLES ENGINE ───
(function initFloatingElements() {
  const container = document.getElementById('floatingLayer');
  if (!container) return;

  const emojis = ['💖', '🌸', '✨', '🎂', '💕', '🍓', '🧸', '🍬', '🌷'];

  function createFloatingItem() {
    const el = document.createElement('span');
    el.className = 'floating-icon';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = Math.random() * 95 + 'vw';
    const duration = Math.random() * 8 + 8;
    el.style.animationDuration = duration + 's';
    el.style.fontSize = (Math.random() * 16 + 14) + 'px';
    container.appendChild(el);

    setTimeout(() => {
      el.remove();
    }, duration * 1000);
  }

  // Spawn initial burst
  for (let i = 0; i < 12; i++) {
    setTimeout(createFloatingItem, i * 400);
  }
  // Periodic spawning
  setInterval(createFloatingItem, 1200);
})();


// ─── 2. CONFETTI CANVAS ENGINE ───
const ConfettiEngine = (function () {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return { shoot: () => {} };
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
      r: Math.random() * 8 + 4,
      d: Math.random() * 50,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.floor(Math.random() * 10) - 10,
      tiltAngle: 0,
      tiltAngleInc: Math.random() * 0.08 + 0.04,
      shape: Math.random() > 0.4 ? 'circle' : (Math.random() > 0.5 ? 'rect' : 'heart'),
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
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
        drawHeart(p.x, p.y, p.r * 1.5, p.color);
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

  function shoot(amount = 80, originX, originY) {
    for (let i = 0; i < amount; i++) {
      particles.push(createParticle(originX, originY));
    }
    if (!isRunning) {
      isRunning = true;
      requestAnimationFrame(loop);
    }
  }

  return { shoot };
})();


// ─── 3. WEB AUDIO SYNTHESIZER FOR CUTE BIRTHDAY TUNE ───
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

  // Play a soft sweet chiptune note
  function playNote(freq, start, duration, type = 'sine', gainVal = 0.15) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);

    gain.gain.setValueAtTime(0.001, start);
    gain.gain.exponentialRampToValueAtTime(gainVal, start + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(start);
    osc.stop(start + duration);
  }

  // Happy Birthday Melody in C Major
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
      // Add a sparkling harmonic
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
      textSpan.textContent = 'Pause Music ⏸️';
      playMelodyLoop();
    } else {
      button.classList.remove('playing');
      textSpan.textContent = 'Play Music 🎵';
      clearTimeout(timerId);
    }
  }

  function playCuteSoundEffect() {
    initAudio();
    if (!audioCtx) return;
    let now = audioCtx.currentTime;
    playNote(523.25, now, 0.15, 'sine', 0.2);
    playNote(659.25, now + 0.1, 0.2, 'sine', 0.2);
    playNote(783.99, now + 0.2, 0.35, 'sine', 0.2);
  }

  return { toggle, playCuteSoundEffect };
})();

// Music button listener
const musicBtn = document.getElementById('musicBtn');
const musicText = document.getElementById('musicText');
if (musicBtn) {
  musicBtn.addEventListener('click', () => {
    CuteAudio.toggle(musicBtn, musicText);
  });
}


// ─── 4. INTERACTIVE GUSSA METER ───
(function initGussaMeter() {
  const gussaVal = document.getElementById('gussaVal');
  const gussaFill = document.getElementById('gussaFill');
  const gussaCaption = document.getElementById('gussaCaption');
  const btnCoolDown = document.getElementById('btnCoolDown');
  const gussaTrack = document.getElementById('gussaTrack');
  const heroGif = document.getElementById('heroGif');

  let currentLevel = 99;

  const captions = [
    { min: 80, text: 'Arey re, itna gussa?! Niche click karke thanda karo! 👇', valText: '99% (Danger Zone 🚨)' },
    { min: 50, text: 'Thoda kam hua... par abhi bhi dangerous hai! Ek baar aur click karo! 🧊', valText: '65% (High Alert ⚠️)' },
    { min: 25, text: '50% gussa bacha hai... momos ya ice-cream chahiye kya? 🍦', valText: '40% (Cooling Down 🍧)' },
    { min: 1, text: 'Almost shaant! Bas ek smile bachi hai babu 😊', valText: '15% (Almost Sweet 🌸)' },
    { min: 0, text: '🎉 0% GUSSA! Yayyy! Full Pyar Mode Activated! 💖🥰', valText: '0% (Totally Calm & Sweet 🍯)' },
  ];

  function updateDisplay() {
    gussaFill.style.width = currentLevel + '%';
    const match = captions.find(c => currentLevel >= c.min);
    if (match) {
      gussaVal.textContent = match.valText;
      gussaCaption.textContent = match.text;
    }

    if (currentLevel === 0) {
      btnCoolDown.textContent = '🥰 Gussa Khatam! You Are The Sweetest!';
      btnCoolDown.style.background = '#2a9d8f';
      btnCoolDown.style.color = '#ffffff';
      btnCoolDown.style.borderColor = '#2a9d8f';
      if (heroGif) {
        heroGif.src = 'https://media1.tenor.com/m/q_Sav516k1IAAAAC/bubu-dudu-dudu-dancing.gif';
      }
      ConfettiEngine.shoot(60);
      CuteAudio.playCuteSoundEffect();
    }
  }

  function reduceAnger() {
    if (currentLevel > 0) {
      currentLevel = Math.max(0, currentLevel - 25);
      updateDisplay();
      CuteAudio.playCuteSoundEffect();
      ConfettiEngine.shoot(25);
    }
  }

  if (btnCoolDown) btnCoolDown.addEventListener('click', reduceAnger);
  if (gussaTrack) gussaTrack.addEventListener('click', reduceAnger);
})();


// ─── 5. LOVE COUPONS REDEEM FUNCTION ───
window.redeemCoupon = function (cardEl) {
  if (cardEl.classList.contains('redeemed')) return;
  cardEl.classList.add('redeemed');
  const stamp = cardEl.querySelector('.coupon-stamp');
  if (stamp) {
    stamp.textContent = 'CLAIMED BY QUEEN! ✅';
  }
  CuteAudio.playCuteSoundEffect();
  ConfettiEngine.shoot(40);
};


// ─── 6. THE FORGIVENESS GAME WITH "NAHI" EVASION & "ITNI JALDI?!" TEASE ───
(function initForgivenessGame() {
  const btnYes = document.getElementById('btnYes');
  const btnNo = document.getElementById('btnNo');
  const tauntBubble = document.getElementById('tauntBubble');
  const buttonsArena = document.getElementById('buttonsArena');
  const teaseModal = document.getElementById('teaseModal');
  const btnRealForgive = document.getElementById('btnRealForgive');
  const celebrationBox = document.getElementById('celebrationBox');
  const apologyGif = document.getElementById('apologyGif');

  if (!btnYes || !btnNo) return;

  let noCount = 0;
  let hasTeasedOnce = false;

  const taunts = [
    'Arey aise kaise?! Pakad ke dikhao pehle! 🏃‍♂️💨',
    'Nahi wala button toh bas dikhane ke liye tha! 😜',
    'Dekho Dudu ro raha hai kone me jaake 😭',
    'Kitna bhav khaaogi aaj? Birthday hai reham karo! 🥺👉👈',
    'Haath dukh jayenge click karte karte, maan jao na! 😂',
    'Main chocolate aur momos bhi khilaunga please! 🍫🥟',
    'Nahi bolne ka koi option hi nahi hai madam! 💕',
    'Bas ab Haan pe click karo sweetu! 🥰',
  ];

  function evadeNoButton(e) {
    if (e) e.preventDefault();
    noCount++;
    tauntBubble.textContent = taunts[Math.min(noCount - 1, taunts.length - 1)];

    // Get arena boundaries
    const arenaRect = buttonsArena.getBoundingClientRect();
    const btnRect = btnNo.getBoundingClientRect();

    const maxDeltaX = Math.min(arenaRect.width / 2 - 40, 180);
    const maxDeltaY = 60;

    const randomX = (Math.random() * 2 - 1) * maxDeltaX;
    const randomY = (Math.random() * 2 - 1) * maxDeltaY;
    const randomRot = (Math.random() - 0.5) * 30;

    btnNo.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRot}deg) scale(0.92)`;
    btnNo.style.background = '#ffe5ec';

    // Grow Yes button slightly each time No is attempted
    const currentScale = 1 + Math.min(noCount * 0.05, 0.35);
    btnYes.style.transform = `scale(${currentScale})`;

    CuteAudio.playCuteSoundEffect();
  }

  // Hover & touch & click for No button
  btnNo.addEventListener('mouseenter', evadeNoButton);
  btnNo.addEventListener('touchstart', evadeNoButton);
  btnNo.addEventListener('click', evadeNoButton);

  // YES BUTTON CLICK (First time -> show Tease Modal!)
  btnYes.addEventListener('click', () => {
    if (!hasTeasedOnce) {
      // First time: Tease her!
      hasTeasedOnce = true;
      teaseModal.classList.add('active');
      CuteAudio.playCuteSoundEffect();
    } else {
      // If already teased, complete celebration
      triggerFinalCelebration();
    }
  });

  // TEASE MODAL - REAL FORGIVE BUTTON CLICK
  if (btnRealForgive) {
    btnRealForgive.addEventListener('click', () => {
      teaseModal.classList.remove('active');
      triggerFinalCelebration();
    });
  }

  function triggerFinalCelebration() {
    // Hide buttons & taunt
    buttonsArena.style.display = 'none';
    tauntBubble.style.display = 'none';

    // Change apology gif to love kisses
    if (apologyGif) {
      apologyGif.src = 'https://media1.tenor.com/m/hlr3kptkdu4AAAAC/bubu-dudu.gif';
    }

    // Show celebration card
    celebrationBox.style.display = 'block';

    // Massive Confetti Explosion
    ConfettiEngine.shoot(120);
    setTimeout(() => ConfettiEngine.shoot(100), 500);
    setTimeout(() => ConfettiEngine.shoot(120), 1200);

    CuteAudio.playCuteSoundEffect();

    // Scroll smoothly to celebration
    celebrationBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
})();
