import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import { addUserToDatabase } from './supabase';

dotenv.config();


if (!process.env.BOT_TOKEN) {
  throw new Error('BOT_TOKEN is required in the .env file');
}

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });


console.log('Telegram bot started and is polling for updates.');

bot.on('message', (msg) => {
  console.log(`Received a message: ${msg.text} from ${msg.from?.username || 'unknown user'}`);
});

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from?.id;

  if (!userId) {
    console.error('User ID not found in message:', msg);
    bot.sendMessage(chatId, 'Failed to retrieve user ID.');
    return;
  }

  const webAppUrl = 'https://your-deployed-web-app-url.com'; // Replace with your actual URL

  try {
    console.log('Attempting to add user to the database...');
    const result = await addUserToDatabase(userId);
    console.log('User added to database:', result);

    bot.sendMessage(chatId, 'Welcome to TapMe! Start tapping to earn coins.', {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Open TapMe Web App',
              web_app: { url: webAppUrl }
            }
          ]
        ]
      }
    });
  } catch (error) {
    console.error('Error adding user to database:', error);
    bot.sendMessage(chatId, 'An error occurred. Please try again later.');
  }
});


export default bot;
