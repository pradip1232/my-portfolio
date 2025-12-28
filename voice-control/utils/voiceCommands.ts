/**
 * Voice Commands Configuration
 * Dynamic, reusable command definitions with multi-language support
 */

export type VoiceActionType = 'route' | 'scroll' | 'scrollBy' | 'custom';

export interface VoiceCommand {
  id: string;
  keywords: string[];
  action: VoiceActionType;
  target?: string;
  amount?: number;
  callback?: () => void;
  description: string;
  language?: 'en' | 'hi' | 'both';
}

export interface VoiceConfig {
  commands: VoiceCommand[];
  wakeWords?: string[];
  languages: string[];
  confidence: number;
  continuous: boolean;
  interimResults: boolean;
}

/**
 * Default Voice Commands Configuration
 * Easily extendable without modifying core logic
 */
export const defaultVoiceCommands: VoiceCommand[] = [
  // Navigation Commands (English)
  {
    id: 'nav-home',
    keywords: ['go home', 'home page', 'navigate home', 'take me home'],
    action: 'route',
    target: '/',
    description: 'Navigate to home page',
    language: 'en'
  },
  {
    id: 'nav-about',
    keywords: ['go about', 'about page', 'open about', 'show about'],
    action: 'route',
    target: '/about',
    description: 'Navigate to about page',
    language: 'en'
  },
  {
    id: 'nav-projects',
    keywords: ['show projects', 'open projects', 'projects page', 'my work'],
    action: 'route',
    target: '/projects',
    description: 'Navigate to projects page',
    language: 'en'
  },
  {
    id: 'nav-skills',
    keywords: ['show skills', 'open skills', 'skills page', 'my skills'],
    action: 'route',
    target: '/skills',
    description: 'Navigate to skills page',
    language: 'en'
  },
  {
    id: 'nav-contact',
    keywords: ['open contact', 'contact page', 'get in touch', 'contact me'],
    action: 'route',
    target: '/contact',
    description: 'Navigate to contact page',
    language: 'en'
  },
  {
    id: 'nav-blog',
    keywords: ['open blog', 'blog page', 'show blog', 'articles'],
    action: 'route',
    target: '/blog',
    description: 'Navigate to blog page',
    language: 'en'
  },
  {
    id: 'nav-analytics',
    keywords: ['show analytics', 'open analytics', 'visitor stats', 'analytics page'],
    action: 'route',
    target: '/analytics/visitors',
    description: 'Navigate to analytics page',
    language: 'en'
  },

  // Hindi Navigation Commands
  {
    id: 'nav-home-hi',
    keywords: ['ghar jao', 'home jao', 'ghar page'],
    action: 'route',
    target: '/',
    description: 'घर पेज पर जाएं',
    language: 'hi'
  },
  {
    id: 'nav-about-hi',
    keywords: ['about kholo', 'mere bare mein', 'about page'],
    action: 'route',
    target: '/about',
    description: 'अबाउट पेज खोलें',
    language: 'hi'
  },
  {
    id: 'nav-projects-hi',
    keywords: ['projects dikhao', 'kaam dikhao', 'projects kholo'],
    action: 'route',
    target: '/projects',
    description: 'प्रोजेक्ट्स दिखाएं',
    language: 'hi'
  },

  // Scroll Commands (English)
  {
    id: 'scroll-down',
    keywords: ['scroll down', 'go down', 'move down', 'page down'],
    action: 'scrollBy',
    amount: 500,
    description: 'Scroll down the page',
    language: 'en'
  },
  {
    id: 'scroll-up',
    keywords: ['scroll up', 'go up', 'move up', 'page up'],
    action: 'scrollBy',
    amount: -500,
    description: 'Scroll up the page',
    language: 'en'
  },
  {
    id: 'scroll-top',
    keywords: ['go to top', 'scroll to top', 'top of page', 'beginning'],
    action: 'scroll',
    target: 'top',
    description: 'Scroll to top of page',
    language: 'en'
  },
  {
    id: 'scroll-bottom',
    keywords: ['go to bottom', 'scroll to bottom', 'end of page', 'bottom'],
    action: 'scroll',
    target: 'bottom',
    description: 'Scroll to bottom of page',
    language: 'en'
  },

  // Hindi Scroll Commands
  {
    id: 'scroll-down-hi',
    keywords: ['neeche jao', 'neeche scroll karo', 'neeche'],
    action: 'scrollBy',
    amount: 500,
    description: 'नीचे स्क्रॉल करें',
    language: 'hi'
  },
  {
    id: 'scroll-up-hi',
    keywords: ['upar jao', 'upar scroll karo', 'upar'],
    action: 'scrollBy',
    amount: -500,
    description: 'ऊपर स्क्रॉल करें',
    language: 'hi'
  },

  // Section Scroll Commands (English)
  {
    id: 'scroll-hero',
    keywords: ['go to hero', 'show hero', 'hero section'],
    action: 'scroll',
    target: '#hero',
    description: 'Scroll to hero section',
    language: 'en'
  },
  {
    id: 'scroll-about-section',
    keywords: ['go to about section', 'about section', 'scroll to about'],
    action: 'scroll',
    target: '#about',
    description: 'Scroll to about section',
    language: 'en'
  },
  {
    id: 'scroll-projects-section',
    keywords: ['go to projects section', 'projects section', 'scroll to projects'],
    action: 'scroll',
    target: '#projects',
    description: 'Scroll to projects section',
    language: 'en'
  },
  {
    id: 'scroll-skills-section',
    keywords: ['go to skills section', 'skills section', 'scroll to skills'],
    action: 'scroll',
    target: '#skills',
    description: 'Scroll to skills section',
    language: 'en'
  },
  {
    id: 'scroll-contact-section',
    keywords: ['go to contact section', 'contact section', 'scroll to contact'],
    action: 'scroll',
    target: '#contact',
    description: 'Scroll to contact section',
    language: 'en'
  },

  // Control Commands (English)
  {
    id: 'start-listening',
    keywords: ['start listening', 'begin listening', 'activate voice', 'listen'],
    action: 'custom',
    description: 'Start voice recognition',
    language: 'en'
  },
  {
    id: 'stop-listening',
    keywords: ['stop listening', 'end listening', 'deactivate voice', 'silence'],
    action: 'custom',
    description: 'Stop voice recognition',
    language: 'en'
  },

  // Hindi Control Commands
  {
    id: 'start-listening-hi',
    keywords: ['sunna shuru karo', 'awaz suno', 'listening start'],
    action: 'custom',
    description: 'आवाज़ पहचान शुरू करें',
    language: 'hi'
  },
  {
    id: 'stop-listening-hi',
    keywords: ['sunna band karo', 'awaz band', 'listening stop'],
    action: 'custom',
    description: 'आवाज़ पहचान बंद करें',
    language: 'hi'
  }
];

