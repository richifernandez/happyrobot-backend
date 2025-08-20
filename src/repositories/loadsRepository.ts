import { Load, LoadSearch } from '../domain/models';
import loadsData from '../data/loads.sample.json'

function includesCI(haystack: string, needle?: string) {
  return !needle || haystack.toLowerCase().includes(needle.toLowerCase());
}

export class LoadsRepository {
  private loads: Load[] = loadsData as Load[];

  async search(q: LoadSearch): Promise<Load[]> {
    const from = q.pickup_date_from ? +new Date(q.pickup_date_from) : -Infinity;
    const to   = q.pickup_date_to   ? +new Date(q.pickup_date_to)   : +Infinity;

    let res = this.loads
      .filter(l => !q.equipment_type || l.equipment_type === q.equipment_type)
      .filter(l => includesCI(l.origin, q.origin))
      .filter(l => includesCI(l.destination, q.destination))
      .filter(l => {
        const t = +new Date(l.pickup_datetime);
        return t >= from && t <= to;
      })
      .sort((a, b) => +new Date(a.pickup_datetime) - +new Date(b.pickup_datetime));

    return res.slice(0, q.limit ?? 3);
  }
}