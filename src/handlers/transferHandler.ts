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
    const raw = (req.body ?? {}) as Record<string, any>;
  
    const final_rate = raw.final_rate !== undefined ? Number(raw.final_rate) : NaN;
  
    if (!raw.callId || !raw.toNumber || !raw.load_id || Number.isNaN(final_rate)) {
      return res.status(400).json({
        error: 'callId, toNumber, load_id and final_rate are required'
      });
    }
  
    const result = await service.exec({
      callId: raw.callId,
      toNumber: raw.toNumber,
      load_id: raw.load_id,
      final_rate, // ya como number
      carrier_mc: raw.carrier_mc,
      carrier_name: raw.carrier_name,
      notes: raw.notes
    });
  
    if (!result.success) {
      return res.status(502).json(result);
    }
  
    return res.json(result);
  }