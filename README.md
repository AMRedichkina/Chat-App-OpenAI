# Chat Application with OpenAI and Chart.js

## Project Description

This repository contains a chat application that utilizes the Express framework on the backend and React on the frontend. The application is designed to interact with users through a chat interface, where users can send messages and request data visualizations (charts) which are dynamically generated based on the inputs using GPT (from OpenAI) and Chart.js.

## Key Features

- **Real-time Chat Interface**: Users can send and receive messages instantaneously.
- **Integration with OpenAI's GPT**: The backend uses OpenAI's API to generate responses and data for charts based on user queries.
- **Dynamic Data Visualization**: Utilizes Chart.js to create visualizations based on the data received from GPT.
- **Responsive Frontend**: Built with React, employing hooks for state management and React Router for navigation.
- **Semantic UI for Styling**: Selective use of Semantic UI for enhancing specific UI elements, maintaining a clean and modern look.

## Technologies Used

- **Backend**: Node.js, Express, OpenAI API
- **Frontend**: React, Chart.js, Semantic UI
- **State Management**: React hooks (useState, useEffect). Scalable to include Redux/MobX for more complex state management needs.
- **Styling**: Semantic UI React, CSS

## Setup and Installation

**Clone the repository**
   ```bash
   git clone <...>
   cd <...>

# Install dependencies
npm install

#Create a .env file in the root directory and add the following:

OPENAI_API_KEY='Your OpenAI API Key Here'

# Run the app 

npm run dev
```
