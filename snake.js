const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('scoreDisplay');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

const FOOD_TYPES = {
  NORMAL: { color: 'red', speedMultiplier: 1 },
  FAST: { color: 'blue', speedMultiplier: 2 },
  SLOW: { color: 'yellow', speedMultiplier: 0.5 }
};

const BASE_SPEED = 100;

let snake = [{ x: 10, y: 10 }];
let direction = getRandomDirection(); // Replace the initial direction = { x: 0, y: 0 }
let food = {
  x: 15,
  y: 15,
  type: FOOD_TYPES.NORMAL
};
let score = 0;
let isPaused = false;
let countdown = 0;
let speedMultiplier = 1;

function gameLoop() {
  if (!isPaused) {
    update();
  }
  draw();
}

function update() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
    speedMultiplier = food.type.speedMultiplier;
    generateNewFood();
    updateGameSpeed();
  } else {
    snake.pop();
  }

  snake.unshift(head);

  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount || snakeCollision(head)) {
    resetGame();
  }
}

function draw() {
  // Create a gradient background
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#d2e7f7'); // light blue at the top
  gradient.addColorStop(1, '#ffffff'); // white at the bottom
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add a border to indicate the game limits.
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'green';
  snake.forEach(segment => ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize));

  ctx.fillStyle = food.type.color;
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
  
  if (isPaused) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.font = '30px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(`Game Over! Score: ${score}`, canvas.width/2, canvas.height/2);
    ctx.fillText(`Restarting in ${Math.ceil(countdown/1000)}...`, canvas.width/2, canvas.height/2 + 40);
  }
}

function snakeCollision(head) {
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      return true;
    }
  }
  return false;
}

// Add this new function
function getRandomDirection() {
  const directions = [
    { x: 1, y: 0 },   // right
    { x: -1, y: 0 },  // left
    { x: 0, y: 1 },   // down
    { x: 0, y: -1 }   // up
  ];
  return directions[Math.floor(Math.random() * directions.length)];
}

function resetGame() {
  isPaused = true;
  countdown = 3000;
  speedMultiplier = 1;
  
  const countdownInterval = setInterval(() => {
    countdown -= 100;
    if (countdown <= 0) {
      clearInterval(countdownInterval);
      isPaused = false;
      snake = [{ x: 10, y: 10 }];
      direction = getRandomDirection(); // Set random initial direction
      score = 0;
      scoreDisplay.textContent = `Score: ${score}`;
      updateGameSpeed();
    }
  }, 100);
}

function generateNewFood() {
  const randomType = Math.random();
  let type;
  if (randomType < 0.7) {
    type = FOOD_TYPES.NORMAL;
  } else if (randomType < 0.85) {
    type = FOOD_TYPES.FAST;
  } else {
    type = FOOD_TYPES.SLOW;
  }

  food = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount),
    type: type
  };
}

function updateGameSpeed() {
  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, BASE_SPEED / speedMultiplier);
}

document.addEventListener('keydown', event => {
  switch (event.key) {
    case 'ArrowUp':
      if (direction.y === 0) direction = { x: 0, y: -1 };
      break;
    case 'ArrowDown':
      if (direction.y === 0) direction = { x: 0, y: 1 };
      break;
    case 'ArrowLeft':
      if (direction.x === 0) direction = { x: -1, y: 0 };
      break;
    case 'ArrowRight':
      if (direction.x === 0) direction = { x: 1, y: 0 };
      break;
  }
});

let gameInterval;
updateGameSpeed();
