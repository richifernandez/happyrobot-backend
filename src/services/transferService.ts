import { SalesRepo } from '../repositories/salesRepo';
import { TransferCall, TransferResult } from '../domain/models';

export class TransferService {
  constructor(private repo: SalesRepo) {}

  async exec(payload: TransferCall): Promise<TransferResult> {
    if (payload.final_rate <= 0) {
      return { success: false, transfer_id: 'bad-rate', connected: false };
    }
    return this.repo.transfer(payload);
  }
}