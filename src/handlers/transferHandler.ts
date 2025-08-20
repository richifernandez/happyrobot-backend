import { Request, Response } from 'express';
import { TransferService } from '../services/transferService';
import { SalesRepoMock } from '../repositories/salesRepo';

const service = new TransferService(new SalesRepoMock());

/**
 * POST /transfer
 * Body JSON:
 * {
 *   "callId": "hr-123",
 *   "toNumber": "+34911222333",
 *   "load_id": "L001",
 *   "final_rate": 1650,
 *   "carrier_mc": "123456",
 *   "carrier_name": "Acme Logistics",
 *   "notes": "Accept at 1650 USD"
 * }
 */
export async function transferHandler(req: Request, res: Response) {
  const b = (req.body ?? {}) as {
    callId?: string;
    toNumber?: string;
    load_id?: string;
    final_rate?: number;
    carrier_mc?: string;
    carrier_name?: string;
    notes?: string;
  };

  if (!b.callId || !b.toNumber || !b.load_id || typeof b.final_rate !== 'number') {
    return res.status(400).json({
      error: 'callId, toNumber, load_id and final_rate are required'
    });
  }

  const result = await service.exec({
    callId: b.callId,
    toNumber: b.toNumber,
    load_id: b.load_id,
    final_rate: b.final_rate,
    carrier_mc: b.carrier_mc,
    carrier_name: b.carrier_name,
    notes: b.notes
  });

  if (!result.success) {
    return res.status(502).json(result); // bad gateway simulado si falla el “bridge”
  }

  return res.json(result);
}