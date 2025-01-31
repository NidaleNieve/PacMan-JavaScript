const canvas = document.getElementById("test");
const ctx = canvas.getContext("2d");
const margin = 15;

let pacMan = {
  //X og y skipta í rauninni ekki máli
  x: 200,
  y: 200,
  radius: 25,
  color: "black",
  lineWidth: 1.5,
  fillColor: "gold",
  rotation: 45,
  mouth: 1.5,
  speed: 0.5,
  lives: 3,
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

  updatePosition(millisecondsPassed) {
    if (direction[direction.length - 1] === "left") {
      this.x -= this.speed * millisecondsPassed;
    } else if (direction[direction.length - 1] === "right") {
      this.x += this.speed * millisecondsPassed;
    } else if (direction[direction.length - 1] === "up") {
      this.y -= this.speed * millisecondsPassed;
    } else if (direction[direction.length - 1] === "down") {
      this.y += this.speed * millisecondsPassed;
    }

    if (direction.length !== 0) {
      lastDirection = direction[direction.length - 1];
    }

    //Reiknar hvort að pacman sé kominn fyrir utan
    this.x = Math.max(this.radius, Math.min(canvas.width - this.radius, this.x));
    this.y = Math.max(this.radius, Math.min(canvas.height - this.radius, this.y));  
  },

  checkCollision() {
    ghostArray.forEach(ghostArray => {
      this.distanceFrom = Math.sqrt((this.x - ghostArray.x)**2 + (this.y - ghostArray.y)**2);
      if (this.distanceFrom <= this.radius + ghostArray.radius) {
        this.lives--;
        livesLost();
      }
    })
  }

};

class Ghosts {
  constructor(x, y, radius, fillColor, pupilOffset, pupilRadius, speed, betterMove, directionMargin) {
    this.x = x;
    this.y = y;
    this.fillColor = fillColor;
    this.radius = radius;
    this.color = "black";
    this.lineWidth = 1.5;
    this.speed = speed;
    this.betterMove = betterMove;
    this.directionMargin = directionMargin;

    //augu
    this.pupilOffset = pupilOffset;
    this.pupilRadius = pupilRadius;
  };

  updatePosition(millisecondsPassed) {   
    //Hef tvær mismunandi movement aðferðir, meira variety 
    if (this.betterMove) {
      //Finn angle með atan2 function, finnur radians 
      this.moveAngle = Math.atan2(pacMan.y - this.y, pacMan.x - this.x);

      //Færir drauginn í áttina sem moveAngle segir til um
      this.x += Math.cos(this.moveAngle) * this.speed * millisecondsPassed;
      this.y += Math.sin(this.moveAngle) * this.speed * millisecondsPassed;
    } else {
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
  pacMan.draw();
  ghostArray.forEach(ghost => ghost.draw()); //Teikna alla draugana
  console.log(direction) //prenta út direction arrayið, alveg safe að deleta
  
  ctx.fillStyle = "white"; // Set text color
  ctx.font = "20px Arial"; // Set font size and type
  ctx.fillText("Collisions: " + pacMan.lives, 10, 30); // Draw text at top-left
}

function livesLost() {
  gameStarted = false;
  resizeCanvas();
  
  if (pacMan.lives == 0) {
    location.reload(); //Restarta bara allri síðunni
  }
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

let direction = [];
function updateGameLogic(millisecondsPassed) {
  //Hreyfi pacman
  pacMan.updatePosition(millisecondsPassed);
  //updeita alla drauga position, með arrow function, pretty cool
  ghostArray.forEach(ghost => ghost.updatePosition(millisecondsPassed));
  //Kallar á checkCollision fallið sem sér um að athuga hvort að pacman sé búinn að collide-a við draug
  pacMan.checkCollision();

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
  //Breytur sem innihalda gömlu stærðina á canvasinu
  const widthOld = canvas.width;
  const heightOld = canvas.height;
  canvas.width = window.innerWidth - margin * 2;
  canvas.height = window.innerHeight - margin * 2;
  //Breyti staðsetningu pacman með því að deila staðsetningu pacans með gömly stærðina og margfalda með nýju stærðina
  pacMan.x = pacMan.x / widthOld * canvas.width;
  pacMan.y = pacMan.y / heightOld * canvas.height;

  //Starta leikinn með PacMan í miðjunni
  if (!gameStarted) {
    pacMan.x = canvas.width / 2;
    pacMan.y = canvas.height / 2;
    gameStarted = true;
}
  drawScene(); // Redraw the scene
}


//initializers
ghostArray = [
  pinky = new Ghosts(500, 200, 25, "pink", 5, 7, 0.2, false, 20),
  blinky = new Ghosts(200, 200, 25, "Tomato", 5, 7, 0.2, true)
]
let gameStarted = false;
resizeCanvas()
window.requestAnimationFrame(logicLoop); //starta loopið
window.addEventListener("resize", resizeCanvas); //ef að resiza kallar á resize fallið