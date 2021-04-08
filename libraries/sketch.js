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

  playerSprite = createSprite(width/2, height/2-200, 80, 80);
  playerSprite.addAnimation('regular', loadAnimation('Asset/sprite/a0.png', 'Asset/sprite/a3.png'));

  adventureManager.setPlayerSprite(playerSprite);
  adventureManager.setClickableManager(Click);
  adventureManager.setup();

  setupClickables();
}

function draw() {
  adventureManager.draw();
  Click.draw();

  if( adventureManager.getStateName() !== "Splash" && adventureManager.getStateName() !== "Instructions" ) {
    
    moveSprite();
    drawSprite(playerSprite);
  } 

  drawDebugInfo();
}

function drawDebugInfo() {
  push();
	fill(255);
  text("X: " + mouseX + "   Y: " + mouseY, 20, height - 20);
  pop();
}
//clickable

function setupClickables() {
  for( let i = 0; i < clickables.length; i++ ) {
    clickables[i].onHover = clickableButtonHover;
    clickables[i].onOutside = clickableButtonOnOutside;
    clickables[i].onPress = clickableButtonPressed;
  }
}

clickableButtonHover = function () {
  this.color = "#AA33AA";
  this.noTint = false;
  this.tint = "#FF0000";
}

clickableButtonOnOutside = function () {
  this.color = "#AAAAAA";
}

clickableButtonPressed = function() {
  //noting yet...
  if( this.id == 3 ) {
    adventureManager.changeState("House");
    playerSprite.remove();
  }
}

//-------------------  SPRITE MOVEMENT -----------------------//
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
    this.NPC = createSprite(400, 350, 80, 80);
    this.NPC.addAnimation('regular', loadAnimation('Asset/sprite/s0.png', 'Asset/sprite/s4.png'));

    this.img = loadImage('Asset/hello.png');

    this.button = createSprite(width-40, height/2, 40,40);
    this.button.addImage(loadImage('Asset/button.png'));
  }

  draw() {
    super.draw();
    drawSprite(this.NPC);
    image(this.img, 405,219);
    
    drawSprite(this.button);
    playerSprite.overlap(this.button, this.levelchange);

    for( let i = 0; i <= 1; i++ ) {
      clickables[i].visible = true;
    }
  }

  levelchange() {
    adventureManager.changeState("L2");
    // adventureManager.changeState("L2_MAZE1");
    playerSprite.position.x -= 100;
  }
}

class L2_Room extends PNGRoom {

  preload() {
    this.button = createSprite(width-40, height/2, 40,40);
    this.button.addImage(loadImage('Asset/button.png'));
  }

  draw() {
    super.draw();

    drawSprite(this.button);
    playerSprite.overlap(this.button, this.levelchange);

    for( let i = 0; i <= 3; i++ ) {
      clickables[i].visible = false;
    }
  }

  levelchange() {
    adventureManager.changeState("L3");
    playerSprite.position.x -= 100;
  }
}

class Office_room extends PNGRoom {
  preload() {
    this.NPC = createSprite(400, 112, 80, 80);
    this.NPC.addAnimation('regular', loadAnimation('Asset/sprite/p0.png', 'Asset/sprite/p4.png'));
    this.NPC2 = createSprite(1000, 100, 80, 80);
    this.NPC2.addAnimation('regular', loadAnimation('Asset/sprite/u0.png', 'Asset/sprite/u4.png'));
  }

  draw() {
    super.draw();
    drawSprite(this.NPC);
    drawSprite(this.NPC2);

    for( let i = 2; i <= 3; i++ ) {
      clickables[i].visible = true;
    }
    // playerSprite.overlap(this.NPC, this.die);
  }
}

