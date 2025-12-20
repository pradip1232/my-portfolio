import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const VISITORS_FILE = path.join(DATA_DIR, 'visitors.json');
const LIVE_VISITORS_FILE = path.join(DATA_DIR, 'live-visitors.json');

export interface VisitorData {
  totalVisitors: number;
  dailyVisitors: { [date: string]: number };
  hourlyData: { timestamp: string; count: number; country?: string }[];
  countryData: { [country: string]: number };
  lastUpdated: string;
}

export interface LiveVisitor {
  sessionId: string;
  connectedAt: string;
  lastActivity: string;
}

// In-memory storage for serverless environments (Netlify, Vercel)
// This persists during the function's lifetime
const memoryStore = {
  visitors: null as VisitorData | null,
  liveVisitors: [] as LiveVisitor[],
  initialized: false,
};

// Check if we're in a serverless environment
function isServerless(): boolean {
  return !!(
    process.env.VERCEL ||
    process.env.NETLIFY ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.FUNCTION_NAME
  );
}

// Initialize default visitor data
function getDefaultVisitorData(): VisitorData {
  return {
    totalVisitors: 0,
    dailyVisitors: {},
    hourlyData: [],
    countryData: {},
    lastUpdated: new Date().toISOString(),
  };
}

// Ensure data directory exists (only for non-serverless)
function ensureDataDir(): boolean {
  if (isServerless()) {
    console.log('[Analytics] Serverless environment detected, using in-memory storage');
    return false;
  }

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
      console.log('[Analytics] Created data directory:', DATA_DIR);
    }
    return true;
  } catch (error) {
    console.warn('[Analytics] Cannot create data directory (serverless?), using in-memory:', error);
    return false;
  }
}

