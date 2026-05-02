# SmartReach AI - Quick Start Guide

## 🚀 Get Running in 2 Minutes

### Step 1: Install & Start
```bash
npm install
npm run dev
```

**Open**: http://localhost:3000

### Step 2: Complete Onboarding
1. Enter your name and role
2. Upload resume (simulated)
3. Add portfolio links

### Step 3: Generate Emails
1. Paste a job URL
2. Enter company name
3. Click "Analyze & Generate"
4. **Wait** 10-15 seconds for AI to generate emails
5. View results with scores

---

## 🔑 Environment Setup

### Get Hugging Face API Key (2 minutes)

1. Go to [huggingface.co](https://huggingface.co)
2. Sign up (free)
3. Go to [Settings → API Tokens](https://huggingface.co/settings/tokens)
4. Click "New token"
5. Copy token

### Add to .env.local
```bash
HUGGINGFACE_API_KEY=hf_your_token_here
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## 📁 Project Structure Explained

```
smartreach-ai/
├── app/                      # Next.js pages & API
│   ├── api/generate-email/   # ⚡ AI magic happens here
│   ├── page.tsx              # Home page (onboarding → app)
│   └── layout.tsx            # Global layout
├── components/
│   ├── screens/              # Full-page screens
│   │   ├── Onboarding.tsx
│   │   ├── GenerateScreen.tsx
│   │   └── ResultsScreen.tsx
│   ├── ui/                   # Reusable UI buttons, cards, etc.
│   ├── Sidebar.tsx
│   ├── AppShell.tsx          # Main app layout
│   └── Icons.tsx
├── lib/
│   ├── huggingface.ts        # 🤖 AI integration
│   └── types.ts              # TypeScript types
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
└── .env.local                # Secrets (don't commit!)
```

---

## 🤖 How AI Integration Works

### Flow:
```
User Input
    ↓
[GenerateScreen collects job URL]
    ↓
POST /api/generate-email
    ↓
[Server calls Hugging Face API]
    ↓
Mistral-7B generates 3 email variations
    ↓
Scores each email (relevance, tone, etc)
    ↓
Returns emails to [ResultsScreen]
    ↓
User sees results with AI scores
```

### Key Files:
- **`lib/huggingface.ts`**: Calls HF API, handles responses
- **`app/api/generate-email/route.ts`**: API endpoint
- **`components/screens/GenerateScreen.tsx`**: UI for input
- **`components/screens/ResultsScreen.tsx`**: UI for results

---

## 🎨 Design System

All colors use OKLch color space (better than RGB):

| Component | Color | Usage |
|-----------|-------|-------|
| Accent | `oklch(0.62 0.22 258)` | Buttons, highlights |
| Dark BG | `#09090b` | Page background |
| Cards | `#111114` | Content boxes |
| Text | `#e8e8f4` | Primary text |

Fonts:
- **Headlines**: Space Grotesk (geometric, modern)
- **Body**: Figtree (readable, friendly)

---

## 🔧 Common Tasks

### Change Default Company Name
**File**: `components/screens/ResultsScreen.tsx` (line ~50)
```typescript
For: Your Dream Company  // ← change this
```

### Adjust Email Generation Delay
**File**: `components/screens/GenerateScreen.tsx` (line ~40)
```typescript
setTimeout(() => { setCurrentStep(i); }, 900 + Math.random() * 400);
//                                         ^^^                     ^^^
//                                    base delay (ms)         random variance
```

### Change AI Model
**File**: `lib/huggingface.ts` (line ~15)
```typescript
model: "mistralai/Mistral-7B-Instruct-v0.1",  // ← change model here
```

**Other models**:
- `meta-llama/Llama-2-7b-chat-hf` (faster)
- `tiiuae/falcon-7b-instruct` (creative)
- `mistralai/Mistral-7B-Instruct-v0.1` (balanced)

### Add New Screen
1. Create `components/screens/MyScreen.tsx`
2. Add to `NAV_ITEMS` in `components/Sidebar.tsx`
3. Add case to `renderScreen()` in `components/AppShell.tsx`

---

## 🚨 Debugging

### Email not generating?
Check browser console (F12) for errors:
- Network tab: Did API request go through?
- Console: Any red errors?
- Check `.env.local` has correct API key

### API returns 401?
```bash
# Verify API key is valid:
curl -H "Authorization: Bearer YOUR_KEY" \
     https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1
```

### Slow email generation?
- Model queuing (popular model, slow inference)
- Solution: Upgrade Hugging Face account or use faster model

---

## 📦 Adding Dependencies

```bash
# Install new package
npm install package-name

# Dev dependencies
npm install --save-dev package-name

# Check dependencies
npm list
```

**Be careful**: 
- Avoid bloated packages
- Next.js bundles everything → increases build size
- Use `next/dynamic` for code splitting

---

## 🚢 Deploy to Vercel (1 minute)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts, add HUGGINGFACE_API_KEY when asked
```

**Alternative**: Push to GitHub → Vercel auto-deploys

---

## 📊 Performance Tips

| Issue | Solution |
|-------|----------|
| Slow emails | Upgrade HF account or use faster model |
| Build takes long | Check `next/image` optimization |
| Large bundle | Use dynamic imports: `next/dynamic` |
| API 429 errors | Add rate limiting, cache results |

---

## 🎓 Learning Resources

- **Next.js**: https://nextjs.org/learn
- **React**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org/docs
- **Hugging Face**: https://huggingface.co/docs

---

## ❓ FAQ

**Q: Can I use a different AI model?**
A: Yes! Change `model` in `lib/huggingface.ts`. But check if your HF account has access.

**Q: How do I make emails longer/shorter?**
A: Edit `max_new_tokens` in `lib/huggingface.ts`. Higher = longer.

**Q: Can I save emails to database?**
A: Yes! Add Supabase or MongoDB. See full README for details.

**Q: Will free HF tier work?**
A: Yes, but limited (~30 calls/month). Pay for unlimited.

**Q: How do I add email sending?**
A: Install Nodemailer or use SendGrid API. See README for examples.

---

## 🎉 Next Steps

1. **Verify it works locally** → test email generation
2. **Deploy to Vercel** → DEPLOYMENT.md
3. **Add features** → see README for ideas
4. **Share with users** → get feedback!

---

**Questions?** Check README.md or create a GitHub issue.

Happy email generating! ✨
