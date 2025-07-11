import React, { useState } from 'react';
import PassportCover from './components/PassportCover';
import PassportPage from './components/PassportPage';
import PassportNavigation from './components/PassportNavigation';
import { usePassportAnimation } from './hooks/usePassportAnimation';

interface Stamp {
  id: string;
  country: string;
  date: string;
  type: string;
  color: string;
}

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageStamps, setPageStamps] = useState<Record<number, Stamp[]>>({});
  const { isAnimating, animationDirection, startAnimation } = usePassportAnimation();
  
  const totalPages = 8;

  const handleOpenPassport = () => {
    setIsOpen(true);
  };

  const handlePreviousPage = () => {
    if (currentPage > 0 && !isAnimating) {
      startAnimation('backward');
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
      }, 250);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1 && !isAnimating) {
      startAnimation('forward');
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
      }, 250);
    }
  };

  const handleAddStamp = (slotIndex: number, stamp: Stamp) => {
    setPageStamps(prev => ({
      ...prev,
      [currentPage]: {
        ...prev[currentPage],
        [slotIndex]: stamp
      }
    }));
  };

  const handleReset = () => {
    setIsOpen(false);
    setCurrentPage(0);
    setPageStamps({});
  };

  const getCurrentPageStamps = () => {
    return pageStamps[currentPage] || {};
  };

  const getPageStampsArray = () => {
    const stamps = getCurrentPageStamps();
    return [stamps[0], stamps[1], stamps[2]];
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
    
    // Pages à gauche (précédentes) - dans l'ordre correct
    for (let i = Math.max(0, currentPage - 3); i < currentPage; i++) {
      pages.push(i);
    }
    
    // Page actuelle
    pages.push(currentPage);
    
    // Pages à droite (suivantes)
    for (let i = currentPage + 1; i <= Math.min(totalPages - 1, currentPage + 3); i++) {
      pages.push(i);
    }
    
    return pages;
  };

  // Debug: afficher l'ordre des pages
  const visiblePages = getVisiblePages();
  const pageClasses = visiblePages.map(p => `Page ${p + 1}: ${getCoverFlowClass(p)}`);
  
  console.log('Current page:', currentPage + 1);
  console.log('Visible pages:', visiblePages.map(p => p + 1));
  console.log('Page classes:', pageClasses);

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="flex flex-col items-center">
        <div className="relative">
          {!isOpen && (
            <div className="slide-in">
              <PassportCover isOpen={isOpen} onOpen={handleOpenPassport} />
            </div>
          )}
          
          {isOpen && (
            <div className="relative perspective-1000">
              <div className="coverflow-container">
                {getVisiblePages().map((pageIndex) => (
                  <div
                    key={`page-${pageIndex}`}
                    className={`coverflow-page ${getCoverFlowClass(pageIndex)} ${isAnimating ? 'transitioning' : ''}`}
                  >
                    <PassportPage
                      pageNumber={pageIndex + 1}
                      stamps={pageStamps[pageIndex] ? 
                        [pageStamps[pageIndex][0], pageStamps[pageIndex][1], pageStamps[pageIndex][2]] : 
                        []
                      }
                      onAddStamp={pageIndex === currentPage ? handleAddStamp : () => {}}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {isOpen && (
          <div className="fade-in">
            <PassportNavigation
              currentPage={currentPage}
              totalPages={totalPages}
              onPrevious={handlePreviousPage}
              onNext={handleNextPage}
              onReset={handleReset}
              isAnimating={isAnimating}
            />
          </div>
        )}
        
        {!isOpen && (
          <div className="mt-8 text-center slide-in">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Passeport de Voyage
            </h1>
            <p className="text-gray-600 max-w-md">
              Découvrez votre passeport interactif. Cliquez sur la couverture pour l'ouvrir 
              et commencer à collectionner vos tampons de voyage.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;