const WebSocket = require('socket');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Connect to the WebSocket server
const socket = new WebSocket('socket://localhost:8080');

// Connection opened
socket.on('open', () => {
  console.log('Connected to the WebSocket server');
  promptForMessage();
});

// Listen for messages from the server
socket.on('message', (message) => {
  console.log(`Server: ${message}`);
});

// Handle errors
socket.on('error', (error) => {
  console.error('WebSocket error:', error);
});

// Handle connection close
socket.on('close', () => {
  console.log('Disconnected from the server');
  process.exit(0);
});

// Function to prompt user for messages
function promptForMessage() {
  rl.question('Enter a message (or "exit" to quit): ', (message) => {
    if (message.toLowerCase() === 'exit') {
      socket.close();
      rl.close();
      return;
    }
    socket.send(message);
    promptForMessage();
  });
}
