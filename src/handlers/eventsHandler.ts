import { Request, Response } from 'express';
import { EventsRepository } from '../repositories/eventsRepository';
import { LogFinalEventService } from '../services/logFinalEvent';
import { randomUUID } from 'crypto';

const service = new LogFinalEventService(new EventsRepository());

export async function logFinalEventHandler(req: Request, res: Response) {
  const b = (req.body ?? {}) as any;

  const callId = String(b.callId || randomUUID());
  const timestamp =
    typeof b.timestamp === 'string' && b.timestamp
      ? b.timestamp
      : new Date().toISOString();
  const step: 'final' = 'final';
  const outcome = typeof b.outcome === 'string' && b.outcome ? b.outcome : 'UNKNOWN';

  try {
    await service.exec({
      callId,
      timestamp,
      mcNumber: b.mcNumber != null ? String(b.mcNumber) : '',
      step,
      outcome,
      sentiment: b.sentiment,
      selected_load: b.selected_load
        ? {
            load_id: String(b.selected_load.load_id),
            final_rate: b.selected_load.final_rate,
            pickup_datetime: b.selected_load.pickup_datetime,
            delivery_datetime: b.selected_load.delivery_datetime
          }
        : undefined,
      negotiation: b.negotiation
        ? { rounds: Number(b.negotiation.rounds) || 0 }
        : undefined,
      transcript: typeof b.transcript === 'string' ? b.transcript : undefined,
      notes: typeof b.notes === 'string' ? b.notes : undefined,
      special_requirements:
        typeof b.special_requirements === 'string'
          ? b.special_requirements
          : undefined,
      contact: b.contact
        ? {
            name:
              typeof b.contact.name === 'string' ? b.contact.name : undefined,
            email:
              typeof b.contact.email === 'string' ? b.contact.email : undefined
          }
        : b.contact_name || b.contact_email
        ? {
            name:
              typeof b.contact_name === 'string' ? b.contact_name : undefined,
            email:
              typeof b.contact_email === 'string'
                ? b.contact_email
                : undefined
          }
        : undefined
    });

    return res.status(200).json({
      status: 'ok',
      message: 'Final event logged successfully',
      callId,
      outcome
    });
  } catch (e: any) {
    return res.status(400).json({ error: e?.message || 'bad_request' });
  }
}