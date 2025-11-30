# NexGuard v3.0: Decentralized Risk Analysis Terminal

**NexGuard v3.0** brings full Web3 capabilities to the risk analysis platform, enabling users to connect their Cardano wallets and interact directly with the blockchain-simulated backend.

## 🚀 New Features in v3.0

### 🔗 Cardano Wallet Integration
- **Multi-Wallet Support:** Seamlessly connect **Nami**, **Eternl**, and **Mesh** wallets.
- **Identity Layer:** User actions (Voting, Reporting, Minting) are now signed with your connected wallet address.
- **Visual Feedback:** Real-time wallet status and address display in the global header.

### 🛠️ Enhanced Terminal Functionality
- **Live Voting System:** "LEGIT" and "SCAM" votes are now fully operational and recorded in the backend.
- **Whistleblower Reporting:** Submit anomaly reports directly signed by your identity.
- **Token Minting:** Initialize new token sequences (Minting) with a single click.
- **Risk Analysis:** "Analyze Risk" button now triggers the Masumi AI analysis engine.

### ⚡ Technical Upgrades
- **Robust API Layer:** Refactored `api.ts` to handle dynamic payloads and wallet injection.
- **Global State Management:** New `WalletContext` ensures wallet persistence across the application.
- **Bug Fixes:** Resolved payload mismatches and UI state inconsistencies.

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/nexguard.git

# Install dependencies
npm install

# Start the development suite (Frontend + Backend + DB)
npm run dev
```

---
*Built for the Cardano Community.*
