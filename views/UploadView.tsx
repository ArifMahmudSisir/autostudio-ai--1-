
import React, { useState, useRef } from 'react';
import { Dealership, User, ProcessedPhoto } from '../types';
import { processCarImage } from '../services/geminiService';

interface UploadViewProps {
  dealerships: Dealership[];
  user: User;
  onUploadComplete: (photos: ProcessedPhoto[]) => void;
}

const UploadView: React.FC<UploadViewProps> = ({ dealerships, user, onUploadComplete }) => {
  const [selectedDealershipId, setSelectedDealershipId] = useState<string>(dealerships[0]?.id || '');
  const [uploadingFiles, setUploadingFiles] = useState<{ file: File; id: string; status: 'waiting' | 'processing' | 'done' | 'error'; preview: string; result?: string }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newUploads = files.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: 'waiting' as const,
      preview: URL.createObjectURL(file)
    }));
    setUploadingFiles(prev => [...prev, ...newUploads]);
  };

  const removeFile = (id: string) => {
    setUploadingFiles(prev => prev.filter(f => f.id !== id));
  };

  const clearAll = () => {
    if (confirm('Clear all pending uploads?')) {
        setUploadingFiles([]);
    }
  };

  const startProcessing = async () => {
    if (uploadingFiles.length === 0 || !selectedDealershipId) return;
    setIsProcessing(true);

    const dealership = dealerships.find(d => d.id === selectedDealershipId);
    const results: ProcessedPhoto[] = [];

    // Filter to only those that haven't been done yet
    const pendingItems = uploadingFiles.filter(f => f.status !== 'done');

    for (let i = 0; i < pendingItems.length; i++) {
        const item = pendingItems[i];
        setUploadingFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'processing' } : f));

        try {
            // Read file as base64
            const reader = new FileReader();
            const base64Promise = new Promise<string>((resolve) => {
                reader.onload = () => resolve(reader.result as string);
                reader.readAsDataURL(item.file);
            });
            const carBase64 = await base64Promise;

            // Process with AI - Pass the custom background if available
            const processedUrl = await processCarImage(
                carBase64, 
                dealership?.backgroundUrl || undefined,
                dealership?.backgroundPrompt
            );

            setUploadingFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'done', result: processedUrl } : f));

            results.push({
                id: item.id,
                originalUrl: item.preview,
                processedUrl: processedUrl,
                status: 'completed',
                dealershipId: selectedDealershipId,
                photographerId: user.id,
                createdAt: Date.now()
            });
        } catch (error) {
            console.error("Processing failed for item", item.id, error);
            setUploadingFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'error' } : f));
        }
    }

    setIsProcessing(false);
    
    // If all completed, finish
    const allDone = uploadingFiles.every(f => f.status === 'done' || f.status === 'error');
    if (allDone && results.length > 0) {
        setTimeout(() => {
            if (confirm(`Successfully processed ${results.length} photos. Save to gallery?`)) {
                onUploadComplete(results);
            }
        }, 800);
    }
  };

  const completedCount = uploadingFiles.filter(f => f.status === 'done').length;
  const progressPercent = uploadingFiles.length > 0 ? (completedCount / uploadingFiles.length) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Batch Processor</h1>
          <p className="text-slate-400 max-w-lg">Upload car photos from today's shoot. The AI will swap the background with the dealership's branded environment automatically.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
            <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-widest">Target Dealership</label>
                <select 
                    value={selectedDealershipId}
                    onChange={(e) => setSelectedDealershipId(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px] shadow-lg"
                    disabled={isProcessing}
                >
                    {dealerships.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                </select>
            </div>
            
            <button 
                onClick={startProcessing}
                disabled={isProcessing || uploadingFiles.length === 0 || completedCount === uploadingFiles.length}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center shadow-xl ${
                    isProcessing || uploadingFiles.length === 0 || completedCount === uploadingFiles.length
                        ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-500 hover:shadow-blue-500/20 active:scale-95'
                }`}
            >
                {isProcessing ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing... {Math.round(progressPercent)}%
                    </>
                ) : (
                    <>
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Apply Branded Backgrounds
                    </>
                )}
            </button>
        </div>
      </div>

      {isProcessing && (
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              ></div>
          </div>
      )}

      <div 
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`bg-slate-800/20 border-2 border-dashed rounded-3xl p-10 text-center transition-all ${
            isProcessing ? 'border-slate-700 opacity-50 cursor-not-allowed' : 'border-slate-700 hover:border-blue-500/50 hover:bg-slate-800/40 cursor-pointer'
        }`}
      >
        <input 
            type="file" 
            multiple 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileSelect}
            disabled={isProcessing}
        />
        <div className="mx-auto w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-4 text-blue-500">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2-2v12a2 2 0 002 2z" />
            </svg>
        </div>
        <h3 className="text-xl font-bold text-white tracking-tight">Drop photoshoot files here</h3>
        <p className="text-slate-500 mt-2 max-w-md mx-auto">Select multiple JPG/PNG images. AI will automatically isolate the car and place it in the {dealerships.find(d => d.id === selectedDealershipId)?.name} showroom.</p>
      </div>

      {uploadingFiles.length > 0 && (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Upload Queue ({uploadingFiles.length})</h4>
                <button 
                    onClick={clearAll}
                    disabled={isProcessing}
                    className="text-xs font-semibold text-slate-400 hover:text-red-400 disabled:opacity-50"
                >
                    Clear All
                </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {uploadingFiles.map((item) => (
                    <div key={item.id} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-700 group bg-slate-900 shadow-md">
                        <img src={item.result || item.preview} className={`w-full h-full object-cover transition-all duration-700 ${item.status === 'processing' ? 'scale-110 blur-sm brightness-50' : 'scale-100'}`} alt="Preview" />
                        
                        {!isProcessing && item.status !== 'done' && (
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); removeFile(item.id); }}
                                    className="p-1.5 bg-red-500/90 rounded-full text-white shadow-lg backdrop-blur-sm"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        )}

                        {item.status === 'processing' && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                                <svg className="animate-spin h-6 w-6 mb-3 text-blue-400" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span className="text-[9px] font-bold uppercase tracking-widest text-center">Removing Original Background...</span>
                            </div>
                        )}

                        {item.status === 'done' && (
                            <div className="absolute top-2 right-2">
                                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-slate-900">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                        )}

                        {item.status === 'error' && (
                            <div className="absolute inset-0 bg-red-600/60 flex flex-col items-center justify-center text-white p-4">
                                <svg className="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-[9px] font-bold uppercase tracking-widest">API Error</span>
                            </div>
                        )}
                        
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                             <p className="text-[10px] text-white/70 truncate uppercase font-bold tracking-tight">{item.file.name}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default UploadView;
