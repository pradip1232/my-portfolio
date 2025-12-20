import { NextResponse } from 'next/server';
import {
  readVisitorData,
  readLiveVisitors,
  cleanupStaleLiveVisitors,
} from '@/lib/analytics-storage';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    cleanupStaleLiveVisitors();
    
    const visitorData = readVisitorData();
    const liveVisitors = readLiveVisitors();

    // Process daily visitors data for bar chart
    const dailyData = Object.entries(visitorData.dailyVisitors)
      .map(([date, count]) => ({
        date,
        visitors: count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30); // Last 30 days

    // Process hourly data for line chart
    const hourlyData = visitorData.hourlyData
      .map(item => ({
        timestamp: item.timestamp,
        visitors: item.count,
        date: new Date(item.timestamp).toLocaleDateString(),
        time: new Date(item.timestamp).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      }))
      .slice(-100); // Last 100 data points

    // Process live visitor trend (last hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const liveTrendData = visitorData.hourlyData
      .filter(item => new Date(item.timestamp) >= oneHourAgo)
      .map((item, index) => ({
        time: new Date(item.timestamp).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        live: liveVisitors.length, // Current live count
        timestamp: item.timestamp,
      }));

    return NextResponse.json({
      totalVisitors: visitorData.totalVisitors,
      liveVisitors: liveVisitors.length,
      dailyData,
      hourlyData,
      liveTrendData,
      lastUpdated: visitorData.lastUpdated,
    });
  } catch (error) {
    console.error('Error fetching analytics stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

