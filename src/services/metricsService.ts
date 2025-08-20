import { FinalEvent, Outcome } from '../domain/models';

export interface Metrics {
  calls_total: number;
  booking_rate: number; // 0..100
  by_outcome: Record<Outcome | 'UNKNOWN', number>;
  avg_rounds: number;
  last_calls: Array<{
    callId: string;
    outcome: Outcome;
    final_rate?: number;
    load_id?: string;
    ts: string;
    mcNumber?: string;
    sentiment?: string;
  }>;
}

export class MetricsService {
  compute(finals: FinalEvent[]): Metrics {
    const total = finals.length;

    const by_outcome: Record<Outcome | 'UNKNOWN', number> = {
      BOOKED: 0, NO_AGREEMENT: 0, NOT_ELIGIBLE: 0, NO_LOADS: 0, UNKNOWN: 0
    };

    let booked = 0, roundsSum = 0, roundsCount = 0;

    for (const e of finals) {
      const k = (e.outcome ?? 'UNKNOWN') as Outcome | 'UNKNOWN';
      by_outcome[k] = (by_outcome[k] ?? 0) + 1;
      if (e.outcome === 'BOOKED') booked++;
      const r = e.negotiation?.rounds;
      if (typeof r === 'number' && r >= 0) { roundsSum += r; roundsCount++; }
    }

    const booking_rate = total ? Math.round((booked / total) * 1000) / 10 : 0;
    const avg_rounds = roundsCount ? Math.round((roundsSum / roundsCount) * 10) / 10 : 0;

    const last_calls = finals.slice(-20).map(e => ({
      callId: e.callId,
      outcome: e.outcome,
      final_rate: e.selected_load?.final_rate,
      load_id: e.selected_load?.load_id,
      ts: e.timestamp,
      mcNumber: e.mcNumber,
      sentiment: e.sentiment
    })).reverse();

    return { calls_total: total, booking_rate, by_outcome, avg_rounds, last_calls };
  }
}