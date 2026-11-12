/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { CatalogView } from './components/CatalogView';
import { BanglaHubView } from './components/BanglaHubView';
import { LiveTvView } from './components/LiveTvView';
import { LiveSportsView } from './components/LiveSportsView';
import { YouTubeView } from './components/YouTubeView';
import { AiDiscoveryView } from './components/AiDiscoveryView';
import { LibraryView } from './components/LibraryView';
import { SearchResultsView } from './components/SearchResultsView';
import { MediaPlayer } from './components/MediaPlayer';
import { DetailModal } from './components/DetailModal';
import { ProfileModal } from './components/ProfileModal';
import { AdminPanelView } from './components/AdminPanelView';
import { AdminPasswordModal } from './components/AdminPasswordModal';
import { AuthModal } from './components/AuthModal';
import { Toast } from './components/Toast';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, searchQuery, isAdminUnlocked } = useApp();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // If user selected profile from navbar, trigger modal
  React.useEffect(() => {
    if (activeTab === 'profile') {
      setProfileModalOpen(true);
      setActiveTab('home');
    }
  }, [activeTab, setActiveTab]);

  return (
    <div className="min-h-screen bg-[#090B10] text-white flex flex-col selection:bg-[#7C4DFF] selection:text-white">
      {/* Top App Bar & Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {searchQuery.trim() ? (
          <SearchResultsView />
        ) : (
          <>
            {activeTab === 'home' && <HomeView />}
            {activeTab === 'movies' && <CatalogView type="movie" />}
            {activeTab === 'series' && <CatalogView type="series" />}
            {activeTab === 'bangla_hub' && <BanglaHubView />}
            {activeTab === 'live_tv' && <LiveTvView />}
            {activeTab === 'sports' && <LiveSportsView />}
            {activeTab === 'youtube' && <YouTubeView />}
            {activeTab === 'ai_discovery' && <AiDiscoveryView />}
            {activeTab === 'library' && <LibraryView />}
            {activeTab === 'admin' && isAdminUnlocked && <AdminPanelView />}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Media Player Engine */}
      <MediaPlayer />
      <DetailModal />
      <AdminPasswordModal />
      <ProfileModal 
        isOpen={profileModalOpen} 
        onClose={() => setProfileModalOpen(false)} 
        onOpenAuth={() => setAuthModalOpen(true)}
      />
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
