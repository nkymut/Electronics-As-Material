// Serial Graph - displays incoming serial data as real-time graphs
// Uses the same color scheme as Snake_Serial.js

let port;
let dataBuffer = [];
let maxDataPoints = 500;
let graphColors = [];
let numChannels = 1;

// Graph settings
let graphMargin = 60;
let graphWidth, graphHeight;
let minValue = 0;
let maxValue = 1023;
let autoScale = true;
let isPaused = false;

// Graph speed control
let graphSpeed = 1.0; // 1x = normal speed
let graphSpeedOptions = [0.1, 0.25, 0.5, 1.0, 2.0, 4.0, 8.0];
let graphSpeedIndex = 3; // Start at 1.0x
let lastUpdateTime = 0;
let updateInterval = 50; // Base update interval in milliseconds

// Data rate tracking
let lastDataTime = 0;
let dataCount = 0;
let dataRate = 0;
let rateUpdateInterval = 1000; // Update rate every 1 second

// Colors matching Snake_Serial.js theme
let backgroundColor;
let textColor;
let gridColor;

function setup() {
    console.log("Serial Graph - p5.webserial library loaded");
    
    // Initialize colors to match Snake_Serial.js
    backgroundColor = color(200, 200, 200);
    textColor = color(0, 0, 0);
    gridColor = color(150, 150, 150);
    
    // Initialize graph colors (different colors for multiple channels)
    graphColors = [
        color(0, 0, 0),         // Black (like snake)
        color(220, 0, 0),       // Red (like apple)
        color(0, 150, 0),       // Green
        color(0, 0, 220),       // Blue
        color(150, 0, 150),     // Purple
        color(220, 150, 0),     // Orange
        color(0, 150, 150),     // Cyan
        color(150, 75, 0)       // Brown
    ];
    
    createCanvas(windowWidth, windowHeight);
    
    port = createSerial();
    
    // Calculate graph dimensions
    updateGraphDimensions();
    
    // Initialize data buffer
    initializeDataBuffer();
    
    // Try to auto-connect to previously used ports
    let usedPorts = usedSerialPorts();
    if (usedPorts.length > 0) {
        document.getElementById('status').textContent = 'Auto-connecting...';
        port.open(usedPorts[0], 9600);
        
        // Check auto-connection status
        let checkAutoConnection = setInterval(() => {
            if (port.opened()) {
                document.getElementById('connectBtn').textContent = 'Disconnect';
                document.getElementById('status').textContent = 'Connected';
                clearInterval(checkAutoConnection);
            }
        }, 500);
        
        // Stop checking after 3 seconds if not connected
        setTimeout(() => {
            if (!port.opened()) {
                document.getElementById('status').textContent = 'Disconnected';
                clearInterval(checkAutoConnection);
            }
        }, 3000);
    }
    
    // Setup event handlers
    setupEventHandlers();
}

function draw() {
    if (!isPaused) {
        readSerial();
    }
    
    background(backgroundColor);
    
    drawGrid();
    drawGraph();
    drawLabels();
    updateInfo();
}

function setupEventHandlers() {
    // Connect button
    document.getElementById('connectBtn').onclick = () => {
        if (port.opened()) {
            disconnectSerial();
        } else {
            connectSerial();
        }
    };
    
    // Clear button
    document.getElementById('clearBtn').onclick = () => {
        clearData();
    };
    
    // Pause button
    document.getElementById('pauseBtn').onclick = () => {
        togglePause();
    };
    
    // Auto scale button
    document.getElementById('scaleBtn').onclick = () => {
        toggleAutoScale();
    };
    
    // Speed button
    document.getElementById('speedBtn').onclick = () => {
        cycleGraphSpeed();
    };
}

function updateGraphDimensions() {
    graphWidth = width - 2 * graphMargin;
    graphHeight = height - 2 * graphMargin;
}

