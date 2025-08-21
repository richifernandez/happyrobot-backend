// src/repositories/carrierRepository.ts
import { CarrierRecord } from '../domain/models';

const FMC_BASE = 'https://mobile.fmcsa.dot.gov/qc/services/carriers';
const FMC_API_KEY = process.env.FMC_API_KEY; // Solo desde entorno

// Normaliza un MC: acepta "843418" o "MC843418" -> "843418" (solo dígitos)
function normalizeMc(input: string): string | null {
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
    const mc = normalizeMc(mcNumber);
    if (!mc || !FMC_API_KEY) return null;

    const url = `${FMC_BASE}/docket-number/${encodeURIComponent(mc)}?webKey=${encodeURIComponent(FMC_API_KEY)}`;
    const data = await fetchJSON(url);

    // Formatos observados: { content: [ { carrier: {...} } ] } ó { content: [] }
    const row = Array.isArray(data?.content) ? data.content[0] : null;
    const carrier = row?.carrier;
    if (!carrier) return null;

    const allowedToOperate = String(carrier.allowedToOperate || '').toUpperCase(); // 'Y'/'N'
    const statusCode = String(carrier.statusCode || '').toUpperCase();            // 'A','I',...
    const legalName = carrier.legalName ?? '';

    const eligible = allowedToOperate === 'Y' && statusCode === 'A';

    const record: CarrierRecord = {
      mcNumber: mc,                // mantenemos el nombre del campo tal cual lo espera tu handler
      companyName: legalName || '',// si no viene, cadena vacía
      operatingStatus: eligible ? 'ACTIVE' : 'OUT_OF_SERVICE',
    };

    return record;
  }
}