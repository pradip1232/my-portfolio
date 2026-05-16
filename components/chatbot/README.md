# AI ChatBot Component

A professional floating AI chatbot for your Next.js portfolio, powered by Google Gemini API.

## 📁 Folder Structure

```
components/chatbot/
├── ChatBot.tsx           # Main chatbot component (orchestrator)
├── ChatButton.tsx        # Floating chat toggle button
├── ChatWindow.tsx        # Chat window container
├── ChatMessage.tsx       # Individual message bubble
├── QuickQuestions.tsx    # Suggested quick questions
├── LoadingIndicator.tsx  # Typing animation
├── types.ts              # TypeScript interfaces
├── index.ts              # Barrel export
└── README.md             # This file
```

## 🚀 Setup Instructions

### 1. Get Gemini API Key (Free)

Get your free API key from: https://aistudio.google.com/app/apikey

### 2. Configure Environment Variables

Create a `.env.local` file in your project root:

```bash
GEMINI_API_KEY=your-gemini-api-key-here
```

### 3. Integration (Already Done)

The chatbot is already integrated in `app/layout.tsx`:

```tsx
import ChatBot from "@/components/chatbot";

// Inside your layout
<ChatBot />
```

## 🎨 Features

- ✅ Floating button with smooth animations
- ✅ Glassmorphism design
- ✅ Dark mode support
- ✅ Mobile responsive
- ✅ Quick question suggestions
- ✅ Typing indicator
- ✅ Auto-scroll to latest message
- ✅ Enter key to send
- ✅ Professional UI/UX
- ✅ Secure API key handling
- ✅ Free tier compatible (Google Gemini)

## 🔧 Customization

### Change AI Assistant Name

Edit `components/chatbot/ChatWindow.tsx`:

```tsx
<h3 className="font-semibold text-lg">Your Name AI Assistant</h3>
```

### Modify Quick Questions

Edit `components/chatbot/ChatBot.tsx`:

```tsx
const QUICK_QUESTIONS = [
  'Your custom question 1',
  'Your custom question 2',
  // Add more...
];
```

### Update System Prompt

Edit `app/api/chat/route.ts`:

```tsx
const systemInstruction = "Your custom system prompt here";
```

### Change Colors

The chatbot uses Tailwind CSS. Main gradient colors:

```tsx
// Button & Header
className="bg-gradient-to-r from-blue-500 to-purple-600"

// User messages
className="bg-blue-500 text-white"
```

## 📱 Mobile Responsive

The chatbot automatically adapts to mobile screens:
- Full width on mobile (with margins)
- Smaller height on mobile devices
- Touch-friendly buttons

## 🔒 Security

- API key stored in environment variables
- Never exposed to frontend
- API route handles all Gemini communication
- Error handling for invalid keys

## 🧪 Testing

Test the chatbot:

1. Start your dev server: `npm run dev`
2. Click the floating chat button
3. Try the quick questions
4. Ask custom questions about your portfolio

## 🐛 Troubleshooting

### "AI service is currently unavailable"
- Check your `.env.local` file exists
- Verify the API key is correct
- Restart your dev server after adding the key

### Chatbot not appearing
- Check browser console for errors
- Verify the import in `layout.tsx`
- Ensure Framer Motion is installed

### Styling issues
- Check Tailwind CSS is configured
- Verify dark mode is working
- Clear Next.js cache: `rm -rf .next`

## 📦 Dependencies

- `framer-motion` - Animations
- `react` - UI framework
- `next` - Framework
- No external AI SDK needed (uses native fetch)

## 🎯 API Usage

The chatbot uses:
- Model: `gemini-2.5-flash`
- Max tokens: 500
- Temperature: 0.7

**Cost**: Free tier available with generous limits!

## 📝 License

Part of your portfolio project.
