import React, { useState } from 'react';
import { MapPin, Calendar, Star } from 'lucide-react';

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
    <div className="bg-white w-[420px] h-[540px] rounded-lg shadow-xl border border-gray-200 relative overflow-hidden">
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

      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600" />

      <div className="p-6 h-full">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Page {pageNumber}
          </h2>
          <div className="h-px bg-gradient-to-r from-red-200 to-transparent" />
        </div>

        <div className="grid grid-cols-1 gap-4 h-72">
          {[0, 1, 2].map((slotIndex) => (
            <div
              key={slotIndex}
              className={`stamp-slot border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer transition-all duration-300 ${
                stamps[slotIndex] ? 'bg-gray-50' : 'hover:border-red-300 hover:bg-red-50'
              } ${selectedSlot === slotIndex ? 'animate-pulse border-red-500' : ''}`}
              onClick={() => handleSlotClick(slotIndex)}
            >
              {stamps[slotIndex] ? (
                <div className={`text-center transform transition-all duration-500 ${
                  selectedSlot === slotIndex ? 'scale-110' : 'scale-100'
                }`}>
                  <div className="border-2 border-gray-400 rounded-lg p-3 bg-white shadow-md flex items-center justify-center h-28">
                    {stamps[slotIndex].image ? (
                      <img
                        src={stamps[slotIndex].image}
                        alt={`Tampon ${stamps[slotIndex].country}`}
                        className="h-full object-contain"
                      />
                    ) : (
                      <div>
                        <div className="flex items-center justify-center mb-2">
                          <MapPin className="w-5 h-5 text-gray-600 mr-2" />
                          <span className={`font-bold text-lg ${stamps[slotIndex].color}`}>
                            {stamps[slotIndex].country}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-1">
                          {stamps[slotIndex].type}
                        </div>
                        <div className="flex items-center justify-center text-xs text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          {stamps[slotIndex].date}
                        </div>
                        <div className="flex justify-center mt-2">
                          <Star className="w-4 h-4 fill-current text-yellow-500" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400 py-8">
                  <div className="w-16 h-16 mx-auto mb-2 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center">
                    <MapPin className="w-8 h-8" />
                  </div>
                  <p className="text-sm">Cliquez pour tamponner</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="absolute bottom-4 right-4 text-xs text-gray-400">
          {pageNumber.toString().padStart(2, '0')}
        </div>
      </div>
    </div>
  );
};

export default PassportPage;
