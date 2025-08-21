# Inbound Voice Agent API

This project implements an **Inbound Voice Agent** for carrier load booking using the HappyRobot platform.  
The API handles carrier authentication, load search, negotiation, transfer to sales reps, event logging, and exposes KPIs via a metrics dashboard.

---

## 📦 Requirements

- [Node.js](https://nodejs.org/) (v18+ recommended)  
- [npm](https://www.npmjs.com/) (comes with Node.js)

---

## ▶️ Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/inbound-agent.git
   cd inbound-agent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server (development mode)**
   ```bash
   npm run dev
   ```

4. The API will run at:
   ```
   http://localhost:3000
   ```

---

## ⚙️ Environment Variables

Create a `.env` file in the project root with the following variables:

```
PORT=3000
API_KEY=your-secret-key
```

---

## 📡 API Endpoints

### Health Check

```
GET /health
```

Returns a simple 200 OK if the service is running.

### Carrier Verification

```
POST /verify-carrier
Authorization: Bearer <API_KEY>
```

Request body:
```json
{
  "mcNumber": "123456"
}
```

### Search Loads

```
POST /loads/search
Authorization: Bearer <API_KEY>
```

Request body:
```json
{
  "origin": "Dallas",
  "destination": "Atlanta",
  "pickup_date_from": "2025-08-21",
  "pickup_date_to": "2025-08-22",
  "equipment_type": "dry_van",
  "limit": 3
}
```

### Negotiate Rate

```
POST /negotiate
Authorization: Bearer <API_KEY>
```

Request body:
```json
{
  "published_rate": 1500,
  "carrier_offer": 1700,
  "round": 1
}
```

### Transfer to Sales Rep

```
POST /transfer
Authorization: Bearer <API_KEY>
```

Request body:
```json
{
  "callId": "hr-123",
  "toNumber": "+34911222333",
  "load_id": "L001",
  "final_rate": 1650,
  "carrier_mc": "123456",
  "carrier_name": "Acme Logistics",
  "notes": "Accept at 1650 USD"
}
```

### Log Final Event

```
POST /events/log
Authorization: Bearer <API_KEY>
```

Request body:
```json
{
  "callId": "hr-123",
  "timestamp": "2025-08-20T10:05:00Z",
  "mcNumber": "123456",
  "outcome": "BOOKED",
  "sentiment": "POSITIVE",
  "selected_load": {
    "load_id": "L001",
    "final_rate": 1650,
    "pickup_datetime": "2025-08-21T08:00:00Z",
    "delivery_datetime": "2025-08-21T18:00:00Z"
  },
  "negotiation": { "rounds": 2 },
  "transcript": "Carrier agreed on $1650",
  "notes": "Smooth negotiation process",
  "special_requirements": "Liftgate required",
  "contact": {
    "name": "John Smith",
    "email": "john@acmelogistics.com"
  }
}
```

### Metrics

```
GET /metrics
Authorization: Bearer <API_KEY>
```

Returns KPIs and statistics of previous calls and bookings.

### Dashboard (Static)

```
GET /dashboard
```

Serves a static dashboard with real-time KPIs.

---

## 🐳 Run with Docker (Optional)

If you prefer Docker:

```bash
docker build -t inbound-agent .
docker run -p 3000:3000 -e PORT=3000 -e API_KEY=your-secret inbound-agent
```

---

## 📖 Notes

- Carrier verification is mocked due to FMCSA API downtime.
- The transfer step simulates handoff to a sales rep rather than automatic booking.
- Dashboard KPIs can be customized to match client requirements.