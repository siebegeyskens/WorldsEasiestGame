var serial; // variable to hold an instance of the serialport library
var portName = 'COM10';
let light = 50;
let x = 200;
let y = 0;
let xpos;
let ypos;
let yCount = 0;
let serialInArray = [];
let serialCount = 0;
let firstContact = false;

let xEnemy = 0;
let speedEnemy = 5;
alert("to play this game you need the worlds Easiest controller");




function setup() {
  createCanvas(windowWidth, windowHeight);
  serial = new p5.SerialPort(); // make a new instance of the serialport library
  serial.on('list', printList); // set a callback function for the serialport list event
  serial.on('connected', serverConnected); // callback for connecting to the server
  serial.on('open', portOpen); // callback for the port opening
  serial.on('data', serialEvent); // callback for when new data arrives
  serial.on('error', serialError); // callback for errors
  serial.on('close', portClose); // callback for the port closing

  serial.list(); // list the serial ports
  serial.open(portName); // open a serial port
}

function serverConnected() {
  console.log('connected to server.');
}

function portOpen() {
  console.log('the serial port opened.')
}

function serialEvent() {
  let inByte = serial.read();//de byte die het eerst is binnegekomen 
  if (firstContact == false) {
    if (inByte == 65) {// als byte = A
      serial.clear(); // maakt de serial buffer leeg
      firstContact = true;
      serial.write('A');// zorgt ervoor dat loop in .ino start
    }
  } else {
    // elke laatste byte in de array steken
    serialInArray[serialCount] = inByte;
    serialCount++;
    // als de drie sensorwaarden (drie bytes),dus > 2, alledrie in array steken
    // die waarden gelijkstellen aan de variabelen
    if (serialCount > 2) {
      light = serialInArray[0];
      x = serialInArray[1];
      y = serialInArray[2];
      if (y==1){
        yCount += 1;
      }
      serial.write('A');
      serialCount = 0;
    }
  }
}

function serialError(err) {
  console.log('Something went wrong with the serial port. ' + err);
}

function portClose() {
  console.log('The serial port closed.');
}

function draw() {
  background(light);
  fill("white");
  rect(0, 0, width, height/6);
  rect(0, height-(height/6), width, height/3);
  let yJump = height/9;
  let yStart = height - yJump;
  let ypos = yStart -yCount*yJump;
  let xpos = map(x, 0, 255, width , 0);
  fill('white');
  circle(xpos, ypos, 50);
  if (ypos <= yJump){
    yCount = 0;
  }  
  moveEnemy()
  drawEnemy(xEnemy,height/2);
  checkCollision(xpos,ypos,xEnemy);
}

function drawEnemy(x, y) {
    fill('red');
rect(x, y, 60, 60);
   }

function moveEnemy() {
    if (xEnemy > width - 60) {
        speedEnemy *= -1;
    } else if (xEnemy < 0) {
        speedEnemy *= -1;
    }
    xEnemy += speedEnemy;
}

function checkCollision(xpos,ypos,xEnem) {
    if ((xpos +25> xEnemy && xpos -25 < xEnemy + 60 ) && (ypos+25>height/2&& ypos-25< height/2 +60)) {
        yCount=0;
      console.log("collision");
    }
}



// get the list of ports:
function printList(portList) {
  // portList is an array of serial port names
  for (var i = 0; i < portList.length; i++) {
    // Display the list the console:
    console.log(i + " " + portList[i]);
  }
}