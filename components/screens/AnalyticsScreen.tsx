'use client';

import { useMemo } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import StatCard from '@/components/ui/StatCard';
import Button from '@/components/ui/Button';
import { Icon } from '@/components/Icons';
import { useStore } from '@/lib/store';

export default function AnalyticsScreen() {
  const { sentEmails, removeSentEmail } = useStore();

  const { bars, totals } = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dayMs = 86400000;

    const bars = Array.from({ length: 7 }, (_, i) => {
      const dayStart = today.getTime() - (6 - i) * dayMs;
      const dayEnd = dayStart + dayMs;
      const dayEmails = sentEmails.filter((e) => e.sentAt >= dayStart && e.sentAt < dayEnd);
      return {
        day: days[new Date(dayStart).getDay()],
        sent: dayEmails.length,
        opened: dayEmails.filter((e) => e.opened).length,
        replied: dayEmails.filter((e) => e.replied).length,
      };
    });

    const totalSent = sentEmails.length;
    const totalOpened = sentEmails.filter((e) => e.opened).length;
    const totalReplied = sentEmails.filter((e) => e.replied).length;
    const avgScore = totalSent ? Math.round(sentEmails.reduce((s, e) => s + e.score, 0) / totalSent) : 0;
    const weekAgo = today.getTime() - 7 * dayMs;
    const sentThisWeek = sentEmails.filter((e) => e.sentAt >= weekAgo).length;

    return {
      bars,
      totals: {
        sentThisWeek,
        openRate: totalSent ? Math.round((totalOpened / totalSent) * 100) : 0,
        replyRate: totalSent ? Math.round((totalReplied / totalSent) * 100) : 0,
        avgScore,
      },
    };
  }, [sentEmails]);

  const maxBar = Math.max(1, ...bars.map((b) => b.sent));
  const recent = sentEmails.slice(0, 5);

  const fmtTime = (ts: number) => {
    const diff = Date.now() - ts;
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    return `${d}d ago`;
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 0' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 26, fontWeight: 700, color: '#f0f0f8', letterSpacing: '-0.03em' }}>
          Analytics
        </div>
        <div style={{ fontSize: 13, color: '#666678', fontFamily: 'Figtree, sans-serif', marginTop: 4 }}>
          Email performance & tracking
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Sent this week" value={String(totals.sentThisWeek)} delta={totals.sentThisWeek > 0 ? `+${totals.sentThisWeek}` : '—'} />
        <StatCard label="Open rate" value={`${totals.openRate}%`} delta={totals.openRate > 0 ? `${totals.openRate}%` : '—'} color="oklch(0.68 0.18 155)" />
        <StatCard label="Reply rate" value={`${totals.replyRate}%`} delta={totals.replyRate > 0 ? `${totals.replyRate}%` : '—'} color="oklch(0.72 0.22 258)" />
        <StatCard label="Avg AI Score" value={String(totals.avgScore)} delta={totals.avgScore > 0 ? `${totals.avgScore}` : '—'} color="oklch(0.75 0.16 75)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <Card style={{ padding: 22 }}>
          <div
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 12,
              fontWeight: 600,
              color: '#666678',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: 20,
            }}
          >
            Last 7 Days (sent)
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 120 }}>
            {bars.map((b, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ width: '100%', background: 'oklch(0.62 0.22 258 / 0.14)', borderRadius: '3px 3px 0 0', height: `${(b.sent / maxBar) * 100}%`, position: 'relative', minHeight: b.sent > 0 ? 4 : 2 }}>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'oklch(0.62 0.22 258)', borderRadius: '3px 3px 0 0', height: b.sent > 0 ? `${(b.replied / b.sent) * 100}%` : '0%' }} />
                </div>
                <div style={{ fontSize: 10, color: '#44445a', fontFamily: 'Space Grotesk, sans-serif' }}>
                  {b.day}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{ padding: 22 }}>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, fontWeight: 600, color: '#666678', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 20 }}>
            Email Status
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'oklch(0.68 0.18 155)', fontFamily: 'Space Grotesk, sans-serif' }}>
                {totals.replyRate}%
              </div>
              <div style={{ fontSize: 10, color: '#666678', fontFamily: 'Figtree, sans-serif', marginTop: 4 }}>
                Replied
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: 'oklch(0.68 0.18 155)' }} />
                <span style={{ fontSize: 12, color: '#888898', fontFamily: 'Figtree, sans-serif' }}>
                  Replied
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: 'oklch(0.62 0.22 258)' }} />
                <span style={{ fontSize: 12, color: '#888898', fontFamily: 'Figtree, sans-serif' }}>
                  Opened
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #1e1e26' }}>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 600, color: '#888898' }}>
            Recent Emails
          </div>
        </div>
        {recent.length === 0 ? (
          <div style={{ padding: '32px 20px', fontSize: 13, color: '#55556a', fontFamily: 'Figtree, sans-serif', textAlign: 'center' }}>
            No emails sent yet. Generate and send your first one from the Generate tab.
          </div>
        ) : (
          recent.map((e, i) => (
            <div
              key={e.id}
              style={{
                padding: '13px 20px',
                borderBottom: i < recent.length - 1 ? '1px solid #1a1a22' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
              }}
            >
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#1a1a22', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#55556a', flexShrink: 0 }}>
                <Icon.Mail />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 600, color: '#d8d8e8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {e.subject}
                </div>
                <div style={{ fontSize: 11, color: '#44445a', fontFamily: 'Figtree, sans-serif', marginTop: 2 }}>
                  {e.to}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <Badge color={e.opened ? 'green' : 'default'}>
                  {e.opened ? 'Opened' : 'Sent'}
                </Badge>
                {e.replied && <Badge color="accent">Replied</Badge>}
              </div>
              <div style={{ fontSize: 11, color: '#44445a', fontFamily: 'Figtree, sans-serif', flexShrink: 0 }}>
                {fmtTime(e.sentAt)}
              </div>
              <Button variant="ghost" size="sm" icon={<Icon.Trash />} onClick={() => removeSentEmail(e.id)} />
            </div>
          ))
        )}
      </Card>
    </div>
  );
}
