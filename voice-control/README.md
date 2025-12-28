# 🎤 Voice Control System for Next.js

A fully dynamic, reusable voice-control system that allows users to navigate pages, scroll to sections, and trigger actions using voice commands. Built with TypeScript and designed for Next.js applications.

## ✨ Features

- 🗣️ **Multi-language Support** - English and Hindi commands
- 🎯 **Dynamic Command System** - No hardcoded logic, fully configurable
- 🔄 **Reusable Architecture** - Plug-and-play across projects
- 🎨 **Beautiful UI Components** - Floating microphone button with animations
- 🌐 **Browser Native** - Uses Web Speech API (SpeechRecognition)
- 🎵 **Text-to-Speech Feedback** - Voice responses using SpeechSynthesis
- 🔊 **Wake Word Support** - "Hey Portfolio" activation
- 📱 **TypeScript First** - Fully typed with strict typing
- ⚡ **Next.js App Router** - Compatible with latest Next.js

## 🏗️ Architecture

```
voice-control/
├── hooks/
│   └── useVoiceControl.ts     # Main reusable hook
├── utils/
│   ├── voiceCommands.ts       # Dynamic command configuration
│   └── executeVoice.ts        # Reusable execution engine
├── components/
│   ├── VoiceControlButton.tsx # Floating microphone UI
│   ├── VoiceControlProvider.tsx # Context provider
│   └── VoiceCommandsList.tsx  # Commands display component
├── examples/
│   ├── BasicUsage.tsx         # Simple implementation
│   └── AdvancedUsage.tsx      # Complex implementation
└── index.ts                   # Main exports
```

## 🚀 Quick Start

### 1. Installation

Copy the `voice-control` folder to your Next.js project:

```bash
# Copy to your project
cp -r voice-control/ your-nextjs-project/
```

### 2. Basic Usage

```tsx
'use client';

import { VoiceControlButton, VoiceControlProvider } from './voice-control';

export default function App() {
  return (
    <VoiceControlProvider
      enableWakeWords={true}
      enableSpeechFeedback={true}
      autoStart={false}
    >
      <div className="min-h-screen">
        <h1>Your App Content</h1>
        
        {/* Floating Voice Control Button */}
        <VoiceControlButton
          position="bottom-right"
          size="lg"
          showTranscript={true}
        />
      </div>
    </VoiceControlProvider>
  );
}
```

### 3. Custom Commands

```tsx
import { useVoiceControl, VoiceCommand } from './voice-control';

const customCommands: VoiceCommand[] = [
  {
    id: 'toggle-theme',
    keywords: ['toggle theme', 'switch theme', 'dark mode'],
    action: 'custom',
    callback: () => toggleTheme(),
    description: 'Toggle between light and dark theme',
    language: 'en'
  }
];

function MyComponent() {
  const { actions } = useVoiceControl({
    config: { commands: customCommands }
  });
  
  // Add commands dynamically
  actions.addCommand({
    id: 'custom-action',
    keywords: ['do something'],
    action: 'custom',
    callback: () => console.log('Custom action!'),
    description: 'Custom action'
  });
}
```

## 🎯 Default Voice Commands

### English Commands

#### Navigation
- "go home" → Navigate to `/`
- "open about" → Navigate to `/about`
- "show projects" → Navigate to `/projects`
- "open contact" → Navigate to `/contact`
- "show skills" → Navigate to `/skills`
- "open blog" → Navigate to `/blog`

#### Scrolling
- "scroll down" → Scroll down 500px
- "scroll up" → Scroll up 500px
- "go to top" → Scroll to top of page
- "go to bottom" → Scroll to bottom of page
- "go to hero" → Scroll to `#hero` element
- "scroll to about" → Scroll to `#about` element

#### Control
- "start listening" → Start voice recognition
- "stop listening" → Stop voice recognition

### Hindi Commands (हिंदी)

#### Navigation
- "ghar jao" → Navigate to home
- "about kholo" → Open about page
- "projects dikhao" → Show projects

#### Scrolling
- "neeche jao" → Scroll down
- "upar jao" → Scroll up

#### Control
- "sunna shuru karo" → Start listening
- "sunna band karo" → Stop listening

### Wake Words
- "Hey Portfolio"
- "Hello Portfolio"
- "Portfolio Listen"
- "Portfolio Suno" (Hindi)

## 🔧 Configuration

### Voice Config Options

```tsx
interface VoiceConfig {
  commands: VoiceCommand[];        // Array of voice commands
  wakeWords?: string[];           // Wake words to activate
  languages: string[];            // Supported languages ['en-US', 'hi-IN']
  confidence: number;             // Recognition confidence (0-1)
  continuous: boolean;            // Continuous listening
  interimResults: boolean;        // Show interim results
}
```

### Command Structure

