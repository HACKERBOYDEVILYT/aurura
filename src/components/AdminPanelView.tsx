import React, { useState, useEffect } from 'react';
import { 
  Shield, Globe, RefreshCw, Menu, X, ArrowLeft, CheckCircle2 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AdminSidebar, AdminTab } from './admin/AdminSidebar';
import { DashboardSection } from './admin/sections/DashboardSection';
import { MoviesSection } from './admin/sections/MoviesSection';
import { SeriesSection } from './admin/sections/SeriesSection';
import { BanglaSection } from './admin/sections/BanglaSection';
import { LiveTvSection } from './admin/sections/LiveTvSection';
import { SportsSection } from './admin/sections/SportsSection';
import { StreamingSection } from './admin/sections/StreamingSection';
import { UsersSection } from './admin/sections/UsersSection';
import { RolesSection } from './admin/sections/RolesSection';
import { SubscriptionsSection } from './admin/sections/SubscriptionsSection';
import { PaymentsSection } from './admin/sections/PaymentsSection';
import { AiConfigSection } from './admin/sections/AiConfigSection';
import { YouTubeSection } from './admin/sections/YouTubeSection';
import { NotificationsSection } from './admin/sections/NotificationsSection';
import { SettingsSection } from './admin/sections/SettingsSection';
import { ApiSetupSection } from './admin/sections/ApiSetupSection';
import { AuditLogsSection } from './admin/sections/AuditLogsSection';
import { SystemHealthSection } from './admin/sections/SystemHealthSection';

