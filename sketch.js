/***********************************************************************************
  Tough Life : Social Work
  by Jiaquan Wu
  Virsion: 4/18/21
------------------------------------------------------------------------------------
  Note: 
  - This game is the toal virsion of social justice game that used by p5.js
  - This game used a lot of global variable to store NPC is valid or not
  - There are some development are not full develop yet, like p_f function, but it is 
  still there.
  - Some bug in repeatable NPC talk, it can incline the Respect or Enemy by multible 
  times.
  - Becuase of the systematic problem and I dont have any clue, playing this game will
  used lots of system resources, causing system laggy. 
  - There are some bugs when you cross the states.
***********************************************************************************/

var adventureManager;
var timer;
var content;

var go = false; //The mission p/f logo! true for go up, false by go down.

var groupIndex;//This is the global Group index, for the content group used!
var ina = 0;//This is the global index of the content index.

var playerSprite;
var NPC = []; //Animation array
var index = 0; //Global Index (Main storyline used!)
var file = []; //Check array for the logos are in or out.
var logo = []; //Logos image array.
var talktaive = []; //Now we have 6 talktaive.
var front_index = 0;

var Click;
var clickables;

var Respect = 0;
var Enemy = 0;

function preload() {
  //Load the click, content and state.
  Click = new ClickableManager('Asset/table/clickableLayout.csv');
  content = new Content_Man('Asset/table/npc_content.csv');
  adventureManager = new AdventureManager('Asset/table/adventureStates.csv', 'Asset/table/interactionTable.csv', 'Asset/table/clickableLayout.csv');
  
  //load the animation for sprite.
  NPC[0] = loadAnimation('Asset/sprite/p0.png', 'Asset/sprite/p4.png');
  NPC[1] = loadAnimation('Asset/sprite/s0.png', 'Asset/sprite/s4.png');
  NPC[2] = loadAnimation('Asset/sprite/u0.png', 'Asset/sprite/u4.png');
  NPC[3] = loadAnimation('Asset/sprite/T0.png', 'Asset/sprite/T7.png');
  NPC[4] = loadAnimation('Asset/sprite/b0.png', 'Asset/sprite/b3.png');
  NPC[5] = loadAnimation('Asset/sprite/v0.png', 'Asset/sprite/v7.png');
  NPC[6] = loadAnimation('Asset/sprite/r0.png', 'Asset/sprite/r5.png');

  //load the require logos.
  logo[0] = loadImage('Asset/file.png');
  logo[1] = loadImage('Asset/coffee.png');
  logo[2] = loadImage('Asset/key.png')
  logo[3] = loadImage('Asset/card.png');
  logo[4] = loadImage('Asset/flash_drive.png');
  logo[5] = loadImage('Asset/pass.png');//Not used in here, but still trying to use.
  logo[6] = loadImage('Asset/fail.png');//Same as above
}

function setup() {
  createCanvas(1280, 720);

  clickables = Click.setup(); //Set up the clickable.

  //Set up the player.
  playerSprite = createSprite(width/2, height/2-200, 80, 80);
  playerSprite.addAnimation('regular', loadAnimation('Asset/sprite/a0.png', 'Asset/sprite/a3.png'));

  //Adventure Manager: Setting up
  adventureManager.setPlayerSprite(playerSprite);
  adventureManager.setClickableManager(Click);
  adventureManager.setup();

  //Buttons and content set
  setupClickables();
  content.setup();

  //Set timer (Not use, but may used in the p_f function)
  timer = new Timer(0);

  file[5] = false;//checker for the secrete box, initial false;

//Testing function
  // adventureManager.changeState("L2"); 
  adventureManager.changeState("L3_MAZE3");
}

