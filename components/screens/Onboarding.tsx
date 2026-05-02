'use client';

import { useState, useRef } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Tag from '@/components/ui/Tag';
import { Icon } from '@/components/Icons';
import { useStore } from '@/lib/store';
import { extractTextFromPDF } from '@/lib/pdfExtract';

interface OnboardingProps {
  onComplete: () => void;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function OnboardingScreen({ onComplete }: OnboardingProps) {
  const { setProfile } = useStore();
  const [step, setStep] = useState(0);
  const [resumeFile, setResumeFile] = useState<{ name: string } | null>(null);
  const [portfolioLinks, setPortfolioLinks] = useState(['']);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [dragOver, setDragOver] = useState(false);

  // Skill extraction state
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState('');
  const [extractedCount, setExtractedCount] = useState(0);

  // Validation state – tracks whether user has attempted to proceed
  const [attempted, setAttempted] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Per-step validation ──────────────────────────────────
  const step0Errors = {
    name: !name.trim(),
    role: !role.trim(),
    email: !email.trim() || !isValidEmail(email.trim()),
  };
  const step0Valid = !step0Errors.name && !step0Errors.role && !step0Errors.email;

  const step1Valid = skills.length > 0;

  // Step 2 (portfolio) is optional – always valid
  const step2Valid = true;

  const isCurrentStepValid = step === 0 ? step0Valid : step === 1 ? step1Valid : step2Valid;

  // Error messages
  const getEmailErrorMsg = () => {
    if (!email.trim()) return 'Email is required';
    if (!isValidEmail(email.trim())) return 'Enter a valid email address';
    return '';
  };

  const finish = () => {
    setProfile({
      name: name.trim() || 'You',
      email: email.trim(),
      role: role.trim(),
      skills,
      portfolioLinks: portfolioLinks.filter((l) => l.trim()),
      resume: resumeFile?.name,
    });
    onComplete();
  };

  const handleNext = () => {
    if (!isCurrentStepValid) {
      setAttempted(true);
      setShakeKey((k) => k + 1);
      return;
    }
    setAttempted(false);
    if (step < 2) {
      setStep(step + 1);
    } else {
      finish();
    }
  };

  const handleBack = () => {
    setAttempted(false);
    setStep(step - 1);
  };

  const steps = ['Profile', 'Resume & Skills', 'Portfolio'];

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  // ── Extract skills from a PDF file ───────────────────────
  const processResumeFile = async (file: File) => {
    setResumeFile({ name: file.name });
    setExtractError('');
    setExtractedCount(0);

    // Only extract from PDFs
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return;
    }

    setExtracting(true);
    try {
      // 1) Extract text from PDF client-side
      const text = await extractTextFromPDF(file);

      if (!text.trim()) {
        setExtractError('Could not read text from this PDF. Try a different file.');
        setExtracting(false);
        return;
      }

      // 2) Send text to API for skill extraction
      const res = await fetch('/api/extract-skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        throw new Error('Skill extraction API failed');
      }

      const data = await res.json();
      const extracted: string[] = data.skills || [];

      if (extracted.length > 0) {
        // Merge with existing skills (no duplicates)
        setSkills((prev) => {
          const merged = new Set(prev);
          for (const s of extracted) merged.add(s);
          return Array.from(merged);
        });
        setExtractedCount(extracted.length);
      } else {
        setExtractError('No skills detected. Add them manually below.');
      }
    } catch (err: any) {
      console.error('Resume extraction error:', err);
      setExtractError('Failed to extract skills. You can add them manually.');
    } finally {
      setExtracting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processResumeFile(file);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '60px 40px',
        background: '#09090b',
        overflowY: 'auto',
      }}
    >
      {/* Shake animation style */}
      <style>{`
        @keyframes onb-shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        .onb-shake { animation: onb-shake 0.35s ease; }
        @keyframes onb-fadeSlide {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .onb-step-enter { animation: onb-fadeSlide 0.3s ease forwards; }
      `}</style>

      <div style={{ width: '100%', maxWidth: 540 }}>
        {/* ── Logo ──────────────────────────────────────────── */}
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

