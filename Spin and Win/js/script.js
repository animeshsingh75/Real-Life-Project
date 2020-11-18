let prizes_config = {
    count: 12,
    prizes_names: ["3000 Credits", "35% Off", "Hard Luck", "70% OFF", "SwagPack",
        "100% OFF", "Netflix", "50% Off", "Amazon Voucher", "2 Extra Spin",
        "Tshirt", "Book"
    ]
}
let config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 600,
    backgroundColor: 0xffcc00,
    scene: {
        preload: preload,
        create: create,
        update: update
    }

};

let game = new Phaser.Game(config);

function preload() {
    console.log("Preload");
    this.load.image('background', 'images/back.jpg');
    this.load.image('wheel', 'images/wheel.png');
    this.load.image('pin', 'images/pin.png');
    this.load.image('stand', 'images/stand.png');
    this.load.audio('wheelaudio', 'images/wheel.mp3');
}

function create() {
    console.log("Create");
    let w = game.config.width;
    let h = game.config.height;
    let background = this.add.sprite(0, 0, 'background');
    background.setPosition(w / 2, h / 2);
    background.setScale(0.20);
    let stand = this.add.sprite(w / 2 + 4, h / 2 + 250, 'stand');
    stand.setScale(0.25);
    let pin = this.add.sprite(w / 2 + 2, h / 2 - 249, 'pin');
    pin.setScale(0.25);
    pin.depth = 1;
    this.click = 0;
    this.wheelaudio = this.sound.add('wheelaudio')
    this.wheel = this.add.sprite(w / 2, h / 2, 'wheel');
    this.wheel.setScale(0.25);
    this.input.on("pointerdown", spinwheel, this);
    this.wheelaudio.play();
    font_style = {
        font: "bold 30px Arial",
        align: "center",
        color: "red"
    }
    this.game_text = this.add.text(10, 10, "Welcome to Spin & Win", font_style);
}

function update() {
    console.log("Update");
    // this.wheel.angle += 1;

}

function spinwheel() {
    console.log("You clicked the mouse");
    console.log("Start Spinning");
    this.wheelaudio.play();
    // this.game_text.setText("You clicked the mouse");
    let rounds = Phaser.Math.Between(2, 4);
    let degrees = Phaser.Math.Between(0, 11) * 30;
    let total_angle = rounds * 360 + degrees;
    console.log(total_angle);
    console.log(rounds);
    let idx = prizes_config.count - 1 - Math.floor(degrees / (360 / prizes_config.count));
    console.log(idx);
    if (this.click == 0) {
        this.click = 1;
        tween = this.tweens.add({
            targets: this.wheel,
            angle: total_angle,
            ease: "Cubic.easeOut",
            duration: 4000,
            callbackScope: this,
            onComplete: function() {
                this.game_text.setText("You Won " + prizes_config.prizes_names[idx]);
                this.click = 0;
            }
        });
    }
}