import { Request, Response } from 'express';
import { CarrierService } from '../services/carrierService';
import { CarrierRepository } from '../repositories/carrierRepository';

// wiring local del handler (simple para este endpoint)
const carrierService = new CarrierService(new CarrierRepository());

export async function verifyCarrierHandler(req: Request, res: Response) {
  const { mcNumber } = req.body;

  if (!mcNumber || typeof mcNumber !== 'string') {
    return res.status(400).json({ error: 'mcNumber is required (string)' });
  }

  // El handler convierte el input en lo que la service entiende (string mcNumber)
  const record = await carrierService.verifyCarrier(mcNumber);

  if (!record) {
    return res.status(404).json({ error: 'Carrier not found' });
  }

  // Respuesta API (simple). Elegibilidad derivada del modelo de dominio.
  const eligible = record.operatingStatus === 'ACTIVE';

  return res.json({
    mcNumber: record.mcNumber,
    companyName: record.companyName,
    eligible
  });
}