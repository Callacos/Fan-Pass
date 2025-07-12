import React from 'react';
import { useWeb3 } from '../hooks/useWeb3';

const NFT_QUESTS = [
  { key: 'bronze', name: 'Étoile de bronze', description: 'Récompense pour les premiers pas de supporter.' },
  { key: 'welcome', name: 'Bienvenue, jeune supporter !', description: 'Pour votre arrivée dans la communauté PSG.' },
  { key: 'carte_postale', name: 'Bienvenue aux USA !', description: 'Pour avoir suivi le PSG à l’international.' },
  { key: 'compulsive_buyer', name: 'Pourquoi autant de maillots ?!', description: 'Pour les collectionneurs de maillots.' },
  { key: 'first_match', name: 'Première au Parc !', description: 'Pour votre première visite au Parc des Princes.' },
  { key: 'tenth_match', name: '10e fois au Parc des Princes !', description: 'Pour les fidèles du Parc.' },
];

const Challenges: React.FC = () => {
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
    <div style={{ minHeight: '100vh', background: '#10142a', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 32, marginBottom: 24, color: '#E30A17' }}>Quêtes NFT PSG</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
        {NFT_QUESTS.map(q => (
          <div key={q.key} style={{ background: '#1a1a2e', borderRadius: 12, padding: 24, minWidth: 260, boxShadow: '0 2px 12px #0008', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{q.name}</div>
            <div style={{ fontSize: 15, color: '#ccc', marginBottom: 18, textAlign: 'center' }}>{q.description}</div>
            <button
              style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 22px', fontWeight: 600, fontSize: 16, cursor: loading === q.key ? 'not-allowed' : 'pointer', opacity: loading === q.key ? 0.6 : 1 }}
              disabled={loading === q.key}
              onClick={() => handleMint(q.key)}
            >
              {loading === q.key ? 'Minage en cours...' : 'Valider & Obtenir le NFT'}
            </button>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 32, fontSize: 15, color: '#aaa' }}>
        {userAddress ? `Connecté : ${userAddress.slice(0, 6)}...${userAddress.slice(-4)}` : 'Connectez votre wallet pour minter'}
      </div>
    </div>
  );
};

export default Challenges;