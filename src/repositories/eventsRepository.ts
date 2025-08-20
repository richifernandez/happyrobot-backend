import { FinalEvent } from '../domain/models';
import eventsSeed from '../data/events.sample.json'; 

export class EventsRepository {
  private finalEvents: FinalEvent[] = (eventsSeed as FinalEvent[]) ?? [];

  async saveFinal(e: FinalEvent): Promise<void> {
    const idx = this.finalEvents.findIndex(x => x.callId === e.callId);
    if (idx >= 0) this.finalEvents[idx] = e;
    else this.finalEvents.push(e);
  }

  async listFinal(): Promise<FinalEvent[]> {
    return [...this.finalEvents];
  }
}