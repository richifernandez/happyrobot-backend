import express from 'express';
import path from 'path';
import { healthHandler } from './handlers/health';
import { verifyCarrierHandler } from './handlers/carrierHandler';
import { searchLoadsHandler } from './handlers/loadsSearchHandler';
import { negotiateHandler } from './handlers/negotiateHandler';
import { transferHandler } from './handlers/transferHandler';
import { logFinalEventHandler } from './handlers/eventsHandler';
import { metricsHandler } from './handlers/metricsHandler';
import { authMiddleware } from './middleware/auth';




const app = express();
app.use(express.json());

app.get('/health', healthHandler);

app.post('/verify-carrier', authMiddleware, verifyCarrierHandler);
app.post('/loads/search', authMiddleware, searchLoadsHandler);
app.post('/negotiate', authMiddleware, negotiateHandler);
app.post('/transfer', authMiddleware, transferHandler);
app.post('/events/log', authMiddleware, logFinalEventHandler);
app.get('/metrics', authMiddleware, metricsHandler);
app.use('/dashboard', express.static(path.resolve(process.cwd(), 'public')));


const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(PORT, () => {
  console.log(`API listening on http://0.0.0.0:${PORT}`);
});