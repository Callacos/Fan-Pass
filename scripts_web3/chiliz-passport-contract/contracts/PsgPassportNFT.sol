// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Importe les standards ERC-721 et Ownable d'OpenZeppelin.
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// Note : Counters.sol n'est plus importé car il n'est plus nécessaire dans v5.x pour cette approche.

contract PsgPassportNFT is ERC721, Ownable {
    // Un simple compteur pour le prochain ID de token.
    uint256 private _nextTokenId;

    // Mapping pour stocker l'URI des métadonnées pour chaque ID de token.
    // Cette URI pointera vers le fichier JSON stocké sur IPFS.
    // C'est _tokenURIs qui est utilisé par la fonction tokenURI.
    mapping(uint256 => string) private _tokenURIs;

    // Événement émis quand un NFT est minté pour une quête.
    event QuestNFTMinted(address indexed to, uint256 tokenId, string tokenURI);

    // Le constructeur initialise le nom et le symbole de votre collection NFT.
    constructor(string memory name, string memory symbol, address initialOwner)
        ERC721(name, symbol)
        Ownable(initialOwner)
    {
        _nextTokenId = 1; // Commence les IDs de tokens à 1.
    }

    // Fonction principale pour créer (minter) un nouveau NFT pour une quête complétée.
    function mintQuestNFT(address _to, string memory _metadataCID)
        public
        onlyOwner
        returns (uint256)
    {
        uint256 newItemId = _nextTokenId; // Utilise l'ID actuel.

        // Dans ERC721 v5.x, la fonction _safeMint prend également l'URI en paramètre.
        // Cela gère à la fois le mint et la définition de l'URI.
        // Le `false` à la fin indique que le destinataire n'a pas besoin d'implémenter l'interface ERC721Receiver.
        // C'est sûr pour les adresses classiques.
        _safeMint(_to, newItemId); // Mint le NFT vers l'adresse _to

        // Associe l'URI IPFS des métadonnées.
        // On stocke l'URI directement dans notre mapping _tokenURIs
        _tokenURIs[newItemId] = string(abi.encodePacked("ipfs://", _metadataCID));


        // Incrémente le compteur pour le prochain NFT.
        _nextTokenId++;

        // Émet l'événement.
        emit QuestNFTMinted(_to, newItemId, string(abi.encodePacked("ipfs://", _metadataCID)));

        return newItemId; // Retourne l'ID du token minté.
    }

    // Cette fonction est une partie essentielle du standard ERC-721.
    // Elle doit retourner l'URI des métadonnées pour un 'tokenId' donné.
    // 'override(ERC721)' indique que cette fonction remplace une fonction du contrat parent ERC721.
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721)
        returns (string memory)
    {
        // Dans ERC721 v5.x, _exists n'est plus directement accessible pour vérifier l'existence du token.
        // Nous allons faire une vérification simple en regardant si le propriétaire du token est l'adresse zéro.
        // Ou si le token n'est pas encore minte (newItemId < tokenId)
        // La fonction `ownerOf` de ERC721 revert si le token n'existe pas, donc c'est une vérification implicite.

        // Assurez-vous que l'ID n'est pas 0 (IDs commencent à 1) et n'est pas supérieur au prochain ID disponible.
        if (tokenId == 0 || tokenId >= _nextTokenId) {
            revert("ERC721Metadata: URI query for nonexistent token");
        }
        
        // Retourne l'URI des métadonnées stockée dans notre mapping '_tokenURIs'.
        return _tokenURIs[tokenId];
    }

    // Cette fonction n'est pas essentielle pour le NFT mais peut être utile pour le debug
    // ou si vous avez besoin de vérifier les soldes de CHZ à des fins de test.
    function getEthBalance(address _addr) public view returns (uint256) {
        return _addr.balance;
    }
}