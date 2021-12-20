let platforms;
let player;
let score = 0;
let scoreText = ''

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
      preload: preload,
      create: create,
      update: update
  },
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 300 },
        debug: false
    }
},
};

var game = new Phaser.Game(config);

function preload () {
  this.load.image('sky', 'assets/tropical.jpg');
  this.load.image('ground', 'assets/platform.png');
  this.load.image('star', 'assets/caguama.png');
  this.load.image('bomb', 'assets/bomb.png');
  this.load.spritesheet('dude', 
      'assets/dude.png',
      { frameWidth: 32, frameHeight: 48 }
  );
  this.load.spritesheet('mona',
    '/assets/example.png',
    { frameWidth: 130, frameHeight: 130 }
  )
}

function create ()
{
  this.add.image(400, 268, 'sky');
  platforms = this.physics.add.staticGroup();

  // call refreshBody because static body was scalated
  platforms.create(400, 600-32 , 'ground').setScale(2).refreshBody();

  platforms.create(600, 400, 'ground');
  platforms.create(50, 250, 'ground');
  platforms.create(750, 220, 'ground');


  // creating dude
  addDude(this.physics, this.anims);

  createStars(this.physics, player);

  createScoreText(this.add)
}

function update ()
{
  var cursors = this.input.keyboard.createCursorKeys();
  if (cursors.left.isDown) {
    player.setVelocityX(-160);

    player.anims.play('izquierda', true);
  }
  else if (cursors.right.isDown){
    player.setVelocityX(160);

    player.anims.play('derecha', true);
  }
  else {
    player.setVelocityX(0);

    player.anims.play('turn');
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
  }
}

function addDude(physics, anims) {
  player = physics.add.sprite(100, 450, 'dude');

  player.setBounce(0.2);
  
  // dude will collide with the game limits
  player.setCollideWorldBounds(true);

  anims.create({
    key: 'izquierda',
    frames: anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  anims.create({
    key: 'turn',
    frames: [ { key: 'dude', frame: 4 } ],
    frameRate: 20
  });

  anims.create({
    key: 'derecha',
    frames: anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });

  player.body.setGravityY(20)
  physics.add.collider(player, platforms);
}

function collectStar (dude, star)
{
  star.disableBody(true, true);
  score = score + 100;
  scoreText.setText(`Score: ${score}`);
}

function createStars(physics, dude) {
  var stars = physics.add.group({
    key: 'star',
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 }
  });

  stars.children.iterate(function (child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });

  // Avoid stars colition
  physics.add.collider(stars, platforms);

  // Hide stars when dude overlaps with one of them
  physics.add.overlap(dude, stars, collectStar, null, this);
}

function createScoreText(add) {
  scoreText = add.text(16, 16, 'score: 0', { 
    fontSize: '36px', 
    fill: '#000',
    backgroundColor: 'yellow' 
  });
}