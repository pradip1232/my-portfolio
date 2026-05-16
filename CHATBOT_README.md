# 🤖 AI ChatBot - Quick Start

Complete setup guide for the AI chatbot in your portfolio.

## ✅ What's Included

### File Structure

```
📁 Project Root
├── 📁 app/
│   └── 📁 api/
│       └── 📁 chat/
│           └── route.ts          # Gemini API endpoint
├── 📁 components/
│   └── 📁 chatbot/
│       ├── ChatBot.tsx           # Main component
│       ├── ChatButton.tsx        # Floating button
│       ├── ChatWindow.tsx        # Chat interface
│       ├── ChatMessage.tsx       # Message bubbles
│       ├── QuickQuestions.tsx    # Quick questions
│       ├── LoadingIndicator.tsx  # Typing animation
│       ├── types.ts              # TypeScript types
│       ├── index.ts              # Exports
│       └── README.md             # Documentation
├── .env.local.example            # Environment template
└── CHATBOT_README.md             # This file
```

## 🚀 Quick Start (2 Steps)

### Step 1: Get Gemini API Key (Free)

1. Go to https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key

### Step 2: Add to Environment File

Create `.env.local` in project root:

```bash
GEMINI_API_KEY=your-actual-api-key-here
```

Then restart your dev server:

```bash
npm run dev
```

## 🎨 Customization

### Change Assistant Name

**File**: `components/chatbot/ChatBot.tsx`

```tsx
const INITIAL_MESSAGE: Message = {
  role: 'assistant',
  content: "Hi 👋 I'm YOUR NAME AI. Ask me about skills, projects, or experience.",
};
```

**File**: `components/chatbot/ChatWindow.tsx`

```tsx
<h3 className="font-semibold text-lg">YOUR NAME AI Assistant</h3>
```

### Customize Quick Questions

**File**: `components/chatbot/ChatBot.tsx`

```tsx
const QUICK_QUESTIONS = [
  'What technologies do you use?',
  'Show me your best projects',
  'Are you available for hire?',
  'How can I contact you?',
];
```

### Modify AI Behavior

**File**: `app/api/chat/route.ts`

```tsx
const systemInstruction = "You are [YOUR NAME]'s AI assistant. Answer questions about [his/her] skills, projects, and experience. Be professional and helpful.";
```

## 🔧 Technical Details

### API Configuration
- **Provider**: Google Gemini
- **Model**: gemini-2.5-flash
- **Temperature**: 0.7
- **Max Tokens**: 500
- **Cost**: Free tier available

### Integration
Already integrated in `app/layout.tsx` - appears on all pages.

## 🔒 Security

✅ API key in environment variables  
✅ Never exposed to client-side  
✅ API route handles all Gemini calls  
✅ .env.local in .gitignore  

## 💰 Cost

Google Gemini offers a generous free tier:
- 15 requests per minute
- 1,500 requests per day
- Perfect for portfolio use!

## 🐛 Troubleshooting

### Issue: "AI service is currently unavailable"

**Solution**:
1. Check `.env.local` exists in project root
2. Verify API key is correct
3. Restart dev server: `npm run dev`

### Issue: Chatbot not visible

**Solution**:
1. Check browser console for errors
2. Verify import in `app/layout.tsx`
3. Clear cache: `rm -rf .next && npm run dev`

## 🚀 Deployment (Netlify)

1. Go to Netlify dashboard
2. Navigate to: **Site settings → Environment variables**
3. Add variable:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: `your-api-key`
4. Redeploy

## 📚 Resources

- [Google AI Studio](https://aistudio.google.com/app/apikey)
- [Gemini API Docs](https://ai.google.dev/docs)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Framer Motion](https://www.framer.com/motion/)

---

**Status**: ✅ Ready to use!
