// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js


var Width = 800;
var Height = 500;


var trees = [];
let pg_light;
let pg_sunmoon;
let pg_trees1;
let pg_trees2;
let pg_mountain;

var Noise = function(x, y, min, max){
  return noise(x, y)*abs(max - min) + min;
}

var tree = function(x, y, s, c1, c2, PG){
  PG.fill(c1);
  PG.noStroke();
  PG.triangle(x - 0.1*s, y, x+0.1*s, y, x, y - 0.5*s);
  PG.fill(c2);
  PG.noStroke();
  PG.ellipse(x, y - 0.5*s, 0.5*s, 0.4*s);
  PG.triangle(x - 0.24*s, y - 0.54*s, x+0.24*s, y - 0.54*s, x, y - 1.5*s);
}
var drawSunChange = function(al){
  tint(255, 255, 255, al);
  image(pg_sunchange, 0, 0, 800, 500);
  noTint();
}
var drawLight = function(x, y){
  image(pg_light, x - 250, y - 250, 500, 500);
}
var drawStars = function(){
  image(pg_stars, 0, 0, 800, 500);
}
var drawSunMoon = function(){
  image(pg_sunmoon, 0, 0, 800, 1000);
}
var drawTrees1 = function(){
  image(pg_trees1, 0, 0, 800, 500);
}
var drawTrees2 = function(){
  image(pg_trees2, 0, 0, 800, 500);
}
var drawMountains = function(){
  image(pg_mountain, 0, 0, 800, 500);
}



// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;

class MyClass {
    constructor(param1, param2) {
        this.property1 = param1;
        this.property2 = param2;
    }

    myMethod() {
        // code to run when method is called
    }
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
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized

  // create an instance of the class
  myInstance = new MyClass("VALUE1", "VALUE2");

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();

  noCursor();
  angleMode(DEGREES);
  pg_light = createGraphics(500, 500);
  pg_sunchange = createGraphics(800, 500);
  pg_stars = createGraphics(800, 500);
  pg_sunmoon = createGraphics(800, 1000);
  pg_trees1 = createGraphics(800, 500);
  pg_trees2 = createGraphics(800, 500);
  pg_mountain = createGraphics(800, 500);
  
  pg_light.noFill();
  var tmpr = 40;
  var tmpFade = function(x){
    var s = x*x;
    var a = (s-abs(x));
    if(a === 0){
      return 1;
    }
    if(a === 0){
      return 0;
    }
    var b = (2*a + 1);
    return 1-(s/b);
  }
  for(var i = 0; i < tmpr; i++){
    pg_light.stroke(255, 255, 255, 255 * tmpFade(i/tmpr));
    //stroke(0);
    pg_light.ellipse(250, 250, i,i);
    //ellipse(250 + i, 250 + 255 * tmpFade((i-tmpr)/tmpr), 2, 2);
    //console.log(255 * tmpFade((x-tmpr)/tmpr));
  }
  
  
  
  //pg_sunchange.background(255, 0, 0);
  for(var y = 100; y > 0; y--){
    pg_sunchange.stroke(lerpColor(color(238,175,97), color(248,185,107), (100 - y)/100));
    pg_sunchange.line(0, y, 800, y);
  }
  for(var y = 200; y > 100; y--){
    pg_sunchange.stroke(lerpColor(color(251,144,98), color(238,175,97), (200 - y)/100));
    pg_sunchange.line(0, y, 800, y);
  }
  for(var y = 300; y > 200; y--){
    pg_sunchange.stroke(lerpColor(color(238,93,108), color(251,144,98), (300 - y)/100));
    pg_sunchange.line(0, y, 800, y);
  }
  for(var y = 400; y > 300; y--){
    pg_sunchange.stroke(lerpColor(color(206,73,14), color(238,93,108), (400 - y)/100));
    pg_sunchange.line(0, y, 800, y);
  }
  for(var y = 500; y > 400; y--){
    pg_sunchange.stroke(lerpColor(color(106,13,131), color(206,73,147), (500 - y)/100));
    pg_sunchange.line(0, y, 800, y);
  }
  
  
  //background(0, 100, 0);
  //tree(200, 200, 30);
  pg_stars.background(0);
  pg_stars.noStroke();
  for(var x = -100; x < 900; x += 10){
    for(var y = -100; y < 600; y += 10){
      pg_stars.fill(255, 255, 255);
      var tmpr = random(1,3);
      pg_stars.ellipse(x + random(-5, 5), y + random(-5, 5), tmpr, tmpr);
    }
  }
  
  
  
  
  
  
  pg_sunmoon.noStroke();
  pg_sunmoon.fill(255, 255, 0);
  //ellipse(400 + sin(TimeAngle)*375, 450 - cos(TimeAngle)*375, 70, 70);
  pg_sunmoon.ellipse(400, 450 - 375, 70, 70);
  
  
  pg_sunmoon.noStroke();
  pg_sunmoon.fill(240, 240, 240);
  //ellipse(400 + sin(TimeAngle)*375, 450 - cos(TimeAngle)*375, 70, 70);
  pg_sunmoon.ellipse(400, 450 + 375, 70, 70);
  
