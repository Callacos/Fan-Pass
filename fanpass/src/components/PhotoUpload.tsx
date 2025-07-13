import React, { useState, useRef } from 'react';
import { Camera, Upload, X, CheckCircle, ArrowLeft } from 'lucide-react';

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

interface PhotoUploadProps {
  quest: Quest;
  onBack: () => void;
  onSubmit: (questId: string, imageData: string) => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ quest, onBack, onSubmit }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setSelectedImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) return;

    setIsUploading(true);
    
    // Simuler un upload (remplacer par votre logique d'upload)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Sauvegarder l'image et marquer la quête comme terminée
    onSubmit(quest.id, selectedImage);
    
    setIsUploading(false);
    setUploadSuccess(true);
    
    // Retourner au menu après 2 secondes
    setTimeout(() => {
      onBack();
    }, 2000);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (uploadSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Quête terminée !
          </h2>
          <p className="text-gray-600 mb-6">
            Votre preuve a été envoyée avec succès. Un administrateur va la valider sous peu.
          </p>
          <p className="text-sm text-gray-500">
            Retour au menu dans quelques secondes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full">
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {quest.title}
          </h2>
          <p className="text-gray-600 mb-6">
            {quest.description}
          </p>
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-lg">
            <span className="font-semibold">Récompense:</span>
            <span className={`font-bold ${quest.stampData.color}`}>
              {quest.stampData.country}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {!selectedImage ? (
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Prenez une photo
              </h3>
              <p className="text-gray-600 mb-6">
                Uploadez une photo de votre ticket ou preuve de participation
              </p>
              <button
                onClick={handleCameraCapture}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 mx-auto"
              >
                <Upload className="w-5 h-5" />
                Choisir une photo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={selectedImage}
                  alt="Photo sélectionnée"
                  className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={handleCameraCapture}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Changer la photo
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isUploading}
                  className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Envoi...
                    </div>
                  ) : (
                    'Envoyer la preuve'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotoUpload;
