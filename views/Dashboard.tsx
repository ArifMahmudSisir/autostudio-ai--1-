
import React from 'react';
import { ProcessedPhoto, Dealership, User, UserRole } from '../types';

interface DashboardProps {
  photos: ProcessedPhoto[];
  dealerships: Dealership[];
  photographers: User[];
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ photos, dealerships, photographers, user }) => {
  const stats = [
    { label: 'Total Photos', value: photos.length, icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2-2v12a2 2 0 002 2z' },
    { label: 'Active Dealerships', value: dealerships.length, icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { label: 'Pro Photographers', value: photographers.length, icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  ];

  const recentPhotos = photos.slice(0, 8);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Welcome back, {user.name}</h1>
        <p className="text-slate-400">Here's what's happening in your studio today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">Recent Inventory Processing</h2>
          <button className="text-sm text-blue-400 font-medium hover:text-blue-300 transition-colors">View All Gallery</button>
        </div>
        
        {photos.length === 0 ? (
          <div className="bg-slate-800/30 border-2 border-dashed border-slate-700 rounded-3xl p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2-2v12a2 2 0 002 2z" />
                </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-300">No photos processed yet</h3>
            <p className="text-slate-500 max-w-sm mx-auto mt-2">Start by uploading car photos in the "Upload Photos" tab to see the AI in action.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentPhotos.map((photo) => (
              <div key={photo.id} className="group bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden hover:border-blue-500/50 transition-all duration-300 shadow-lg">
                <div className="aspect-[4/3] bg-slate-900 relative">
                  <img 
                    src={photo.processedUrl || photo.originalUrl} 
                    alt="Vehicle" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                        photo.status === 'completed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {photo.status}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-slate-500 truncate">
                        {dealerships.find(d => d.id === photo.dealershipId)?.name || 'Unknown Dealer'}
                    </p>
                    <p className="text-[10px] text-slate-600 font-medium">
                        {new Date(photo.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-slate-700 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-300">
                        {photographers.find(p => p.id === photo.photographerId)?.name.charAt(0) || 'P'}
                    </div>
                    <p className="text-xs text-slate-400 truncate">
                        {photographers.find(p => p.id === photo.photographerId)?.name || 'Photographer'}
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <a 
                      href={photo.processedUrl || photo.originalUrl} 
                      download={`car-${photo.id}.png`}
                      className="w-full inline-flex items-center justify-center px-3 py-2 border border-slate-600 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                    >
                      <svg className="w-3 h-3 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Download HD
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
