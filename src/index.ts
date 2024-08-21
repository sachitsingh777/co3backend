import express from 'express';
import dotenv from 'dotenv';
import { yoga } from './graphql';
import bot from './bot';

dotenv.config();

console.log('Starting the bot...');

// Error handling for bot polling errors
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

// Handling received messages
bot.on('message', (msg) => {
  console.log('Message received:', msg.text);
});

const app = express();

// Middleware for handling GraphQL requests
app.use('/graphql', yoga);

const PORT = process.env.PORT || 4000;

// Start the server and bot
(async () => {
  try {
    await bot.startPolling(); // Ensure the bot is started

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    console.error('Error starting the server or bot:', error);
  }
})();
