# 🛡️ NetShield — Network Security Monitoring Platform

A real-time network security monitoring platform with IDS/IPS capabilities, traffic analysis, and threat detection.

## Quick Start

```bash
docker compose up -d
```

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## Features

- **Real-time IDS Alerts** — WebSocket-powered live feed of intrusion detection alerts
- **Port Scan Detection** — Detects multiple port scans from a single source IP
- **DDoS Detection** — Identifies high-volume traffic anomalies
- **Brute Force Detection** — Flags rapid connection attempts on sensitive ports (SSH, RDP, FTP)
- **ARP Spoofing Detection** — Alerts on suspicious ARP activity
- **DNS Tunneling Detection** — Detects large DNS payloads indicative of data exfiltration
- **Traffic Analysis** — Real-time traffic feed with protocol distribution charts
- **Threat Scoring** — Automated risk scoring (0–100) for each detected event
- **IoC Extraction** — Extracts IPs, protocols, and alert types as indicators of compromise
- **Incident Reporting** — Generates summary reports of all detected threats

## Tech Stack

| Layer    | Technology            |
| -------- | --------------------- |
| Backend  | FastAPI, SQLAlchemy   |
| Database | PostgreSQL            |
| Frontend | React, TypeScript     |
| Charts   | Recharts              |
| State    | Zustand               |
| Styling  | CSS-in-JS             |
| Auth     | JWT (python-jose)     |
| Proxy    | Nginx                 |
| Deploy   | Docker / Docker Compose |

## API Endpoints

### Auth
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and receive JWT token

### Alerts
- `POST /api/alerts/` — Create a new alert
- `GET /api/alerts/` — List all alerts
- `GET /api/alerts/stats` — Get alert statistics
- `PATCH /api/alerts/{id}/status` — Update alert status

### Traffic
- `GET /api/traffic/` — List traffic flows
- `GET /api/traffic/stats` — Get traffic statistics

### WebSocket
- `WS /ws` — Real-time alert and traffic event feed

### Health
- `GET /api/health` — API health check

## Architecture

```
                    ┌─────────────┐
                    │  Frontend   │
                    │  :3000      │
                    └──────┬──────┘
                           │ HTTP / WS
                    ┌──────▼──────┐
                    │   Backend   │
                    │  :8000      │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  PostgreSQL │
                    │  :5432      │
                    └─────────────┘
```

### IDS Engine Detection Rules

| Alert Type     | Trigger Condition                                         |
| -------------- | --------------------------------------------------------- |
| `port_scan`    | ≥5 unique ports scanned from same source to same target   |
| `ddos`         | Single packet with >100,000 bytes                         |
| `brute_force`  | ≥3 rapid connections (duration <0.5s) on ports 22/3389/21 |
| `arp_spoofing` | Any ARP protocol traffic                                  |
| `dns_tunnel`   | DNS packet with >500 bytes payload                        |

## Demo Credentials

Register a new account at http://localhost:3000/register or use:

- **Username**: `admin`
- **Password**: `admin123`

*These credentials are created on first registration.*

## Development

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

## License

MIT
