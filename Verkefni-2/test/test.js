const canvas = document.getElementById("test");
const ctx = canvas.getContext("2d");
const margin = 15;

let pacMan = {
  x: 100,
  y: 100,
  radius: 25,
  color: "black",
  lineWidth: 1.5,
  fillColor: "gold",
  rotation: 45,
  mouth: 1.5,
  draw() {
    ctx.save(); //seiva stateið af canvas þannig ég geti roteitað án þess að eyðileggja allt
    ctx.translate(this.x, this.y) //set canvas starting point sem staðurinn þar sem gæinn er
    ctx.rotate((Math.PI / 180) * this.rotation); //rotatea svo canvasið
    ctx.translate(-this.x, - this.y); //restora canvas loco

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * this.mouth, false);
    ctx.lineTo(this.x, this.y); //Bý til línu í miðjuna 
    ctx.closePath(); //semeina so nýju línun við byrjunina
    ctx.fillStyle = this.fillColor;
    ctx.fill();
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = this.color;
    ctx.stroke();

    ctx.restore(); //restora canvasið
  },
};

//Hérna set ég öll objects sem ég vill teikna
function drawScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pacMan.draw();
}

//breytur fyrir munnin
const rotationValues = [45, 35, 25, 17, 8, 0, 8, 17, 25, 35];
const mouthValues = [1.5, 1.6, 1.7, 1.8, 1.9, 2, 1.9, 1.8, 1.7, 1.6];
const animationDelay = 32; //hversu oft á millisekúndu fresti að updeita animation

let currentRotationIndex = 0;
let currentMouthIndex = 0;
let timeSinceAnimation = 0;
let lastDirection = "right"; 

function updateAnimation(millisecondsPassed) {
  //bæti við tímanum sem hefur liðið við tímanum sem hefur liðið breytuna
  timeSinceAnimation += millisecondsPassed; //bæði í millisekúndum

  if (timeSinceAnimation >= animationDelay) {
      // Update rotation and mouth values, modulus er þannig það fari í gegn
      currentRotationIndex = (currentRotationIndex + 1) % rotationValues.length;
      currentMouthIndex = (currentMouthIndex + 1) % mouthValues.length;

      //Breyti rotation eftir því sem hvaða átt pacman er að fara í.
      if (lastDirection === "right") {
        pacMan.rotation = rotationValues[currentRotationIndex];
      } else if (lastDirection === "down") {
        pacMan.rotation = rotationValues[currentRotationIndex] + 90;
      } else if (lastDirection === "left") {
        pacMan.rotation = rotationValues[currentRotationIndex] + 180;
      } else if (lastDirection === "up") {
        pacMan.rotation = rotationValues[currentRotationIndex] + 270;
      }

      pacMan.mouth = mouthValues[currentMouthIndex];

      timeSinceAnimation = 0;
  }
}



const pacSpeed = 0.5; //pixels per millisecond
let direction = {
  left: false,
  right: false,
  down: false,
  up: false,
  lastDirection: []
};
function updateGameLogic(millisecondsPassed) {
  if (direction === "left") {
      pacMan.x -= pacSpeed * millisecondsPassed;
  } else if (direction === "right") {
    pacMan.x += pacSpeed * millisecondsPassed;
  } else if (direction === "up") {
    pacMan.y -= pacSpeed * millisecondsPassed;
  } else if (direction === "down") {
    pacMan.y += pacSpeed * millisecondsPassed;
  }

  if (direction !== null) {
    lastDirection = direction;
  }
  
  //Reiknar hvort að pacman sé kominn fyrir utan
  pacMan.x = Math.max(pacMan.radius, Math.min(canvas.width - pacMan.radius, pacMan.x));
  pacMan.y = Math.max(pacMan.radius, Math.min(canvas.height - pacMan.radius, pacMan.y));
}

let oldTimeStamp = 0;

function logicLoop(timeStamp) {
    //tíminn sem hefur liðið er tíminn sem er núna mínus tíminn sem var síðast þegar það var keyrt
    let millisecondsPassed = (timeStamp - oldTimeStamp);
    oldTimeStamp = timeStamp;

    //Kallar á game lykkjuna sem sér um hreyfingu ofl.
    updateGameLogic(millisecondsPassed);
    //Kallar á animation lykkjuna sem sér um munnin á pac man
    updateAnimation(millisecondsPassed);
    //teikna allt
    drawScene();

    console.log(direction)
    
    //kallar á sig sjálft aftur, þannig að það verði loop
    window.requestAnimationFrame(logicLoop);
}

//Controls
//Hérna startar pacman að hreyfast þegar ég ýti á takkan
document.addEventListener('keydown', (event) => {
  switch (event.code) {
    case "ArrowLeft":
    case "KeyA":
      direction.left = true;
      console.log("Vinstri");
      break;
    case "ArrowRight":
    case "KeyD":
      direction.right = true;
      console.log("Hægri")
      break;
    case "ArrowUp":
    case "KeyW":
      direction.up = true;
      console.log("Upp")
      break;
    case "ArrowDown":
    case "KeyS":
      direction.down = true;
      console.log("Niður")
      break;
    default:
      return;
  }
});

//Hérna hættir pacman að hreyfast þegar ég sleppi takkanum
document.addEventListener('keyup', (event) => {
  switch (event.code) {
    case "ArrowLeft":
    case "KeyA":
      direction.left = false;
      direction.lastDirection.push["left"]
      console.log("Vinstri keyup");
      break;
    case "ArrowRight":
    case "KeyD":
      direction.right = false;
      direction.lastDirection.push["right"]
      console.log("Hægri keyup");
      break;
    case "ArrowUp":
    case "KeyW":
      direction.up = false;
      direction.lastDirection.push["up"]
      console.log("Upp keyup");
      break;
    case "ArrowDown":
    case "KeyS":
      direction.down = false;
      direction.lastDirection.push["down"]
      console.log("Niður keyup");
      break;
  }
});

function resizeCanvas() {
    canvas.width = window.innerWidth - margin * 2;
    canvas.height = window.innerHeight - margin * 2;
    drawScene(); //teiknar senuna aftur þannig það sé ekki fucked
}

//initializers
window.addEventListener("resize", resizeCanvas); //ef að resiza kallar á resize fallið
resizeCanvas() //stilli upp canvas size 
drawScene()
window.requestAnimationFrame(logicLoop); //starta loopið

