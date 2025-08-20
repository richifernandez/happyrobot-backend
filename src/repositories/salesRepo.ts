import { TransferCall, TransferResult } from '../domain/models';

export interface SalesRepo {
  transfer(call: TransferCall): Promise<TransferResult>;
}

export class SalesRepoMock implements SalesRepo {
  async transfer(call: TransferCall): Promise<TransferResult> {
    // Mock: valida lo mínimo y “simula” puenteado
    if (!call.toNumber.startsWith('+') && !/^\d{6,}$/.test(call.toNumber)) {
      return { success: false, transfer_id: 'invalid-number', connected: false };
    }
    // Genera un id pseudo-único
    const id = `tr_${Math.random().toString(36).slice(2, 10)}`;
    return { success: true, transfer_id: id, connected: true };
  }
}