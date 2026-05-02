# SmartReach AI - Deployment Guide

## Quick Start - 5 Minutes to Live App

### Step 1: Prepare Your Code

```bash
cd "c:\Users\nouma\OneDrive\Desktop\Gen AI Project"
npm install
```

### Step 2: Create GitHub Repository

```bash
git config --global user.email "your-email@example.com"
git config --global user.name "Your Name"
git add .
git commit -m "Initial commit: SmartReach AI with Hugging Face integration"
git branch -M main
git remote add origin https://github.com/yourusername/smartreach-ai.git
git push -u origin main
```

### Step 3: Deploy on Vercel (Option A - Recommended)

**Via Vercel Web Console** (Easiest):

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select "Import Git Repository"
4. Paste: `https://github.com/yourusername/smartreach-ai.git`
5. Vercel auto-detects Next.js configuration
6. Click "Environment Variables"
7. Add these variables:
   - **Key**: `HUGGINGFACE_API_KEY`
   - **Value**: `hf_xxxxxxxxxxxxxxxxxxxx` (your API key)
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://yourdomain.vercel.app`
8. Click "Deploy"

**Done!** Your app is live at `https://yourdomain.vercel.app`

### Step 4: Deploy on Vercel (Option B - CLI)

```bash
npm install -g vercel
vercel login
vercel

# Follow prompts:
# ? Set up and deploy? (y/n) → y
# ? Which scope? → Select your account
# ? Link to existing project? → n
# ? Project name? → smartreach-ai
# ? Directory? → ./
# ? Override settings? → n
```

When prompted for environment variables:
```
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_API_URL=https://yourdomain.vercel.app
```

---

## Full Deployment Checklist

- [ ] Node.js 18+ installed
- [ ] Git initialized
- [ ] GitHub account created
- [ ] Repository pushed to GitHub
- [ ] Hugging Face API key obtained
- [ ] Vercel account created
- [ ] Environment variables set in Vercel
- [ ] Build succeeded
- [ ] App accessible at Vercel URL
- [ ] Tested email generation

## Verify Deployment

1. **App loads**: Open your Vercel URL
2. **Onboarding works**: Complete setup wizard
3. **Generate email**:
   - Enter job URL: `https://example.com/job`
   - Click "Analyze & Generate"
   - Watch processing steps complete
   - Verify 3 emails are generated with scores

## Troubleshooting

### Build Error: "Cannot find module '@/components/...'"

**Solution**: Check all imports use the `@/` alias correctly
```bash
grep -r "^import" app/ components/ | grep -v "@/"
```

### API Error: "401 Unauthorized"

**Solution**: Verify your Hugging Face API key
- Go to [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
- Copy your API token
- Update `HUGGINGFACE_API_KEY` in Vercel

### API Error: "Model not found"

**Solution**: Ensure model is accessible with your API key
- Free tier has limited model access
- Upgrade to Pro or use open models
- Check model name spelling: `mistralai/Mistral-7B-Instruct-v0.1`

### Rate Limited (429)

**Solution**: Hugging Face free tier has limits
- Free: ~30 inference-on-demand calls/month
- Paid: Unlimited with Pro
- Upgrade account at [huggingface.co/pricing](https://huggingface.co/pricing)

## Post-Deployment

### 1. Add Custom Domain (Optional)

In Vercel project settings:
- Domain → Add Domain
- Point your domain to Vercel nameservers
- SSL certificate auto-generated

### 2. Monitor Performance

Vercel dashboard shows:
- Build logs
- Deployment history
- Function execution times
- Error tracking

### 3. View API Logs

```bash
vercel logs [url]
# Real-time function logs
```

### 4. Set Up CI/CD

Vercel auto-deploys on git push. To customize:

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## Environment Variables Reference

| Variable | Example | Required | Purpose |
|----------|---------|----------|---------|
| `HUGGINGFACE_API_KEY` | `hf_xxxxx...` | Yes | AI model inference |
| `NEXT_PUBLIC_API_URL` | `https://app.example.com` | No | Frontend API endpoint |

## Local Testing Before Deploy

```bash
# Build locally
npm run build

# Start production server
npm run start

# Test at http://localhost:3000
```

## Database (Optional Future Addition)

For storing campaigns, analytics, etc.:

### Option 1: Vercel KV (Recommended)
```bash
vercel env add KV_URL
vercel env add KV_REST_API_TOKEN
```

Then in code:
```typescript
import { kv } from '@vercel/kv';
await kv.set('key', 'value');
```

### Option 2: PostgreSQL (Supabase)
```typescript
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(URL, KEY);
```

## Scaling

**Current limits**:
- API functions: 12 seconds timeout (Hobby)
- Database: None (stateless)
- Email generation: ~30s per email

**Optimize**:
1. Cache generated emails
2. Batch process campaigns
3. Use faster models (Falcon-7b)
4. Implement request queuing

## Support & Troubleshooting

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Hugging Face**: https://huggingface.co/docs
- **GitHub Issues**: Create issue in your repo

---

**Your app is now live!** 🎉

Test it out and share the URL: `https://yourdomain.vercel.app`
