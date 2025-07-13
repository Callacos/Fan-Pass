import React from 'react';
import { useWeb3 } from '../hooks/useWeb3';
import ParticlesBackground from './background';

const NFT_QUESTS = [
  { key: 'bronze', name: 'Étoile de bronze', description: 'Récompense pour les premiers pas de supporter.' },
  { key: 'welcome', name: 'Bienvenue, jeune supporter !', description: 'Pour votre arrivée dans la communauté PSG.' },
  { key: 'carte_postale', name: 'Bienvenue aux USA !', description: 'Pour avoir suivi le PSG à l’international.' },
  { key: 'compulsive_buyer', name: 'Pourquoi autant de maillots ?!', description: 'Pour les collectionneurs de maillots.' },
  { key: 'first_match', name: 'Première au Parc !', description: 'Pour votre première visite au Parc des Princes.' },
  { key: 'tenth_match', name: '10e fois au Parc des Princes !', description: 'Pour les fidèles du Parc.' },
];

interface ChallengesProps {
  onBackToMenu?: () => void;
  onOpenCollection?: () => void;
}

const Challenges: React.FC<ChallengesProps> = ({ onBackToMenu, onOpenCollection }) => {
  const { mintNftForUser, userAddress, connectWallet } = useWeb3();
  const [loading, setLoading] = React.useState<string | null>(null);


  const handleMint = async (key: string) => {
    if (!userAddress) {
      await connectWallet();
      return;
    }
    setLoading(key);
    await mintNftForUser(key);
    setLoading(null);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center font-orbitron py-8 relative min-h-screen overflow-hidden">
      <ParticlesBackground />
      {/* Navigation Buttons */}
      <div className="absolute top-4 left-4 flex gap-4 z-20">
        {onBackToMenu && (
          <button
            onClick={onBackToMenu}
            className="bg-gray-900/80 border-2 border-red-500 text-white rounded-full px-5 py-2 font-bold shadow-lg hover:bg-red-700 hover:text-yellow-300 transition-colors duration-200"
          >
            Home
          </button>
        )}
        {onOpenCollection && (
          <button
            onClick={onOpenCollection}
            className="bg-gray-900/80 border-2 border-red-500 text-white rounded-full px-5 py-2 font-bold shadow-lg hover:bg-red-700 hover:text-yellow-300 transition-colors duration-200"
          >
            Passport
          </button>
        )}
      </div>
      <h1 className="text-4xl font-bold mb-10 text-red-500 drop-shadow-lg tracking-widest uppercase">Quêtes NFT PSG</h1>
      <div className="flex flex-wrap gap-8 justify-center w-full max-w-4xl">
        {NFT_QUESTS.map(q => (
          <div
            key={q.key}
            className="bg-gradient-to-br from-gray-900 via-red-900 to-gray-800 border-2 border-red-500 rounded-2xl shadow-2xl p-8 min-w-[260px] flex flex-col items-center transition-transform duration-300 hover:scale-105 relative group"
          >
            <div className="text-2xl font-bold mb-2 text-white text-center group-hover:text-red-300 transition-colors duration-300">
              {q.name}
            </div>
            <div className="text-base text-red-100 mb-6 text-center max-w-xs">
              {q.description}
            </div>
            <button
              className={`bg-gradient-to-r from-red-500 to-yellow-400 hover:from-red-400 hover:to-yellow-300 text-white font-bold py-2 px-6 rounded shadow-lg transition-colors mt-2 w-full ${loading === q.key ? 'opacity-60 cursor-not-allowed' : ''}`}
              disabled={loading === q.key}
              onClick={() => handleMint(q.key)}
            >
              {loading === q.key ? 'Minage en cours...' : 'Valider & Obtenir le NFT'}
            </button>
            <div className="absolute -inset-1 rounded-2xl pointer-events-none group-hover:shadow-red-400/40 group-hover:shadow-2xl transition-all duration-300" />
          </div>
        ))}
      </div>
      <div className="mt-10 text-sm text-red-200">
        {userAddress ? (
          <span className="bg-gray-800 px-3 py-1 rounded-lg border border-red-500 text-red-200 font-mono">Connecté : {userAddress.slice(0, 6)}...{userAddress.slice(-4)}</span>
        ) : (
          <span className="bg-gray-800 px-3 py-1 rounded-lg border border-red-500 text-red-200">Connectez votre wallet pour minter</span>
        )}
      </div>
    </div>
  );
};

export default Challenges;