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

// Root endpoint
// @ts-expect-error shut up
app.post('/', express.json(), async (req: Request, res: Response) => {
  const receivedAlert = req.body as Alert;
  const { symbol, timeframe, pattern } = receivedAlert;
  try {
    const channel = (await client.channels.fetch(
      (timeframe === '4h'
        ? process.env.DISCORD_CHANNEL_ID_4H
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

/* ===== TEXT ALERT ENDPOINT ===== */
// @ts-expect-error shut up
app.post('/fisher4h', express.text(), async (req: Request, res: Response) => {
  const message = req.body as string;
  console.log('Received text alert:', message);

  try {
    const channel = (await client.channels.fetch(
      process.env.DISCORD_CHANNEL_ID_FISHER_4H as string,
    )) as TextChannel;

    if (!channel) {
      return res.status(500).json({ error: 'Channel not found' });
    }

    await channel.send(`📢 Alert Received:\n${message}`);
    return res.json({ message: 'Text alert sent to Discord!' });
  } catch (error) {
    console.error('Error sending text alert:', error);
    return res.status(500).json({ error: 'Failed to send message' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

/* ===== TEXT ALERT ENDPOINT ===== */
// @ts-expect-error shut up
app.post('/fisher1d', express.text(), async (req: Request, res: Response) => {
  const message = req.body as string;
  console.log('Received text alert:', message);

  try {
    const channel = (await client.channels.fetch(
      process.env.DISCORD_CHANNEL_ID_FISHER_1D as string,
    )) as TextChannel;

    if (!channel) {
      return res.status(500).json({ error: 'Channel not found' });
    }

    await channel.send(`📢 Alert Received:\n${message}`);
    return res.json({ message: 'Text alert sent to Discord!' });
  } catch (error) {
    console.error('Error sending text alert:', error);
    return res.status(500).json({ error: 'Failed to send message' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
