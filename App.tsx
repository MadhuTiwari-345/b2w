
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SERVICES } from './constants';
import { getRecommendations } from './services/geminiService';
import { RecommendationItem, LoadingState, VideoService } from './types';
import { ResultCard } from './components/ResultCard';
import { SampleModal } from './components/SampleModal';
import { Sparkles, ArrowRight, Loader2, AlertCircle, Moon, Sun, Clapperboard, Film, PenTool, LayoutGrid, Filter } from 'lucide-react';

const App = () => {
  const [inputText, setInputText] = useState('');
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [selectedSample, setSelectedSample] = useState<VideoService | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Browsing and Filtering State
  const [isBrowsing, setIsBrowsing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Loading animation state
  const [loadingStep, setLoadingStep] = useState(0);

  // Derive unique categories
  const categories = ['All', ...Array.from(new Set(SERVICES.map(s => s.category)))];

  // Check for shared URL parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedId = params.get('serviceId');
    const sharedReason = params.get('reason');

    if (sharedId && sharedReason) {
      // Validate service ID exists
      const serviceExists = SERVICES.find(s => s.id === sharedId);
      
      if (serviceExists) {
        setRecommendations([{
          serviceId: sharedId,
          reason: sharedReason,
          matchedKeywords: ['Shared Link']
        }]);
        setInputText("Shared Recommendation");
        setStatus(LoadingState.COMPLETE);
      }
    }
  }, []);

  // Sequenced loading animation effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (status === LoadingState.ANALYZING) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % 3);
      }, 800);
    }
    return () => clearInterval(interval);
  }, [status]);

  // Safely clear URL parameters without triggering SecurityError in blob contexts
  const clearUrlParams = () => {
    try {
      // Skip history manipulation in blob environments or where prohibited
      if (window.location.protocol === 'blob:') return;
      
      const url = new URL(window.location.href);
      url.search = '';
      window.history.replaceState({}, '', url.toString());
    } catch (e) {
      console.warn("Unable to update URL history:", e);
    }
  };

  const handleAnalyze = async () => {
    let query = inputText.trim();
    
    // Auto-fill logic if empty
    if (!query) {
      query = "I need a video to promote my business and get more customers.";
      setInputText(query);
    }

    setStatus(LoadingState.ANALYZING);
    setIsBrowsing(false);
    setSelectedCategory('All');
    setRecommendations([]);
    
    // Clear URL params safely
    clearUrlParams();

    // Artificial delay to allow the new animation to play out a bit
    const minDelayPromise = new Promise(resolve => setTimeout(resolve, 2400));
    
    try {
      const [response] = await Promise.all([
        getRecommendations(query),
        minDelayPromise
      ]);
      
      setRecommendations(response.recommendations);
      setStatus(LoadingState.COMPLETE);
    } catch (error) {
      console.error("Error analyzing:", error);
      setStatus(LoadingState.ERROR);
    }
  };

  const handleBrowse = () => {
    setIsBrowsing(true);
    setStatus(LoadingState.COMPLETE);
    setRecommendations([]);
    setSelectedCategory('All');
    clearUrlParams();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) {
      handleAnalyze();
    }
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Helper to determine what to show based on mode and filter
  const getVisibleServices = () => {
    let items: { service: VideoService, rec?: RecommendationItem }[] = [];
    
    if (isBrowsing) {
      // In browse mode, show ALL services
      items = SERVICES.map(s => ({ service: s }));
    } else {
      // In recommendation mode, show only matched services
      items = recommendations.map(rec => {
        const service = SERVICES.find(s => s.id === rec.serviceId);
        return service ? { service, rec } : null;
      }).filter((item): item is { service: VideoService, rec: RecommendationItem } => item !== null);
    }

    // Apply category filter
    if (selectedCategory !== 'All') {
      items = items.filter(item => item.service.category === selectedCategory);
    }

    return items;
  };

  const visibleServices = getVisibleServices();

  // Loading Sequence Components
  const loadingSteps = [
    { icon: PenTool, text: "Analyzing Concept...", color: "text-blue-500" },
    { icon: Film, text: "Matching Styles...", color: "text-purple-500" },
    { icon: Clapperboard, text: "Curating Services...", color: "text-pink-500" }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 pb-20 font-sans ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-[#f8f9fa] text-gray-900'}`}>
      <AnimatePresence>
        {selectedSample && (
          <SampleModal 
            service={selectedSample} 
            onClose={() => setSelectedSample(null)} 
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <header className={`sticky top-0 z-10 border-b transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white" aria-hidden="true">
              <span className="font-bold text-lg">B</span>
            </div>
            <h1 className={`font-semibold text-xl tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>b2w.tv</h1>
          </div>
          
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-12" role="main">
        
        {/* Hero Section */}
        <div className="text-center mb-10">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4 ${isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'}`}
          >
            <Sparkles className="w-4 h-4 mr-2" aria-hidden="true" />
            AI Video Consultant
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`text-4xl font-extrabold mb-4 tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
          >
            Tell us the kind of video you need.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`text-lg max-w-xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
          >
            Describe your goals, audience, or project idea. Our AI will instantly recommend the perfect b2w.tv services.
          </motion.p>
        </div>

        {/* Input Section */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.3 }}
           className={`p-2 rounded-2xl shadow-sm border transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
        >
          <label htmlFor="prompt-input" className="sr-only">Describe your video needs</label>
          <textarea
            id="prompt-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., We need a promo video for our new AI startup to show investors, or maybe an explainer for the website..."
            className={`w-full h-32 p-4 text-lg bg-transparent border-none focus:ring-0 resize-none rounded-xl ${isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'}`}
          />
          <div className={`px-4 pb-2 flex flex-col sm:flex-row justify-between items-center border-t pt-3 gap-3 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} hidden sm:inline`}>
              Try: "Event aftermovie" or "Product launch ad"
            </span>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleBrowse}
                disabled={status === LoadingState.ANALYZING}
                className={`flex-1 sm:flex-none flex items-center justify-center px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
                  ${isDarkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <LayoutGrid className="w-4 h-4 mr-2" />
                Browse Catalog
              </button>
              <button
                onClick={handleAnalyze}
                disabled={status === LoadingState.ANALYZING}
                className={`flex-1 sm:flex-none flex items-center justify-center px-6 py-2.5 rounded-xl font-medium transition-all duration-200 min-w-[180px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                  ${status === LoadingState.ANALYZING
                    ? isDarkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                  }`}
              >
                <AnimatePresence mode="wait">
                  {status === LoadingState.ANALYZING ? (
                    <motion.div
                      key="analyzing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center"
                    >
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      <span>Processing...</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center"
                    >
                      Get Recommendations
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Results Section */}
        <div className="mt-12" aria-live="polite">
          <AnimatePresence mode="wait">
            {status === LoadingState.ANALYZING && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-3xl mx-auto"
              >
                <div className="flex flex-col items-center justify-center py-12">
                  {/* Enhanced Loading Animation */}
                  <div className="relative mb-8 h-20 w-20 flex items-center justify-center">
                    <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-10"></div>
                    <div className={`relative p-6 rounded-full shadow-lg border z-10 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-100'}`}>
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={loadingStep}
                          initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
                          animate={{ scale: 1, opacity: 1, rotate: 0 }}
                          exit={{ scale: 0.5, opacity: 0, rotate: 20 }}
                          transition={{ duration: 0.3 }}
                        >
                          {React.createElement(loadingSteps[loadingStep].icon, {
                            className: `w-8 h-8 ${loadingSteps[loadingStep].color}`
                          })}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                  
                  <h3 className={`text-xl font-bold mb-2 h-8 transition-all duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={loadingStep}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="block"
                      >
                        {loadingSteps[loadingStep].text}
                      </motion.span>
                    </AnimatePresence>
                  </h3>
                  <p className={`text-center max-w-md ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Our AI is reviewing 10+ video services to match your exact needs.
                  </p>
                </div>

                {/* Skeleton Loader */}
                <div className="grid grid-cols-1 gap-6">
                  {[1, 2].map((i) => (
                    <div key={i} className={`rounded-xl border p-6 h-64 flex flex-col justify-between opacity-40 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                       <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                          <div className="space-y-2 flex-1">
                            <div className={`h-5 rounded w-1/3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                            <div className={`h-3 rounded w-1/4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {status === LoadingState.COMPLETE && (
              <motion.div 
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                  <h2 className={`text-2xl font-bold flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    <span className="mr-2" aria-hidden="true">{isBrowsing ? '📂' : '🎬'}</span> 
                    {isBrowsing ? 'All Video Services' : 'Recommended for you'}
                  </h2>
                  <button 
                    onClick={() => {
                      setStatus(LoadingState.IDLE);
                      setInputText('');
                      setIsBrowsing(false);
                      setSelectedCategory('All');
                      clearUrlParams();
                    }}
                    className="text-sm text-gray-500 hover:text-blue-600 underline focus:outline-none focus:text-blue-600 self-start sm:self-center"
                  >
                    Clear & Start over
                  </button>
                </div>

                {/* Filter Bar */}
                <div className="flex items-center space-x-2 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                  <div className={`flex items-center justify-center p-2 rounded-lg mr-2 ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                    <Filter className="w-4 h-4" />
                  </div>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${
                        selectedCategory === category
                          ? 'bg-blue-600 text-white border-blue-600'
                          : isDarkMode
                            ? 'bg-gray-800 text-gray-300 border-gray-700 hover:border-gray-500'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {visibleServices.length === 0 ? (
                   <div className={`text-center py-12 rounded-xl border border-dashed ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                     <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>No services found for this category.</p>
                     <button 
                       onClick={() => setSelectedCategory('All')} 
                       className="text-blue-600 text-sm mt-2 hover:underline"
                     >
                       Clear filter
                     </button>
                   </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {visibleServices.map((item, index) => (
                      <ResultCard 
                        key={item.service.id + index} 
                        service={item.service} 
                        recommendation={item.rec}
                        index={index}
                        onViewSample={setSelectedSample}
                        isDarkMode={isDarkMode}
                      />
                    ))}
                  </div>
                )}

                {!isBrowsing && (
                  <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: visibleServices.length * 0.1 + 0.2 }}
                      className={`mt-8 text-center rounded-xl p-8 ${isDarkMode ? 'bg-gray-800' : 'bg-blue-50'}`}
                  >
                    <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Want to explore more options?</h3>
                    <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Browse our full catalog of video production services.</p>
                    <button 
                      onClick={() => {
                        handleBrowse();
                        window.scrollTo({ top: 300, behavior: 'smooth' });
                      }}
                      className={`font-bold py-3 px-8 rounded-full shadow-sm hover:shadow-md transition-all border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-blue-400 border-gray-600 focus:ring-offset-gray-900' : 'bg-white text-blue-600 border-blue-100'}`}
                    >
                      View All Services
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {status === LoadingState.ERROR && (
               <motion.div
                 key="error"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="text-center py-12"
               >
                 <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
                   <AlertCircle className="w-8 h-8" aria-hidden="true" />
                 </div>
                 <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Oops, something went wrong</h3>
                 <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>We couldn't analyze your request right now. Please try again.</p>
                 <button 
                   onClick={() => setStatus(LoadingState.IDLE)}
                   className="text-blue-600 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                 >
                   Try again
                 </button>
               </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className={`max-w-3xl mx-auto px-4 mt-20 text-center text-sm ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
        <p>&copy; {new Date().getFullYear()} b2w.tv. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
