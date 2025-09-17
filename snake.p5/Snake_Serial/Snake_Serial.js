// p5.webserial library for serial communication
let port;
let serial_port_index = 0;

let gridSize = 30;
let w = 35;
let h = 20;

let snakeColor;
let appleColor;
let backgroundColor;

let minSpeedInterval = 25; // LOWER = FASTER
let maxSpeedInterval = 200; // HIGHER = SLOWER
let initialSpeedInterval = 90;

let snake;
let apple;

function setup() {
  console.log("p5.webserial library loaded");

  port = createSerial();

  snakeColor = color(0, 0, 0); // R, G, B; 0-255
  appleColor = color(220, 0, 0); // R, G, B; 0-255
  backgroundColor = color(200, 200, 200); // R, G, B; 0-255

  createCanvas(gridSize*w, gridSize*h);
  snake = new Snake(10, Math.round(w/2), Math.round(h/2), initialSpeedInterval);
  newApple();

  // Try to auto-connect to previously used ports
  let usedPorts = usedSerialPorts();
  if (usedPorts.length > 0) {
    port.open(usedPorts[0], 9600);
  }

  // Add connect button
  createConnectButton();
}

function draw() {
  readSerial();

  fill(backgroundColor);
  noStroke();
  rect(0, 0, width, height);

  push();

  // Scale for fullscreen mode
  if (fullscreen()) {
    let scaleX = width / (gridSize * w);
    let scaleY = height / (gridSize * h);
    let gameScale = Math.min(scaleX, scaleY);

    scale(gameScale);
    translate((width/gameScale - gridSize*w)/2, (height/gameScale - gridSize*h)/2);
  }

  fill(appleColor);
  noStroke();
  ellipse(apple.x*gridSize + gridSize/2, apple.y*gridSize + gridSize/2, gridSize/1.2, gridSize/1.2);

  snake.update(apple);

  pop();
}

function resetGame() {
  if (snake.dead) {
    snake = new Snake(10, Math.round(w/2), Math.round(h/2), initialSpeedInterval);
    newApple();
  }
}

function newApple() {
  let checkSnake = false;
  while (!checkSnake) {
    apple = createVector(Math.floor(random(w)), Math.floor(random(h)));
    let counter = 0;
    for (let i = 0; i < snake.size; i++) {
      if (snake.body[i].x == apple.x && snake.body[i].y == apple.y) {
      } else {
        counter++;
      }
    }
    if (counter == snake.size) {
      checkSnake = true;
    }
  }
}

class Snake {
  constructor(_size, x, y, _speedInterval) {
    this.size = _size;
    this.speedInterval = _speedInterval;
    this.body = new Array(this.size);
    this.dir = new Array(this.size);
    this.timestamp = 0;

    this.moving = false;
    this.dead = false;
    this.command = false;

    let posX = x;
    let posY = y;

    for (let i = 0; i < this.size; i++) {
      this.body[i] = createVector(posX - i, posY);
      this.dir[i] = 1;
    }
  }

  update(a) {
    if (this.moving && !this.dead) {
      if (millis() - this.timestamp > this.speedInterval) {
        this.timestamp = millis();

        let ate = false;
        if (this.body[0].x == a.x && this.body[0].y == a.y) {
          ate = true;
        }

        if (ate) {
          this.size++;
          this.body.push(createVector(this.body[this.size-2].x, this.body[this.size-2].y));
          this.dir.push(0);
          newApple();
          writeSerial('E');
        }

        for (let i = 0; i < this.size; i++) {
          switch(this.dir[i]) {
          case 1:
            this.body[i] = createVector(this.body[i].x+1, this.body[i].y);
            break;
          case 2:
            this.body[i] = createVector(this.body[i].x, this.body[i].y+1);
            break;
          case 3:
            this.body[i] = createVector(this.body[i].x-1, this.body[i].y);
            break;
          case 4:
            this.body[i] = createVector(this.body[i].x, this.body[i].y-1);
            break;
          }
        }

        for (let i = this.size-1; i > 0; i--) {
          this.dir[i] = this.dir[i-1];
        }

        this.command = false;
      }
    }

    if (this.body[0].x < 0 || this.body[0].x >= w || this.body[0].y < 0 || this.body[0].y >= h) {
      this.moving = false;
      this.dead = true;
      writeSerial('D');
    }

    for (let i = this.size-1; i > 0; i--) {
      if (this.body[i].x == this.body[0].x && this.body[i].y == this.body[0].y) {
        this.moving = false;
        this.dead = true;
        writeSerial('D');
        break;
      }
    }

    for (let i = 0; i < this.size; i++) {
      fill(snakeColor);
      if (this.dead && Math.floor(millis()/250) % 2 == 0) {
        fill(backgroundColor);
      }
      noStroke();
      rect(this.body[i].x*gridSize, this.body[i].y*gridSize, gridSize, gridSize);
    }
  }
}

