import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', mode: 'api' });
});

app.get('/api/programs', (_req, res) => {
  res.json({ message: 'Connect PostgreSQL via DATABASE_URL and run prisma db push' });
});

app.listen(PORT, () => {
  console.log(`NGO Platform API running on http://localhost:${PORT}`);
});
