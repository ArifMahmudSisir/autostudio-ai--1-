
import React, { useState, useRef } from 'react';
import { Dealership } from '../types';

interface DealershipsViewProps {
  dealerships: Dealership[];
  setDealerships: (d: Dealership[]) => void;
}

const DealershipsView: React.FC<DealershipsViewProps> = ({ dealerships, setDealerships }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newDealer, setNewDealer] = useState({ 
    name: '', 
    brandColor: '#3b82f6', 
    backgroundPrompt: '', 
    backgroundUrl: '' 
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewDealer({ ...newDealer, backgroundUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = () => {
    if (!newDealer.name) return;
    const item: Dealership = {
      id: Math.random().toString(36).substr(2, 9),
      name: newDealer.name,
      brandColor: newDealer.brandColor,
      backgroundPrompt: newDealer.backgroundPrompt || 'Luxury minimalist automotive showroom',
      backgroundUrl: newDealer.backgroundUrl
    };
    setDealerships([...dealerships, item]);
    setNewDealer({ name: '', brandColor: '#3b82f6', backgroundPrompt: '', backgroundUrl: '' });
    setShowAdd(false);
  };

  const removeDealer = (id: string) => {
    if (confirm('Are you sure you want to remove this dealership?')) {
      setDealerships(dealerships.filter(d => d.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dealership Management</h1>
          <p className="text-slate-400">Configure branding and background templates for each client.</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Dealership
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dealerships.map(dealer => (
          <div key={dealer.id} className="group bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden flex flex-col transition-all hover:border-slate-500 shadow-lg">
            {/* Card Header with Background Preview */}
            <div className="h-24 relative bg-slate-900 overflow-hidden">
                {dealer.backgroundUrl ? (
                    <img src={dealer.backgroundUrl} className="w-full h-full object-cover opacity-40 blur-[2px]" alt="BG Preview" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900" />
                )}
                <div className="absolute inset-0 flex items-center px-6">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-2xl border-2 border-white/10" style={{ backgroundColor: dealer.brandColor }}>
                        {dealer.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                        <h3 className="text-lg font-bold text-white drop-shadow-md">{dealer.name}</h3>
                        <div className="flex items-center space-x-2">
                             <div className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: dealer.brandColor }}></div>
                             <span className="text-[10px] font-mono text-slate-300">{dealer.brandColor}</span>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={() => removeDealer(dealer.id)}
                    className="absolute top-2 right-2 text-white/40 hover:text-red-400 transition-colors p-1"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>

            <div className="p-6 flex-1 flex flex-col">
                <div className="space-y-4 flex-1">
                    <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">AI Environment</p>
                        <p className="text-xs text-slate-300 italic leading-relaxed">"{dealer.backgroundPrompt}"</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Custom Asset</p>
                        <div className="flex items-center text-xs text-slate-400">
                            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2-2v12a2 2 0 002 2z" />
                            </svg>
                            {dealer.backgroundUrl ? 'Branded Background Uploaded' : 'Using AI Generated Default'}
                        </div>
                    </div>
                </div>
                
                <button className="mt-6 w-full py-2.5 border border-slate-700 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-700 hover:text-white transition-all">
                    Configure Brand Assets
                </button>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Create Dealership</h2>
                <button onClick={() => setShowAdd(false)} className="text-slate-500 hover:text-white">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Name</label>
                <input 
                  type="text" 
                  value={newDealer.name}
                  onChange={(e) => setNewDealer({...newDealer, name: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Mercedes-Benz Manhattan"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Accent Color</label>
                    <div className="flex items-center space-x-2">
                        <input 
                          type="color" 
                          value={newDealer.brandColor}
                          onChange={(e) => setNewDealer({...newDealer, brandColor: e.target.value})}
                          className="w-12 h-10 bg-slate-800 border border-slate-700 rounded-lg p-1 cursor-pointer"
                        />
                        <span className="text-xs font-mono text-slate-400">{newDealer.brandColor}</span>
                    </div>
                  </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Background Asset (Optional)</label>
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-24 bg-slate-800 border-2 border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors group overflow-hidden"
                >
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                    {newDealer.backgroundUrl ? (
                        <img src={newDealer.backgroundUrl} className="w-full h-full object-cover" alt="Selected background" />
                    ) : (
                        <>
                            <svg className="w-6 h-6 text-slate-500 mb-1 group-hover:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2-2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-[10px] text-slate-500 group-hover:text-blue-400 uppercase font-bold">Upload Custom BG</span>
                        </>
                    )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">AI Environment Description</label>
                <textarea 
                  value={newDealer.backgroundPrompt}
                  onChange={(e) => setNewDealer({...newDealer, backgroundPrompt: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] text-sm"
                  placeholder="Describe fallback environment (e.g. Modern glass showroom with evening lights)"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-8">
              <button 
                onClick={() => setShowAdd(false)}
                className="flex-1 py-3 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAdd}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-semibold text-white transition-all shadow-lg shadow-blue-900/20"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealershipsView;
