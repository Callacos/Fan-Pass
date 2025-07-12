import { useState, useEffect, useCallback } from 'react';

const Challenges = () => {
  const challengeDatabase = [
    { emoji: "⚽", xp: 50, progress: 70, status: "active", name: "Premier Fan Token", category: "social", description: "Obtenez votre premier Fan Token sur la Chiliz Chain", objective: "Acheter 1 Fan Token" },
    { emoji: "🗳️", xp: 100, progress: 40, status: "active", name: "Démocrate Numérique", category: "governance", description: "Participez aux votes de votre équipe favorite", objective: "Voter 5 fois" },
    { emoji: "🎪", xp: 75, progress: 100, status: "completed", name: "Explorateur Social", category: "social", description: "Connectez-vous avec d'autres fans", objective: "10 connexions" },
    { emoji: "💰", xp: 200, progress: 60, status: "active", name: "Investisseur Stratégique", category: "trading", description: "Tradez des Fan Tokens efficacement", objective: "Volume 1000 CHZ" },
    { emoji: "🏟️", xp: 300, progress: 0, status: "locked", name: "Maître du Stade", category: "events", description: "Assistez à des matchs virtuels", objective: "3 matchs + prédictions" },
    { emoji: "🔥", xp: 500, progress: 80, status: "active", name: "Streaker Légendaire", category: "loyalty", description: "Maintenez une série d'activité", objective: "30 jours consécutifs" },
    { emoji: "🚀", xp: 150, progress: 25, status: "active", name: "Pionnier NFT", category: "collectibles", description: "Collectionnez des NFT exclusifs", objective: "Obtenir 5 NFT rares" },
    { emoji: "⭐", xp: 250, progress: 90, status: "active", name: "Champion des Votes", category: "governance", description: "Devenez un leader communautaire", objective: "50 votes + 10 propositions" },
    { emoji: "🎮", xp: 120, progress: 100, status: "completed", name: "Gamer Ultime", category: "gaming", description: "Maîtrisez tous les mini-jeux", objective: "Score parfait 5 jeux" },
    { emoji: "💎", xp: 400, progress: 15, status: "active", name: "Collectionneur Rare", category: "collectibles", description: "Rassemblez des items légendaires", objective: "3 items mythiques" },
    { emoji: "🌟", xp: 180, progress: 0, status: "locked", name: "Influenceur Fan", category: "social", description: "Créez du contenu viral", objective: "1000 vues + 100 likes" },
    { emoji: "🏆", xp: 350, progress: 35, status: "active", name: "Légende Sportive", category: "sports", description: "Excellez dans les prédictions", objective: "Taux de réussite 80%" },
    { emoji: "🎯", xp: 90, progress: 100, status: "completed", name: "Prédicteur Pro", category: "prediction", description: "Prédisez 10 résultats consécutifs", objective: "10 prédictions justes" },
    { emoji: "💪", xp: 220, progress: 55, status: "active", name: "Force d'Elite", category: "loyalty", description: "Prouvez votre dévouement ultime", objective: "Score loyalty 1000+" },
    { emoji: "🔮", xp: 320, progress: 0, status: "locked", name: "Oracle du Futur", category: "prediction", description: "Maîtrisez l'art de la prédiction", objective: "Prédire 5 matchs parfaits" },
    { emoji: "🎨", xp: 140, progress: 70, status: "active", name: "Artiste Digital", category: "creativity", description: "Créez du contenu artistique", objective: "5 créations approuvées" },
    { emoji: "⚔️", xp: 280, progress: 45, status: "active", name: "Guerrier des Stats", category: "analytics", description: "Analysez les performances d'équipe", objective: "Analyser 20 matchs" },
    { emoji: "🌍", xp: 160, progress: 85, status: "active", name: "Ambassadeur Global", category: "community", description: "Représentez votre équipe mondialement", objective: "Recruter 25 fans" },
    { emoji: "🔥", xp: 380, progress: 20, status: "active", name: "Burning Passion", category: "loyalty", description: "Montrez votre passion ardente", objective: "Streak 100 jours" },
    { emoji: "🚁", xp: 290, progress: 0, status: "locked", name: "Vol en Formation", category: "team", description: "Coordonnez une action d'équipe", objective: "Mission à 10 joueurs" }
  ];

  const [currentChallenges, setCurrentChallenges] = useState([]);
  const [challengesLoaded, setChallengesLoaded] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [flippedChallenges, setFlippedChallenges] = useState(new Set());

  // Calcul de la position des quêtes en zigzag
  const calculateChallengePosition = (index) => {
    const row = Math.floor(index / 2);
    const isEven = index % 2 === 0;
    
    return {
      top: row * 300,
      left: isEven ? '10%' : 'auto',
      right: isEven ? 'auto' : '10%'
    };
  };

  // Calcul du stroke-dashoffset pour le cercle de progression
  const calculateStrokeDashoffset = (percentage) => {
    const circumference = 439.82; // 2 * PI * 70
    return circumference - (percentage / 100) * circumference;
  };

  // Chargement des quêtes
  const loadChallenges = useCallback(() => {
    const endIndex = Math.min(challengesLoaded, challengeDatabase.length);
    const newChallenges = [];
    
    for (let i = currentChallenges.length; i < endIndex; i++) {
      const challenge = { ...challengeDatabase[i], hidden: false, id: i };
      newChallenges.push(challenge);
    }
    
    setCurrentChallenges(prev => [...prev, ...newChallenges]);
  }, [challengesLoaded, currentChallenges.length]);

  // Filtrage des quêtes
  const filterChallenges = useCallback((filter) => {
    setCurrentFilter(filter);
    
    setCurrentChallenges(prev => prev.map(challenge => {
      let shouldShow = true;
      
      switch (filter) {
        case 'active':
          shouldShow = challenge.status === 'active';
          break;
        case 'completed':
          shouldShow = challenge.status === 'completed';
          break;
        case 'locked':
          shouldShow = challenge.status === 'locked';
          break;
        case 'high-xp':
          shouldShow = challenge.xp >= 200;
          break;
        case 'all':
        default:
          shouldShow = true;
          break;
      }
      
      return { ...challenge, hidden: !shouldShow };
    }));
  }, []);

  // Scroll infini
  const handleScroll = useCallback(() => {
    if (isLoading || challengesLoaded >= challengeDatabase.length) return;
    
    const scrollPosition = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.offsetHeight;
    
    if (scrollPosition >= documentHeight - 500) {
      setIsLoading(true);
      
      setTimeout(() => {
        setChallengesLoaded(prev => prev + 4);
        setIsLoading(false);
      }, 1500);
    }
  }, [isLoading, challengesLoaded]);

  // Génération de particules
  const createParticles = useCallback(() => {
    const interval = setInterval(() => {
      const activeChallenges = document.querySelectorAll('.challenge-node.active:not(.hidden)');
      activeChallenges.forEach(node => {
        if (Math.random() < 0.3) {
          const particle = document.createElement('div');
          particle.className = 'particle';
          particle.style.left = Math.random() * 100 + '%';
          particle.style.animationDelay = Math.random() * 2 + 's';
          particle.style.position = 'absolute';
          particle.style.width = '2px';
          particle.style.height = '2px';
          particle.style.background = '#ff5252';
          particle.style.borderRadius = '50%';
          particle.style.pointerEvents = 'none';
          particle.style.animation = 'particle 8s linear infinite';
          node.appendChild(particle);
          
          setTimeout(() => {
            if (particle.parentNode) {
              particle.remove();
            }
          }, 8000);
        }
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Flip de carte
  const handleChallengeClick = (challengeId) => {
    setFlippedChallenges(prev => {
      const newSet = new Set(prev);
      if (newSet.has(challengeId)) {
        newSet.delete(challengeId);
      } else {
        newSet.add(challengeId);
      }
      return newSet;
    });
  };

  // Effects
  useEffect(() => {
    loadChallenges();
  }, [challengesLoaded]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    const cleanupParticles = createParticles();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cleanupParticles();
    };
  }, [handleScroll, createParticles]);

  // Render des quêtes visibles avec repositionnement
  const visibleChallenges = currentChallenges.filter(challenge => !challenge.hidden);
  const challengesWithPositions = visibleChallenges.map((challenge, index) => ({
    ...challenge,
    position: calculateChallengePosition(index)
  }));

  return (
    <div className="min-h-screen bg-black text-white font-mono relative overflow-x-hidden">
      <style jsx>{`
        @keyframes challengeAppear {
          from {
            opacity: 0;
            transform: scale(0.5) rotate(180deg);
          }
          to {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }

        @keyframes completedPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(33, 150, 243, 0.3); }
          50% { box-shadow: 0 0 40px rgba(33, 150, 243, 0.6); }
        }

        @keyframes particle {
          0% {
            transform: translateY(0) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
            transform: scale(1);
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) scale(0);
            opacity: 0;
          }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .filter-btn {
          background: linear-gradient(145deg, rgba(26, 26, 26, 0.9), rgba(15, 15, 15, 0.9));
          border: 2px solid rgba(255, 82, 82, 0.3);
          color: #ff8a80;
          padding: 12px 25px;
          border-radius: 25px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          position: relative;
          overflow: hidden;
        }

        .filter-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 82, 82, 0.2), transparent);
          transition: left 0.6s ease;
        }

        .filter-btn:hover::before {
          left: 100%;
        }

        .filter-btn:hover,
        .filter-btn.active {
          background: linear-gradient(145deg, rgba(255, 82, 82, 0.2), rgba(26, 26, 26, 0.9));
          border-color: #ff5252;
          color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(255, 82, 82, 0.3);
        }

        .filter-btn.active {
          background: linear-gradient(145deg, #ff5252, #ff8a80);
          color: #000;
        }

        .challenge-node {
          position: absolute;
          width: 300px;
          height: 200px;
          cursor: pointer;
          transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          opacity: 0;
          animation: challengeAppear 0.8s ease forwards;
        }

        .hex-container {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.8s;
        }

        .hex-container.flipped {
          transform: rotateY(180deg);
        }

        .hexagon,
        .hexagon-back {
          position: absolute;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(26, 26, 26, 0.9), rgba(15, 15, 15, 0.9));
          clip-path: polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 82, 82, 0.3);
          transition: all 0.4s ease;
          backface-visibility: hidden;
        }

        .hexagon-back {
          transform: rotateY(180deg);
          background: #ff5252;
          border-color: #ff5252;
        }

        .challenge-node:hover .hexagon {
          background: linear-gradient(135deg, rgba(255, 82, 82, 0.2), rgba(26, 26, 26, 0.9));
          border-color: #ff5252;
          transform: scale(1.05) rotateZ(2deg);
          box-shadow: 0 0 30px rgba(255, 82, 82, 0.5);
        }

        .challenge-node.locked .hexagon,
        .challenge-node.locked .hexagon-back {
          background: linear-gradient(135deg, rgba(60, 60, 60, 0.3), rgba(40, 40, 40, 0.3));
          border-color: rgba(100, 100, 100, 0.3);
          filter: grayscale(100%);
        }

        .challenge-node.locked .hexagon-back {
          background: #666;
          border-color: #666;
          filter: none;
        }

        .challenge-node.locked:hover .hexagon {
          transform: scale(1.02);
          box-shadow: 0 0 15px rgba(100, 100, 100, 0.3);
        }

        .challenge-node.completed .hexagon,
        .challenge-node.completed .hexagon-back {
          background: linear-gradient(135deg, rgba(33, 150, 243, 0.3), rgba(26, 26, 26, 0.9));
          border-color: #2196f3;
          animation: completedPulse 3s ease-in-out infinite;
        }

        .challenge-node.completed .hexagon-back {
          background: #2196f3;
          border-color: #2196f3;
          animation: none;
        }

        .hex-content {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          width: 75%;
          z-index: 10;
          backface-visibility: hidden;
        }

        .hex-content-back {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotateY(180deg);
          text-align: center;
          width: 80%;
          z-index: 10;
          backface-visibility: hidden;
          padding: 15px;
        }

        .badge-preview {
          width: 50px;
          height: 50px;
          background: linear-gradient(45deg, #ff5252, #ff8a80);
          border-radius: 50%;
          margin: 0 auto 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          box-shadow: 0 0 15px rgba(255, 82, 82, 0.4);
          transition: all 0.3s ease;
        }

        .challenge-node.locked .badge-preview {
          background: linear-gradient(45deg, #666, #888);
          box-shadow: 0 0 10px rgba(100, 100, 100, 0.2);
        }

        .challenge-node.completed .badge-preview {
          background: linear-gradient(45deg, #2196f3, #64b5f6);
          box-shadow: 0 0 15px rgba(33, 150, 243, 0.4);
        }

        .challenge-node:hover .badge-preview {
          transform: scale(1.1) rotateY(10deg);
        }

        .progress-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 280px;
          height: 160px;
          pointer-events: none;
          backface-visibility: hidden;
        }

        .progress-ring svg {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }

        .progress-ring circle {
          fill: none;
          stroke-width: 3;
          stroke-linecap: round;
        }

        .progress-bg {
          stroke: rgba(255, 82, 82, 0.1);
        }

        .progress-fill {
          stroke: #ff5252;
          stroke-dasharray: 439.82;
          transition: stroke-dashoffset 1.2s ease;
          filter: drop-shadow(0 0 3px rgba(255, 82, 82, 0.5));
        }

        .challenge-node.locked .progress-fill {
          stroke: #666;
          filter: none;
        }

        .challenge-node.completed .progress-fill {
          stroke: #2196f3;
          filter: drop-shadow(0 0 3px rgba(33, 150, 243, 0.5));
        }

        .challenge-tooltip {
          position: absolute;
          bottom: -60px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.9);
          padding: 10px 15px;
          border-radius: 10px;
          font-size: 0.8rem;
          white-space: nowrap;
          opacity: 0;
          transition: all 0.3s ease;
          z-index: 20;
          border: 1px solid rgba(255, 82, 82, 0.3);
        }

        .challenge-node:hover .challenge-tooltip {
          opacity: 1;
          transform: translateX(-50%) translateY(-10px);
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255, 82, 82, 0.3);
          border-top: 3px solid #ff5252;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-5 py-10 relative">
        {/* Filtres */}
        <div className="flex justify-center gap-4 mb-20 flex-wrap">
          {[
            { key: 'all', label: '🎯 Toutes' },
            { key: 'active', label: '⚡ Actives' },
            { key: 'completed', label: '✅ Terminées' },
            { key: 'locked', label: '🔒 Verrouillées' },
            { key: 'high-xp', label: '💎 +200 XP' }
          ].map(filter => (
            <button
              key={filter.key}
              className={`filter-btn ${currentFilter === filter.key ? 'active' : ''}`}
              onClick={() => filterChallenges(filter.key)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Compteur */}
        <div className="text-center mb-10 text-xl text-red-300">
          <span>{visibleChallenges.length}</span> quêtes disponibles
        </div>

        {/* Timeline des quêtes */}
        <div 
          className="relative w-full"
          style={{ 
            minHeight: Math.ceil(visibleChallenges.length / 2) * 300 + 100 + 'px'
          }}
        >
          {challengesWithPositions.map((challenge, index) => (
            <div
              key={challenge.id}
              className={`challenge-node ${challenge.status}`}
              style={{
                top: challenge.position.top + 'px',
                left: challenge.position.left,
                right: challenge.position.right,
                animationDelay: (index * 0.1) + 's'
              }}
              onClick={() => handleChallengeClick(challenge.id)}
            >
              <div className={`hex-container ${flippedChallenges.has(challenge.id) ? 'flipped' : ''}`}>
                <div className="hexagon"></div>
                <div className="hexagon-back"></div>
                
                <div className="progress-ring">
                  <svg>
                    <circle className="progress-bg" cx="140" cy="80" r="70"></circle>
                    <circle 
                      className="progress-fill" 
                      cx="140" 
                      cy="80" 
                      r="70" 
                      strokeDashoffset={calculateStrokeDashoffset(challenge.progress)}
                    ></circle>
                  </svg>
                </div>
                
                <div className="hex-content">
                  <div className="badge-preview">{challenge.emoji}</div>
                  <div className={`text-xs font-bold mb-2 leading-tight ${
                    challenge.status === 'locked' ? 'text-gray-500' : 
                    challenge.status === 'completed' ? 'text-blue-300' : 'text-white'
                  }`} style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.7)' }}>
                    {challenge.name}
                  </div>
                  <div className={`text-xs font-bold mb-2 px-2 py-1 rounded-xl border ${
                    challenge.status === 'locked' 
                      ? 'bg-gray-500/20 text-gray-500 border-gray-500/30'
                      : challenge.status === 'completed'
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                        : 'bg-red-500/20 text-red-300 border-red-500/30'
                  }`}>
                    +{challenge.xp} XP
                  </div>
                  <div className={`text-xs font-medium ${
                    challenge.status === 'completed' ? 'text-blue-300' : 'text-gray-500'
                  }`}>
                    {challenge.progress}%
                  </div>
                </div>
                
                <div className="hex-content-back">
                  <div className="text-sm font-extrabold text-white mb-4 uppercase tracking-wide" 
                       style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' }}>
                    {challenge.name}
                  </div>
                  <div className="text-xs text-white leading-relaxed mb-4"
                       style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)' }}>
                    {challenge.description}
                  </div>
                  <div className="text-xs text-white font-semibold"
                       style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)' }}>
                    🎯 {challenge.objective}
                  </div>
                </div>
              </div>
              
              <div className="challenge-tooltip">
                {challenge.name} - {challenge.progress}% {challenge.status === 'completed' ? '✓' : challenge.status === 'locked' ? '🔒' : 'en cours'}
              </div>
            </div>
          ))}
        </div>

        {/* Indicateur de chargement */}
        {isLoading && (
          <div className="text-center py-10 text-red-300 text-xl opacity-100 transition-opacity duration-300">
            <div className="loading-spinner"></div>
            Chargement de nouvelles quêtes...
          </div>
        )}
      </div>
    </div>
  );
};

export default Challenges;