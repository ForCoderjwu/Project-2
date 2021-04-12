/***********************************************************************************
  MoodyMaze
  by Jiaquan Wu
***********************************************************************************/

var adventureManager;

var playerSprite;
var playerAnimation;
var NPC = [];
var index = 0;
var file = [];
var logo = [];
var talktaive = [];

var Click;
var clickables;

var Respect = 0;
var Enemy = 0;

function preload() {
  Click = new ClickableManager('Asset/table/clickableLayout.csv');
  adventureManager = new AdventureManager('Asset/table/adventureStates.csv', 'Asset/table/interactionTable.csv', 'Asset/table/clickableLayout.csv');
  NPC[0] = loadAnimation('Asset/sprite/p0.png', 'Asset/sprite/p4.png');
  NPC[1] = loadAnimation('Asset/sprite/s0.png', 'Asset/sprite/s4.png');
  NPC[2] = loadAnimation('Asset/sprite/u0.png', 'Asset/sprite/u4.png');
  NPC[3] = loadAnimation('Asset/sprite/T0.png', 'Asset/sprite/T7.png')

  logo[0] = loadImage('Asset/file.png');
  logo[1] = loadImage('Asset/coffee.png');
  logo[2] = loadImage('Asset/key.png')
  logo[3] = loadImage('Asset/card.png');
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

  // adventureManager.changeState("L3");
  // adventureManager.changeState("L2_MAZE4");
}

function draw() {
  adventureManager.draw();
  Click.draw();

  for( let i = 0; i < clickables.length; i++ ) {
    clickables[i].visible = false;
  }

  if( adventureManager.getStateName() !== "Start" && adventureManager.getStateName() !== "Instructions" ) {
    moveSprite();
    drawSprite(playerSprite);

    if (file[0]) image(logo[0], 40, 70); //file

    if(file[1]) image(logo[1], 120, 70); // coffee
    else if(file[2]) image(logo[2], 120, 70, 50); //key
    
    if(file[3]) image(logo[3], 200, 70); //card

    //States display
    push();
    fill(155,200,189);
    textAlign(CENTER);
    textSize(20);
    text("Respect: " + Respect + " Enemy: " + Enemy, 130, 50);
    pop();
  } 

  drawDebugInfo();
  print(index);
}
//==================== Some Function =====================
function drawDebugInfo() {
  push();
	fill(255);
  text("X: " + mouseX + "   Y: " + mouseY, 20, height - 20);
  pop();
}

function mouseReleased() {
  adventureManager.mouseReleased();
}

function copy_file() {
  if (talktaive[0] == false) file[0] = true;
}

function drawtextbox(content) {
  push();
  fill(0);
  rect(0,height-200,width,200); //textbox

  fill(255);
  textAlign(CENTER);
  textSize(20);
  text(content,0,height-100, width, 200);
  pop();
}

function ele_function(e) {
  let x, y;
  x = map(playerSprite.position.x, 940, 1150, 0, 1);
  y = map(playerSprite.position.y, 260, 460, 0, 1);

  drawSprite(e[0]);
  drawSprite(e[1]);
  if (x<=1 && y <=1 && x >= 0 && y >= 0) {
    if (e[0].position.y <= 210) {
      e[0].setSpeed(0,0);
      e[1].setSpeed(0,0);
    } else {
      e[0].addSpeed(0.5,270);
      e[1].addSpeed(0.5,90);
    }
  } else {
    if (e[0].position.y >= 310) {
      e[0].setSpeed(0,0);
      e[1].setSpeed(0,0);
    } else {
      e[0].addSpeed(-0.5,270);
      e[1].addSpeed(-0.5,90);
    }
  }
}

function ele_door_set() {
  let e = [];
  e[0] = createSprite(1095,310,30,100);
  e[1] = createSprite(1095,410,30,100);
  e[0].shapeColor = color(0,245,255);
  e[1].shapeColor = color(0,245,255);
  return e;
}

function office_door_set() {
  let e = [];
  e[0] = createSprite(170,70,30,100);
  e[1] = createSprite(170,170,30,100);
  e[0].shapeColor = color(0);
  e[1].shapeColor = color(0);
  return e;
}

