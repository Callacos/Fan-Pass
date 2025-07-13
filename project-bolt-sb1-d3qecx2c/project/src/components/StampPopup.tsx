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
    <div className="fixed inset-0 bg-gradient-to-br from-[#ff007a33] via-[#181222cc] to-[#ff003355] flex items-center justify-center z-50 p-4 font-orbitron">
      <div className="backdrop-blur-xl bg-white/10 bg-gradient-to-br from-[#ff007a33] via-[#241432cc] to-[#ff003355] border-2 border-pink-400 rounded-3xl shadow-2xl max-w-md w-full transform transition-all duration-500 scale-100 relative overflow-hidden" style={{boxShadow: '0 8px 40px 0 #ff007a55, 0 1.5px 8px 0 #ff003355'}}>
        <div className="absolute inset-0 pointer-events-none" style={{background: "radial-gradient(circle at 80% 10%, rgba(255,0,122,0.18) 0%, transparent 60%), radial-gradient(circle at 20% 90%, rgba(255,0,122,0.10) 0%, transparent 60%), linear-gradient(120deg, rgba(255,0,122,0.09) 0%, transparent 60%)"}} />
        <div className="relative p-8 z-10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-pink-400 hover:text-pink-200 transition-colors"
            style={{zIndex: 20}}
          >
            <X className="w-7 h-7" />
          </button>

          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-500 via-red-500 to-pink-300 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse border-4 border-white/30 backdrop-blur-sm">
              <Star className="w-10 h-10 text-white drop-shadow-lg" />
            </div>

            <h2 className="text-2xl font-bold text-pink-200 mb-4 tracking-widest uppercase drop-shadow-lg" style={{textShadow: '0 0 8px #ff007a, 0 0 2px #fff'}}>
              New Stamp Unlocked!
            </h2>

            <p className="text-pink-100 mb-6" style={{textShadow: '0 0 4px #ff007a88'}}>
              Congratulations! You completed the quest "{questTitle}".
            </p>

            <div className={`transform transition-all duration-1000 ${
              showStamp ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
            }`}>
              <div className="border-4 border-pink-400 rounded-2xl p-6 bg-white/10 backdrop-blur-md shadow-inner mb-6 flex flex-col items-center" style={{boxShadow: '0 0 24px #ff007a55'}}>
                {stampImage ? (
                  <img
                    src={stampImage}
                    alt={`Stamp ${stampData.country}`}
                    className="h-32 mx-auto object-contain rounded-xl border-2 border-pink-300 shadow-lg bg-white/80"
                  />
                ) : (
                  <div className="h-32 flex flex-col items-center justify-center">
                    <div className="flex items-center justify-center mb-3">
                      <MapPin className="w-6 h-6 text-pink-400 mr-2" />
                      <span className={`font-bold text-2xl text-pink-200`}>
                        {stampData.country}
                      </span>
                    </div>
                    <div className="text-lg text-pink-100 mb-2">
                      {stampData.type}
                    </div>
                    <div className="flex items-center justify-center text-sm text-pink-300">
                      <Calendar className="w-4 h-4 mr-1" />
                      {stampData.date}
                    </div>
                    <div className="flex justify-center mt-3">
                      <Star className="w-5 h-5 fill-current text-yellow-400" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3 text-sm text-pink-100 mt-2">
              <div className="flex items-center justify-center gap-2">
                <MapPin className="w-4 h-4 text-pink-400" />
                <span style={{textShadow: '0 0 4px #ff007a88'}}>Destination: {stampData.country}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4 text-pink-400" />
                <span style={{textShadow: '0 0 4px #ff007a88'}}>Date: {stampData.date}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Star className="w-4 h-4 text-pink-400" />
                <span style={{textShadow: '0 0 4px #ff007a88'}}>Type: {stampData.type}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-8 w-full text-lg tracking-widest py-3 px-6 rounded-xl font-bold bg-gradient-to-r from-pink-500 via-red-500 to-pink-400 text-white shadow-lg hover:from-pink-600 hover:to-red-600 hover:scale-105 transition-all border-2 border-white/20 backdrop-blur-sm"
              style={{fontWeight: 700, letterSpacing: 2, textShadow: '0 0 8px #ff007a'}}
            >
              Continue the adventure
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StampPopup;
