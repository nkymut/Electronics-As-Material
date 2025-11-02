// Serial terminal functionality
// Terminal variables
let terminalVisible = false;
let terminalContainer;
let terminalContent;
let terminalMessages = [];
let originalConsoleLog;
let originalConsoleError;
let maxTerminalMessages = 100;

/////////////////
//             //
//  TERMINAL   //
//             //
/////////////////

function initializeSerialTerminal() {
  // Store original console functions
  originalConsoleLog = console.log;
  originalConsoleError = console.error;

  // Override console.log
  console.log = function(...args) {
    // Call original console.log
    originalConsoleLog.apply(console, args);
    // Add to terminal
    addTerminalMessage('log', args.join(' '));
  };

  // Override console.error
  console.error = function(...args) {
    // Call original console.error
    originalConsoleError.apply(console, args);
    // Add to terminal
    addTerminalMessage('error', args.join(' '));
  };

  // Create terminal UI
  terminalContainer = document.createElement('div');
  terminalContainer.id = 'serialTerminal';
  terminalContainer.style.position = 'fixed';
  terminalContainer.style.bottom = '0';
  terminalContainer.style.left = '0';
  terminalContainer.style.width = '100%';
  terminalContainer.style.height = '300px';
  terminalContainer.style.backgroundColor = '#1e1e1e';
  terminalContainer.style.color = '#d4d4d4';
  terminalContainer.style.fontFamily = 'Monaco, Consolas, "Courier New", monospace';
  terminalContainer.style.fontSize = '12px';
  terminalContainer.style.zIndex = '2000';
  terminalContainer.style.display = 'none';
  terminalContainer.style.flexDirection = 'column';
  terminalContainer.style.borderTop = '2px solid #3c3c3c';
  terminalContainer.style.boxShadow = '0 -2px 10px rgba(0,0,0,0.5)';

  // Terminal header
  let terminalHeader = document.createElement('div');
  terminalHeader.style.backgroundColor = '#2d2d30';
  terminalHeader.style.padding = '8px 12px';
  terminalHeader.style.borderBottom = '1px solid #3c3c3c';
  terminalHeader.style.display = 'flex';
  terminalHeader.style.justifyContent = 'space-between';
  terminalHeader.style.alignItems = 'center';

  let terminalTitle = document.createElement('span');
  terminalTitle.textContent = 'Serial Terminal';
  terminalTitle.style.fontWeight = 'bold';
  terminalTitle.style.color = '#cccccc';

  let terminalControls = document.createElement('div');
  terminalControls.style.display = 'flex';
  terminalControls.style.gap = '8px';

  let clearBtn = document.createElement('button');
  clearBtn.textContent = 'Clear';
  clearBtn.style.padding = '4px 12px';
  clearBtn.style.fontSize = '11px';
  clearBtn.style.backgroundColor = '#007acc';
  clearBtn.style.color = 'white';
  clearBtn.style.border = 'none';
  clearBtn.style.borderRadius = '3px';
  clearBtn.style.cursor = 'pointer';
  clearBtn.onclick = clearTerminal;

  let closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  closeBtn.style.padding = '4px 12px';
  closeBtn.style.fontSize = '16px';
  closeBtn.style.backgroundColor = '#c72525';
  closeBtn.style.color = 'white';
  closeBtn.style.border = 'none';
  closeBtn.style.borderRadius = '3px';
  closeBtn.style.cursor = 'pointer';
  closeBtn.onclick = toggleTerminal;

  terminalControls.appendChild(clearBtn);
  terminalControls.appendChild(closeBtn);
  terminalHeader.appendChild(terminalTitle);
  terminalHeader.appendChild(terminalControls);
  terminalContainer.appendChild(terminalHeader);

  // Terminal content
  terminalContent = document.createElement('div');
  terminalContent.id = 'terminalContent';
  terminalContent.style.flex = '1';
  terminalContent.style.overflowY = 'auto';
  terminalContent.style.padding = '8px 12px';
  terminalContent.style.lineHeight = '1.5';

  // Custom scrollbar styling
  terminalContent.style.scrollbarWidth = 'thin';
  terminalContent.style.scrollbarColor = '#3c3c3c #1e1e1e';

  terminalContainer.appendChild(terminalContent);
  document.body.appendChild(terminalContainer);

  // Add CSS for webkit scrollbar
  let style = document.createElement('style');
  style.textContent = `
    #terminalContent::-webkit-scrollbar {
      width: 8px;
    }
    #terminalContent::-webkit-scrollbar-track {
      background: #1e1e1e;
    }
    #terminalContent::-webkit-scrollbar-thumb {
      background: #3c3c3c;
      border-radius: 4px;
    }
    #terminalContent::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
  `;
  document.head.appendChild(style);
}

function addTerminalMessage(type, message) {
  if (!terminalContent) return;

  // Format timestamp
  let now = new Date();
  let timestamp = now.toTimeString().split(' ')[0];
  
  // Create message line
  let messageLine = document.createElement('div');
  messageLine.style.marginBottom = '4px';
  messageLine.style.wordBreak = 'break-word';

  let prefix = document.createElement('span');
  prefix.style.color = '#858585';
  prefix.textContent = `[${timestamp}] `;

  let typeSpan = document.createElement('span');
  if (type === 'error') {
    typeSpan.textContent = '[ERROR] ';
    typeSpan.style.color = '#f48771';
    typeSpan.style.fontWeight = 'bold';
  } else {
    typeSpan.textContent = '[LOG] ';
    typeSpan.style.color = '#569cd6';
  }

  let messageSpan = document.createElement('span');
  messageSpan.textContent = message;
  messageSpan.style.color = type === 'error' ? '#f48771' : '#d4d4d4';

  messageLine.appendChild(prefix);
  messageLine.appendChild(typeSpan);
  messageLine.appendChild(messageSpan);

  terminalContent.appendChild(messageLine);

  // Keep only last maxTerminalMessages
  terminalMessages.push(messageLine);
  if (terminalMessages.length > maxTerminalMessages) {
    let removed = terminalMessages.shift();
    if (removed.parentNode) {
      removed.parentNode.removeChild(removed);
    }
  }

  // Auto-scroll to bottom
  terminalContent.scrollTop = terminalContent.scrollHeight;
}

function toggleTerminal() {
  terminalVisible = !terminalVisible;
  if (terminalContainer) {
    terminalContainer.style.display = terminalVisible ? 'flex' : 'none';
    updateTerminalButton();
  }
}

function clearTerminal() {
  if (terminalContent) {
    terminalContent.innerHTML = '';
    terminalMessages = [];
  }
}

function createTerminalToggleButton() {
  let btn = document.createElement('button');
  btn.id = 'terminalBtn';
  btn.textContent = 'Show Terminal';
  btn.style.position = 'absolute';
  btn.style.top = '60px';
  btn.style.right = '10px';
  btn.style.padding = '10px 20px';
  btn.style.fontSize = '14px';
  btn.style.backgroundColor = '#007acc';
  btn.style.color = 'white';
  btn.style.border = 'none';
  btn.style.borderRadius = '4px';
  btn.style.cursor = 'pointer';
  btn.style.zIndex = '1001';

  btn.onclick = toggleTerminal;
  document.body.appendChild(btn);
}

function updateTerminalButton() {
  let btn = document.getElementById('terminalBtn');
  if (btn) {
    btn.textContent = terminalVisible ? 'Hide Terminal' : 'Show Terminal';
  }
}

