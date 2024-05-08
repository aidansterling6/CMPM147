let worldSeed;
let Gkey = "xyzzy";

const s1 =(sketch) => {
  /* global p5 */
  /* exported preload, setup, draw, mouseClicked */

  // Project base code provided by {amsmith,ikarth}@ucsc.edu


  let tile_width_step_main; // A width step is half a tile's width
  let tile_height_step_main; // A height step is half a tile's height

  // Global variables. These will mostly be overwritten in setup().
  let tile_rows, tile_columns;
  let camera_offset;
  let camera_velocity;

  /////////////////////////////
  // Transforms between coordinate systems
  // These are actually slightly weirder than in full 3d...
  /////////////////////////////
  function worldToScreen([world_x, world_y], [camera_x, camera_y]) {
    let i = (world_x - world_y) * tile_width_step_main;
    let j = (world_x + world_y) * tile_height_step_main;
    return [i + camera_x, j + camera_y];
  }

  function worldToCamera([world_x, world_y], [camera_x, camera_y]) {
    let i = (world_x - world_y) * tile_width_step_main;
    let j = (world_x + world_y) * tile_height_step_main;
    return [i, j];
  }

  function tileRenderingOrder(offset) {
    return [offset[1] - offset[0], offset[0] + offset[1]];
  }

  function screenToWorld([screen_x, screen_y], [camera_x, camera_y]) {
    screen_x -= camera_x;
    screen_y -= camera_y;
    screen_x /= tile_width_step_main * 2;
    screen_y /= tile_height_step_main * 2;
    screen_y += 0.5;
    return [Math.floor(screen_y + screen_x), Math.floor(screen_y - screen_x)];
  }

  function cameraToWorldOffset([camera_x, camera_y]) {
    let world_x = camera_x / (tile_width_step_main * 2);
    let world_y = camera_y / (tile_height_step_main * 2);
    return { x: Math.round(world_x), y: Math.round(world_y) };
  }

  function worldOffsetToCamera([world_x, world_y]) {
    let camera_x = world_x * (tile_width_step_main * 2);
    let camera_y = world_y * (tile_height_step_main * 2);
    return new p5.Vector(camera_x, camera_y);
  }

  //sketch.preload = function() {
   // if (p3_preload) {
      //p3_preload();
   // }
  // }

  sketch.setup = function() {
    canvas1 = sketch.createCanvas(900, 500);
    //canvas1.parent("container");

    let label = sketch.createP();
    label.html("World key: ");
    label.parent("canvas-container1");

    let input = sketch.createInput("xyzzy");
    input.parent(label);
    input.input(() => {
      rebuildWorld(input.value());
    });

    sketch.createP("Arrow or wasd keys scroll").parent("canvas-container1");

    camera_offset = new p5.Vector(-sketch.width / 2, sketch.height / 2);
    camera_velocity = new p5.Vector(0, 0);

    //if (p3_setup) {
     // p3_setup();
   // }
    for (let element of document.getElementsByClassName("p5Canvas")) {
      element.addEventListener("contextmenu", (e) => e.preventDefault());
    }

    window.addEventListener("keydown", function(e) {
      if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
              e.preventDefault();
      }}, false);
    
    //l// Display coordinateset label = sketch.createP();
    //label.html("World key: ");
    //label.parent("canvas-container1");

    //let input = sketch.createInput("xyzzy");
    //input.parent(label);
    //input.input(() => {
    //  rebuildWorld(input.value());
    //});

    //sketch.createP("Arrow keys scroll. Clicking changes tiles.").parent("canvas-container1");

    //rebuildWorld(input.value());
    
    rebuildWorld(Gkey);
  }

  function rebuildWorld(key) {
    if (p3_worldKeyChanged) {
      p3_worldKeyChanged(key);
    }
    tile_width_step_main = p3_tileWidth ? p3_tileWidth() : 32;
    tile_height_step_main = p3_tileHeight ? p3_tileHeight() : 14.5;
    tile_columns = Math.ceil(sketch.width / (tile_width_step_main * 2));
    tile_rows = Math.ceil((sketch.height + 150) / (tile_height_step_main * 2));
  }

  sketch.mouseClicked = function() {
    let world_pos = screenToWorld(
      [0 - sketch.mouseX, sketch.mouseY],
      [camera_offset.x, camera_offset.y]
    );

    if (p3_tileClicked) {
      p3_tileClicked(world_pos[0], world_pos[1]);
    }
    return false;
  }

  sketch.draw = function() {
    // Keyboard controls!
    if (sketch.keyIsDown(sketch.LEFT_ARROW) || sketch.keyIsDown(65)) {
      camera_velocity.x -= 1;
    }
    if (sketch.keyIsDown(sketch.RIGHT_ARROW) || sketch.keyIsDown(68)) {
      camera_velocity.x += 1;
    }
    if (sketch.keyIsDown(sketch.DOWN_ARROW) || sketch.keyIsDown(83)) {
      camera_velocity.y -= 1;
    }
    if (sketch.keyIsDown(sketch.UP_ARROW) || sketch.keyIsDown(87)) {
      camera_velocity.y += 1;
    }

    let camera_delta = new p5.Vector(0, 0);
    camera_velocity.add(camera_delta);
    camera_offset.add(camera_velocity);
    camera_velocity.mult(0.95); // cheap easing
    if (camera_velocity.mag() < 0.01) {
      camera_velocity.setMag(0);
    }

    let world_pos = screenToWorld(
      [0 - sketch.mouseX, sketch.mouseY],
      [camera_offset.x, camera_offset.y]
    );
    let world_offset = cameraToWorldOffset([camera_offset.x, camera_offset.y]);

    sketch.background(100);

    if (p3_drawBefore) {
      p3_drawBefore();
    }

    let overdraw = 0.1;

    let y0 = Math.floor((0 - overdraw) * tile_rows);
    let y1 = Math.floor((1 + overdraw) * tile_rows);
    let x0 = Math.floor((0 - overdraw) * tile_columns);
    let x1 = Math.floor((1 + overdraw) * tile_columns);

    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        drawTile(tileRenderingOrder([x + world_offset.x, y - world_offset.y]), [
          camera_offset.x,
          camera_offset.y
        ]); // odd row
      }
      for (let x = x0; x < x1; x++) {
        drawTile(
          tileRenderingOrder([
            x + 0.5 + world_offset.x,
            y + 0.5 - world_offset.y
          ]),
          [camera_offset.x, camera_offset.y]
        ); // even rows are offset horizontally
      }
    }

    describeMouseTile(world_pos, [camera_offset.x, camera_offset.y]);

    if (p3_drawAfter) {
      p3_drawAfter();
    }
  }

  // Display a discription of the tile at world_x, world_y.
  function describeMouseTile([world_x, world_y], [camera_x, camera_y]) {
    let [screen_x, screen_y] = worldToScreen(
      [world_x, world_y],
      [camera_x, camera_y]
    );
    drawTileDescription([world_x, world_y], [0 - screen_x, screen_y]);
  }

  function drawTileDescription([world_x, world_y], [screen_x, screen_y]) {
    sketch.push();
    sketch.translate(screen_x, screen_y);
    if (p3_drawSelectedTile) {
      p3_drawSelectedTile(world_x, world_y, screen_x, screen_y);
    }
    sketch.pop();
  }

  // Draw a tile, mostly by calling the user's drawing code.
  function drawTile([world_x, world_y], [camera_x, camera_y]) {
    let [screen_x, screen_y] = worldToScreen(
      [world_x, world_y],
      [camera_x, camera_y]
    );
    sketch.push();
    sketch.translate(0 - screen_x, screen_y);
    if (p3_drawTile) {
      p3_drawTile(world_x, world_y, -screen_x, screen_y);
    }
    sketch.pop();
  }
  /* global XXH */
  /* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/

  // Change seed when key is entered
function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0).toNumber();
  sketch.randomSeed(worldSeed);
  sketch.noiseSeed(worldSeed);
}

// Return width of each tile in pixels
function p3_tileWidth() {
  return 32;
}

// Return height of each tile in pixels
function p3_tileHeight() {
  return 16;
}

// Track which stars have been clicked on
let clicks = {};

function p3_tileClicked(i, j) {
  let key = i + "," + j;
  if (clicks[key]) {
    // Deselect the tile if it's already selected
    delete clicks[key]; 
  } else {
    // Select the tile
    clicks[key] = true; 
  }
}

// Draw a background gradient before the tiles
function p3_drawBefore() {
  // Dark blue for the top
  let topColor = sketch.color(10, 10, 40);    
  // Lighter purple   
  let middleColor1 = sketch.color(80, 20, 120); 
  // Bright purple 
  let middleColor2 = sketch.color(100, 40, 130); 
  // Dark blue/purple for the bottom
  let bottomColor = sketch.color(25, 20, 55);    

  //vertical gradient
  for (let y = 0; y < sketch.height; y++) {
    let inter = sketch.map(y, 0, sketch.height, 0, 1);
    let c = y < sketch.height * 0.5
            ? sketch.lerpColor(topColor, middleColor1, inter * 2)
            : sketch.lerpColor(middleColor1, middleColor2, (inter - 0.5) * 2);

    sketch.stroke(c);
    sketch.line(0, y, sketch.width, y);
  }
}

// Draw black holes or stars depending on whether they have been clicked on
function p3_drawTile(i, j) {
  sketch.noStroke();
  let hash = XXH.h32("star:" + [i, j], worldSeed).toNumber();
  if (hash % 4 === 0) {
    let brightness = 100 + (hash % 155);
    let size = 2 + (hash % 3);
    //draw white stars
    sketch.fill(255, 255, 255, brightness);
    sketch.ellipse(0, 0, size, size);
    if (clicks[i + "," + j]) {
      //black color for black hole
      sketch.fill(0);
      //black hole is large
      sketch.ellipse(0, 0, size * 10, size * 10); 
    }
  }
}

// Highlight the tile under the cursor
function p3_drawSelectedTile(i, j) {
  sketch.noFill();
  sketch.stroke(255, 255, 255, 255);
  sketch.beginShape();
  sketch.vertex(-p3_tileWidth() / 2, 0);
  sketch.vertex(0, p3_tileHeight() / 2);
  sketch.vertex(p3_tileWidth() / 2, 0);
  sketch.vertex(0, -p3_tileHeight() / 2);
  sketch.endShape(sketch.CLOSE);

  sketch.noStroke();
  sketch.fill(255, 255, 255);
  // Display coordinates
  sketch.text("tile " + [i, j], 0, 0); 
}

function p3_drawAfter(sketch) {
 
  } 


}

const s2 = (sketch) => {
  /* global p5 */
  /* exported preload, setup, draw, mouseClicked */

  // Project base code provided by {amsmith,ikarth}@ucsc.edu


  let tile_width_step_main; // A width step is half a tile's width
  let tile_height_step_main; // A height step is half a tile's height

  // Global variables. These will mostly be overwritten in setup().
  let tile_rows, tile_columns;
  let camera_offset;
  let camera_velocity;

  /////////////////////////////
  // Transforms between coordinate systems
  // These are actually slightly weirder than in full 3d...
  /////////////////////////////
  function worldToScreen([world_x, world_y], [camera_x, camera_y]) {
    let i = (world_x - world_y) * tile_width_step_main;
    let j = (world_x + world_y) * tile_height_step_main;
    return [i + camera_x, j + camera_y];
  }

  function worldToCamera([world_x, world_y], [camera_x, camera_y]) {
    let i = (world_x - world_y) * tile_width_step_main;
    let j = (world_x + world_y) * tile_height_step_main;
    return [i, j];
  }

  function tileRenderingOrder(offset) {
    return [offset[1] - offset[0], offset[0] + offset[1]];
  }

  function screenToWorld([screen_x, screen_y], [camera_x, camera_y]) {
    screen_x -= camera_x;
    screen_y -= camera_y;
    screen_x /= tile_width_step_main * 2;
    screen_y /= tile_height_step_main * 2;
    screen_y += 0.5;
    return [Math.floor(screen_y + screen_x), Math.floor(screen_y - screen_x)];
  }

  function cameraToWorldOffset([camera_x, camera_y]) {
    let world_x = camera_x / (tile_width_step_main * 2);
    let world_y = camera_y / (tile_height_step_main * 2);
    return { x: Math.round(world_x), y: Math.round(world_y) };
  }

  function worldOffsetToCamera([world_x, world_y]) {
    let camera_x = world_x * (tile_width_step_main * 2);
    let camera_y = world_y * (tile_height_step_main * 2);
    return new p5.Vector(camera_x, camera_y);
  }

  //sketch.preload = function() {
   // if (p3_preload) {
      //p3_preload();
   // }
  // }

  sketch.setup = function() {
    canvas2 = sketch.createCanvas(900, 500);
    //canvas1.parent("container");

    let label = sketch.createP();
    label.html("World key: ");
    label.parent("canvas-container2");

    let input = sketch.createInput("xyzzy");
    input.parent(label);
    input.input(() => {
      rebuildWorld(input.value());
    });

    sketch.createP("Arrow or wasd keys scroll").parent("canvas-container2");

    camera_offset = new p5.Vector(-sketch.width / 2, sketch.height / 2);
    camera_velocity = new p5.Vector(0, 0);

    //if (p3_setup) {
     // p3_setup();
   // }
    for (let element of document.getElementsByClassName("p5Canvas")) {
      element.addEventListener("contextmenu", (e) => e.preventDefault());
    }

    window.addEventListener("keydown", function(e) {
      if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
              e.preventDefault();
      }}, false);
    
    //let label = sketch.createP();
    //label.html("World key: ");
    //label.parent("canvas-container1");

    //let input = sketch.createInput("xyzzy");
    //input.parent(label);
    //input.input(() => {
    //  rebuildWorld(input.value());
    //});

    //sketch.createP("Arrow keys scroll. Clicking changes tiles.").parent("canvas-container1");

    //rebuildWorld(input.value());
    
    rebuildWorld(Gkey);
  }

  function rebuildWorld(key) {
    if (p3_worldKeyChanged) {
      p3_worldKeyChanged(key);
    }
    tile_width_step_main = p3_tileWidth ? p3_tileWidth() : 32;
    tile_height_step_main = p3_tileHeight ? p3_tileHeight() : 14.5;
    tile_columns = Math.ceil(sketch.width / (tile_width_step_main * 2));
    tile_rows = Math.ceil((sketch.height + 150) / (tile_height_step_main * 2));
  }

  sketch.mouseClicked = function() {
    let world_pos = screenToWorld(
      [0 - sketch.mouseX, sketch.mouseY],
      [camera_offset.x, camera_offset.y]
    );

    if (p3_tileClicked) {
      p3_tileClicked(world_pos[0], world_pos[1]);
    }
    return false;
  }

  sketch.draw = function() {
    // Keyboard controls!
    if (sketch.keyIsDown(sketch.LEFT_ARROW) || sketch.keyIsDown(65)) {
      camera_velocity.x -= 1;
    }
    if (sketch.keyIsDown(sketch.RIGHT_ARROW) || sketch.keyIsDown(68)) {
      camera_velocity.x += 1;
    }
    if (sketch.keyIsDown(sketch.DOWN_ARROW) || sketch.keyIsDown(83)) {
      camera_velocity.y -= 1;
    }
    if (sketch.keyIsDown(sketch.UP_ARROW) || sketch.keyIsDown(87)) {
      camera_velocity.y += 1;
    }

    let camera_delta = new p5.Vector(0, 0);
    camera_velocity.add(camera_delta);
    camera_offset.add(camera_velocity);
    camera_velocity.mult(0.95); // cheap easing
    if (camera_velocity.mag() < 0.01) {
      camera_velocity.setMag(0);
    }

    let world_pos = screenToWorld(
      [0 - sketch.mouseX, sketch.mouseY],
      [camera_offset.x, camera_offset.y]
    );
    let world_offset = cameraToWorldOffset([camera_offset.x, camera_offset.y]);

    sketch.background(100);

    //if (p3_drawBefore) {
    //  p3_drawBefore();
    //}

    let overdraw = 0.1;

    let y0 = Math.floor((0 - overdraw) * tile_rows);
    let y1 = Math.floor((1 + overdraw) * tile_rows);
    let x0 = Math.floor((0 - overdraw) * tile_columns);
    let x1 = Math.floor((1 + overdraw) * tile_columns);

    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        drawTile(tileRenderingOrder([x + world_offset.x, y - world_offset.y]), [
          camera_offset.x,
          camera_offset.y
        ]); // odd row
      }
      for (let x = x0; x < x1; x++) {
        drawTile(
          tileRenderingOrder([
            x + 0.5 + world_offset.x,
            y + 0.5 - world_offset.y
          ]),
          [camera_offset.x, camera_offset.y]
        ); // even rows are offset horizontally
      }
    }

    describeMouseTile(world_pos, [camera_offset.x, camera_offset.y]);

    if (p3_drawAfter) {
      p3_drawAfter();
    }
  }

  // Display a discription of the tile at world_x, world_y.
  function describeMouseTile([world_x, world_y], [camera_x, camera_y]) {
    let [screen_x, screen_y] = worldToScreen(
      [world_x, world_y],
      [camera_x, camera_y]
    );
    drawTileDescription([world_x, world_y], [0 - screen_x, screen_y]);
  }

  function drawTileDescription([world_x, world_y], [screen_x, screen_y]) {
    sketch.push();
    sketch.translate(screen_x, screen_y);
    if (p3_drawSelectedTile) {
      p3_drawSelectedTile(world_x, world_y, screen_x, screen_y);
    }
    sketch.pop();
  }

  function drawTile([world_x, world_y], [camera_x, camera_y]) {
    let [screen_x, screen_y] = worldToScreen(
      [world_x, world_y],
      [camera_x, camera_y]
    );
    sketch.push();
    sketch.translate(0 - screen_x, screen_y);
    if (p3_drawTile) {
      p3_drawTile(world_x, world_y, -screen_x, screen_y, sketch);
    }
    sketch.pop();
  }

  /* global XXH, sketch */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/




