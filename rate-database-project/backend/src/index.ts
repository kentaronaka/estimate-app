import express from 'express';
import ratesRouter from './routes/rates';
import { createLogger } from './utils/logger';

const app = express();
const PORT = process.env.PORT || 3000;
const logger = createLogger();

app.use(express.json());
app.use('/api/rates', ratesRouter);

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});