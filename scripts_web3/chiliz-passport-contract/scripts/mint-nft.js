const hre = require("hardhat");

async function main() {
  // --- CONFIGURATION À METTRE À JOUR ---
  // REMPLACEZ CETTE ADRESSE par l'adresse réelle de votre contrat PsgPassportNFT déployé sur le Spice Testnet.
  const contractAddress = "0xE8719E6233E2e1F320c6567B9fdbF40c8D61C1BB"; 

  // L'adresse à qui vous voulez minter le NFT (votre adresse MetaMask de test par exemple).
  const recipientAddress = ""; 

  // Le CID IPFS complet de votre fichier JSON de métadonnées pour le NFT à minter.
  // Utilisez un VRAI CID que vous avez uploadé sur Pinata (par exemple, pour votre NFT Bronze).
  const metadataCID = ""; 
  // ------------------------------------

  // Récupérer le signataire (celui qui va payer le gaz et signer la transaction).
  // Ce sera le compte dont la clé privée est dans votre fichier .env.
  const [deployer] = await hre.ethers.getSigners();
  console.log("Using account:", deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "CHZ");

  // Obtenez l'instance de votre contrat déployé.
  const PsgPassportNFT = await hre.ethers.getContractFactory("PsgPassportNFT");
  const psgPassport = PsgPassportNFT.attach(contractAddress); // Se connecte au contrat existant sur la blockchain.

  console.log(`Attempting to mint NFT for ${recipientAddress} with metadata CID ${metadataCID}...`);

  try {
    // Appelez la fonction mintQuestNFT de votre contrat.
    const tx = await psgPassport.mintQuestNFT(recipientAddress, metadataCID);
    await tx.wait(); // Attendez que la transaction soit minée et confirmée sur la blockchain.

    console.log("NFT minted successfully!");
    console.log(`Transaction hash: ${tx.hash}`);

    // Récupérez l'ID du token minté en lisant l'événement `QuestNFTMinted`.
    // Cela nécessite que le contrat ait bien émis l'événement.
    const receipt = await hre.ethers.provider.getTransactionReceipt(tx.hash);
    if (receipt && receipt.logs) {
      // Parse l'événement pour récupérer les arguments.
      const parsedLogs = receipt.logs.map(log => {
        try {
          return psgPassport.interface.parseLog(log);
        } catch (e) {
          return null; // Ignore les logs qui ne sont pas des événements de votre contrat.
        }
      }).filter(log => log !== null && log.name === "QuestNFTMinted"); // Filtre spécifiquement pour QuestNFTMinted

      if (parsedLogs.length > 0) {
        const mintedEvent = parsedLogs[0];
        const tokenId = mintedEvent.args.tokenId;
        console.log(`Minted NFT with ID: ${tokenId}`);
        console.log(`Token URI: ${mintedEvent.args.tokenURI}`);
      } else {
        console.log("QuestNFTMinted event not found in transaction logs.");
      }
    } else {
      console.log("No logs found in transaction receipt.");
    }

  } catch (error) {
    console.error("Failed to mint NFT:", error.message);
    if (error.reason) { // Affiche la raison de l'erreur si disponible (revert reason)
        console.error("Error reason:", error.reason);
    }
  }
}

// Gère l'exécution du script, capture les erreurs et quitte le processus.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });