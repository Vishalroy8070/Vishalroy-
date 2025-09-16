import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { Effect, OriginalImage } from './types';
import { PHOTO_EFFECTS } from './constants';
import { enhanceImage } from './services/geminiService';
import { UploadIcon, WandIcon, DownloadIcon, LoaderIcon, CloseIcon, DiamondIcon, InstagramIcon, FacebookIcon, ResetIcon } from './components/icons';
import { ImageComparator } from './components/ImageComparator';

const ImageUploader: React.FC<{ onImageUpload: (image: OriginalImage) => void }> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageUpload({
          dataUrl: e.target?.result as string,
          mimeType: file.type,
          name: file.name,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const onDragEnter = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const onDragLeave = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };

  return (
    <div
      className={`w-full h-full flex items-center justify-center p-4 border-2 border-dashed rounded-2xl transition-all duration-300 ${isDragging ? 'border-purple-500 bg-white/10' : 'border-white/20 hover:border-white/30'}`}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => handleFileChange(e.target.files)}
      />
      <div className="text-center cursor-pointer">
        <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-lg font-semibold text-gray-300">Upload a photo</p>
        <p className="mt-1 text-sm text-gray-500">Drag & drop or click to select a file</p>
      </div>
    </div>
  );
};

const LOCAL_STORAGE_KEY = 'photoEnhancerSelectedEffectId';

const getInitialEffect = (): Effect => {
  try {
    const storedEffectId = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedEffectId) {
      const effect = PHOTO_EFFECTS.find(e => e.id === storedEffectId);
      if (effect) {
        return effect;
      }
    }
  } catch (error) {
    console.warn('Could not read from localStorage:', error);
  }
  return PHOTO_EFFECTS[0];
};


