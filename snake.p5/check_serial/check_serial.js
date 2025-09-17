let port;

function setup() {
  console.log("p5.webserial library loaded");
  console.log("Serial ports checking utility");

  port = createSerial();

  // Display information about WebSerial support
  if ('serial' in navigator) {
    console.log("✓ WebSerial API is supported in this browser");
  } else {
    console.log("✗ WebSerial API is NOT supported in this browser");
    console.log("Try Chrome or Edge browser for WebSerial support");
  }

  // Check for previously used ports
  let usedPorts = usedSerialPorts();
  console.log("Previously used serial ports:", usedPorts.length);
  for (let i = 0; i < usedPorts.length; i++) {
    console.log(`[${i}] ${usedPorts[i]}`);
  }

  // Create a button to test serial port selection
  createTestButton();

  noLoop();
}

function createTestButton() {
  let btn = document.createElement('button');
  btn.textContent = 'Test Serial Port Selection';
  btn.style.position = 'absolute';
  btn.style.top = '50%';
  btn.style.left = '50%';
  btn.style.transform = 'translate(-50%, -50%)';
  btn.style.padding = '15px 30px';
  btn.style.fontSize = '16px';
  btn.style.backgroundColor = '#2196F3';
  btn.style.color = 'white';
  btn.style.border = 'none';
  btn.style.borderRadius = '4px';
  btn.style.cursor = 'pointer';
  btn.style.zIndex = '1000';

  btn.onclick = () => {
    if (!port.opened()) {
      console.log("Opening port selection dialog...");
      port.open(9600);
    } else {
      console.log("Port already open");
      port.close();
    }
  };

  document.body.appendChild(btn);
}

function draw() {
  // No drawing needed for this utility
}