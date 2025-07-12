import React, { useState } from 'react';

interface Stamp {
  id: string;
  country: string;
  date: string;
  type: string;
  color?: string;
  image?: string;
}

interface PassportPageProps {
  pageNumber: number;
  stamps: Stamp[];
  onAddStamp: (slotIndex: number, stamp: Stamp) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  isCurrentPage?: boolean;
}

const PassportPage: React.FC<PassportPageProps> = ({
  pageNumber,
  stamps,
  onAddStamp,
  onPrevious,
  onNext,
  isCurrentPage = false
}) => {
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  const stampTemplates = [
    {
      country: 'FRANCE',
      type: 'ENTRÉE',
      image: '/stamps/france.png'
    },
    {
      country: 'ESPAGNE',
      type: 'SORTIE',
      image: '/stamps/spain.png'
    },
    {
      country: 'ITALIE',
      type: 'TRANSIT',
      image: '/stamps/italy.png'
    },
    {
      country: 'ALLEMAGNE',
      type: 'ENTRÉE',
      image: '/stamps/germany.png'
    },
    {
      country: 'SUISSE',
      type: 'VISITE',
      image: '/stamps/switzerland.png'
    },
    {
      country: 'PORTUGAL',
      type: 'ENTRÉE',
      image: '/stamps/portugal.png'
    }
  ];

  const handleSlotClick = (slotIndex: number) => {
    if (stamps[slotIndex]) return;

    const randomStamp = stampTemplates[Math.floor(Math.random() * stampTemplates.length)];
    const newStamp: Stamp = {
      id: `stamp-${Date.now()}-${slotIndex}`,
      country: randomStamp.country,
      date: new Date().toLocaleDateString('fr-FR'),
      type: randomStamp.type,
      image: randomStamp.image
    };

    onAddStamp(slotIndex, newStamp);
    setSelectedSlot(slotIndex);
    setTimeout(() => setSelectedSlot(null), 1000);
  };

  return (
    <div className="bg-gradient-to-b from-black to-white w-[420px] h-[540px] rounded-lg shadow-xl border border-gray-300 relative overflow-hidden">
      {isCurrentPage && onPrevious && (
        <div
          className="page-click-zone left"
          onClick={onPrevious}
          title="Page précédente"
        />
      )}

      {isCurrentPage && onNext && (
        <div
          className="page-click-zone right"
          onClick={onNext}
          title="Page suivante"
        />
      )}

      {/* Logo Chiliz au centre en haut */}
      <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
        <img 
          src="/pims.png" 
          alt="Logo Chiliz" 
          className="w-16 h-16 object-contain"
        />
      </div>

      <div className="p-6 h-full flex flex-col justify-center items-center pt-24">
        {/* 3 gros ronds au centre, un en dessous de l'autre */}
        <div className="flex flex-col items-center">
          {[0, 1, 2].map((slotIndex) => {
            // Décalages horizontaux pour chaque tampon
            const getOffsetClass = (index: number) => {
              switch (index) {
                case 0: return '-translate-x-20'; // Premier tampon plus à gauche
                case 1: return 'translate-x-20';  // Deuxième tampon plus à droite
                case 2: return '-translate-x-6'; // Troisième tampon plus à gauche
                default: return '';
              }
            };

            // Espacement vertical personnalisé
            const getMarginClass = (index: number) => {
              switch (index) {
                case 0: return '';
                case 1: return 'mt-2';
                case 2: return ''; // Pas de marge pour le troisième
                default: return '';
              }
            };

            return (
              <div
                key={slotIndex}
                className={`stamp-slot-round rounded-full border-4 border-dashed border-gray-400 cursor-pointer transition-all duration-300 flex items-center justify-center ${getOffsetClass(slotIndex)} ${getMarginClass(slotIndex)} ${
                  slotIndex === 1 ? 'w-44 h-44' : 'w-32 h-32'
                } ${
                  stamps[slotIndex] ? 'bg-white border-solid shadow-lg' : 'hover:border-red-500 hover:bg-red-50'
                } ${selectedSlot === slotIndex ? 'animate-pulse border-red-500 scale-110' : ''}`}
                onClick={() => handleSlotClick(slotIndex)}
              >
              {stamps[slotIndex] ? (
                <div className={`text-center transform transition-all duration-500 ${
                  selectedSlot === slotIndex ? 'scale-110' : 'scale-100'
                }`}>
                  <div className="rounded-full p-2 bg-white shadow-md flex items-center justify-center w-28 h-28 border-4 border-green-600">
                    {stamps[slotIndex].image ? (
                      <img
                        src={stamps[slotIndex].image}
                        alt={`Tampon ${stamps[slotIndex].country}`}
                        className="h-full w-full object-contain rounded-full"
                      />
                    ) : (
                      <div className="text-center">
                        <div className="text-green-600 font-bold text-lg">✓</div>
                        <div className="text-green-600 font-bold text-xs mt-1">VALIDÉ</div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <div className={`rounded-full bg-white shadow-md flex items-center justify-center relative border-4 border-gray-400 ${
                    slotIndex === 1 ? 'w-40 h-40' : 'w-28 h-28'
                  }`}>
                    <img 
                      src="/psg.png?v=1" 
                      alt="Tampon PSG" 
                      className={`object-contain opacity-80 transform rotate-45 ${
                        slotIndex === 1 ? 'w-36 h-36' : 'w-24 h-24'
                      }`}
                      style={{
                        filter: 'grayscale(100%) brightness(0.6) contrast(1.2)',
                      }}
                      onError={(e) => {
                        console.error('Erreur de chargement de l\'image PSG:', e);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
            );
          })}
        </div>

        {/* Numéro de page en bas à droite */}
        <div className="absolute bottom-4 right-4 text-xs text-gray-500 font-semibold">
          {pageNumber.toString().padStart(2, '0')}
        </div>
      </div>
    </div>
  );
};

export default PassportPage;
