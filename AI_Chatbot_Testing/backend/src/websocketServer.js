const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const { OpenAI } = require("openai");
require('dotenv').config();

const PORT = 3001;
const wss = new WebSocket.Server({ port: PORT });

const client = new OpenAI({
    apiKey: process.env.API_KEY,
});

const fetchTextOpenAI = async function (ws, messageObj) {
    const stream = await client.chat.completions.create({
        model: "gpt-3.5-turbo-0125",
        messages: [{ "role": "user", "content": messageObj.message }],
        max_tokens: 1024,
        stream: true,
    });
    const messageId = uuidv4();
    ws.send(JSON.stringify({ type: 'text-start', id: messageId, text: '' }));

    try {
        for await (const chunk of stream) {
            if (chunk.choices[0]?.delta?.content) {
                ws.send(JSON.stringify({
                    id: messageId,
                    type: 'text-progress',
                    text: chunk.choices[0].delta.content
                }));
            }
        }
        ws.send(JSON.stringify({ id: messageId, type: 'text-end', text: '' }));
    } catch (error) {
        console.error('Error during streaming:', error);
        ws.send(JSON.stringify({ type: 'error', message: 'Error in streaming data from OpenAI.' }));
    }
}

wss.on('connection', function connection(ws) {
    console.log('A client connected');
    ws.on('message', function incoming(data) {
        let messageObj;
        try {
            messageObj = JSON.parse(data);
        } catch (error) {
            console.error('Error parsing JSON:', error);
            return;
        }
        if (messageObj && typeof messageObj.message === 'string') {
            try{
                fetchTextOpenAI(ws, messageObj);
            } catch (error) {
                console.error('Failed to fetch response from OpenAI:', error);
                res.status(500).json({ error: "Failed to communicate with OpenAI API", details: error.message });
            }
        } else {
            console.error('Invalid message format or type:', messageObj);
        }
    });

    ws.on('close', () => {
        console.log('A client disconnected');
    });
});

console.log(`WebSocket server started on ws://localhost:${PORT}`);
