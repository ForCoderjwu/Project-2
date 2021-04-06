/***********************************************************************************
  MoodyMaze
  by Jiaquan Wu
***********************************************************************************/

var adventureManager;

var playerSprite;
var playerAnimation;

var Click;
var clickables;

const playGameIndex = 0;

function preload() {
  Click = new ClickableManager('Asset/table/clickableLayout.csv');
  adventureManager = new AdventureManager('Asset/table/adventureStates.csv', 'Asset/table/interactionTable.csv', 'Asset/table/clickableLayout.csv');
}

function setup() {
  createCanvas(1280, 720);

  clickables = Click.setup();

  playerSprite = createSprite(width/2, height/2, 80, 80);
  playerSprite.addAnimation('regular', loadAnimation('Asset/sprite/p1.png', 'Asset/sprite/p5.png'));

  adventureManager.setPlayerSprite(playerSprite);
  adventureManager.setClickableManager(Click);
  adventureManager.setup();
}

function draw() {
  adventureManager.draw();
  Click.draw();

  if( adventureManager.getStateName() !== "Splash" && adventureManager.getStateName() !== "Instructions" ) {
    
    moveSprite();

    // this is a function of p5.js, not of this sketch
    drawSprite(playerSprite);
  } 
}

//-------------- YOUR SPRITE MOVEMENT CODE HERE  ---------------//
function moveSprite() {
  if(keyIsDown(RIGHT_ARROW))
    playerSprite.velocity.x = 10;
  else if(keyIsDown(LEFT_ARROW))
    playerSprite.velocity.x = -10;
  else
    playerSprite.velocity.x = 0;

  if(keyIsDown(DOWN_ARROW))
    playerSprite.velocity.y = 10;
  else if(keyIsDown(UP_ARROW))
    playerSprite.velocity.y = -10;
  else
    playerSprite.velocity.y = 0;
}

class L1_Room extends PNGRoom {

  preload() {
    this.NPC = createSprite(400, 400, 80, 80);
    this.NPC.addAnimation('regular', loadAnimation('Asset/sprite/u1.png', 'Asset/sprite/u5.png'));

    this.button = createSprite(width-100, height/2, 40,40);
    this.button.addImage(loadImage('Asset/button.png'));
  }

  draw() {
    super.draw();
    drawSprite(this.NPC);

    drawSprite(this.button);
    playerSprite.overlap(this.button, this.levelchange);
  }

  levelchange() {
    adventureManager.changeState("L2");
    playerSprite.position.x = width/2;
    playerSprite.position.y = height/2;
  }
}

class L2_Room extends PNGRoom {

  preload() {
    this.button = createSprite(width-100, height/2, 40,40);
    this.button.addImage(loadImage('Asset/button.png'));
  }

  draw() {
    super.draw();

    drawSprite(this.button);
    playerSprite.overlap(this.button, this.levelchange);
  }

  levelchange() {
    adventureManager.changeState("L3");
  }
}

class Boss_Room extends PNGRoom {
  preload() {
    this.NPC =createSprite(200, height/2, 80, 80);
    this.NPC.addAnimation('regular', loadAnimation('Asset/sprite/u1.png', 'Asset/sprite/u5.png'));
  }

  draw() {
    super.draw();
    drawSprite(this.NPC);
    playerSprite.overlap(this.NPC, this.die);
  }

  die() {
    adventureManager.changeState("House");
  }
}