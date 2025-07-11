import React, { useState, useEffect } from 'react';
import PassportCover from './components/PassportCover';
import PassportPage from './components/PassportPage';
import QuestList from './components/QuestList';
import PhotoUpload from './components/PhotoUpload';
import StampPopup from './components/StampPopup';
import { usePassportAnimation } from './hooks/usePassportAnimation';
import { useQuests } from './hooks/useQuests';

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
  const [view, setView] = useState<'menu' | 'passport' | 'upload'>('menu');
  const [isPassportOpen, setIsPassportOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [showStampPopup, setShowStampPopup] = useState(false);
  const [newStampData, setNewStampData] = useState<Quest | null>(null);
  
  const { isAnimating, startAnimation } = usePassportAnimation();
  const { completeQuest, getCompletedQuests } = useQuests();
  
  const totalPages = 8;

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

  const handlePhotoSubmit = (questId: string, imageData: string) => {
    completeQuest(questId, imageData);
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

  // Générer les tampons basés sur les quêtes complétées
  const generateStampsForPage = (pageNumber: number): Stamp[] => {
    const completedQuests = getCompletedQuests();
    
    // Calculer combien de tampons ont été placés avant cette page
    const slotsPerPage = 3;
    const startIndex = (pageNumber - 1) * slotsPerPage;
    const endIndex = startIndex + slotsPerPage;
    
    // Prendre les quêtes pour cette page spécifique
    const questsForThisPage = completedQuests.slice(startIndex, endIndex);
    
    // Convertir en tampons et compléter avec des slots vides
    const stamps: Stamp[] = [];
    for (let i = 0; i < slotsPerPage; i++) {
      if (questsForThisPage[i]) {
        stamps.push({
          id: questsForThisPage[i].id,
          country: questsForThisPage[i].stampData.country,
          date: questsForThisPage[i].stampData.date,
          type: questsForThisPage[i].stampData.type,
          color: questsForThisPage[i].stampData.color
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

  // Fonction pour vérifier si une nouvelle quête a été ajoutée sur la page actuelle
  const checkForNewStampsOnCurrentPage = () => {
    const completedQuests = getCompletedQuests();
    
    // Trouver la dernière quête complétée
    if (completedQuests.length > 0) {
      const lastQuestIndex = completedQuests.length - 1;
      const pageWithNewStamp = getPageForQuest(lastQuestIndex);
      
      // Si la nouvelle quête est sur la page actuelle, déclencher le popup
      if (pageWithNewStamp === currentPage + 1) {
        const lastQuest = completedQuests[lastQuestIndex];
        const questId = lastQuest.id;
        const shownStamps = JSON.parse(localStorage.getItem('shownStamps') || '[]');
        
        if (!shownStamps.includes(questId)) {
          setNewStampData(lastQuest);
          setShowStampPopup(true);
          shownStamps.push(questId);
          localStorage.setItem('shownStamps', JSON.stringify(shownStamps));
        }
      }
    }
  };

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

  if (view === 'passport' && isPassportOpen) {
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
                  className={`coverflow-page ${getCoverFlowClass(pageIndex)} ${isAnimating ? 'transitioning' : ''}`}
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
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="flex flex-col items-center">
        <div className="relative mb-8">
          <div className="slide-in">
            <PassportCover isOpen={false} onOpen={handleOpenPassport} />
          </div>
        </div>
        
        <div className="text-center mb-8 slide-in">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Passeport de Voyage
          </h1>
          <p className="text-gray-600 max-w-md">
            Découvrez votre passeport interactif. Cliquez sur la couverture pour l'ouvrir 
            et commencer à collectionner vos tampons de voyage.
          </p>
        </div>

        <QuestList onStartQuest={handleStartQuest} onOpenPassport={handleOpenPassport} />
      </div>
    </div>
  );
}

export default App;