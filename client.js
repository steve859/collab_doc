const socket = new WebSocket('ws://localhost:8080');

// Listen for messages from the server
socket.onmessage = (event) => {
    console.log('Server says:', event.data);

    try {
        const data = JSON.parse(event.data);

        // Check if the message contains stock data
        if (data.stock) {
            // Update the UI with stock data
            updateStockDisplay(data.stock);
        }
    } catch (error) {
        console.log('Received a non-JSON message:', event.data);
    }
};

// Function to update stock display
function updateStockDisplay(stockData) {
    const stockElement = document.getElementById('stock-price');
    if (stockElement) {
        stockElement.textContent = stockData;
        stockElement.classList.add('highlight');

        // Remove highlight effect after animation completes
        setTimeout(() => {
            stockElement.classList.remove('highlight');
        }, 1000);
    }
}

// Send a message to the server
socket.onopen = () => {
    console.log('Connected to WebSocket server');
    socket.send('Hello, WebSocket Server!');
};

// Handle connection close
socket.onclose = () => {
    console.log('Disconnected from WebSocket server');
};
