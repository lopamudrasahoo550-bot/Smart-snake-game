const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

const upBtn = document.getElementById("upBtn");
const downBtn = document.getElementById("downBtn");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

const message = document.getElementById("message");


/* ================================= */
/* GAME SETTINGS */
/* ================================= */

const gridSize = 25;

const gameSpeed = 180;


/* ================================= */
/* GAME VARIABLES */
/* ================================= */

let snake = [];

let food = {
    x: 0,
    y: 0
};

let direction = "RIGHT";

let nextDirection = "RIGHT";

let score = 0;

let highScore =
    Number(localStorage.getItem("smartSnakeHighScore")) || 0;

let gameRunning = false;

let gameLoop = null;


/* ================================= */
/* SHOW HIGH SCORE */
/* ================================= */

highScoreDisplay.textContent = highScore;


/* ================================= */
/* START GAME */
/* ================================= */

function startGame() {

    snake = [

        {
            x: 300,
            y: 300
        },

        {
            x: 275,
            y: 300
        },

        {
            x: 250,
            y: 300
        },

        {
            x: 225,
            y: 300
        }

    ];


    direction = "RIGHT";

    nextDirection = "RIGHT";

    score = 0;

    scoreDisplay.textContent = score;


    createFood();


    gameRunning = true;


    message.textContent =
        "Use the buttons or arrow keys to control the snake!";


    clearInterval(gameLoop);


    gameLoop =
        setInterval(
            updateGame,
            gameSpeed
        );


    drawGame();
}


/* ================================= */
/* UPDATE GAME */
/* ================================= */

function updateGame() {

    direction = nextDirection;

    moveSnake();


    if (checkCollision()) {

        gameOver();

        return;
    }


    drawGame();
}


/* ================================= */
/* MOVE SNAKE */
/* ================================= */

function moveSnake() {

    const head = {

        x: snake[0].x,

        y: snake[0].y

    };


    if (direction === "UP") {

        head.y -= gridSize;

    }


    if (direction === "DOWN") {

        head.y += gridSize;

    }


    if (direction === "LEFT") {

        head.x -= gridSize;

    }


    if (direction === "RIGHT") {

        head.x += gridSize;

    }


    snake.unshift(head);


    /* Food collision */

    if (

        head.x === food.x &&

        head.y === food.y

    ) {

        score++;


        scoreDisplay.textContent = score;


        if (score > highScore) {

            highScore = score;


            highScoreDisplay.textContent =
                highScore;


            localStorage.setItem(
                "smartSnakeHighScore",
                highScore
            );

        }


        createFood();

    }

    else {

        snake.pop();

    }

}


/* ================================= */
/* DRAW COMPLETE GAME */
/* ================================= */

function drawGame() {

    drawBackground();

    drawFood();

    drawSnake();

}


/* ================================= */
/* DRAW BACKGROUND */
/* ================================= */

function drawBackground() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /* Grid */

    ctx.strokeStyle =
        "rgba(100, 180, 190, 0.08)";

    ctx.lineWidth = 1;


    for (
        let x = 0;
        x <= canvas.width;
        x += gridSize
    ) {

        ctx.beginPath();

        ctx.moveTo(x, 0);

        ctx.lineTo(
            x,
            canvas.height
        );

        ctx.stroke();

    }


    for (
        let y = 0;
        y <= canvas.height;
        y += gridSize
    ) {

        ctx.beginPath();

        ctx.moveTo(0, y);

        ctx.lineTo(
            canvas.width,
            y
        );

        ctx.stroke();

    }

}


/* ================================= */
/* DRAW FOOD */
/* ================================= */

