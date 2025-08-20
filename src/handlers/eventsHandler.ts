import { Request, Response } from 'express';
import { EventsRepository } from '../repositories/eventsRepository';
import { LogFinalEventService } from '../services/logFinalEvent';

const service = new LogFinalEventService(new EventsRepository());

/**
 * POST /events/log
 * Body ejemplo:
 * {
 *   "callId":"hr-001",
 *   "timestamp":"2025-08-20T10:05:00Z",
 *   "mcNumber":"123456",
 *   "step":"final",
 *   "outcome":"BOOKED",
 *   "sentiment":"POSITIVE",
 *   "selected_load":{"load_id":"L001","final_rate":1650},
 *   "negotiation":{"rounds":2},
 *   "transcript":"..."
 * }
 */
export async function logFinalEventHandler(req: Request, res: Response) {
  const b = (req.body ?? {}) as any;

  // Validación básica rápida
  if (!b?.callId || !b?.timestamp || !b?.step || !b?.outcome || !b?.mcNumber) {
    return res.status(400).json({ error: 'callId, timestamp, step, outcome, mcNumber are required' });
  }

  try {
    await service.exec({
      callId: String(b.callId),
      timestamp: String(b.timestamp),
      mcNumber: String(b.mcNumber),
      step: 'final',
      outcome: b.outcome,
      sentiment: b.sentiment,
      selected_load: b.selected_load
        ? {
            load_id: String(b.selected_load.load_id),
            final_rate: typeof b.selected_load.final_rate === 'number' ? b.selected_load.final_rate : undefined,
            pickup_datetime: b.selected_load.pickup_datetime,
            delivery_datetime: b.selected_load.delivery_datetime
          }
        : undefined,
      negotiation: b.negotiation ? { rounds: Number(b.negotiation.rounds) || 0 } : undefined,
      transcript: typeof b.transcript === 'string' ? b.transcript : undefined
    });

    return res.status(204).end();
  } catch (e: any) {
    return res.status(400).json({ error: e?.message || 'bad_request' });
  }
}