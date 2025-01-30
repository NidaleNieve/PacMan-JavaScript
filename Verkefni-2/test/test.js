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

class Ghosts {
  constructor(x, y, radius, fillColor, pupilOffset, pupilRadius, speed, directionMargin) {
    this.x = x;
    this.y = y;
    this.fillColor = fillColor;
    this.radius = radius;
    this.color = "black";
    this.lineWidth = 1.5;
    this.speed = speed;
    this.directionMargin = directionMargin;

    //augu
    this.pupilOffset = pupilOffset;
    this.pupilRadius = pupilRadius;
  };

  /* Þessi kóði hreyfir drauginn beint að pacman, í hvaða direction sem er,
  Mjög smooth og genious.
  updatePosition(millisecondsPassed) {
    // Calculate the angle between the ghost and Pac-Man
    const angle = Math.atan2(pacMan.y - this.y, pacMan.x - this.x);

    // Move the ghost a small step towards Pac-Man
    const speed = this.speed; // Use the ghost's speed
    this.x += Math.cos(angle) * speed * millisecondsPassed;
    this.y += Math.sin(angle) * speed * millisecondsPassed;
  } */

    updatePosition(millisecondsPassed) {    
      //Nota absolute value til þess að geta berað saman léttara
      this.xDistance = Math.abs(pacMan.x - this.x);
      this.yDistance = Math.abs(pacMan.y - this.y);

      //Finn út hvaða átt að fara í í byrjun
      if (!this.movingAxis) {
        this.movingAxis = this.xDistance > this.yDistance ? "horizontal" : "vertical";
      }
      
      //Fer í áttina sem movingAxis segir til um
      if (this.movingAxis === "horizontal") {
        if (this.xDistance > this.directionMargin) {
          //Math.sign skilar 1 ef talan er jákvæð, -1 ef talan er neikvæð
          this.x += Math.sign(pacMan.x - this.x) * this.speed * millisecondsPassed;
        } else {
          //ef að xDistance er minna en directionMargin þá skiptir um átt
          //Basically þá skiptir hann um átt þegar hann er kominn nógu nálægt pacman á x ás
          this.movingAxis = "vertical";
        }
      } else if (this.movingAxis === "vertical") {
        if (this.yDistance > this.directionMargin) {
          this.y += Math.sign(pacMan.y - this.y) * this.speed * millisecondsPassed;
        } else {
          this.movingAxis = "horizontal";
        }
      }
    }

  draw() {
    //Teikna búkin
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.fillColor;
    ctx.fill();
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = this.color;
    ctx.stroke(); 

    //Fær augu position
    this.leftEyeX = this.x - 9;
    this.leftEyeY = this.y - 7;
    this.rightEyeX = this.x + 9;
    this.rightEyeY = this.y - 7;

    //Teikna vinstra auga
    ctx.beginPath();
    ctx.arc(this.leftEyeX, this.leftEyeY, this.radius / 3.5, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = this.color;
    ctx.stroke();

    //Teikna hægra augua
    ctx.beginPath();
    ctx.arc(this.rightEyeX, this.rightEyeY, this.radius / 3.5, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = this.color;
    ctx.stroke();

    // Reikna angleið á milli pacman og draugsins einhvernveginn
    this.angle = Math.atan2(pacMan.y - this.y, pacMan.x - this.x); // Angle in radians

    //Reikna staðsetningu á pupillunum með því að nota angle breytuna og eitthvað idk
    this.leftPupilX = this.leftEyeX + Math.cos(this.angle) * (this.radius / this.pupilOffset);
    this.leftPupilY = this.leftEyeY + Math.sin(this.angle) * (this.radius / this.pupilOffset);

    this.rightPupilX = this.rightEyeX + Math.cos(this.angle) * (this.radius / this.pupilOffset);
    this.rightPupilY = this.rightEyeY + Math.sin(this.angle) * (this.radius / this.pupilOffset);

    // Teikna vinstra pupil aka. sjáaldur 
    ctx.beginPath();
    ctx.arc(this.leftPupilX, this.leftPupilY, this.radius / this.pupilRadius, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();

    // Teikna hægra pupil
    ctx.beginPath();
    ctx.arc(this.rightPupilX, this.rightPupilY, this.radius / this.pupilRadius, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
  }
}

//Hérna set ég öll objects sem ég vill teikna
function drawScene() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //Teikna alla draugana
  ghostArray.forEach(ghost => ghost.draw());
  pacMan.draw();
  console.log(direction) //prenta út direction arrayið, alveg safe að deleta
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
let direction = [];
function updateGameLogic(millisecondsPassed) {
  if (direction[direction.length - 1] === "left") {
      pacMan.x -= pacSpeed * millisecondsPassed;
  } else if (direction[direction.length - 1] === "right") {
    pacMan.x += pacSpeed * millisecondsPassed;
  } else if (direction[direction.length - 1] === "up") {
    pacMan.y -= pacSpeed * millisecondsPassed;
  } else if (direction[direction.length - 1] === "down") {
    pacMan.y += pacSpeed * millisecondsPassed;
  }

  if (direction.length !== 0) {
    lastDirection = direction[direction.length - 1];
  }

  //updeita alla drauga position, með arrow function, pretty cool
  ghostArray.forEach(ghost => ghost.updatePosition(millisecondsPassed));
  
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
    
    //kallar á sig sjálft aftur, þannig að það verði loop
    window.requestAnimationFrame(logicLoop);
}

//Controls
//Hérna startar pacman að hreyfast þegar ég ýti á takkan
document.addEventListener('keydown', (event) => {
  switch (event.code) {
    case "ArrowLeft":
    case "KeyA":
      //ef að left er ekki í arrayinu þá bætir það við
      if (direction.indexOf("left") == -1) {
        direction.push("left");
      }
      break;
    case "ArrowRight":
    case "KeyD":
      if (direction.indexOf("right") == -1) {
        direction.push("right");
      }
      break;
    case "ArrowUp":
    case "KeyW":
      if (direction.indexOf("up") == -1) {
        direction.push("up");
      }
      break;
    case "ArrowDown":
    case "KeyS":
      if (direction.indexOf("down") == -1) {
        direction.push("down");
      }
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
      //tek út left þegar takkanum er sleppt, það þarf ekki if, vegna þess að keyup keyrir bara einu sinni
      direction.splice(direction.indexOf("left"), 1);
      break;
    case "ArrowRight":
    case "KeyD":
      direction.splice(direction.indexOf("right"), 1);
      break;
    case "ArrowUp":
    case "KeyW":
      direction.splice(direction.indexOf("up"), 1);
      break;
    case "ArrowDown":
    case "KeyS":
      direction.splice(direction.indexOf("down"), 1);
      break;
  }
});

function resizeCanvas() {
    canvas.width = window.innerWidth - margin * 2;
    canvas.height = window.innerHeight - margin * 2;
    drawScene(); //teiknar senuna aftur þannig það sé ekki fucked
}

//initializers
const ghostArray = [
  pinky = new Ghosts(200, 200, 25, "pink", 5, 7, 0.2, 20)
]
window.addEventListener("resize", resizeCanvas); //ef að resiza kallar á resize fallið
resizeCanvas() //stilli upp canvas size 
drawScene()
window.requestAnimationFrame(logicLoop); //starta loopið