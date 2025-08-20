import { Request, Response } from 'express';
import { LoadsRepository } from '../repositories/loadsRepository';
import { SearchLoadsService } from '../services/searchLoads';

const service = new SearchLoadsService(new LoadsRepository());

export async function searchLoadsHandler(req: Request, res: Response) {
  const body = (req.body ?? {}) as {
    origin?: string;
    destination?: string;
    pickup_date_from?: string;
    pickup_date_to?: string;
    equipment_type?: 'dry_van' | 'reefer' | 'flatbed';
    limit?: number;
  };

  try {
    const loads = await service.exec({
      origin: body.origin,
      destination: body.destination,
      pickup_date_from: body.pickup_date_from,
      pickup_date_to: body.pickup_date_to,
      equipment_type: body.equipment_type,
      limit: body.limit ?? 3
    });
    return res.json({ loads });
  } catch (e: any) {
    return res.status(400).json({ error: e?.message || 'bad_request' });
  }
}