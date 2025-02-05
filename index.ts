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

type Timeframe =
  | '1min'
  | '3min'
  | '5min'
  | '15min'
  | '30min'
  | '45min'
  | '1h'
  | '2h'
  | '3h'
  | '4h'
  | '6h'
  | '8h'
  | '12h'
  | '1D'
  | '1W'
  | '1M';

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
  timeframe: Timeframe;
};

// Middleware to parse JSON requests
app.use(express.json());

// Root endpoint
// @ts-expect-error shut up
app.post('/', async (req: Request, res: Response) => {
  const receivedAlert = req.body as Alert;
  const { symbol, timeframe, pattern } = receivedAlert;
  try {
    const channel = (await client.channels.fetch(
      (timeframe === '4h'
        ? process.env.DISCORD_CHANNEL_ID_4h
        : timeframe === '1D'
          ? process.env.DISCORD_CHANNEL_ID_1D
          : timeframe === '1W'
            ? process.env.DISCORD_CHANNEL_ID_1W
            : process.env.DISCORD_CHANNEL_ID_REST) as string,
    )) as TextChannel;

    if (!channel) {
      return res.status(500).json({ error: 'Channel not found' });
    }

    await channel.send(`${symbol}/${timeframe}: ${pattern}`);
    return res.json({ message: 'Message sent to Discord!' });
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ error: 'Failed to send message' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
