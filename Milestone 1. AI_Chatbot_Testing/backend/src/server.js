const express = require('express');
const path = require('path');
const { OpenAI } = require("openai");
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const app = express();

// Initialize OpenAI client
const client = new OpenAI({
  apiKey: process.env.API_KEY,
});

// Middleware setup
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../dist')));

// Route to handle statistics request
app.post('/api/statistics', async (req, res) => {
  const { query } = req.body;
  console.log("Received statistics request for:", query);

  try {
    // Construct prompt for OpenAI
    const prompt = `Generate a JSON object that describes the ${query}. The JSON object should have two main keys: 'labels' and 'datasets'. Include datasets for population numbers, and use arrays of background and border colors suitable for chart visualization.`;
    console.log("Constructed prompt for OpenAI:", prompt);

    // Call OpenAI API to generate completion
    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [{ "role": "user", "content": prompt }],
      max_tokens: 1024
    });

    console.log("Raw completion response from OpenAI:", completion);

    // Parse and send data back to client
    if (completion.choices[0].message && completion.choices[0].message.content) {
      const messageContent = completion.choices[0].message.content;
      console.log("Message content:", messageContent);

      const data = JSON.parse(messageContent);
      console.log("Parsed data to be sent back to client:", data);
      res.json(data);
    } else {
      console.error('No valid data in OpenAI response');
      res.status(500).json({ error: "No valid data in OpenAI response" });
    }
  } catch (error) {
    console.error('Failed to fetch statistics from OpenAI:', error);
    res.status(500).json({ error: "Failed to communicate with OpenAI API", details: error.message });
  }
});

// Route to serve static files or SPA fallback
app.get('*', (req, res) => {
  console.log("Serving static file or SPA fallback");
  res.sendFile(path.resolve(__dirname, '../../dist', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
