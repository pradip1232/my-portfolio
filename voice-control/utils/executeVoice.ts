/**
 * Voice Command Execution Engine
 * Reusable function to match and execute voice commands dynamically
 */

import { VoiceCommand, VoiceActionType } from './voiceCommands';

export interface ExecutionResult {
  success: boolean;
  command?: VoiceCommand;
  message: string;
  action?: VoiceActionType;
}

export interface ExecutionContext {
  router?: {
    push: (path: string) => void;
  };
  onStartListening?: () => void;
  onStopListening?: () => void;
  speak?: (text: string) => void;
  customCallbacks?: Record<string, () => void>;
}

/**
 * Normalize text for better matching
 */
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .replace(/\s+/g, ' '); // Normalize spaces
};

/**
 * Calculate similarity between two strings using Levenshtein distance
 */
const calculateSimilarity = (str1: string, str2: string): number => {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }
  
  const maxLength = Math.max(str1.length, str2.length);
  return maxLength === 0 ? 1 : (maxLength - matrix[str2.length][str1.length]) / maxLength;
};

/**
 * Find the best matching command for a transcript
 */
const findBestMatch = (
  transcript: string,
  commands: VoiceCommand[],
  threshold: number = 0.7
): VoiceCommand | null => {
  const normalizedTranscript = normalizeText(transcript);
  let bestMatch: VoiceCommand | null = null;
  let bestScore = 0;

  for (const command of commands) {
    for (const keyword of command.keywords) {
      const normalizedKeyword = normalizeText(keyword);
      
      // Exact match gets highest priority
      if (normalizedTranscript.includes(normalizedKeyword)) {
        return command;
      }
      
      // Fuzzy matching for partial matches
      const similarity = calculateSimilarity(normalizedTranscript, normalizedKeyword);
      
      // Also check if transcript contains most words from keyword
      const keywordWords = normalizedKeyword.split(' ');
      const transcriptWords = normalizedTranscript.split(' ');
      const matchingWords = keywordWords.filter(word => 
        transcriptWords.some(tWord => tWord.includes(word) || word.includes(tWord))
      );
      const wordMatchScore = matchingWords.length / keywordWords.length;
      
      // Combined score: similarity + word matching
      const combinedScore = (similarity * 0.6) + (wordMatchScore * 0.4);
      
      if (combinedScore > bestScore && combinedScore >= threshold) {
        bestScore = combinedScore;
        bestMatch = command;
      }
    }
  }

  return bestMatch;
};

/**
 * Execute scroll action
 */
const executeScroll = (target: string): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      if (target === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        resolve(true);
      } else if (target === 'bottom') {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        resolve(true);
      } else if (target.startsWith('#')) {
        const element = document.querySelector(target);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          resolve(true);
        } else {
          console.warn(`Element with selector "${target}" not found`);
          resolve(false);
        }
      } else {
        resolve(false);
      }
    } catch (error) {
      console.error('Scroll execution error:', error);
      resolve(false);
    }
  });
};

/**
 * Execute scroll by amount
 */
const executeScrollBy = (amount: number): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      window.scrollBy({ top: amount, behavior: 'smooth' });
      resolve(true);
    } catch (error) {
      console.error('ScrollBy execution error:', error);
      resolve(false);
    }
  });
};

/**
 * Execute route navigation
 */
const executeRoute = (path: string, context: ExecutionContext): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      if (context.router) {
        context.router.push(path);
        resolve(true);
      } else {
        // Fallback to window.location
        window.location.href = path;
        resolve(true);
      }
    } catch (error) {
      console.error('Route execution error:', error);
      resolve(false);
    }
  });
};

/**
 * Execute custom action
 */
const executeCustom = (command: VoiceCommand, context: ExecutionContext): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      // Handle built-in control commands
      if (command.id === 'start-listening' || command.id === 'start-listening-hi') {
        context.onStartListening?.();
        resolve(true);
        return;
      }
      
      if (command.id === 'stop-listening' || command.id === 'stop-listening-hi') {
        context.onStopListening?.();
        resolve(true);
        return;
      }
      
      // Handle custom callbacks
      if (command.callback) {
        command.callback();
        resolve(true);
        return;
      }
      
      // Handle custom callbacks by command id
      if (context.customCallbacks && context.customCallbacks[command.id]) {
        context.customCallbacks[command.id]();
        resolve(true);
        return;
      }
      
      console.warn(`No handler found for custom command: ${command.id}`);
      resolve(false);
    } catch (error) {
      console.error('Custom execution error:', error);
      resolve(false);
    }
  });
};