  var dotArr = [];
  for(var i = 0; i < 5000; i++){
    var isCol = false;
    var newDot = {x:400 + random(-70/2, 70/2), y: 450 + 375 + random(-70/2, 70/2), r: random(15, 40)};
    for(var o = 0; o < dotArr.length; o++){
      if(dist(newDot.x, newDot.y, dotArr[o].x, dotArr[o].y) < (newDot.r + dotArr[o].r)/2.5){
        isCol = true;
      }
    }
    if(!isCol && dist(400, 450 + 375, newDot.x, newDot.y) < 70/2 - newDot.r/2){
      dotArr.push(newDot);
    }
  }
  
  for(var i = 0; i < 300; i++){
    var isCol = false;
    var newDot = {x:400 + random(-70/2, 70/2), y: 450 + 375 + random(-70/2, 70/2), r: random(5, 30)};
    for(var o = 0; o < dotArr.length; o++){
      if(dist(newDot.x, newDot.y, dotArr[o].x, dotArr[o].y) < (newDot.r + dotArr[o].r)/2.5){
        isCol = true;
      }
    }
    if(!isCol && dist(400, 450 + 375, newDot.x, newDot.y) < 70/2 - newDot.r/2){
      dotArr.push(newDot);
    }
  }
  
  pg_sunmoon.fill(200, 200, 200);
  for(var i = 0; i < dotArr.length; i++){
    pg_sunmoon.ellipse(dotArr[i].x, dotArr[i].y, dotArr[i].r/2, dotArr[i].r/2);
  }
  
  
  
  for(var y = -100; y <= 400; y += 15/2){
    for(var x = 0; x <= 800; x += 7/2){
      if(y + noise(x/200)*100 + noise(x/100)*50 - ((600-x)*(600-x))/4000 > x - 50){
        if(y + noise(x/100)*50 + noise(x/200)*100 > 400){
          continue;
        }
        trees.push({
          pg: pg_trees2,
          x: x + random(-5,5)/2, 
          y: y + 100 + random(-5,5)/2, 
          s: (30/2 + random(-5,5)), 
          c1: color(139,69,19), 
          c2: color(Noise(x/100 + 1000, y/100 - 1000, 0,60) + random(-10,10) - 40, 
                    Noise(x/100, y/100,80,170) + random(-10,10) - 40, 
                    Noise(x/100 + 10000, y/100 - 10000,0,60) + random(-10,10) - 40)});
        //tree(x + random(-5,5), y + random(-5,5), 30, color(139,69,19), color(0 + random(0,50), 200 + random(-80,0), 0 + random(0,50)));
      }
    }
  }
  
  
  
  
  
  
  
  
  for(var y = -100; y <= 400; y += 15/2){
    for(var x = 800; x >= 0; x -= 7/2){
      if(y + noise(x/200)*100 + noise(x/100)*50 - ((x-200)*(x-200))/4000 > 750-x){
        if(y + noise(x/100)*50 + noise(x/200)*100 > 450){
          continue;
        }
        trees.push({
          pg: pg_trees1,
          x: x + random(-5,5)/2, 
          y: y + 100 + random(-5,5)/2, 
          s: (30/2 + random(-5,5)), 
          c1: color(139,69,19), 
          c2: color(Noise(x/100 + 1000, y/100 - 1000, 0,60) + random(-10,10), 
                    Noise(x/100, y/100,80,170) + random(-10,10), 
                    Noise(x/100 + 10000, y/100 - 10000,0,60) + random(-10,10))});
        //tree(x + random(-5,5), y + random(-5,5), 30, color(139,69,19), color(0 + random(0,50), 200 + random(-80,0), 0 + random(0,50)));
      }
    }
  }
  
  pg_mountain.noStroke();
  //nopg.fill();
  pg_mountain.fill(200, 200, 200);
  pg_mountain.beginShape();
  pg_mountain.vertex(0, 500);
  for(var x = 0; x <= 800; x += 8){
      //if(y + noise(x/200)*100 + noise(x/100)*50 > 750-x){
      //}
      var y = ((noise(x/200)*500 + noise(x/100)*200)*abs((x-400)/300))/2 + 150;
      pg_mountain.vertex(x, y);
  }
  pg_mountain.vertex(800, 500);
  pg_mountain.endShape();
  