// Read visitor data (tries file first, falls back to memory)
export function readVisitorData(): VisitorData {
  console.log('[Analytics] Reading visitor data...');
  
  // Try in-memory first (for serverless)
  if (memoryStore.visitors) {
    console.log('[Analytics] Using in-memory visitor data');
    return memoryStore.visitors;
  }

  // Try file system (for localhost)
  if (ensureDataDir() && fs.existsSync(VISITORS_FILE)) {
    try {
      const data = fs.readFileSync(VISITORS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      console.log('[Analytics] Loaded visitor data from file:', {
        totalVisitors: parsed.totalVisitors,
        dailyCount: Object.keys(parsed.dailyVisitors || {}).length,
      });
      // Ensure countryData exists for backward compatibility
      if (!parsed.countryData) {
        parsed.countryData = {};
      }
      // Cache in memory
      memoryStore.visitors = parsed;
      return parsed;
    } catch (error) {
      console.error('[Analytics] Error reading visitor file, using memory:', error);
    }
  }

  // Default: initialize in memory
  const defaultData = getDefaultVisitorData();
  console.log('[Analytics] Initializing new visitor data');
  memoryStore.visitors = defaultData;
  return defaultData;
}

// Write visitor data (tries file, always updates memory)
export function writeVisitorData(data: VisitorData): void {
  console.log('[Analytics] Writing visitor data:', {
    totalVisitors: data.totalVisitors,
    dailyCount: Object.keys(data.dailyVisitors).length,
  });
  
  data.lastUpdated = new Date().toISOString();
  
  // Always update memory (works in serverless)
  memoryStore.visitors = data;
  console.log('[Analytics] Updated in-memory visitor data');

  // Try to write to file (for localhost persistence)
  if (ensureDataDir()) {
    try {
      fs.writeFileSync(VISITORS_FILE, JSON.stringify(data, null, 2));
      console.log('[Analytics] Saved visitor data to file');
    } catch (error) {
      console.warn('[Analytics] Could not write to file (serverless?), data in memory only:', error);
    }
  }
}

// Read live visitors (tries file first, falls back to memory)
export function readLiveVisitors(): LiveVisitor[] {
  console.log('[Analytics] Reading live visitors...');
  
  // Try in-memory first
  if (memoryStore.liveVisitors.length > 0 || memoryStore.initialized) {
    console.log('[Analytics] Using in-memory live visitors:', memoryStore.liveVisitors.length);
    return memoryStore.liveVisitors;
  }

  // Try file system
  if (ensureDataDir() && fs.existsSync(LIVE_VISITORS_FILE)) {
    try {
      const data = fs.readFileSync(LIVE_VISITORS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      console.log('[Analytics] Loaded live visitors from file:', parsed.length);
      memoryStore.liveVisitors = parsed;
      memoryStore.initialized = true;
      return parsed;
    } catch (error) {
      console.error('[Analytics] Error reading live visitors file:', error);
    }
  }

  // Default: empty array
  memoryStore.initialized = true;
  return [];
}

// Write live visitors (tries file, always updates memory)
export function writeLiveVisitors(visitors: LiveVisitor[]): void {
  console.log('[Analytics] Writing live visitors:', visitors.length);
  
  // Always update memory
  memoryStore.liveVisitors = visitors;
  console.log('[Analytics] Updated in-memory live visitors');

  // Try to write to file
  if (ensureDataDir()) {
    try {
      fs.writeFileSync(LIVE_VISITORS_FILE, JSON.stringify(visitors, null, 2));
      console.log('[Analytics] Saved live visitors to file');
    } catch (error) {
      console.warn('[Analytics] Could not write live visitors to file:', error);
    }
  }
}

// Add a new visitor
export function addVisitor(sessionId: string, country?: string): void {
  console.log('[Analytics] Adding visitor with session:', sessionId.substring(0, 20) + '...', 'Country:', country || 'Unknown');
  
  const data = readVisitorData();
  const today = new Date().toISOString().split('T')[0];
  const countryName = country || 'Unknown';
  console.log('[Analytics] Today:', today, 'Current total:', data.totalVisitors);
  
  // Check if this session already counted today by looking at recent hourly data
  // We check if there's a data point from this session in the last hour
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentDataPoints = data.hourlyData.filter(item => {
    const itemDate = new Date(item.timestamp);
    return itemDate >= oneHourAgo;
  });
  
  // If we have recent data points, we might have already counted
  // But we'll still increment if this is a new visit (handled by cookie logic in API)
  // This function is called when we know it's a new visit
  const alreadyCountedToday = data.dailyVisitors[today] && data.dailyVisitors[today] > 0 && recentDataPoints.length > 0;
  console.log('[Analytics] Recent data points:', recentDataPoints.length, 'Already counted today?', alreadyCountedToday);

  // Always increment total and daily (API handles duplicate prevention via cookies)
  data.totalVisitors += 1;
  data.dailyVisitors[today] = (data.dailyVisitors[today] || 0) + 1;
  
  // Update country data
  data.countryData = data.countryData || {};
  data.countryData[countryName] = (data.countryData[countryName] || 0) + 1;
  console.log('[Analytics] Incremented visitor count. New total:', data.totalVisitors, 'Today:', data.dailyVisitors[today], 'Country:', countryName, 'Count:', data.countryData[countryName]);

  // Add hourly data point
  const now = new Date().toISOString();
  data.hourlyData.push({
    timestamp: now,
    count: data.totalVisitors,
    country: countryName,
  });
  console.log('[Analytics] Added hourly data point. Total data points:', data.hourlyData.length);

  // Keep only last 30 days of hourly data
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const before = data.hourlyData.length;
  data.hourlyData = data.hourlyData.filter(
    item => new Date(item.timestamp) >= thirtyDaysAgo
  );
  if (before !== data.hourlyData.length) {
    console.log('[Analytics] Cleaned up old data. Removed:', before - data.hourlyData.length, 'points');
  }

  writeVisitorData(data);
}

// Add live visitor
export function addLiveVisitor(sessionId: string): void {
  console.log('[Analytics] Adding live visitor:', sessionId.substring(0, 20) + '...');
  const visitors = readLiveVisitors();
  const existing = visitors.find(v => v.sessionId === sessionId);
  
  if (!existing) {
    visitors.push({
      sessionId,
      connectedAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
    });
    console.log('[Analytics] New live visitor added. Total live:', visitors.length);
    writeLiveVisitors(visitors);
  } else {
    // Update last activity
    existing.lastActivity = new Date().toISOString();
    console.log('[Analytics] Updated existing live visitor activity. Total live:', visitors.length);
    writeLiveVisitors(visitors);
  }
}

// Remove live visitor
export function removeLiveVisitor(sessionId: string): void {
  console.log('[Analytics] Removing live visitor:', sessionId.substring(0, 20) + '...');
  const visitors = readLiveVisitors();
  const before = visitors.length;
  const filtered = visitors.filter(v => v.sessionId !== sessionId);
  console.log('[Analytics] Removed live visitor. Before:', before, 'After:', filtered.length);
  writeLiveVisitors(filtered);
}

// Clean up stale live visitors (older than 5 minutes)
export function cleanupStaleLiveVisitors(): void {
  const visitors = readLiveVisitors();
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  const before = visitors.length;
  const active = visitors.filter(
    v => new Date(v.lastActivity) >= fiveMinutesAgo
  );
  if (before !== active.length) {
    console.log('[Analytics] Cleaned up stale live visitors. Removed:', before - active.length);
  }
  writeLiveVisitors(active);
}