/**
 * Main execution function - matches transcript to commands and executes actions
 */
export const executeVoiceCommand = async (
  transcript: string,
  commands: VoiceCommand[],
  context: ExecutionContext = {},
  threshold: number = 0.7
): Promise<ExecutionResult> => {
  try {
    // Find the best matching command
    const matchedCommand = findBestMatch(transcript, commands, threshold);
    
    if (!matchedCommand) {
      return {
        success: false,
        message: `No matching command found for: "${transcript}"`
      };
    }

    let executionSuccess = false;
    let message = '';

    // Execute based on action type
    switch (matchedCommand.action) {
      case 'route':
        if (matchedCommand.target) {
          executionSuccess = await executeRoute(matchedCommand.target, context);
          message = executionSuccess 
            ? `Navigating to ${matchedCommand.target}`
            : `Failed to navigate to ${matchedCommand.target}`;
        }
        break;

      case 'scroll':
        if (matchedCommand.target) {
          executionSuccess = await executeScroll(matchedCommand.target);
          message = executionSuccess 
            ? `Scrolling to ${matchedCommand.target}`
            : `Failed to scroll to ${matchedCommand.target}`;
        }
        break;

      case 'scrollBy':
        if (typeof matchedCommand.amount === 'number') {
          executionSuccess = await executeScrollBy(matchedCommand.amount);
          const direction = matchedCommand.amount > 0 ? 'down' : 'up';
          message = executionSuccess 
            ? `Scrolling ${direction}`
            : `Failed to scroll ${direction}`;
        }
        break;

      case 'custom':
        executionSuccess = await executeCustom(matchedCommand, context);
        message = executionSuccess 
          ? `Executed: ${matchedCommand.description}`
          : `Failed to execute: ${matchedCommand.description}`;
        break;

      default:
        message = `Unknown action type: ${matchedCommand.action}`;
        break;
    }

    // Provide voice feedback if available
    if (context.speak && executionSuccess) {
      context.speak(message);
    }

    return {
      success: executionSuccess,
      command: matchedCommand,
      message,
      action: matchedCommand.action
    };

  } catch (error) {
    const errorMessage = `Execution error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    console.error('Voice command execution error:', error);
    
    return {
      success: false,
      message: errorMessage
    };
  }
};

/**
 * Batch execute multiple commands (for complex voice inputs)
 */
export const executeBatchCommands = async (
  transcript: string,
  commands: VoiceCommand[],
  context: ExecutionContext = {},
  threshold: number = 0.7
): Promise<ExecutionResult[]> => {
  // Split transcript by common separators
  const parts = transcript
    .split(/\s+(?:and|then|after|next)\s+/i)
    .map(part => part.trim())
    .filter(part => part.length > 0);

  const results: ExecutionResult[] = [];

  for (const part of parts) {
    const result = await executeVoiceCommand(part, commands, context, threshold);
    results.push(result);
    
    // Add small delay between commands
    if (results.length < parts.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  return results;
};

/**
 * Check if transcript contains wake words
 */
export const containsWakeWord = (
  transcript: string,
  wakeWords: string[],
  threshold: number = 0.8
): boolean => {
  const normalizedTranscript = normalizeText(transcript);
  
  return wakeWords.some(wakeWord => {
    const normalizedWakeWord = normalizeText(wakeWord);
    
    // Check exact match first
    if (normalizedTranscript.includes(normalizedWakeWord)) {
      return true;
    }
    
    // Check fuzzy match
    const similarity = calculateSimilarity(normalizedTranscript, normalizedWakeWord);
    return similarity >= threshold;
  });
};

/**
 * Extract command from transcript after wake word
 */
export const extractCommandAfterWakeWord = (
  transcript: string,
  wakeWords: string[]
): string => {
  const normalizedTranscript = normalizeText(transcript);
  
  for (const wakeWord of wakeWords) {
    const normalizedWakeWord = normalizeText(wakeWord);
    const index = normalizedTranscript.indexOf(normalizedWakeWord);
    
    if (index !== -1) {
      const commandPart = normalizedTranscript
        .substring(index + normalizedWakeWord.length)
        .trim();
      
      if (commandPart.length > 0) {
        return commandPart;
      }
    }
  }
  
  return transcript; // Return original if no wake word found
};