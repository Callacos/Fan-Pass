const hre = require("hardhat");

async function main() {
  // L'adresse qui déploiera le contrat (votre compte dans MetaMask)
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Récupère le solde du compte du déployeur pour s'assurer qu'il a assez de CHZ de test
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "CHZ");

  // Obtenez la fabrique du contrat PsgPassportNFT
  const PsgPassportNFT = await hre.ethers.getContractFactory("PsgPassportNFT");

  // Déployez le contrat, en passant le nom, le symbole et le propriétaire initial (qui est le déployeur ici)
  console.log("Deploying PsgPassportNFT...");
  const psgPassport = await PsgPassportNFT.deploy("Passeport PSG", "PSGNFT", deployer.address);

  // Attendez que le contrat soit déployé et confirmé sur la blockchain
  await psgPassport.waitForDeployment();

  console.log("PsgPassportNFT deployed to:", psgPassport.target);
}

// Nous recommandons que cette pattern soit suivie pour utiliser async/await
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });