require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // Pour charger les variables d'environnement

// Assurez-vous d'avoir une variable d'environnement PRIVATE_KEY dans un fichier .env
// N'utilisez JAMAIS votre vraie clé privée sur un testnet ou en production !
// Créez un fichier .env dans le dossier racine de votre projet avec PRIVATE_KEY="VOTRE_CLE_PRIVEE_ICI"
const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
  solidity: "0.8.20", // La version de Solidity de votre contrat
  networks: {
    // Configuration du Hardhat Network pour les tests locaux (par défaut)
    hardhat: {
      chainId: 31337, // ID de chaîne par défaut pour Hardhat Network
    },
    // Configuration pour le Chiliz Chain Spice Testnet
    spice: {
      url: "https://spicy-rpc.chiliz.com/", // URL RPC du Spice Testnet
      accounts: [`0x${PRIVATE_KEY}`], // Votre clé privée pour signer les transactions
      chainId: 88882, // ID de chaîne du Spice Testnet
    },
  },
  etherscan: {
    // Pour vérifier et publier votre contrat sur l'explorateur (optionnel mais utile)
    apiKey: {
      spice: process.env.CHILIZ_SCAN_API_KEY, // Clé API pour ChilizScan (si vous voulez la vérification)
    },
    customChains: [
      {
        network: "spice",
        chainId: 88882,
        urls: {
          api: "https://api.routescan.io/v2/network/88882/evm", // API de vérification pour Chiliz Scan
          browser: "https://testnet.explorer.chiliz.com", // URL de l'explorateur
        },
      },
    ],
  },
  // Configuration du chemin des dossiers (optionnel, si vous avez des besoins spécifiques)
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};