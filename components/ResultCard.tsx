
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VideoService, RecommendationItem } from '../types';
import { ServiceIcon } from './Icons';
import { PlayCircle, MessageCircle, Bookmark, Link as LinkIcon, Check, AlertCircle } from 'lucide-react';

interface ResultCardProps {
  service: VideoService;
  recommendation?: RecommendationItem;
  index: number;
  onViewSample: (service: VideoService) => void;
  isDarkMode: boolean;
}

export const ResultCard: React.FC<ResultCardProps> = ({ service, recommendation, index, onViewSample, isDarkMode }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSaveClick = () => {
    setShowConfirm(true);
  };

  const confirmSave = () => {
    setShowConfirm(false);
    try {
      const savedItem = {
        id: service.id,
        reason: recommendation?.reason || "Selected from catalog",
        timestamp: new Date().toISOString()
      };
      
      const existing = localStorage.getItem('b2w_saved_recommendations');
      const list = existing ? JSON.parse(existing) : [];
      
      // Check for duplicates
      if (!list.some((item: any) => item.id === service.id)) {
        list.push(savedItem);
        localStorage.setItem('b2w_saved_recommendations', JSON.stringify(list));
      }
      
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (e) {
      console.error("Failed to save to localStorage", e);
    }
  };

  const handleCopyLink = () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('serviceId', service.id);
      if (recommendation) {
        url.searchParams.set('reason', recommendation.reason);
      }
      
      navigator.clipboard.writeText(url.toString());
      
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (e) {
      console.error("Failed to copy link", e);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ 
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: index * 0.15 
      }}
      className={`relative rounded-xl shadow-sm border overflow-hidden transition-all duration-300 flex flex-col h-full ${
        isDarkMode 
          ? 'bg-gray-800 border-gray-700 hover:shadow-2xl hover:shadow-blue-900/20 hover:border-gray-600' 
          : 'bg-white border-gray-100 hover:shadow-2xl hover:border-blue-200'
      }`}
      role="article"
      aria-labelledby={`card-title-${service.id}`}
    >
      {/* Confirmation Overlay */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 z-20 flex items-center justify-center p-6 ${isDarkMode ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-sm`}
          >
            <div className="text-center w-full">
              <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 ${isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Save Recommendation?</h4>
              <p className={`text-sm mb-6 leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Save <strong>{service.title}</strong> to your shortlist for later review?
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowConfirm(false)}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors border ${isDarkMode ? 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSave}
                  className="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                >
                  Confirm
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-6 flex-grow flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
              <ServiceIcon name={service.iconName} />
            </div>
            <div>
              <h3 
                id={`card-title-${service.id}`}
                className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
              >
                {service.title}
              </h3>
              <span className={`text-xs font-medium uppercase tracking-wider px-2 py-1 rounded-full mt-1 inline-block ${
                isDarkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-600'
              }`}>
                {service.category} {service.subCategory && ` • ${service.subCategory}`}
              </span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-1">
            <button
              onClick={handleCopyLink}
              className={`p-2 rounded-full transition-colors ${
                isDarkMode 
                  ? 'text-gray-400 hover:bg-gray-700 hover:text-white' 
                  : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'
              }`}
              aria-label={isCopied ? "Link copied" : "Copy link to this recommendation"}
              title="Copy Link"
            >
              <AnimatePresence mode="wait">
                {isCopied ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Check className="w-5 h-5 text-green-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="link"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <LinkIcon className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
            <button
              onClick={handleSaveClick}
              className={`p-2 rounded-full transition-colors ${
                isDarkMode 
                  ? 'text-gray-400 hover:bg-gray-700 hover:text-white' 
                  : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'
              }`}
              aria-label={isSaved ? "Saved to list" : "Save this recommendation"}
              title="Save Recommendation"
            >
              <AnimatePresence mode="wait">
                {isSaved ? (
                   <motion.div
                     key="saved"
                     initial={{ scale: 0 }}
                     animate={{ scale: 1 }}
                     exit={{ scale: 0 }}
                   >
                     <Check className="w-5 h-5 text-green-500" />
                   </motion.div>
                ) : (
                  <motion.div
                    key="save"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Bookmark className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        <p className={`mb-6 leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {service.description}
        </p>

        {recommendation ? (
          <div className={`rounded-lg p-4 mb-6 border ${isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-100'}`}>
            <h4 className={`text-sm font-semibold mb-2 flex items-center ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              <span className="mr-2" aria-hidden="true">💡</span> Why this matches?
            </h4>
            <p className={`text-sm italic ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              "{recommendation.reason}"
            </p>
            {recommendation.matchedKeywords.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {recommendation.matchedKeywords.map((keyword, i) => (
                  <span key={i} className={`text-xs border px-2 py-1 rounded ${
                    isDarkMode ? 'bg-gray-800 border-gray-600 text-gray-400' : 'bg-white border-gray-200 text-gray-500'
                  }`}>
                    "{keyword}"
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : (
           <div className={`rounded-lg p-4 mb-6 border ${isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-100'}`}>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Explore our {service.category.toLowerCase()} services to find the perfect match for your needs.
              </p>
           </div>
        )}

        <div className="flex gap-3 mt-auto">
          <button 
            onClick={() => onViewSample(service)}
            className={`flex-1 flex items-center justify-center font-medium py-2.5 px-4 border rounded-lg transition-colors text-sm group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isDarkMode 
                ? 'bg-transparent text-blue-400 border-blue-500 hover:bg-blue-900/20 focus:ring-offset-gray-900' 
                : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'
            }`}
            aria-label={`View sample video for ${service.title}`}
          >
            <PlayCircle className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            View Samples
          </button>
          <button 
            onClick={() => alert(`Thanks for your interest in ${service.title}! A B2W consultant will reach out shortly.`)}
            className="flex-1 flex items-center justify-center bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm shadow-sm group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label={`Consult team about ${service.title}`}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Consult Team
          </button>
        </div>
      </div>
    </motion.article>
  );
};
