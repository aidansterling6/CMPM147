/* exported getInspirations, initDesign, renderDesign, mutateDesign */
function mut(num, min, max, rate) {
    return constrain(randomGaussian(num, (rate * (max - min)) / 10), min, max);
}

function getInspirations() {
  return [
    {
      name: "Lunch atop a Skyscraper", 
      assetUrl: "https://cdn.glitch.global/3abd0223-86fb-43ce-a00a-fde12615bcd5/lunch-on-a-skyscraper.jpg?v=1714798266994",
      credit: "Lunch atop a Skyscraper, Charles Clyde Ebbets, 1932",
      scale: 1
    },
    {
      name: "Train Wreck", 
      assetUrl: "https://cdn.glitch.global/3abd0223-86fb-43ce-a00a-fde12615bcd5/train-wreck.jpg?v=1714798264965",
      credit: "Train Wreck At Monteparnasse, Levy & fils, 1895",
      scale: 1
    },
    {
      name: "Migrant mother", 
      assetUrl: "https://cdn.glitch.global/3abd0223-86fb-43ce-a00a-fde12615bcd5/migrant-mother.jpg?v=1714778906791",
      credit: "Migrant Mother near Nipomo, California, Dorothea Lange, 1936",
      scale: 1
    },
    {
      name: "Disaster Girl", 
      assetUrl: "https://cdn.glitch.global/3abd0223-86fb-43ce-a00a-fde12615bcd5/girl-with-fire.jpg?v=1714778905663",
      credit: "Four-year-old Zoë Roth, 2005",
      scale: 1
    },
    {
      name: "Sun", 
      assetUrl: "https://live.staticflickr.com/7385/9103296900_0d383feabf_b.jpg",
      credit: "https://www.flickr.com/photos/gsfc/9103296900",
      scale: 1.75
    },
    {
      name: "Mountain", 
      assetUrl: "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA5L3BkbWlzY3Byb2plY3QyMC1sYWNtYTIyODQ1Mi1pbWFnZS5qcGc.jpg",
      credit: "https://www.rawpixel.com/search/landscape%20public%20domain?page=1&path=_topics&sort=curated",
      scale: 2
    },
    {
      name: "Hills", 
      assetUrl: "https://t4.ftcdn.net/jpg/03/16/45/77/360_F_316457746_jcEMNJy3LRoH8XwmQ4bozIOlCdji9uSi.jpg",
      credit: "https://stock.adobe.com/search?k=landscape",
      scale: 3
    },
    {
      name: "Gecko", 
      assetUrl: "https://lazoo.org/wp-content/uploads/2020/02/Gecko-Giant-Day-2.jpg",
      credit: "https://lazoo.org/explore-your-zoo/our-animals/reptiles/madagascar-giant-day-gecko/",
      scale: 2
    }
  ];//https://lazoo.org/wp-content/uploads/2020/02/Gecko-Giant-Day-2.jpg
  
  
  //https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrag-75J_p3nh-tk9qSdgr0YO_8kyqxYgkHg&s
  
  
  //https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA5L3BkbWlzY3Byb2plY3QyMC1sYWNtYTIyODQ1Mi1pbWFnZS5qcGc.jpg
}//https://picryl.com/media/the-sun-by-the-atmospheric-imaging-assembly-of-nasas-solar-dynamics-observatory-e5d07f

function initDesign(inspiration) {
  resizeCanvas((inspiration.image.width / 3) * inspiration.scale, (inspiration.image.height / 3) * inspiration.scale);
  let tmpArr = [];
  for(let i = 0; i < 1000; i++){
    tmpArr.push({x:random(0,width), y:random(0,height), width:random(20, 50), height:random(20, 50), r:0, g:0, b:0, a: 0});
  }
  return tmpArr;
}

function renderDesign(design, inspiration) {
  background(255, 255, 255, 255);
  noStroke();
  rectMode(CENTER, CENTER);
  for(let i = 0; i < design.length; i++){
    fill(design[i].r, design[i].g, design[i].b, design[i].a);
    rect(design[i].x, design[i].y, design[i].width, design[i].height);
  }
}

function mutateDesign(design, inspiration, rate, rate2, rate3) {
  for(let o = 0; o < 1000 * rate3; o++){
    let i = floor(Math.random() * design.length);
    design[i].x = mut(design[i].x, 0, width, rate * 0.1);
    design[i].y = mut(design[i].y, 0, height, rate * 0.1);
    
    design[i].width = mut(design[i].width, 20, 80, rate);
    design[i].height = mut(design[i].height, 20, 80, rate);
    
    design[i].r = mut(design[i].r, 0, 255, rate2);
    design[i].g = mut(design[i].g, 0, 255, rate2);
    design[i].b = mut(design[i].b, 0, 255, rate2);
    
    design[i].a = mut(design[i].a, 0, 255, rate);
  }
}
