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
    "img/tilesetP8.png"
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
  rectArray = [];
  smokes = [];
  start = true;
}

function reparseGrid() {
  currentGrid = stringToGrid(select("#asciiBox").value());
  rectArray = [];
  smokes = [];
  start = true;
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

  select("canvas").elt.getContext("2d").imageSmoothingEnabled = false;
  // resize canvas is the page is resized

  // create an instance of the class

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();

  noCursor();
  angleMode(DEGREES);

  select("#reseedButton").mousePressed(reseed);
  select("#asciiBox").input(reparseGrid);
  
  reseed();
}



var rectArray = [];

var overlap = function(a1, a2, b1, b2) {
  if(a1 <= b1 && a2 >= b1){
    return {start:b1, end:a2};
  }
  if(a2 >= b2 && a1 <= b2) {
    return {start:a1, end:b2};
  }
  if(a1 >= b1 && a2 <= b2) {
    return {start:a1, end:a2};
  }
  if(a1 <= b1 && a2 >= b2) {
    return {start:b1, end:b2};
  }
  return false;
}
var gridCheck = function(grid,i,j) {
  if(i >= 0 && i < grid.length && j >= 0 && j < grid[i].length){
    return true;
  }
  return false;
}


var gridCheckTarget = function(grid,i,j,target) {
  if(gridCheck(grid, i, j)){
    if(grid[i][j] === target){
      return true;
    }
  }
  return false;
}

var DrawRect = function(grid, I, J, I2, J2, c){
  for(let i = 0; i < rectArray.length; i++){
    let tmp = rectArray[i];
    let joverlap = overlap(I - 1, I2 + 1, tmp.i, tmp.i2);
    let ioverlap = overlap(J - 1, J2 + 1, tmp.j, tmp.j2);
    if(joverlap && ioverlap){
      return false;
    }
  }
  rectArray.push({i: I, j: J, i2: I2, j2: J2});
  
  for(let i = I; i <= I2; i++){
    for(let j = J; j <= J2; j++){
      if(gridCheck(grid, i, j)){
        grid[i][j] = c;
        if(random(0,100) <= 1){
          grid[i][j] = 'C'
        }
        else {
          let tmpd = dist(i, j, playeri, playerj);
          if(minDist === -1 || tmpd < minDist){
            playeri = i;
            playerj = j;
            minDist = tmpd;
          }
        }
      }
    }
  }
}
//[up, down, left, right]
const lookup = [
  {i:[0,1,2,3], j:[10]},//0000
  {i:[21,22,23,24], j:[21,22,23,24]},//0001
  {i:[21,22,23,24], j:[21,22,23,24]},//0010
  {i:[0,3], j:[9]},//0011
  {i:[21,22,23,24], j:[21,22,23,24]},//0100
  {i:[21,22,23,24], j:[21,22,23,24]},//0101
  {i:[21,22,23,24], j:[21,22,23,24]},//0110
  {i:[21,22,23,24], j:[21,22,23,24]},//0111
  {i:[21,22,23,24], j:[21,22,23,24]},//1000
  {i:[21,22,23,24], j:[21,22,23,24]},//1001
  {i:[21,22,23,24], j:[21,22,23,24]},//1010
  {i:[21,22,23,24], j:[21,22,23,24]},//1011
  {i:[0,3], j:[9]},//1100
  {i:[21,22,23,24], j:[21,22,23,24]},//1101
  {i:[21,22,23,24], j:[21,22,23,24]},//1110
  {i:[21,22,23,24], j:[21,22,23,24]}//1111
];
var gridCode = function(grid,i,j,target) {
  let northBit = gridCheckTarget(grid, i, j - 1, target);
  let southBit = gridCheckTarget(grid, i, j + 1, target);
  let westBit = gridCheckTarget(grid, i - 1, j, target);
  let eastBit = gridCheckTarget(grid, i + 1, j, target);
  return (northBit<<0)+(southBit<<1)+(eastBit<<2)+(westBit<<3);
}
var drawContext = function(grid,i,j,target,ti,tj) {
  let code = gridCode(grid, i, j, target);
  if(lookup[code] !== null){
    if(code == 3 || code == 12){
      grid[i][j] = '.';
    }
    const tmpObj = lookup[code];
    let tiOffset = random(tmpObj.i);
    let tjOffset = random(tmpObj.j);
    placeTile(i, j, ti + tiOffset, tj + tjOffset);
  }
}


