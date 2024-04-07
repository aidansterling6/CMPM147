const fillers = {
  createCanvas: [
    "createCanvas(400, 400);",
    "createCanvas(500, 500);",
    "createCanvas(600, 600);",
    "createCanvas(800, 800);",
    "createCanvas(random(300,500), random(300,500));",
  ],
  sx: [
    "width/2;",
    "random(0,width);",
  ],
  sy: [
    "height/2;",
    "random(0,height);",
  ],
  svx: [
    "20;",
    "random(-5,5);",
    "random(-10,10);"
  ],
  svy: [
    "20;",
    "random(-5,5);",
    "random(-10,10);"
  ],
  startgrav: [
    `
    ax = random(-1,1);
    ay = random(-1,1);
    `,
    `
    ax = 0;
    ay = -0.4;
    `,
    `
    ax = 0;
    ay = 0.4;
    `,
    `
    ax = -0.4;
    ay = 0;
    `,
    `
    ax = 0.4;
    ay = 0;
    `,
  ],
  color: [
    "255",
    "random(50,200)",
    "255, 0, 0",
    "255, 0, 255",
    "30, 30, 30, 100",
    "255, 255, 255, 200",
    "255, 255, 255, 100",
    "random(50,200), random(50,200), random(50,200), 100",
    "random(50,200), random(50,200), random(50,200), 255",
    "random(50,200), random(50,200), random(50,200), 20",
    "random(50,200), random(50,200), random(50,200), 75"
  ],
  shape: [
    "ellipse",
    "rect"
  ],
  effect: [
    "ax += random(-0.1,0.1);",
    "ay += random(-0.1,0.1);",
    "vx += random(-0.1,0.1);",
    "vy += random(-0.1,0.1);",
    "X += 5",
    "X -= 5",
    "Y += 5",
    "Y -= 5",
    `
    translate(width/2, height/2);
    rotate($c);
    translate(-width/2, -height/2);
    `,
    `
    line(0,0,X,Y);
    line(width,0,X,Y);
    line(0,height,X,Y);
    line(width,height,X,Y);
    `,
    `
    $shape(width - X, height - Y, Size, Size);
    `,
    `
    $shape(width/2 + vx, height/2 + vy, Size, Size);
    `
  ],
  c: [
    "X",
    "Y",
    "vx",
    "vy"
  ]
};
const template = 
`
var X;
var Y;
var Size;
var vx;
var vy;
var ax;
var ay;
var c1;
var c2;
var c3;

function setup() {
  $createCanvas
  
  c1 = $color;
  c2 = $color;
  c3 = $color;
  
  Size = random(20,50);
  
  X = $sx
  Y = $sy
  
  vx = $svx
  vy = $svy
  
  $startgrav
  
}

function draw() {
  background(c1);
  vx += ax;
  vy += ay;
  
  X += vx;
  Y += vy;
  
  if(X > width - Size/2){
    X = width - Size/2;
    vx = -abs(vx);
  }
  if(X < Size/2){
    X = Size/2;
    vx = abs(vx);
  }
  if(Y > height - Size/2){
    Y = height - Size/2;
    vy = -abs(vy);
  }
  if(Y < Size/2){
    Y = Size/2;
    vy = abs(vy);
  }
  
  $effect
  $effect
  $effect
  
  rectMode(CENTER);
  fill(c2);
  stroke(c3);
  $shape(X, Y, Size, Size);
}
`;

// STUDENTS: You don't need to edit code below this line.

const slotPattern = /\$(\w+)/;

function replacer(match, name) {
  let options = fillers[name];
  if (options) {
    return options[Math.floor(Math.random() * options.length)];
  } else {
    return `<UNKNOWN:${name}>`;
  }
}

function generate() {
  let story = template;
  while (story.match(slotPattern)) {
    story = story.replace(slotPattern, replacer);
  }

  /* global box */
  box.innerText = story;
}

/* global clicker */
clicker.onclick = generate;

generate();
