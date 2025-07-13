
# 🏟️ FanPass App

A visually stunning, Sport-themed NFT passport and quest application built with React, Ethers.js, and Tailwind CSS. Collect digital stamps by completing quests, mint exclusive NFTs, and access a themed store—all in a modern, immersive interface.


## ✨ Features

- **NFT Passport**: Collect digital stamps for your virtual passport by completing themed quests.
- **Smooth Navigation**: Scrollable, animated passport pages with modern UI transitions.
- **Quest System**: Complete sport-inspired challenges to earn unique NFT rewards.
- **Store**: Spend your fan tokens on limited edition NFTs and digital collectibles.
- **Web3 Integration**: Connect your wallet and mint NFTs directly from the app.
- **Web3 Visual Theme**: Neon pink/red gradients, glassmorphism, and animated backgrounds for a premium fan experience.
- **English UI**: All texts and instructions are in English for global accessibility.



## 🛠️ Tech Stack

- **Frontend**: React (TypeScript), Tailwind CSS, custom CSS
- **Blockchain**: Solidity (smart contracts), Ethers.js (interaction), Hardhat (development & testing)
- **Wallet**: MetaMask (Web3 wallet integration)
- **UI/UX**: Lucide-react icons, Orbitron font, glassmorphism, gradients, and particle backgrounds


## 🚀 Getting Started


### 📦 Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MetaMask or compatible Web3 wallet


### 🏗️ Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Callacos/fan-pass.git
   cd fan-pass
   ```

2. **Install dependencies:**

```bash
cd fan-pass/fanpass
npm install
# or
yarn install
```

3. **Start the development server:**

```bash
npm run dev
# or
yarn dev
```

4. **Open the app: Visit**

`http://localhost:5173` in your browser.



### 🗂️ Project Structure

```
Chilini/
  bronze.json
  carte_postale.json
  compulsive_buyer.json
  first_match.json
  tenth_match.json
  welcome.json
  Chilini/
    challengesFront.tsx
    README.md
    chiliz/
      package.json
      src/
        walletConnector/
          Web3Manager.js
  project-bolt-sb1-d3qecx2c/
    project/
      eslint.config.js
      index.html
      package.json
      postcss.config.js
      tailwind.config.js
      tsconfig.app.json
      tsconfig.json
      tsconfig.node.json
      vite.config.ts
      public/
        block-stamp.svg
        block.png
        pims.png
        psg.png
        quests.json
        stamps/
          france.png
      src/
        App_backup.tsx
        App.tsx
        index.css
        index.css.backup
        main.tsx
        vite-env.d.ts
        components/
          background.tsx
          challenges.tsx
          PassportCover.tsx
          PassportNavigation.tsx
          PassportPage.tsx
          PassportVachette.tsx
          PhotoUpload.tsx
          QuestList.tsx
          ShinyText.css
          ShinyText.tsx
          StampPopup.tsx
        hooks/
          usePassportAnimation.ts
          useQuests.ts
          useWeb3.ts
        image/
          meta.png
          passe.png
          pims.png
          psg.png
          vachette.png
  chiliz-passport-contract/
    hardhat.config.js
    package.json
    README.md
    artifacts/
    cache/
    contracts/
      PsgPassportNFT.sol
    scripts/
      deploy.js
      mint-nft.js
    test/
      PsgPassportNFT.js
  front-end/
    index.html
```


### 🎨 Customization

- **Theme**: Easily adjust colors and gradients in Tailwind config or component classes.
- **Quests & Stamps**: Add or edit quests in the relevant JSON/config files.
- **Store Items**: Update store inventory in the store component or backend.


## 👥 Authors

- **Callacos** ([GitHub](https://github.com/Callacos))
- **savvyh** ([GitHub](https://github.com/savvyh))
- **rmarcais** ([GitHub](https://github.com/rmarcais))

## 🖼️ Credits
- Icons: [Lucide](https://lucide.dev/)
- Font: [Orbitron](https://fonts.google.com/specimen/Orbitron)
- Inspired by Chiliz and the global fan community.

