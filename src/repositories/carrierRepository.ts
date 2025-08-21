import { CarrierRecord } from '../domain/models';

const FMC_BASE = 'https://mobile.fmcsa.dot.gov/qc/services/carriers';
const FMC_API_KEY = process.env.FMC_API_KEY; 

function normalizeDot(input: string): string | null {
  if (!input) return null;
  const cleaned = input.toUpperCase().trim().replace(/^MC/, '');
  return /^\d+$/.test(cleaned) ? cleaned : null;
}

async function fetchJSON(url: string) {
  const r = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!r.ok) return null;
  try { return await r.json(); } catch { return null; }
}

export class CarrierRepository {
  async findByMcNumber(mcNumber: string): Promise<CarrierRecord | null> {
    const dot = normalizeDot(mcNumber);
    if (!dot || !FMC_API_KEY) return null; // sin key no hay request

    const url = `${FMC_BASE}/${encodeURIComponent(dot)}/authority?webKey=${encodeURIComponent(FMC_API_KEY)}`;
    const data = await fetchJSON(url);

    const authority = Array.isArray(data?.content)
      ? data.content[0]?.carrierAuthority
      : data?.content?.carrierAuthority ?? null;

    if (!authority) return null;

    const authorizedForProperty =
      String(authority.authorizedForProperty || '').toUpperCase() === 'Y';
    const commonActive =
      String(authority.commonAuthorityStatus || '').toUpperCase() === 'A';
    const contractActive =
      String(authority.contractAuthorityStatus || '').toUpperCase() === 'A';

    const isActive = authorizedForProperty && (commonActive || contractActive);

    return {
      mcNumber: dot,
      companyName: '',
      operatingStatus: isActive ? 'ACTIVE' : 'OUT_OF_SERVICE',
    };
  }
}