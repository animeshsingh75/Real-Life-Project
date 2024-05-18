let config = {
  type: Phaser.WEBGL,
  scale: {
    mode: Phaser.Scale.FIT,
    width: 800,
    height: 600,
  },
  backgroundColor: 0xffff11,
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: 1000,
      },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

let game = new Phaser.Game(config);
let player_config = {
  player_speed: 150,
  player_jump: -635,
};

function preload() {
  this.load.image("ground", "images/topground.png");
  this.load.image("sky", "images/background.png");
  this.load.spritesheet("dude", "images/dude.png", {
    frameWidth: 32,
    frameHeight: 48,
  });
  this.load.image("apple", "images/apple.png");
  this.load.image("ray", "images/ray.png");
  this.load.spritesheet("fullscreen", "images/fullscreen.png", {
    frameWidth: 64,
    frameHeight: 64,
  });
  this.score = 0;
  this.scoreText = null;
}

function create() {
  w = game.config.width;
  h = game.config.height;
  let background = this.add.sprite(0, 0, "sky");
  background.setOrigin(0, 0);
  background.displayWidth = w;
  background.displayHeight = h;
  background.depth = -2;
  let rays = [];
  for (let i = -10; i <= 10; i++) {
    let ray = this.add.sprite(w / 2, h - 128, "ray");
    ray.displayHeight = 1.5 * h;
    ray.setOrigin(0.5, 1);
    ray.alpha = 0.2;
    ray.angle = i * 20;
    ray.depth = -1;
    rays.push(ray);
  }
  this.tweens.add({
    targets: rays,
    props: {
      angle: {
        value: "+=20",
      },
    },
    duration: 8000,
    repeat: -1,
  });
  let ground = this.add.tileSprite(0, h - 128, w, 128, "ground");
  ground.setOrigin(0, 0);
  this.player = this.physics.add.sprite(100, 100, "dude", 4);
  console.log(this.player);
  this.player.setBounce(0.5);
  this.player.setCollideWorldBounds(true);
  this.anims.create({
    key: "left",
    frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1,
  });
  this.anims.create({
    key: "center",
    frames: [{ key: "dude", frame: 4 }],
    frameRate: 10,
  });
  this.anims.create({
    key: "right",
    frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1,
  });
  this.cursors = this.input.keyboard.createCursorKeys();
  let fruits = this.physics.add.group({
    key: "apple",
    repeat: 8,
    setScale: { x: 0.2, y: 0.2 },
    setXY: { x: 10, y: 0, stepX: 100 },
  });
  fruits.children.iterate(function (f) {
    f.setBounce(Phaser.Math.FloatBetween(0.4, 0.7));
  });
  let platforms = this.physics.add.staticGroup();
  platforms.create(500, 350, "ground").setScale(2, 0.5).refreshBody();
  platforms.create(700, 200, "ground").setScale(2, 0.5).refreshBody();
  platforms.create(100, 200, "ground").setScale(2, 0.5).refreshBody();
  platforms.add(ground);
  this.physics.add.existing(ground, true);
  this.scoreText = this.add
    .text(140, 110)
    .setText("Score: 0")
    .setScrollFactor(0);
  this.physics.add.collider(platforms, this.player);
  this.physics.add.collider(platforms, fruits);
  this.physics.add.overlap(this.player, fruits, eatFruit, null, this);

  this.cameras.main.setBounds(0, 0, w, h);
  this.physics.world.setBounds(0, 0, 2 * w, 2 * h);
  this.cameras.main.startFollow(this.player, true, true);
  this.cameras.main.setZoom(1.5);
}

function update() {
  if (this.cursors.left.isDown) {
    this.player.setVelocityX(-player_config.player_speed);
    this.player.anims.play("left", true);
  } else if (this.cursors.right.isDown) {
    this.player.setVelocityX(player_config.player_speed);
    this.player.anims.play("right", true);
  } else {
    this.player.setVelocityX(0);
    this.player.anims.play("center");
  }
  if (this.cursors.up.isDown && this.player.body.touching.down) {
    this.player.setVelocityY(player_config.player_jump);
  }
  console.log(this.score);
}

function eatFruit(player, fruit) {
  fruit.disableBody(true, true);
  this.score += 10;
  this.scoreText.setText("Score: " + this.score);
  if (this.score == 80) {
    window.alert("Game Over");
  }
}
