import React from "react";
import { useWeb3 } from "../hooks/useWeb3";
import ParticlesBackground from "./background";

const NFT_QUESTS = [
  {
    key: "bronze",
    name: "Étoile de bronze",
    description: "Récompense pour les premiers pas de supporter.",
  },
  {
    key: "welcome",
    name: "Bienvenue, jeune supporter !",
    description: "Pour votre arrivée dans la communauté PSG.",
  },
  {
    key: "carte_postale",
    name: "Bienvenue aux USA !",
    description: "Pour avoir suivi le PSG à l’international.",
  },
  {
    key: "compulsive_buyer",
    name: "Pourquoi autant de maillots ?!",
    description: "Pour les collectionneurs de maillots.",
  },
  {
    key: "first_match",
    name: "Première au Parc !",
    description: "Pour votre première visite au Parc des Princes.",
  },
  {
    key: "tenth_match",
    name: "10e fois au Parc des Princes !",
    description: "Pour les fidèles du Parc.",
  },
];

const FILTERS = [
  { key: "all", label: "Toutes", emoji: "🌐" },
  { key: "completed", label: "Terminées", emoji: "✅" },
  { key: "active", label: "Actives", emoji: "🔥" },
  { key: "locked", label: "Verrouillé", emoji: "🔒" },
  { key: "xp", label: "+500xp", emoji: "💎" },
];

interface ChallengesProps {
  onBackToMenu?: () => void;
  onOpenCollection?: () => void;
}

const Challenges: React.FC<ChallengesProps> = ({
  onBackToMenu,
  onOpenCollection,
}) => {
  const { mintNftForUser, userAddress, connectWallet } = useWeb3();
  const [loading, setLoading] = React.useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = React.useState("all");

  const handleMint = async (key: string) => {
    if (!userAddress) {
      await connectWallet();
      return;
    }
    setLoading(key);
    await mintNftForUser(key);
    setLoading(null);
  };

  // Mock de statut pour la démo (à remplacer par la vraie logique métier)
  const getQuestStatus = (q: any) => {
    if (q.key === "bronze" || q.key === "welcome") return "completed";
    if (q.key === "carte_postale" || q.key === "compulsive_buyer")
      return "active";
    if (q.key === "first_match") return "locked";
    if (q.key === "tenth_match") return "xp";
    return "active";
  };

  const filteredQuests = NFT_QUESTS.filter((q) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "completed")
      return getQuestStatus(q) === "completed";
    if (selectedFilter === "active") return getQuestStatus(q) === "active";
    if (selectedFilter === "locked") return getQuestStatus(q) === "locked";
    if (selectedFilter === "xp") return getQuestStatus(q) === "xp";
    return true;
  });

  return (
    <div className="w-full flex flex-col items-center justify-center font-orbitron py-8 relative min-h-screen overflow-hidden">
      <ParticlesBackground />
      {/* Navigation Buttons */}
      <div className="absolute top-4 left-4 flex gap-4 z-20">
        {onBackToMenu && (
          <button
            onClick={onBackToMenu}
            className="cyber-action-button primary"
            style={{
              minWidth: 110,
              padding: "0.5rem 1.2rem",
              fontSize: "0.95rem",
            }}
          >
            HOME
            <div className="button-glow"></div>
            <div className="button-border"></div>
          </button>
        )}
        {onOpenCollection && (
          <button
            onClick={onOpenCollection}
            className="cyber-action-button secondary"
            style={{
              minWidth: 110,
              padding: "0.5rem 1.2rem",
              fontSize: "0.95rem",
            }}
          >
            PASSPORT
            <div className="button-glow"></div>
            <div className="button-border"></div>
          </button>
        )}
      </div>
      <h1 className="text-4xl font-bold mb-6 text-pink-500 drop-shadow-lg tracking-widest uppercase">
        Quêtes NFT PSG
      </h1>
      {/* Filtres de quêtes */}
      <div className="flex flex-row gap-4 mb-10">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setSelectedFilter(f.key)}
            className={`cyber-action-button ${
              selectedFilter === f.key ? "primary" : "secondary"
            } px-4 py-2 flex items-center gap-2`}
            style={{
              fontSize: "1rem",
              minWidth: 110,
              opacity: selectedFilter === f.key ? 1 : 0.7,
            }}
          >
            <span>{f.emoji}</span>
            <span>{f.label}</span>
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-8 justify-center w-full max-w-4xl">
        {filteredQuests.map((q) => (
          <div
            key={q.key}
            className="bg-gradient-to-br from-[#181222] via-[#241432] to-[#ff007a22] border-2 border-pink-500 rounded-2xl shadow-2xl p-8 min-w-[260px] flex flex-col items-center transition-transform duration-300 hover:scale-105 relative group"
          >
            <div className="text-2xl font-bold mb-2 text-white text-center group-hover:text-pink-300 transition-colors duration-300">
              {q.name}
            </div>
            <div className="text-base text-pink-100 mb-6 text-center max-w-xs">
              {q.description}
            </div>
            <button
              className={`cyber-action-button secondary w-full mt-2 ${
                loading === q.key ? "opacity-60 cursor-not-allowed" : ""
              }`}
              style={{
                minWidth: 110,
                padding: "0.5rem 1.2rem",
                fontSize: "0.95rem",
              }}
              disabled={loading === q.key}
              onClick={() => handleMint(q.key)}
            >
              {loading === q.key
                ? "Minage en cours..."
                : "Valider & Obtenir le NFT"}
              <div className="button-glow"></div>
              <div className="button-border"></div>
            </button>
            <div className="absolute -inset-1 rounded-2xl pointer-events-none group-hover:shadow-pink-400/40 group-hover:shadow-2xl transition-all duration-300" />
          </div>
        ))}
      </div>
      <div className="mt-10 text-sm text-red-200">
        {userAddress ? (
          <span className="bg-gray-800 px-3 py-1 rounded-lg border border-red-500 text-red-200 font-mono">
            Connecté : {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
          </span>
        ) : (
          <span className="bg-gray-800 px-3 py-1 rounded-lg border border-red-500 text-red-200">
            Connectez votre wallet pour minter
          </span>
        )}
      </div>
    </div>
  );
};

export default Challenges;
