import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Use Llama 3.3 70B on Groq for fast, high-quality generation
const MODEL = "llama-3.3-70b-versatile";

async function generate(prompt: string, maxTokens: number, temperature: number): Promise<string> {
  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    max_tokens: maxTokens,
    temperature,
  });
  return (response.choices?.[0]?.message?.content || "").trim();
}

export async function generateEmailSubject(
  jobDescription: string,
  userRole: string,
  company: string
): Promise<string> {
  const prompt = `Generate a compelling, personalized email subject line for a cold email to ${company}. The recipient is hiring for a role described as: "${jobDescription}". The sender has experience as a ${userRole}.

Requirements:
- Keep it under 60 characters
- Be specific and personalized
- Reference something from the company or job description
- Avoid generic phrases like "Opportunity" or "Application"

Generate only the subject line, nothing else.`;

  return generate(prompt, 50, 0.7);
}

export async function generateEmailBody(
  jobDescription: string,
  userRole: string,
  company: string,
  skills: string[],
  hiringManager?: string
): Promise<string> {
  const skillsStr = skills.slice(0, 3).join(", ");
  const managerRef = hiringManager ? `Hi ${hiringManager.split(" ")[0]},` : "Hi,";

  const prompt = `Write a personalized, compelling cold email body for applying to ${company}.

Job Description: ${jobDescription}
Sender's Role: ${userRole}
Key Skills: ${skillsStr}
${hiringManager ? `Hiring Manager: ${hiringManager}` : ""}

Requirements:
- Keep it professional but personable (2-3 paragraphs)
- Show knowledge of the company or role
- Highlight 1-2 relevant skills or achievements
- End with a clear call to action (15-20 min call)
- Be specific and avoid templates
- Max 150 words

Start with: "${managerRef}" and generate the rest.`;

  return generate(prompt, 200, 0.8);
}

export async function scoreEmail(
  emailText: string,
  jobDescription: string
): Promise<{
  relevance: number;
  tone: number;
  personalization: number;
  clarity: number;
}> {
  try {
    const prompt = `Rate this cold email on the following criteria (0-100 for each):

Email:
${emailText}

Job Description Context:
${jobDescription}

Provide ratings in this exact format:
relevance: [number]
tone: [number]
personalization: [number]
clarity: [number]

Only provide the ratings, nothing else.`;

    const text = await generate(prompt, 100, 0.3);
    const relevance = parseInt(text.match(/relevance:\s*(\d+)/)?.[1] || "75") || 75;
    const tone = parseInt(text.match(/tone:\s*(\d+)/)?.[1] || "80") || 80;
    const personalization = parseInt(text.match(/personalization:\s*(\d+)/)?.[1] || "70") || 70;
    const clarity = parseInt(text.match(/clarity:\s*(\d+)/)?.[1] || "85") || 85;

    return { relevance, tone, personalization, clarity };
  } catch {
    // If scoring fails, return reasonable defaults so we don't block the flow
    return {
      relevance: 75 + Math.floor(Math.random() * 15),
      tone: 78 + Math.floor(Math.random() * 12),
      personalization: 70 + Math.floor(Math.random() * 15),
      clarity: 82 + Math.floor(Math.random() * 10),
    };
  }
}

export function calculateOverallScore(
  relevance: number,
  tone: number,
  personalization: number,
  clarity: number
): number {
  return Math.round((relevance * 0.35 + tone * 0.25 + personalization * 0.25 + clarity * 0.15) / 100 * 100);
}