function initializeDataBuffer() {
    dataBuffer = [];
    for (let i = 0; i < maxDataPoints; i++) {
        let point = { timestamp: 0 };
        for (let j = 0; j < 8; j++) { // Support up to 8 channels
            point[`value${j}`] = 0;
        }
        dataBuffer.push(point);
    }
}

function connectSerial() {
    if (!port.opened()) {
        console.log("Opening serial port selection dialog...");
        document.getElementById('status').textContent = 'Connecting...';
        
        try {
            port.open(9600);
            
            // Check connection status periodically
            let checkConnection = setInterval(() => {
                if (port.opened()) {
                    document.getElementById('connectBtn').textContent = 'Disconnect';
                    document.getElementById('status').textContent = 'Connected';
                    clearInterval(checkConnection);
                } else {
                    // If still not connected after 5 seconds, assume cancelled
                    setTimeout(() => {
                        if (!port.opened()) {
                            document.getElementById('status').textContent = 'Connection cancelled';
                            clearInterval(checkConnection);
                        }
                    }, 5000);
                }
            }, 500);
            
        } catch (error) {
            console.error('Serial connection error:', error);
            document.getElementById('status').textContent = 'Connection failed';
        }
    }
}

function disconnectSerial() {
    if (port.opened()) {
        try {
            port.close();
            document.getElementById('connectBtn').textContent = 'Connect Serial';
            document.getElementById('status').textContent = 'Disconnected';
            console.log("Serial port disconnected");
        } catch (error) {
            console.error('Serial disconnection error:', error);
        }
    }
}

function readSerial() {
    if (port.opened() && port.available() > 0) {
        let str = port.readUntil('\n');
        if (str.length > 0) {
            str = str.trim();
            if (str.length > 0) {
                parseAndAddData(str);
                console.log("Received:", str);
                
                // Update data rate
                dataCount++;
                let currentTime = millis();
                if (currentTime - lastDataTime > rateUpdateInterval) {
                    dataRate = dataCount / ((currentTime - lastDataTime) / 1000);
                    dataCount = 0;
                    lastDataTime = currentTime;
                }
            }
        }
    }
}

function parseAndAddData(dataString) {
    let values = dataString.split(',');
    let newPoint = { timestamp: millis() };
    
    // Update number of channels if needed
    if (values.length > numChannels) {
        numChannels = values.length;
        updateLegend();
    }
    
    // Parse values
    for (let i = 0; i < values.length && i < 8; i++) {
        let val = parseFloat(values[i]);
        if (!isNaN(val)) {
            newPoint[`value${i}`] = val;
            
            // Update min/max for auto scaling
            if (autoScale) {
                if (val < minValue) minValue = val;
                if (val > maxValue) maxValue = val;
            }
        } else {
            newPoint[`value${i}`] = 0;
        }
    }
    
    // Fill remaining channels with 0
    for (let i = values.length; i < 8; i++) {
        newPoint[`value${i}`] = 0;
    }
    
    // Add to buffer (shift array)
    dataBuffer.shift();
    dataBuffer.push(newPoint);
}

function drawGrid() {
    stroke(gridColor);
    strokeWeight(1);
    
    // Horizontal grid lines
    for (let i = 0; i <= 10; i++) {
        let y = graphMargin + (i * graphHeight / 10);
        line(graphMargin, y, width - graphMargin, y);
    }
    
    // Vertical grid lines
    for (let i = 0; i <= 10; i++) {
        let x = graphMargin + (i * graphWidth / 10);
        line(x, graphMargin, x, height - graphMargin);
    }
}

