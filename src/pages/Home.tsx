import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Users, Gift } from 'lucide-react';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import { useGame } from '@/context/GameContext';
import { CIRCUIT_OVERSEER_NAME } from '@/data/questions';

export default function Home() {
  const [name, setName] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);
  const navigate = useNavigate();
  const { setParticipantName, subscribeToParticipants, getParticipants } = useGame();
  const [totalParticipants, setTotalParticipants] = useState(0);

  const handleStartGame = () => {
    if (name.trim()) {
      setParticipantName(name.trim());
      navigate('/game');
    }
  };

  const currentUrl = window.location.href;
  // Subscribe to real-time participant count
  useEffect(() => {
    const unsubscribe = subscribeToParticipants((participants) => {
      setTotalParticipants(participants.length);
    });

    // Fallback to initial fetch
    (async () => {
      try {
        const participants = await getParticipants();
        setTotalParticipants(participants.length);
      } catch (error) {
        console.error('Error loading participant count:', error);
      }
    })();

    return () => unsubscribe();
  }, [subscribeToParticipants, getParticipants]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gold-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center space-x-2 mb-4"
            >
              <Heart className="text-gold-500" size={32} />
              <h1 className="text-4xl md:text-5xl font-bold text-blue-600">
                Farewell Celebration
              </h1>
              <Heart className="text-gold-500" size={32} />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-700 mb-2"
            >
              Honoring {CIRCUIT_OVERSEER_NAME}
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-gray-600"
            >
              Share your memories and appreciation in this special interactive game
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* QR Code Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white rounded-xl shadow-lg p-6 text-center"
            >
              <h2 className="text-2xl font-semibold text-blue-600 mb-4 flex items-center justify-center space-x-2">
                <Users size={24} />
                <span>Share with Others</span>
              </h2>

              <QRCodeDisplay url={currentUrl} size={200} />

              <p className="text-sm text-gray-600 mt-4">
                Others can scan this QR code to join the celebration!
              </p>
              <p className="text-sm font-medium text-blue-600 mt-2">
                 {totalParticipants} participant{totalParticipants === 1 ? "" : "s"} so far
               </p>
            </motion.div>

            {/* Game Entry Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-semibold text-blue-600 mb-4 flex items-center space-x-2">
                <Gift size={24} />
                <span>Join the Game</span>
              </h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name to begin"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                    onKeyPress={(e) => e.key === 'Enter' && handleStartGame()}
                  />
                </div>

                <button
                  onClick={handleStartGame}
                  disabled={!name.trim()}
                  className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-gold-500 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-gold-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                >
                  Start the Game
                </button>

                <button
                  onClick={() => setShowInstructions(!showInstructions)}
                  className="w-full py-2 px-4 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  {showInstructions ? 'Hide' : 'Show'} Instructions
                </button>
              </div>
            </motion.div>
          </div>

          {/* Instructions */}
          {showInstructions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-8 bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-xl font-semibold text-blue-600 mb-4">How to Play</h3>
              <div className="grid md:grid-cols-2 gap-6 text-gray-700">
                <div>
                  <h4 className="font-medium mb-2">📝 Answer Questions</h4>
                  <p className="text-sm">You'll be presented with 10 fun questions about {CIRCUIT_OVERSEER_NAME}. Take your time to share thoughtful responses.</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">🎯 Different Formats</h4>
                  <p className="text-sm">Questions include multiple choice, short answers, and creative responses to capture your unique perspective.</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">📱 Mobile Friendly</h4>
                  <p className="text-sm">The game works perfectly on your smartphone, tablet, or computer for your convenience.</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">🎉 Celebrate Together</h4>
                  <p className="text-sm">Your responses will be compiled to create a beautiful farewell memory book for {CIRCUIT_OVERSEER_NAME}.</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Admin Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center mt-8"
          >
            <button
              onClick={() => navigate('/admin')}
              className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
            >
              Admin Dashboard
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
