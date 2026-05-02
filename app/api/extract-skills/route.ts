import { NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// ── Comprehensive skill dictionary grouped by domain ──────────────
const SKILL_DICTIONARY: Record<string, string[]> = {
  "Programming Languages": [
    "JavaScript", "TypeScript", "Python", "Java", "C", "C++", "C#", "Go", "Golang",
    "Rust", "Ruby", "PHP", "Swift", "Kotlin", "Scala", "Perl", "R", "MATLAB",
    "Dart", "Lua", "Haskell", "Elixir", "Clojure", "Objective-C", "Shell",
    "Bash", "PowerShell", "Assembly", "VHDL", "Verilog", "Solidity",
  ],
  "Frontend": [
    "React", "React.js", "Next.js", "Vue", "Vue.js", "Angular", "Svelte",
    "HTML", "HTML5", "CSS", "CSS3", "SCSS", "SASS", "Less", "Tailwind",
    "TailwindCSS", "Bootstrap", "Material UI", "MUI", "Chakra UI",
    "Styled Components", "jQuery", "Redux", "Zustand", "MobX", "Recoil",
    "Webpack", "Vite", "Babel", "ESLint", "Prettier", "Storybook",
    "Framer Motion", "GSAP", "Three.js", "D3.js", "Chart.js",
    "Responsive Design", "Web Accessibility", "SEO", "PWA",
  ],
  "Backend": [
    "Node.js", "Express", "Express.js", "NestJS", "Fastify", "Koa",
    "Django", "Flask", "FastAPI", "Spring", "Spring Boot",
    "Ruby on Rails", "Rails", "Laravel", "ASP.NET", ".NET", ".NET Core",
    "GraphQL", "REST", "RESTful", "gRPC", "WebSocket",
    "Microservices", "Serverless", "Lambda",
  ],
  "Database": [
    "SQL", "MySQL", "PostgreSQL", "Postgres", "MongoDB", "Redis",
    "SQLite", "Oracle", "SQL Server", "DynamoDB", "Cassandra",
    "Elasticsearch", "Neo4j", "Firebase", "Firestore", "Supabase",
    "Prisma", "Sequelize", "TypeORM", "Mongoose", "Drizzle",
  ],
  "Cloud & DevOps": [
    "AWS", "Amazon Web Services", "Azure", "GCP", "Google Cloud",
    "Docker", "Kubernetes", "K8s", "Terraform", "Ansible",
    "Jenkins", "GitHub Actions", "CI/CD", "CircleCI", "Travis CI",
    "Nginx", "Apache", "Linux", "Ubuntu", "CentOS",
    "Vercel", "Netlify", "Heroku", "DigitalOcean",
    "CloudFormation", "ECS", "EKS", "S3", "EC2", "RDS",
  ],
  "Data Science & AI/ML": [
    "Machine Learning", "Deep Learning", "NLP", "Natural Language Processing",
    "Computer Vision", "TensorFlow", "PyTorch", "Keras", "Scikit-learn",
    "Pandas", "NumPy", "SciPy", "Matplotlib", "Seaborn",
    "Jupyter", "OpenCV", "Hugging Face", "LLM", "GPT",
    "Neural Networks", "Regression", "Classification", "Clustering",
    "Data Analysis", "Data Visualization", "ETL", "Data Pipeline",
    "Apache Spark", "Hadoop", "Airflow", "dbt",
    "Generative AI", "RAG", "Prompt Engineering", "LangChain",
    "Stable Diffusion", "Transformers", "BERT", "Fine-tuning",
  ],
  "Mobile": [
    "React Native", "Flutter", "iOS", "Android", "SwiftUI",
    "Jetpack Compose", "Expo", "Xamarin", "Ionic", "Capacitor",
  ],
  "Testing": [
    "Jest", "Mocha", "Chai", "Cypress", "Playwright",
    "Selenium", "Puppeteer", "Testing Library", "Vitest",
    "Unit Testing", "Integration Testing", "E2E Testing",
    "TDD", "BDD", "QA",
  ],
  "Tools & Practices": [
    "Git", "GitHub", "GitLab", "Bitbucket", "Jira", "Confluence",
    "Figma", "Adobe XD", "Sketch", "Photoshop", "Illustrator",
    "Agile", "Scrum", "Kanban", "Waterfall",
    "Design Patterns", "SOLID", "OOP", "Functional Programming",
    "System Design", "Data Structures", "Algorithms",
    "API Design", "OAuth", "JWT", "Authentication", "Authorization",
  ],
  "Blockchain & Web3": [
    "Blockchain", "Ethereum", "Smart Contracts", "Web3", "Web3.js",
    "Ethers.js", "Hardhat", "Truffle", "DeFi", "NFT", "IPFS",
  ],
  "Soft Skills": [
    "Leadership", "Team Management", "Project Management",
    "Communication", "Problem Solving", "Critical Thinking",
    "Mentoring", "Collaboration", "Time Management",
    "Technical Writing", "Public Speaking", "Stakeholder Management",
  ],
};

// Build flat lookup: lowercase -> canonical name
const SKILL_LOOKUP = new Map<string, string>();
for (const skills of Object.values(SKILL_DICTIONARY)) {
  for (const skill of skills) {
    SKILL_LOOKUP.set(skill.toLowerCase(), skill);
  }
}

// ── Dictionary-based extraction ────────────────────────────────────
function extractSkillsFromText(text: string): string[] {
  const normalised = text.toLowerCase();
  const found = new Set<string>();

  for (const [lower, canonical] of SKILL_LOOKUP.entries()) {
    // Word-boundary check: make sure we match the full term
    // For multi-word skills like "Machine Learning"
    const escaped = lower.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`(?:^|[\\s,;/|()\\[\\]{}•·–—-])${escaped}(?:[\\s,;/|()\\[\\]{}•·–—.-]|$)`, "i");
    if (re.test(normalised)) {
      found.add(canonical);
    }
  }

  // Deduplicate overlapping names: prefer longer / more specific names
  // e.g., if both "React" and "React.js" match, keep both since they're the same
  const deduped = new Set<string>();
  const aliases: Record<string, string> = {
    "React.js": "React",
    "Vue.js": "Vue",
    "Express.js": "Express",
    "Node.js": "Node.js", // keep as Node.js
    "Golang": "Go",
  };
  for (const skill of found) {
    const canonical = aliases[skill];
    if (canonical && found.has(canonical)) {
      // Skip the alias since the canonical is already present
      continue;
    }
    deduped.add(skill);
  }

  return Array.from(deduped).sort();
}

