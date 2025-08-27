const WebSocket = require('ws');
const uuid = require('uuid');
const uuidv4 = uuid.v4;


const wss = new WebSocket.Server({ port: 8080 });
const clients = new Map();

wss.on('connection', (ws) => {
    //console.log("New client connected");
    const clientId = uuidv4();
    clients.set(clientId, ws);
    console.log(`New client connected: ${clientId}`);
    logClients();
    ws.send(JSON.stringify({
        type: 'welcome',
        clientId,
        message: "Welcome to Websocket server"
    }));

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            console.log(`Message from ${clientId}`, data);
            broadcast(clientId, data);
        }
        catch (err) {
            console.error("Error parsing message",)
        }
    });
    ws.on('close', () => {
        console.log(`Currently connected clients: ${clients.size}`);
        console.log("Client disconnected")
    })
})

function broadcast(senderId, data) {
    for (const [clientId, clientWs] of clients.entries()) {
        if (clientId !== senderId && clientWs.readyState === WebSocket.OPEN) {
            clietnWs.send(JSON.stringify({
                type: 'broadcast',
                from: senderId,
                data,
            }))
        }
    }
}

function logClients() {
    console.log(`Currently connected clients: ${clients.size}`);
    console.log([...clients.keys()]);
}

setInterval(() => {
    const stockPrice = (Math.random() * 100).toFixed(2); // Generate a random stock price

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ stock: `AAPL: $${stockPrice}` }));
        }
    });
}, 5000); // Send updates every 5 seconds

console.log("Websocket server is running on ws://localhost:8080");