/**
 * Wake Words Configuration
 * Trigger words to activate voice recognition
 */
export const defaultWakeWords: string[] = [
  // Primary wake words with "beast developer"
  'hey beast developer',
  'hey beast',
  'beast developer',
  'hey developer',
  
  // Alternative wake words
  'hey portfolio',
  'hello portfolio',
  'portfolio listen',
  'voice control',
  'hey website',
  
  // Hindi wake words
  'hey beast developer suno',
  'beast developer suno',
  'portfolio suno',
  'website suno',
  'awaz control'
];

/**
 * Default Voice Configuration
 */
export const defaultVoiceConfig: VoiceConfig = {
  commands: defaultVoiceCommands,
  wakeWords: defaultWakeWords,
  languages: ['en-US', 'hi-IN'],
  confidence: 0.7,
  continuous: true,
  interimResults: true
};

/**
 * Helper function to get commands by language
 */
export const getCommandsByLanguage = (
  commands: VoiceCommand[],
  language: 'en' | 'hi' | 'both' = 'both'
): VoiceCommand[] => {
  if (language === 'both') return commands;
  return commands.filter(cmd => cmd.language === language || cmd.language === 'both');
};

/**
 * Helper function to get all keywords from commands
 */
export const getAllKeywords = (commands: VoiceCommand[]): string[] => {
  return commands.reduce((acc, cmd) => [...acc, ...cmd.keywords], [] as string[]);
};

/**
 * Helper function to add custom commands
 */
export const addCustomCommand = (
  commands: VoiceCommand[],
  newCommand: VoiceCommand
): VoiceCommand[] => {
  return [...commands, newCommand];
};

/**
 * Helper function to remove command by id
 */
export const removeCommand = (
  commands: VoiceCommand[],
  commandId: string
): VoiceCommand[] => {
  return commands.filter(cmd => cmd.id !== commandId);
};