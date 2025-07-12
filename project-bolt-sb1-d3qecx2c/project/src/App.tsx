import { useState, useEffect } from "react";
import PassportCover from "./components/PassportCover";
import PassportPage from "./components/PassportPage";
import Challenges from "./components/challenges";
import PhotoUpload from "./components/PhotoUpload";
import StampPopup from "./components/StampPopup";
import ParticlesBackground from "./components/background";
import { usePassportAnimation } from "./hooks/usePassportAnimation";
import { useQuests } from "./hooks/useQuests";
import { useWeb3 } from "./hooks/useWeb3";
import metaMaskLogo from "./image/metaMask.png";

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
  const [view, setView] = useState<"menu" | "passport" | "upload" | "quests">(
    "menu"
  );
  const [isPassportOpen, setIsPassportOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [showStampPopup, setShowStampPopup] = useState(false);
  const [showStampDetailsPopup, setShowStampDetailsPopup] = useState(false);
  const [selectedStamp, setSelectedStamp] = useState<Stamp | null>(null);
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
    setView("passport");
    setIsPassportOpen(true);
  };

  const handleStartQuest = (quest: Quest) => {
    setSelectedQuest(quest);
    setView("upload");
  };

  const handleOpenQuests = () => {
    setView("quests");
  };

  const handleBackToMenuFromQuests = () => {
    setView("menu");
  };

  const handlePhotoSubmit = (questId: string, imageData: string) => {
    completeQuest(questId, imageData);
    // Mint automatique du NFT correspondant à la quête
    mintNftForUser(questId);
    setSelectedQuest(null);
    setView("menu");
  };

  const handleBackToMenu = () => {
    setView("menu");
    setIsPassportOpen(false);
    setCurrentPage(0);
    setSelectedQuest(null);
  };

  const handlePreviousPage = () => {
    if (currentPage > 0 && !isAnimating) {
      startAnimation("backward");
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
      }, 100);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1 && !isAnimating) {
      startAnimation("forward");
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
      }, 100);
    }
  };

  const handleAddStamp = () => {
    // Pour le MVP, on désactive l'ajout manuel de tampons
    console.log("Ajout de tampon désactivé - utilisez les quêtes");
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
      const direction = pageIndex > currentPage ? "forward" : "backward";
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
    console.log("NFTs récupérés:", nfts);
    const nftsForPage = nfts.slice(startIndex, endIndex);
    const stamps: Stamp[] = [];
    for (let i = 0; i < slotsPerPage; i++) {
      if (nftsForPage[i]) {
        stamps.push({
          id: nftsForPage[i].tokenId,
          country: nftsForPage[i].name || "",
          date: "",
          type: nftsForPage[i].description || "",
          color: "",
          image: nftsForPage[i].image,
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
      case 0:
        return "center";
      case 1:
        return "right-1";
      case 2:
        return "right-2";
      case 3:
        return "right-3";
      case -1:
        return "left-1";
      case -2:
        return "left-2";
      case -3:
        return "left-3";
      default:
        return diff > 3 ? "right-3" : "left-3";
    }
  };

  const getVisiblePages = () => {
    const pages = [];

    for (let i = Math.max(0, currentPage - 3); i < currentPage; i++) {
      pages.push(i);
    }

    pages.push(currentPage);

    for (
      let i = currentPage + 1;
      i <= Math.min(totalPages - 1, currentPage + 3);
      i++
    ) {
      pages.push(i);
    }

    return pages;
  };

  // Gérer la classe du body pour empêcher le scroll sur la page passeport
  useEffect(() => {
    if (view === 'passport') {
      document.body.classList.add('passport-view-body');
    } else {
      document.body.classList.remove('passport-view-body');
    }
    
    // Nettoyer la classe quand le composant est démonté
    return () => {
      document.body.classList.remove('passport-view-body');
    };
  }, [view]);

  // Rendu conditionnel basé sur la vue actuelle
  if (view === "upload" && selectedQuest) {
    return (
      <div className="app-orbitron">
        <PhotoUpload
          quest={selectedQuest}
          onBack={handleBackToMenu}
          onSubmit={handlePhotoSubmit}
        />
      </div>
    );
  }

  if (view === "quests") {
    if (!isConnected) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
          <ParticlesBackground />
          <div className="flex flex-col items-center relative z-10">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">
                Connectez votre wallet MetaMask
              </h2>
              <p className="text-white mb-4">
                Vous devez connecter votre wallet pour accéder aux quêtes.
              </p>
              <button
                onClick={handleMetaMaskConnect}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-6 rounded shadow-lg transition-colors"
              >
                Connect with MetaMask
              </button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <Challenges 
          onBackToMenu={handleBackToMenuFromQuests}
          onOpenCollection={handleOpenPassport}
        />
      </div>
    );
  }

  if (view === "passport" && isPassportOpen) {
    // Si l'utilisateur n'est pas connecté, afficher le bouton de connexion MetaMask
    if (!isConnected) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8">
          <button onClick={handleBackToMenu} className="menu-button mb-8">
            Menu
          </button>
          <div className="flex flex-col items-center">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">
                Connectez votre wallet MetaMask
              </h2>
              <p className="text-white mb-4">
                Vous devez connecter votre wallet pour accéder à votre passeport
                de voyage.
              </p>

              {web3Error && (
                <div className="text-red-400 font-bold mb-2">{web3Error}</div>
              )}
              <button
                onClick={handleMetaMaskConnect}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-6 rounded shadow-lg transition-colors"
              >
                Connect with MetaMask
              </button>
            </div>
          </div>
        </div>
      );
    }
    // Si connecté, afficher les pages du passeport
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <button onClick={handleBackToMenu} className="menu-button">
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
                    cursor: pageIndex !== currentPage ? "pointer" : "default",
                    transition: "transform 0.3s ease-in-out",
                  }}
                >
                  <div className="page-with-reflection">
                    <PassportPage
                      pageNumber={pageIndex + 1}
                      stamps={generateStampsForPage(pageIndex + 1)}
                      onAddStamp={handleAddStamp}
                      onStampClick={handleStampClick}
                      onPrevious={handlePreviousPage}
                      onNext={handleNextPage}
                      isCurrentPage={pageIndex === currentPage}
                    />
                    <div className="page-reflection">
                      <PassportPage
                        pageNumber={pageIndex + 1}
                        stamps={generateStampsForPage(pageIndex + 1)}
                        onAddStamp={() => {}}
                        onStampClick={() => {}}
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
        {/* Pop-up pour détails du tampon */}
        {showStampDetailsPopup && selectedStamp && (
          <StampDetailsPopup
            isOpen={showStampDetailsPopup}
            onClose={() => setShowStampDetailsPopup(false)}
            stamp={selectedStamp}
          />
        )}
      </div>
    );
  }

  // Vue par défaut : Menu principal avec couverture et quests
  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
        {/* Fond de particules animées */}
        <ParticlesBackground />

        {/* Overlay de connexion futuriste */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
          {/* Logo Chiliz flottant avec effet holographique */}
          <div className="mb-12 relative">
            <div className="holographic-logo-container">
              <img
                src="/pims.png"
                alt="Chiliz"
                className="w-24 h-24 object-contain holographic-logo"
              />
              <div className="holographic-glow"></div>
            </div>
          </div>

          {/* Titre principal avec effet néon */}
          <div className="text-center mb-8">
            <h1 className="fanpass-title">FAN PASS</h1>
            <div className="fanpass-slogan">
              THE NEW WAY TO SUPPORT YOUR TEAM
            </div>
          </div>

          {/* Bouton de connexion futuriste */}
          <div className="cyber-button-container">

            <button
              onClick={handleMetaMaskConnect}
              className="cyber-connect-button"
            >
              <span className="cyber-button-text">
                CONNECT TO YOUR WALLET{" "}
                <img
                  src={metaMaskLogo}
                  alt="MetaMask"
                  style={{
                    width: 24,
                    height: 24,
                    marginLeft: 10,
                    display: "inline",
                    verticalAlign: "middle",
                  }}
                />
              </span>
              <div className="cyber-button-glow"></div>
              <div className="cyber-button-border"></div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-0 relative overflow-hidden">
      {/* Compteur fan token futuriste */}
      <div
        className="absolute top-6 right-6 z-50"
        style={{ marginTop: "2.5rem" }}
      >
        <div className="token-counter">
          <div className="token-info">
            <span className="token-label">FAN TOKENS</span>
            <span className="token-value">{fanTokens}</span>
          </div>
        </div>
      </div>

      {/* Fond de particules animées */}
      <ParticlesBackground />

      {/* Layout principal disruptif */}
      <div className="relative z-10 flex flex-row items-center justify-center w-full min-h-screen">
        {/* Colonne gauche : FAN PASS vertical */}
        <div className="flex flex-col items-center justify-center h-full min-h-[600px] w-[120px] mr-4 select-none">
          <div className="vertical-title-container">
            <h1 className="fanpass-title-vertical">FAN PASS</h1>
          </div>
        </div>

        {/* Colonne centrale : Passeport centré + boutons */}
        <div className="flex flex-col items-center justify-center flex-1 min-h-[700px]">
          {/* Passeport centré */}
          <div className="passport-section mb-10 flex flex-col items-center justify-center">
            <div className="passport-container">
              <div className="passport-3d-wrapper">
                <PassportCover isOpen={false} onOpen={handleOpenPassport} />
                <div className="passport-glow"></div>
              </div>
            </div>
          </div>

          {/* Boutons sous le passeport */}
          <div className="actions-section mb-8">
            <div className="action-buttons flex flex-row gap-8 items-center justify-center">
              <button
                onClick={handleOpenPassport}
                className="cyber-action-button primary w-64"
              >
                <span className="button-text">OPEN PASSPORT</span>
                <div className="button-glow"></div>
                <div className="button-border"></div>
              </button>
              <button
                onClick={handleOpenQuests}
                className="cyber-action-button secondary w-64"
              >
                <span className="button-text">SEE THE QUESTS</span>
                <div className="button-glow"></div>
                <div className="button-border"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Colonne droite : stats verticales */}
        <div className="flex flex-col items-center justify-center h-full min-h-[600px] w-[180px] ml-4 select-none">
          <div className="stats-block-container vertical-stats-container flex flex-col gap-8 items-center justify-center mt-32">
            <div className="stat-item-vertical">
              <div className="stat-value-vertical">{fanTokens}</div>
              <div className="stat-label-vertical">
                UNLOCKED
                <br />
                PAGES
              </div>
            </div>
            <div className="stat-item-vertical">
              <div className="stat-value-vertical">{nfts.length}</div>
              <div className="stat-label-vertical">
                COLLECTED
                <br />
                BADGES
              </div>
            </div>
            <div className="stat-item-vertical">
              <div className="stat-value-vertical">∞</div>
              <div className="stat-label-vertical">POSSIBILITIES</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
