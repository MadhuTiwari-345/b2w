import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Play, Pause, Volume2, Maximize } from 'lucide-react';
import { VideoService } from '../types';

interface SampleModalProps {
  service: VideoService | null;
  onClose: () => void;
}

export const SampleModal: React.FC<SampleModalProps> = ({ service, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 flex justify-between items-center border-b border-gray-100">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
            <span className="text-sm text-blue-600 font-medium">{service.category} Category</span>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div 
          className="relative aspect-video bg-gray-900 group cursor-pointer overflow-hidden"
          onClick={() => !isPlaying && setIsPlaying(true)}
        >
          {isPlaying ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-black relative">
              <div className="absolute inset-0 flex items-center justify-center">
                 {/* Simulated Loading/Playing State */}
                 <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white text-sm font-medium animate-pulse">Playing {service.title} Demo...</p>
                 </div>
              </div>
              
              {/* Fake Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center space-x-4">
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsPlaying(false); }}
                  className="text-white hover:text-blue-400"
                >
                  <Pause className="w-5 h-5" />
                </button>
                <div className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-blue-600 rounded-full"></div>
                </div>
                <div className="text-white text-xs">0:12 / 1:30</div>
                <Volume2 className="w-5 h-5 text-white" />
                <Maximize className="w-5 h-5 text-white" />
              </div>
            </div>
          ) : (
            <>
              <img
                src={service.sampleImage}
                alt={`${service.title} Sample`}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-300"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <Play className="w-6 h-6 text-blue-600 ml-1 fill-blue-600" />
                  </div>
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-center">
                 <p className="text-white/90 text-sm font-medium drop-shadow-md">Click to watch sample</p>
              </div>
            </>
          )}
        </div>

        <div className="p-8 bg-gray-50">
          <h4 className="font-semibold text-gray-900 mb-2">About this service</h4>
          <p className="text-gray-600 leading-relaxed">
            {service.description} This sample represents the quality and style you can expect from our {service.title.toLowerCase()} package. 
            We customize every aspect to match your brand guidelines and campaign goals.
          </p>
          
          <div className="mt-6 flex justify-end">
             <button 
               onClick={onClose}
               className="px-6 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
             >
               Close Preview
             </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};