function moveRight() {
  snake.moving = true;
  if (snake.dir[0] % 2 == 0 && !snake.command && !snake.dead) {
    snake.dir[0] = 1;
    snake.command = true;
  }
}

function moveDown() {
  snake.moving = true;
  if (snake.dir[0] % 2 == 1 && !snake.command && !snake.dead) {
    snake.dir[0] = 2;
    snake.command = true;
  }
}

function moveLeft() {
  snake.moving = true;
  if (snake.dir[0] % 2 == 0 && !snake.command && !snake.dead) {
    snake.dir[0] = 3;
    snake.command = true;
  }
}

function moveUp() {
  snake.moving = true;
  if (snake.dir[0] % 2 == 1 && !snake.command && !snake.dead) {
    snake.dir[0] = 4;
    snake.command = true;
  }
}

function speedUp() {
  snake.speedInterval = snake.speedInterval * 0.9;
  snake.speedInterval = snake.speedInterval < minSpeedInterval ? minSpeedInterval : snake.speedInterval;
}

function speedDown() {
  snake.speedInterval = snake.speedInterval * 1.1;
  snake.speedInterval = snake.speedInterval > maxSpeedInterval ? maxSpeedInterval : snake.speedInterval;
}

function keyPressed() {
  if (key == 'w' || key == 'W') {
    moveUp();
  }
  if (key == 'a' || key == 'A') {
    moveLeft();
  }
  if (key == 's' || key == 'S') {
    moveDown();
  }
  if (key == 'd' || key == 'D') {
    moveRight();
  }
  if (key == 'r' || key == 'R') {
    resetGame();
  }
  if (key == 'p' || key == 'P') {
    speedUp();
  }
  if (key == 'o' || key == 'O') {
    speedDown();
  }

  // Fullscreen mode
  if (key == 'f' || key == 'F' || key == ' ') {
    toggleFullscreen();
  }

  // Simulate serial commands with number keys
  if (key == '1') {
    moveUp();
  }
  if (key == '2') {
    moveLeft();
  }
  if (key == '3') {
    moveDown();
  }
  if (key == '4') {
    moveRight();
  }
  if (key == '5') {
    resetGame();
  }
  if (key == '6') {
    speedDown();
  }
  if (key == '7') {
    speedUp();
  }
}

/////////////////
//             //
//   SERIAL    //
//             //
/////////////////

function connectSerial() {
  if (!port.opened()) {
    port.open(9600);
    document.getElementById('connectBtn').textContent = 'Disconnect';
    console.log("Attempting to connect to Arduino...");
  }
}

function disconnectSerial() {
  if (port.opened()) {
    port.close();
    document.getElementById('connectBtn').textContent = 'Connect Serial';
    console.log("Serial port disconnected");
  }
}

function writeSerial(data) {
  if (port.opened()) {
    port.write(data);
    console.log("Sent:", data);
  } else {
    console.log("Serial not connected, would send:", data);
  }
}

function readSerial() {
  if (port.opened() && port.available() > 0) {
    let str = port.readUntil('\n');
    if (str.length > 0) {
      str = str.trim();
      console.log("Received:", str);

      if (str.length > 0) {
        let c = str.charAt(0);
        switch(c) {
          case '1':
            moveUp();
            break;
          case '2':
            moveLeft();
            break;
          case '3':
            moveDown();
            break;
          case '4':
            moveRight();
            break;
          case '5':
            resetGame();
            break;
          case '6':
            speedDown();
            break;
          case '7':
            speedUp();
            break;
        }
      }
    }
  }
}

function createConnectButton() {
  let btn = document.createElement('button');
  btn.id = 'connectBtn';
  btn.textContent = 'Connect Serial';
  btn.style.position = 'absolute';
  btn.style.top = '10px';
  btn.style.right = '10px';
  btn.style.padding = '10px 20px';
  btn.style.fontSize = '14px';
  btn.style.backgroundColor = '#4CAF50';
  btn.style.color = 'white';
  btn.style.border = 'none';
  btn.style.borderRadius = '4px';
  btn.style.cursor = 'pointer';
  btn.style.zIndex = '1000';

  btn.onclick = () => {
    if (port.opened()) {
      disconnectSerial();
    } else {
      connectSerial();
    }
  };

  document.body.appendChild(btn);
}

/////////////////
//             //
// FULLSCREEN  //
//             //
/////////////////

function toggleFullscreen() {
  let fs = fullscreen();
  fullscreen(!fs);
}

function windowResized() {
  if (fullscreen()) {
    resizeCanvas(windowWidth, windowHeight);
  } else {
    resizeCanvas(gridSize*w, gridSize*h);
  }
}