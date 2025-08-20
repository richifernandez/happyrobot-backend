import { FinalEvent } from '../domain/models';
import { EventsRepository } from '../repositories/eventsRepository';

export class LogFinalEventService {
  constructor(private repo: EventsRepository) {}

  async exec(e: FinalEvent): Promise<void> {
    if (!e.callId) throw new Error('callId required');
    if (!e.timestamp) throw new Error('timestamp required');
    if (e.step !== 'final') throw new Error('step must be "final"');
    if (!e.outcome) throw new Error('outcome required');

    await this.repo.saveFinal(e);
  }
}