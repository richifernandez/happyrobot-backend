import { CarrierRecord } from '../domain/models';

const carriers: CarrierRecord[] = [
  { mcNumber: '123456', companyName: 'Acme Logistics', operatingStatus: 'ACTIVE' },
  { mcNumber: '654321', companyName: 'Bad Carrier Inc.', operatingStatus: 'OUT_OF_SERVICE' },
];

export class CarrierRepository {
  async findByMcNumber(mcNumber: string): Promise<CarrierRecord | null> {
    const carrier = carriers.find(c => c.mcNumber === mcNumber);
    return carrier ?? null;
  }
}