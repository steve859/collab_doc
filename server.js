const WebSocket = require('ws');
const uuid = require('uuid');
const uuidv4 = uuid.v4;
const { MessageSchema } = require("./message_shemas");
const client = require('./database/connection');
const initializeDatabase = require('./database/init');
const { Logger } = require('logger');



const clients = new Map();
const documents = new Map();

const messages = ['greeting', 'join_document', 'leave_document', 'edit', 'cursor_position', 'lock_request', 'unlock_request'];

async function startServer() {
    try {
        const dbInitialized = await initializeDatabase();
        if (!dbInitialized) {
            throw new Error('Failed to initialize database');
        }
        const wss = new WebSocket.Server({ port: 8080 });
        wss.on('connection', (ws) => {
            //console.log("New client connected");
            const clientId = uuidv4();
            clients.set(clientId, { ws, activeDocument: null });
            console.log(`New client connected: ${clientId}`);
            logClients();
            ws.send(JSON.stringify({
                type: 'welcome',
                clientId,
                message: "Welcome to Websocket server"
            }));
            ws.on('message', (message) => {
                try {
                    const rawData = JSON.parse(message);
                    const data = MessageShema.parse(rawData);
                    console.log(`Message from ${clientId}: `, data);
                    switch (data.type) {
                        case "greeting":
                            console.log(`Client ${clientId} says hello: ${data.message}`);
                            break;

                        case "join_document":
                            handleJoinDocument(clientId, data.documentId);
                            break;

                        case "leave_document":
                            handleLeaveDocument(clientId);
                            break;

                        case "edit":
                            handleEdit(clientId, data.change);
                            break;

                        case "cursor_position":
                            handleCursorPosition(clientId, data.position);
                            break;

                        case "lock_request":
                            handleLockRequest(clientId, data.section);
                            break;

                        case "unlock_request":
                            handleUnlockRequest(clientId, data.section);
                            break;

                        default:
                            console.warn("Unknown message type:", data.type);
                    }
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

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();

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

function handleJoinDocument() {
    const clientInfo = clients.get(clientId);

    if (!clientInfo) {
        console.error(`Client ${clientId} not found`);
        return;
    }
    clientInfo.activeDocument = documentId;

}

function handleLeaveDocument() {

}

function handleEdit() {

}

function handleCursorPosition() {

}

function handleLockRequest() {

}

function handleUnlockRequest() {

}

console.log("Websocket server is running on ws://localhost:8080");