# RitualChain - MeeBot

## Overview

RitualChain is a Web3 ecosystem built around NFT minting, token staking, and blockchain-based "rituals." The application provides a mystical-themed interface for users to mint MeeBot NFTs, stake MCB tokens for rewards, and participate in a simulated crypto mining experience. The project combines a React frontend with Solidity smart contracts deployable via Hardhat.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 19 with TypeScript, bundled using Vite
- **Routing**: React Router DOM with HashRouter for client-side navigation
- **State Management**: React Context API for global state (Celebration, Translation contexts) plus TanStack Query for async data
- **Styling**: Tailwind CSS loaded via CDN with custom theme colors (meebot-* palette)
- **Internationalization**: Custom translation provider supporting English and Thai

### Web3 Integration
- **Mock Mode**: The app includes a complete mock Web3 layer (`src/services/mockWeb3.ts`) that simulates wallet connections, contract reads/writes, and chain switching without requiring a real wallet
- **Production Ready**: Configured for RainbowKit + Wagmi + viem for real wallet connectivity
- **Contract ABIs**: Stored as both JSON and TypeScript files in `src/abi/`
- **Address Management**: Contract addresses in `src/constants/addresses.ts` with environment variable fallbacks

### Smart Contracts
- **MeeToken (MCB)**: ERC20 token for staking and rewards
- **MeeBotNFT**: ERC721 NFT contract with custom `mintMeeBot(prompt)` function
- **MeeBotStaking**: Staking contract that accepts MCB tokens and distributes rewards
- **Tooling**: Hardhat 2.19 with TypeScript for compilation, deployment, and verification

### Key Design Patterns
- **Celebration System**: Global context that triggers confetti animations and toast notifications on successful transactions
- **Translation System**: Context-based i18n with language switching between English and Thai
- **Debug Overlay**: Development tool component for inspecting chain state, addresses, and events

### Page Structure
- `/mining` - Simulated crypto mining interface (default landing page)
- `/dashboard` - Network statistics and user's MeeBot collection
- `/genesis` - NFT minting with IPFS image upload
- `/staking` - Token staking, unstaking, and reward claiming
- `/gallery` - Browse all minted MeeBots
- `/events` - Real-time contract event log viewer

## External Dependencies

### Blockchain Infrastructure
- **Networks**: Local Hardhat node (port 9545), Sepolia testnet, custom RitualChain (chainId 1337)
- **RPC Configuration**: Set via `VITE_RPC_URL` environment variable

### IPFS Storage
- **Provider**: Pinata Cloud for NFT metadata and image storage
- **Gateway**: `tan-familiar-impala-721.mypinata.cloud`
- **Configuration**: Requires `VITE_PINATA_JWT` or `VITE_PINATA_API_KEY` + `VITE_PINATA_API_SECRET`

### Wallet Connection
- **RainbowKit**: Wallet modal and connection UI
- **WalletConnect**: Requires `WALLETCONNECT_PROJECT_ID` for production use

### Contract Verification
- **Etherscan**: API key via `ETHERSCANAPIKEY` for contract verification

### Environment Variables
```
VITE_RPC_URL - Blockchain RPC endpoint
VITE_NFT_CONTRACT_ADDRESS - Deployed MeeBotNFT address
VITE_STAKING_CONTRACT_ADDRESS - Deployed MeeBotStaking address
VITE_TOKEN_CONTRACT_ADDRESS - Deployed MeeToken address
VITE_PINATA_JWT - Pinata authentication (preferred)
VITE_PINATA_API_KEY - Pinata API key (alternative)
VITE_PINATA_API_SECRET - Pinata API secret (alternative)
WALLETCONNECT_PROJECT_ID - WalletConnect Cloud project ID
PRIVATE_KEY - Deployer wallet private key (for Hardhat)
```