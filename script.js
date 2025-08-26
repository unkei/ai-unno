const colors = ['red', 'yellow', 'green', 'blue'];

function createDeck() {
  const deck = [];
  colors.forEach(color => {
    for (let n = 0; n <= 9; n++) {
      deck.push({ color, value: n });
    }
  });
  return shuffle(deck);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

let deck, playerHand, aiHand, discard;
let startTime, timerInterval;

function init() {
  deck = createDeck();
  playerHand = [];
  aiHand = [];
  for (let i = 0; i < 7; i++) {
    playerHand.push(deck.pop());
    aiHand.push(deck.pop());
  }
  discard = [deck.pop()];
  render();
  updateStatus('Your turn');
  startTimer();
}

function cardToHTML(card, index, clickable = true) {
  const textColor = card.color === 'yellow' ? '#000' : '#fff';
  const cursor = clickable ? '' : 'cursor:default;';
  return `<div class="card" data-index="${index}" style="background:${card.color};color:${textColor};${cursor}">${card.value}</div>`;
}

function render() {
  const playerDiv = document.getElementById('player-hand');
  playerDiv.innerHTML = playerHand.map((c, i) => cardToHTML(c, i)).join('');
  
  const aiDiv = document.getElementById('ai-hand');
  const aiCountDiv = document.getElementById('ai-count');
  aiCountDiv.textContent = `AI: ${aiHand.length} cards`;
  const aiCardsHTML = aiHand.map((_, i) => 
    `<div class="card card-back" data-index="${i}">UNNO</div>`
  ).join('');
  aiDiv.innerHTML = `<div id="ai-count">AI: ${aiHand.length} cards</div>` + aiCardsHTML;
  
  const discardDiv = document.getElementById('discard');
  discardDiv.innerHTML = cardToHTML(discard[discard.length - 1], 0, false);
}

function canPlay(card, top) {
  return card.color === top.color || card.value === top.value;
}

document.getElementById('player-hand').addEventListener('click', e => {
  if (!e.target.classList.contains('card')) return;
  const index = Number(e.target.dataset.index);
  const card = playerHand[index];
  const top = discard[discard.length - 1];
  if (canPlay(card, top)) {
    discard.push(card);
    playerHand.splice(index, 1);
    render();
    if (playerHand.length === 0) {
      updateStatus('You win!');
      showGameOverEffect(true);
      return;
    }
    setTimeout(aiTurn, 500);
  }
});

document.getElementById('draw-button').addEventListener('click', () => {
  if (deck.length === 0) reshuffle();
  playerHand.push(deck.pop());
  render();
  setTimeout(aiTurn, 500);
});

document.getElementById('restart-button').addEventListener('click', () => {
  resetGame();
});

function aiTurn() {
  updateStatus("AI's turn");
  const top = discard[discard.length - 1];
  let idx = aiHand.findIndex(c => canPlay(c, top));
  if (idx === -1) {
    if (deck.length === 0) reshuffle();
    aiHand.push(deck.pop());
    idx = aiHand.findIndex(c => canPlay(c, top));
  }
  if (idx !== -1) {
    const card = aiHand.splice(idx, 1)[0];
    discard.push(card);
  }
  render();
  if (aiHand.length === 0) {
    updateStatus('AI wins!');
    showGameOverEffect(false);
    return;
  }
  updateStatus('Your turn');
}

function reshuffle() {
  const top = discard.pop();
  deck = shuffle(discard);
  discard = [top];
}

function updateStatus(msg) {
  document.getElementById('status').textContent = msg;
}

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    document.getElementById('timer').textContent = `${elapsed}s`;
  }, 100);
}

function stopTimer() {
  clearInterval(timerInterval);
  return (Date.now() - startTime) / 1000;
}

function createConfetti() {
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];
  
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti');
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.top = '-20px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = Math.random() * 3 + 's';
    confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
    confetti.style.animation = 'confetti-fall ' + confetti.style.animationDuration + ' ease-out ' + confetti.style.animationDelay + ' forwards';
    document.body.appendChild(confetti);
    
    setTimeout(() => {
      confetti.remove();
    }, 5000);
  }
}

function showGameOverEffect(playerWon) {
  const drawButton = document.getElementById('draw-button');
  const restartButton = document.getElementById('restart-button');
  const overlay = document.getElementById('game-over-overlay');

  drawButton.style.display = 'none';
  restartButton.style.display = 'block';
  const time = stopTimer();
  let best = parseFloat(localStorage.getItem('bestTime'));
  if (playerWon) {
    if (!best || time < best) {
      best = time;
      localStorage.setItem('bestTime', best);
    }
    overlay.style.background = 'rgba(0, 0, 0, 0)';
    createConfetti();
  } else {
    overlay.style.background = 'rgba(0, 0, 0, 0.9)';
    document.getElementById('game').classList.add('shake');
    setTimeout(() => {
      document.getElementById('game').classList.remove('shake');
    }, 500);
  }
  const bestDisplay = best ? Number(best).toFixed(2) : '--';
  overlay.innerHTML = `<div>${playerWon ? 'You Win!' : 'You Lose!'}</div><div class="time">Time: ${time.toFixed(2)}s<br>Best: ${bestDisplay}s</div>`;
  overlay.classList.add('show');
}

function resetGame() {
  const drawButton = document.getElementById('draw-button');
  const restartButton = document.getElementById('restart-button');
  const overlay = document.getElementById('game-over-overlay');

  drawButton.style.display = 'block';
  restartButton.style.display = 'none';
  overlay.classList.remove('show');
  overlay.innerHTML = '';
  document.getElementById('timer').textContent = '0.00s';
  init();
}

function showSplash() {
  const splash = document.getElementById('splash');
  const logo = document.getElementById('corner-logo');

  function positionLogo() {
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.25;
    logo.style.width = size + 'px';
    logo.style.height = size + 'px';
  }

  setTimeout(() => {
    splash.style.transform = 'translate(-50%, -50%) scale(1.2)';
    splash.style.opacity = '0';

    setTimeout(() => {
      positionLogo();
      logo.style.display = 'block';
      // Force reflow to ensure display change is applied before opacity change
      logo.offsetHeight;
      logo.style.opacity = '1';
    }, 50);

    setTimeout(() => {
      splash.style.display = 'none';
    }, 300);
  }, 500);

  window.addEventListener('resize', positionLogo);
}

showSplash();
init();
