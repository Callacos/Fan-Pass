import React, { useState, useEffect } from 'react';
import { X, Star, MapPin, Calendar } from 'lucide-react';

interface StampData {
  country: string;
  date: string;
  type: string;
  color: string;
}

interface StampPopupProps {
  isOpen: boolean;
  onClose: () => void;
  stampData: StampData;
  stampImage: string;
  questTitle: string;
}

const StampPopup: React.FC<StampPopupProps> = ({ 
  isOpen, 
  onClose, 
  stampData, 
  stampImage, 
  questTitle 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showStamp, setShowStamp] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Déclencher l'animation du tampon après un délai
      setTimeout(() => setShowStamp(true), 500);
    } else {
      setIsVisible(false);
      setShowStamp(false);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-500 scale-100">
        <div className="relative p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Star className="w-10 h-10 text-white" />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Nouveau Tampon Débloqué !
            </h2>

            <p className="text-gray-600 mb-6">
              Félicitations ! Vous avez terminé la quête "{questTitle}".
            </p>

            <div className={`transform transition-all duration-1000 ${
              showStamp ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
            }`}>
              <div className="border-4 border-gray-400 rounded-lg p-6 bg-gray-50 shadow-inner mb-6">
                {stampImage ? (
                  <img
                    src={stampImage}
                    alt={`Tampon ${stampData.country}`}
                    className="h-32 mx-auto object-contain"
                  />
                ) : (
                  <div className="h-32 flex flex-col items-center justify-center">
                    <div className="flex items-center justify-center mb-3">
                      <MapPin className="w-6 h-6 text-gray-600 mr-2" />
                      <span className={`font-bold text-2xl ${stampData.color}`}>
                        {stampData.country}
                      </span>
                    </div>
                    <div className="text-lg text-gray-700 mb-2">
                      {stampData.type}
                    </div>
                    <div className="flex items-center justify-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {stampData.date}
                    </div>
                    <div className="flex justify-center mt-3">
                      <Star className="w-5 h-5 fill-current text-yellow-500" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center justify-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Destination: {stampData.country}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Date: {stampData.date}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Star className="w-4 h-4" />
                <span>Type: {stampData.type}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-8 w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-6 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105"
            >
              Continuer l'aventure
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StampPopup;
