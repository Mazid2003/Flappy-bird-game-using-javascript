const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 500;

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const scoreDisplay = document.getElementById("score");

let bird = { x: 50, y: 250, width: 30, height: 30, velocity: 0, gravity: 0.6, lift: -10 };
let pipes = [];
let score = 0;
let gameInterval;
let gameStarted = false;
let isPaused = false;

// Bird jumps when pressing space
document.addEventListener("keydown", (event) => {
    if (event.code === "Space" && gameStarted && !isPaused) {
        bird.velocity = bird.lift;
    }
});

// Generate pipes
function generatePipe() {
    let gap = 120;
    let minHeight = 50;
    let maxHeight = canvas.height - gap - minHeight;
    let topHeight = Math.floor(Math.random() * (maxHeight - minHeight) + minHeight);
    let bottomHeight = canvas.height - gap - topHeight;

    pipes.push({ x: canvas.width, width: 50, topHeight, bottomHeight });
}

// Update game logic
function update() {
    if (!gameStarted || isPaused) return;

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
        gameOver();
    }

    pipes.forEach(pipe => {
        pipe.x -= 3;

        if (pipe.x + pipe.width < 0) {
            pipes.shift();
            score++;
            scoreDisplay.textContent = score;
        }

        if (
            bird.x < pipe.x + pipe.width &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.topHeight || bird.y + bird.height > canvas.height - pipe.bottomHeight)
        ) {
            gameOver();
        }
    });

    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        generatePipe();
    }

    draw();
    gameInterval = requestAnimationFrame(update);
}

// Draw game elements
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "yellow";
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

    ctx.fillStyle = "green";
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottomHeight, pipe.width, pipe.bottomHeight);
    });
}

// Start Game
startBtn.addEventListener("click", () => {
    if (!gameStarted) {
        resetGame();
        gameStarted = true;
        update();
    }
});

// Pause/Resume Game
pauseBtn.addEventListener("click", () => {
    if (gameStarted) {
        if (isPaused) {
            isPaused = false;
            update();
            pauseBtn.textContent = "Pause";
        } else {
            isPaused = true;
            cancelAnimationFrame(gameInterval);
            pauseBtn.textContent = "Resume";
        }
    }
});

// Reset Game
function resetGame() {
    score = 0;
    scoreDisplay.textContent = score;
    bird.y = 250;
    bird.velocity = 0;
    pipes = [];
    generatePipe();
    isPaused = false;
    pauseBtn.textContent = "Pause";
}

// Game Over
function gameOver() {
    gameStarted = false;
    alert("Game Over! Your Score: " + score);
}