function office_door(e) {
  let x, y;
  x = map(playerSprite.position.x, 90, 290, 0, 1);
  y = map(playerSprite.position.y, 25, 220, 0, 1);

  drawSprite(e[0]);
  drawSprite(e[1]);
  if (x<=1 && y <=1 && x >= 0 && y >= 0 && file[2]) {
    if (e[0].position.y <= 0) {
      e[0].setSpeed(0,0);
      e[1].setSpeed(0,0);
    } else {
      e[0].addSpeed(0.5,270);
      e[1].addSpeed(0.5,90);
    }
  } else {
    if (e[0].position.y >= 70) {
      e[0].setSpeed(0,0);
      e[1].setSpeed(0,0);
    } else {
      e[0].addSpeed(-0.5,270);
      e[1].addSpeed(-0.5,90);
    }
  }
}

//==================== Clickable function ======================

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
  switch (this.id) {
    case 0:
      index++;
      break;
    case 1:
      index = 3;
      break;
    case 2:
      index = 5;
      break;
    case 3:
      index = 6;
      break;
    case 4: 
      index = 8;
      break;
    case 5:
      index = 11;
    default:
      break;
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

//=================== EACH CLASS ======================

class L1_Room extends PNGRoom {

  preload() {
    this.NPC = createSprite(400, 350, 80, 80);
    this.NPC.addAnimation('regular', NPC[1]);

    this.img = [];
    this.img[0] = loadImage('Asset/hello.png');
    this.img[1] = loadImage('Asset/bye.png');

    this.button = createSprite(width-40, height/2, 40,40);
    this.button.addImage(loadImage('Asset/button.png'));
    this.e = ele_door_set();
  }

  draw() {
    super.draw();
    drawSprite(this.NPC);

    if (playerSprite.position.x > 600) image(this.img[1], 405,219);
    else image(this.img[0], 405,219);
    
    drawSprite(this.button);
    playerSprite.overlap(this.button, this.levelchange);

    ele_function(this.e);
  }

  levelchange() {
    adventureManager.changeState("L2");
    playerSprite.position.x -= 100;
  }
}

class L2_Room extends PNGRoom {

  preload() {
    this.button = createSprite(width-40, height/2, 40,40);
    this.button.addImage(loadImage('Asset/button.png'));

    this.NPC2 = createSprite(670, 500, 80, 80);
    this.NPC2.addAnimation('regular', NPC[2]);

    this.e = ele_door_set();
  }

  draw() {
    super.draw();

    drawSprite(this.NPC2);

    drawSprite(this.button);
    if (file[3]) playerSprite.overlap(this.button, this.levelchange); //Only if we have the cards, then the state can change.

    ele_function(this.e);
  }

  levelchange() {
    adventureManager.changeState("L3");
    playerSprite.position.x -= 100;
  }
}

class Office_room extends PNGRoom {
  preload() {
    this.NPC = createSprite(400, 112, 80, 80);
    this.NPC.addAnimation('regular', NPC[0]);

    this.file = loadImage('Asset/file.png')
    this.talk = loadImage('Asset/talk.png')
  }

  draw() {
    super.draw();
    drawSprite(this.NPC);

    if (file[0]) this.NPC.remove();
    else{
      if (playerSprite.position.x > 615) image(this.talk, 300, 160);
      playerSprite.overlap(this.NPC, this.talkable);
    }
  }

  talkable() {
    clickables[0].visible = true;
    switch (index) {
      case 0:
        drawtextbox("Leader: John, this is important, you need to delivered this file to the boss office in the upper level!");
        break;
      case 1:
        drawtextbox("John: Why am I? Did I have a choice?");
        break;
      case 2:
        drawtextbox("Leader: Well, I need to take a nap after this, but as a new man in this office, you have:");
        clickables[0].visible = false;
        for( let i = 1; i <= 2; i++ ) {
          clickables[i].visible = true;
        }
        break;
      case 3:
        drawtextbox("Great, I lost the key to the upper stair, you can find your way to that, right? If not, there are one people in the L2M4 office.");
        break;
      case 4:
        index = 0;
        talktaive[0] = false;
        return file[0] = true;
      case 5:
        drawtextbox("Really? So what did you want to do in this office? I will report to HR that you did not do any jobs!")
        break;
      default:
        adventureManager.changeState("END");
        Enemy = 99;
        clickables[0].visible = false;
      break;
    }
  }
}

class L2M1_room extends PNGRoom {
  preload() {
    this.copy = createSprite(70, 70, 80, 80);
    this.copy.addImage(loadImage('Asset/copy_machine.png'));

    this.NPC = createSprite(240, 520, 80, 80);
    this.NPC.addAnimation('regular', NPC[2]);
    this.NPC2 = createSprite(300, 520, 80, 80);
    this.NPC2.addAnimation('regular', NPC[2]);
  }

  draw() {
    super.draw();
    drawSprite(this.copy);
    drawSprite(this.NPC);
    drawSprite(this.NPC2);
    playerSprite.overlap(this.copy, copy_file);
  }
}

class L2M2_room extends PNGRoom {
  preload() { //NPC with hidden card
    this.NPC = createSprite(1000, 140, 80, 80);
    this.NPC.addAnimation('regular', NPC[2]);
  }

  draw() {
    super.draw();
    drawSprite(this.NPC);
  }
}

class L2M4_room extends PNGRoom {
  preload() {
    this.box = createSprite(30, 400, 80, 80);
    this.box.addImage(loadImage('Asset/b.png'));

    this.NPC = createSprite(510, 350, 80, 80);
    this.NPC.addAnimation('regular', NPC[2]);
  }

  draw() {
    super.draw();
    drawSprite(this.box);
    drawSprite(this.NPC);
    playerSprite.overlap(this.box, this.card);
  }

  card() {
    file[3] = true;
  }
}

class L3 extends PNGRoom {
  preload() {
    this.NPC = createSprite(770, 440, 80, 80);
    this.NPC.addAnimation('regular', NPC[1]);

    this.button = createSprite(width-40, height/2, 40,40);
    this.button.addImage(loadImage('Asset/button.png'));

    this.copy = createSprite(1220, 530, 80, 80);
    this.copy.addImage(loadImage('Asset/copy_machine.png'));

    this.e = ele_door_set();
  }

  draw() {
    super.draw();
    drawSprite(this.NPC);
    drawSprite(this.button);
    drawSprite(this.copy);
    playerSprite.overlap(this.button, this.levelchange);
    playerSprite.overlap(this.button, copy_file);

    ele_function(this.e);
  }

  levelchange() {
    adventureManager.changeState("L2");
    playerSprite.position.x -= 100;
  }
}

class L3M2_room extends PNGRoom {
  preload() {
    this.NPC = createSprite(820, 270, 80, 80);
    this.NPC.addAnimation('regular', NPC[1]);
  }

  draw() {
    super.draw();
    drawSprite(this.NPC);
    // playerSprite.overlap(this.NPC, this.die);
  }
}

class L3M3_room extends PNGRoom {
  preload() {
    this.NPC = createSprite(1170, 70, 80, 80);
    this.NPC.addAnimation('regular', NPC[1]);
  }

  draw() {
    super.draw();
    drawSprite(this.NPC);
    // playerSprite.overlap(this.NPC, this.die);
  }
}

class L3M4_room extends PNGRoom {
  preload() {
    this.coffee = createSprite(580, 197, 80, 80);
    this.coffee.addImage(logo[1]);
  }

  draw() {
    super.draw();
    drawSprite(this.coffee);
    playerSprite.overlap(this.coffee, this.collect);
  }

  collect() {
    file[1] = true;
  }
}

class Front_room extends PNGRoom {
  preload() {
    index = 0;
    this.s = createSprite(90, 400, 80, 80);
    this.s.addAnimation('regular', NPC[3]);

    this.NPC = createSprite(220, 630, 80, 80);
    this.NPC.addAnimation('regular', NPC[1]);
    this.NPC2 = createSprite(880, 500, 80, 80);
    this.NPC2.addAnimation('regular', NPC[1]);

    this.e = office_door_set();
  }

  draw() {
    super.draw();
    drawSprite(this.s);
    if (!file[2]) playerSprite.overlap(this.s, this.talkable);

    drawSprite(this.NPC);
    drawSprite(this.NPC2);

    office_door(this.e);
  }

  talkable() {
    clickables[0].visible = true;
    switch (index) {
      case 0:
        drawtextbox("Secretary: Who are you? What do you want?");
        break;
      case 1:
        drawtextbox("John: I am John from the business department, I have something for Boss.");
        break;
      case 2:
        drawtextbox("Secretary: You are new to here right? But Boss have a meeting inside, you cannot get in. Unless...");
        break;
      case 3:
        drawtextbox("John: Unless I have a more important things?");
        break;
      case 4: 
        drawtextbox("Secretary: No, unless Boss need something to drink, and I need something to rest.");
        break;
      case 5:
        drawtextbox("Secretary: If I can have a coffee, I can bring you the key to the office.");
        clickables[0].visible = false;
        clickables[3].visible = true;
        clickables[4].visible = true;
        if (file[1]) clickables[5].visible = true;
        break;
      case 6:
        drawtextbox("John: I will look into it.")
        break;
      case 7:
        return index = 5;
      case 8:
        drawtextbox("John: No I will do your business, I will put this file in here and please tell the Boss about it.");
        break;
      case 9:
        drawtextbox("Secretary: If you like! (Put the file under the desk)");
        break;
      case 10:
        return index = 50;
      case 11:
        drawtextbox("Secretary: Wow! You got it, thanks! and here is the key!");
        break;
      case 12:
        index = 0;
        file[1] = false;
        return file[2] = true;
      default:
        adventureManager.changeState("END");
        Enemy = 98;
        clickables[0].visible = false;
        break;
    }
  }
}

class Boss_Room extends PNGRoom {
  preload() {
    index = 0;
    this.NPC =createSprite(200, height/2, 80, 80);
    this.NPC.addAnimation('regular', NPC[0]);
  }

  draw() {
    super.draw();
    drawSprite(this.NPC);
    playerSprite.overlap(this.NPC, this.talkable);
  }

  talkable() {
    clickables[0].visible = true;
    switch (index) {
      case 0:
        drawtextbox("John: Mr.Tom, I have something for you!");
        break;
      case 1:
        drawtextbox("Tom: Great, another agian, you better give me something better.");
        break;
      case 2:
        drawtextbox("John: A report from my department...");
        if (!file[0]) index = 6;
        break;
      case 3:
        drawtextbox("John: Here you are!");
        break;
      case 4: 
        drawtextbox("Tom: Great, thanks!");
        break;
      case 5: 
        index = 10;
      case 6:
        drawtextbox("John: Where is my file ?!?!");
        break;
      case 7:
        drawtextbox("Tom: You gotta be kidding me. You cannot save the file with your ability? What elese do you have? You don't need join this company after today.");
        Enemy = 100;
        break;
      default:
        adventureManager.changeState("END");
        clickables[0].visible = false;
        break;
    }
  }
}

class END_Room extends PNGRoom {
  draw() {
    super.draw();
    textAlign(CENTER,CENTER);
    textSize(25);
    fill(255);

    if (Respect >= 5) this.textpre("Good End, You successful delieverd the file and have a good reputation around colleague. People like you and hope that there will be more and more people like you.");
    else if (Enemy == 100) this.textpre("Mission Fail: You have delayed the meeting time for the BOSS and at the same time failed to promote the future of the company. You don't even know why you are in the office.");
    else if (Enemy == 99) this.textpre("Mission Fail: In the end, your leader delivered the documents by himself, and at the same time, you also ruined your own opportunity to show up to this group.");
    else if (Enemy == 98) this.textpre("Mission Fail: After two days later, the document was finally delivered to Tom. But the plan and cannot keep up with the changes, you and your department are disbanded.");
    else if (Enemy >= 3) this.textpre("Bad End, Even you successful delieverd the file, but most of the colleague dont like what you did. You are gradually being squeezed out by them and have no future expectations.");
    else if (Respect >= 0 && Enemy < 3) this.textpre("Normal End, You successful delieverd the file and some of the colleague likes you. Being Normal is not a bad things.");
  }

  textpre(content) {
    text(content, width/4, height/4, width/2, height/2);
  }
}