const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<OriginalImage | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [selectedEffect, setSelectedEffect] = useState<Effect>(getInitialEffect);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, selectedEffect.id);
    } catch (error) {
      console.warn('Could not write to localStorage:', error);
    }
  }, [selectedEffect]);

  const handleImageUpload = (image: OriginalImage) => {
    setOriginalImage(image);
    setEnhancedImage(null);
    setError(null);
  };
  
  const handleRemoveImage = () => {
    setOriginalImage(null);
    setEnhancedImage(null);
    setError(null);
  };

  const handleEnhanceClick = useCallback(async () => {
    if (!originalImage || !selectedEffect) return;

    setIsLoading(true);
    setEnhancedImage(null);
    setError(null);
    try {
      const result = await enhanceImage(originalImage.dataUrl, originalImage.mimeType, selectedEffect.prompt);
      setEnhancedImage(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, selectedEffect]);
  
  const handleResetSettings = () => {
    try {
      window.localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (error) {
      console.warn('Could not remove from localStorage:', error);
    }
    setSelectedEffect(PHOTO_EFFECTS[0]);
  };

  return (
    <div className="min-h-screen text-gray-200 font-sans flex flex-col bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
      <header className="py-4 px-6 md:px-8 border-b border-white/10 backdrop-blur-sm bg-black/20 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <DiamondIcon className="w-8 h-8 text-amber-300"/>
          <div>
            <h1 className="text-2xl font-bold tracking-widest text-white uppercase font-serif">
              Millionaire Vishal
            </h1>
            <p className="text-sm text-gray-400 -mt-1">AI Photo Enhancer</p>
          </div>
        </div>
      </header>
      
      <main className="flex-grow p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls Column */}
        <div className="flex flex-col gap-6 bg-black/30 backdrop-blur-md p-6 rounded-2xl border border-white/10">
          <h2 className="text-xl font-semibold text-white">1. Your Photo</h2>
          <div className="aspect-video bg-black/20 rounded-lg flex-shrink-0 relative">
            {originalImage ? (
                <>
                    <img src={originalImage.dataUrl} alt="Original" className="w-full h-full object-contain rounded-lg"/>
                    <button onClick={handleRemoveImage} className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white hover:bg-black/80 transition-colors">
                        <CloseIcon className="w-5 h-5"/>
                    </button>
                </>
            ) : (
              <ImageUploader onImageUpload={handleImageUpload} />
            )}
          </div>

          <div className={`transition-opacity duration-500 ${!originalImage ? 'opacity-30 pointer-events-none' : ''}`}>
             <h2 className="text-xl font-semibold text-white mb-4">2. Choose Effect</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {PHOTO_EFFECTS.map((effect) => (
                <button
                  key={effect.id}
                  disabled={!originalImage}
                  onClick={() => setSelectedEffect(effect)}
                  className={`px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 border-2 text-left ${
                    selectedEffect.id === effect.id
                      ? 'bg-purple-600 border-purple-500 text-white shadow-lg'
                      : 'bg-black/20 border-white/10 hover:bg-black/40 hover:border-white/20 text-gray-300'
                  }`}
                >
                  {effect.name}
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={handleEnhanceClick}
            disabled={!originalImage || isLoading}
            className="w-full mt-auto py-4 px-6 bg-amber-500 text-black font-bold text-lg rounded-lg flex items-center justify-center gap-3 hover:bg-amber-400 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg shadow-amber-900/50"
          >
            {isLoading ? (
                <>
                    <LoaderIcon className="w-6 h-6"/>
                    <span>Enhancing...</span>
                </>
            ) : (
                <>
                    <WandIcon className="w-6 h-6"/>
                    <span>Enhance Image</span>
                </>
            )}
          </button>
        </div>

        {/* Output Column */}
        <div className="flex flex-col gap-6 bg-black/30 backdrop-blur-md p-6 rounded-2xl border border-white/10">
          <div className="flex justify-between items-center">
             <h2 className="text-xl font-semibold text-white">3. Result</h2>
             {enhancedImage && (
              <a
                href={enhancedImage}
                download={`enhanced-${originalImage?.name || 'image.png'}`}
                className="py-2 px-4 bg-green-600 text-white font-bold rounded-lg flex items-center gap-2 hover:bg-green-500 transition-colors duration-200"
              >
                <DownloadIcon className="w-5 h-5"/>
                Download
              </a>
             )}
          </div>
          <div className="aspect-video bg-black/20 rounded-lg flex-grow flex items-center justify-center relative overflow-hidden">
            {isLoading && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-10">
                 <LoaderIcon className="w-12 h-12 text-purple-400"/>
                 <p className="text-lg font-medium text-gray-300">AI is working its magic...</p>
                 <p className="text-sm text-gray-400">This can take a moment.</p>
              </div>
            )}
            {error && (
              <div className="p-6 text-center text-red-400">
                <h3 className="font-bold text-lg mb-2">Enhancement Failed</h3>
                <p className="text-sm">{error}</p>
              </div>
            )}
            {!enhancedImage && !isLoading && !error && (
              <div className="text-center text-gray-500">
                <p className="text-lg font-medium">Your enhanced image will appear here</p>
                <p className="text-sm">Upload a photo and apply an effect to get started</p>
              </div>
            )}
            {enhancedImage && originalImage && (
              <ImageComparator original={originalImage.dataUrl} enhanced={enhancedImage} />
            )}
          </div>
        </div>
      </main>
       <footer className="text-center py-4 px-8 text-gray-400 text-sm border-t border-white/10 mt-auto">
          <div className="flex justify-center items-center gap-4 md:gap-6 flex-wrap">
            <a href="https://instagram.com/vishalroy8070" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
              <InstagramIcon />
              <span>@vishalroy8070</span>
            </a>
            <a href="https://facebook.com/Vishalroy" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
              <FacebookIcon />
              <span>Vishalroy</span>
            </a>
            <div className="border-l border-white/20 h-5 mx-2 hidden sm:block"></div>
            <button onClick={handleResetSettings} className="flex items-center gap-2 hover:text-white transition-colors" title="Reset stored preferences">
              <ResetIcon className="w-4 h-4" />
              <span>Reset Preferences</span>
            </button>
          </div>
        </footer>
    </div>
  );
};

export default App;