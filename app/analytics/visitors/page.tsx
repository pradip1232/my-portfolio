"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MetricCard from "@/components/analytics/MetricCard";
import VisitorCharts from "@/components/analytics/VisitorCharts";
import CountryStats from "@/components/analytics/CountryStats";
import { Users, Eye, TrendingUp } from "lucide-react";

// Helper function to get country name from code
function getCountryName(code: string): string {
  const countryNames: { [key: string]: string } = {
    US: "United States",
    GB: "United Kingdom",
    CA: "Canada",
    AU: "Australia",
    DE: "Germany",
    FR: "France",
    IT: "Italy",
    ES: "Spain",
    NL: "Netherlands",
    BE: "Belgium",
    CH: "Switzerland",
    AT: "Austria",
    SE: "Sweden",
    NO: "Norway",
    DK: "Denmark",
    FI: "Finland",
    PL: "Poland",
    PT: "Portugal",
    GR: "Greece",
    IE: "Ireland",
    NZ: "New Zealand",
    JP: "Japan",
    CN: "China",
    KR: "South Korea",
    IN: "India",
    BR: "Brazil",
    MX: "Mexico",
    AR: "Argentina",
    CL: "Chile",
    CO: "Colombia",
    SA: "Saudi Arabia",
    AE: "UAE",
    ZA: "South Africa",
    EG: "Egypt",
    TR: "Turkey",
    RU: "Russia",
    Unknown: "Unknown",
  };
  return countryNames[code] || code;
}

interface AnalyticsData {
  totalVisitors: number;
  liveVisitors: number;
  dailyData: Array<{ date: string; visitors: number }>;
  hourlyData: Array<{
    timestamp: string;
    visitors: number;
    date: string;
    time: string;
  }>;
  liveTrendData: Array<{
    time: string;
    live: number;
    timestamp: string;
  }>;
  countryData: Array<{ country: string; visitors: number }>;
  lastUpdated: string;
}

