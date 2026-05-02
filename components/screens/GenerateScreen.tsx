'use client';

import { useState } from 'react';
import axios from 'axios';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import { Icon } from '@/components/Icons';
import { GeneratedEmail } from '@/lib/types';
import { useStore } from '@/lib/store';

const GENERATE_STEPS = [
  { id: 'scrape', label: 'Scraping webpage', detail: 'Extracting job description and company data…' },
  { id: 'parse', label: 'Parsing requirements', detail: 'Identifying skills, responsibilities, and objectives…' },
  { id: 'match', label: 'Matching portfolio', detail: 'Finding your most relevant projects via vector similarity…' },
  { id: 'generate', label: 'Generating emails', detail: 'Crafting 3 personalized variations with LLM…' },
];

interface GenerateScreenProps {
  onResults: (emails: GeneratedEmail[], meta: { company: string; jobDescription: string }) => void;
}

export default function GenerateScreen({ onResults }: GenerateScreenProps) {
  const { profile, preferences } = useStore();
  const [url, setUrl] = useState('');
  const [company, setCompany] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [hiringManager, setHiringManager] = useState('');
  const [stage, setStage] = useState<'idle' | 'loading' | 'done'>('idle');
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = (url.trim() || jobDescription.trim()) && !!company.trim();

  const handleGenerate = async () => {
    if (!canSubmit) return;
    setError(null);
    setStage('loading');
    setCurrentStep(0);
    setCompletedSteps([]);

    try {
      // Step 1: Scrape
      setCurrentStep(0);
      let resolvedDescription = jobDescription.trim();
      if (!resolvedDescription && url.trim()) {
        try {
          const r = await axios.post('/api/scrape', { url: url.trim() });
          resolvedDescription = r.data.text || '';
        } catch (e) {
          // fall through; backend can still try
        }
      }
      setCompletedSteps((p) => [...p, 0]);

      // Step 2: Parse (visual)
      setCurrentStep(1);
      await new Promise((r) => setTimeout(r, 600));
      setCompletedSteps((p) => [...p, 1]);

      // Step 3: Match (visual)
      setCurrentStep(2);
      await new Promise((r) => setTimeout(r, 600));
      setCompletedSteps((p) => [...p, 2]);

      // Step 4: Generate
      setCurrentStep(3);
      const response = await axios.post('/api/generate-email', {
        jobUrl: url.trim() || undefined,
        jobDescription: resolvedDescription || `Role at ${company}`,
        company: company.trim(),
        userRole: profile.role || 'Software Engineer',
        skills: profile.skills.length ? profile.skills : ['JavaScript'],
        hiringManager: hiringManager.trim() || undefined,
        tone: preferences.tone,
        language: preferences.language,
      });
      setCompletedSteps((p) => [...p, 3]);

      setStage('done');
      onResults(response.data.emails, {
        company: company.trim(),
        jobDescription: resolvedDescription,
      });
    } catch (err: any) {
      console.error('Error generating emails:', err);
      setError(err?.response?.data?.error || 'Failed to generate emails. Check your HUGGINGFACE_API_KEY.');
      setStage('idle');
    }
  };

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 0' }}>
      <div style={{ marginBottom: 36 }}>
        <div
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 28,
            fontWeight: 700,
            color: '#f0f0f8',
            letterSpacing: '-0.03em',
            marginBottom: 8,
          }}
        >
          Generate cold email
        </div>
        <div style={{ fontSize: 14, color: '#666678', fontFamily: 'Figtree, sans-serif' }}>
          Paste a job listing URL or job description and we'll do the rest.
        </div>
      </div>

      <Card style={{ padding: 28, marginBottom: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Input
            label="Job listing URL (optional)"
            value={url}
            onChange={setUrl}
            placeholder="https://company.com/jobs/listing"
            icon={<Icon.Globe />}
            hint="We'll fetch the page and use its content as the job description"
          />
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#888898', fontFamily: 'Figtree, sans-serif', marginBottom: 6 }}>
              Job description (optional if URL provided)
            </div>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here…"
              rows={5}
              style={{
                width: '100%',
                padding: '10px 12px',
                background: '#0e0e11',
                border: '1px solid #232329',
                borderRadius: 8,
                color: '#e0e0f0',
                fontFamily: 'Figtree, sans-serif',
                fontSize: 13,
                resize: 'vertical',
                outline: 'none',
              }}
            />
          </div>
          <Input
            label="Company name"
            value={company}
            onChange={setCompany}
            placeholder="e.g. Stripe"
          />
          <Input
            label="Hiring manager (optional)"
            value={hiringManager}
            onChange={setHiringManager}
            placeholder="e.g. Sarah Chen"
          />
          {error && (
            <div
              style={{
                padding: '10px 12px',
                background: 'oklch(0.55 0.22 25 / 0.14)',
                border: '1px solid oklch(0.55 0.22 25 / 0.4)',
                borderRadius: 8,
                fontSize: 12,
                color: 'oklch(0.78 0.18 25)',
                fontFamily: 'Figtree, sans-serif',
              }}
            >
              {error}
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              onClick={handleGenerate}
              disabled={!canSubmit || stage === 'loading'}
              size="lg"
              icon={stage === 'loading' ? <Spinner size={16} color="white" /> : <Icon.Zap />}
            >
              {stage === 'loading' ? 'Generating…' : 'Analyze & Generate'}
            </Button>
          </div>
        </div>
      </Card>

      {stage !== 'idle' && (
        <Card style={{ padding: 24 }}>
          <div
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 13,
              fontWeight: 600,
              color: '#888898',
              marginBottom: 20,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Processing
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {GENERATE_STEPS.map((s, i) => {
              const done = completedSteps.includes(i);
              const active = currentStep === i && !done;
              return (
                <div
                  key={s.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    opacity: i > currentStep && !done ? 0.35 : 1,
                    transition: 'opacity 0.3s',
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: done ? 'oklch(0.62 0.22 258 / 0.14)' : active ? 'transparent' : '#1a1a22',
                      border: `1.5px solid ${done ? 'oklch(0.62 0.22 258)' : active ? 'oklch(0.62 0.22 258)' : '#2a2a34'}`,
                      transition: 'all 0.3s',
                    }}
                  >
                    {done ? (
                      <span style={{ color: 'oklch(0.62 0.22 258)' }}>
                        <Icon.Check />
                      </span>
                    ) : active ? (
                      <Spinner size={14} />
                    ) : (
                      <span
                        style={{
                          fontSize: 10,
                          color: '#44445a',
                          fontWeight: 700,
                          fontFamily: 'Space Grotesk, sans-serif',
                        }}
                      >
                        {i + 1}
                      </span>
                    )}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: done || active ? '#e0e0f0' : '#55556a',
                        fontFamily: 'Space Grotesk, sans-serif',
                        transition: 'color 0.3s',
                      }}
                    >
                      {s.label}
                    </div>
                    {active && (
                      <div
                        style={{
                          fontSize: 12,
                          color: '#666678',
                          fontFamily: 'Figtree, sans-serif',
                          marginTop: 2,
                        }}
                      >
                        {s.detail}
                      </div>
                    )}
                  </div>
                  {done && <Badge color="green">Done</Badge>}
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