// ── (Optional) AI-powered extraction for ambiguous skills ─────────
async function extractSkillsWithAI(text: string): Promise<string[]> {
  try {
    const truncated = text.slice(0, 3000); // Keep within token limits
    const prompt = `[INST] Extract technical skills, tools, frameworks, and programming languages from this resume text. Return ONLY a JSON array of skill names, nothing else.

Resume text:
${truncated}

Return format: ["skill1", "skill2", ...]
[/INST]`;

    const response = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.1",
      inputs: prompt,
      parameters: {
        max_new_tokens: 300,
        temperature: 0.2,
      },
    });

    // Try to parse JSON array from response
    const match = response.generated_text.match(/\[[\s\S]*?\]/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      if (Array.isArray(parsed)) {
        return parsed.filter((s: unknown) => typeof s === "string" && s.trim().length > 0)
          .map((s: string) => s.trim());
      }
    }
  } catch (e) {
    console.warn("AI skill extraction failed, using dictionary only:", e);
  }
  return [];
}

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    // 1) Dictionary-based extraction (fast, reliable)
    const dictSkills = extractSkillsFromText(text);

    // 2) Try AI extraction for anything the dictionary might miss
    let aiSkills: string[] = [];
    try {
      aiSkills = await extractSkillsWithAI(text);
    } catch {
      // AI is optional – dictionary alone is fine
    }

    // 3) Merge: prefer dictionary canonical names, add unique AI ones
    const merged = new Set(dictSkills);
    for (const skill of aiSkills) {
      // Only add AI skill if a similar one isn't already captured
      const lower = skill.toLowerCase();
      const already = Array.from(merged).some(
        (s) => s.toLowerCase() === lower
      );
      if (!already && skill.length > 1) {
        merged.add(skill);
      }
    }

    const skills = Array.from(merged).slice(0, 30); // Cap at 30 skills

    return NextResponse.json({ skills });
  } catch (e: any) {
    console.error("Skill extraction error:", e);
    return NextResponse.json(
      { error: "Failed to extract skills", details: e?.message },
      { status: 500 }
    );
  }
}