export const AdminPanelView: React.FC = () => {
  const { language, setLanguage, setActiveTab, showToast } = useApp();
  const [currentTab, setCurrentTab] = useState<AdminTab>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Live Data State from Backend
  const [metrics, setMetrics] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [moviesList, setMoviesList] = useState<any[]>([]);
  const [channelsList, setChannelsList] = useState<any[]>([]);
  const [sportsList, setSportsList] = useState<any[]>([]);
  const [streamingSources, setStreamingSources] = useState<any[]>([]);
  const [plansList, setPlansList] = useState<any[]>([]);
  const [transactionsList, setTransactionsList] = useState<any[]>([]);
  const [notificationsList, setNotificationsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const [
        dashRes, auditRes, usersRes, moviesRes, channelsRes, sportsRes,
        streamRes, plansRes, txRes, notifRes
      ] = await Promise.all([
        fetch('/api/v1/admin/dashboard').then(r => r.json()).catch(() => ({})),
        fetch('/api/v1/admin/audit-logs').then(r => r.json()).catch(() => ({})),
        fetch('/api/v1/users').then(r => r.json()).catch(() => ({})),
        fetch('/api/v1/movies').then(r => r.json()).catch(() => ({})),
        fetch('/api/v1/live-tv').then(r => r.json()).catch(() => ({})),
        fetch('/api/v1/sports').then(r => r.json()).catch(() => ({})),
        fetch('/api/v1/admin/streaming').then(r => r.json()).catch(() => ({})),
        fetch('/api/v1/admin/subscriptions').then(r => r.json()).catch(() => ({})),
        fetch('/api/v1/admin/payments').then(r => r.json()).catch(() => ({})),
        fetch('/api/v1/admin/notifications').then(r => r.json()).catch(() => ({})),
      ]);

      if (dashRes.metrics) setMetrics(dashRes.metrics);
      if (auditRes.results) setAuditLogs(auditRes.results);
      if (usersRes.results) setUsersList(usersRes.results);
      if (moviesRes.results) setMoviesList(moviesRes.results);
      if (channelsRes.results) setChannelsList(channelsRes.results);
      if (sportsRes.results) setSportsList(sportsRes.results);
      if (streamRes.results) setStreamingSources(streamRes.results);
      if (plansRes.results) setPlansList(plansRes.results);
      if (txRes.results) setTransactionsList(txRes.results);
      if (notifRes.results) setNotificationsList(notifRes.results);
    } catch (e) {
      console.error('Failed to load admin data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
    const interval = setInterval(fetchAdminData, 20000);
    return () => clearInterval(interval);
  }, []);

  const seriesList = moviesList.filter(m => m.type === 'series');

  return (
    <div className="flex bg-[#090B10] text-white rounded-3xl border border-white/10 overflow-hidden shadow-2xl min-h-[85vh]">
      {/* Desktop Collapsible Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          userCounts={{
            users: usersList.length,
            movies: moviesList.length,
            channels: channelsList.length,
            sports: sportsList.length
          }}
        />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)} />
          <div className="relative w-64 z-10 flex">
            <AdminSidebar
              currentTab={currentTab}
              onSelectTab={(tab) => {
                setCurrentTab(tab);
                setMobileSidebarOpen(false);
              }}
              isCollapsed={false}
              onToggleCollapse={() => setMobileSidebarOpen(false)}
              userCounts={{
                users: usersList.length,
                movies: moviesList.length,
                channels: channelsList.length,
                sports: sportsList.length
              }}
            />
          </div>
        </div>
      )}

      {/* Main Admin Content Canvas */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#090B10] overflow-y-auto">
        {/* Top Control Header */}
        <header className="sticky top-0 z-20 bg-[#11141D]/90 backdrop-blur-md border-b border-white/10 px-5 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-[#00D6A3] uppercase tracking-wider">
                  Arura Control Hub
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#7C4DFF]/20 text-[#7C4DFF]">
                  v1.4 PRO
                </span>
              </div>
              <h1 className="text-base font-black text-white capitalize">
                {currentTab.replace('_', ' ')}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-[#171B26] text-xs font-bold text-gray-300 hover:text-white transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-[#00D6A3]" />
              <span>{language === 'bn' ? 'EN' : 'বাংলা'}</span>
            </button>

            {/* Exit Button */}
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{language === 'bn' ? 'ভিউয়ারে ফিরুন' : 'Exit Admin'}</span>
            </button>
          </div>
        </header>

        {/* Section View Container */}
        <div className="p-4 sm:p-6 flex-1 space-y-6">
          {currentTab === 'dashboard' && (
            <DashboardSection metrics={metrics} onRefresh={fetchAdminData} isLoading={isLoading} />
          )}
          {currentTab === 'api_setup' && (
            <ApiSetupSection />
          )}
          {currentTab === 'movies' && (
            <MoviesSection movies={moviesList} onRefresh={fetchAdminData} />
          )}
          {currentTab === 'series' && (
            <SeriesSection seriesList={seriesList} onRefresh={fetchAdminData} />
          )}
          {currentTab === 'bangla' && (
            <BanglaSection items={moviesList} onRefresh={fetchAdminData} />
          )}
          {currentTab === 'livetv' && (
            <LiveTvSection channels={channelsList} onRefresh={fetchAdminData} />
          )}
          {currentTab === 'sports' && (
            <SportsSection sports={sportsList} onRefresh={fetchAdminData} />
          )}
          {currentTab === 'streaming' && (
            <StreamingSection sources={streamingSources} onRefresh={fetchAdminData} />
          )}
          {currentTab === 'users' && (
            <UsersSection users={usersList} onRefresh={fetchAdminData} />
          )}
          {currentTab === 'roles' && (
            <RolesSection />
          )}
          {currentTab === 'subscriptions' && (
            <SubscriptionsSection plans={plansList} onRefresh={fetchAdminData} />
          )}
          {currentTab === 'payments' && (
            <PaymentsSection transactions={transactionsList} onRefresh={fetchAdminData} />
          )}
          {currentTab === 'ai' && (
            <AiConfigSection />
          )}
          {currentTab === 'youtube' && (
            <YouTubeSection />
          )}
          {currentTab === 'notifications' && (
            <NotificationsSection notifications={notificationsList} onRefresh={fetchAdminData} />
          )}
          {currentTab === 'settings' && (
            <SettingsSection />
          )}
          {currentTab === 'audit' && (
            <AuditLogsSection logs={auditLogs} />
          )}
          {currentTab === 'health' && (
            <SystemHealthSection />
          )}
        </div>
      </div>
    </div>
  );
};
