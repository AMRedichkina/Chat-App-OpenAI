# Chat App

This project demonstrates a chat application using React, Redux, and WebSocket. It utilizes OpenAI's GPT to enhance chat functionalities by providing AI-driven responses.

## Features

- Real-time messaging via streaming, allowing users to receive message updates incrementally, rather than waiting for full data loads.
- Integration with OpenAI's GPT for dynamic, intelligent chat responses.
- Optimized re-rendering process using Redux for state management and React memoization hooks to minimize unnecessary DOM updates, enhancing performance.
- Interactive charts for data visualization, utilizing Chart.js and React-Chartjs-2.

## Prerequisites

Before you begin, ensure you have installed Node.js (which includes npm) on your system.

## Installation

To set up the project for development on your local machine, please follow the steps below:

1. Clone the repository to your local machine:
   ```sh
   git clone <...>
   ```

2. Navigate to the project directory:
   ```sh
   cd <...>
   ```

3. Install the required dependencies:
   ```sh
   npm install
   ```
4. add .babelrc with following code:
   ```sh
      {
   "presets": [
      ["@babel/preset-env", {
         "targets": "> 0.25%, not dead"
      }],
      ["@babel/preset-react", {
         "runtime": "automatic"
      }]
   ]
   }
   ```
5. Add .env with your API_KEY.


### Running the Application

This project uses several scripts to run the development server, backend, and WebSocket server concurrently.

To start the development server (frontend):
   ```sh
   npm run start
   ```
To build the project for production:
   ```sh
   npm run build
   ```
To run the backend server:
   ```sh
   npm run serve
   ```
To start the WebSocket server:
   ```sh
   npm run ws
   ```
To run all servers concurrently in development mode:
   ```sh
   npm run dev
   ```
## Technologies Used

This project is built using a range of technologies to facilitate real-time communication and AI integration:

- **React**
- **Redux & @reduxjs/toolkit**
- **Semantic UI React**
- **WebSocket (ws)**
- **Node.js & Express**
- **OpenAI GPT**
- **Chart.js and React-Chartjs-2**
- **Webpack & Babel**