/***********************************************************************************
  Project 2
  by Jiaquan Wu
***********************************************************************************/
var debugScreen;

function preload(){
  debugScreen = new DebugScreen();
  debugScreen.print("DebugScreen Success!");
}

function setup() {
  createCanvas(800, 300);
}

function draw() {
  background(255, 255, 255);
  debugScreen.draw();
}