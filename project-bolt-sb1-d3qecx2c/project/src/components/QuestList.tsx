import React, { useState, useEffect } from 'react';
import { Camera, CheckCircle, Clock, MapPin } from 'lucide-react';

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

interface QuestListProps {
  onStartQuest: (quest: Quest) => void;
  onOpenPassport: () => void;
}

const QuestList: React.FC<QuestListProps> = ({ onStartQuest, onOpenPassport }) => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuests();
  }, []);

  const loadQuests = async () => {
    try {
      // Charger les quêtes depuis le fichier JSON
      const response = await fetch('/quests.json');
      const data = await response.json();
      
      // Charger les données sauvegardées depuis le localStorage
      const savedQuests = localStorage.getItem('passportQuests');
      if (savedQuests) {
        const parsedQuests = JSON.parse(savedQuests);
        // Fusionner avec les données de base
        const mergedQuests = data.quests.map((quest: Quest) => {
          const saved = parsedQuests.find((q: Quest) => q.id === quest.id);
          return saved ? { ...quest, ...saved } : quest;
        });
        setQuests(mergedQuests);
      } else {
        setQuests(data.quests);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des quêtes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuest = (quest: Quest) => {
    if (quest.completed) return;
    onStartQuest(quest);
  };

  const getCompletedQuestsCount = () => {
    return quests.filter(q => q.completed).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Mes Quêtes de Voyage
          </h2>
          <p className="text-gray-600 mb-6">
            Complétez les quêtes ci-dessous pour débloquer des tampons exclusifs dans votre passeport !
          </p>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg">
              <span className="font-semibold">{getCompletedQuestsCount()}</span> / {quests.length} quêtes complétées
            </div>
            <button
              onClick={onOpenPassport}
              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105"
            >
              Voir mon Passeport
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quests.map((quest) => (
            <div
              key={quest.id}
              className={`border-2 rounded-xl p-6 transition-all duration-300 ${
                quest.completed
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-200 hover:border-red-300 hover:shadow-lg'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    quest.completed ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    {quest.completed ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <Clock className="w-6 h-6 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{quest.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4" />
                      <span>Tampon {quest.stampData.country}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    quest.completed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {quest.completed ? 'Complétée' : 'En attente'}
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4">{quest.description}</p>

              {quest.completed && quest.proofImage && (
                <div className="mb-4">
                  <img 
                    src={quest.proofImage} 
                    alt="Preuve de la quête" 
                    className="w-full h-32 object-cover rounded-lg border-2 border-green-200"
                  />
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>Récompense:</span>
                  <span className={`font-semibold ${quest.stampData.color}`}>
                    {quest.stampData.country}
                  </span>
                </div>
                <button
                  onClick={() => handleStartQuest(quest)}
                  disabled={quest.completed}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    quest.completed
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-red-600 text-white hover:bg-red-700 transform hover:scale-105'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  {quest.completed ? 'Terminée' : 'Réalisé'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestList;
