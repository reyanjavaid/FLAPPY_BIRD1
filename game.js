const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const bird = {
    x: 50,
    y: 150,
    width: 20,
    height: 20,
    gravity: 0.6,
    lift: -15,
    velocity: 0,
    jump() {
        this.velocity += this.lift;
    },
    update() {
        this.velocity += this.gravity;
        this.y += this.velocity;

        // Prevent the bird from falling out of the canvas
        if (this.y + this.height >= canvas.height) {
            this.y = canvas.height - this.height;
            this.velocity = 0;
        }
        // Prevent the bird from flying out of the canvas
        if (this.y < 0) {
            this.y = 0;
            this.velocity = 0;
        }
    },
    show() {
        ctx.fillStyle = "#ff0";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
};

const pipes = [];
const pipeWidth = 50;
const pipeGap = 100;
let frame = 0;
let score = 0;
let gameOver = false;

function setupPipes() {
    if (frame % 75 === 0) {
        const pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap - 20)) + 20;
        pipes.push({
            x: canvas.width,
            top: pipeHeight,
            bottom: canvas.height - pipeHeight - pipeGap
        });
    }
}

function updatePipes() {
    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= 2;

        // Check for collision
        if (
            bird.x < pipes[i].x + pipeWidth &&
            bird.x + bird.width > pipes[i].x &&
            (bird.y < pipes[i].top || bird.y + bird.height > canvas.height - pipes[i].bottom)
        ) {
            gameOver = true;
        }

        // Remove pipes that have gone off screen
        if (pipes[i].x + pipeWidth < 0) {
            pipes.splice(i, 1);
            score++;
        }
    }
}

function drawScore() {
    ctx.fillStyle = "#fff";
    ctx.font = "16px Arial";
    ctx.fillText("Score: " + score, 10, 20);
}

function resetGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes.length = 0;
    score = 0;
    gameOver = false;
    frame = 0;
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    bird.update();
    bird.show();
    
    setupPipes();
    updatePipes();
    
    pipes.forEach(pipe => {
        ctx.fillStyle = "#008000";
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom);
    });
    
    drawScore();
    
    if (gameOver) {
        ctx.fillStyle = "red";
        ctx.font = "30px Arial";
        ctx.fillText("Game Over!", 70, canvas.height / 2);
        ctx.fillText("Press Space to Restart", 40, canvas.height / 2 + 40);
    }
    
    frame++;
    if (!gameOver) {
        requestAnimationFrame(drawGame);
    }
}

document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        if (gameOver) {
            resetGame();
        } else {
            bird.jump();
        }
    }
});

drawGame();
