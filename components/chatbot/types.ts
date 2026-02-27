export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatBotProps {
  className?: string;
}
