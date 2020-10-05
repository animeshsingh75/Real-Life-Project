let config = {
    type: Phaser.Auto,
    scale: {
        mode: Phaser.Scale.FIT,
        width: 800,
        height: 600
    },
    backgroundColor: 0xffff11,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 1000,
            },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);
let player_config = {
    player_speed: 150,
    player_jump: -635
}

function preload() {
    this.load.image("ground", "images/topground.png");
    this.load.image("sky", "images/background.png");
    this.load.spritesheet("dude", "images/dude.png", { frameWidth: 32, frameHeight: 48 });
    this.load.image("apple", "images/apple.png");
}

function create() {
    w = game.config.width;
    h = game.config.height;
    let background = this.add.sprite(0, 0, 'sky');
    background.setOrigin(0, 0);
    background.displayWidth = w;
    background.displayHeight = h;
    let ground = this.add.tileSprite(0, h - 128, w, 128, 'ground');
    ground.setOrigin(0, 0);
    this.player = this.physics.add.sprite(100, 100, 'dude', 4);
    console.log(this.player);
    this.player.setBounce(0.5);
    this.cursors = this.input.keyboard.createCursorKeys();
    let fruits = this.physics.add.group({
        key: "apple",
        repeat: 8,
        setScale: { x: 0.2, y: 0.2 },
        setXY: { x: 10, y: 0, stepX: 100 }
    });
    fruits.children.iterate(function(f) {
        f.setBounce(Phaser.Math.FloatBetween(0.4, 0.7));
    });
    let platforms = this.physics.add.staticGroup();
    platforms.create(500, 350, 'ground').setScale(2, 0.5).refreshBody();
    platforms.create(700, 200, 'ground').setScale(2, 0.5).refreshBody();
    platforms.create(100, 200, 'ground').setScale(2, 0.5).refreshBody();
    platforms.add(ground);
    this.physics.add.existing(ground, true);
    // ground.body.allowGravity = false;
    // console.log(ground);
    // ground.body.immovable = true;
    this.physics.add.collider(platforms, this.player);
    // this.physics.add.collider(ground, fruits);
    this.physics.add.collider(platforms, fruits);
}

function update() {
    if (this.cursors.left.isDown) {
        this.player.setVelocityX(-player_config.player_speed);
    } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(player_config.player_speed);
    } else {
        this.player.setVelocityX(0);
    }
    if (this.cursors.up.isDown && this.player.body.touching.down) {
        this.player.setVelocityY(player_config.player_jump);
    }

}