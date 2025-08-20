import { FinalEvent } from '../domain/models';
import eventsSeed from '../data/events.sample.json'; // requiere resolveJsonModule: true

export class EventsRepository {
  // 1) Sembramos con el JSON estático
  private finalEvents: FinalEvent[] = (eventsSeed as FinalEvent[]) ?? [];

  async saveFinal(e: FinalEvent): Promise<void> {
    // idempotencia por callId
    const idx = this.finalEvents.findIndex(x => x.callId === e.callId);
    if (idx >= 0) this.finalEvents[idx] = e;
    else this.finalEvents.push(e);
  }

  async listFinal(): Promise<FinalEvent[]> {
    // devolvemos copia para evitar mutaciones externas
    return [...this.finalEvents];
  }
}