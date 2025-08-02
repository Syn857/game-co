import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Share2, Home, Trophy, Users } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { CIRCUIT_OVERSEER_NAME } from '@/data/questions';

export default function ThankYou() {
  const navigate = useNavigate();
  const [totalParticipants, setTotalParticipants] = useState(0);
  const { gameState, resetGame, getParticipants, subscribeToParticipants } = useGame();

  // Redirect if game not completed
  useEffect(() => {
    if (!gameState.isCompleted || !gameState.participantName) {
      navigate('/');
    }
  }, [gameState.isCompleted, gameState.participantName, navigate]);

  // Subscribe to participant count updates
  useEffect(() => {
    const unsubscribe = subscribeToParticipants((participants) => {
      setTotalParticipants(participants.length);
    });
    
    // Fallback to get initial count
    const loadInitialCount = async () => {
      try {
        const participants = await getParticipants();
        setTotalParticipants(participants.length);
      } catch (error) {
        console.error('Error loading initial participant count:', error);
      }
    };
    
    loadInitialCount();
    
    return () => {
      unsubscribe();
    };
  }, [subscribeToParticipants, getParticipants]);

  const handlePlayAgain = () => {
    resetGame();
    navigate('/');
  };

  const handleShare = async () => {
    const shareData = {
      title: `${CIRCUIT_OVERSEER_NAME} Farewell Game`,
      text: `I just participated in a special farewell game for ${CIRCUIT_OVERSEER_NAME}! Join me in sharing memories and appreciation.`,
      url: window.location.origin
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Fallback to copying to clipboard
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    const text = `Join me in a special farewell game for ${CIRCUIT_OVERSEER_NAME}! ${window.location.origin}`;
    navigator.clipboard.writeText(text).then(() => {
      alert('Link copied to clipboard!');
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gold-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          {/* Celebration Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              delay: 0.2 
            }}
            className="mb-8"
          >
            <div className="relative">
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 1.1, 1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  repeatDelay: 3 
                }}
                className="inline-block"
              >
                <Trophy className="text-gold-500 mx-auto" size={80} />
              </motion.div>
              
              {/* Floating hearts */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    y: [-20, -60, -100],
                    x: [0, Math.random() * 40 - 20]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.5,
                    repeatDelay: 2
                  }}
                  className="absolute top-0 left-1/2 transform -translate-x-1/2"
                >
                  <Heart className="text-red-400" size={16} fill="currentColor" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Thank You Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-blue-600 mb-4">
              Thank You, {gameState.participantName}!
            </h1>
            
            <p className="text-xl text-gray-700 mb-6">
              Your heartfelt responses have been saved and will be part of a special memory collection for {CIRCUIT_OVERSEER_NAME}.
            </p>
          </motion.div>

          {/* Completion Stats */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">
              Game Complete! 🎉
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{gameState.answers.length}</div>
                <div className="text-sm text-gray-600">Questions Answered</div>
              </div>
              
              <div className="p-4 bg-gold-50 rounded-lg">
                <div className="text-2xl font-bold text-gold-600">{totalParticipants}</div>
                <div className="text-sm text-gray-600">Total Participants</div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">100%</div>
                <div className="text-sm text-gray-600">Completion Rate</div>
              </div>
            </div>
          </motion.div>

          {/* What Happens Next */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <h3 className="text-xl font-semibold text-blue-600 mb-4">
              What Happens Next?
            </h3>
            
            <div className="text-left space-y-3 text-gray-700">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-bold">1</span>
                </div>
                <p>Your responses are securely stored and will be compiled with others.</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-bold">2</span>
                </div>
                <p>The organizers will create a beautiful memory book from all submissions.</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-bold">3</span>
                </div>
                <p>{CIRCUIT_OVERSEER_NAME} will receive this special collection as a farewell gift.</p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="space-y-4"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleShare}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-gold-500 text-white rounded-lg hover:from-blue-700 hover:to-gold-600 transition-all duration-200 transform hover:scale-105"
              >
                <Share2 size={20} />
                <span>Share with Others</span>
              </button>
              
              <button
                onClick={handlePlayAgain}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <Home size={20} />
                <span>Back to Home</span>
              </button>
            </div>
            
            <p className="text-sm text-gray-500">
              Encourage others to participate by sharing the game link!
            </p>
          </motion.div>

          {/* Participation Encouragement */}
          {totalParticipants < 10 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-8 p-4 bg-gold-50 border border-gold-200 rounded-lg"
            >
              <div className="flex items-center justify-center space-x-2 text-gold-700">
                <Users size={20} />
                <span className="font-medium">
                  Help us reach more participants! Share the game with your friends.
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}