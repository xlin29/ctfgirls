async function submitFlag(challenge) {
  const flagInput = document.getElementById('flagInput');
  const resultDiv = document.getElementById('result');
  const flag = flagInput.value.trim();

  if (!flag) {
    resultDiv.className = 'result-msg error';
    resultDiv.style.display = 'block';
    resultDiv.textContent = 'Please enter a flag before submitting!';
    return;
  }

  try {
    const response = await fetch('/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ challenge, flag }),
    });
    const data = await response.json();

    if (data.success) {
      // Keep the form visible so they can resubmit
      flagInput.style.borderColor = '#2d9e5a';
      resultDiv.className = 'result-msg success';
      resultDiv.style.display = 'block';
      resultDiv.textContent = '';

      // Show fullscreen celebration overlay
      showCelebration(data.learnMoreUrl);
    } else {
      resultDiv.className = 'result-msg error';
      resultDiv.style.display = 'block';
      resultDiv.innerHTML = '❌ Not quite — try again!';
      flagInput.classList.add('shake');
      setTimeout(() => flagInput.classList.remove('shake'), 500);
    }
  } catch (err) {
    resultDiv.className = 'result-msg error';
    resultDiv.style.display = 'block';
    resultDiv.textContent = 'Something went wrong — please try again';
  }
}

function showCelebration(learnMoreUrl) {
  // Inject animation styles
  if (!document.getElementById('celebrate-style')) {
    const style = document.createElement('style');
    style.id = 'celebrate-style';
    style.textContent = `
      @keyframes confettiFall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
      }
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20%, 60% { transform: translateX(-6px); }
        40%, 80% { transform: translateX(6px); }
      }
      .shake { animation: shake 0.4s ease; }
      @keyframes celebrateIn {
        0% { opacity: 0; transform: scale(0.5); }
        60% { transform: scale(1.05); }
        100% { opacity: 1; transform: scale(1); }
      }
      @keyframes pulseGlow {
        0%, 100% { box-shadow: 0 0 30px rgba(152,30,50,0.3); }
        50% { box-shadow: 0 0 60px rgba(152,30,50,0.6); }
      }
      @keyframes slideUp {
        0% { opacity: 0; transform: translateY(30px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      @keyframes starBurst {
        0% { transform: scale(0) rotate(0deg); opacity: 1; }
        50% { transform: scale(1.2) rotate(180deg); opacity: 0.8; }
        100% { transform: scale(0) rotate(360deg); opacity: 0; }
      }
      .celebrate-overlay {
        position: fixed; inset: 0; z-index: 10000;
        background: rgba(20,15,15,0.92);
        backdrop-filter: blur(8px);
        display: flex; align-items: center; justify-content: center;
        animation: celebrateIn 0.5s ease forwards;
      }
      .celebrate-box {
        text-align: center; padding: 50px 60px;
        animation: celebrateIn 0.6s ease 0.2s both;
      }
      .celebrate-emoji {
        font-size: 5em;
        animation: celebrateIn 0.5s ease 0.3s both;
        display: block; margin-bottom: 15px;
      }
      .celebrate-title {
        font-size: 2.8em; font-weight: 800; color: #ffffff;
        margin-bottom: 12px;
        animation: slideUp 0.5s ease 0.5s both;
      }
      .celebrate-sub {
        font-size: 1.2em; color: #c0c0c8; margin-bottom: 35px;
        animation: slideUp 0.5s ease 0.65s both;
      }
      .celebrate-btn {
        display: inline-block; padding: 16px 40px;
        background: linear-gradient(135deg, #981E32, #751526);
        color: white; text-decoration: none; border-radius: 30px;
        font-size: 1.15em; font-weight: 600; letter-spacing: 0.5px;
        animation: slideUp 0.5s ease 0.8s both, pulseGlow 2s ease-in-out 1.5s infinite;
        transition: transform 0.2s;
      }
      .celebrate-btn:hover { transform: scale(1.08); }
      .countdown {
        font-size: 0.85em; color: #666; margin-top: 15px;
        animation: slideUp 0.5s ease 0.9s both;
      }
    `;
    document.head.appendChild(style);
  }

  // Confetti burst
  launchConfetti(120);

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'celebrate-overlay';
  overlay.innerHTML = `
    <div class="celebrate-box">
      <span class="celebrate-emoji">🎉</span>
      <div class="celebrate-title">FLAG CAPTURED!</div>
      <div class="celebrate-sub">Amazing work, hacker!</div>
      <a href="${learnMoreUrl}" class="celebrate-btn">See What You Learned →</a>
      <div class="countdown">Auto-redirecting in <span id="countdown-num">5</span>s...</div>
    </div>
  `;
  document.body.appendChild(overlay);

  // Second wave of confetti
  setTimeout(() => launchConfetti(60), 800);

  // Click overlay background to dismiss
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      clearInterval(timer);
      overlay.remove();
    }
  });

  // Escape key to dismiss
  const escHandler = (e) => {
    if (e.key === 'Escape') {
      clearInterval(timer);
      overlay.remove();
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);

  // Countdown and auto-redirect
  let sec = 5;
  const timer = setInterval(() => {
    sec--;
    const el = document.getElementById('countdown-num');
    if (el) el.textContent = sec;
    if (sec <= 0) {
      clearInterval(timer);
      window.location.href = learnMoreUrl;
    }
  }, 1000);
}

function launchConfetti(count) {
  const colors = ['#981E32', '#bf4055', '#2d9e5a', '#2864b4', '#d4a017', '#8b45a6', '#e8556d', '#ffd700'];
  for (let i = 0; i < count; i++) {
    const confetti = document.createElement('div');
    const size = Math.random() * 12 + 6;
    const isCircle = Math.random() > 0.4;
    confetti.style.cssText = `
      position: fixed;
      width: ${size}px;
      height: ${isCircle ? size : size * 0.4}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${Math.random() * 100}vw;
      top: -20px;
      border-radius: ${isCircle ? '50%' : '2px'};
      pointer-events: none;
      z-index: 10001;
      animation: confettiFall ${Math.random() * 2.5 + 1.5}s ease-out ${Math.random() * 0.5}s forwards;
    `;
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 4500);
  }
}
