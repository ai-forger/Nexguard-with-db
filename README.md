# NEXGUARD1 - Advanced Token Simulation & Verification

NexGuard is a comprehensive DApp designed to protect users from DeFi scams through AI-driven risk analysis, community reporting, and simulated trading environments.

## 🚀 Features

- **Token Simulation**: Mint simulated tokens with realistic metadata and trust scores.
- **AI Risk Analysis**: "Masumi Copilot" (powered by Gemini) explains risks and analyzes tokens.
- **Whistleblower System**: Community reporting with simulated ZK-proof verification.
- **Trading Simulator**: Practice buying/selling tokens in a safe, simulated DEX environment.
- **Meme Passport**: Generate a unique crypto identity using AI.
- **Live Feed**: Real-time explorer showing token launches, trust scores, and community votes.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, TailwindCSS (v4), Lucide Icons.
- **Backend**: Node.js, Express, SQLite (Audit Logs).
- **AI**: Google Gemini API.
- **Blockchain Data**: Blockfrost API (Cardano), Yaci Store (Devnet).

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- Docker (optional, for containerized run)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd Nexguards
   ```

2. **Install Dependencies**
   ```bash
   npm install
   cd packages/backend && npm install
   cd ../frontend && npm install
   ```

3. **Environment Setup**
   Create a `.env` file in `packages/backend/` based on `.env.example`:
   ```env
   GEMINI_API_KEY=your_gemini_key
   BLOCKFROST_API_KEY=your_blockfrost_key
   YACI_STORE_URL=http://localhost:8080/api/v1
   ```

4. **Run the App**
   From the root directory:
   ```bash
   npm run dev
   ```
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:5000`

### Docker Setup

1. **Build and Run**
   ```bash
   docker-compose up --build
   ```

## 🧪 Testing
# NEXGUARD1 - Advanced Token Simulation & Verification

NexGuard is a comprehensive DApp designed to protect users from DeFi scams through AI-driven risk analysis, community reporting, and simulated trading environments.

## 🚀 Features

- **Token Simulation**: Mint simulated tokens with realistic metadata and trust scores.
- **AI Risk Analysis**: "Masumi Copilot" (powered by Gemini) explains risks and analyzes tokens.
- **Whistleblower System**: Community reporting with simulated ZK-proof verification.
- **Trading Simulator**: Practice buying/selling tokens in a safe, simulated DEX environment.
- **Meme Passport**: Generate a unique crypto identity using AI.
- **Live Feed**: Real-time explorer showing token launches, trust scores, and community votes.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, TailwindCSS (v4), Lucide Icons.
- **Backend**: Node.js, Express, SQLite (Audit Logs).
- **AI**: Google Gemini API.
- **Blockchain Data**: Blockfrost API (Cardano), Yaci Store (Devnet).

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- Docker (optional, for containerized run)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd Nexguards
   ```

2. **Install Dependencies**
   ```bash
   npm install
   cd packages/backend && npm install
   cd ../frontend && npm install
   ```

3. **Environment Setup**
   Create a `.env` file in `packages/backend/` based on `.env.example`:
   ```env
   GEMINI_API_KEY=your_gemini_key
   BLOCKFROST_API_KEY=your_blockfrost_key
   YACI_STORE_URL=http://localhost:8080/api/v1
   ```

4. **Run the App**
   From the root directory:
   ```bash
   npm run dev
   ```
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:5000`

### Docker Setup

1. **Build and Run**
   ```bash
   docker-compose up --build
   ```

## 🧪 Testing

Run the endpoint verification script:
```bash
node test_endpoints.js
```

## Cardano Contract Addresses (Preprod)

- **Risk Registry Script Hash**: `<from plutus.json>`
- **Script Address**: `addr_test1wp...`
- **Sample Test Token**: `<policy_id_of_test_token>`

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/coins` | GET | List all monitored tokens |
| `/risk/:policyId/ask-masumi` | POST | Get AI risk analysis |
| `/risk/:policyId/publish` | POST | Publish risk to chain |
| `/risk/:policyId/onchain` | GET | Check on-chain status |
| `/whistle` | POST | Submit anonymous report |
| `/vote` | POST | Vote on token |
| `/audit/:tokenId` | GET | Get audit logs |

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- Cardano wallet (Eternl/Nami)

### Run Locally

#### 1. Start Agent
```bash
cd crewai-masumi-quickstart-template-main
# If dependencies installed:
python main.py api
# OR use fallback:
python simple_agent.py
```

#### 2. Start Backend
```bash
cd packages/backend
npm run dev
```

#### 3. Start Frontend
```bash
cd packages/frontend
npm run dev
```

#### 4. Open App
Go to `http://localhost:5173`

## ⚠️ Notes
- This is a **simulation** environment for hackathon demonstration purposes.
- "Trading" does not use real funds.
- "ZK Proofs" are simulated for the whistleblower flow.
