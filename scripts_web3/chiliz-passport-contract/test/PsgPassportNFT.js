const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PsgPassportNFT", function () {
  let PsgPassportNFT; // Référence au contrat compilé
  let psgPassport;    // Instance du contrat déployé
  let owner;          // Compte du propriétaire (celui qui déploie et peut minter)
  let addr1;          // Un autre compte pour simuler un supporter
  let addr2;          // Un autre compte

  // Cette fonction est exécutée avant chaque test
  beforeEach(async function () {
    // Récupère les signers (comptes de test) fournis par Hardhat
    [owner, addr1, addr2] = await ethers.getSigners();

    // Récupère la fabrique du contrat (pour le déployer)
    PsgPassportNFT = await ethers.getContractFactory("PsgPassportNFT");

    // Déploie le contrat avec un nom, un symbole et le propriétaire initial
    psgPassport = await PsgPassportNFT.deploy("Passeport PSG", "PSGNFT", owner.address);
    await psgPassport.waitForDeployment(); // Attend que le déploiement soit confirmé
  });

  // Test 1: Vérifie le nom et le symbole de la collection
  it("Should have the correct name and symbol", async function () {
    expect(await psgPassport.name()).to.equal("Passeport PSG");
    expect(await psgPassport.symbol()).to.equal("PSGNFT");
  });

  // Test 2: Vérifie que le propriétaire est bien l'adresse qui a déployé le contrat
  it("Should set the right owner", async function () {
    expect(await psgPassport.owner()).to.equal(owner.address);
  });

  // Test 3: Teste la fonction mintQuestNFT
  it("Should allow owner to mint NFTs for other addresses and set tokenURI", async function () {
    const testMetadataCID = "QmTestCIDforBronzeNFT"; // CID IPFS de test pour les métadonnées Bronze

    // Le propriétaire (owner) mint un NFT pour addr1
    const mintTx = await psgPassport.mintQuestNFT(addr1.address, testMetadataCID);
    await mintTx.wait(); // Attend que la transaction soit minée

    // Vérifie que addr1 est bien le propriétaire du token ID 1 (premier token minté)
    expect(await psgPassport.ownerOf(1)).to.equal(addr1.address);
    // Vérifie que l'URI du token est correcte
    expect(await psgPassport.tokenURI(1)).to.equal("ipfs://" + testMetadataCID);
    // Vérifie que le solde de NFT de addr1 est 1
    expect(await psgPassport.balanceOf(addr1.address)).to.equal(1);

    // Mint un deuxième NFT pour addr2
    const testMetadataCID2 = "QmTestCIDforSilverNFT"; // CID IPFS de test pour les métadonnées Argent
    const mintTx2 = await psgPassport.mintQuestNFT(addr2.address, testMetadataCID2);
    await mintTx2.wait();

    // Vérifie le deuxième mint (token ID 2)
    expect(await psgPassport.ownerOf(2)).to.equal(addr2.address);
    expect(await psgPassport.tokenURI(2)).to.equal("ipfs://" + testMetadataCID2);
    expect(await psgPassport.balanceOf(addr2.address)).to.equal(1);
  });

  // Test 4: Vérifie que seul le propriétaire peut minter des NFT
  it("Should not allow non-owner to mint NFTs", async function () {
    const testMetadataCID = "QmTestCID";

    // addr1 essaie de minter, cela devrait échouer
    await expect(psgPassport.connect(addr1).mintQuestNFT(addr1.address, testMetadataCID))
      .to.be.revertedWithCustomError(PsgPassportNFT, "OwnableUnauthorizedAccount");
  });

  // Test 5: Vérifie que la fonction tokenURI échoue pour un token inexistant
  it("Should revert tokenURI for nonexistent token", async function () {
    // Le token ID 0 n'est jamais minté
    await expect(psgPassport.tokenURI(0)).to.be.revertedWith("ERC721Metadata: URI query for nonexistent token");
    // Le token ID 999 n'existe pas encore
    await expect(psgPassport.tokenURI(999)).to.be.revertedWith("ERC721Metadata: URI query for nonexistent token");
  });
});