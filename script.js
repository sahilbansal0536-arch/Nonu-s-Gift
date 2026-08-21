/**
 * ==========================================================================
 * CONFIGURATION & EDITABLE TEXTS
 * Easily customize names, messages, and music files here.
 * ==========================================================================
 */
const CONFIG = {
  girlfriendName: "Nonu",
  yourName: "Sahil",

  // Audio files for each of the 6 pages
  songs: {
    page1: "assets/music/page1.mp3",
    page2: "assets/music/page2.mp3",
    page3: "assets/music/0.mp3",
    page4: "assets/music/Haareya.mp3",
    page5: "assets/music/page5.mp3",
    page6: "assets/music/page6.mp3"
  },

  // Page 3 Letter Content
  letterParagraphs: [
    "Nonu,",
    "I don't always know how to explain what you mean to me.",
    "You're somehow my favourite person to talk to, my favourite person to annoy, and one of the people I care about the most.",
    "You make ordinary moments feel special without even trying.",
    "And whenever things get difficult, I hope you remember that you don't have to handle everything alone.",
    "I'll always be here to support you, listen to you, annoy you a little, make you laugh, and stand beside you.",
    "Okayyy Babu...",
    "you're are My Better-Half",
    "This website could never be enough to express everything I feel for you. It’s just a little attempt from my side to put some of those feelings into words. ❤️"
  ],

  // Page 6 Final Emotional Thoughts
  finalThoughts: [
    "And if you ever wonder what you mean to me...",
    "You're someone I want to see happy.",
    "Someone I want to support when things get difficult.",
    "Someone I want to laugh with, tease, annoy and care for.",
    "Someone whose happiness genuinely matters to me.",
    "And someone I never want to take for granted.",
    "No matter how many pages I make, I don't think I'll ever be able to fit everything I feel for you into words."
  ]
};

/**
 * ==========================================================================
 * AUDIO ENGINE
 * Manages playback, state reflection, and browser autoplay unlocks.
 * ==========================================================================
 */
class AutoAudioEngine {
  constructor(songPath) {
    this.audio = new Audio(songPath);
    this.audio.loop = true;
    this.container = document.getElementById('music-player');
    this.disc = document.getElementById('music-disc');
    this.label = document.getElementById('music-label');

    if (this.container) {
      this.container.addEventListener('click', () => this.toggle());
    }

    this.attemptAutoPlay();
  }

  async attemptAutoPlay() {
    try {
      await this.audio.play();
      this.setPlayingState(true);
    } catch (e) {
      this.setPlayingState(false);
      const autoUnlock = async () => {
        try {
          await this.audio.play();
          this.setPlayingState(true);
        } catch (err) {}
        window.removeEventListener('click', autoUnlock);
        window.removeEventListener('touchstart', autoUnlock);
      };
      window.addEventListener('click', autoUnlock, { once: true });
      window.addEventListener('touchstart', autoUnlock, { once: true });
    }
  }

  setPlayingState(isPlaying) {
    if (isPlaying) {
      if (this.disc) this.disc.classList.add('playing');
      if (this.label) this.label.textContent = "Playing 🎵";
    } else {
      if (this.disc) this.disc.classList.remove('playing');
      if (this.label) this.label.textContent = "Tap to play 🎵";
    }
  }

  toggle() {
    if (this.audio.paused) {
      this.audio.play().then(() => this.setPlayingState(true));
    } else {
      this.audio.pause();
      this.setPlayingState(false);
    }
  }
}

/**
 * ==========================================================================
 * CANVAS PARTICLES (Petals & Fireflies)
 * ==========================================================================
 */
function initCanvasFX(type = 'petals') {
  const canvas = document.getElementById('fx-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const count = window.innerWidth < 640 ? 25 : 45;

  class CanvasParticle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * -height;
      this.size = Math.random() * 8 + 4;
      this.speedX = Math.random() * 1.5 - 0.75;
      this.speedY = Math.random() * 1.2 + 0.6;
      this.rotation = Math.random() * 360;
      this.rotSpeed = Math.random() * 2 - 1;
      this.opacity = Math.random() * 0.6 + 0.3;
      this.color = type === 'fireflies'
        ? `rgba(255, 235, 150, ${this.opacity})`
        : `rgba(255, 175, 195, ${this.opacity})`;
    }
    update() {
      this.x += this.speedX + Math.sin(this.y * 0.01) * 0.5;
      this.y += this.speedY;
      this.rotation += this.rotSpeed;
      if (this.y > height + 20) {
        this.reset();
        this.y = -10;
      }
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.fillStyle = this.color;
      if (type === 'fireflies') {
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.35, 0, Math.PI * 2);
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ffeaa7';
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-this.size, -this.size / 2, -this.size, this.size, 0, this.size * 1.5);
        ctx.bezierCurveTo(this.size, this.size, this.size, -this.size / 2, 0, 0);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  for (let i = 0; i < count; i++) particles.push(new CanvasParticle());

  function renderLoop() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(renderLoop);
  }
  renderLoop();
}

/**
 * Smooth transitions across HTML pages
 */
function navigateToPage(url) {
  const wrapper = document.querySelector('.page-wrapper');
  if (wrapper) wrapper.classList.add('page-leave');
  setTimeout(() => { window.location.href = url; }, 550);
}

document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.querySelector('.page-wrapper');
  if (wrapper) setTimeout(() => wrapper.classList.add('loaded'), 50);

  document.querySelectorAll('[data-target-url]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      navigateToPage(btn.getAttribute('data-target-url'));
    });
  });
});