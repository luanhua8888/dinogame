const dino = document.getElementById('dino');
const gameContainer = document.querySelector('.game-container');
const scoreDisplay = document.getElementById('score');
const gameOverDisplay = document.getElementById('game-over');

let isJumping = false;
let isGameOver = false;
let score = 0;
let highScore = 0;
let gameSpeed = 6; // Increased initial speed
let obstacles = [];
let clouds = [];
let jumpBuffer = false;
let level = 1;
function updateTheme() {
    // Remove all theme classes first
    document.body.classList.remove('theme-1', 'theme-2', 'theme-3', 'theme-4');
    gameContainer.classList.remove('theme-1', 'theme-2', 'theme-3', 'theme-4');

    // Add new theme class based on level
    if (level >= 2) {
        const themeNumber = Math.min(4, Math.floor((level - 2) / 2) + 1);
        const themeClass = `theme-${themeNumber}`;
        document.body.classList.add(themeClass);
        gameContainer.classList.add(themeClass);
    }
}


function createCloud() {
    const cloud = document.createElement('div');
    cloud.classList.add('cloud');
    cloud.style.top = `${Math.random() * 80 + 20}px`;
    cloud.style.animationDuration = `${Math.random() * 10 + 20}s`;
    gameContainer.appendChild(cloud);
    clouds.push(cloud);

    cloud.addEventListener('animationend', () => {
        cloud.remove();
        clouds = clouds.filter(c => c !== cloud);
    });
}

function jump() {
    if ((!isJumping || jumpBuffer) && !isGameOver) {
        if (isJumping) {
            return;
        }
        isJumping = true;
        jumpBuffer = false;
        dino.classList.add('jumping');
        
        const jumpSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1NOTQrHxERAQMFDRIwR1dleH6BgoFvW0EqHhAJBAUJEipCW3KCjZSbloBpTjAmFg0FBAcQLFJ2i5ywubisnXhXKxsNBQUJGEBwkrfX3OCvh2NKMyEVDQoMFzlwqNPy//LPpX1iSzYnGxITGzRkm9P2/+zPq4ZxaFJIQkJIV3SawOb69/DWtJ6OhHp1fpGvxs3U2t7g49/b19PQzc7T2'
        );
        jumpSound.volume = 0.2;
        jumpSound.play();

        setTimeout(() => {
            jumpBuffer = true;
        }, 400);

        setTimeout(() => {
            dino.classList.remove('jumping');
            isJumping = false;
        }, 800);
    }
}

function createObstacle(offset = 0, isFlying = false) {
    if (isGameOver) return;
    
    const obstacle = document.createElement('div');
    obstacle.classList.add(isFlying ? 'bird' : 'cactus');
    gameContainer.appendChild(obstacle);
    
    let obstaclePosition = gameContainer.offsetWidth + offset;
    obstacle.style.left = obstaclePosition + 'px';
    
    // For flying obstacles, position them higher
    if (isFlying) {
        obstacle.style.bottom = `${Math.random() * 20 + 50}px`; // Random height between 50-70px
    }
    
    obstacles.push(obstacle);
}

function createObstacleGroup() {
    if (level < 3) {
        // Level 1-2: Single ground obstacles and occasional flying ones
        if (Math.random() > 0.7) {
            createObstacle(0, true); // Flying obstacle
        } else {
            createObstacle(0, false); // Ground obstacle
        }
    } else {
        // Level 3+: Can have mixed groups of obstacles
        if (Math.random() > 0.7) {
            const numObstacles = 2;
            for (let i = 0; i < numObstacles; i++) {
                const isFlying = Math.random() > 0.5;
                createObstacle(i * 100, isFlying);
            }
        } else {
            const isFlying = Math.random() > 0.6;
            createObstacle(0, isFlying);
        }
    }
}

function updateLevel() {
    const newLevel = Math.floor(score / 3) + 1; // Even faster level progression
    if (newLevel !== level) {
        level = newLevel;
        updateTheme();
        
        const levelUpSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1NOTQrHxERAQMFDRIwR1dleH6BgoFvW0EqHhAJBAUJEipCW3KCjZSbloBpTjAmFg0FBAcQLFJ2i5ywubisnXhXKxsNBQUJGEBwkrfX3OCvh2NKMyEVDQoMFzlwqNPy//LPpX1iSzYnGxITGzRkm9P2/+zPq4ZxaFJIQkJIV3SawOb69/DWtJ6OhHp1fpGvxs3U2t7g49/b19PQzc7T2'
        );
        levelUpSound.volume = 0.3;
        levelUpSound.play();
    }
}

