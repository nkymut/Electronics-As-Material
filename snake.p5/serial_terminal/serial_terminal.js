// Serial Terminal - displays incoming serial data with timestamps
// Uses the same color scheme as Snake_Serial.js

let port;
let terminal;
let maxLines = 1000; // Maximum number of lines to keep in terminal

function setup() {
    console.log("Serial Terminal - p5.webserial library loaded");
    
    port = createSerial();
    terminal = document.getElementById('terminal');
    
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
                addToTerminal('=== AUTO-CONNECTED TO PREVIOUS PORT ===', true);
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
    
    // No canvas needed for terminal
    noCanvas();
}

function draw() {
    readSerial();
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
        clearTerminal();
    };
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
                    addToTerminal('=== SERIAL CONNECTION ESTABLISHED ===', true);
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
            addToTerminal('=== SERIAL CONNECTION CLOSED ===', true);
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
                addToTerminal(str);
                console.log("Received:", str);
            }
        }
    }
}

function addToTerminal(data, isSystemMessage = false) {
    const timestamp = new Date().toLocaleTimeString();
    const line = document.createElement('div');
    line.className = 'terminal-line';
    
    if (isSystemMessage) {
        line.innerHTML = `<span class="timestamp">[${timestamp}]</span><span class="data" style="color: rgb(220, 0, 0);">${data}</span>`;
    } else {
        line.innerHTML = `<span class="timestamp">[${timestamp}]</span><span class="data">${data}</span>`;
    }
    
    terminal.appendChild(line);
    
    // Auto-scroll to bottom
    terminal.scrollTop = terminal.scrollHeight;
    
    // Limit number of lines
    while (terminal.children.length > maxLines) {
        terminal.removeChild(terminal.firstChild);
    }
}

function clearTerminal() {
    terminal.innerHTML = '';
    addToTerminal('=== TERMINAL CLEARED ===', true);
}

// Keyboard shortcuts
function keyPressed() {
    if (key === 'c' || key === 'C') {
        clearTerminal();
    }
    if (key === ' ') {
        if (port.opened()) {
            disconnectSerial();
        } else {
            connectSerial();
        }
    }
}
