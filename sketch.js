/***********************************************************************************
  Project 2
  by Jiaquan Wu
***********************************************************************************/
var debugScreen;

var title = [];
var imagearray = [];
var person = [];

var button_list = [];
var context;
var context_index;

var drawscreen;
var n;
var indextrack;

function preload(){
  debugScreen = new DebugScreen();
  debugScreen.print("DebugScreen Success!");

  title[0] = loadImage("Asset/title.png");
  title[1] = loadImage('Asset/p5.png')
  title[2] = loadImage('Asset/BCG.jpg');

  imagearray[0] = loadImage("Asset/house.jpg");
  imagearray[1] = loadImage('Asset/room.jpg');
  imagearray[2] = loadImage("Asset/workplace.jpg");

  person[0] = loadImage('Asset/person1.png');
  person[1] = loadImage('Asset/mom.png');

  context = loadTable("Asset/table/context.csv");
}

function setup() {
  createCanvas(1280, 720);
  imageMode(CENTER);
  time = new Timer(2000);
  indextrack = false;

  drawscreen = initialscreen;
  // drawscreen = screen1;

  button_list[0] = new Clickable();
  button_list[1] = button_create("Button1", 100, height - 300);
  button_list[2] = button_create("Button2", width - 500, height - 300);

  n = 0;
  context_index = 0;
}

function draw() {
  background(0);
  if (context_index >= context.getRowCount()){
    push();
    background(255);
    textSize(50);
    textAlign(CENTER);
    fill(0);
    text("END OF DEMO", width/2, height/2);
    pop();
  }

  if (context.getString(context_index, 0) === "S1" && n == -1) {
    drawscreen = screen1;
    context_index++;
  } else if (context.getString(context_index, 0) === "S2" || context.getString(context_index, 0) === "S3") {
    drawscreen = screen2;
    context_index++;
  } else if (context.getString(context_index, 0) === "S4"){
    drawscreen = screen3;
    context_index++;
  }

  drawscreen();

  // debugScreen.draw();
  debug();
}

function initialscreen() {
  background(0);
  //timer and system count
  if (n == 2) {
    n = 0;
    drawscreen = menu;
  }
  else if (time.expired() && n <= 1) {
    time.start();
    n++;
  }
  //color and size
  fill(255);
  textSize(20);

  //content
  text("Power By:", width/2 - 300, height/2 -200);
  image(title[1], width/2 - 200, height/2);  
  textSize(40);
  textFont('Georgia');
  text("& Jiaquan Wu", width/2, height/2);

  //alpha rate(), from timer
  if(n == 0) fill(0,255 * time.getPercentageRemaining());
  else if (n == 1) fill(0,255 * time.getPercentageElapsed());
  rect(0,0,width,height);  
}

function menu() {
  //play button create
  button_list[0].text = "Start";
  button_list[0].width = 300;
  button_list[0].height = 70;
  button_list[0].locate( width - 400, height/2 - 100);
  button_list[0].textSize = 30;
  button_list[0].textFont = "Arial";
  button_list[0].onPress = function() {
    drawscreen = screen1;
    indextrack = true;
    n = -1;
  };
  button_list[0].onHover = function () {
    this.color = "#00FFFF";
    this.textColor = "#000000";
  };
  button_list[0].onOutside = function () {
    this.color = "#FFFFFF";
    this.textColor = "#000000";
  };

  //background and asset
  fill(255);
  image(title[2], width/2, height/2, width, height);
  image(title[0], 400, 141, 800, 262);
  button_list[0].draw();
}

function debug() {
  push();
  fill(255);
  textSize(20);
  text("X: " + mouseX + "   Y: " + mouseY, 20, height - 20);
  pop();
}

function basic_screen(name, NPCtext) {
  //text box
  push();
  fill(152,245,255,230);
  rect( 50, height - 200, width - 100, 180, 20);

  //NPC's name
  fill(132,112,255);
  quad(100,height-230, 290,height - 230, 270, height - 180, 80, height - 180);
  fill(255);
  textSize(22);
  text(name, 100, height-195);

  //text
  fill(255);
  textSize(30);
  text(NPCtext, 70, height - 170, width - 120, 180);
  pop();
}

screen1 = function() {
  //background
  image(imagearray[0], width/2, height/2, width, height);
  //person
  image(person[0], width/2 - 300, height/2);
  //text
  basic_screen(context.getString(context_index,0), context.getString(context_index,1));
}

screen2 = function() {
  //background
  image(imagearray[1], width/2, height/2, width, height);
  //person
  image(person[0], width/2 - 300, height/2);
  image(person[1], width/2 + 300, height/2);
  //text
  if (context.getString(context_index,0) === "S2.1") {
    indextrack = false;
    button_list[1].text = "Question about the society";
    button_list[2].text = "Does't care about the announcement";
    button_list[1].onPress = function() {
      context_index = 15;
      indextrack = true;
    };
    button_list[2].onPress = function() {
      context_index = 20;
      indextrack = true;
    };
    button_list[1].draw();
    button_list[2].draw();
  } else if (context.getString(context_index,0) === "S2.2") context_index = 24;
  else basic_screen(context.getString(context_index,0), context.getString(context_index,1));
}

function mousePressed() {
  if(indextrack) {
    context_index++;
  }
}

function button_create (label, x, y) {
  let tb  = new Clickable();
  
  tb.text = label;
  
  // set width + height to image size
  tb.width = 400;
  tb.height = 200;
  tb.textSize = 30;
  
  tb.locate( x, y );
  
  tb.onHover = function() {
    this.color = "#00FFFF";
    this.textColor = "#000000";
  };
  tb.onOutside = function () {
    this.color = "#FFFFFF";
    this.textColor = "#000000";
  };
  
  return tb;
}