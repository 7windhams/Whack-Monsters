const HITS_PER_LEVEL = 10;
const MAX_LEVEL = 10;

const gameBoard = document.getElementById('gameBoard');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const speedDisplay = document.getElementById('speedDisplay');
const hitsNeededDisplay = document.getElementById('hitsNeeded');
const gameOverDiv = document.getElementById('gameOver');
const finalScoreDisplay = document.getElementById('finalScore');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
const playAgainButton = document.getElementById('playAgainButton');

let score = 0;
let level = 1;
let speed = 1000;
let hitsThisLevel = 0;
let isGameRunning = false;
let gameInterval = null;

// Create 9 holes
function createHoles(num = 9) {
  gameBoard.innerHTML = '';
  for (let i = 0; i < num; i++) {
    const hole = document.createElement('div');
    hole.classList.add('hole');
    gameBoard.appendChild(hole);
  }
}

// Random hole selector
function randomHole() {
  const holes = document.querySelectorAll('.hole');
  const index = Math.floor(Math.random() * holes.length);
  return holes[index];
}

// Display monster in a hole
function showMonster() {
  if (!isGameRunning) return;

  const hole = randomHole();
  hole.innerHTML = '';

  const monster = document.createElement('div');
  monster.classList.add('monster', `level-${level}`);
  monster.innerHTML = '👹';
  monster.style.width = '100px';
  monster.style.height = '100px';
  monster.style.fontSize = '50px';
  monster.style.cursor = 'pointer';

  monster.style.borderRadius = '50%';
  monster.style.backgroundColor = '#ff6b6b';
  monster.style.border = '3px solid #fff';
  monster.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
  monster.style.display = 'flex';
  monster.style.alignItems = 'center';
  monster.style.justifyContent = 'center';
  monster.style.objectFit = 'cover';
  monster.style.overflow = 'hidden';

  monster.addEventListener('click', () => {
    if (!isGameRunning) return;

    score++;
    hitsThisLevel++;

    scoreDisplay.textContent = score;
    const remainingHits = HITS_PER_LEVEL - hitsThisLevel;
    hitsNeededDisplay.textContent = remainingHits;

    hole.innerHTML = '';
    checkLevelUp();
  });

  hole.appendChild(monster);

  setTimeout(() => {
    if (hole.contains(monster)) {
      hole.innerHTML = '';
    }
  }, speed);
}

// Check if level is complete
function checkLevelUp() {
  if (hitsThisLevel >= HITS_PER_LEVEL) {
    if (level >= MAX_LEVEL) {
      endGame();
      return;
    }

    level++;
    hitsThisLevel = 0;
    speed = Math.max(200, speed - 80);

    levelDisplay.textContent = level;
    speedDisplay.textContent = speed + 'ms';
    hitsNeededDisplay.textContent = HITS_PER_LEVEL;

    updateButtonColors();
    clearInterval(gameInterval);
    gameInterval = setInterval(showMonster, speed);
  }
}

// Start the game
function startGame() {
  if (isGameRunning) return;

  isGameRunning = true;
  document.body.classList.add('game-started');
  gameOverDiv.style.display = 'none';
  score = 0;
  level = 1;
  speed = 1000;
  hitsThisLevel = 0;

  scoreDisplay.textContent = score;
  levelDisplay.textContent = level;
  speedDisplay.textContent = speed + 'ms';
  hitsNeededDisplay.textContent = HITS_PER_LEVEL;

  createHoles();
  updateButtonColors();

  clearInterval(gameInterval);
  gameInterval = setInterval(showMonster, speed);
}

// Reset game
function resetGame() {
  isGameRunning = false;
  document.body.classList.remove('game-started');
  clearInterval(gameInterval);
  score = 0;
  level = 1;
  speed = 1000;
  hitsThisLevel = 0;

  scoreDisplay.textContent = score;
  levelDisplay.textContent = level;
  speedDisplay.textContent = speed + 'ms';
  hitsNeededDisplay.textContent = HITS_PER_LEVEL;

  finalScoreDisplay.textContent = '';
  createHoles();
  updateButtonColors();
  gameOverDiv.style.display = 'none';
}

// End game
function endGame() {
  isGameRunning = false;
  clearInterval(gameInterval);
  const holes = document.querySelectorAll('.hole');
  holes.forEach(hole => hole.innerHTML = '');

  finalScoreDisplay.textContent = score;
  gameOverDiv.style.display = 'block';
}

// Update background and buttons
function updateButtonColors() {
  const body = document.body;

  // Remove all previous level classes
  for (let i = 1; i <= MAX_LEVEL; i++) {
    startButton.classList.remove(`level-${i}-btn`);
    resetButton.classList.remove(`level-${i}-btn`);
    body.classList.remove(`level-${i}-bg`);
  }

  // Add current level classes
  startButton.classList.add(`level-${level}-btn`);
  resetButton.classList.add(`level-${level}-btn`);
  body.classList.add(`level-${level}-bg`);
  
  // Remove any inline background styles that might interfere
  body.style.background = '';
  
  console.log(`Level ${level} background applied: level-${level}-bg`);
}

// Make all whack images round
function forceRoundImages() {
  const whackImages = document.querySelectorAll('.whack-img, img');
  whackImages.forEach(img => {
    img.style.borderRadius = '50%';
    img.style.width = '400px';
    img.style.height = '400px';
    img.style.objectFit = 'cover';
    img.style.overflow = 'hidden';
    img.style.clipPath = 'circle(50%)';
    img.classList.add('force-round');
  });
}

// Yellow background on first load
function forceYellowBackground() {
  if (!document.body.classList.contains('game-started')) {
    document.body.style.background = 'linear-gradient(135deg, #f1c40f, #f39c12)';
  }
}

// Event listeners
startButton.addEventListener('click', startGame);
resetButton.addEventListener('click', resetGame);
playAgainButton.addEventListener('click', startGame);

// Initial load
createHoles();
updateButtonColors();
scoreDisplay.textContent = score;
levelDisplay.textContent = level;
speedDisplay.textContent = speed + 'ms';
hitsNeededDisplay.textContent = HITS_PER_LEVEL;

// Force visuals
window.addEventListener('load', () => {
  forceRoundImages();
  forceYellowBackground();
});
