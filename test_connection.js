const WebSocket = require('ws');

console.log("Attempting to connect to WebSocket server at ws://localhost:8080...");

const socket = new WebSocket('ws://localhost:8080');

socket.on('open', () => {
    console.log('Successfully connected to WebSocket server');
    socket.send('Test message from Node.js client');
});

socket.on('message', (data) => {
    console.log('Received from server:', data.toString());
});

socket.on('close', () => {
    console.log('Disconnected from WebSocket server');
});

socket.on('error', (error) => {
    console.error('Connection error:', error);
});

// Close after 10 seconds
setTimeout(() => {
    socket.close();
    console.log('Test completed, closing connection.');
    process.exit(0);
}, 10000);
