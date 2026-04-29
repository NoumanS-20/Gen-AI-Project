'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import GenerateScreen from './screens/GenerateScreen';
import CampaignsScreen from './screens/CampaignsScreen';
import AnalyticsScreen from './screens/AnalyticsScreen';
import SettingsScreen from './screens/SettingsScreen';
import ResultsScreen from './screens/ResultsScreen';
import Button from './ui/Button';
import Avatar from './ui/Avatar';
import { Icon } from './Icons';
import { GeneratedEmail } from '@/lib/types';

export default function AppShell() {
  const [screen, setScreen] = useState('generate');
  const [results, setResults] = useState<GeneratedEmail[] | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const showResults = screen === 'generate' && results !== null;

  const handleNav = (id: string) => {
    setScreen(id);
    if (id !== 'generate') setResults(null);
  };

  const renderScreen = () => {
    if (screen === 'generate') {
      if (showResults) return <ResultsScreen emails={results!} onBack={() => setResults(null)} />;
      return <GenerateScreen onResults={setResults} />;
    }
    if (screen === 'campaigns') return <CampaignsScreen />;
    if (screen === 'analytics') return <AnalyticsScreen />;
    if (screen === 'settings') return <SettingsScreen />;
    return null;
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        background: '#09090b',
        fontFamily: 'Figtree, sans-serif',
      }}
    >
      <Sidebar active={screen} onNav={handleNav} collapsed={sidebarCollapsed} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div
          style={{
            height: 52,
            flexShrink: 0,
            borderBottom: '1px solid #1a1a22',
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px',
            gap: 12,
            background: '#09090b',
          }}
        >
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#55556a',
              display: 'flex',
              padding: 6,
              borderRadius: 6,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <div style={{ flex: 1 }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {showResults && (
              <>
                <span
                  style={{
                    fontSize: 12,
                    color: '#44445a',
                    fontFamily: 'Figtree, sans-serif',
                    cursor: 'pointer',
                  }}
                  onClick={() => setResults(null)}
                >
                  Generate
                </span>
                <span style={{ color: '#333344', fontSize: 12 }}>/</span>
              </>
            )}
            <span
              style={{
                fontSize: 12,
                color: '#888898',
                fontFamily: 'Figtree, sans-serif',
                fontWeight: 500,
                textTransform: 'capitalize',
              }}
            >
              {showResults ? 'Results' : screen}
            </span>
          </div>

          <div style={{ flex: 1 }} />

          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setScreen('generate');
              setResults(null);
            }}
            icon={<Icon.Plus />}
          >
            New Email
          </Button>
          <div style={{ width: 1, height: 20, background: '#1e1e26' }} />
          <Avatar name="Alex Johnson" size={28} />
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '0 32px' }}>
          {renderScreen()}
        </div>
      </div>
    </div>
  );
}
