// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js


var Width = 800;
var Height = 500;



// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;

let seed = 0;
let tilesetImage;
let currentGrid = [];
let numRows, numCols;

function preload() {
  tilesetImage = loadImage(
    "https://cdn.glitch.com/25101045-29e2-407a-894c-e0243cd8c7c6%2FtilesetP8.png?v=1611654020438"
  );
}

function reseed() {
  seed = (seed | 0) + 1109;
  randomSeed(seed);
  noiseSeed(seed);
  select("#seedReport").html("seed " + seed);
  regenerateGrid();
}

function regenerateGrid() {
  select("#asciiBox").value(gridToString(generateGrid(numCols, numRows)));
  reparseGrid();
  smokes = [];
  start = true;
}

function reparseGrid() {
  currentGrid = stringToGrid(select("#asciiBox").value());
}

function gridToString(grid) {
  let rows = [];
  for (let i = 0; i < grid.length; i++) {
    rows.push(grid[i].join(""));
  }
  return rows.join("\n");
}

function stringToGrid(str) {
  let grid = [];
  let lines = str.split("\n");
  for (let i = 0; i < lines.length; i++) {
    let row = [];
    let chars = lines[i].split("");
    for (let j = 0; j < chars.length; j++) {
      row.push(chars[j]);
    }
    grid.push(row);
  }
  return grid;
}

function resizeScreen() {
  if(!fullscreen()){
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
  } else {
    resizeCanvas(windowWidth, windowHeight);
  }
}

// setup() function is called once when the program starts
function setup() {

  numCols = select("#asciiBox").attribute("rows") | 0;
  numRows = select("#asciiBox").attribute("cols") | 0;

  Width = 16 * numCols;
  Height = 16 * numRows;
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized

  // create an instance of the class

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();

  noCursor();
  angleMode(DEGREES);
  
  
}

var TimeAngle = 0;
var bFullScreen = false;
var timer = -20;
// draw() function is called repeatedly, it's the main animation loop
function draw() {
  //if(mouseIsPressed){
  //  fullscreen(true);
  //}
  //push();

  if(fullscreen() !== bFullScreen){
    bFullScreen = fullscreen();
    timer = 30;
  }
  timer--;
  if(timer === 20){
    resizeScreen();
  }
  if(timer === 10){
    resizeScreen();
  }
  if(timer === 0){
    resizeScreen();
  }
  var ratio = Width/Height;
  var W = width;
  var H = height;
  var ShiftX = 0;
  var S = 1;
  if(W/ratio > H){
    W = H*ratio;
  }else if(H*ratio > W){
    H = W/ratio;
    //ShiftX = abs(width - W);
    
  }
  fill(220);
  //rect(0, 0, W, H);
  var ShiftX = abs(width - W)/2;
  translate(ShiftX, 0);
  rect(0, 0, W, H);
  scale(W/Width);
  var MouseX = (mouseX - ShiftX)*(Width/W);
  var MouseY = mouseY*(Height/H);

  
  fill(0);
  rect(-10000, -10000, 10000, 100000);
  rect(Width, -5000, 1000, 100000);
  rect(-5000, Height, 10000, 10000);
}