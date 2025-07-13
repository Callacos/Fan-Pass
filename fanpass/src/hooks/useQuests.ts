import { useState, useEffect } from 'react';

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

interface UseQuestsReturn {
  quests: Quest[];
  loadQuests: () => Promise<void>;
  completeQuest: (questId: string, proofImage: string) => void;
  getCompletedQuests: () => Quest[];
}

export const useQuests = (): UseQuestsReturn => {
  const [quests, setQuests] = useState<Quest[]>([]);

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
    }
  };

  const completeQuest = (questId: string, proofImage: string) => {
    const updatedQuests = quests.map(quest => 
      quest.id === questId 
        ? { ...quest, completed: true, proofImage }
        : quest
    );
    
    setQuests(updatedQuests);
    
    // Sauvegarder dans le localStorage
    localStorage.setItem('passportQuests', JSON.stringify(updatedQuests));
    
    // Simuler la validation automatique pour le MVP
    // Dans une vraie app, cela serait fait côté serveur
    console.log(`Quête ${questId} complétée avec succès!`);
  };

  const getCompletedQuests = (): Quest[] => {
    return quests.filter(quest => quest.completed);
  };

  useEffect(() => {
    loadQuests();
  }, []);

  return {
    quests,
    loadQuests,
    completeQuest,
    getCompletedQuests
  };
};
