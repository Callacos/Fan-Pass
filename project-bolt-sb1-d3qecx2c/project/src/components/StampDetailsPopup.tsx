import React, { useState, useEffect } from 'react';
import { X, MapPin, Calendar, Award } from 'lucide-react';

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

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
        <div className="relative p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="w-10 h-10 text-white" />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Stamp Details
            </h2>

            <div className="border-4 border-gray-300 rounded-lg p-6 bg-gray-50 shadow-inner mb-6">
              {stamp.image ? (
                <img
                  src={stamp.image}
                  alt={`Stamp ${stamp.country}`}
                  className="h-32 mx-auto object-contain mb-4"
                />
              ) : (
                <div className="h-32 flex items-center justify-center mb-4">
                  <div className="text-6xl font-bold text-gray-400">
                    {stamp.country?.charAt(0) || '?'}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span className="font-bold text-xl text-gray-800">
                    {stamp.country}
                  </span>
                </div>

                <div className="text-lg text-gray-600">
                  {stamp.type}
                </div>

                {stamp.date && (
                  <div className="flex items-center justify-center gap-2 text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{stamp.date}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="text-sm text-gray-600 space-y-2">
              <p>This stamp is part of your travel collection.</p>
              <p className="font-semibold">Token ID: {stamp.id}</p>
            </div>

            <button
              onClick={onClose}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StampDetailsPopup;
