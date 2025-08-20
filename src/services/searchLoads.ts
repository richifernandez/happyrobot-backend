import { LoadsRepository } from '../repositories/loadsRepository';
import { Load, LoadSearch } from '../domain/models';

export class SearchLoadsService {
  constructor(private repo: LoadsRepository) {}

  async exec(q: LoadSearch): Promise<Load[]> {
    if (!q.origin && !q.destination && !q.pickup_date_from && !q.pickup_date_to && !q.equipment_type) {
      throw new Error('Provide at least one search criterion');
    }
    return this.repo.search(q);
  }
}