// Update world seed when key is changed
function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0).toNumber();
  sketch.randomSeed(worldSeed);
  sketch.noiseSeed(worldSeed);
}

// Return width of each tile in pixels
function p3_tileWidth() {
  return 32;
}

// Return height of each tile in pixels
function p3_tileHeight() {
  return 16;
}
// Track selected tiles
let selectedTiles = {};

// Handles the click function, toggling their state
function p3_tileClicked(i, j) {
  let key = `${i},${j}`;
  if (selectedTiles[key]) {
    delete selectedTiles[key]; // Deselect the tile if it's already selected
  } else {
    selectedTiles[key] = true; // Select the tile
  }
}
let [tw, th] = [p3_tileWidth(), p3_tileHeight()];
// Draw each tile
function p3_drawTile(i, j) {
  sketch.noStroke();
  let tileKey = i + "," + j;
  let noiseVal = sketch.noise(i / 128.0, j / 128.0, worldSeed);

  // Check if this tile is selected
  if (selectedTiles[tileKey]) {
    sketch.fill(0, 0, 255); // Solid blue if selected
  } else {
    if (noiseVal < 0.3) {
      sketch.fill(0, 128, 0); // Water/dark blue
    } else if (noiseVal < 0.6) {
      sketch.fill(128, 64, 0); // Dirt/brown
    } else {
      sketch.fill(0, 200, 0); // Grass/green
    }
  }

  // Draw the tile shape
  sketch.push();
  sketch.beginShape();
  sketch.vertex(-tw, 0);
  sketch.vertex(0, th);
  sketch.vertex(tw, 0);
  sketch.vertex(0, -th);
  sketch.endShape(sketch.CLOSE);
  sketch.pop();
}

// Displays the outline coordinates
function p3_drawSelectedTile(i, j) {
  sketch.noFill();
  sketch.stroke(255, 255, 255, 255);
  sketch.beginShape();
  sketch.vertex(-tw, 0);
  sketch.vertex(0, th);
  sketch.vertex(tw, 0);
  sketch.vertex(0, -th);
  sketch.endShape(sketch.CLOSE);
  sketch.noStroke();
  sketch.fill(0);
  //display tile coordinate
  sketch.text("tile " + [i, j], 0, 0);
}


function p3_drawAfter(sketch) {

  }
}

let p51 = new p5(s1, "canvas-container1");

let p52 = new p5(s2, "canvas-container2");

