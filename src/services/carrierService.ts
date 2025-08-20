import { CarrierRepository } from '../repositories/carrierRepository';
import { CarrierRecord } from '../domain/models';

export class CarrierService {
  constructor(private repo: CarrierRepository) {}

  /**
   * Lógica de dominio: devuelve el registro y de ahí podrás inferir elegibilidad en el handler
   * (o aquí, si lo prefieres). El service solo entiende modelos de dominio.
   */
  async verifyCarrier(mcNumber: string): Promise<CarrierRecord | null> {
    const carrier = await this.repo.findByMcNumber(mcNumber);
    return carrier ?? null;
  }
}