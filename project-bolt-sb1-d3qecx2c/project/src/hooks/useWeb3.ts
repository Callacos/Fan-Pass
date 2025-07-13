import { useState, useCallback } from 'react';
import { BrowserProvider, Contract } from 'ethers';

// Pour ethers v5 (cdn ou npm), l'accès se fait via window.ethers ou import * as ethers from 'ethers';
// On ajoute la déclaration pour window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

const CONTRACT_ADDRESS = "0xE8719E6233E2e1F320c6567B9fdbF40c8D61C1BB";
const CONTRACT_ABI: any[] = [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "symbol",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "initialOwner",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "ERC721IncorrectOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ERC721InsufficientApproval",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "approver",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidApprover",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidOperator",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "receiver",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidReceiver",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidSender",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ERC721NonexistentToken",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "OwnableInvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "OwnableUnauthorizedAccount",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "approved",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "ApprovalForAll",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "tokenURI",
          "type": "string"
        }
      ],
      "name": "QuestNFTMinted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "getApproved",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_addr",
          "type": "address"
        }
      ],
      "name": "getEthBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "isApprovedForAll",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "_metadataCID",
          "type": "string"
        }
      ],
      "name": "mintQuestNFT",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ownerOf",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "setApprovalForAll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "tokenURI",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

// CIDs IPFS des métadonnées pour chaque niveau de NFT
const nftMetadataCIDs: Record<string, string> = {
  "bronze": "bafkreiduqnrs2u24pjdbjol6csdi5kcmfbjsstm3iwhj6i4au5w5vcfnim",
  "welcome": "bafkreiegmohdlm6czgsvjb2ewyrcxzlduyddptxggdrjfzqa3sjsujj4au",
  "carte_postale": "bafkreigjlin3rszspgcgqd6yucmy6ukztjnuhwumdktqkzmbmuxbvnkrca",
  "compulsive_buyer": "bafkreicsruih7k7wxjrs43vlcuktnhmkyvvoa6gnn3u4qdhc6bq23xb2we",
  "first_match": "bafkreigemu2zwy6x6lkerhs45lghvc6vcq3tmhdb4qdxzcy76ukpnlcfh4",
  "tenth_match": "bafkreib7yybz3m4yoywzb55htvbw43auey33t34hyt4lzefafw7szrph3a",
};

// (nftMetadataCIDs n'est pas utilisé ici, donc retiré)

function convertIpfsToHttp(ipfsUri: string) {
  if (!ipfsUri) return '';
  if (ipfsUri.startsWith('ipfs://')) {
    // Utilise le gateway Cloudflare pour éviter les soucis CORS
    return `https://dweb.link/ipfs/${ipfsUri.slice(7)}`;
  }
  return ipfsUri;
}

export function useWeb3() {
  const [provider, setProvider] = useState<any>(null);
  const [signer, setSigner] = useState<any>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [nftContract, setNftContract] = useState<any>(null);
  const [nfts, setNfts] = useState<any[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pour garder les instances locales comme dans le JS vanilla
  // (utile pour éviter des problèmes de closure dans les callbacks)
  let _provider = provider;
  let _signer = signer;
  let _userAddress = userAddress;
  let _nftContract = nftContract;

  // Connexion au wallet (adapté du JS vanilla)
  const connectWallet = useCallback(async () => {
    setError(null);
    if (typeof window !== 'undefined' && window.ethereum) {
      setIsConnecting(true);
      try {
        _provider = new BrowserProvider(window.ethereum);
        await _provider.send("eth_requestAccounts", []);
        _signer = await _provider.getSigner();
        _userAddress = await _signer.getAddress();
        setProvider(_provider);
        setSigner(_signer);
        setUserAddress(_userAddress);
        // Vérifie le réseau
        const network = await _provider.getNetwork();
        if (network.chainId != 88882) {
            alert(network.chainId);
          alert("Veuillez basculer sur le réseau Chiliz Chain Spice Testnet dans MetaMask !");
        }
        // Charge le contrat
        _nftContract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, _signer);
        setNftContract(_nftContract);
        setIsConnecting(false);
        return true;
      } catch (e: any) {
        setIsConnecting(false);
        setError(e?.message || 'Erreur inconnue lors de la connexion à MetaMask');
        console.error('Erreur lors de la connexion à MetaMask:', e);
        alert('Erreur lors de la connexion à MetaMask: ' + (e?.message || e));
        return false;
      }
    } else {
      setError("MetaMask n'est pas installé.");
      alert("MetaMask n'est pas installé.");
      return false;
    }
  }, []);

  // Récupère tous les NFTs du wallet connecté
  const fetchUserNFTs = useCallback(async () => {
    if (!_nftContract || !_userAddress) return;
    const ownedTokenIds = new Set();
    const filterTo = _nftContract.filters.Transfer(null, _userAddress);
    const filterFrom = _nftContract.filters.Transfer(_userAddress, null);
    const receivedEvents = await _nftContract.queryFilter(filterTo, 0, "latest");
    const sentEvents = await _nftContract.queryFilter(filterFrom, 0, "latest");
    receivedEvents.forEach((event: any) => {
      ownedTokenIds.add(event.args.tokenId.toString());
    });
    sentEvents.forEach((event: any) => {
      ownedTokenIds.delete(event.args.tokenId.toString());
    });
    const nftList = [];
    for (const tokenIdString of Array.from(ownedTokenIds) as string[]) {
      const tokenId = BigInt(tokenIdString);
      const tokenURI = await _nftContract.tokenURI(tokenId);
      const httpMetadataUrl = convertIpfsToHttp(tokenURI);
      const response = await fetch(httpMetadataUrl);
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const metadata = await response.json();
        nftList.push({
          tokenId: tokenId.toString(),
          ...metadata,
          image: convertIpfsToHttp(metadata.image),
        });
      } else {
        // Log et skip si ce n'est pas du JSON
        console.warn(`Le tokenURI ne pointe pas vers un JSON valide : ${httpMetadataUrl} (content-type: ${contentType})`);
        continue;
      }
    }
    setNfts(nftList);
  }, [_nftContract, _userAddress]);

  // Mint un NFT pour un niveau donné
  const mintNftForUser = useCallback(async (level: string) => {
    if (!_nftContract) {
      alert("Contrat non chargé. Veuillez connecter votre portefeuille.");
      return;
    }
    if (!_userAddress) {
      alert("Utilisateur non connecté. Veuillez connecter votre portefeuille.");
      return;
    }
    const metadataCID = nftMetadataCIDs[level];
    if (!metadataCID) {
      alert(`CID de métadonnées non trouvé pour le niveau : ${level}`);
      return;
    }
    try {
      const tx = await _nftContract.mintQuestNFT(_userAddress, metadataCID);
      await tx.wait();
      alert(`Félicitations ! Votre NFT ${level} a été miné ! Transaction : ${tx.hash}`);
      await fetchUserNFTs();
    } catch (error: any) {
      if (error.code === 4001) {
        alert("Transaction refusée par l'utilisateur.");
      } else if (error.data && error.data.message) {
        alert(`Erreur de transaction : ${error.data.message}`);
      } else {
        alert("Une erreur est survenue lors du minage du NFT. Vérifiez la console pour plus de détails.");
      }
      console.error("Erreur lors du minage du NFT :", error);
    }
  }, [_nftContract, _userAddress, fetchUserNFTs]);

  return {
    connectWallet,
    isConnecting,
    userAddress,
    nfts,
    fetchUserNFTs,
    mintNftForUser,
    nftContract,
    provider,
    signer,
    error,
  };
}
