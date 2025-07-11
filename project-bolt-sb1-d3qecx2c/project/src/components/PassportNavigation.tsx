import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PassportNavigationProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  onReset: () => void;
  isAnimating: boolean;
}

const PassportNavigation: React.FC<PassportNavigationProps> = ({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  onReset,
  isAnimating
}) => {
  return (
    <div className="flex items-center justify-between w-full max-w-md mx-auto mt-8">
      <button
        onClick={onPrevious}
        disabled={currentPage === 0 || isAnimating}
        className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        <ChevronLeft className="w-5 h-5 mr-2" />
        Précédent
      </button>
      
      <div className="flex items-center space-x-2">
        <div className="flex space-x-1">
          {[...Array(totalPages)].map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentPage ? 'bg-red-500 w-6' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
      
      <button
        onClick={onNext}
        disabled={currentPage === totalPages - 1 || isAnimating}
        className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Suivant
        <ChevronRight className="w-5 h-5 ml-2" />
      </button>
    </div>
  );
};

export default PassportNavigation;