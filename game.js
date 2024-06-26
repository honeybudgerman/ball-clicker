const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const mainScreen = document.getElementById('mainScreen');
const playButton = document.getElementById('playButton');
const shareButton = document.getElementById('shareButton');
const totalScoreDisplay = document.getElementById('totalScore');
const timerDisplay = document.getElementById('timer');
const timeLeftDisplay = document.getElementById('timeLeft');
const energyDisplay = document.getElementById('energyDisplay');
const energyTimerDisplay = document.getElementById('energyTimer');

const botToken = '7355743766:AAGGRqA_g_L1SxnjXAWRZKBJoWcizUq3qOE';
const chatId = ''; // Добавьте ваш chat_id

const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
const ballRadius = 10;
const initialSpeed = 2;
let bricks = [];
const brickRowCount = 5;
const brickColumnCount = 3;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
let score = 0;
let totalScore = 0;
let balls = [];
let bonuses = [];
let timer;
const gameDuration = 30;
let timeLeft = gameDuration;
let scoreMultiplier = 1;

let energy = 100;
const energyConsumption = 10;
const energyRecoveryTime = 30000;
let energyRecoveryCounter = energyRecoveryTime / 1000;

let touchStartX = 0;
let touchEndX = 0;

function updateEnergy() {
    if (energy < 100) {
        energy += 1;
        energyDisplay.textContent = energy;
    }
    energyRecoveryCounter = energyRecoveryTime / 1000;
}

function updateEnergyTimer() {
    if (energyRecoveryCounter > 0) {
        energyRecoveryCounter--;
        energyTimerDisplay.textContent = `(${energyRecoveryCounter}s)`;
    } else {
        updateEnergy();
    }
}

setInterval(updateEnergyTimer, 1000);

function initBricks() {
    bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBall(ball) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

function drawTimer() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Time: " + timeLeft + "s", canvas.width - 80, 20);
}

let rightPressed = false;
let leftPressed = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

canvas.addEventListener("touchstart", touchStartHandler, false);
canvas.addEventListener("touchmove", touchMoveHandler, false);
canvas.addEventListener("touchend", touchEndHandler, false);

document.addEventListener("mousedown", handleMouseDown, false);
document.addEventListener("mouseup", handleMouseUp, false);

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

function handleMouseDown(e) {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    if (clickX < canvas.width / 2) {
        leftPressed = true;
        rightPressed = false;
    } else {
        rightPressed = true;
        leftPressed = false;
    }
}

function handleMouseUp(e) {
    leftPressed = false;
    rightPressed = false;
}

function touchStartHandler(e) {
    touchStartX = e.touches[0].clientX;
    leftPressed = rightPressed = false;
}

function touchMoveHandler(e) {
    touchEndX = e.touches[0].clientX;
    const deltaX = touchEndX - touchStartX;
    const movement = deltaX / canvas.clientWidth * canvas.width;
    paddleX += movement;
    if (paddleX < 0) {
        paddleX = 0;
    } else if (paddleX + paddleWidth > canvas.width) {
        paddleX = canvas.width - paddleWidth;
    }
    touchStartX = touchEndX;
}

function touchEndHandler(e) {
    leftPressed = false;
    rightPressed = false;
}

function collisionDetection(ball) {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                if (
                    ball.x > b.x &&
                    ball.x < b.x + brickWidth &&
                    ball.y > b.y &&
                    ball.y < b.y + brickHeight
                ) {
                    ball.dy = -ball.dy;
                    b.status = 0;
                    score += 1 * scoreMultiplier;
                    if (Math.random() < 0.2) {
                        bonuses.push({ x: b.x + brickWidth / 2, y: b.y + brickHeight / 2, dy: 2, type: 'multiplier' });
                    }
                    if (score % 5 === 0) {
                        balls.push({
                            x: canvas.width / 2,
                            y: canvas.height - 30,
                            dx: initialSpeed,
                            dy: -initialSpeed,
                        });
                    }
                }
            }
        }
    }
}

function updateTimer() {
    timeLeft--;
    timeLeftDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
        endGame();
    }
}

function resetBallSpeed(ball) {
    ball.dx = initialSpeed;
    ball.dy = -initialSpeed;
}