function draw() {
  adventureManager.draw(); //fist draw the state.
  Click.draw(); //Then draw the clickable

  for( let i = 0; i < clickables.length; i++ ) {
    clickables[i].visible = false;
  } //But with no visible, only call the visible in each class.

  if( adventureManager.getStateName() !== "Start" && adventureManager.getStateName() !== "Instructions" && adventureManager.getStateName() !== "END") {
    //only draw and move the player in game, not others.
    moveSprite();
    drawSprite(playerSprite);

    //each logo:
    if (file[0]) image(logo[0], 40, 70); //file 
    if(file[1]) image(logo[1], 120, 70); // coffee
    else if(file[2]) image(logo[2], 120, 70, 50); //key
    if(file[3]) image(logo[3], 200, 70); //card
    if(file[4]) image(logo[4], 200, 100, 100, 30); //flash drive

    //Situation display
    push();
    fill(155,200,189);
    textAlign(CENTER);
    textSize(20);
    text("Respect: " + Respect + " Enemy: " + Enemy, 130, 50);
    fill(255,215,0);
    if (talktaive[0] != false) text ("Main Goal: Go to your Office (L2)", 1000, 50);
    else text("Main Goal: Deliver file to Boss Office (L3)", 1000, 50);
    pop();
  } 

  if (playerSprite.position.x <= 0 || playerSprite.position.x >= width || 
    playerSprite.position.y <= 0 || playerSprite.position.y >= height) {
      groupIndex = 0;
      ina = 0;
  } //This will automatic refresh the groupIndex and ina to 0, for the content_Manager used.

  //This should be the show up for Mission complete or not, not complete.
  // if (go) {
  //   timer.setTimer(2000);
  //   timer.start();
  //   go = false;
  // }
  // p_f(true); 

  drawDebugInfo(); //Debug for Mouse X and Y
}
//==================== Some Function =====================//
function drawDebugInfo() {
  push();
	fill(255);
  text("X: " + mouseX + "   Y: " + mouseY, 20, height - 20);
  pop();
}

function mouseReleased() {
  adventureManager.mouseReleased(); //Click function
} 

function copy_file() { //if and only if the Office mission is accept! then we can use copy machine.
  if (talktaive[0] == false) file[0] = true;
}

function drawtextbox(contents) {
  push();
  fill(0);
  rect(0,height-200,width,200); //textbox rect. 

  fill(255);
  textAlign(CENTER);
  textSize(20);
  text(contents,width/6,height-150, width-400, 150); //text inside
  pop();
}

function ele_function(e) { //The judge and draw system for the elevator
  let x, y;
  //using map function to testing the range is in or not.
  x = map(playerSprite.position.x, 940, 1150, 0, 1);
  y = map(playerSprite.position.y, 260, 460, 0, 1);

  drawSprite(e[0]);
  drawSprite(e[1]);

  if (x<=1 && y <=1 && x >= 0 && y >= 0) { //If it is in:
    if (e[0].position.y <= 210) { //reach the max
      e[0].setSpeed(0,0);
      e[1].setSpeed(0,0);
    } else { //Open the door
      e[0].addSpeed(0.5,270);
      e[1].addSpeed(0.5,90);
    }
  } else {//If it is out.
    if (e[0].position.y >= 310) { //reach the min
      e[0].setSpeed(0,0);
      e[1].setSpeed(0,0);
    } else { //close the door
      e[0].addSpeed(-0.5,270);
      e[1].addSpeed(-0.5,90);
    }
  }
}

function ele_door_set() { //Create the sprite of the elevator! return those sprite.
  let e = [];
  e[0] = createSprite(1095,310,30,100);
  e[1] = createSprite(1095,410,30,100);
  e[0].shapeColor = color(0,245,255);
  e[1].shapeColor = color(0,245,255);
  return e;
}

function office_door_set() { //same with ele_door, but different postion and color.
  let e = [];
  e[0] = createSprite(170,70,30,100);
  e[1] = createSprite(170,170,30,100);
  e[0].shapeColor = color(0);
  e[1].shapeColor = color(0);
  return e;
}

