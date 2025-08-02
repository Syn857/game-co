import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Users,
  Download,
  FileText,
  Search,
  Eye,
  EyeOff,
  RefreshCw,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { Participant } from '@/types';
import { questions, ADMIN_PASSWORD, CIRCUIT_OVERSEER_NAME } from '@/data/questions';
import jsPDF from 'jspdf';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { getParticipants, subscribeToParticipants } = useGame();

  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(true);
      // Subscribe to real-time updates from Firebase
      const unsubscribe = subscribeToParticipants((newParticipants) => {
        setParticipants(newParticipants);
        setIsLoading(false);
      });

      // Cleanup subscription on unmount
      return () => {
        unsubscribe();
      };
    }
  }, [isAuthenticated, subscribeToParticipants]);

  const loadParticipants = async () => {
    // This function is kept for manual refresh if needed
    setIsLoading(true);
    try {
      const data = await getParticipants();
      setParticipants(data);
    } catch (error) {
      console.error('Error loading participants:', error);
    }
    setIsLoading(false);
  };

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPassword('');
    } else {
      alert('Incorrect password. Please try again.');
    }
  };

  const filteredParticipants = participants.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToPDF = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = margin;

    // Title
    pdf.setFontSize(20);
    pdf.setTextColor(44, 82, 130); // Blue color
    pdf.text(`${CIRCUIT_OVERSEER_NAME} - Farewell Game Responses`, margin, yPosition);
    yPosition += 15;

    // Summary
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Total Participants: ${participants.length}`, margin, yPosition);
    yPosition += 10;
    pdf.text(`Generated: ${new Date().toLocaleDateString()}`, margin, yPosition);
    yPosition += 20;

    // Responses
    participants.forEach((participant, index) => {
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = margin;
      }

      // Participant name
      pdf.setFontSize(14);
      pdf.setTextColor(44, 82, 130);
      pdf.text(`${index + 1}. ${participant.name}`, margin, yPosition);
      yPosition += 10;

      // Completion date
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Completed: ${new Date(participant.completedAt).toLocaleString()}`, margin, yPosition);
      yPosition += 15;

      // Answers
      participant.answers.forEach(answer => {
        const question = questions.find(q => q.id === answer.questionId);
        if (question) {
          if (yPosition > 250) {
            pdf.addPage();
            yPosition = margin;
          }

          pdf.setFontSize(10);
          pdf.setTextColor(0, 0, 0);

          // Question
          const questionText = `Q${question.id}: ${question.question.replace('[Name]', CIRCUIT_OVERSEER_NAME)}`;
          const questionLines = pdf.splitTextToSize(questionText, pageWidth - 2 * margin);
          pdf.text(questionLines, margin, yPosition);
          yPosition += questionLines.length * 5;

          // Answer
          pdf.setTextColor(60, 60, 60);
          const answerLines = pdf.splitTextToSize(`A: ${answer.answer}`, pageWidth - 2 * margin);
          pdf.text(answerLines, margin, yPosition);
          yPosition += answerLines.length * 5 + 5;
        }
      });

      yPosition += 10;
    });

    pdf.save(`${CIRCUIT_OVERSEER_NAME.replace(' ', '_')}_farewell_responses.pdf`);
  };

  const exportToCSV = () => {
    const headers = ['Participant Name', 'Completion Date', ...questions.map(q => `Q${q.id}: ${q.question.replace('[Name]', CIRCUIT_OVERSEER_NAME)}`)];

    const csvData = participants.map(participant => {
      const row = [
        participant.name,
        new Date(participant.completedAt).toLocaleString()
      ];

      questions.forEach(question => {
        const answer = participant.answers.find(a => a.questionId === question.id);
        row.push(answer ? answer.answer.replace(/,/g, ';') : 'No answer');
      });

      return row;
    });

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${CIRCUIT_OVERSEER_NAME.replace(' ', '_')}_farewell_responses.csv`;
    link.click();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gold-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md"
        >
          <div className="text-center mb-6">
            <Lock className="mx-auto text-blue-600 mb-4" size={48} />
            <h1 className="text-2xl font-bold text-blue-600">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Enter password to access responses</p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full p-3 pr-12 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              onClick={handleLogin}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-gold-500 text-white rounded-lg hover:from-blue-700 hover:to-gold-600 transition-all duration-200 transform hover:scale-105"
            >Access Dashboard</button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gold-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-blue-600 mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600">
                  {CIRCUIT_OVERSEER_NAME} Farewell Game Responses
                </p>
              </div>

              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <button
                  onClick={loadParticipants}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                  <span>Refresh</span>
                </button>

                <button
                  onClick={() => setIsAuthenticated(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center space-x-4">
                <Users className="text-blue-600" size={32} />
                <div>
                  <div className="text-2xl font-bold text-blue-600">{participants.length}</div>
                  <div className="text-gray-600">Total Participants</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center space-x-4">
                <MessageSquare className="text-gold-600" size={32} />
                <div>
                  <div className="text-2xl font-bold text-gold-600">
                    {participants.reduce((total, p) => total + p.answers.length, 0)}
                  </div>
                  <div className="text-gray-600">Total Responses</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center space-x-4">
                <Calendar className="text-green-600" size={32} />
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {participants.length > 0 ? Math.round((participants.reduce((total, p) => total + p.answers.length, 0) / (participants.length * questions.length)) * 100) : 0}%
                  </div>
                  <div className="text-gray-600">Completion Rate</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Export Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <h2 className="text-xl font-semibold text-blue-600 mb-4">Export Data</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={exportToPDF}
                disabled={participants.length === 0}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FileText size={20} />
                <span>Export as PDF</span>
              </button>

              <button
                onClick={exportToCSV}
                disabled={participants.length === 0}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Download size={20} />
                <span>Export as CSV</span>
              </button>
            </div>
          </motion.div>

          {/* Search and Participants */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h2 className="text-xl font-semibold text-blue-600 mb-4 md:mb-0">
                Participant Responses
              </h2>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search participants..."
                  className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading participants...</p>
              </div>
            ) : filteredParticipants.length === 0 ? (
              <div className="text-center py-8">
                <Users className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600">
                  {participants.length === 0 ? 'No participants yet' : 'No participants match your search'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredParticipants.map((participant, index) => (
                  <motion.div
                    key={participant.name + participant.completedAt}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800">{participant.name}</h3>
                        <p className="text-sm text-gray-600">
                          Completed: {new Date(participant.completedAt).toLocaleString()}
                        </p>
                        <p className="text-sm text-blue-600">
                          {participant.answers.length} of {questions.length} questions answered
                        </p>
                      </div>

                      <button
                        onClick={() => setSelectedParticipant(
                          selectedParticipant?.name === participant.name ? null : participant
                        )}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        {selectedParticipant?.name === participant.name ? 'Hide' : 'View'} Responses
                      </button>
                    </div>

                    <AnimatePresence>
                      {selectedParticipant?.name === participant.name && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-gray-200"
                        >
                          <div className="space-y-4">
                            {participant.answers.map(answer => {
                              const question = questions.find(q => q.id === answer.questionId);
                              return question ? (
                                <div key={answer.questionId} className="bg-gray-50 rounded-lg p-4">
                                  <h4 className="font-medium text-gray-800 mb-2">
                                    Q{question.id}: {question.question.replace('[Name]', CIRCUIT_OVERSEER_NAME)}
                                  </h4>
                                  <p className="text-gray-700">{answer.answer}</p>
                                </div>
                              ) : null;
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