        {/* ── Stepper ───────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 36 }}>
          {steps.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : undefined }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 60 }}>
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
                    marginBottom: 20,
                    transition: 'background 0.3s',
                    minWidth: 24,
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* ── Card ──────────────────────────────────────────── */}
        <Card style={{ padding: 32 }}>
          {/* ── Step 0: Profile ─────────────────────────────── */}
          {step === 0 && (
            <div key={`step0-${shakeKey}`} className="onb-step-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
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
              <div>
                <Input label="Full Name" value={name} onChange={setName} placeholder="Your full name" />
                {attempted && step0Errors.name && (
                  <span style={{ fontSize: 11, color: 'oklch(0.65 0.22 25)', fontFamily: 'Figtree, sans-serif', marginTop: 4, display: 'block' }}>
                    Name is required
                  </span>
                )}
              </div>
              <div>
                <Input
                  label="Current Role / Target Role"
                  value={role}
                  onChange={setRole}
                  placeholder="e.g. Full Stack Engineer"
                />
                {attempted && step0Errors.role && (
                  <span style={{ fontSize: 11, color: 'oklch(0.65 0.22 25)', fontFamily: 'Figtree, sans-serif', marginTop: 4, display: 'block' }}>
                    Role is required
                  </span>
                )}
              </div>
              <div>
                <Input
                  label="Email Address"
                  value={email}
                  onChange={setEmail}
                  placeholder="you@company.com"
                  type="email"
                />
                {attempted && step0Errors.email && (
                  <span style={{ fontSize: 11, color: 'oklch(0.65 0.22 25)', fontFamily: 'Figtree, sans-serif', marginTop: 4, display: 'block' }}>
                    {getEmailErrorMsg()}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* ── Step 1: Resume & Skills ────────────────────── */}
          {step === 1 && (
            <div key={`step1-${shakeKey}`} className="onb-step-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
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

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const file = e.dataTransfer.files[0];
                  if (file) {
                    processResumeFile(file);
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
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
                {extracting ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 22, height: 22,
                      border: '2.5px solid oklch(0.62 0.22 258 / 0.2)',
                      borderTopColor: 'oklch(0.62 0.22 258)',
                      borderRadius: '50%',
                      animation: 'spin 0.7s linear infinite',
                    }} />
                    <span style={{ fontFamily: 'Figtree, sans-serif', fontSize: 13, color: 'oklch(0.72 0.22 258)' }}>
                      Extracting skills from resume…
                    </span>
                  </div>
                ) : resumeFile ? (
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
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        setResumeFile(null);
                        setExtractedCount(0);
                        setExtractError('');
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      style={{
                        color: '#888898',
                        cursor: 'pointer',
                        fontSize: 16,
                        lineHeight: 1,
                        marginLeft: 4,
                        opacity: 0.7,
                      }}
                      title="Remove file"
                    >
                      ×
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

              {/* Extraction status */}
              {extractedCount > 0 && (
                <div style={{
                  background: 'oklch(0.68 0.18 155 / 0.10)',
                  borderRadius: 8,
                  padding: '10px 14px',
                  display: 'flex',
                  gap: 8,
                  alignItems: 'center',
                }}>
                  <span style={{ color: 'oklch(0.68 0.18 155)', display: 'flex' }}><Icon.Zap /></span>
                  <span style={{ fontSize: 12, color: 'oklch(0.68 0.18 155)', fontFamily: 'Figtree, sans-serif', fontWeight: 500 }}>
                    {extractedCount} skill{extractedCount !== 1 ? 's' : ''} extracted from your resume
                  </span>
                </div>
              )}
              {extractError && (
                <div style={{
                  background: 'oklch(0.65 0.22 25 / 0.10)',
                  borderRadius: 8,
                  padding: '10px 14px',
                  display: 'flex',
                  gap: 8,
                  alignItems: 'center',
                }}>
                  <span style={{ fontSize: 12, color: 'oklch(0.65 0.22 25)', fontFamily: 'Figtree, sans-serif' }}>
                    {extractError}
                  </span>
                </div>
              )}
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
                  Skills <span style={{ color: '#44445a', fontWeight: 400 }}>({skills.length > 0 ? `${skills.length} added` : 'at least 1 required'})</span>
                </div>
                {skills.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                    {skills.map((s) => (
                      <Tag key={s} onRemove={() => setSkills(skills.filter((x) => x !== s))}>
                        {s}
                      </Tag>
                    ))}
                  </div>
                )}
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
                {attempted && !step1Valid && (
                  <span style={{ fontSize: 11, color: 'oklch(0.65 0.22 25)', fontFamily: 'Figtree, sans-serif', marginTop: 6, display: 'block' }}>
                    Add at least one skill to continue
                  </span>
                )}
              </div>
            </div>
          )}

          {/* ── Step 2: Portfolio ───────────────────────────── */}
          {step === 2 && (
            <div className="onb-step-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
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
                  label={i === 0 ? 'Portfolio Links (optional)' : undefined}
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

          {/* ── Navigation Buttons ─────────────────────────── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32 }}>
            {step > 0 ? (
              <Button variant="ghost" onClick={handleBack}>
                Back
              </Button>
            ) : (
              <div />
            )}
            <div
              key={`btn-${shakeKey}`}
              className={attempted && !isCurrentStepValid ? 'onb-shake' : ''}
            >
              <Button
                onClick={handleNext}
                icon={step === 2 ? <Icon.Zap /> : undefined}
                disabled={attempted && !isCurrentStepValid}
              >
                {step === 2 ? 'Finish Setup' : 'Continue'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
