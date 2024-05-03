/**
 * WebSocket server for handling text generation requests using OpenAI's GPT-3 model.
 * 
 * This server listens for WebSocket connections and handles incoming text generation requests
 * from clients. It uses the OpenAI API to generate text based on the provided prompt and streams
 * the generated text back to the client in chunks.
 * 
 * @module WebSocketServer
 */

const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const { OpenAI } = require("openai");
require('dotenv').config();

const PORT = 3001;
const wss = new WebSocket.Server({ port: PORT });

const client = new OpenAI({
    apiKey: process.env.API_KEY,
});

/**
 * Fetch text from OpenAI and stream it back to the client.
 * 
 * This function sends a request to the OpenAI API to generate text based on the provided prompt.
 * It then streams the generated text back to the client in chunks.
 * 
 * @param {WebSocket} ws - The WebSocket connection object.
 * @param {Object} messageObj - The message object containing the text generation prompt.
 */
const fetchTextOpenAI = async function (ws, messageObj) {
    // Create a stream for text generation
    const stream = await client.chat.completions.create({
        model: "gpt-3.5-turbo-0125",
        messages: [{ "role": "user", "content": messageObj.message }],
        max_tokens: 1024,
        stream: true,
    });

    // Generate a unique message ID
    const messageId = uuidv4();

    // Send a message to client indicating start of text generation
    ws.send(JSON.stringify({ type: 'text-start', id: messageId, text: '' }));

    try {
        // Stream generated text back to client
        for await (const chunk of stream) {
            if (chunk.choices[0]?.delta?.content) {
                ws.send(JSON.stringify({
                    id: messageId,
                    type: 'text-progress',
                    text: chunk.choices[0].delta.content
                }));
            }
        }
        // Send a message to client indicating end of text generation
        ws.send(JSON.stringify({ id: messageId, type: 'text-end', text: '' }));
    } catch (error) {
        console.error('Error during streaming:', error);
        ws.send(JSON.stringify({ type: 'error', message: 'Error in streaming data from OpenAI. Please try again later.' }));
    }
}

// WebSocket server event handling
wss.on('connection', function connection(ws) {
    console.log('A client connected');

    // Handle incoming messages from client
    ws.on('message', function incoming(data) {
        let messageObj;
        try {
            messageObj = JSON.parse(data);
        } catch (error) {
            console.error('Error parsing JSON:', error);
            return;
        }
        if (messageObj && typeof messageObj.message === 'string') {
            try {
                // Fetch text from OpenAI based on client message
                fetchTextOpenAI(ws, messageObj);
            } catch (error) {
                // Handle errors in fetching response from OpenAI
                console.error('Failed to fetch response from OpenAI:', error);
                res.status(500).json({ error: "Failed to communicate with OpenAI API", details: error.message });
            }
        } else {
            // Handle invalid message format or type
            console.error('Invalid message format or type:', messageObj);
        }
    });

    // Handle client disconnection
    ws.on('close', () => {
        console.log('A client disconnected');
    });
});

// Log server start
console.log(`WebSocket server started on ws://localhost:${PORT}`);
