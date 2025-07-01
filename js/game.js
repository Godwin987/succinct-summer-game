document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const scoreDisplay = document.getElementById('score');
  const gameOverScreen = document.getElementById('game-over');
  const finalScoreDisplay = document.getElementById('final-score');
  const startScreen = document.getElementById('start-screen');
  const startButton = document.getElementById('start-button');
  const playAgainButton = document.getElementById('play-again-button');

  // Images
  const basketImg = new Image();
  basketImg.src = 'assets/basket.png';
  basketImg.onload = () => { console.log('Basket image loaded:', basketImg.naturalWidth, basketImg.naturalHeight); };
  basketImg.onerror = () => { console.error('Failed to load basket image!'); };

  const coconutImg = new Image();
  coconutImg.src = 'assets/coconut.jpg';

  const palmTreeImg = new Image();
  palmTreeImg.src = 'assets/palm_tree.jpg';

  const beachgoerImg = new Image();
  beachgoerImg.src = 'assets/beachgoer.png';

  let score = 0;
  let misses = 0;
  let gameRunning = false;

  // Beachgoer (player) properties
  const beachgoer = { x: 140, y: canvas.height - 140, width: 120, height: 120, speed: 7 };
  // The basket will be drawn at a fixed offset and scaled to fit the hand
  const basket = { x: beachgoer.x + 10, y: beachgoer.y + 50, width: 76, height: 76 };
  let coconuts = [];
  const coconut = { width: 16, height: 16, speed: 2 };

  // Track arrow key state
  const keys = { left: false, right: false };

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') keys.left = true;
    if (e.key === 'ArrowRight') keys.right = true;
  });
  document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') keys.left = false;
    if (e.key === 'ArrowRight') keys.right = false;
  });

  // Button event listeners
  startButton.addEventListener('click', startGame);
  playAgainButton.addEventListener('click', startGame);

  function updateBeachgoer() {
    if (keys.left) beachgoer.x -= beachgoer.speed;
    if (keys.right) beachgoer.x += beachgoer.speed;
    // Clamp to canvas
    beachgoer.x = Math.max(0, Math.min(canvas.width - beachgoer.width, beachgoer.x));
    // Clamp y to keep beachgoer above the bottom
    beachgoer.y = Math.min(canvas.height - beachgoer.height, beachgoer.y);
    // Basket follows beachgoer (adjust these offsets for a perfect fit)
    basket.x = beachgoer.x + 10;
    basket.y = beachgoer.y + 50;
    basket.width = 76;
    basket.height = 76;
  }

  function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw palm tree (background) - stretch to fill canvas
    ctx.drawImage(palmTreeImg, 0, 0, canvas.width, canvas.height);

    updateBeachgoer();
    // Draw beachgoer
    ctx.drawImage(beachgoerImg, beachgoer.x, beachgoer.y, beachgoer.width, beachgoer.height);
    // Draw basket (follows beachgoer)
    ctx.drawImage(basketImg, basket.x, basket.y, basket.width, basket.height);

    // Spawn coconut
    if (Math.random() < 0.03) {
      coconuts.push({ x: Math.random() * (canvas.width - coconut.width), y: 0 });
    }

    // Move and draw coconuts
    coconuts.forEach((c, i) => {
      c.y += coconut.speed;
      ctx.drawImage(coconutImg, c.x, c.y, coconut.width, coconut.height);

      // Catching
      if (
        c.y + coconut.height > basket.y &&
        c.x + coconut.width > basket.x &&
        c.x < basket.x + basket.width
      ) {
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        coconuts.splice(i, 1);
      } else if (c.y > canvas.height) {
        misses++;
        coconuts.splice(i, 1);
        if (misses >= 5) endGame();
      }
    });

    requestAnimationFrame(gameLoop);
  }

  function startGame() {
    score = 0;
    misses = 0;
    coconuts = [];
    gameRunning = true;
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    gameOverScreen.classList.remove('show');
    scoreDisplay.style.display = 'block';
    scoreDisplay.textContent = `Score: ${score}`;
    coconut.speed = 2;
    canvas.style.display = 'block';
    gameLoop();
  }

  function endGame() {
    gameRunning = false;
    gameOverScreen.style.display = 'block';
    setTimeout(() => gameOverScreen.classList.add('show'), 10);
    scoreDisplay.style.display = 'none';
    finalScoreDisplay.textContent = score;
    canvas.style.display = 'none';
  }

  // Show start screen immediately for better user experience
  startScreen.style.display = 'block';
  scoreDisplay.style.display = 'none';
  gameOverScreen.style.display = 'none';
  canvas.style.display = 'none';
  
  // Wait until images are loaded before allowing game to start
  let imagesLoaded = 0;
  [basketImg, coconutImg, palmTreeImg, beachgoerImg].forEach((img) => {
    img.onload = () => {
      imagesLoaded++;
    };
  });
});
