import { NegotiationDecision } from '../domain/models';

/**
 * Regla simple:
 * - Cap del broker: +10% sobre el publicado.
 * - Acepta si oferta ≤ cap.
 * - Si oferta > cap → contraoferta bajando $50, acotada a [publicado, cap].
 * - Límite de 3 rondas → reject.
 */
export class NegotiateService {
  evaluate(published_rate: number, carrier_offer: number, round: number): NegotiationDecision {
    if (!Number.isFinite(published_rate) || published_rate <= 0) {
      return { decision: 'reject', reason: 'invalid_published_rate', round: round ?? 0 };
    }
    if (!Number.isFinite(carrier_offer) || carrier_offer <= 0) {
      return { decision: 'reject', reason: 'invalid_carrier_offer', round: round ?? 0 };
    }
    if (!Number.isFinite(round) || round < 1) round = 1;
    if (round > 3) return { decision: 'reject', reason: 'round_limit', round };

    const cap = Math.round(published_rate * 1.10 * 100) / 100;

    if (carrier_offer <= cap) {
      return { decision: 'accept', final_rate: carrier_offer, round };
    }

    const step = 50; // baja $50 por contra
    const proposed = Math.min(Math.max(carrier_offer - step, published_rate), cap);

    // Si en ronda 3 sigue sin caber, rechaza
    if (round === 3 && proposed > cap) {
      return { decision: 'reject', reason: 'over_cap_after_round3', round };
    }

    return { decision: 'counter', counter_rate: proposed, round };
  }
}

export const negotiateService = new NegotiateService();