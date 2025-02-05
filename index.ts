import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Root endpoint
app.post('/', (req: Request, res: Response) => {
  console.log('Received JSON:', req.body);
  res.json({ message: 'JSON received successfully', data: req.body });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
