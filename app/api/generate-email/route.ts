import { NextRequest, NextResponse } from 'next/server';
import { generateEmailSubject, generateEmailBody, scoreEmail, calculateOverallScore } from '@/lib/huggingface';
import { GeneratedEmail } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { jobUrl, jobDescription, company, userRole, skills, hiringManager } = await request.json();

    if (!jobDescription || !company || !userRole) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const emails: GeneratedEmail[] = [];

    for (let i = 0; i < 3; i++) {
      try {
        const subject = await generateEmailSubject(jobDescription, userRole, company);
        const body = await generateEmailBody(jobDescription, userRole, company, skills || [], hiringManager);
        const emailText = `Subject: ${subject}\n\n${body}`;

        const scores = await scoreEmail(emailText, jobDescription);
        const overallScore = calculateOverallScore(
          scores.relevance,
          scores.tone,
          scores.personalization,
          scores.clarity
        );

        emails.push({
          subject,
          body,
          score: overallScore,
          ...scores,
        });

        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error generating email ${i + 1}:`, error);
      }
    }

    if (emails.length === 0) {
      return NextResponse.json(
        { error: 'Failed to generate emails' },
        { status: 500 }
      );
    }

    return NextResponse.json({ emails }, { status: 200 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
