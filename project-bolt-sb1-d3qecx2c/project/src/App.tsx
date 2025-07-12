import React, { useState, useEffect } from 'react';
import PassportCover from './components/PassportCover';
import PassportVachette from './components/PassportVachette';
import PassportPage from './components/PassportPage';
import Challenges from './components/challenges';
import PhotoUpload from './components/PhotoUpload';
import StampPopup from './components/StampPopup';
import ParticlesBackground from './components/background';
import { usePassportAnimation } from './hooks/usePassportAnimation';
import { useQuests } from './hooks/useQuests';
import { useWeb3 } from './hooks/useWeb3';
import ShinyText from './components/ShinyText';

interface Stamp {
  id: string;
  country: string;
  date: string;
  type: string;
  color?: string;
  image?: string;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  proofImage?: string | null;
  stampImage: string;
  stampData: {
    country: string;
    date: string;
    type: string;
    color: string;
  };
}

function App() {
  const [view, setView] = useState<'menu' | 'passport' | 'upload' | 'quests'>('menu');
  const [isPassportOpen, setIsPassportOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [showStampPopup, setShowStampPopup] = useState(false);
  const [newStampData, setNewStampData] = useState<Quest | null>(null);
  
  const { isAnimating, startAnimation } = usePassportAnimation();
  const { completeQuest, getCompletedQuests } = useQuests();
  
  const [fanTokens, setFanTokens] = useState(10); // compteur de fan tokens
 
  const {
    connectWallet,
    isConnecting,
    userAddress,
    nfts,
    fetchUserNFTs,
    mintNftForUser,
    nftContract,
    provider,
    signer,
    error: web3Error,
  } = useWeb3();

  const isConnected = !!userAddress;

  // 10 tokens = 10 pages, 20 tokens = 20 pages, etc.
  const totalPages = Math.max(1, Math.floor(fanTokens));

  // Vérifier les nouveaux tampons débloqués quand on change de page
  useEffect(() => {
    if (isPassportOpen) {
      checkForNewStampsOnCurrentPage();
    }
  }, [currentPage, isPassportOpen]);

  const handleOpenPassport = () => {
    setView('passport');
    setIsPassportOpen(true);
  };

  const handleStartQuest = (quest: Quest) => {
    setSelectedQuest(quest);
    setView('upload');
  };

  const handleOpenQuests = () => {
    setView('quests');
  };

  const handleBackToMenuFromQuests = () => {
    setView('menu');
  };

  const handlePhotoSubmit = (questId: string, imageData: string) => {
    completeQuest(questId, imageData);
    // Mint automatique du NFT correspondant à la quête
    mintNftForUser(questId);
    setSelectedQuest(null);
    setView('menu');
  };

  const handleBackToMenu = () => {
    setView('menu');
    setIsPassportOpen(false);
    setCurrentPage(0);
    setSelectedQuest(null);
  };

  const handlePreviousPage = () => {
    if (currentPage > 0 && !isAnimating) {
      startAnimation('backward');
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
      }, 100);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1 && !isAnimating) {
      startAnimation('forward');
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
      }, 100);
    }
  };

  const handleAddStamp = () => {
    // Pour le MVP, on désactive l'ajout manuel de tampons
    console.log('Ajout de tampon désactivé - utilisez les quêtes');
  };
  
  const handleMetaMaskConnect = async () => {
    await connectWallet();
    // Les NFTs seront récupérés automatiquement via useEffect ci-dessous
  };
  // Récupérer les NFTs dès qu'on est connecté ou que le contrat change
  useEffect(() => {
    if (userAddress && nftContract) {
      fetchUserNFTs();
    }
  }, [userAddress, nftContract]);

  // Nouvelle fonction pour gérer le clic sur les pages adjacentes
  const handlePageClick = (pageIndex: number) => {
    if (pageIndex !== currentPage && !isAnimating) {
      const direction = pageIndex > currentPage ? 'forward' : 'backward';
      startAnimation(direction);
      setTimeout(() => {
        setCurrentPage(pageIndex);
      }, 100);
    }
  };

  // Générer les tampons à partir des NFTs récupérés (3 par page)
  const generateStampsForPage = (pageNumber: number): Stamp[] => {
    const slotsPerPage = 3;
    const startIndex = (pageNumber - 1) * slotsPerPage;
    const endIndex = startIndex + slotsPerPage;
    // Log pour debug : voir les NFTs récupérés
    console.log('NFTs récupérés:', nfts);
    const nftsForPage = nfts.slice(startIndex, endIndex);
    const stamps: Stamp[] = [];
    for (let i = 0; i < slotsPerPage; i++) {
      if (nftsForPage[i]) {
        stamps.push({
          id: nftsForPage[i].tokenId,
          country: nftsForPage[i].name || '',
          date: '',
          type: nftsForPage[i].description || '',
          color: '',
          image: nftsForPage[i].image
        });
      }
    }
    return stamps;
  };

  // Fonction pour déterminer quelle page contient une quête spécifique
  const getPageForQuest = (questIndex: number): number => {
    const slotsPerPage = 3;
    return Math.floor(questIndex / slotsPerPage) + 1;
  };

  // Désactiver le popup de nouveau tampon pour la version NFT (à réimplémenter si besoin)
  const checkForNewStampsOnCurrentPage = () => {};

  const getCoverFlowClass = (pageIndex: number) => {
    const diff = pageIndex - currentPage;
    
    switch (diff) {
      case 0: return 'center';
      case 1: return 'right-1';
      case 2: return 'right-2';
      case 3: return 'right-3';
      case -1: return 'left-1';
      case -2: return 'left-2';
      case -3: return 'left-3';
      default: return diff > 3 ? 'right-3' : 'left-3';
    }
  };

  const getVisiblePages = () => {
    const pages = [];
    
    for (let i = Math.max(0, currentPage - 3); i < currentPage; i++) {
      pages.push(i);
    }
    
    pages.push(currentPage);
    
    for (let i = currentPage + 1; i <= Math.min(totalPages - 1, currentPage + 3); i++) {
      pages.push(i);
    }
    
    return pages;
  };

  // Rendu conditionnel basé sur la vue actuelle
  if (view === 'upload' && selectedQuest) {
    return (
      <PhotoUpload
        quest={selectedQuest}
        onBack={handleBackToMenu}
        onSubmit={handlePhotoSubmit}
      />
    );
  }

  if (view === 'quests') {
    if (!isConnected) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8">
          <button
            onClick={handleBackToMenuFromQuests}
            className="menu-button mb-8"
          >
            Menu
          </button>
          <div className="flex flex-col items-center">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">Connectez votre wallet MetaMask</h2>
              <p className="text-white mb-4">Vous devez connecter votre wallet pour accéder aux quêtes.</p>
              <button
                onClick={handleMetaMaskConnect}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-6 rounded shadow-lg transition-colors"
              >
                Se connecter avec MetaMask
              </button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <button
          onClick={handleBackToMenuFromQuests}
          className="menu-button mb-8"
        >
          Menu
        </button>
        <Challenges />
      </div>
    );
  }

  if (view === 'passport' && isPassportOpen) {
    // Si l'utilisateur n'est pas connecté, afficher le bouton de connexion MetaMask
    if (!isConnected) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8">
          <button
            onClick={handleBackToMenu}
            className="menu-button mb-8"
          >
            Menu
          </button>
          <div className="flex flex-col items-center">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">Connectez votre wallet MetaMask</h2>
              <p className="text-white mb-4">Vous devez connecter votre wallet pour accéder à votre passeport de voyage.</p>
              {web3Error && (
                <div className="text-red-400 font-bold mb-2">{web3Error}</div>
              )}
              <button
                onClick={handleMetaMaskConnect}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-6 rounded shadow-lg transition-colors"
              >
                Se connecter avec MetaMask
              </button>
            </div>
          </div>
        </div>
      );
    }
    // Si connecté, afficher les pages du passeport
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <button
          onClick={handleBackToMenu}
          className="menu-button"
        >
          Menu
        </button>
        <div className="flex flex-col items-center">
          <div className="relative perspective-1000">
            <div className="coverflow-container">
              {getVisiblePages().map((pageIndex) => (
                <div
                  key={`page-${pageIndex}`}
                  className={`coverflow-page ${getCoverFlowClass(pageIndex)}`}
                  onClick={() => handlePageClick(pageIndex)}
                  style={{ 
                    cursor: pageIndex !== currentPage ? 'pointer' : 'default',
                    transition: 'transform 0.3s ease-in-out' 
                  }}
                >
                  <div className="page-with-reflection">
                    <PassportPage
                      pageNumber={pageIndex + 1}
                      stamps={generateStampsForPage(pageIndex + 1)}
                      onAddStamp={handleAddStamp}
                      onPrevious={handlePreviousPage}
                      onNext={handleNextPage}
                      isCurrentPage={pageIndex === currentPage}
                    />
                    <div className="page-reflection">
                      <PassportPage
                        pageNumber={pageIndex + 1}
                        stamps={generateStampsForPage(pageIndex + 1)}
                        onAddStamp={() => {}}
                        isCurrentPage={false}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="reflection-fade-mask"></div>
        {/* Pop-up pour nouveau tampon */}
        {showStampPopup && newStampData && (
          <StampPopup
            isOpen={showStampPopup}
            onClose={() => setShowStampPopup(false)}
            stampData={newStampData.stampData}
            stampImage={newStampData.stampImage}
            questTitle={newStampData.title}
          />
        )}
      </div>
    );
  }

  // Vue par défaut : Menu principal avec couverture et quêtes
  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <button
          onClick={handleBackToMenuFromQuests}
          className="menu-button mb-8"
        >
          Menu
        </button>
        <div className="flex flex-col items-center">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">Connectez votre wallet MetaMask</h2>
            <p className="text-white mb-4">Vous devez connecter votre wallet pour accéder aux quêtes.</p>
            {web3Error && (
              <div className="text-red-400 font-bold mb-2">{web3Error}</div>
            )}
            <button
              onClick={handleMetaMaskConnect}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-6 rounded shadow-lg transition-colors"
            >
              Se connecter avec MetaMask
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden">
      {/* Compteur fan token en haut à gauche */}
      <div className="absolute top-4 left-4 z-50 bg-white bg-opacity-80 rounded-lg px-4 py-2 shadow-lg flex items-center">
        <span className="font-bold text-red-600 text-lg mr-2">Fan tokens :</span>
        <span className="font-mono text-xl">{fanTokens}</span>
      </div>
      {/* Fond de particules animées */}
      <ParticlesBackground />
      <div className="flex flex-col items-center" style={{ zIndex: 5 }}>
        {/* Titre au-dessus du passeport */}
        <div className="text-center mb-6 slide-in">
          <ShinyText text="TITRE" disabled={false} speed={3} className="mb-2" />
          <p className="text-white drop-shadow-lg ultimate-fan-text">The ultimate fan experience</p>
        </div>
        <div className="relative mb-12 my-12">
          <div className="slide-in">
            {/* Afficher le passeport */}
            <PassportCover isOpen={false} onOpen={handleOpenPassport} />
          </div>
        </div>
        <div className="text-center mb-8 slide-in">
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            Passeport de Voyage
          </h1>
          <p className="text-white max-w-md drop-shadow-md">
            {isConnected 
              && "Connectez votre wallet MetaMask pour débloquer votre passeport de voyage et commencer à collectionner vos tampons."
            }
          </p>
        </div>
        {/* Bouton pour accéder à la page des quêtes si connecté */}
        {isConnected && (
          <button
            onClick={handleOpenQuests}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded shadow-lg mb-6 transition-colors"
          >
            Voir les quêtes
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