let animationId;

function startGame() {
    if (energy < energyConsumption) {
        alert('Not enough energy to play!');
        return;
    }
    energy -= energyConsumption;
    energyDisplay.textContent = energy;

    mainScreen.style.display = 'none';
    canvas.style.display = 'block';
    timerDisplay.style.display = 'block';
    score = 0;
    timeLeft = gameDuration;
    timeLeftDisplay.textContent = timeLeft;
    scoreMultiplier = 1;
    balls = [{ x: canvas.width / 2, y: canvas.height - 30, dx: initialSpeed, dy: -initialSpeed }];
    initBricks();
    draw();
    timer = setInterval(updateTimer, 1000);
}

function endGame() {
    clearInterval(timer);
    cancelAnimationFrame(animationId);
    totalScore += score;
    totalScoreDisplay.textContent = totalScore;
    saveProgress(); // Сохранение прогресса на сервере
    mainScreen.style.display = 'block';
    canvas.style.display = 'none';
    timerDisplay.style.display = 'none';
    balls.forEach(resetBallSpeed);
    balls = [];
    saveUserData();
}

function drawBonus(bonus) {
    ctx.beginPath();
    ctx.arc(bonus.x, bonus.y, ballRadius / 2, 0, Math.PI * 2);
    ctx.fillStyle = bonus.type === 'multiplier' ? 'orange' : 'red';
    ctx.fill();
    ctx.closePath();
}

function handleBonuses() {
    bonuses.forEach((bonus, index) => {
        bonus.y += bonus.dy;
        drawBonus(bonus);

        if (bonus.y + ballRadius / 2 > canvas.height - paddleHeight && bonus.x > paddleX && bonus.x < paddleX + paddleWidth) {
            if (bonus.type === 'multiplier') {
                scoreMultiplier = 2;
            }
            bonuses.splice(index, 1);
        }

        if (bonus.y + ballRadius / 2 > canvas.height) {
            bonuses.splice(index, 1);
        }
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawPaddle();
    drawScore();
    drawTimer();
    handleBonuses();
    balls.forEach((ball, index) => {
        drawBall(ball);
        collisionDetection(ball);

        if (ball.x + ball.dx > canvas.width - ballRadius || ball.x + ball.dx < ballRadius) {
            ball.dx = -ball.dx;
        }
        if (ball.y + ball.dy < ballRadius) {
            ball.dy = -ball.dy;
        } else if (ball.y + ball.dy > canvas.height - ballRadius) {
            if (ball.x > paddleX && ball.x < paddleX + paddleWidth) {
                ball.dy = -ball.dy;
            } else {
                balls.splice(index, 1);
                if (balls.length === 0) {
                    endGame();
                }
            }
        }

        ball.x += ball.dx;
        ball.y += ball.dy;
    });

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    if (timeLeft > 0) {
        animationId = requestAnimationFrame(draw);
    }
}

function saveUserData() {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.telegram.org/bot${botToken}/sendMessage`, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({
        chat_id: chatId,
        text: `/save ${totalScore} ${energy}`
    }));
}

function loadProgress() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `https://api.telegram.org/bot${botToken}/getUpdates`, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onload = function() {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            if (response.result && response.result.length > 0) {
                const messages = response.result.map(update => update.message);
                const lastSaveMessage = messages.reverse().find(message => message.text.startsWith('/save'));

                if (lastSaveMessage) {
                    const progressData = lastSaveMessage.text.split(' ');

                    if (progressData[0] === '/save' && progressData.length === 3) {
                        totalScore = parseInt(progressData[1], 10);
                        energy = parseInt(progressData[2], 10);
                        totalScoreDisplay.textContent = totalScore;
                        energyDisplay.textContent = energy;
                    }
                }
            }
        }
    };

    xhr.send();
}

function shareScore() {
    const message = `I scored ${totalScore} points in Breakout Game! Can you beat my score?`;
    const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

playButton.addEventListener('click', startGame);
shareButton.addEventListener('click', shareScore);

document.addEventListener("DOMContentLoaded", () => {
    loadProgress(); // Загрузка прогресса при старте
});