function drawGraph() {
    strokeWeight(2);
    
    // Calculate how many points to display based on speed
    // Slower speed = more points (more detail), faster speed = fewer points (more compressed)
    let pointsToShow = Math.floor(maxDataPoints / graphSpeed);
    pointsToShow = Math.max(50, Math.min(pointsToShow, dataBuffer.length)); // Min 50, max available
    
    // Start from the most recent data
    let startIndex = Math.max(0, dataBuffer.length - pointsToShow);
    
    for (let channel = 0; channel < numChannels; channel++) {
        stroke(graphColors[channel % graphColors.length]);
        noFill();
        
        beginShape();
        for (let i = startIndex; i < dataBuffer.length; i++) {
            let x = map(i - startIndex, 0, pointsToShow - 1, graphMargin, width - graphMargin);
            let value = dataBuffer[i][`value${channel}`];
            let y = map(value, minValue, maxValue, height - graphMargin, graphMargin);
            vertex(x, y);
        }
        endShape();
    }
}

function drawLabels() {
    fill(textColor);
    noStroke();
    textAlign(RIGHT, CENTER);
    textSize(12);
    
    // Y-axis labels
    for (let i = 0; i <= 10; i++) {
        let y = graphMargin + (i * graphHeight / 10);
        let value = map(i, 0, 10, maxValue, minValue);
        text(value.toFixed(0), graphMargin - 10, y);
    }
    
    // X-axis label
    textAlign(CENTER, TOP);
    text("Time →", width / 2, height - graphMargin + 20);
    
    // Y-axis label
    push();
    translate(20, height / 2);
    rotate(-PI / 2);
    textAlign(CENTER, CENTER);
    text("Value", 0, 0);
    pop();
}

function updateLegend() {
    let legend = document.getElementById('legend');
    legend.innerHTML = '';
    
    for (let i = 0; i < numChannels; i++) {
        let item = document.createElement('div');
        item.className = 'legend-item';
        
        let colorBox = document.createElement('span');
        colorBox.className = 'legend-color';
        let c = graphColors[i % graphColors.length];
        colorBox.style.backgroundColor = `rgb(${red(c)}, ${green(c)}, ${blue(c)})`;
        
        let label = document.createElement('span');
        label.textContent = `Value ${i + 1}`;
        
        item.appendChild(colorBox);
        item.appendChild(label);
        legend.appendChild(item);
    }
}

function updateInfo() {
    let totalPoints = dataBuffer.filter(p => p.timestamp > 0).length;
    let currentMin = minValue;
    let currentMax = maxValue;
    
    document.getElementById('info').innerHTML = 
        `Data: ${totalPoints} points<br>` +
        `Range: ${currentMin.toFixed(0)} - ${currentMax.toFixed(0)}<br>` +
        `Rate: ${dataRate.toFixed(1)} Hz<br>` +
        `Speed: ${graphSpeed}x`;
}

function clearData() {
    initializeDataBuffer();
    minValue = 0;
    maxValue = 1023;
    dataCount = 0;
    dataRate = 0;
    lastDataTime = millis();
}

function togglePause() {
    isPaused = !isPaused;
    document.getElementById('pauseBtn').textContent = isPaused ? 'Resume' : 'Pause';
}

function toggleAutoScale() {
    autoScale = !autoScale;
    document.getElementById('scaleBtn').textContent = autoScale ? 'Manual Scale' : 'Auto Scale';
    
    if (!autoScale) {
        minValue = 0;
        maxValue = 1023;
    }
}

function cycleGraphSpeed() {
    graphSpeedIndex = (graphSpeedIndex + 1) % graphSpeedOptions.length;
    graphSpeed = graphSpeedOptions[graphSpeedIndex];
    document.getElementById('speedBtn').textContent = `Speed: ${graphSpeed}x`;
    console.log(`Graph speed changed to: ${graphSpeed}x`);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    updateGraphDimensions();
}

// Keyboard shortcuts
function keyPressed() {
    if (key === 'c' || key === 'C') {
        clearData();
    }
    if (key === 'p' || key === 'P') {
        togglePause();
    }
    if (key === 's' || key === 'S') {
        toggleAutoScale();
    }
    if (key === 'g' || key === 'G') {
        cycleGraphSpeed();
    }
    if (key === ' ') {
        if (port.opened()) {
            disconnectSerial();
        } else {
            connectSerial();
        }
    }
}
