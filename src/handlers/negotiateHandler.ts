import { Request, Response } from 'express';
import { negotiateService } from '../services/negotiateService';

/**
 * POST /negotiate
 * Body:
 * {
 *   "published_rate": 1500,
 *   "carrier_offer":  1700,
 *   "round":          1
 * }
 */
export async function negotiateHandler(req: Request, res: Response) {
  const b = (req.body ?? {}) as {
    published_rate?: number;
    carrier_offer?: number;
    round?: number;
  };

  if (typeof b.published_rate !== 'number' || typeof b.carrier_offer !== 'number') {
    return res.status(400).json({ error: 'published_rate and carrier_offer (numbers) are required' });
  }

  const round = typeof b.round === 'number' ? b.round : 1;
  const decision = negotiateService.evaluate(b.published_rate, b.carrier_offer, round);
  return res.json(decision);
}