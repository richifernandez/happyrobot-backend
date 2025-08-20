import { CarrierRepository } from '../repositories/carrierRepository';
import { CarrierRecord } from '../domain/models';

export class CarrierService {
  constructor(private repo: CarrierRepository) {}

  async verifyCarrier(mcNumber: string): Promise<CarrierRecord | null> {
    const carrier = await this.repo.findByMcNumber(mcNumber);
    return carrier ?? null;
  }
}