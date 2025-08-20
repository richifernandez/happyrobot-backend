import { CarrierRecord } from '../domain/models';

// Mock sencillo; amplíalo o sustitúyelo por una llamada real cuando quieras
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