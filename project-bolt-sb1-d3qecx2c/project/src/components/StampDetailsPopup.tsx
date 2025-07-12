import React, { useState, useEffect } from 'react';
import { X, MapPin, Calendar } from 'lucide-react';
import pimsImage from '../image/pims.png';

interface Stamp {
  id: string;
  country: string;
  date: string;
  type: string;
  color?: string;
  image?: string;
}

interface StampDetailsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  stamp: Stamp;
}

const StampDetailsPopup: React.FC<StampDetailsPopupProps> = ({ 
  isOpen, 
  onClose, 
  stamp 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
      setIsFullScreen(false);
    }
  }, [isOpen]);

  const handleImageClick = () => {
    if (stamp.image) {
      setIsFullScreen(true);
    }
  };

  const handleFullScreenClose = () => {
    setIsFullScreen(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-700 rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
        <div className="relative p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 transition-colors"
            style={{ color: 'rgb(247, 10, 10)' }}
          >
            <X className="w-6 h-6 hover:opacity-80" />
          </button>

          <div className="text-center">
            <div className="w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <img 
                src={pimsImage} 
                alt="Stamp Icon" 
                className="w-full h-full object-contain"
              />
            </div>

            <h2 className="text-2xl font-bold text-white mb-6">
              Stamp Details
            </h2>

            <div className="border-4 border-gray-500 rounded-lg p-6 bg-gray-600 shadow-inner mb-6">
              {stamp.image ? (
                <img
                  src={stamp.image}
                  alt={`Stamp ${stamp.country}`}
                  className="h-52 mx-auto object-contain mb-4 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={handleImageClick}
                />
              ) : (
                <div className="h-52 flex items-center justify-center mb-4">
                  <div className="text-8xl font-bold text-gray-400">
                    {stamp.country?.charAt(0) || '?'}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="w-5 h-5 text-red-400" />
                  <span className="font-bold text-xl text-white">
                    {stamp.country}
                  </span>
                </div>

                <div className="text-lg text-gray-300">
                  {stamp.type}
                </div>

                {stamp.date && (
                  <div className="flex items-center justify-center gap-2 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{stamp.date}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="text-sm text-white space-y-2">
              <p>This stamp is part of your travel collection.</p>
              <p className="font-semibold">Token ID: {stamp.id}</p>
            </div>

            <button
              onClick={onClose}
              className="mt-6 text-white font-bold py-3 px-6 rounded-lg transition-colors hover:opacity-90"
              style={{ backgroundColor: 'rgb(247, 10, 10)' }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
      
      {/* Modal plein écran pour l'image */}
      {isFullScreen && stamp.image && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[60] p-4">
          <button
            onClick={handleFullScreenClose}
            className="absolute top-4 right-4 transition-colors z-[70]"
            style={{ color: 'rgb(247, 10, 10)' }}
          >
            <X className="w-8 h-8 hover:opacity-80" />
          </button>
          
          <img
            src={stamp.image}
            alt={`Stamp ${stamp.country} - Full Screen`}
            className="max-w-full max-h-full object-contain"
            onClick={handleFullScreenClose}
          />
        </div>
      )}
    </div>
  );
};

export default StampDetailsPopup;