  var rv = function(x){
    return 170 + noise(x/100)*100;
  };
  pg_mountain.noStroke();
  pg_mountain.fill(250, 250, 255);
  pg_mountain.beginShape();
  //pg.vertex(0, 500);
  var start = false;
  var startx = 0;
  for(var x = 0; x <= 800; x += 2){
      //if(y + noise(x/200)*100 + noise(x/100)*50 > 750-x){
      //}
      var y = ((noise(x/200)*500 + noise(x/100)*200)*abs((x-400)/300))/2 + 150;
      if(y > rv(x)){
        y = rv(x);
      }
      pg_mountain.vertex(x, y);
  }
  pg_mountain.vertex(800, 500);
  
  for(var x = 800; x >= 0; x -= 2){
      //if(y + noise(x/200)*100 + noise(x/100)*50 > 750-x){
      //}
      var y = 800;
      if(y > rv(x)){
        y = rv(x);
      }
    pg_mountain.vertex(x, y);
  }
  pg_mountain.vertex(0, 500);
  pg_mountain.endShape();
  
  
  
  pg_trees2.noStroke();
  pg_trees2.fill(10, 200 - 15, 10);
  pg_trees2.beginShape();
  pg_trees2.vertex(0, 500);
  for(var x = 0; x <= 800; x += 7/2){
      //if(y + noise(x/200)*100 + noise(x/100)*50 > 750-x){
      //}
      var y = x - 50 - noise(x/200)*100 - noise(x/100)*50 + ((600-x)*(600-x))/4000 + 100;
      if(y < 100){
        //y = 100;
      }
      pg_trees2.vertex(x, y);
  }
  pg_trees2.vertex(800, 500);
  pg_trees2.endShape();
  
  pg_trees1.noStroke();
  pg_trees1.fill(10, 200, 10);
  pg_trees1.beginShape();
  pg_trees1.vertex(800, 500);
  for(var x = 800; x >= 0; x -= 7/2){
      //if(y + noise(x/200)*100 + noise(x/100)*50 > 750-x){
      //}
      var y = 750-x - noise(x/200)*100 - noise(x/100)*50 + ((x-200)*(x-200))/4000 + 100;
      if(y < 100){
        //y = 100;
      }
      pg_trees1.vertex(x, y);
  }
  pg_trees1.vertex(0, 500);
  pg_trees1.endShape();
  
  
  for(var i = 0; i < trees.length; i++){
    tree(trees[i].x, trees[i].y, trees[i].s, trees[i].c1, trees[i].c2, trees[i].pg);
  }
  
  
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
  var ratio = 800/500;
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
  rect(0, 0, W, H);
  var ShiftX = abs(width - W)/2;
  translate(ShiftX, 0);
  scale(W/Width);
  var MouseX = (mouseX - ShiftX)*(Width/W);
  var MouseY = mouseY*(Height/H);
  
  
  //pushMatrix();
  //scale(width/Width);
  
  noTint();
  drawStars();
  //else{
    //background(135, 206, 235);
  //}
  background(135, 206, 235, -pow(TimeAngle, 2)/6 + 2000);
  background(135, 206, 235, -pow(abs(TimeAngle - 360), 2)/6 + 2000);
  
  //background(255, 0, 0, -pow(abs(TimeAngle - 90), 2)/1 + 500);
  //background(255, 0, 0, -pow(abs(TimeAngle - 270), 2)/1 + 500);
  drawSunChange(-pow(abs(TimeAngle - 90), 2)/1 + 500);
  drawSunChange(-pow(abs(TimeAngle - 270), 2)/1 + 500);
  //background(0, 0, 255);
  
  push();
  translate(400, 450);
  rotate(TimeAngle);
  translate(-400, -450);
  drawSunMoon();
  TimeAngle += 0.1;
  //TimeAngle += 0.5;
  pop();
  if(TimeAngle > 360){
    TimeAngle -= 360;
  }
  tint(Math.max(Math.max(-pow(TimeAngle, 2)/6 + 2000, -pow(abs(TimeAngle - 360), 2)/6 + 2000), 100));
  
  drawMountains();
  drawTrees2();
  //ellipse(mouseX, mouseY, 30, 30);
  tint(255, 255, 255, 500 - Math.max(Math.max(-pow(TimeAngle, 2)/6 + 2000, -pow(abs(TimeAngle - 360), 2)/6 + 2000), 100));
  drawLight(MouseX, MouseY);
  tint(Math.max(Math.max(-pow(TimeAngle, 2)/6 + 2000, -pow(abs(TimeAngle - 360), 2)/6 + 2000), 100));
  drawTrees1();
  //pop();
  fill(0);
  rect(-10000, -10000, 10000, 100000);
  rect(800, -5000, 1000, 100000);
  rect(-5000, 500, 10000, 10000);
}