// Mock data generator for static export
function generateMockAnalyticsData(): AnalyticsData {
  console.log('[Analytics] Generating mock analytics data for static export');
  
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  
  // Generate daily data for last 30 days
  const dailyData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toISOString().split('T')[0],
      visitors: Math.floor(Math.random() * 100) + 20
    };
  });

  // Generate hourly data for last 24 hours
  const hourlyData = Array.from({ length: 24 }, (_, i) => {
    const time = new Date(now);
    time.setHours(time.getHours() - (23 - i), 0, 0, 0);
    return {
      timestamp: time.toISOString(),
      visitors: Math.floor(Math.random() * 20) + 5,
      date: time.toISOString().split('T')[0],
      time: time.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  });

  // Generate live trend data for last 20 points
  const liveTrendData = Array.from({ length: 20 }, (_, i) => {
    const time = new Date(now);
    time.setMinutes(time.getMinutes() - (19 - i) * 5);
    return {
      time: time.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      live: Math.floor(Math.random() * 15) + 1,
      timestamp: time.toISOString()
    };
  });

  // Generate country data
  const countries = ['US', 'GB', 'CA', 'AU', 'DE', 'FR', 'IN', 'JP', 'BR', 'NL'];
  const countryData = countries.map(country => ({
    country,
    visitors: Math.floor(Math.random() * 500) + 50
  })).sort((a, b) => b.visitors - a.visitors);

  const totalVisitors = dailyData.reduce((sum, day) => sum + day.visitors, 0);
  const liveVisitors = Math.floor(Math.random() * 25) + 5;

  return {
    totalVisitors,
    liveVisitors,
    dailyData,
    hourlyData,
    liveTrendData,
    countryData,
    lastUpdated: now.toISOString()
  };
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    console.log('[Analytics Page] Component mounted on client');
    setIsClient(true);
  }, []);

  // Load analytics data
  useEffect(() => {
    if (!isClient) {
      console.log('[Analytics Page] Waiting for client hydration...');
      return;
    }

    console.log('[Analytics Page] Loading analytics data...');
    
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Check if we're in static export mode (no API routes)
        const isStaticExport = typeof window !== 'undefined' && 
          window.location.protocol === 'file:' || 
          !window.location.origin.includes('localhost:');
        
        if (isStaticExport) {
          console.log('[Analytics Page] Static export detected, using mock data');
          // Use mock data for static export
          const mockData = generateMockAnalyticsData();
          setData(mockData);
          setLoading(false);
          return;
        }

        // Try to fetch from API routes (for development)
        console.log('[Analytics Page] Attempting to fetch from API routes...');
        
        try {
          // Track visitor
          console.log('[Analytics Page] Tracking visitor...');
          await fetch("/api/analytics/track", { method: "POST" });
          
          // Fetch stats
          console.log('[Analytics Page] Fetching stats...');
          const response = await fetch("/api/analytics/stats");
          
          if (!response.ok) {
            throw new Error(`API not available: ${response.status}`);
          }
          
          const stats = await response.json();
          console.log('[Analytics Page] API data received:', stats);
          setData(stats);
          
        } catch (apiError) {
          console.log('[Analytics Page] API routes not available, using mock data');
          console.log('[Analytics Page] API Error:', apiError);
          
          // Fallback to mock data
          const mockData = generateMockAnalyticsData();
          setData(mockData);
        }
        
        setLoading(false);
        
      } catch (err) {
        console.error("[Analytics Page] Error loading data:", err);
        setError(err instanceof Error ? err.message : "Failed to load analytics");
        setLoading(false);
      }
    };

    loadData();
  }, [isClient]);

  // Simulate live updates for mock data
  useEffect(() => {
    if (!data || !isClient) return;

    console.log('[Analytics Page] Setting up live data simulation...');
    
    const interval = setInterval(() => {
      console.log('[Analytics Page] Simulating live visitor update...');
      
      setData(prev => {
        if (!prev) return null;
        
        const newLiveVisitors = Math.max(1, prev.liveVisitors + (Math.random() > 0.5 ? 1 : -1));
        
        return {
          ...prev,
          liveVisitors: newLiveVisitors,
          liveTrendData: [
            ...prev.liveTrendData.slice(-19),
            {
              time: new Date().toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              }),
              live: newLiveVisitors,
              timestamp: new Date().toISOString(),
            },
          ],
          lastUpdated: new Date().toISOString()
        };
      });
    }, 10000); // Update every 10 seconds

    return () => {
      console.log('[Analytics Page] Cleaning up live simulation');
      clearInterval(interval);
    };
  }, [data, isClient]);

  // Show loading state during hydration
  if (!isClient || loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">
              {!isClient ? 'Initializing...' : 'Loading analytics...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
          Visitor Analytics
        </h1>
        <p className="text-muted-foreground">
          Track and analyze your website visitors in real-time
        </p>
        {data.lastUpdated && (
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: {new Date(data.lastUpdated).toLocaleString()}
          </p>
        )}
      
      {/*
        <div className="mt-2 text-xs text-muted-foreground bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full inline-block">
          📊 Demo Mode: Showing simulated analytics data
        </div>
        */}
      </motion.div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <MetricCard
          title="Total Visitors"
          value={data.totalVisitors}
          icon={Users}
          color="text-blue-500"
          country={
            data.countryData && data.countryData.length > 0
              ? getCountryName(data.countryData[0].country)
              : undefined
          }
          subtitle={
            data.countryData && data.countryData.length > 0
              ? `Top: ${data.countryData[0].visitors} visitors`
              : undefined
          }
        />
        <MetricCard
          title="Live Visitors"
          value={data.liveVisitors}
          icon={Eye}
          color="text-green-500"
          subtitle="Currently active"
        />
        <MetricCard
          title="Daily Average"
          value={
            data.dailyData.length > 0
              ? Math.round(
                  data.dailyData.reduce((sum, day) => sum + day.visitors, 0) /
                    data.dailyData.length
                )
              : 0
          }
          icon={TrendingUp}
          color="text-purple-500"
          subtitle={
            data.countryData && data.countryData.length > 1
              ? `${data.countryData.length} countries`
              : undefined
          }
        />
      </div>

      {/* Charts */}
      {data.hourlyData.length > 0 || data.dailyData.length > 0 ? (
        <VisitorCharts
          hourlyData={data.hourlyData}
          dailyData={data.dailyData}
          liveTrendData={data.liveTrendData}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-muted-foreground">
            No visitor data yet. Charts will appear as visitors are tracked.
          </p>
        </motion.div>
      )}

      {/* Country Statistics */}
      {data.countryData && data.countryData.length > 0 && (
        <div className="mt-8">
          <CountryStats countryData={data.countryData} />
        </div>
      )}
    </div>
  );
}

