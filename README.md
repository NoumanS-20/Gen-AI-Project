# SmartReach AI - Intelligent Personalized Cold Email Generator

A full-stack application powered by Hugging Face AI to generate personalized, high-scoring cold emails. Built with Next.js, TypeScript, and React.

## Features

- **AI-Powered Email Generation**: Uses Hugging Face Mistral-7B model to generate personalized cold emails
- **Email Scoring**: Rates emails on relevance, tone, personalization, and clarity
- **Campaign Management**: Track and manage email campaigns
- **Analytics Dashboard**: Monitor open rates, reply rates, and performance metrics
- **Dark Premium UI**: Modern design inspired by Notion and Linear

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **UI**: React with custom components
- **AI**: Hugging Face Inference API (Mistral-7B)
- **Styling**: CSS-in-JS with design tokens

## Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Hugging Face API key (free or pro)

### Local Development

1. **Clone and install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```

3. **Add your Hugging Face API key**:
   ```bash
   # Edit .env.local and add your HF API key
   HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxx
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open in browser**:
   ```
   http://localhost:3000
   ```

## Getting a Hugging Face API Key

1. Go to [huggingface.co](https://huggingface.co)
2. Sign up or log in
3. Navigate to [Settings > API Tokens](https://huggingface.co/settings/tokens)
4. Create a new API token
5. Add it to your `.env.local`

## Deployment on Vercel

### Option 1: GitHub Integration (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/smartreach-ai.git
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel auto-detects Next.js

3. **Add Environment Variables**:
   - In Vercel project settings, go to "Environment Variables"
   - Add `HUGGINGFACE_API_KEY` with your API key
   - Add `NEXT_PUBLIC_API_URL` with your production URL:
     ```
     https://yourdomain.vercel.app
     ```

4. **Deploy**:
   - Click "Deploy"
   - Vercel builds and deploys automatically

### Option 2: Direct Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Follow the prompts** and add environment variables when asked

## Usage

### Onboarding
1. Enter your name, role, and email
2. Upload your resume
3. Add your skills and portfolio links

### Generate Emails
1. Enter a job listing or company URL
2. Click "Analyze & Generate"
3. Wait for AI processing (~5-10 seconds per email)
4. View results with AI scores

### View Results
- **Email Variants**: Switch between 3 generated versions
- **AI Scoring**: See breakdown of relevance, tone, personalization, clarity
- **Actions**: Send, copy, or edit emails
- **Predictions**: View estimated reply likelihood

## API Endpoints

### POST `/api/generate-email`

Generates 3 personalized cold emails using Hugging Face.

**Request**:
```json
{
  "jobUrl": "https://example.com/job",
  "jobDescription": "Full Stack Engineer position",
  "company": "Example Corp",
  "userRole": "Full Stack Engineer",
  "skills": ["React", "Node.js", "PostgreSQL"],
  "hiringManager": "Jane Smith"
}
```

**Response**:
```json
{
  "emails": [
    {
      "subject": "Full Stack Engineer — Impressed by...",
      "body": "Hi Jane,\n\nI came across your...",
      "score": 94,
      "relevance": 96,
      "tone": 91,
      "personalization": 95,
      "clarity": 93
    }
  ]
}
```

## Project Structure

```
smartreach-ai/
├── app/                    # Next.js app directory
│   ├── api/
│   │   └── generate-email/
│   │       └── route.ts
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── ...
│   ├── screens/            # Screen components
│   │   ├── Onboarding.tsx
│   │   ├── GenerateScreen.tsx
│   │   ├── ResultsScreen.tsx
│   │   └── ...
│   ├── Icons.tsx
│   ├── AppShell.tsx
│   └── Sidebar.tsx
├── lib/
│   ├── huggingface.ts     # AI integration
│   └── types.ts           # TypeScript types
├── package.json
├── tsconfig.json
├── next.config.js
└── .env.local
```

## Performance Tips

- **API Rate Limiting**: Hugging Face free tier has rate limits. Implement cooldown between requests.
- **Caching**: Consider caching generated emails to reduce API calls.
- **Model Choice**: Mistral-7B is fast and accurate. Alternatives:
  - `meta-llama/Llama-2-7b-chat-hf` (faster)
  - `tiiuae/falcon-7b-instruct` (more creative)

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `HUGGINGFACE_API_KEY` | Your Hugging Face API key | Yes |
| `NEXT_PUBLIC_API_URL` | Public API URL for frontend | No |

## Common Issues

### "API Rate Limited"
- Free tier has limits (~30 requests/month)
- Upgrade to Hugging Face Pro
- Implement request batching

### "Model not found"
- Check your API key is valid
- Ensure model name is spelled correctly
- Verify you have access to the model

### "CORS errors"
- API calls should be server-side (in API routes)
- Never expose API key in client-side code

## Future Enhancements

- [ ] Email templates library
- [ ] A/B testing framework
- [ ] Real email sending integration (SendGrid, Gmail)
- [ ] Advanced analytics and heatmaps
- [ ] Team collaboration features
- [ ] Custom model fine-tuning
- [ ] Multi-language support
- [ ] Export to CSV/PDF

## License

MIT

## Support

For issues, feature requests, or questions:
1. Check existing issues
2. Create a new GitHub issue
3. Include error messages and reproduction steps

---

**Built with ❤️ using Next.js + Hugging Face**