function drawFood() {

    const centerX =
        food.x + gridSize / 2;

    const centerY =
        food.y + gridSize / 2;


    /* Glow */

    ctx.beginPath();

    ctx.arc(
        centerX,
        centerY,
        gridSize / 1.5,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "rgba(255, 80, 100, 0.18)";

    ctx.fill();


    /* Food */

    ctx.beginPath();

    ctx.arc(
        centerX,
        centerY,
        gridSize / 2 - 2,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#ff4f6d";

    ctx.fill();


    /* Highlight */

    ctx.beginPath();

    ctx.arc(
        centerX - 4,
        centerY - 4,
        3,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#ffffff";

    ctx.fill();

}


/* ================================= */
/* DRAW SNAKE */
/* ================================= */

function drawSnake() {

    snake.forEach(
        function(part, index) {

            const x = part.x;
            const y = part.y;


            /* HEAD */

            if (index === 0) {

                drawSnakeHead(
                    x,
                    y
                );

            }

            /* BODY */

            else {

                drawSnakeBody(
                    x,
                    y,
                    index
                );

            }

        }
    );

}


/* ================================= */
/* SNAKE BODY */
/* ================================= */

function drawSnakeBody(
    x,
    y,
    index
) {

    const padding = 2;

    const size =
        gridSize - padding * 2;


    /* Shadow */

    ctx.fillStyle =
        "rgba(0,0,0,0.35)";

    roundRect(
        x + 3,
        y + 4,
        size,
        size,
        9
    );

    ctx.fill();


    /* Body */

    const gradient =
        ctx.createLinearGradient(
            x,
            y,
            x + gridSize,
            y + gridSize
        );


    gradient.addColorStop(
        0,
        "#57e389"
    );

    gradient.addColorStop(
        1,
        "#139b55"
    );


    ctx.fillStyle = gradient;


    roundRect(
        x + padding,
        y + padding,
        size,
        size,
        9
    );

    ctx.fill();


    /* Body pattern */

    if (index % 2 === 0) {

        ctx.fillStyle =
            "rgba(255,255,255,0.12)";


        ctx.beginPath();

        ctx.arc(
            x + gridSize / 2,
            y + gridSize / 2,
            3,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

}


/* ================================= */
/* SNAKE HEAD WITH EYES */
/* ================================= */

function drawSnakeHead(
    x,
    y
) {

    const centerX =
        x + gridSize / 2;

    const centerY =
        y + gridSize / 2;


    /* Head */

    const gradient =
        ctx.createLinearGradient(
            x,
            y,
            x + gridSize,
            y + gridSize
        );


    gradient.addColorStop(
        0,
        "#71f09a"
    );

    gradient.addColorStop(
        1,
        "#159b56"
    );


    ctx.fillStyle = gradient;


    roundRect(
        x + 1,
        y + 1,
        gridSize - 2,
        gridSize - 2,
        10
    );

    ctx.fill();


    /* Eyes */

    let eye1X;
    let eye1Y;

    let eye2X;
    let eye2Y;


    if (direction === "RIGHT") {

        eye1X = centerX + 6;
        eye1Y = centerY - 6;

        eye2X = centerX + 6;
        eye2Y = centerY + 6;

    }


    else if (direction === "LEFT") {

        eye1X = centerX - 6;
        eye1Y = centerY - 6;

        eye2X = centerX - 6;
        eye2Y = centerY + 6;

    }


    else if (direction === "UP") {

        eye1X = centerX - 6;
        eye1Y = centerY - 6;

        eye2X = centerX + 6;
        eye2Y = centerY - 6;

    }


    else {

        eye1X = centerX - 6;
        eye1Y = centerY + 6;

        eye2X = centerX + 6;
        eye2Y = centerY + 6;

    }


    drawEye(
        eye1X,
        eye1Y
    );

    drawEye(
        eye2X,
        eye2Y
    );

}


/* ================================= */
/* DRAW EYE */
/* ================================= */

function drawEye(
    x,
    y
) {

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        4,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "white";

    ctx.fill();


    ctx.beginPath();

    ctx.arc(
        x,
        y,
        2,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#111827";

    ctx.fill();

}


/* ================================= */
/* ROUNDED RECTANGLE */
/* ================================= */

function roundRect(
    x,
    y,
    width,
    height,
    radius
) {

    ctx.beginPath();

    ctx.moveTo(
        x + radius,
        y
    );

    ctx.lineTo(
        x + width - radius,
        y
    );

    ctx.quadraticCurveTo(
        x + width,
        y,
        x + width,
        y + radius
    );

    ctx.lineTo(
        x + width,
        y + height - radius
    );

    ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - radius,
        y + height
    );

    ctx.lineTo(
        x + radius,
        y + height
    );

    ctx.quadraticCurveTo(
        x,
        y + height,
        x,
        y + height - radius
    );

    ctx.lineTo(
        x,
        y + radius
    );

    ctx.quadraticCurveTo(
        x,
        y,
        x + radius,
        y
    );

    ctx.closePath();

}


/* ================================= */
/* CREATE FOOD */
/* ================================= */

function createFood() {

    let validPosition = false;


    while (!validPosition) {

        food.x =
            Math.floor(
                Math.random() *
                (canvas.width / gridSize)
            ) * gridSize;


        food.y =
            Math.floor(
                Math.random() *
                (canvas.height / gridSize)
            ) * gridSize;


        validPosition =
            !snake.some(
                function(part) {

                    return (

                        part.x === food.x &&

                        part.y === food.y

                    );

                }
            );

    }

}


/* ================================= */
/* COLLISION */
/* ================================= */

function checkCollision() {

    const head = snake[0];


    /* Wall */

    if (

        head.x < 0 ||

        head.x >= canvas.width ||

        head.y < 0 ||

        head.y >= canvas.height

    ) {

        return true;

    }


    /* Body */

    for (
        let i = 1;
        i < snake.length;
        i++
    ) {

        if (

            head.x === snake[i].x &&

            head.y === snake[i].y

        ) {

            return true;

        }

    }


    return false;

}


/* ================================= */
/* GAME OVER */
/* ================================= */

function gameOver() {

    gameRunning = false;

    clearInterval(gameLoop);


    message.textContent =
        "💥 Game Over! Press Restart to try again.";

}


/* ================================= */
/* CHANGE DIRECTION */
/* ================================= */

function changeDirection(
    newDirection
) {

    if (!gameRunning) {

        return;

    }


    if (
        newDirection === "UP" &&
        direction !== "DOWN"
    ) {

        nextDirection = "UP";

    }


    if (
        newDirection === "DOWN" &&
        direction !== "UP"
    ) {

        nextDirection = "DOWN";

    }


    if (
        newDirection === "LEFT" &&
        direction !== "RIGHT"
    ) {

        nextDirection = "LEFT";

    }


    if (
        newDirection === "RIGHT" &&
        direction !== "LEFT"
    ) {

        nextDirection = "RIGHT";

    }

}


/* ================================= */
/* KEYBOARD CONTROLS */
/* ================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "ArrowUp") {

            changeDirection("UP");

        }

        else if (event.key === "ArrowDown") {

            changeDirection("DOWN");

        }

        else if (event.key === "ArrowLeft") {

            changeDirection("LEFT");

        }

        else if (event.key === "ArrowRight") {

            changeDirection("RIGHT");

        }

    }
);


/* ================================= */
/* BUTTON CONTROLS */
/* ================================= */

upBtn.addEventListener(
    "click",
    function() {

        changeDirection("UP");

    }
);


downBtn.addEventListener(
    "click",
    function() {

        changeDirection("DOWN");

    }
);


leftBtn.addEventListener(
    "click",
    function() {

        changeDirection("LEFT");

    }
);


rightBtn.addEventListener(
    "click",
    function() {

        changeDirection("RIGHT");

    }
);


/* ================================= */
/* START BUTTON */
/* ================================= */

startBtn.addEventListener(
    "click",
    function() {

        startGame();

    }
);


/* ================================= */
/* RESTART BUTTON */
/* ================================= */

restartBtn.addEventListener(
    "click",
    function() {

        startGame();

    }
);


/* ================================= */
/* INITIAL SCREEN */
/* ================================= */

drawBackground();