class MockWebSocket {
    /**
     * Mock WebSocket class to simulate WebSocket behavior for testing purposes.
     * 
     * @param {string} url - The URL of the WebSocket connection.
     */
    constructor(url) {
        this.url = url;
        this.readyState = WebSocket.OPEN;
        this.onopen = jest.fn();
        this.onclose = jest.fn();
        this.onerror = jest.fn();
        this.onmessage = jest.fn();
        this.messages = [];
    }

    /**
     * Mock send method to simulate sending data over WebSocket.
     * 
     * @param {string} data - The data to be sent.
     */
    send(data) {
        this.messages.push(data);
    }

    /**
     * Mock close method to simulate closing WebSocket connection.
     */
    close() {
        this.readyState = WebSocket.CLOSED;
        this.onclose();
    }

    /**
     * Method to simulate receiving a message over WebSocket.
     * 
     * @param {string} data - The message data to be simulated.
     */
    simulateMessage(data) {
        if (this.onmessage) {
            const event = { data };
            this.onmessage(event);
        }
    }
}

export default MockWebSocket;
