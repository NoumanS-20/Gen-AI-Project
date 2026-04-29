'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Tag from '@/components/ui/Tag';
import { Icon } from '@/components/Icons';

interface OnboardingProps {
  onComplete: () => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [resumeFile, setResumeFile] = useState<{ name: string } | null>(null);
  const [portfolioLinks, setPortfolioLinks] = useState(['']);
  const [skills, setSkills] = useState(['React', 'Node.js', 'Python']);
  const [newSkill, setNewSkill] = useState('');
  const [name, setName] = useState('Alex Johnson');
  const [role, setRole] = useState('Full Stack Engineer');
  const [dragOver, setDragOver] = useState(false);

  const steps = ['Profile', 'Resume & Skills', 'Portfolio'];

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        background: '#09090b',
      }}
    >
      <div style={{ width: '100%', maxWidth: 540 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'oklch(0.62 0.22 258)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <span
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: 17,
              color: '#f0f0f8',
              letterSpacing: '-0.02em',
            }}
          >
            SmartReach AI
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 36 }}>
          {steps.map((s, i) => (
            <div key={s}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background:
                      i < step
                        ? 'oklch(0.62 0.22 258)'
                        : i === step
                        ? 'oklch(0.62 0.22 258 / 0.14)'
                        : '#1a1a22',
                    border: `1.5px solid ${i <= step ? 'oklch(0.62 0.22 258)' : '#2a2a34'}`,
                    fontSize: 12,
                    fontWeight: 700,
                    color:
                      i <= step
                        ? i < step
                          ? '#fff'
                          : 'oklch(0.72 0.22 258)'
                        : '#44445a',
                    fontFamily: 'Space Grotesk, sans-serif',
                    transition: 'all 0.3s',
                  }}
                >
                  {i < step ? <Icon.Check /> : i + 1}
                </div>
                <span
                  style={{
                    fontSize: 11,
                    color: i === step ? 'oklch(0.72 0.22 258)' : '#44445a',
                    fontFamily: 'Figtree, sans-serif',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {s}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: 1,
                    background: i < step ? 'oklch(0.62 0.22 258)' : '#1e1e26',
                    margin: '0 8px',
                    marginBottom: 20,
                    transition: 'background 0.3s',
                  }}
                />
              )}
            </div>
          ))}
        </div>

        <Card style={{ padding: 32 }}>
          {step === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <div
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: 22,
                    fontWeight: 700,
                    color: '#f0f0f8',
                    marginBottom: 6,
                  }}
                >
                  Welcome to SmartReach
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: '#666678',
                    fontFamily: 'Figtree, sans-serif',
                    lineHeight: 1.6,
                  }}
                >
                  Let's set up your profile so we can personalize every email to your background.
                </div>
              </div>
              <Input label="Full Name" value={name} onChange={setName} placeholder="Your full name" />
              <Input
                label="Current Role / Target Role"
                value={role}
                onChange={setRole}
                placeholder="e.g. Full Stack Engineer"
              />
              <Input
                label="Email Address"
                value="alex@example.com"
                onChange={() => {}}
                placeholder="you@company.com"
              />
            </div>
          )}

          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <div
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: 22,
                    fontWeight: 700,
                    color: '#f0f0f8',
                    marginBottom: 6,
                  }}
                >
                  Upload your resume
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: '#666678',
                    fontFamily: 'Figtree, sans-serif',
                    lineHeight: 1.6,
                  }}
                >
                  We'll extract your skills and experience to match against job listings.
                </div>
              </div>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  setResumeFile({ name: e.dataTransfer.files[0]?.name || 'resume.pdf' });
                }}
                onClick={() => setResumeFile({ name: 'Alex_Johnson_Resume.pdf' })}
                style={{
                  border: `2px dashed ${
                    dragOver
                      ? 'oklch(0.62 0.22 258)'
                      : resumeFile
                      ? 'oklch(0.68 0.18 155)'
                      : '#2a2a34'
                  }`,
                  borderRadius: 10,
                  padding: 28,
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: dragOver
                    ? 'oklch(0.62 0.22 258 / 0.14)'
                    : resumeFile
                    ? 'oklch(0.68 0.18 155 / 0.14)'
                    : '#0e0e11',
                  transition: 'all 0.2s',
                }}
              >
                {resumeFile ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    <span style={{ color: 'oklch(0.68 0.18 155)', display: 'flex' }}>
                      <Icon.Check />
                    </span>
                    <span
                      style={{
                        color: 'oklch(0.68 0.18 155)',
                        fontFamily: 'Figtree, sans-serif',
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                    >
                      {resumeFile.name}
                    </span>
                  </div>
                ) : (
                  <>
                    <div style={{ color: '#44445a', marginBottom: 8, display: 'flex', justifyContent: 'center' }}>
                      <Icon.Upload />
                    </div>
                    <div style={{ fontFamily: 'Figtree, sans-serif', fontSize: 13, color: '#888898' }}>
                      Drop your PDF here, or{' '}
                      <span style={{ color: 'oklch(0.72 0.22 258)' }}>click to upload</span>
                    </div>
                    <div style={{ fontFamily: 'Figtree, sans-serif', fontSize: 11, color: '#44445a', marginTop: 4 }}>
                      PDF, DOCX up to 5MB
                    </div>
                  </>
                )}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: '#888898',
                    fontFamily: 'Figtree, sans-serif',
                    marginBottom: 10,
                  }}
                >
                  Skills
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                  {skills.map((s) => (
                    <Tag key={s} onRemove={() => setSkills(skills.filter((x) => x !== s))}>
                      {s}
                    </Tag>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Input
                    value={newSkill}
                    onChange={setNewSkill}
                    placeholder="Add a skill…"
                    style={{ flex: 1 }}
                  />
                  <Button variant="secondary" onClick={addSkill} icon={<Icon.Plus />}>
                    Add
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <div
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: 22,
                    fontWeight: 700,
                    color: '#f0f0f8',
                    marginBottom: 6,
                  }}
                >
                  Link your portfolio
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: '#666678',
                    fontFamily: 'Figtree, sans-serif',
                    lineHeight: 1.6,
                  }}
                >
                  We'll scrape and index your projects to match them against job requirements.
                </div>
              </div>
              {portfolioLinks.map((link, i) => (
                <Input
                  key={i}
                  value={link}
                  onChange={(v) => {
                    const n = [...portfolioLinks];
                    n[i] = v;
                    setPortfolioLinks(n);
                  }}
                  placeholder="https://github.com/you/project"
                  icon={<Icon.Link />}
                  label={i === 0 ? 'Portfolio Links' : undefined}
                />
              ))}
              <Button
                variant="ghost"
                onClick={() => setPortfolioLinks([...portfolioLinks, ''])}
                icon={<Icon.Plus />}
                style={{ alignSelf: 'flex-start' }}
              >
                Add another link
              </Button>
              <div
                style={{
                  background: 'oklch(0.62 0.22 258 / 0.14)',
                  borderRadius: 8,
                  padding: '12px 14px',
                  display: 'flex',
                  gap: 10,
                  alignItems: 'flex-start',
                }}
              >
                <span
                  style={{
                    color: 'oklch(0.72 0.22 258)',
                    marginTop: 1,
                    flexShrink: 0,
                  }}
                >
                  <Icon.Zap />
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: '#9090b8',
                    fontFamily: 'Figtree, sans-serif',
                    lineHeight: 1.6,
                  }}
                >
                  SmartReach will automatically embed your project descriptions into a vector database for intelligent matching.
                </span>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
            {step > 0 ? (
              <Button variant="ghost" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            ) : (
              <div />
            )}
            <Button
              onClick={() => (step < 2 ? setStep(step + 1) : onComplete())}
              icon={step === 2 ? <Icon.Zap /> : undefined}
            >
              {step === 2 ? 'Finish Setup' : 'Continue'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
