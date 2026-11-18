// ============ Preloader ============
const preloader = document.getElementById("preloader");
const preloaderBar = preloader.querySelector(".preloader__bar span");
let loadProgress = 0;
const progressTimer = setInterval(() => {
  loadProgress += Math.floor(Math.random() * 20) + 10;
  if (loadProgress >= 100) {
    loadProgress = 100;
    clearInterval(progressTimer);
    setTimeout(() => preloader.classList.add("done"), 300);
  }
  preloaderBar.style.width = loadProgress + "%";
}, 180);

// ============ Custom cursor ============
const cursor = document.getElementById("cursor");
const cursorFollower = document.getElementById("cursorFollower");
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + "px";
  cursor.style.top = mouseY + "px";
});

function animateCursor() {
  followerX += (mouseX - followerX) * 0.15;
  followerY += (mouseY - followerY) * 0.15;
  cursorFollower.style.left = followerX + "px";
  cursorFollower.style.top = followerY + "px";
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll("a, button, [data-cursor]").forEach((el) => {
  el.addEventListener("mouseenter", () => cursorFollower.classList.add("hover"));
  el.addEventListener("mouseleave", () => cursorFollower.classList.remove("hover"));
});

// ============ Nav scroll state & scroll progress ============
const nav = document.getElementById("nav");
const progressBar = document.getElementById("progressBar");
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav__link");

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  nav.classList.toggle("scrolled", scrollY > 50);

  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (scrollY / docHeight) * 100 + "%";

  // Active link highlighting
  let current = "";
  sections.forEach((section) => {
    if (scrollY >= section.offsetTop - 150) current = section.id;
  });
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === "#" + current);
  });
});

// ============ Mobile menu ============
const navToggle = document.getElementById("navToggle");
const navLinksContainer = document.getElementById("navLinks");
navToggle.addEventListener("click", () => {
  navToggle.classList.toggle("active");
  navLinksContainer.classList.toggle("open");
});
navLinksContainer.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navToggle.classList.remove("active");
    navLinksContainer.classList.remove("open");
  });
});

// ============ Reveal on scroll ============
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 0.08 + "s";
  revealObserver.observe(el);
});

// ============ Count-up stats ============
const counters = document.querySelectorAll(".stat__num");
let countersAnimated = false;
const statsSection = document.querySelector(".about__stats");
const statsObserver = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting && !countersAnimated) {
      countersAnimated = true;
      counters.forEach((counter) => {
        const target = +counter.getAttribute("data-count");
        const duration = 1600;
        const start = performance.now();
        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          counter.textContent = Math.floor(eased * target);
          if (progress < 1) requestAnimationFrame(update);
          else counter.textContent = target;
        }
        requestAnimationFrame(update);
      });
    }
  },
  { threshold: 0.3 }
);
if (statsSection) statsObserver.observe(statsSection);

// ============ Skill bars ============
const skillBars = document.querySelectorAll(".skill__track span");
const skillsSection = document.querySelector(".skills__grid");
let skillsAnimated = false;
const skillsObserver = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting && !skillsAnimated) {
      skillsAnimated = true;
      skillBars.forEach((bar) => {
        bar.style.width = bar.getAttribute("data-level") + "%";
      });
    }
  },
  { threshold: 0.2 }
);
if (skillsSection) skillsObserver.observe(skillsSection);

// ============ Footer year ============
document.getElementById("year").textContent = new Date().getFullYear();

// ============ Hero particle canvas ============
(function initCanvas() {
  const canvas = document.getElementById("heroCanvas");
  const ctx = canvas.getContext("2d");
  let width, height, particles;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  function init() {
    resize();
    particles = [];
    const count = Math.min(Math.floor(width / 14), 100);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.5 + 0.3,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        color: Math.random() > 0.5 ? "123, 92, 255" : "0, 212, 255",
      });
    }
  }
  function draw() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, 0.6)`;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(123, 92, 255, ${0.15 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    });
    requestAnimationFrame(draw);
  }
  init();
  draw();
  window.addEventListener("resize", init);
})();
