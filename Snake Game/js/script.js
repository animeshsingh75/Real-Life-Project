function init() {
    var canvas = document.getElementById("mycanvas");
    H = canvas.height = 700;
    W = canvas.width = 1000;
    pen = canvas.getContext('2d');
    cs = 67;
    game_over = false;
    score = 0;
    food_img = new Image();
    food_img.src = "images/apple.png";
    trophy = new Image();
    trophy.src = "images/trophy.png";
    food = getRandomFood();
    snake = {
        init_len: 5,
        color: "blue",
        cells: [],
        direction: "right",
        createSnake: function() {
            for (var i = this.init_len; i > 0; i--) {
                this.cells.push({ x: i, y: 0 });
            }

        },
        drawSnake: function() {
            for (var i = 0; i < this.cells.length; i++) {
                pen.fillStyle = this.color;
                pen.fillRect(this.cells[i].x * cs, this.cells[i].y * cs, cs - 3, cs - 3);
            }
        },
        updateSnake: function() {
            console.log("Updating Snake according to direction property");
            var headx = this.cells[0].x;
            var heady = this.cells[0].y;
            if (headx == food.x && heady == food.y) {
                console.log("Food eaten by snake");
                food = getRandomFood();
                score++;
            } else {
                this.cells.pop();
            }
            var nextx, nexty;
            if (this.direction == "right") {
                nextx = headx + 1;
                nexty = heady;
            } else if (this.direction == "left") {
                nextx = headx - 1;
                nexty = heady;
            } else if (this.direction == "down") {
                nextx = headx;
                nexty = heady + 1;
            } else {
                nextx = headx;
                nexty = heady - 1;
            }
            this.cells.unshift({ x: nextx, y: nexty });
            var last_x = Math.round(W / cs);
            var last_y = Math.round(H / cs);
            if (this.cells[0].y < 0 || this.cells[0].x < 0 || this.cells[0].x > last_x || this.cells[0].y > last_y) {
                game_over = true;
            }
            console.log(game_over);
        }

    };
    snake.createSnake();

    function keyPressed(e) {
        console.log("Key Pressed", e.key);
        if (e.key == "d" || e.key == "D") {
            snake.direction = "right";
        } else if (e.key == "a" || e.key == "A") {
            snake.direction = "left";
        } else if (e.key == "s" || e.key == "S") {
            snake.direction = "down";
        } else if (e.key == "w" || e.key == "W") {
            snake.direction = "up";
        }
        console.log(snake.direction);
    }
    document.addEventListener('keydown', keyPressed)
}

function draw() {
    pen.clearRect(0, 0, W, H);
    snake.drawSnake();
    pen.drawImage(food_img, food.x * cs, food.y * cs, cs, cs);
    pen.drawImage(trophy, 22, 20, cs, cs);
    pen.font = "20px Roboto"
    pen.fillText(score, 50, 50);
}

function update() {
    snake.updateSnake();
}

function getRandomFood() {
    var foodx = Math.round(Math.random() * (W - cs) / cs);
    var foody = Math.round(Math.random() * (H - cs) / cs);
    var food = {
        x: foodx,
        y: foody,
        color: "red"
    }
    return food;
}

function gameloop() {
    if (game_over == true) {
        clearInterval(f);
        window.alert("Game Over");
        game_over = false;
    } else {
        draw();
        update();
    }
}

init();

function callgameloop() {
    f = setInterval(gameloop, 100);
}
callgameloop();


function restart() {
    init();
    game_over = false;
    callgameloop();
}