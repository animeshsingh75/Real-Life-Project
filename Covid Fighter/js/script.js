function load_images() {

}

function init() {
    canvas = document.getElementById("mycanvas");
    console.log(canvas);
    H = canvas.height = 400;
    W = canvas.width = 700;
    pen = canvas.getContext('2d');
    console.log(pen);
    box = {
        x: 150,
        y: 50,
        w: 60,
        h: 60,
        speed: 10
    };
}

function draw() {
    pen.clearRect(0, 0, W, H);
    pen.fillStyle = "red";
    pen.fillRect(box.x, box.y, box.w, box.h);
}

function update() {
    box.y += box.speed;
    if (box.y > H - box.h || box.y < 0) {
        box.speed *= -1;
    }
}

function gameloop() {
    draw();
    update();
    console.log("In gameloop");
}

function callgameloop() {
    f = setInterval(gameloop, 100);
}
load_images();
init();
callgameloop();

function restart() {
    init();
    game_over = false;
    callgameloop();
}