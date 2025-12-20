# Analytics Implementation Guide

## Overview
A complete analytics system for tracking and displaying visitor statistics with real-time updates.

## Route Structure
```
/app/analytics/visitors/page.tsx     # Main analytics dashboard page
/app/api/analytics/track/route.ts    # POST - Track new visitors
/app/api/analytics/stats/route.ts    # GET - Fetch analytics statistics
/app/api/analytics/live/route.ts     # GET - SSE endpoint for live visitors
/components/analytics/
  ├── MetricCard.tsx                 # Animated metric cards
  └── VisitorCharts.tsx              # Chart components (Line, Bar, Area)
/lib/analytics-storage.ts            # Data persistence layer
```

## Data Flow

### 1. Visitor Tracking Flow
```
User visits /analytics/visitors
  ↓
Page loads → Calls POST /api/analytics/track
  ↓
API checks for visitor_session cookie
  ↓
If new visitor:
  - Generates session ID
  - Sets cookie (1 year expiry)
  - Increments total visitors
  - Records daily visitor count
  - Adds hourly data point
  ↓
If returning visitor:
  - Checks last_visit cookie for today
  - Only counts once per day per session
```

### 2. Statistics Retrieval Flow
```
Page loads → Calls GET /api/analytics/stats
  ↓
API reads visitor data from /data/visitors.json
  ↓
Processes data:
  - Total visitors count
  - Daily visitors (last 30 days)
  - Hourly data points (last 100)
  - Live visitor trend (last hour)
  ↓
Returns JSON with all statistics
```

### 3. Live Visitor Updates Flow
```
Page establishes SSE connection → GET /api/analytics/live
  ↓
Server:
  - Adds visitor to live visitors list
  - Sends initial live count
  - Sets interval (5 seconds) to send updates
  ↓
Client receives updates via EventSource
  ↓
Updates live visitor count in real-time
  ↓
On disconnect:
  - Removes visitor from live list
  - Cleans up interval
```

## Data Storage

### File Structure
```
/data/
  ├── visitors.json          # Total visitors, daily counts, hourly data
  └── live-visitors.json     # Currently active sessions
```

### Data Format

**visitors.json:**
```json
{
  "totalVisitors": 1234,
  "dailyVisitors": {
    "2024-01-15": 45,
    "2024-01-16": 52
  },
  "hourlyData": [
    {
      "timestamp": "2024-01-16T10:30:00.000Z",
      "count": 1234
    }
  ],
  "lastUpdated": "2024-01-16T10:30:00.000Z"
}
```

**live-visitors.json:**
```json
[
  {
    "sessionId": "1234567890-abc123",
    "connectedAt": "2024-01-16T10:30:00.000Z",
    "lastActivity": "2024-01-16T10:35:00.000Z"
  }
]
```

## Features

### ✅ Implemented
- Total visitor tracking (cookie-based, prevents duplicates)
- Live visitor tracking (real-time via SSE)
- Multiple chart types:
  - Line chart: Total visitors over time
  - Bar chart: Daily visitors
  - Area chart: Live visitor trend
- Animated metric cards with counters
- Responsive design (mobile, tablet, desktop)
- Auto-updating charts
- Data persistence (file-based, upgradeable to DB)

### 🔄 Auto-Updates
- Live visitors: Every 5 seconds via SSE
- Statistics: Every 30 seconds via API refresh
- Charts: Update automatically when data changes

## Visitor Counting Logic

1. **First Visit:**
   - No `visitor_session` cookie → New visitor
   - Creates session ID
   - Sets cookie
   - Increments total visitors

2. **Returning Visitor:**
   - Has `visitor_session` cookie
   - Checks `last_visit_YYYY-MM-DD` cookie
   - If no today cookie → Counts as new visit for today
   - If today cookie exists → Doesn't count again

3. **Live Visitors:**
   - Added when SSE connection established
   - Removed when connection closes
   - Auto-cleaned if inactive > 5 minutes

## Upgrade Path

The storage system is designed to be easily upgraded:

1. **To Database:**
   - Replace `lib/analytics-storage.ts` functions
   - Keep same interface/API
   - No changes needed in API routes or components

2. **To Redis (for live visitors):**
   - Replace live visitor functions
   - Use Redis pub/sub for real-time updates
   - Keep SSE endpoint structure

3. **To External Analytics:**
   - Add calls to external service in API routes
   - Keep local storage as backup
   - Gradual migration possible

## Environment Variables

Currently none required. Future additions:
- `ANALYTICS_DB_URL` - Database connection (if upgrading)
- `ANALYTICS_REDIS_URL` - Redis connection (if upgrading)
- `ANALYTICS_RETENTION_DAYS` - Data retention period

## Performance Considerations

- Hourly data limited to last 30 days
- Daily data limited to last 30 days
- Live visitors auto-cleaned after 5 minutes inactivity
- Charts use responsive containers
- SSE connections limited by server capacity

## Testing

To test the analytics:
1. Visit `/analytics/visitors`
2. Open in multiple tabs/browsers
3. Watch live visitor count update
4. Refresh to see total visitors increment
5. Check charts update in real-time

## Notes

- Data directory (`/data`) is gitignored
- All analytics code is isolated to `/analytics` route
- No impact on existing pages or functionality
- Uses Next.js App Router conventions
- Server-side storage (not client-side)

