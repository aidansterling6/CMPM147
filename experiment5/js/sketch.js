/* exported preload, setup, draw */
/* global memory, dropper, restart, rate, slider, activeScore, bestScore, fpsCounter */
/* global getInspirations, initDesign, renderDesign, mutateDesign */

let bestDesign;
let currentDesign;
let currentScore;
let currentInspiration;
let currentCanvas;
let currentInspirationPixels;
function preload() {
  //let img = document.createElement("img");
  //img.src = "https://lazoo.org/wp-content/uploads/2020/02/Gecko-Giant-Day-2.jpg";
  //img.width = width;
  //img.height = height;
  //ImageTop.appendChild(img);


  let allInspirations = getInspirations();

  let img = document.getElementById("TopImage");
  img.src = "https://cdn.glitch.global/3abd0223-86fb-43ce-a00a-fde12615bcd5/lunch-on-a-skyscraper.jpg?v=1714798266994";

  for (let i = 0; i < allInspirations.length; i++) {
    let insp = allInspirations[i];
    insp.image = loadImage(insp.assetUrl);
    let option = document.createElement("option");
    option.value = i;
    option.innerHTML = insp.name;
    dropper.appendChild(option);
  }
  dropper.onchange = e => inspirationChanged(allInspirations[e.target.value]);
  currentInspiration = allInspirations[0];

  restart.onclick = () =>
    inspirationChanged(allInspirations[dropper.value]);
}

function inspirationChanged(nextInspiration) {
  currentInspiration = nextInspiration;
  currentDesign = undefined;
  memory.innerHTML = "";
  let img = document.getElementById("TopImage");
  img.src = currentInspiration.assetUrl;
  setup();
}



function setup() {
  currentCanvas = createCanvas(width, height);
  currentCanvas.parent(document.getElementById("active"));
  currentScore = Number.NEGATIVE_INFINITY;
  currentDesign = initDesign(currentInspiration);
  bestDesign = currentDesign;
  image(currentInspiration.image, 0,0, width, height);
  loadPixels();
  currentInspirationPixels = pixels;
}

function evaluate() {
  loadPixels();

  let error = 0;
  let n = pixels.length;
  
  for (let i = 0; i < n; i++) {
    error += sq(pixels[i] - currentInspirationPixels[i]);
  }
  return 1/(1+error/n);
}

function memorialize() {
  let url = currentCanvas.canvas.toDataURL();

  let img = document.createElement("img");
  img.classList.add("memory");
  img.src = url;
  img.width = width;
  img.height = height;
  img.title = currentScore;

  document.getElementById("best").innerHTML = "";
  document.getElementById("best").appendChild(img.cloneNode());

  img.width = width / 2;
  img.height = height / 2;

  memory.insertBefore(img, memory.firstChild);

  if (memory.childNodes.length > memory.dataset.maxItems) {
    memory.removeChild(memory.lastChild);
  }
}

var scoreDist = 50;
var scores = [];

let mutationCount = 0;

function draw() {
  
  if(!currentDesign) {
    return;
  }
  randomSeed(mutationCount++);
  currentDesign = JSON.parse(JSON.stringify(bestDesign));
  rate.innerHTML = slider.value;
  rate2.innerHTML = slider2.value;
  rate3.innerHTML = slider3.value;
  mutateDesign(currentDesign, currentInspiration, slider.value/100.0, slider2.value/100.0, slider3.value/100.0);
  randomSeed(0);
  renderDesign(currentDesign, currentInspiration);
  let nextScore = evaluate();
  activeScore.innerHTML = nextScore;
  let delta = 0;
  if (nextScore > currentScore) {
    delta = nextScore - currentScore;
    currentScore = nextScore;
    bestDesign = currentDesign;
    memorialize();
    bestScore.innerHTML = currentScore;
  }
  scores.push(delta);
  let sd = scores.length - scoreDist;
  if(sd > 0){
    scores.splice(0, sd);
  }
  let count = 0;
  for(let i = 0; i < scores.length; i++){
    count += scores[i];
  }
  //console.log(scores.length);
  LearningCounter.innerHTML = count/scores.length;
  fpsCounter.innerHTML = Math.round(frameRate());
}