```tsx
interface VoiceCommand {
  id: string;                     // Unique identifier
  keywords: string[];             // Trigger phrases
  action: VoiceActionType;        // 'route' | 'scroll' | 'scrollBy' | 'custom'
  target?: string;                // Route path or element selector
  amount?: number;                // Scroll amount for scrollBy
  callback?: () => void;          // Custom function
  description: string;            // Human-readable description
  language?: 'en' | 'hi' | 'both'; // Language support
}
```

## 🎨 Components

### VoiceControlButton

Floating microphone button with listening states:

```tsx
<VoiceControlButton
  position="bottom-right"        // Position on screen
  size="lg"                      // 'sm' | 'md' | 'lg'
  showTranscript={true}          // Show what was heard
  showCommands={true}            // Show available commands
/>
```

### VoiceControlProvider

Context provider for voice control:

```tsx
<VoiceControlProvider
  config={voiceConfig}           // Voice configuration
  autoStart={false}             // Auto-start listening
  enableWakeWords={true}        // Enable wake word detection
  enableSpeechFeedback={true}   // Enable voice responses
  onCommand={(result) => {}}    // Command execution callback
  onError={(error) => {}}       // Error callback
>
  {children}
</VoiceControlProvider>
```

### VoiceCommandsList

Display available commands:

```tsx
<VoiceCommandsList
  showSearch={true}             // Enable search
  showFilter={true}             // Enable filtering
  groupByAction={true}          // Group by action type
  maxHeight="400px"             // Maximum height
/>
```

## 🔨 Advanced Usage

### Custom Execution Context

```tsx
const context: ExecutionContext = {
  router: useRouter(),          // Next.js router
  speak: (text) => {},         // Text-to-speech function
  onStartListening: () => {},  // Start callback
  onStopListening: () => {},   // Stop callback
  customCallbacks: {           // Custom command handlers
    'my-command': () => {}
  }
};
```

### Batch Commands

Execute multiple commands in sequence:

```tsx
// "go home and then scroll down"
const results = await executeBatchCommands(
  transcript,
  commands,
  context
);
```

### Wake Word Detection

```tsx
const hasWakeWord = containsWakeWord(
  "Hey portfolio, go home",
  ["hey portfolio"]
);

const command = extractCommandAfterWakeWord(
  "Hey portfolio, go home",
  ["hey portfolio"]
); // Returns "go home"
```

## 🌐 Browser Support

- ✅ Chrome/Chromium (Full support)
- ✅ Edge (Full support)
- ✅ Safari (Limited support)
- ❌ Firefox (No support)

## 🔒 Security & Privacy

- Uses browser-native Speech API
- No data sent to external servers
- Requires user permission for microphone access
- Graceful fallback when not supported

## 📱 Mobile Support

- Works on mobile Chrome/Safari
- Requires user interaction to start
- May have limited continuous listening

## 🎯 Use Cases

- **Portfolio Websites** - Voice navigation
- **Accessibility** - Voice control for users with disabilities
- **Presentations** - Hands-free slide control
- **Dashboards** - Voice commands for data interaction
- **E-commerce** - Voice search and navigation

## 🔧 Customization

### Adding New Languages

```tsx
const customConfig: VoiceConfig = {
  ...defaultVoiceConfig,
  languages: ['en-US', 'hi-IN', 'es-ES'], // Add Spanish
  commands: [
    ...defaultVoiceCommands,
    {
      id: 'nav-home-es',
      keywords: ['ir a casa', 'página principal'],
      action: 'route',
      target: '/',
      description: 'Navegar a la página principal',
      language: 'es'
    }
  ]
};
```

### Custom Action Types

```tsx
// Extend the action types
type CustomActionType = VoiceActionType | 'api-call' | 'modal-open';

// Create custom execution handler
const executeCustomAction = async (command: VoiceCommand) => {
  switch (command.action) {
    case 'api-call':
      await fetch(command.target);
      break;
    case 'modal-open':
      openModal(command.target);
      break;
  }
};
```

## 🐛 Troubleshooting

### Common Issues

1. **"Speech recognition not supported"**
   - Use Chrome/Edge browser
   - Ensure HTTPS connection

2. **"Permission denied"**
   - Allow microphone access
   - Check browser permissions

3. **Commands not recognized**
   - Speak clearly and slowly
   - Check confidence threshold
   - Add more keyword variations

4. **Auto-restart not working**
   - Check browser's autoplay policy
   - Ensure user interaction before starting

### Debug Mode

```tsx
const { state } = useVoiceControl({
  onStateChange: (state) => {
    console.log('Voice state:', state);
  },
  onCommand: (result) => {
    console.log('Command result:', result);
  },
  onError: (error) => {
    console.error('Voice error:', error);
  }
});
```

## 📄 License

MIT License - feel free to use in your projects!

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Add tests for new functionality
4. Submit a pull request

## 🎉 Examples

Check the `examples/` folder for:
- `BasicUsage.tsx` - Simple implementation
- `AdvancedUsage.tsx` - Complex features demo

## 📚 API Reference

See the TypeScript definitions in each file for complete API documentation.

---

**Built with ❤️ for the Next.js community**