var generateGrid = function(numCols, numRows) {
  let grid = [];
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      row.push("_");
    }
    grid.push(row);
  }
  rectArray = [];
  for(var i = 0; i < 100; i++){
    var I = floor(random(0, numRows));
    var J = floor(random(0, numCols));
    DrawRect(grid, I - floor(random(1, 3)), J - floor(random(1, 3)),I + floor(random(1, 3)), J + floor(random(1, 3)), '.');
  }
  
  for(let i = 0; i < rectArray.length; i++){
    let tmp1 = rectArray[i];
    for(let o = 0; o < rectArray.length; o++){
      let tmp2 = rectArray[o];
      let tmpOverlap = overlap(tmp1.j, tmp1.j2, tmp2.j, tmp2.j2);
      if(tmpOverlap){
        if(tmp1.i > tmp2.i2){
          if(tmp1.i - tmp2.i2 <= 4){
            let jval = floor(random(tmpOverlap.start, tmpOverlap.end + 1));
            for(let p = tmp2.i2 + 1; p < tmp1.i; p++){
              if(gridCheck(grid, p, jval)){
                grid[p][jval] = ".";
                let tmpd = dist(p, jval, playeri, playerj);
                if(minDist === -1 || tmpd < minDist){
                  playeri = p;
                  playerj = jval;
                  minDist = tmpd;
                }
              }
            }
          }
        }
      }
      let tmpOverlap2 = overlap(tmp1.i, tmp1.i2, tmp2.i, tmp2.i2);
      if(tmpOverlap2){
        if(tmp1.j > tmp2.j2){
          if(tmp1.j - tmp2.j2 <= 4){
            let ival = floor(random(tmpOverlap2.start, tmpOverlap2.end + 1));
            for(let p = tmp2.j2 + 1; p < tmp1.j; p++){
              if(gridCheck(grid, p, ival)){
                grid[ival][p] = ".";
                let tmpd = dist(ival, p, playeri, playerj);
                if(minDist === -1 || tmpd < minDist){
                  playeri = ival;
                  playerj = p;
                  minDist = tmpd;
                }
              }
            }
          }
        }
      }
    }
  }
  
  //DrawRect(grid, floor(grid.length/2) - floor(random(1, 3)), floor(grid.length/2) - floor(random(1, 3)), floor(grid.length/2) + floor(random(1, 3)), floor(grid.length/2) + floor(random(1, 3)), '.');
  //DrawRect(grid, 2, 2,6, 5, '.');
  
  //DrawRect(grid, 7, 2,12, 5, '.');
  
  console.log(rectArray);
  
  return grid;
}

var minDist = -1;
var playeri = 0;
var playerj = 0;
var start = true;
var timer = 0;

var drawGrid = function(grid) {
  background(128);
  if(start){
    minDist = -1;
    playeri = floor(random(grid.length));
    playerj = floor(random(grid[0].length));
  }
  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
      if (gridCheckTarget(grid, i, j, '.')) {
        placeTile(i, j, (floor(random(4))), 9);
      } else if (gridCheckTarget(grid, i, j, '#')) {
        placeTile(i, j, (floor(random(4))), 0);
      } else if (gridCheckTarget(grid, i, j, 'C')) {
        placeTile(i, j, random([0,1,2,3,4,5]), random([28,29]));
      } else {
        drawContext(grid, i, j, '.', 0, 0);
      }

    }
  }
  
  if(keyIsPressed && (keyCode === 65 || keyCode === 37) && timer <= 0){
    if(gridCheckTarget(grid, playeri, playerj - 1, '.')){
      playerj--;
      timer = 10;
    }
  }
  if(keyIsPressed && (keyCode === 68 || keyCode === 39) && timer <= 0){
    if(gridCheckTarget(grid, playeri, playerj + 1, '.')){
      playerj++;
      timer = 10;
    }
  }
  if(keyIsPressed && (keyCode === 87 || keyCode === 38) && timer <= 0){
    if(gridCheckTarget(grid, playeri - 1, playerj, '.')){
      playeri--;
      timer = 10;
    }
  }
  if(keyIsPressed && (keyCode === 83 || keyCode === 40) && timer <= 0){
    if(gridCheckTarget(grid, playeri + 1, playerj, '.')){
      playeri++;
      timer = 10;
    }
  }
  timer--;
  start = false;
}


var TimeAngle = 0;
var bFullScreen = false;
var timer = -20;
var multS = 0;
var shiftS = 0;
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
  fill(255);
  //rect(0, 0, W, H);
  var ShiftX = abs(width - W)/2;
  //scale((W/Width));
  shiftS = floor(ShiftX);
  rect(0, 0, W, H);
  //scale((W/Width));
  multS = floor(16*(W/Width));
  var MouseX = (mouseX - ShiftX)*(Width/W);
  var MouseY = mouseY*(Height/H);



  randomSeed(seed);
  drawGrid(currentGrid);

  //image(tilesetImage, 0, 0, 400, 400);
  translate(ShiftX, 0);

  scale(multS/16);

  fill(255);
  ellipse(playerj * 16 + 8, playeri*16 + 8, 8, 8);
  fill(0);
  rect(-10000, -10000, 10000, 100000);
  rect(Width, -5000, 1000, 100000);
  rect(-5000, Height, 10000, 10000);
}

function placeTile(i, j, ti, tj) {
  image(tilesetImage, j * multS + shiftS, i * multS, multS, multS, 8 * ti, 8 * tj, 8, 8);
}