import { Request, Response } from 'express';
import { EventsRepository } from '../repositories/eventsRepository';
import { MetricsService } from '../services/metricsService';

const repo = new EventsRepository();
const service = new MetricsService();

export async function metricsHandler(_req: Request, res: Response) {
  try {
    const finals = await repo.listFinal();
    const data = service.compute(finals);
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'internal_error' });
  }
}