class L2M1_room extends PNGRoom {
  preload() {
    this.copy = createSprite(70, 70, 80, 80);
    this.copy.addImage(loadImage('Asset/copy_machine.png'));
    //This copy machine PNG is too large!!

    this.NPC = createSprite(240, 520, 80, 80);
    this.NPC.addAnimation('regular', loadAnimation('Asset/sprite/u0.png', 'Asset/sprite/u4.png'));
    this.NPC2 = createSprite(280, 520, 80, 80);
    this.NPC2.addAnimation('regular', loadAnimation('Asset/sprite/u0.png', 'Asset/sprite/u4.png'));
  }

  draw() {
    super.draw();
    drawSprite(this.copy);
    drawSprite(this.NPC);
    drawSprite(this.NPC2);
    // playerSprite.overlap(this.NPC, this.die);
  }
}

class L2M3_room extends PNGRoom {
  preload() {
    this.NPC = createSprite(260, 510, 80, 80);
    this.NPC.addAnimation('regular', loadAnimation('Asset/sprite/u0.png', 'Asset/sprite/u4.png'));
  }

  draw() {
    super.draw();
    drawSprite(this.NPC);
    // playerSprite.overlap(this.NPC, this.die);
  }
}

class L2M4_room extends PNGRoom {
  preload() {
    this.card = createSprite(80, 400, 80, 80);
    this.card.addImage(loadImage('Asset/card.png'));

    this.NPC = createSprite(510, 350, 80, 80);
    this.NPC.addAnimation('regular', loadAnimation('Asset/sprite/u0.png', 'Asset/sprite/u4.png'));
  }

  draw() {
    super.draw();
    drawSprite(this.card);
    drawSprite(this.NPC);
    // playerSprite.overlap(this.NPC, this.die);
  }
}

class L3 extends PNGRoom {
  preload() {
    this.NPC = createSprite(790, 330, 80, 80);
    this.NPC.addAnimation('regular', loadAnimation('Asset/sprite/s0.png', 'Asset/sprite/s4.png'));
    this.button = createSprite(width-40, height/2, 40,40);
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
    playerSprite.position.x -= 100;
  }
}

class L3M2_room extends PNGRoom {
  preload() {
    this.NPC = createSprite(820, 270, 80, 80);
    this.NPC.addAnimation('regular', loadAnimation('Asset/sprite/s0.png', 'Asset/sprite/s4.png'));
  }

  draw() {
    super.draw();
    drawSprite(this.NPC);
    // playerSprite.overlap(this.NPC, this.die);
  }
}

class L3M3_room extends PNGRoom {
  preload() {
    this.copy = createSprite(1160, 650, 80, 80);
    this.copy.addImage(loadImage('Asset/copy_machine.png'));
    this.NPC = createSprite(1170, 70, 80, 80);
    this.NPC.addAnimation('regular', loadAnimation('Asset/sprite/s0.png', 'Asset/sprite/s4.png'));
  }

  draw() {
    super.draw();
    drawSprite(this.copy);
    drawSprite(this.NPC);
    // playerSprite.overlap(this.NPC, this.die);
  }
}

class Front_room extends PNGRoom {
  preload() {
    this.key = createSprite(370, 70, 80, 80);
    this.key.addImage(loadImage('Asset/key.png'));
    this.NPC = createSprite(200, 600, 80, 80);
    this.NPC.addAnimation('regular', loadAnimation('Asset/sprite/s0.png', 'Asset/sprite/s4.png'));
    this.NPC2 = createSprite(870, 450, 80, 80);
    this.NPC2.addAnimation('regular', loadAnimation('Asset/sprite/s0.png', 'Asset/sprite/s4.png'));
  }

  draw() {
    super.draw();
    drawSprite(this.key);
    drawSprite(this.NPC);
    drawSprite(this.NPC2);
    // playerSprite.overlap(this.NPC, this.die);
  }
}

class Boss_Room extends PNGRoom {
  preload() {
    this.NPC =createSprite(200, height/2, 80, 80);
    this.NPC.addAnimation('regular', loadAnimation('Asset/sprite/p0.png', 'Asset/sprite/p4.png'));
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