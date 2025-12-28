/**
 * Voice Debug Panel Component
 * Shows real-time voice control status for debugging
 */

'use client';

import React from 'react';
import { useVoiceControlContext } from './VoiceControlProvider';

export const VoiceDebugPanel: React.FC = () => {
  const { state, actions } = useVoiceControlContext();

  return (
    <div className="fixed top-4 left-4 bg-black/80 text-white p-4 rounded-lg text-sm font-mono z-50 max-w-sm">
      <div className="mb-2 font-bold">🎤 Voice Control Debug</div>
      
      <div className="space-y-1">
        <div>
          <span className="text-gray-300">Status:</span>{' '}
          <span className={state.isListening ? 'text-green-400' : 'text-red-400'}>
            {state.isListening ? 'LISTENING' : 'IDLE'}
          </span>
        </div>
        
        <div>
          <span className="text-gray-300">Supported:</span>{' '}
          <span className={state.isSupported ? 'text-green-400' : 'text-red-400'}>
            {state.isSupported ? 'YES' : 'NO'}
          </span>
        </div>
        
        <div>
          <span className="text-gray-300">Language:</span>{' '}
          <span className="text-blue-400">{state.language}</span>
        </div>
        
        {state.confidence > 0 && (
          <div>
            <span className="text-gray-300">Confidence:</span>{' '}
            <span className="text-yellow-400">{Math.round(state.confidence)}%</span>
          </div>
        )}
        
        {state.lastTranscript && (
          <div>
            <span className="text-gray-300">Last heard:</span>
            <div className="text-green-300 text-xs mt-1 p-1 bg-black/50 rounded">
              "{state.lastTranscript}"
            </div>
          </div>
        )}
        
        {state.lastResult && (
          <div>
            <span className="text-gray-300">Last result:</span>
            <div className={`text-xs mt-1 p-1 rounded ${
              state.lastResult.success ? 'text-green-300 bg-green-900/30' : 'text-red-300 bg-red-900/30'
            }`}>
              {state.lastResult.message}
            </div>
          </div>
        )}
        
        {state.error && (
          <div>
            <span className="text-gray-300">Error:</span>
            <div className="text-red-300 text-xs mt-1 p-1 bg-red-900/30 rounded">
              {state.error}
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-3 flex gap-2">
        <button
          onClick={actions.startListening}
          disabled={state.isListening || !state.isSupported}
          className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start
        </button>
        <button
          onClick={actions.stopListening}
          disabled={!state.isListening}
          className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Stop
        </button>
        {state.error && (
          <button
            onClick={actions.clearError}
            className="px-2 py-1 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};