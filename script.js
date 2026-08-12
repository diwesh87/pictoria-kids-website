// ---- Theme toggle ---------------------------------------------------
(function () {
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  const SUN = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>';
  const MOON = '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z"/>';

  function systemPrefersDark() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function apply(theme) {
    if (theme) root.setAttribute('data-theme', theme);
    else root.removeAttribute('data-theme');
    const isDark = theme ? theme === 'dark' : systemPrefersDark();
    icon.innerHTML = isDark ? MOON : SUN;
  }

  const saved = localStorage.getItem('pictoria-theme');
  apply(saved);

  btn.addEventListener('click', () => {
    const current = localStorage.getItem('pictoria-theme');
    const currentlyDark = current ? current === 'dark' : systemPrefersDark();
    const next = currentlyDark ? 'light' : 'dark';
    localStorage.setItem('pictoria-theme', next);
    apply(next);
  });
})();

// ---- Reveal-on-scroll -------------------------------------------------
(function () {
  const items = document.querySelectorAll('.reveal-up');
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('in-view'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  items.forEach((el) => io.observe(el));
})();

// ---- Interactive reveal demo ------------------------------------------
// Mirrors the real Progressive Reveal mode: the picture sharpens
// continuously as `progress` climbs from 0 to 1, guessing earlier scores
// more, and reaching full reveal without guessing just means the image
// stays clear (never "stuck blurred") until a guess is made.
(function () {
  const stage = document.getElementById('revealStage');
  const elephant = document.getElementById('elephant');
  const fill = document.getElementById('revealFill');
  const options = document.getElementById('revealOptions');
  const pointsBadge = document.getElementById('revealPoints');
  if (!stage) return;

  let resolved = false;
  let progress = 0.38;
  let tickTimer = null;

  function render() {
    fill.style.width = Math.round(progress * 100) + '%';
    const blurPx = resolved ? 0 : (1 - progress) * 16;
    const scale = resolved ? 1 : 1 + (1 - progress) * 0.35;
    elephant.style.filter = 'blur(' + blurPx.toFixed(1) + 'px)';
    elephant.style.transform = 'scale(' + scale.toFixed(3) + ')';
  }

  function startTicking() {
    clearInterval(tickTimer);
    tickTimer = setInterval(() => {
      if (resolved) return;
      progress = Math.min(1, progress + 0.012);
      render();
      if (progress >= 1) clearInterval(tickTimer);
    }, 120);
  }

  function pointsFor(p) {
    if (p <= 0.08) return 100;
    if (p <= 0.4) return 75;
    if (p <= 0.75) return 50;
    return 25;
  }

  function guess(isCorrect) {
    if (resolved) return;
    if (!isCorrect) return; // gentle: a miss just doesn't do anything drastic, matching "never a red X"
    resolved = true;
    clearInterval(tickTimer);
    const pts = pointsFor(progress);
    render();
    pointsBadge.textContent = '+' + pts + ' points';
    pointsBadge.classList.add('show');
    [...options.children].forEach((b) => {
      if (b.dataset.answer === 'true') b.classList.add('correct');
      b.disabled = true;
    });
    setTimeout(reset, 2400);
  }

  function reset() {
    resolved = false;
    progress = 0.38;
    pointsBadge.classList.remove('show');
    [...options.children].forEach((b) => {
      b.classList.remove('correct');
      b.disabled = false;
    });
    render();
    startTicking();
  }

  [...options.children].forEach((b) => {
    b.addEventListener('click', () => guess(b.dataset.answer === 'true'));
  });

  render();
  startTicking();
})();