function moveObstacles() {
    obstacles.forEach((obstacle, index) => {
        const obstaclePosition = parseInt(window.getComputedStyle(obstacle).getPropertyValue('left'));
        
        if (obstaclePosition <= -40) {
            obstacle.remove();
            obstacles.splice(index, 1);
            score++;
            updateLevel();
            highScore = Math.max(highScore, score);
            scoreDisplay.textContent = `LEVEL ${level} - SCORE: ${score} - HIGH SCORE: ${highScore}`;
            
            gameSpeed = Math.min(20, 6 + level * 1.5); // More aggressive speed scaling and higher max speed
            
            const scoreSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1NOTQrHxERAQMFDRIwR1dleH6BgoFvW0EqHhAJBAUJEipCW3KCjZSbloBpTjAmFg0FBAcQLFJ2i5ywubisnXhXKxsNBQUJGEBwkrfX3OCvh2NKMyEVDQoMFzlwqNPy//LPpX1iSzYnGxITGzRkm9P2/+zPq4ZxaFJIQkJIV3SawOb69/DWtJ6OhHp1fpGvxs3U2t7g49/b19PQzc7T2'
            );
            scoreSound.volume = 0.1;
            scoreSound.play();
        } else {
            obstacle.style.left = (obstaclePosition - gameSpeed) + 'px';
        }
    });
}

function checkCollision() {
    obstacles.forEach(obstacle => {
        const dinoRect = dino.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();
        
        const collisionBuffer = 20;
        if (
            dinoRect.left < obstacleRect.right - collisionBuffer &&
            dinoRect.right > obstacleRect.left + collisionBuffer &&
            dinoRect.bottom > obstacleRect.top + collisionBuffer &&
            dinoRect.top < obstacleRect.bottom - collisionBuffer
        ) {
            gameOver();
        }
    });
}

function gameOver() {
    if (!isGameOver) {
        isGameOver = true;
        gameOverDisplay.classList.remove('hidden');
        obstacles.forEach(obstacle => obstacle.remove());
        obstacles = [];
        
        const gameOverSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1NOTQrHxERAQMFDRIwR1dleH6BgoFvW0EqHhAJBAUJEipCW3KCjZSbloBpTjAmFg0FBAcQLFJ2i5ywubisnXhXKxsNBQUJGEBwkrfX3OCvh2NKMyEVDQoMFzlwqNPy//LPpX1iSzYnGxITGzRkm9P2/+zPq4ZxaFJIQkJIV3SawOb69/DWtJ6OhHp1fpGvxs3U2t7g49/b19PQzc7T2'
        );
        gameOverSound.volume = 0.3;
        gameOverSound.play();
        
        gameContainer.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            gameContainer.style.animation = '';
        }, 500);
    }
}

function resetGame() {
    if (isGameOver) {
        isGameOver = false;
        score = 0;
        level = 1;
        gameSpeed = 6;
        updateTheme();
        scoreDisplay.textContent = `LEVEL 1 - SCORE: 0 - HIGH SCORE: ${highScore}`;
        gameOverDisplay.classList.add('hidden');
        obstacles.forEach(obstacle => obstacle.remove());
        obstacles = [];
        jumpBuffer = false;
        
        const resetSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1NOTQrHxERAQMFDRIwR1dleH6BgoFvW0EqHhAJBAUJEipCW3KCjZSbloBpTjAmFg0FBAcQLFJ2i5ywubisnXhXKxsNBQUJGEBwkrfX3OCvh2NKMyEVDQoMFzlwqNPy//LPpX1iSzYnGxITGzRkm9P2/+zPq4ZxaFJIQkJIV3SawOb69/DWtJ6OhHp1fpGvxs3U2t7g49/b19PQzc7T2'
        );
        resetSound.volume = 0.2;
        resetSound.play();
    }
}

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        if (isGameOver) {
            resetGame();
        } else {
            jump();
        }
        event.preventDefault();
    }
});

// Add click and touch event listeners for jumping
document.addEventListener('click', handleInteraction);
document.addEventListener('touchstart', handleInteraction);

function handleInteraction(event) {
    if (isGameOver) {
        resetGame();
    } else {
        jump();
    }
    event.preventDefault();
}

setInterval(() => {
    if (!isGameOver && Math.random() > 0.7) {
        createCloud();
    }
}, 2000);

setInterval(() => {
    if (!isGameOver) {
        createObstacleGroup();
    }
}, 1800 - level * 200); // More aggressive spawn rate scaling with levels

function gameLoop() {
    if (!isGameOver) {
        moveObstacles();
        checkCollision();
    }
    requestAnimationFrame(gameLoop);
}

gameLoop();
createCloud();