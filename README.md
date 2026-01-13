# 🪄 RitualChain

**Welcome, Initiate.**

RitualChain is a mystical Web3 ecosystem where contributors mint MeeBots, stake MCB tokens, and celebrate every ritual on-chain. This repository bridges the gap between the ethereal (frontend) and the immutable (blockchain).

---

## 🧱 Contracts

| Contract        | Path | Purpose |
|-----------------|------|---------|
| **MeeToken (MCB)**  | `contracts/MeeToken.sol` | The native ERC20 token for staking & rewards. |
| **MeeBotNFT**       | `contracts/MeeBotNFT.sol` | Mint MeeBot NFTs with custom prompt metadata. |
| **MeeBotStaking**   | `contracts/MeeBotStaking.sol` | Stake MCB to earn rewards/energy. |

---

## 🚀 Deployment Ritual

### 1. Summon Dependencies
```bash
npm install
```

### 2. Compile Spells
```bash
npx hardhat compile
```

### 3. Deploy to the Realm (Localhost)
Start your local node:
```bash
npx hardhat node
```

In a new terminal, deploy the contracts:
```bash
npx hardhat run scripts/deploy.ts --network localhost
```
*The spirits will automatically update `.env` or `src/constants/addresses.ts`.*

---

## 🔍 Verification

To reveal your contracts on the explorer (Etherscan/RitualScan):
```bash
npx hardhat run scripts/verify.ts --network localhost
```

---

## 🌐 Frontend & The Altar

The frontend is located in `src/`, powered by **React**, **Wagmi**, and **RainbowKit**.

### Setup
```bash
npm run dev
```

### 🔮 Features
- **Network Switcher**: Automatically detects if you stray from RitualChain and offers a portal back.
- **Genesis Ritual**: Upload an image to **IPFS (via Pinata)**, generate metadata, and mint a MeeBot NFT.
- **Staking Altar**: Stake MCB tokens to earn passive yield.
- **Event Oracle**: Real-time log feed of all chain activities.
- **Celebration Engine**: Confetti and Sound Effects for every on-chain interaction.

---

## 🔊 Sound Effects Integration

- **Minting**: Plays a magical chime (`playMint`).
- **Staking**: Plays an energy charging sound (`playStake`).
- **Claiming**: Plays a retro coin collection sound (`playClaim`).

---

## 🖼️ IPFS Metadata Flow

1. **User** selects an image and enters a prompt.
2. **Frontend** uploads image to Pinata Gateway.
3. **Frontend** constructs JSON metadata with the image hash.
4. **Frontend** uploads JSON to Pinata.
5. **Smart Contract** mints NFT with the IPFS Token URI.

---

## 🧙‍♂️ Contributor Guide

1. **Minting**: 
   - Go to **Genesis Ritual**.
   - Enter a theme (e.g., "Neon Paladin").
   - (Optional) Upload a visual representation.
   - Confirm TX -> Watch the confetti & Hear the chime.

2. **Staking**: 
   - Go to **Staking Altar**.
   - Approve MCB tokens for use.
   - Stake an amount -> Watch your balance grow.

3. **Claiming**: 
   - Harvest your rewards when the energy is high.

---

*Crafted with 🪄, ⚡, and 🎉 for the RitualChain community.*