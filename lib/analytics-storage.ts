import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const VISITORS_FILE = path.join(DATA_DIR, 'visitors.json');
const LIVE_VISITORS_FILE = path.join(DATA_DIR, 'live-visitors.json');

export interface VisitorData {
  totalVisitors: number;
  dailyVisitors: { [date: string]: number };
  hourlyData: { timestamp: string; count: number }[];
  lastUpdated: string;
}

export interface LiveVisitor {
  sessionId: string;
  connectedAt: string;
  lastActivity: string;
}

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Initialize default visitor data
function getDefaultVisitorData(): VisitorData {
  return {
    totalVisitors: 0,
    dailyVisitors: {},
    hourlyData: [],
    lastUpdated: new Date().toISOString(),
  };
}

// Read visitor data from file
export function readVisitorData(): VisitorData {
  ensureDataDir();
  
  if (!fs.existsSync(VISITORS_FILE)) {
    const defaultData = getDefaultVisitorData();
    writeVisitorData(defaultData);
    return defaultData;
  }

  try {
    const data = fs.readFileSync(VISITORS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading visitor data:', error);
    return getDefaultVisitorData();
  }
}

// Write visitor data to file
export function writeVisitorData(data: VisitorData): void {
  ensureDataDir();
  data.lastUpdated = new Date().toISOString();
  fs.writeFileSync(VISITORS_FILE, JSON.stringify(data, null, 2));
}

// Read live visitors
export function readLiveVisitors(): LiveVisitor[] {
  ensureDataDir();
  
  if (!fs.existsSync(LIVE_VISITORS_FILE)) {
    return [];
  }

  try {
    const data = fs.readFileSync(LIVE_VISITORS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading live visitors:', error);
    return [];
  }
}

// Write live visitors
export function writeLiveVisitors(visitors: LiveVisitor[]): void {
  ensureDataDir();
  fs.writeFileSync(LIVE_VISITORS_FILE, JSON.stringify(visitors, null, 2));
}

// Add a new visitor
export function addVisitor(sessionId: string): void {
  const data = readVisitorData();
  const today = new Date().toISOString().split('T')[0];
  
  // Check if this session already counted
  const existingSessions = new Set(
    data.hourlyData
      .filter(item => {
        const itemDate = new Date(item.timestamp).toISOString().split('T')[0];
        return itemDate === today;
      })
      .map(item => item.timestamp)
  );

  // Only increment if this is a new session today
  if (!existingSessions.has(new Date().toISOString())) {
    data.totalVisitors += 1;
    data.dailyVisitors[today] = (data.dailyVisitors[today] || 0) + 1;
  }

  // Add hourly data point
  const now = new Date().toISOString();
  data.hourlyData.push({
    timestamp: now,
    count: data.totalVisitors,
  });

  // Keep only last 30 days of hourly data
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  data.hourlyData = data.hourlyData.filter(
    item => new Date(item.timestamp) >= thirtyDaysAgo
  );

  writeVisitorData(data);
}

// Add live visitor
export function addLiveVisitor(sessionId: string): void {
  const visitors = readLiveVisitors();
  const existing = visitors.find(v => v.sessionId === sessionId);
  
  if (!existing) {
    visitors.push({
      sessionId,
      connectedAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
    });
    writeLiveVisitors(visitors);
  } else {
    // Update last activity
    existing.lastActivity = new Date().toISOString();
    writeLiveVisitors(visitors);
  }
}

// Remove live visitor
export function removeLiveVisitor(sessionId: string): void {
  const visitors = readLiveVisitors();
  const filtered = visitors.filter(v => v.sessionId !== sessionId);
  writeLiveVisitors(filtered);
}

// Clean up stale live visitors (older than 5 minutes)
export function cleanupStaleLiveVisitors(): void {
  const visitors = readLiveVisitors();
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  const active = visitors.filter(
    v => new Date(v.lastActivity) >= fiveMinutesAgo
  );
  writeLiveVisitors(active);
}

