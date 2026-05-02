'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Campaign, GeneratedEmail, UserProfile } from './types';

export interface SentEmail {
  id: string;
  to: string;
  subject: string;
  body: string;
  score: number;
  company: string;
  campaignId?: string;
  opened: boolean;
  replied: boolean;
  sentAt: number;
}

export interface Preferences {
  tone: 'Professional' | 'Friendly' | 'Concise';
  language: string;
  hfApiKeyMasked: string;
}

interface StoreState {
  onboarded: boolean;
  profile: UserProfile;
  sentEmails: SentEmail[];
  campaigns: Campaign[];
  preferences: Preferences;
  connections: { gmail: boolean; linkedin: boolean };
  setOnboarded: (v: boolean) => void;
  setProfile: (p: UserProfile) => void;
  addSentEmail: (e: SentEmail) => void;
  removeSentEmail: (id: string) => void;
  addCampaign: (c: Campaign) => void;
  removeCampaign: (id: string) => void;
  updateCampaign: (id: string, patch: Partial<Campaign>) => void;
  setPreferences: (p: Partial<Preferences>) => void;
  setConnections: (c: Partial<{ gmail: boolean; linkedin: boolean }>) => void;
  reset: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  email: '',
  role: '',
  skills: [],
  portfolioLinks: [],
};

const DEFAULT_PREFS: Preferences = {
  tone: 'Professional',
  language: 'English',
  hfApiKeyMasked: '',
};

const StoreContext = createContext<StoreState | null>(null);
const STORAGE_KEY = 'smartreach.state.v1';

export function StoreProvider({ children }: { children: ReactNode }) {
  const [onboarded, setOnboardedState] = useState(false);
  const [profile, setProfileState] = useState<UserProfile>(DEFAULT_PROFILE);
  const [sentEmails, setSentEmails] = useState<SentEmail[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [preferences, setPreferencesState] = useState<Preferences>(DEFAULT_PREFS);
  const [connections, setConnectionsState] = useState({ gmail: false, linkedin: false });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        setOnboardedState(!!s.onboarded);
        if (s.profile) setProfileState({ ...DEFAULT_PROFILE, ...s.profile });
        if (Array.isArray(s.sentEmails)) setSentEmails(s.sentEmails);
        if (Array.isArray(s.campaigns)) setCampaigns(s.campaigns);
        if (s.preferences) setPreferencesState({ ...DEFAULT_PREFS, ...s.preferences });
        if (s.connections) setConnectionsState({ gmail: false, linkedin: false, ...s.connections });
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ onboarded, profile, sentEmails, campaigns, preferences, connections })
    );
  }, [onboarded, profile, sentEmails, campaigns, preferences, connections, hydrated]);

  const value: StoreState = {
    onboarded,
    profile,
    sentEmails,
    campaigns,
    preferences,
    connections,
    setOnboarded: setOnboardedState,
    setProfile: setProfileState,
    addSentEmail: (e) => setSentEmails((prev) => [e, ...prev]),
    removeSentEmail: (id) => setSentEmails((prev) => prev.filter((e) => e.id !== id)),
    addCampaign: (c) => setCampaigns((prev) => [c, ...prev]),
    removeCampaign: (id) => setCampaigns((prev) => prev.filter((c) => c.id !== id)),
    updateCampaign: (id, patch) =>
      setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c))),
    setPreferences: (p) => setPreferencesState((prev) => ({ ...prev, ...p })),
    setConnections: (c) => setConnectionsState((prev) => ({ ...prev, ...c })),
    reset: () => {
      setOnboardedState(false);
      setProfileState(DEFAULT_PROFILE);
      setSentEmails([]);
      setCampaigns([]);
      setPreferencesState(DEFAULT_PREFS);
      setConnectionsState({ gmail: false, linkedin: false });
    },
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
