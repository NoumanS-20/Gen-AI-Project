'use client';

import { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ProgressRing from '@/components/ui/ProgressRing';
import Input from '@/components/ui/Input';
import { Icon } from '@/components/Icons';
import { GeneratedEmail } from '@/lib/types';
import { useStore } from '@/lib/store';

interface ResultsScreenProps {
  emails: GeneratedEmail[];
  meta: { company: string; jobDescription: string };
  onBack: () => void;
}

export default function ResultsScreen({ emails: initialEmails, meta, onBack }: ResultsScreenProps) {
  const { addSentEmail, campaigns, profile } = useStore();
  const [emails, setEmails] = useState<GeneratedEmail[]>(initialEmails);
  const [selected, setSelected] = useState(0);
  const [copied, setCopied] = useState(false);
  const [sentIds, setSentIds] = useState<number[]>([]);
  const [editing, setEditing] = useState(false);
  const [showSendForm, setShowSendForm] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [campaignId, setCampaignId] = useState<string>('');
  const [sending, setSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendError, setSendError] = useState('');
  const sendFormRef = useRef<HTMLDivElement>(null);
  const email = emails[selected];
  const isSent = sentIds.includes(selected);

  // Auto-dismiss success toast after 4 seconds
  useEffect(() => {
    if (sendSuccess) {
      const timer = setTimeout(() => setSendSuccess(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [sendSuccess]);

  const updateEmail = (patch: Partial<GeneratedEmail>) => {
    setEmails((prev) => prev.map((e, i) => (i === selected ? { ...e, ...patch } : e)));
  };

  const handleCopy = async () => {
    const text = `Subject: ${email.subject}\n\n${email.body}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendClick = () => {
    if (isSent) return;
    setShowSendForm(true);
    setSendError('');
    // Scroll to send form after it renders
    setTimeout(() => {
      sendFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  };

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const confirmSend = async () => {
    if (!recipient.trim() || !isValidEmail(recipient.trim())) return;

    setSending(true);
    setSendError('');

    try {
      // Send actual email via EmailJS
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error('EmailJS is not configured. Add NEXT_PUBLIC_EMAILJS_SERVICE_ID, NEXT_PUBLIC_EMAILJS_TEMPLATE_ID, and NEXT_PUBLIC_EMAILJS_PUBLIC_KEY to .env.local');
      }

      await emailjs.send(
        serviceId,
        templateId,
        {
          to_email: recipient.trim(),
          from_name: profile.name || 'SmartReach User',
          from_email: profile.email || 'noreply@smartreach.ai',
          subject: email.subject,
          message: email.body,
          company: meta.company || 'Unknown',
        },
        publicKey
      );

      const id = `${Date.now()}-${selected}`;
      addSentEmail({
        id,
        to: recipient.trim(),
        subject: email.subject,
        body: email.body,
        score: email.score,
        company: meta.company || 'Unknown',
        campaignId: campaignId || undefined,
        opened: false,
        replied: false,
        sentAt: Date.now(),
      });

      setSentIds((p) => [...p, selected]);
      setShowSendForm(false);
      setRecipient('');
      setSendSuccess(true);
    } catch (err: any) {
      console.error('EmailJS send error:', err);
      setSendError(err?.text || err?.message || 'Failed to send email. Please check your EmailJS configuration.');
    } finally {
      setSending(false);
    }
  };

  const scoreColor = (v: number) =>
    v >= 90 ? 'oklch(0.68 0.18 155)' : v >= 75 ? 'oklch(0.62 0.22 258)' : 'oklch(0.75 0.16 75)';

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 0', position: 'relative' }}>
      {/* ── Send Email Modal ──────────────────────────────── */}
      {showSendForm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            animation: 'modal-fade-in 0.2s ease forwards',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) { setShowSendForm(false); setRecipient(''); setSendError(''); } }}
        >
          <div
            ref={sendFormRef}
            style={{
              width: '100%',
              maxWidth: 460,
              background: '#111116',
              border: '1px solid #232329',
              borderRadius: 16,
              padding: '28px 28px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)',
              animation: 'modal-slide-up 0.25s ease forwards',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: 16,
                  fontWeight: 700,
                  color: '#f0f0f8',
                }}
              >
                Send Email
              </div>
              <button
                onClick={() => { setShowSendForm(false); setRecipient(''); setSendError(''); }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#55556a',
                  fontSize: 18,
                  lineHeight: 1,
                  padding: 4,
                }}
              >
                ×
              </button>
            </div>

            {/* Preview subject */}
            <div
              style={{
                background: '#0c0c10',
                borderRadius: 10,
                padding: '12px 16px',
                border: '1px solid #1e1e26',
              }}
            >
              <div style={{ fontSize: 10, color: '#44445a', fontFamily: 'Figtree, sans-serif', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                Subject
              </div>
              <div style={{ fontSize: 13, color: '#c0c0d8', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>
                {email.subject}
              </div>
            </div>

            <Input
              label="Recipient email"
              value={recipient}
              onChange={setRecipient}
              placeholder="recipient@company.com"
              type="email"
              icon={<Icon.Mail />}
            />
            {recipient.trim() && !isValidEmail(recipient.trim()) && (
              <span style={{ fontSize: 11, color: 'oklch(0.65 0.22 25)', fontFamily: 'Figtree, sans-serif', marginTop: -8 }}>
                Please enter a valid email address
              </span>
            )}
            {sendError && (
              <div style={{
                background: 'oklch(0.65 0.22 25 / 0.10)',
                borderRadius: 8,
                padding: '10px 14px',
                display: 'flex',
                gap: 8,
                alignItems: 'center',
              }}>
                <span style={{ fontSize: 12, color: 'oklch(0.65 0.22 25)', fontFamily: 'Figtree, sans-serif' }}>
                  {sendError}
                </span>
              </div>
            )}
            {campaigns.length > 0 && (
              <div>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#888898', fontFamily: 'Figtree, sans-serif', marginBottom: 6 }}>
                  Campaign (optional)
                </div>
                <select
                  value={campaignId}
                  onChange={(e) => setCampaignId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: '#111114',
                    border: '1px solid #232329',
                    borderRadius: 8,
                    color: '#e0e0f0',
                    fontSize: 13,
                    fontFamily: 'Figtree, sans-serif',
                  }}
                >
                  <option value="">No campaign</option>
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <Button
                onClick={confirmSend}
                disabled={!recipient.trim() || !isValidEmail(recipient.trim()) || sending}
                icon={
                  sending ? (
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        border: '2px solid rgba(255,255,255,0.2)',
                        borderTopColor: '#fff',
                        borderRadius: '50%',
                        animation: 'spin 0.7s linear infinite',
                      }}
                    />
                  ) : (
                    <Icon.Send />
                  )
                }
              >
                {sending ? 'Sending…' : 'Send Now'}
              </Button>
              <Button variant="ghost" onClick={() => { setShowSendForm(false); setRecipient(''); setSendError(''); }}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* ── Success Toast ─────────────────────────────────── */}
      {sendSuccess && (
        <div
          style={{
            position: 'fixed',
            top: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 999,
            background: 'oklch(0.22 0.08 155)',
            border: '1px solid oklch(0.68 0.18 155 / 0.4)',
            borderRadius: 12,
            padding: '14px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px oklch(0.68 0.18 155 / 0.1)',
            animation: 'onb-fadeSlide 0.35s ease forwards',
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'oklch(0.68 0.18 155 / 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <span style={{ color: 'oklch(0.68 0.18 155)' }}>
              <Icon.Check />
            </span>
          </div>
          <div>
            <div
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700,
                fontSize: 14,
                color: 'oklch(0.88 0.08 155)',
              }}
            >
              Email sent successfully!
            </div>
            <div
              style={{
                fontFamily: 'Figtree, sans-serif',
                fontSize: 12,
                color: 'oklch(0.68 0.18 155 / 0.7)',
                marginTop: 2,
              }}
            >
              Your cold email has been delivered
            </div>
          </div>
          <button
            onClick={() => setSendSuccess(false)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'oklch(0.68 0.18 155 / 0.5)',
              fontSize: 16,
              padding: '0 0 0 8px',
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* ── CSS for animations ─────────────────────────── */}
      <style>{`
        @keyframes onb-fadeSlide {
          from { opacity: 0; transform: translateX(-50%) translateY(-16px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes send-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes modal-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modal-slide-up {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
        <Button variant="ghost" onClick={onBack} icon={<Icon.Arrow dir="left" />}>
          Back
        </Button>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 22,
              fontWeight: 700,
              color: '#f0f0f8',
              letterSpacing: '-0.02em',
            }}
          >
            {emails.length} emails generated
          </div>
          <div style={{ fontSize: 12, color: '#666678', fontFamily: 'Figtree, sans-serif', marginTop: 2 }}>
            For: {meta.company || 'Your target company'}
          </div>
        </div>
        <Badge color="accent">
          <Icon.Zap />
          AI Powered
        </Badge>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {emails.map((e, i) => (
              <button
                key={i}
                onClick={() => { setSelected(i); setEditing(false); setShowSendForm(false); }}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: `1px solid ${selected === i ? 'oklch(0.62 0.22 258)' : '#232329'}`,
                  background: selected === i ? 'oklch(0.62 0.22 258 / 0.14)' : 'transparent',
                  cursor: 'pointer',
                  color: selected === i ? 'oklch(0.72 0.22 258)' : '#666678',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 600,
                  fontSize: 12,
                  transition: 'all 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                Variant {i + 1}
                {sentIds.includes(i) && (
                  <span style={{ color: 'oklch(0.68 0.18 155)', display: 'flex' }}>
                    <Icon.Check />
                  </span>
                )}
                <span
                  style={{
                    background: selected === i ? 'oklch(0.62 0.22 258)' : '#2a2a34',
                    color: '#fff',
                    borderRadius: 99,
                    padding: '1px 6px',
                    fontSize: 10,
                  }}
                >
                  {e.score}
                </span>
              </button>
            ))}
          </div>

          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #1e1e26', background: '#0e0e11' }}>
              <div
                style={{
                  fontSize: 11,
                  color: '#44445a',
                  fontFamily: 'Figtree, sans-serif',
                  marginBottom: 4,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                Subject
              </div>
              {editing ? (
                <input
                  value={email.subject}
                  onChange={(e) => updateEmail({ subject: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#e8e8f4',
                  }}
                />
              ) : (
                <div
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#e8e8f4',
                  }}
                >
                  {email.subject}
                </div>
              )}
            </div>
            {editing ? (
              <textarea
                value={email.body}
                onChange={(e) => updateEmail({ body: e.target.value })}
                style={{
                  width: '100%',
                  padding: '20px 22px',
                  fontFamily: 'Figtree, sans-serif',
                  fontSize: 13,
                  color: '#c0c0d8',
                  lineHeight: 1.8,
                  minHeight: 260,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  resize: 'vertical',
                }}
              />
            ) : (
              <div
                style={{
                  padding: '20px 22px',
                  fontFamily: 'Figtree, sans-serif',
                  fontSize: 13,
                  color: '#c0c0d8',
                  lineHeight: 1.8,
                  whiteSpace: 'pre-wrap',
                  minHeight: 260,
                }}
              >
                {email.body}
              </div>
            )}

            {/* ── Action Bar ────────────────────────────────── */}
            <div style={{ padding: '14px 20px', borderTop: '1px solid #1e1e26', display: 'flex', gap: 8, background: '#0e0e11' }}>
              <Button
                variant={isSent ? 'secondary' : 'primary'}
                size="sm"
                onClick={handleSendClick}
                disabled={isSent}
                icon={isSent ? <Icon.Check /> : <Icon.Send />}
              >
                {isSent ? 'Sent ✓' : 'Send Email'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopy}
                icon={copied ? <Icon.Check /> : <Icon.Copy />}
              >
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setEditing((e) => !e)} icon={<Icon.Edit />}>
                {editing ? 'Done' : 'Edit'}
              </Button>
            </div>
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card style={{ padding: 22 }}>
            <div
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: 12,
                fontWeight: 600,
                color: '#666678',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 16,
              }}
            >
              AI Score
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <ProgressRing value={email.score} size={80} strokeWidth={6} color={scoreColor(email.score)} />
                <div style={{ position: 'absolute', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 22, fontWeight: 800, color: scoreColor(email.score) }}>
                    {email.score}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: '#666678', fontFamily: 'Figtree, sans-serif', marginTop: 8 }}>
                {email.score >= 90 ? 'Excellent' : email.score >= 80 ? 'Good' : 'Fair'}
              </div>
            </div>
            {[
              ['Relevance', email.relevance],
              ['Tone', email.tone],
              ['Personalization', email.personalization],
              ['Clarity', email.clarity],
            ].map(([label, val]) => (
              <div key={label as string} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 12, color: '#888898', fontFamily: 'Figtree, sans-serif' }}>{label}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: scoreColor(val as number), fontFamily: 'Space Grotesk, sans-serif' }}>
                    {val}
                  </span>
                </div>
                <div style={{ height: 4, background: '#1e1e26', borderRadius: 99, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${val}%`,
                      background: scoreColor(val as number),
                      borderRadius: 99,
                      transition: 'width 0.6s ease',
                    }}
                  />
                </div>
              </div>
            ))}
          </Card>

          <Card style={{ padding: 18 }}>
            <div
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: 12,
                fontWeight: 600,
                color: '#666678',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 12,
              }}
            >
              Response Prediction
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 32, fontWeight: 800, color: 'oklch(0.68 0.18 155)' }}>
                {Math.max(10, Math.round(email.score * 0.4))}%
              </span>
              <span style={{ fontSize: 12, color: '#666678', fontFamily: 'Figtree, sans-serif' }}>
                reply likelihood
              </span>
            </div>
            <div style={{ fontSize: 11, color: '#55556a', fontFamily: 'Figtree, sans-serif', lineHeight: 1.6 }}>
              Estimated based on AI score vs. industry average of 10%
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
