# 🤖 AI ChatBot Setup Guide

Complete setup instructions for the AI chatbot feature in your portfolio.

## ✅ What's Been Added

### 1. File Structure

```
📁 Project Root
├── 📁 app/
│   └── 📁 api/
│       └── 📁 chat/
│           └── route.ts          # OpenAI API endpoint
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
└── CHATBOT_SETUP.md             # This file
```

### 2. Integration Points

✅ Added to `app/layout.tsx` - Chatbot appears on all pages
✅ API route created at `/api/chat`
✅ TypeScript types defined
✅ Modular component structure

## 🚀 Quick Start (3 Steps)

### Step 1: Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)

### Step 2: Create Environment File

Create a file named `.env.local` in your project root:

```bash
OPENAI_API_KEY=sk-your-actual-api-key-here
```

⚠️ **Important**: Never commit this file to Git (already in .gitignore)

### Step 3: Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000 and click the floating chat button!

## 🎨 Customization Guide

### Change Assistant Name & Greeting

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
<p className="text-xs opacity-90">Ask me anything about YOUR NAME</p>
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
{
  role: 'system',
  content: `You are [YOUR NAME]'s AI assistant. 
  Answer questions about [his/her] skills, projects, and experience.
  Be professional, friendly, and concise.
  Focus on: [list key skills/technologies].`,
}
```

### Change Colors

**Primary Gradient** (Button & Header):
```tsx
className="bg-gradient-to-r from-blue-500 to-purple-600"
```

**User Message Bubble**:
```tsx
className="bg-blue-500 text-white"
```

**Assistant Message Bubble**:
```tsx
className="bg-gray-200 dark:bg-gray-700"
```

### Adjust Position

**File**: `components/chatbot/ChatButton.tsx`

```tsx
// Change from bottom-right to bottom-left
className="fixed bottom-6 left-6 z-50"
```

## 🔧 Advanced Configuration

### Change AI Model

**File**: `app/api/chat/route.ts`

```tsx
const completion = await openai.chat.completions.create({
  model: 'gpt-4o-mini', // or 'gpt-4', 'gpt-3.5-turbo'
  // ...
});
```

### Adjust Response Length

```tsx
max_tokens: 500, // Increase for longer responses
```

### Modify Temperature (Creativity)

```tsx
temperature: 0.7, // 0 = focused, 1 = creative
```

## 📱 Mobile Optimization

The chatbot is already mobile-responsive:
- Full width on screens < 640px
- Touch-friendly buttons
- Optimized height for mobile

## 🔒 Security Best Practices

✅ API key in environment variables
✅ Never exposed to client-side
✅ API route handles all OpenAI calls
✅ Error handling for invalid keys
✅ .env.local in .gitignore

## 💰 Cost Estimation

Using `gpt-4o-mini`:
- Input: ~$0.15 per 1M tokens
- Output: ~$0.60 per 1M tokens
- Average message: ~$0.0001

**Example**: 1,000 messages ≈ $0.10

Very affordable for portfolio use!

## 🐛 Common Issues & Solutions

### Issue: "Invalid API key configuration"

**Solution**:
1. Check `.env.local` exists in project root
2. Verify key starts with `sk-`
3. Restart dev server: `npm run dev`

### Issue: Chatbot not visible

**Solution**:
1. Check browser console for errors
2. Verify import in `app/layout.tsx`
3. Clear cache: `rm -rf .next && npm run dev`

### Issue: Dark mode styling issues

**Solution**:
1. Ensure ThemeProvider is wrapping the app
2. Check Tailwind dark mode config
3. Verify `dark:` classes are applied

### Issue: API rate limits

**Solution**:
1. Check OpenAI dashboard for limits
2. Add rate limiting to API route
3. Consider caching responses

## 🧪 Testing Checklist

- [ ] Chatbot button appears
- [ ] Button opens/closes chat window
- [ ] Quick questions work
- [ ] Custom messages send successfully
- [ ] AI responds appropriately
- [ ] Loading indicator shows
- [ ] Messages auto-scroll
- [ ] Enter key sends message
- [ ] Mobile responsive
- [ ] Dark mode works
- [ ] Error handling works

## 📚 Additional Resources

- [OpenAI API Docs](https://platform.openai.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## 🎯 Next Steps

1. ✅ Set up your OpenAI API key
2. ✅ Test the chatbot
3. ✅ Customize the greeting and questions
4. ✅ Adjust the system prompt for your portfolio
5. ✅ Test on mobile devices
6. ✅ Deploy to production

## 📞 Need Help?

Check the component README: `components/chatbot/README.md`

---

**Ready to go!** Your AI chatbot is fully integrated and ready to use. Just add your OpenAI API key and start chatting! 🚀
