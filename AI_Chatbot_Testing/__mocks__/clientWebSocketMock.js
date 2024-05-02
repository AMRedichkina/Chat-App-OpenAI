class MockWebSocket {
    constructor(url) {
        this.url = url;
        this.readyState = WebSocket.OPEN;
        this.onopen = jest.fn();
        this.onclose = jest.fn();
        this.onerror = jest.fn();
        this.onmessage = jest.fn();
        this.messages = [];
        }
    send(data) {
            this.messages.push(data);
    }
        
    close() {
        this.readyState = WebSocket.CLOSED;
        this.onclose();
    }

    simulateMessage(data) {
        if (this.onmessage) {
            const event = { data };
            this.onmessage(event);
        }
    }
}
        
export default MockWebSocket;
        
        