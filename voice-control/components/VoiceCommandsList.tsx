/**
 * Voice Commands List Component
 * Displays available voice commands with search and filtering
 */

'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Mic, 
  Navigation, 
  Mouse, 
  Settings,
  Globe,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { VoiceCommand, VoiceActionType, defaultVoiceCommands } from '../utils/voiceCommands';
import { useVoiceControlContext } from './VoiceControlProvider';

export interface VoiceCommandsListProps {
  className?: string;
  showSearch?: boolean;
  showFilter?: boolean;
  groupByAction?: boolean;
  maxHeight?: string;
}

const actionIcons: Record<VoiceActionType, React.ComponentType<any>> = {
  route: Navigation,
  scroll: Mouse,
  scrollBy: Mouse,
  custom: Settings
};

const actionLabels: Record<VoiceActionType, string> = {
  route: 'Navigation',
  scroll: 'Scroll to Element',
  scrollBy: 'Scroll by Amount',
  custom: 'Custom Action'
};

const languageLabels: Record<string, string> = {
  en: '🇺🇸 English',
  hi: '🇮🇳 Hindi',
  both: '🌐 Both'
};

export const VoiceCommandsList: React.FC<VoiceCommandsListProps> = ({
  className = '',
  showSearch = true,
  showFilter = true,
  groupByAction = true,
  maxHeight = '400px'
}) => {
  const { state, actions } = useVoiceControlContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState<VoiceActionType | 'all'>('all');
  const [filterLanguage, setFilterLanguage] = useState<'en' | 'hi' | 'both' | 'all'>('all');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['route']));

  // Get commands from the voice control context
  const commands = useMemo(() => {
    // Use default commands as fallback
    return defaultVoiceCommands;
  }, []);

  // Filter and search commands
  const filteredCommands = useMemo(() => {
    return commands.filter(command => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        command.keywords.some(keyword => 
          keyword.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        command.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Action filter
      const matchesAction = filterAction === 'all' || command.action === filterAction;

      // Language filter
      const matchesLanguage = filterLanguage === 'all' || 
        command.language === filterLanguage || 
        command.language === 'both';

      return matchesSearch && matchesAction && matchesLanguage;
    });
  }, [commands, searchTerm, filterAction, filterLanguage]);

  // Group commands by action
  const groupedCommands = useMemo(() => {
    if (!groupByAction) {
      return { all: filteredCommands };
    }

    return filteredCommands.reduce((groups, command) => {
      const action = command.action;
      if (!groups[action]) {
        groups[action] = [];
      }
      groups[action].push(command);
      return groups;
    }, {} as Record<string, VoiceCommand[]>);
  }, [filteredCommands, groupByAction]);

  const toggleGroup = (groupName: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupName)) {
      newExpanded.delete(groupName);
    } else {
      newExpanded.add(groupName);
    }
    setExpandedGroups(newExpanded);
  };

  const executeCommand = async (command: VoiceCommand) => {
    if (command.keywords.length > 0) {
      await actions.executeCommand(command.keywords[0]);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <Mic className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Voice Commands</h3>
          <span className="ml-auto text-sm text-gray-500">
            {filteredCommands.length} commands
          </span>
        </div>

        {/* Search */}
        {showSearch && (
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search commands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        )}

        {/* Filters */}
        {showFilter && (
          <div className="flex gap-2">
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value as VoiceActionType | 'all')}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">All Actions</option>
              <option value="route">Navigation</option>
              <option value="scroll">Scroll to Element</option>
              <option value="scrollBy">Scroll by Amount</option>
              <option value="custom">Custom Actions</option>
            </select>

            <select
              value={filterLanguage}
              onChange={(e) => setFilterLanguage(e.target.value as 'en' | 'hi' | 'both' | 'all')}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">All Languages</option>
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="both">Both</option>
            </select>
          </div>
        )}
      </div>

      {/* Commands List */}
      <div className="overflow-y-auto" style={{ maxHeight }}>
        {Object.keys(groupedCommands).length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Mic className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No commands found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {Object.entries(groupedCommands).map(([actionType, commands]) => {
              const ActionIcon = actionIcons[actionType as VoiceActionType] || Settings;
              const isExpanded = expandedGroups.has(actionType);

              return (
                <div key={actionType} className="space-y-2">
                  {/* Group Header */}
                  {groupByAction && (
                    <button
                      onClick={() => toggleGroup(actionType)}
                      className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <ActionIcon className="w-4 h-4 text-primary" />
                      <span className="font-medium text-sm">
                        {actionLabels[actionType as VoiceActionType] || actionType}
                      </span>
                      <span className="text-xs text-gray-500 ml-auto mr-2">
                        {commands.length}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  )}

                  {/* Commands */}
                  <AnimatePresence>
                    {(!groupByAction || isExpanded) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2 ml-6"
                      >
                        {commands.map((command, index) => (
                          <motion.div
                            key={command.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="group p-3 rounded-md border border-gray-200 dark:border-gray-600 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
                            onClick={() => executeCommand(command)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-medium">
                                    {command.keywords[0]}
                                  </span>
                                  {command.language && command.language !== 'both' && (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                      {languageLabels[command.language]}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                  {command.description}
                                </p>
                                {command.keywords.length > 1 && (
                                  <div className="flex flex-wrap gap-1">
                                    {command.keywords.slice(1).map((keyword, i) => (
                                      <span
                                        key={i}
                                        className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                                      >
                                        "{keyword}"
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  executeCommand(command);
                                }}
                                className="opacity-0 group-hover:opacity-100 ml-2 p-1 rounded hover:bg-primary/10 transition-all"
                                title="Execute command"
                              >
                                <Mic className="w-4 h-4 text-primary" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            Voice Control {state.isSupported ? '✓ Supported' : '✗ Not Supported'}
          </span>
          <span>
            Status: {state.isListening ? 'Listening' : 'Idle'}
          </span>
        </div>
      </div>
    </div>
  );
};