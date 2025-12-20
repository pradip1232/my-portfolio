import { NextResponse } from 'next/server';
import {
  readVisitorData,
  readLiveVisitors,
  cleanupStaleLiveVisitors,
} from '@/lib/analytics-storage';

export const dynamic = 'force-dynamic';

export async function GET() {
  console.log('[API Stats] GET /api/analytics/stats called');
  console.log('[API Stats] Environment:', {
    isVercel: !!process.env.VERCEL,
    isNetlify: !!process.env.NETLIFY,
    nodeEnv: process.env.NODE_ENV,
  });

  try {
    console.log('[API Stats] Cleaning up stale live visitors...');
    cleanupStaleLiveVisitors();
    
    console.log('[API Stats] Reading visitor data...');
    const visitorData = readVisitorData();
    console.log('[API Stats] Visitor data loaded:', {
      totalVisitors: visitorData.totalVisitors,
      dailyCount: Object.keys(visitorData.dailyVisitors).length,
      hourlyDataPoints: visitorData.hourlyData.length,
    });
    
    console.log('[API Stats] Reading live visitors...');
    const liveVisitors = readLiveVisitors();
    console.log('[API Stats] Live visitors:', liveVisitors.length);

    // Process daily visitors data for bar chart
    const dailyData = Object.entries(visitorData.dailyVisitors)
      .map(([date, count]) => ({
        date,
        visitors: count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30); // Last 30 days

    console.log('[API Stats] Processed daily data:', dailyData.length, 'days');

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

    console.log('[API Stats] Processed hourly data:', hourlyData.length, 'points');

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

    console.log('[API Stats] Processed live trend data:', liveTrendData.length, 'points');

    // Process country data (ensure it exists for backward compatibility)
    const countryData = visitorData.countryData || {};
    const countryStats = Object.entries(countryData)
      .filter(([country, count]) => country && count > 0)
      .map(([country, count]) => ({
        country,
        visitors: count as number,
      }))
      .sort((a, b) => b.visitors - a.visitors); // Sort by visitor count descending

    console.log('[API Stats] Processed country data:', countryStats.length, 'countries');

    const response = {
      totalVisitors: visitorData.totalVisitors,
      liveVisitors: liveVisitors.length,
      dailyData,
      hourlyData,
      liveTrendData,
      countryData: countryStats,
      lastUpdated: visitorData.lastUpdated,
    };

    console.log('[API Stats] Returning response:', {
      totalVisitors: response.totalVisitors,
      liveVisitors: response.liveVisitors,
      dailyDataCount: response.dailyData.length,
      hourlyDataCount: response.hourlyData.length,
      countryCount: response.countryData.length,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('[API Stats] Error fetching analytics stats:', error);
    console.error('[API Stats] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack',
    });
    return NextResponse.json(
      { 
        error: 'Failed to fetch analytics',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

