import express, { Request, Response } from 'express';
import { Client, GatewayIntentBits, TextChannel } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

// Login the bot
client.login(process.env.DISCORD_TOKEN);

type Alert = {
  pattern: 'Red First' | 'Green First';
  candle: {
    closeArray: number[];
    openArray: number[];
    highArray: number[];
    lowArray: number[];
    timestampArray: number[];
  };
  symbol: string;
  timeframe: string;
};

// Middleware to parse JSON requests
app.use(express.json());

// Root endpoint
// @ts-expect-error shut up
app.post('/', async (req: Request, res: Response) => {
  const receivedAlert = req.body as Alert;
  try {
    const channel = (await client.channels.fetch(
      process.env.DISCORD_CHANNEL_ID || '',
    )) as TextChannel;

    if (!channel) {
      return res.status(500).json({ error: 'Channel not found' });
    }

    await channel.send(
      `${receivedAlert.symbol}/${receivedAlert.timeframe}: ${receivedAlert.pattern}`,
    );
    return res.json({ message: 'Message sent to Discord!' });
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ error: 'Failed to send message' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
