// Particle Background Effect
const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");

let width, height, particles;

function init() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  particles = [];

  const particleCount = Math.floor((width * height) / 15000); // Responsive particle density

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

class Particle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = Math.random() * 2;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.color = Math.random() > 0.5 ? "#7000ff" : "#00e5ff";
    this.alpha = Math.random() * 0.5 + 0.1;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x > width) this.x = 0;
    else if (this.x < 0) this.x = width;

    if (this.y > height) this.y = 0;
    else if (this.y < 0) this.y = height;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, width, height);

  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();

    // Connect particles that are close
    for (let j = i; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(112, 0, 255, ${0.1 - distance / 1000})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateParticles);
}

// Handle Resize
window.addEventListener("resize", () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

// Initialize and start animation
init();
animateParticles();

// Scroll Reveal Observer
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll(".scroll-reveal").forEach((el) => {
  observer.observe(el);
});

// Interactive 3D Card Effect on Mouse Move
const hrVisual = document.querySelector(".hero-visual");
const headset = document.querySelector(".vr-headset-proxy");

if (hrVisual && headset) {
  hrVisual.addEventListener("mousemove", (e) => {
    const rect = hrVisual.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const xAxis = (centerX - x) / 10;
    const yAxis = (y - centerY) / 10;

    headset.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    headset.style.transition = "none"; // remove transition for smooth instant tracking
  });

  hrVisual.addEventListener("mouseleave", () => {
    headset.style.transform = `translateY(0) rotateX(10deg) rotateY(-10deg)`;
    headset.style.transition = "transform 0.5s ease";
  });

  // reset transition on enter
  hrVisual.addEventListener("mouseenter", () => {
    headset.style.transition = "transform 0.1s ease";
  });
}
