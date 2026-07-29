# GlazeWallet

**Your favorite desktop wallet.** A native macOS crypto wallet that lets you manage, trade, and view your crypto without the friction of browser extensions. Execute transactions instantly using just your `@username`.

## What We're Building

GlazeWallet is a non-custodial crypto wallet built as a native desktop application — not a browser extension, not a web app. Users install the app, claim a `@username`, set a passcode or Touch ID, and get a fully functional wallet on Base mainnet in under a minute. No seed phrases, no browser extensions, no MetaMask.

### Core Features

- **Username-based identity** — Send crypto to `@username` instead of copying `0x` addresses. A Redis-backed registry maps usernames to wallet addresses.
- **ERC-4337 smart accounts** — Wallets are smart contract accounts via Coinbase Developer Platform (CDP), not plain EOAs. This enables future features like gasless transactions, session keys, and batched operations.
- **Token swaps** — Batched swaps via CDP's trade API with automatic token routing and a protocol fee mechanism.
- **Token transfers** — Send ETH, USDC, or any ERC-20 token to any address or registered username on Base.
- **Live balance tracking** — Real-time ETH and ERC-20 balances with USD valuations, price charts, and 24h change tracking.
- **Transaction history** — Full on-chain transaction history fetched from Blockscout, including token transfers and native transactions.
- **Balance masking** — Hide balances with a single tap for privacy in public spaces.
- **Touch ID / passcode security** — Device-local authentication via secure IPC bridge. Keys never leave the device.

## Why We're Building It

Browser extension wallets (MetaMask, Phantom, Rabby) are the status quo, but they come with friction:

- **Security risks** — Extensions live inside the browser, exposing them to malicious pages, phishing attacks, and extension-store malware.
- **Poor UX** — Users manage seed phrases, deal with extension popups, and navigate clunky interfaces.
- **Fragmentation** — Each chain often needs its own extension or configuration.

GlazeWallet solves this by being a **native desktop app**:

- **Isolated from the browser** — No exposure to web page attacks. The wallet runs as its own process with its own window.
- **No seed phrases** — CDP smart accounts are recovered via username + passcode/Touch ID, not 12-word phrases on paper.
- **Native macOS experience** — Touch ID, native notifications, system keychain integration, and a UI built for desktop, not crammed into a popup.
- **Username-first** — `@username` is the primary identity. Sending to `@druxamb` is as natural as sending a message.

## Base Integration

GlazeWallet runs exclusively on **Base** — Coinbase's Layer 2 rollup on Ethereum:

- **Low fees** — Transactions cost fractions of a cent compared to Ethereum mainnet.
- **Fast confirmation** — Base's block time means transactions confirm in seconds.
- **Growing ecosystem** — Base has a thriving DeFi and token ecosystem with deep liquidity.
- **USDC native** — USDC is natively issued on Base, making it a first-class citizen for payments and transfers.

The app supports ETH, USDC, and any ERC-20 token deployed on Base. Token metadata and pricing are fetched from GeckoTerminal.

## CDP Integration

[Coinbase Developer Platform (CDP)](https://cdp.coinbase.com/) powers the wallet infrastructure:

- **Smart account creation** — Each user gets an ERC-4337 smart account via CDP's `evm.getOrCreateAccount()`. Accounts are namespaced by username and persist across sessions.
- **Token transfers** — The `account.transfer()` API handles ETH, USDC, and arbitrary ERC-20 sends with atomic amount conversion.
- **Token swaps** — CDP's trade API executes swaps with automatic routing. The app batches swaps and sweeps output tokens to the user's smart account.
- **Balance queries** — `cdp.evm.listTokenBalances()` fetches all token balances for a wallet address in a single call.
- **Gas estimation** — The app estimates gas costs for each transaction type before submission, warning users if they lack sufficient ETH for gas.

## Glaze App Store

GlazeWallet is distributed through the **Glaze App Store** — a curated marketplace for native desktop applications. This gives users a trusted, vetted installation path without navigating browser extension stores or downloading random `.dmg` files from the web.

App Store distribution means:

- **Verified installs** — Every update is reviewed before reaching users.
- **Auto-updates** — The app stays current without manual download prompts.
- **Sandboxed execution** — The app runs with appropriate macOS permissions and entitlements.
- **One-click install** — Users install GlazeWallet the same way they install any Mac app.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Next.js (App Router), TypeScript |
| Wallet infra | Coinbase Developer Platform (CDP) SDK |
| Chain | Base (Layer 2) |
| Username registry | Upstash Redis |
| Transaction history | Blockscout API |
| Token pricing | GeckoTerminal API |
| Desktop app | Electron, React, TanStack Router, TanStack Query |
| Styling | Tailwind CSS |
| Font | JetBrains Mono |

## License

All rights reserved. © GlazeWallet.
