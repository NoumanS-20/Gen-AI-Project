'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import { Icon } from '@/components/Icons';
import { useStore } from '@/lib/store';

export default function SettingsScreen() {
  const { profile, setProfile, preferences, setPreferences, connections, setConnections, reset } = useStore();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const handleSaveProfile = () => {
    setProfile(draft);
    setEditing(false);
    setSavedAt(Date.now());
    setTimeout(() => setSavedAt(null), 2000);
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 0' }}>
      <div
        style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 26,
          fontWeight: 700,
          color: '#f0f0f8',
          letterSpacing: '-0.03em',
          marginBottom: 32,
        }}
      >
        Settings
      </div>

      <Card style={{ marginBottom: 16, padding: 24 }}>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 14, fontWeight: 700, color: '#d0d0e8', marginBottom: 18 }}>
          Profile
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 4 }}>
            <Avatar name={profile.name || 'You'} size={52} />
            <div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, fontWeight: 600, color: '#e0e0f0' }}>
                {profile.name || 'Unnamed'}
              </div>
              <div style={{ fontSize: 12, color: '#666678', fontFamily: 'Figtree, sans-serif' }}>
                {profile.email || 'no email'}
              </div>
            </div>
            {!editing ? (
              <Button variant="secondary" size="sm" style={{ marginLeft: 'auto' }} onClick={() => { setDraft(profile); setEditing(true); }}>
                Edit
              </Button>
            ) : (
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                <Button size="sm" onClick={handleSaveProfile}>Save</Button>
                <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
              </div>
            )}
            {savedAt && <Badge color="green">Saved</Badge>}
          </div>
          <Input label="Full Name" value={editing ? draft.name : profile.name} onChange={(v) => editing && setDraft({ ...draft, name: v })} />
          <Input label="Email" value={editing ? draft.email : profile.email} onChange={(v) => editing && setDraft({ ...draft, email: v })} />
          <Input label="Job Title" value={editing ? draft.role : profile.role} onChange={(v) => editing && setDraft({ ...draft, role: v })} />
        </div>
      </Card>

      <Card style={{ marginBottom: 16, padding: 24 }}>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 14, fontWeight: 700, color: '#d0d0e8', marginBottom: 18 }}>
          Email Integration
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { id: 'gmail' as const, name: 'Gmail', desc: 'Send via your default mail client (mailto)' },
            { id: 'linkedin' as const, name: 'LinkedIn', desc: 'Extract profile & company data' },
          ].map((p) => (
            <div
              key={p.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '14px 16px',
                borderRadius: 8,
                background: '#0e0e11',
                border: '1px solid #1e1e26',
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: '#1a1a22',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: 16 }}>{p.id === 'gmail' ? '@' : 'in'}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#e0e0f0', fontFamily: 'Space Grotesk, sans-serif' }}>
                  {p.name}
                </div>
                <div style={{ fontSize: 11, color: '#666678', fontFamily: 'Figtree, sans-serif' }}>
                  {p.desc}
                </div>
              </div>
              {connections[p.id] ? (
                <div style={{ display: 'flex', gap: 6 }}>
                  <Badge color="green"><Icon.Check /> Connected</Badge>
                  <Button variant="ghost" size="sm" onClick={() => setConnections({ [p.id]: false })}>
                    Disconnect
                  </Button>
                </div>
              ) : (
                <Button variant="secondary" size="sm" onClick={() => setConnections({ [p.id]: true })}>
                  Connect
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card style={{ marginBottom: 16, padding: 24 }}>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 14, fontWeight: 700, color: '#d0d0e8', marginBottom: 18 }}>
          AI Preferences
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#888898', fontFamily: 'Figtree, sans-serif', marginBottom: 8 }}>
              Default email tone
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['Professional', 'Friendly', 'Concise'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setPreferences({ tone: t })}
                  style={{
                    padding: '7px 14px',
                    borderRadius: 7,
                    border: `1px solid ${preferences.tone === t ? 'oklch(0.62 0.22 258)' : '#232329'}`,
                    background: preferences.tone === t ? 'oklch(0.62 0.22 258 / 0.14)' : 'transparent',
                    color: preferences.tone === t ? 'oklch(0.72 0.22 258)' : '#666678',
                    fontSize: 12,
                    fontFamily: 'Figtree, sans-serif',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#888898', fontFamily: 'Figtree, sans-serif', marginBottom: 8 }}>
              Output language
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['English', 'Spanish', 'French', 'German', 'Japanese'].map((l) => (
                <button
                  key={l}
                  onClick={() => setPreferences({ language: l })}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    border: `1px solid ${preferences.language === l ? 'oklch(0.62 0.22 258)' : '#232329'}`,
                    background: preferences.language === l ? 'oklch(0.62 0.22 258 / 0.14)' : 'transparent',
                    color: preferences.language === l ? 'oklch(0.72 0.22 258)' : '#666678',
                    fontSize: 12,
                    fontFamily: 'Figtree, sans-serif',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <Input
            label="Hugging Face API Key (server-side)"
            value={preferences.hfApiKeyMasked}
            onChange={(v) => setPreferences({ hfApiKeyMasked: v })}
            type="password"
            placeholder="Set HUGGINGFACE_API_KEY in .env.local"
            hint="The actual key is read from the server's HUGGINGFACE_API_KEY env var. This field is just a label."
          />
        </div>
      </Card>

      <Card style={{ marginBottom: 16, padding: 24 }}>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 14, fontWeight: 700, color: '#d0d0e8', marginBottom: 12 }}>
          Danger zone
        </div>
        <div style={{ fontSize: 12, color: '#666678', fontFamily: 'Figtree, sans-serif', marginBottom: 12 }}>
          Reset will clear your profile, sent emails, and campaigns from this browser.
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            if (confirm('Reset all local data? This cannot be undone.')) reset();
          }}
        >
          Reset all data
        </Button>
      </Card>
    </div>
  );
}
