import { NextRequest, NextResponse } from 'next/server';
import { generateEmailSubject, generateEmailBody, scoreEmail, calculateOverallScore } from '@/lib/huggingface';
import { GeneratedEmail } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { jobDescription, company, userRole, skills, hiringManager, tone, language } = await request.json();

    if (!jobDescription || !company || !userRole) {
      return NextResponse.json(
        { error: 'Missing required fields: jobDescription, company, userRole' },
        { status: 400 }
      );
    }

    const hasKey = !!process.env.GROQ_API_KEY;
    if (!hasKey) {
      // Local fallback: generate a templated set so the UI is fully exercisable
      // without an API key. Real generation activates once the env var is set.
      const emails = buildFallbackEmails({ jobDescription, company, userRole, skills, hiringManager, tone, language });
      return NextResponse.json({ emails, fallback: true }, { status: 200 });
    }

    const emails: GeneratedEmail[] = [];
    const toneInstr = tone ? ` Use a ${String(tone).toLowerCase()} tone.` : '';
    const langInstr = language && language !== 'English' ? ` Write in ${language}.` : '';
    const enrichedDesc = `${jobDescription}${toneInstr}${langInstr}`;

    for (let i = 0; i < 3; i++) {
      try {
        const subject = await generateEmailSubject(enrichedDesc, userRole, company);
        const body = await generateEmailBody(enrichedDesc, userRole, company, skills || [], hiringManager);
        const emailText = `Subject: ${subject}\n\n${body}`;

        const scores = await scoreEmail(emailText, jobDescription);
        const overallScore = calculateOverallScore(scores.relevance, scores.tone, scores.personalization, scores.clarity);

        emails.push({ subject, body, score: overallScore, ...scores });
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error generating email ${i + 1}:`, error);
      }
    }

    if (emails.length === 0) {
      // All HF API attempts failed – fall back to templates so the user still gets output
      console.warn('All HF API calls failed – serving fallback emails');
      const fallback = buildFallbackEmails({ jobDescription, company, userRole, skills, hiringManager, tone, language });
      return NextResponse.json({ emails: fallback, fallback: true }, { status: 200 });
    }

    return NextResponse.json({ emails }, { status: 200 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function buildFallbackEmails(args: {
  jobDescription: string;
  company: string;
  userRole: string;
  skills?: string[];
  hiringManager?: string;
  tone?: string;
  language?: string;
}): GeneratedEmail[] {
  const { company, userRole, skills = [], hiringManager, tone = 'Professional' } = args;
  const greet = hiringManager ? `Hi ${hiringManager.split(' ')[0]},` : 'Hi there,';
  const topSkills = skills.slice(0, 3).join(', ') || 'building thoughtful software';

  const variants: Array<{ subject: string; body: string; relevance: number; tone: number; personalization: number; clarity: number }> = [
    {
      subject: `Excited about ${company} — a ${userRole} who could help`,
      body: `${greet}\n\nI came across the ${userRole} role at ${company} and wanted to reach out. My background in ${topSkills} maps closely to what you're hiring for, and I've shipped work that overlaps with the problems described in the listing.\n\nWould you be open to a 15-minute call this week or next? I'd love to share specifics and learn what success looks like in your first 90 days.\n\nThanks for your time,\n${tone === 'Friendly' ? 'Looking forward to chatting!' : 'Best regards,'}`,
      relevance: 86,
      tone: 88,
      personalization: 82,
      clarity: 90,
    },
    {
      subject: `Quick note from a ${userRole} — re: ${company}`,
      body: `${greet}\n\nShort version: I'm a ${userRole} with hands-on experience in ${topSkills}. Reading through what ${company} is building, I think I could move the needle on the kind of work outlined in the listing.\n\nHappy to share a portfolio link or hop on a 15-min call — whichever is easier.\n\nThanks,`,
      relevance: 82,
      tone: 85,
      personalization: 78,
      clarity: 92,
    },
    {
      subject: `${userRole} interested in ${company}'s mission`,
      body: `${greet}\n\nI've been following ${company} and the role you're hiring for caught my attention. My experience with ${topSkills} feels like a strong match, and I'd bring an owner's mindset to the team.\n\nIf there's room on your calendar, I'd love a brief intro call. Otherwise, just glad I sent this — wishing you a great search.\n\nWarmly,`,
      relevance: 80,
      tone: 90,
      personalization: 84,
      clarity: 88,
    },
  ];

  return variants.map((v) => ({
    subject: v.subject,
    body: v.body,
    relevance: v.relevance,
    tone: v.tone,
    personalization: v.personalization,
    clarity: v.clarity,
    score: calculateOverallScore(v.relevance, v.tone, v.personalization, v.clarity),
  }));
}
