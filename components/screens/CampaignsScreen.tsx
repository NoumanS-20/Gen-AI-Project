'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import StatCard from '@/components/ui/StatCard';
import Input from '@/components/ui/Input';
import { Icon } from '@/components/Icons';
import { useStore } from '@/lib/store';
import { Campaign } from '@/lib/types';

export default function CampaignsScreen() {
  const { campaigns, sentEmails, addCampaign, removeCampaign } = useStore();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [viewing, setViewing] = useState<string | null>(null);

  const statusColors: Record<string, 'green' | 'accent' | 'default'> = {
    active: 'green',
    complete: 'accent',
    draft: 'default',
  };

  const stats = (id: string) => {
    const items = sentEmails.filter((e) => e.campaignId === id);
    return {
      sent: items.length,
      opened: items.filter((e) => e.opened).length,
      replied: items.filter((e) => e.replied).length,
    };
  };

  const totalSent = sentEmails.length;
  const totalOpened = sentEmails.filter((e) => e.opened).length;
  const totalReplied = sentEmails.filter((e) => e.replied).length;
  const openRate = totalSent ? Math.round((totalOpened / totalSent) * 100) : 0;
  const replyRate = totalSent ? Math.round((totalReplied / totalSent) * 100) : 0;

  const handleCreate = () => {
    if (!name.trim()) return;
    const c: Campaign = {
      id: `c-${Date.now()}`,
      name: name.trim(),
      emails: 0,
      sent: 0,
      opened: 0,
      replied: 0,
      status: 'active',
      created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
    addCampaign(c);
    setName('');
    setCreating(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this campaign? Sent emails will keep their record.')) {
      removeCampaign(id);
      if (viewing === id) setViewing(null);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 26, fontWeight: 700, color: '#f0f0f8', letterSpacing: '-0.03em' }}>
            Campaigns
          </div>
          <div style={{ fontSize: 13, color: '#666678', fontFamily: 'Figtree, sans-serif', marginTop: 4 }}>
            Manage and track your outreach campaigns
          </div>
        </div>
        <Button icon={<Icon.Plus />} onClick={() => setCreating(true)}>
          New Campaign
        </Button>
      </div>

      {creating && (
        <Card style={{ padding: 20, marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <Input
                label="Campaign name"
                value={name}
                onChange={setName}
                placeholder="e.g. Fintech Series-A Q2"
              />
            </div>
            <Button onClick={handleCreate} disabled={!name.trim()}>Create</Button>
            <Button variant="ghost" onClick={() => { setCreating(false); setName(''); }}>Cancel</Button>
          </div>
        </Card>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 28 }}>
        <StatCard label="Total Emails Sent" value={String(totalSent)} delta={totalSent > 0 ? `+${totalSent}` : '—'} />
        <StatCard label="Avg Open Rate" value={`${openRate}%`} delta={openRate > 0 ? `${openRate}%` : '—'} color="oklch(0.68 0.18 155)" />
        <StatCard label="Avg Reply Rate" value={`${replyRate}%`} delta={replyRate > 0 ? `${replyRate}%` : '—'} color="oklch(0.72 0.22 258)" />
      </div>

      {campaigns.length === 0 ? (
        <Card style={{ padding: 40, textAlign: 'center' }}>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, fontWeight: 600, color: '#888898', marginBottom: 6 }}>
            No campaigns yet
          </div>
          <div style={{ fontSize: 13, color: '#55556a', fontFamily: 'Figtree, sans-serif', marginBottom: 18 }}>
            Create a campaign to organize your outreach.
          </div>
          <Button icon={<Icon.Plus />} onClick={() => setCreating(true)}>New Campaign</Button>
        </Card>
      ) : (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div
            style={{
              padding: '14px 20px',
              borderBottom: '1px solid #1e1e26',
              display: 'grid',
              gridTemplateColumns: '2fr 80px 80px 80px 100px 80px',
              gap: 12,
              alignItems: 'center',
            }}
          >
            {['Campaign', 'Sent', 'Opened', 'Replied', 'Status', ''].map((h) => (
              <div key={h} style={{ fontSize: 11, fontWeight: 600, color: '#55556a', fontFamily: 'Space Grotesk, sans-serif', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {h}
              </div>
            ))}
          </div>
          {campaigns.map((c) => {
            const s = stats(c.id);
            const items = sentEmails.filter((e) => e.campaignId === c.id);
            const isViewing = viewing === c.id;
            return (
              <div key={c.id}>
                <div
                  style={{
                    padding: '14px 20px',
                    borderBottom: '1px solid #1a1a22',
                    display: 'grid',
                    gridTemplateColumns: '2fr 80px 80px 80px 100px 80px',
                    gap: 12,
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 600, color: '#e0e0f0' }}>
                      {c.name}
                    </div>
                    <div style={{ fontSize: 11, color: '#44445a', fontFamily: 'Figtree, sans-serif', marginTop: 2 }}>
                      Created {c.created}
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: '#c0c0d0', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>
                    {s.sent}
                  </div>
                  <div style={{ fontSize: 13, color: s.opened > 0 ? 'oklch(0.68 0.18 155)' : '#555568', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>
                    {s.opened}
                  </div>
                  <div style={{ fontSize: 13, color: s.replied > 0 ? 'oklch(0.72 0.22 258)' : '#555568', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>
                    {s.replied}
                  </div>
                  <Badge color={statusColors[c.status]}>{c.status}</Badge>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Button variant="ghost" size="sm" icon={<Icon.Eye />} onClick={() => setViewing(isViewing ? null : c.id)} />
                    <Button variant="ghost" size="sm" icon={<Icon.Trash />} onClick={() => handleDelete(c.id)} />
                  </div>
                </div>
                {isViewing && (
                  <div style={{ padding: '12px 20px', background: '#0a0a0d', borderBottom: '1px solid #1a1a22' }}>
                    {items.length === 0 ? (
                      <div style={{ fontSize: 12, color: '#55556a', fontFamily: 'Figtree, sans-serif', padding: '8px 0' }}>
                        No emails in this campaign yet. Send an email and assign it during the send flow.
                      </div>
                    ) : (
                      items.map((e) => (
                        <div key={e.id} style={{ padding: '8px 0', borderBottom: '1px solid #161620', display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: '#d8d8e8', fontFamily: 'Space Grotesk, sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {e.subject}
                            </div>
                            <div style={{ fontSize: 11, color: '#44445a', fontFamily: 'Figtree, sans-serif', marginTop: 2 }}>
                              {e.to} • Score {e.score}
                            </div>
                          </div>
                          <Badge color={e.opened ? 'green' : 'default'}>{e.opened ? 'Opened' : 'Sent'}</Badge>
                          {e.replied && <Badge color="accent">Replied</Badge>}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
}
