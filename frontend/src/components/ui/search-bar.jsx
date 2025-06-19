import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, ArrowRight, Filter, Clock, History,
  Sparkles, TrendingUp
} from 'lucide-react';
// Add these new imports
import { RiMicFill } from 'react-icons/ri'; // Only use the filled mic for premium look
import { IoMdPulse } from 'react-icons/io';

import { Button } from './button';
import { Badge } from './badge';
import { cn } from '@/lib/utils';

const SearchBar = ({
  onSearch,
  className,
  placeholder = "Search jobs...",
  suggestions = [],
  recentSearches = [],
  popularSearches = [],
  variant = "premium"
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const [isListening, setIsListening] = useState(false);
  const [micPermission, setMicPermission] = useState('prompt'); // 'granted', 'denied', 'prompt'
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const audioRef = useRef(null);

  const variants = {
    default: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
    hero: "bg-white/10 backdrop-blur-md border border-white/20",
    minimal: "bg-transparent border-none",
    premium: "bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 border border-purple-100 dark:border-purple-800/30"
  };

  const micButtonVariants = {
    idle: { scale: 1 },
    listening: {
      scale: [1, 1.1, 1],
      transition: {
        repeat: Infinity,
        duration: 1.5
      }
    }
  };

  const pulseRingVariants = {
    listening: {
      scale: [1, 1.5],
      opacity: [0.4, 0],
      transition: {
        repeat: Infinity,
        duration: 1.5
      }
    }
  };

  const micEffects = {
    ripple: {
      scale: [1, 1.3, 1],
      opacity: [0.4, 0, 0.4],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    glow: {
      boxShadow: [
        "0 0 0 0 rgba(147, 51, 234, 0.7)",
        "0 0 0 20px rgba(147, 51, 234, 0)",
      ],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    navigator.permissions?.query({ name: 'microphone' })
      .then(permissionStatus => {
        setMicPermission(permissionStatus.state);
        permissionStatus.onchange = () => {
          setMicPermission(permissionStatus.state);
        };
      });

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);        // Play start sound
        new Audio('/assets/click-sound.mp3').play()
          .catch(err => console.warn("Audio play failed:", err));
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        
        // Play success sound
        new Audio('/assets/click-sound.mp3').play()
          .catch(err => console.warn("Audio play failed:", err));
        
        handleSubmit(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
        // Play end sound
        new Audio('/assets/click-sound.mp3').play()
          .catch(err => console.warn("Audio play failed:", err));
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        // Play error sound if needed
        new Audio('/assets/click-sound.mp3').play()
          .catch(err => console.warn("Audio play failed:", err));
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const handleSubmit = (searchTerm = query) => {
    if (searchTerm.trim()) {
      onSearch(searchTerm);
      setIsFocused(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      setSelectedSuggestion(prev => prev < suggestions.length - 1 ? prev + 1 : prev);
    } else if (e.key === 'ArrowUp') {
      setSelectedSuggestion(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      if (selectedSuggestion >= 0) {
        handleSubmit(suggestions[selectedSuggestion]);
      } else {
        handleSubmit();
      }
    }
  };

  const toggleListening = async () => {
    if (micPermission === 'denied') {
      alert('Please enable microphone access in your browser settings to use voice search.');
      return;
    }

    try {
      if (isListening) {
        recognitionRef.current?.stop();
      } else {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        recognitionRef.current?.start();
      }
    } catch (error) {
      console.error('Microphone access error:', error);
      alert('Unable to access microphone. Please check your permissions.');
    }
  };

  const renderPremiumMicButton = () => (
    <div className="relative flex items-center justify-center">
      {/* Animated Glow & Pulse when listening */}
      {isListening && (
        <>
          <motion.div
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(168,85,247,0.25)",
                "0 0 0 8px rgba(236,72,153,0.15)",
                "0 0 0 0 rgba(168,85,247,0.25)"
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full"
            style={{ zIndex: 0 }}
          />
          <motion.div
            animate={{
              scale: [1, 1.18, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400/20 to-pink-400/20"
            style={{ zIndex: 0 }}
          />
        </>
      )}
      {/* Mic Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.97 }}
        onClick={toggleListening}
        aria-label={isListening ? "Stop voice search" : "Start voice search"}
        className={cn(
          "relative z-10 flex items-center justify-center rounded-full transition-all duration-300 border-2",
          "w-9 h-9", // Small size
          isListening
            ? "bg-gradient-to-r from-purple-600 to-pink-500 border-pink-400 shadow-lg"
            : "bg-gradient-to-r from-white via-gray-100 to-gray-200 border-purple-200 hover:from-purple-50 hover:to-pink-50",
          "focus:outline-none focus:ring-2 focus:ring-purple-400"
        )}
        style={{
          boxShadow: isListening
            ? "0 2px 16px 0 rgba(168,85,247,0.18)"
            : "0 1px 4px 0 rgba(168,85,247,0.08)"
        }}
      >
        <RiMicFill
          className={cn(
            "transition-colors duration-300",
            isListening ? "text-white" : "text-purple-600"
          )}
          size={18}
        />
      </motion.button>
    </div>
  );

  return (
    <div className="relative" ref={searchRef}>
      <audio ref={audioRef} preload="auto" />
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className={cn(
          "relative flex items-center gap-2 px-4 py-3 rounded-full transition-all duration-300",
          variants[variant],
          isFocused && "ring-2 ring-purple-500/20 shadow-lg",
          className
        )}
      >
        <Search className="h-5 w-5 text-white/80" />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white/50"
        />

        {query && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setQuery('')}
            className="p-1 hover:bg-white/10 rounded-full"
          >
            <X className="h-4 w-4 text-white/70" />
          </motion.button>
        )}

        {renderPremiumMicButton()}

        <Button
          onClick={() => handleSubmit()}
          variant="secondary"
          className="rounded-full px-6 bg-white text-purple-600 hover:bg-purple-100"
        >
          Search
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 z-50"
          >
            {/* Quick Filters */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Filter className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Quick Filters</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Remote', 'Full-time', 'Tech', 'Marketing', 'Design'].map((filter) => (
                  <Badge
                    key={filter}
                    variant="secondary"
                    className="hover:bg-purple-100 dark:hover:bg-purple-900/30 cursor-pointer"
                    onClick={() => handleSubmit(filter)}
                  >
                    {filter}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <History className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Recent Searches</span>
                </div>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer"
                      onClick={() => handleSubmit(search)}
                    >
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{search}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Searches */}
            {popularSearches.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Popular Searches</span>
                </div>
                <div className="space-y-2">
                  {popularSearches.map((search, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer"
                      onClick={() => handleSubmit(search)}
                    >
                      <Sparkles className="h-4 w-4" />
                      <span className="text-sm">{search}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}  
            
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
