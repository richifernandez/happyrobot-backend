export interface CarrierRecord {
    mcNumber: string;
    companyName?: string;
    operatingStatus: 'ACTIVE' | 'INACTIVE' | 'OUT_OF_SERVICE';
  }

export type EquipmentType = 'dry_van' | 'reefer' | 'flatbed';

export interface Load {
  load_id: string;
  origin: string;
  destination: string;
  pickup_datetime: string;      // ISO
  delivery_datetime: string;    // ISO
  equipment_type: EquipmentType;
  loadboard_rate: number;       // USD (no céntimos)
  miles?: number;
  notes?: string;
  weight?: number;
  commodity_type?: string;
  num_of_pieces?: number;
  dimensions?: string;
}

export interface LoadSearch {
    origin?: string;
    destination?: string;
    pickup_date_from?: string;    // ISO
    pickup_date_to?: string;      // ISO
    equipment_type?: EquipmentType;
    limit?: number;               // default 3
  }


export type NegotiationDecision =
  | { decision: 'accept';  final_rate: number;   round: number }
  | { decision: 'counter'; counter_rate: number; round: number }
  | { decision: 'reject';  reason: string;       round: number };


  export interface TransferCall {
    callId: string;
    toNumber: string;        // teléfono del sales rep
    load_id: string;
    final_rate: number;      // USD
    carrier_mc?: string;
    carrier_name?: string;
    notes?: string;
  }
  
  export interface TransferResult {
    success: boolean;
    transfer_id: string;     // id simulado del puente
    connected: boolean;      // mock: true si “conectó”
  }


  export type Outcome = 'BOOKED' | 'NO_AGREEMENT' | 'NOT_ELIGIBLE' | 'NO_LOADS';
export type Sentiment = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';

export interface FinalEvent {
  callId: string;
  timestamp: string; // ISO
  mcNumber: string;
  step: 'final';
  outcome: Outcome;
  sentiment?: Sentiment;
  selected_load?: {
    load_id: string;
    final_rate?: number;          // USD
    pickup_datetime?: string;     // ISO
    delivery_datetime?: string;   // ISO
  };
  negotiation?: { rounds?: number };
  transcript?: string;
}