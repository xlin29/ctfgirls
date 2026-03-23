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

    resultDiv.className = data.success ? 'result-msg success' : 'result-msg error';
    resultDiv.style.display = 'block';
    resultDiv.textContent = data.message;

    if (data.success) {
      flagInput.style.borderColor = '#50c878';
      createConfetti();

      // Show "Learn More" button after a moment
      if (data.learnMoreUrl) {
        setTimeout(() => {
          resultDiv.innerHTML = `
            🎉 Correct! Amazing work!
            <a href="${data.learnMoreUrl}" style="
              display: inline-block;
              margin-left: 12px;
              padding: 6px 18px;
              background: linear-gradient(135deg, #C41E3A, #a01830);
              color: white;
              text-decoration: none;
              border-radius: 16px;
              font-size: 0.9em;
              font-weight: 500;
              animation: pulse 1.5s ease-in-out infinite;
            ">Learn What You Just Did →</a>
          `;
        }, 1500);
      }
    }
  } catch (err) {
    resultDiv.className = 'result-msg error';
    resultDiv.style.display = 'block';
    resultDiv.textContent = 'Something went wrong — please try again';
  }
}

function createConfetti() {
  const colors = ['#C41E3A', '#e8556d', '#50c878', '#60b0ff', '#f5a623', '#a855f7'];
  for (let i = 0; i < 60; i++) {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
      position: fixed;
      width: ${Math.random() * 10 + 5}px;
      height: ${Math.random() * 10 + 5}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${Math.random() * 100}vw;
      top: -10px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      pointer-events: none;
      z-index: 9999;
      animation: confettiFall ${Math.random() * 2 + 1.5}s ease-out forwards;
    `;
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 3500);
  }

  if (!document.getElementById('confetti-style')) {
    const style = document.createElement('style');
    style.id = 'confetti-style';
    style.textContent = `
      @keyframes confettiFall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.85; transform: scale(1.04); }
      }
    `;
    document.head.appendChild(style);
  }
}
