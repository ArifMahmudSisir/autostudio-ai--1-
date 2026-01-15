
import React, { useState, useEffect } from 'react';
import { User, UserRole, Dealership, ProcessedPhoto } from './types';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './views/Dashboard';
import DealershipsView from './views/DealershipsView';
import PhotographersView from './views/PhotographersView';
import UploadView from './views/UploadView';
import Login from './components/Login';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'dealerships' | 'photographers' | 'upload'>('dashboard');
  
  // App State "Database"
  const [dealerships, setDealerships] = useState<Dealership[]>([]);
  const [photographers, setPhotographers] = useState<User[]>([]);
  const [photos, setPhotos] = useState<ProcessedPhoto[]>([]);

  useEffect(() => {
    // Load mock data or local storage
    const savedDealerships = localStorage.getItem('as_dealerships');
    const savedPhotographers = localStorage.getItem('as_photographers');
    const savedPhotos = localStorage.getItem('as_photos');

    if (savedDealerships) setDealerships(JSON.parse(savedDealerships));
    else {
        const initial = [
            { id: 'd1', name: 'Velocity Motors', brandColor: '#ef4444', backgroundPrompt: 'Modern high-tech garage with neon accents' },
            { id: 'd2', name: 'Elite Auto Group', brandColor: '#3b82f6', backgroundPrompt: 'Minimalist white studio with soft overhead lighting' }
        ];
        setDealerships(initial);
        localStorage.setItem('as_dealerships', JSON.stringify(initial));
    }

    if (savedPhotographers) setPhotographers(JSON.parse(savedPhotographers));
    else {
        const initial = [
            { id: 'p1', name: 'Alex Shotz', email: 'alex@autostudio.ai', role: UserRole.PHOTOGRAPHER },
            { id: 'p2', name: 'Maria Lens', email: 'maria@autostudio.ai', role: UserRole.PHOTOGRAPHER }
        ];
        setPhotographers(initial);
        localStorage.setItem('as_photographers', JSON.stringify(initial));
    }

    if (savedPhotos) setPhotos(JSON.parse(savedPhotos));
  }, []);

  const handleLogout = () => setCurrentUser(null);

  if (!currentUser) {
    return <Login onLogin={setCurrentUser} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard 
                  photos={photos} 
                  dealerships={dealerships} 
                  photographers={photographers} 
                  user={currentUser} 
               />;
      case 'dealerships':
        return <DealershipsView 
                  dealerships={dealerships} 
                  setDealerships={(d) => {
                    setDealerships(d);
                    localStorage.setItem('as_dealerships', JSON.stringify(d));
                  }} 
               />;
      case 'photographers':
        return <PhotographersView 
                  photographers={photographers} 
                  setPhotographers={(p) => {
                    setPhotographers(p);
                    localStorage.setItem('as_photographers', JSON.stringify(p));
                  }} 
               />;
      case 'upload':
        return <UploadView 
                  dealerships={dealerships} 
                  user={currentUser} 
                  onUploadComplete={(newPhotos) => {
                    const updated = [...newPhotos, ...photos];
                    setPhotos(updated);
                    localStorage.setItem('as_photos', JSON.stringify(updated));
                    setActiveTab('dashboard');
                  }}
               />;
      default:
        return <Dashboard photos={photos} dealerships={dealerships} photographers={photographers} user={currentUser} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        role={currentUser.role} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={currentUser} onLogout={handleLogout} />
        
        <main className="flex-1 overflow-y-auto p-6 bg-slate-900/50">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
