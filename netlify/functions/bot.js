const { Telegraf } = require('telegraf');

// Initialize the bot with the token from Netlify's Environment Variables
const bot = new Telegraf(process.env.BOT_TOKEN);

// --- Bot Commands & Logic ---

// 1. Handle the /start command
bot.start((ctx) => {
  const userName = ctx.from.first_name || 'there';
  return ctx.reply(`Hello ${userName}! 👋\n\nWelcome to @Vipbonusbot. Use /help to see what I can do.`);
});

// 2. Handle the /help command
bot.help((ctx) => {
  return ctx.reply('Here are the available commands:\n/start - Start the bot\n/help - Show this menu\n/bonus - Check your VIP bonus (demo)');
});

// 3. A simple "bonus" command (example)
bot.command('bonus', (ctx) => {
  // In a real project, you would look up the user's VIP status here
  return ctx.reply('🎁 Your current VIP bonus balance is: **0 points** (Demo Mode)', {
    parse_mode: 'Markdown',
  });
});

// 4. Fallback for any other text messages
bot.on('text', (ctx) => {
  return ctx.reply(`You said: "${ctx.message.text}". Type /help for commands.`);
});

// --- Netlify Function Handler ---

exports.handler = async (event, context) => {
  // We only accept POST requests from Telegram
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Parse the update body sent by Telegram
    const update = JSON.parse(event.body);
    
    // Pass the update to Telegraf
    await bot.handleUpdate(update);
    
    // Return 200 OK to Telegram
    return { statusCode: 200, body: 'OK' };
  } catch (error) {
    console.error('Error handling update:', error);
    // Return 200 even on error to prevent Telegram from retrying aggressively
    return { statusCode: 200, body: 'Error' };
  }
};