function office_door(e) { //Look at the ele_funciton, same thing
  let x, y;
  x = map(playerSprite.position.x, 90, 290, 0, 1);
  y = map(playerSprite.position.y, 25, 220, 0, 1);

  drawSprite(e[0]);
  drawSprite(e[1]);
  if (x<=1 && y <=1 && x >= 0 && y >= 0 && file[2]) { //Only we have key, the door will open. (But I dont know how to do the collision and program delete)
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
  //I try to rotate the office door, But I dont know how to do it. I will find out in future.
}

function p_f(c) { //This is the mission compelete logo call out!
  push();
  imageMode(CENTER);
  if (!timer.expired()) {
    // tint(255,100*timer.getPercentageRemaining()); //This function will lower the frame rate!!!
    if (c) {
      image(logo[4],width/2,height/2,400,131);
    }
    else {
      image(logo[5],width/2,height/2,400,131);
    }
  }
  pop();
}

//==================== Clickable function ======================//

function setupClickables() { //Set up the clickables function!
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
  switch (this.id) { //Look up the buttons id, Main story line used, in NPC
    case 0: //If it is 0, next button, it will let index + 1;
      index++;
      break;
    case 1: //If it is 1, Office_A1, make index to 3, change to answer index 3 in Office NPC
      index = 3;
      break;
    case 2: //Same as before
      index = 5;
      break;
    case 3: //Same as before, but the NPC is in the Front (With case 3, 4, 5)
      index = 6;
      break;
    case 4: 
      index = 8;
      break;
    case 5:
      index = 11;
      break;
    case 6: //This will used in L2-NPC, same with case 7 (I Dont know if this is still needed or not.)
      index = 4;
      break;
    case 7:
      index = 16;
      break;
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
  //This is the L1 rooms.
  preload() {
    this.NPC = createSprite(400, 350, 80, 80);
    this.NPC.addAnimation('regular', NPC[1]);

    this.img = []; //This will be the array of the text dialog box:
    this.img[0] = loadImage('Asset/hello.png');
    this.img[1] = loadImage('Asset/bye.png');

    this.button = createSprite(width-40, height/2, 40,40);
    this.button.addImage(loadImage('Asset/button.png')); //And button in elevator
    this.e = ele_door_set(); //This is the set up for elevator doors, store in variable.
  }

  draw() {
    super.draw();
    drawSprite(this.NPC);
    //This will change the dialog box with distence.
    if (playerSprite.position.x > 600) image(this.img[1], 405,219);
    else image(this.img[0], 405,219);
    
    drawSprite(this.button);
    playerSprite.overlap(this.button, this.levelchange);

    ele_function(this.e); //This can move the elevtor door!
  }

  levelchange() {
    adventureManager.changeState("L2"); //Change to state, L2
    playerSprite.position.x -= 100;//Also you need to step away from the button.
  }
}

class L2_Room extends PNGRoom { //This is the room that has the Flash Drive!, first used content manager
  preload() {
    this.button = createSprite(width-40, height/2, 40,40);
    this.button.addImage(loadImage('Asset/button.png'));

    this.NPC2 = createSprite(670, 500, 80, 80);
    this.NPC2.addAnimation('regular', NPC[2]);

    this.e = ele_door_set();

    groupIndex = 0; //? I dont know if this is usedable in each state change. But the groupIndex should be 0 in every state change.
    talktaive[1] = true;//Set the NPC can be talk.
    talktaive[6] = false; //But set the NPC6 cannot talk, as long as you say yes to L2M4-NPC
  }

  draw() {
    super.draw();

    drawSprite(this.NPC2);
    if (talktaive[6]) playerSprite.overlap(this.NPC2, this.talkable); //Only if you talk to L2M4-NPC

    drawSprite(this.button);
    if (file[3]) playerSprite.overlap(this.button, this.levelchange); //Only if we have the cards, then the state can change.

    ele_function(this.e);
  }

  levelchange() {
    adventureManager.changeState("L3");
    playerSprite.position.x -= 100;
  }

  talkable() {
    if (talktaive[1] == true) //If the NPC are talkable
    {content.ChangeToState('L2'); //Change the current content to the L2.
    let conversation = content.GroupContent(groupIndex); 
    //Get the content as array, from group index as 0 as fist time get in. and other content for different Group.
    if (ina < conversation.length) { //Display each content as index, from ina as the content index.
      clickables[0].visible = true; //Visable to Next button.
      drawtextbox(conversation[ina]); //Draw the textbox with array.
      clickables[0].onPress = function temp() { //Override the Press function, let the ina (Content index) incline 1 in each click.
        ina++;
      } 
    } else if (groupIndex != 0) { //If we are in the other group, change this person cannot talk again, by variable.
      talktaive[1] = false;
    } 
    else {
      clickables[6].visible = true; //Let the #6 button visible.
      clickables[6].onPress = function temp() { //If the button are press, group to 1, content index to 0. Respect++
        groupIndex = 1;
        ina = 0;
        Respect++;
        file[4] = true; //And let the Flash drive go up.
      } 
      clickables[7].visible = true; //Let the #7 button visible.
      clickables[7].onPress = function temp() { //If the button are press, group to 2, content index to 0. Enemy++
        groupIndex = 2;
        ina = 0;
        Enemy++;
      }
    }}
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

    if (file[0]) this.NPC.remove(); //If we have the file, remove the NPC.
    else{
      if (playerSprite.position.x > 615) image(this.talk, 300, 160); //Display a small text box in Main Story
      playerSprite.overlap(this.NPC, this.talkable);
    }
  }

  talkable() { //!! This is the oldest version of conversation, try to use the content if you have to.
    clickables[0].visible = true; //Next button visible.
    clickables[0].onPress = clickableButtonPressed; //Override the Press function, see clickableButtonPressed()
    switch (index) { //change the different conversation by index, and Next button can change the index.
      case 0:
        drawtextbox("Leader: John, this is important, you need to delivered this file to the boss office in the upper level!");
        break;
      case 1:
        drawtextbox("John: Why am I? Did I have a choice?");
        break;
      case 2:
        drawtextbox("Leader: Well, I need to take a nap after this, but as a new man in this office, you have:");
        //Display the (ID) 1,2 button. And dismiss the visible of Next button.
        clickables[0].visible = false;
        for( let i = 1; i <= 2; i++ ) {
          clickables[i].visible = true;
        }
        break;
      case 3: //If you do the mission:
        drawtextbox("Great, I lost the key to the upper stair, you can find your way to that, right? If not, there are one people in the L2M4 office.");
        break;
      case 4:
        index = 0; //Set the index back to 0
        talktaive[0] = false; //Not talkable to this NPC
        return file[0] = true; // Get the file.
      case 5://If you dont, Game Over.
        drawtextbox("Really? So what did you want to do in this office? I will report to HR that you did not do any jobs!")
        break;
      default:
        adventureManager.changeState("END"); //change to the Ending
        Enemy = 99; //Enemy as the checker for End page.
        clickables[0].visible = false;//Next visiable.
      break;
    }
  }
}

class L2M1_room extends PNGRoom { //This is the state with two NPC, and Copy machine.
  preload() {
    this.copy = createSprite(70, 70, 80, 80);
    this.copy.addImage(loadImage('Asset/copy_machine.png'));

    this.NPC = createSprite(240, 520, 80, 80);
    this.NPC.addAnimation('regular', NPC[2]);
    this.NPC2 = createSprite(300, 520, 80, 80);
    this.NPC2.addAnimation('regular', NPC[6]);

    groupIndex = 0;
    talktaive[2] = true; //set the talkative to true.
  }

  draw() {
    super.draw();
    drawSprite(this.copy);
    drawSprite(this.NPC);
    drawSprite(this.NPC2);
    playerSprite.overlap(this.copy, copy_file);
    playerSprite.overlap(this.NPC, this.talkable); //If we overlap with the left NPC
  }

  talkable() { //sAME WITH L2_ROOM, SEE ABOVE
    if (talktaive[2] == true)
    {content.ChangeToState('L2M1');
    let conversation = content.GroupContent(groupIndex);
    if (ina < conversation.length) {
      clickables[0].visible = true;
      drawtextbox(conversation[ina]);
      clickables[0].onPress = function temp() {
        ina++;
      } 
    } else if (groupIndex != 0) {
      talktaive[2] = false;
    } 
    else {
      clickables[8].visible = true;
      clickables[8].onPress = function temp() {
        groupIndex = 1;
        ina = 0;
        Respect++;
      } 
      clickables[9].visible = true;
      clickables[9].onPress = function temp() {
        groupIndex = 2;
        ina = 0;
        Enemy++;
      }
    }}
  }
}

class L2M2_room extends PNGRoom {//NPC with hidden card location clue
  preload() { 
    this.NPC = createSprite(1000, 140, 80, 80);
    this.NPC.addAnimation('regular', NPC[5]);

    groupIndex = 0;
    talktaive[3] = true; //Set it can be talk
  }

  draw() {
    super.draw();
    drawSprite(this.NPC);
    playerSprite.overlap(this.NPC, this.talkable);
  }

  talkable() { //SEE ABOVE TO L2_ROOM
    if (talktaive[3] == true)
    {content.ChangeToState('L2M2');
    let conversation = content.GroupContent(groupIndex);
    if (ina < conversation.length) {
      clickables[0].visible = true;
      drawtextbox(conversation[ina]);
      clickables[0].onPress = function temp() {
        ina++;
      } 
    } else if (groupIndex != 0) {
      talktaive[3] = false;
    } 
    else {
      clickables[10].visible = true;
      clickables[10].onPress = function temp() {
        groupIndex = 1;
        ina = 0;
        Respect++;
        file[5] = true; //checker for the box, if true, we can use the secret key card.
      } 
      clickables[11].visible = true;
      clickables[11].onPress = function temp() {
        groupIndex = 2;
        ina = 0;
        Enemy++;
      }
    }}
  }
}

class L2M4_room extends PNGRoom {//Key from the NPC, task required
  preload() {
    this.box = createSprite(30, 400, 80, 80);
    this.box.addImage(loadImage('Asset/b.png'));

    this.NPC = createSprite(510, 350, 80, 80);
    this.NPC.addAnimation('regular', NPC[4]);
    
    groupIndex = 0;
    talktaive[4] = true; //Can be talkable at first.
  }

  draw() {
    super.draw();
    drawSprite(this.box);
    drawSprite(this.NPC);
    if (file[5]) playerSprite.overlap(this.box, this.card); //Only if we have the clue from L2M2, we can get the card.
    if (file[0]) playerSprite.overlap(this.NPC, this.talkable); //Only if we have the file
  }

  card() {
    file[3] = true; //Card is go up to screen.
  }

  talkable() {//SEE ABOVE, L2_ROOM
    if (talktaive[4] == true) {
      content.ChangeToState('L2M4');
      let conversation = content.GroupContent(groupIndex);
      if (ina < conversation.length) {
        clickables[0].visible = true;
        drawtextbox(conversation[ina]);
        clickables[0].onPress = function temp() {
          ina++;
        } 
      } else if (groupIndex != 0 && file[3] == true) { //Same as above, but also if we have the card.
        talktaive[4] = false;
      } 
      else {
        clickables[12].visible = true;
        clickables[12].onPress = function temp() {
          groupIndex = 1;
          ina = 0;
          talktaive[6] = true;
        } 
        clickables[13].visible = true;
        clickables[13].onPress = function temp() {
          groupIndex = 2;
          ina = 0;
          Enemy++;
        }
        if (file[4]) clickables[14].visible = true; //If we have the flash drive. show this button
        clickables[14].onPress = function temp() {
          groupIndex = 3;
          ina = 0;
          file[3] = true; //Get the key card
          file[4] = false; //Remove the Flash drive
        }
      }
    }
  }  
}

class L3 extends PNGRoom { //This is education
  preload() {
    this.NPC = createSprite(770, 440, 80, 80);
    this.NPC.addAnimation('regular', NPC[2]);

    this.button = createSprite(width-40, height/2, 40,40);
    this.button.addImage(loadImage('Asset/button.png'));

    this.copy = createSprite(1220, 530, 80, 80);
    this.copy.addImage(loadImage('Asset/copy_machine.png'));

    this.e = ele_door_set();
    talktaive[6] = true;

    groupIndex = 0;
  }

  draw() {
    super.draw();
    drawSprite(this.NPC);
    drawSprite(this.button);
    drawSprite(this.copy);
    playerSprite.overlap(this.button, this.levelchange);
    playerSprite.overlap(this.copy, copy_file);
    playerSprite.overlap(this.NPC, this.talkable);

    ele_function(this.e);
  }

  levelchange() {
    adventureManager.changeState("L2");
    playerSprite.position.x -= 100;
  }

  talkable() { //SEE ABOVE!!!
    if (talktaive[6]) {
      content.ChangeToState('L3');
      let conversation = content.GroupContent(groupIndex);
      if (ina < conversation.length) {
        clickables[0].visible = true;
        drawtextbox(conversation[ina]);
        clickables[0].onPress = function temp() {
          ina++;
        } 
      } else if (groupIndex != 0) {
        talktaive[6] = false;
      } 
      else {
        drawtextbox(''); //draw an empty rect, just like the text box. (TESTING)
        clickables[17].visible = true;
        clickables[17].onPress = function temp() {
          groupIndex = 1;
          ina = 0;
          //This NPC will not become Friends.
        } 
        clickables[18].visible = true;
        clickables[18].onPress = function temp() {
          groupIndex = 2;
          ina = 0;
          Enemy++;
        }
      }
    }
  }
}

class L3M2_room extends PNGRoom { //NPC needs help, with divice used.
  preload() {
    this.NPC = createSprite(820, 270, 80, 80);
    this.NPC.addAnimation('regular', NPC[4]);

    groupIndex = 0;
    talktaive[5] = true; //This NPC first is talkable - #5
  }

  draw() {
    super.draw();
    drawSprite(this.NPC);
    playerSprite.overlap(this.NPC, this.talkable);
  }

  talkable() { //SEE ABOVE!!!
    if (talktaive[5] == true) {
      content.ChangeToState('L3M2');
      let conversation = content.GroupContent(groupIndex);
      if (ina < conversation.length) {
        clickables[0].visible = true;
        drawtextbox(conversation[ina]);
        clickables[0].onPress = function temp() {
          ina++;
        } 
      } else if (groupIndex != 0) {
        talktaive[5] = false;
      } 
      else {
        drawtextbox(''); //draw an empty rect, just like the text box. (TESTING)
        clickables[15].visible = true;
        clickables[15].onPress = function temp() {
          groupIndex = 1;
          ina = 0;
          Respect++;
        } 
        clickables[16].visible = true;
        clickables[16].onPress = function temp() {
          groupIndex = 2;
          ina = 0;
          //This NPC will not become Enemy.
        }
      }
    }
  }
}

class L3M3_room extends PNGRoom {  //The one who can distroy your file.
  preload() {
    this.NPC = createSprite(1170, 70, 80, 80);
    this.NPC.addAnimation('regular', NPC[5]);

    talktaive[7] = true;
  }

  draw() {
    super.draw();
    drawSprite(this.NPC);
    playerSprite.overlap(this.NPC, this.talkable);
  }

  talkable() { //See above, L2_ROOM
    if (talktaive[7] && file[0]) { //if can talk and file is exist
      content.ChangeToState('L3M3');
      let conversation = content.GroupContent(groupIndex);
      if (ina < conversation.length) {
        clickables[0].visible = true;
        drawtextbox(conversation[ina]);
        clickables[0].onPress = function temp() {
          ina++;
        }
      } else { //ONLY one group. After conversation you will lost the file.
        file[0] = false;
      }
    }
  }
}

class L3M4_room extends PNGRoom {
  preload() {
    this.coffee = createSprite(580, 197, 80, 80);
    this.coffee.addImage(logo[1]); //This is coffee
  }

  draw() {
    super.draw();
    drawSprite(this.coffee);
    playerSprite.overlap(this.coffee, this.collect);
  }

  collect() {
    file[1] = true; //Have the coffee.
  }
}

class Front_room extends PNGRoom { //The front and two NPC
  preload() {
    index = 0;
    this.s = createSprite(90, 400, 80, 80);
    this.s.addAnimation('regular', NPC[3]);

    this.NPC = createSprite(220, 630, 80, 80);
    this.NPC.addAnimation('regular', NPC[1]);
    this.NPC2 = createSprite(880, 500, 80, 80);
    this.NPC2.addAnimation('regular', NPC[6]);

    this.transform = createSprite(80, 120, 155, 200);
    this.transform.shapeColor = color(255,0);

    this.door = office_door_set();
    talktaive[8] = true;
  }

  draw() {
    super.draw();
    drawSprite(this.s);
    office_door(this.door);
    if (!file[2]) playerSprite.overlap(this.s, this.talkable); //if we have the key, we cannot talk to her.

    drawSprite(this.NPC);
    drawSprite(this.NPC2);

    drawSprite(this.transform);
    if (file[2]) playerSprite.overlap(this.transform, function a(){ //This is a sprite, if we have key are overlap, it will jump to Boss office
      adventureManager.changeState("Boss_Office");
      playerSprite.position.x = 1200;
    } );

    if (front_index == 3 && !talktaive[8]) groupIndex = 3; //if the first NPC is compelte.
    if (front_index == 4 && talktaive[8]) groupIndex = 4; //if the second NPC is compelte.
    if (talktaive[8]) playerSprite.overlap(this.NPC, this.talkable2);
    else if (!talktaive[8] && front_index != 0) playerSprite.overlap(this.NPC2, this.talkable2);
  }

  talkable() { //Old function like the Office_Room, See above.
    clickables[0].visible = true;
    clickables[0].onPress = clickableButtonPressed;
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
        if (file[1]) clickables[5].visible = true; //If we have the coffee, show this button.
        break;
      case 6:
        drawtextbox("John: I will look into it.")
        break;
      case 7:
        return index = 5;//Keep it to the case 5
      case 8:
        drawtextbox("John: No I will do your business, I will put this file in here and please tell the Boss about it.");
        break;
      case 9:
        drawtextbox("Secretary: If you like! (Put the file under the desk)");
        break;
      case 10:
        return index = 50; //change to case defult
      case 11:
        drawtextbox("Secretary: Wow! You got it, thanks! and here is the key!");
        break;
      case 12:
        index = 0;
        file[1] = false;//no coffee
        return file[2] = true; //has key
      default:
        adventureManager.changeState("END");
        Enemy = 98; //another Ending.
        clickables[0].visible = false;
        break;
    }
  }

  talkable2() { //SEE ABOVE!!!
    content.ChangeToState('Front');
    let conversation = content.GroupContent(groupIndex);
    if (ina < conversation.length) {
      clickables[0].visible = true;
      drawtextbox(conversation[ina]);
      clickables[0].onPress = function temp() {
        ina++;
      }
    }
    else {
      if (groupIndex == 0) {
        drawtextbox(''); //draw an empty rect, just like the text box. (TESTING)
        clickables[19].visible = true;
        clickables[19].onPress = function temp() {
          groupIndex = 1;
          ina = 0;
          Respect +=2;
        } 
        clickables[20].visible = true;
        clickables[20].onPress = function temp() {
          groupIndex = 2;
          ina = 0;
          //Not become Enemy.
        }
      } else if (groupIndex == 2 || groupIndex == 4) { //drop the text box
        talktaive[8] = false;
        front_index = 0;
      } else if (groupIndex == 1) { //Accept, go to other.
        talktaive[8] = false;
        front_index = 3;
      } else if (groupIndex == 3) { //Other NPC is complete
        talktaive[8] = true;
        front_index = 4;
      }
    }
  }
}

class Boss_Room extends PNGRoom {
  preload() {
    index = 0;
    this.NPC =createSprite(200, height/2, 80, 80);
    this.NPC.addAnimation('regular', NPC[0]);

    this.transform = createSprite(1270, 100, 30, 200);
    this.transform.shapeColor = color(255,0);
  }

  draw() {
    super.draw();
    drawSprite(this.NPC);
    playerSprite.overlap(this.NPC, this.talkable);

    drawSprite(this.transform);
    playerSprite.overlap(this.transform, function a() {
      adventureManager.changeState("Front_door");
      playerSprite.position.x = 230;
    })
  }

  talkable() { //SEE OFFICE_ROOM
    clickables[0].visible = true;
    clickables[0].onPress = clickableButtonPressed;
    switch (index) {
      case 0:
        drawtextbox("John: Mr.Tom, I have something for you!");
        break;
      case 1:
        drawtextbox("Tom: Great, another agian, you better give me something better.");
        break;
      case 2:
        drawtextbox("John: A report from my department...");
        if (!file[0]) index = 6; //If we dont have he file, change to case 6.
        break;
      case 3:
        drawtextbox("John: Here you are!");
        break;
      case 4: 
        drawtextbox("Tom: Great, thanks!");
        break;
      case 5: 
        index = 10; //Change to case defult
      case 6:
        drawtextbox("John: Where is my file ?!?!");
        break;
      case 7:
        drawtextbox("Tom: You gotta be kidding me. You cannot save the file with your ability? What elese do you have? You don't need join this company after today.");
        Enemy = 100; //Another End
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

    /*
    This will be: 
    if Respect people are >= 5, Is good end
    if Enemy is 100 (Fail from boss), is Mission Fail;
    if Enemy is 99 (Fail in Office_room), same;
    if Enemy is 98 (Fail in Front_Room), same;
    If we have more than 3 Enemy, Is bad ending
    Other than that, is Normal Ending.
    */

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

class Content_Man {
  //Use csv file location as parameter.
  constructor(filename) {
    this.file = loadTable(filename,'csv','header');
    this.state = [];
    this.group = [];
  } 
  //set up the Content, with State name.
  setup() {
    let statetotal = 0;
    for (let i = 0; i < this.file.getRowCount(); i++) {
      let statename = this.file.getString(i, 'State');

      if (statename == '') return 'Not Valid State Name';
      else if (this.state.indexOf(statename) == -1) {
        this.state[statetotal] = statename;
        statetotal++;
      }
    }
  }
  //This will change to the state with the parameter "stateName", find the correct State in csv
  ChangeToState(stateName) {
    if (this.state.indexOf(stateName) == -1) return 'Not Valid State Name';
    else this.group = this.file.findRows(stateName,'State');
    return this.group;
  }
  //This will change to correct group with the parameter "groupID", find the correct Group in csv, return as array of content.
  GroupContent(groupID) {
    let content = [];
    for (let i = 0; i < this.group.length; i++) {
      if (this.group[i].getNum('Group') == groupID) {
        content[this.group[i].getNum('Index')] = this.group[i].getString('Content');
      }
    }
    return content;
  }
  //Not useful
  getAllStateName() {
    return this.state;
  }
  //Not useful
  getS() {
    return this.group;
  }
};