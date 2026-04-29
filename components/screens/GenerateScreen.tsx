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

const GENERATE_STEPS = [
  { id: 'scrape', label: 'Scraping webpage', detail: 'Extracting job description and company data…' },
  { id: 'parse', label: 'Parsing requirements', detail: 'Identifying skills, responsibilities, and objectives…' },
  { id: 'match', label: 'Matching portfolio', detail: 'Finding your most relevant projects via vector similarity…' },
  { id: 'generate', label: 'Generating emails', detail: 'Crafting 3 personalized variations with LLM…' },
];

interface GenerateScreenProps {
  onResults: (emails: GeneratedEmail[]) => void;
}

export default function GenerateScreen({ onResults }: GenerateScreenProps) {
  const [url, setUrl] = useState('');
  const [company, setCompany] = useState('');
  const [stage, setStage] = useState<'idle' | 'loading' | 'done'>('idle');
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const handleGenerate = async () => {
    if (!url.trim()) return;

    setStage('loading');
    setCurrentStep(0);
    setCompletedSteps([]);

    const simulateSteps = async () => {
      for (let i = 0; i < GENERATE_STEPS.length; i++) {
        setCurrentStep(i);
        await new Promise((resolve) => setTimeout(resolve, 900 + Math.random() * 400));
        setCompletedSteps((prev) => [...prev, i]);
      }
    };

    try {
      await simulateSteps();

      const response = await axios.post('/api/generate-email', {
        jobUrl: url,
        jobDescription: 'Full Stack Engineer with experience in distributed systems and payment processing',
        company: company || 'TechCorp',
        userRole: 'Full Stack Engineer',
        skills: ['React', 'Node.js', 'PostgreSQL', 'Redis'],
        hiringManager: company ? undefined : 'Sarah Chen',
      });

      setStage('done');
      onResults(response.data.emails);
    } catch (error) {
      console.error('Error generating emails:', error);
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
          Paste a job listing or company URL and we'll do the rest.
        </div>
      </div>

      <Card style={{ padding: 28, marginBottom: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Input
            label="Job listing or company URL"
            value={url}
            onChange={setUrl}
            placeholder="https://stripe.com/jobs/listing/4521834"
            icon={<Icon.Globe />}
            hint="We'll scrape the page and extract job details automatically"
          />
          <Input
            label="Company name (optional)"
            value={company}
            onChange={setCompany}
            placeholder="e.g. Stripe"
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              onClick={handleGenerate}
              disabled={!url.trim() || stage === 'loading'}
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
