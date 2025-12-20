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

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Track visitor on page load
  useEffect(() => {
    console.log('[Analytics Page] Component mounted, tracking visitor...');
    const trackVisitor = async () => {
      try {
        console.log('[Analytics Page] Calling POST /api/analytics/track');
        const response = await fetch("/api/analytics/track", {
          method: "POST",
        });
        const result = await response.json();
        console.log('[Analytics Page] Track response:', result);
      } catch (err) {
        console.error("[Analytics Page] Error tracking visitor:", err);
      }
    };

    trackVisitor();
  }, []);

  // Fetch initial stats
  useEffect(() => {
    console.log('[Analytics Page] Fetching initial stats...');
    const fetchStats = async () => {
      try {
        console.log('[Analytics Page] Calling GET /api/analytics/stats');
        const response = await fetch("/api/analytics/stats");
        console.log('[Analytics Page] Stats response status:', response.status, response.ok);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('[Analytics Page] Stats response error:', errorText);
          throw new Error(`Failed to fetch stats: ${response.status} ${errorText}`);
        }
        
        const stats = await response.json();
        console.log('[Analytics Page] Stats received:', {
          totalVisitors: stats.totalVisitors,
          liveVisitors: stats.liveVisitors,
          dailyDataCount: stats.dailyData?.length || 0,
          hourlyDataCount: stats.hourlyData?.length || 0,
        });
        
        setData(stats);
        setLoading(false);
      } catch (err) {
        console.error("[Analytics Page] Error fetching stats:", err);
        setError(err instanceof Error ? err.message : "Failed to load analytics");
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Set up SSE for live visitor updates
  useEffect(() => {
    if (!data) {
      console.log('[Analytics Page] No data yet, skipping SSE setup');
      return;
    }

    console.log('[Analytics Page] Setting up SSE connection...');
    const eventSource = new EventSource("/api/analytics/live");

    eventSource.onopen = () => {
      console.log('[Analytics Page] SSE connection opened');
    };

    eventSource.onmessage = (event) => {
      try {
        console.log('[Analytics Page] SSE message received:', event.data);
        const { liveVisitors } = JSON.parse(event.data);
        console.log('[Analytics Page] Live visitors update:', liveVisitors);
        
        setData((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            liveVisitors,
            // Update live trend data
            liveTrendData: [
              ...prev.liveTrendData.slice(-19), // Keep last 19 points
              {
                time: new Date().toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                live: liveVisitors,
                timestamp: new Date().toISOString(),
              },
            ],
          };
        });
      } catch (err) {
        console.error("[Analytics Page] Error parsing SSE data:", err);
      }
    };

    eventSource.onerror = (error) => {
      console.error("[Analytics Page] SSE error:", error);
      console.log("[Analytics Page] Closing SSE connection due to error");
      eventSource.close();
    };

    return () => {
      console.log('[Analytics Page] Cleaning up SSE connection');
      eventSource.close();
    };
  }, [data]);

  // Refresh stats periodically
  useEffect(() => {
    console.log('[Analytics Page] Setting up periodic stats refresh (30s interval)');
    const interval = setInterval(async () => {
      try {
        console.log('[Analytics Page] Periodic stats refresh...');
        const response = await fetch("/api/analytics/stats");
        if (response.ok) {
          const stats = await response.json();
          console.log('[Analytics Page] Periodic stats update received');
          setData((prev) => {
            if (!prev) return stats;
            return {
              ...stats,
              liveVisitors: prev.liveVisitors, // Preserve live count from SSE
            };
          });
        } else {
          console.warn('[Analytics Page] Periodic stats refresh failed:', response.status);
        }
      } catch (err) {
        console.error("[Analytics Page] Error refreshing stats:", err);
      }
    }, 30000); // Refresh every 30 seconds

    return () => {
      console.log('[Analytics Page] Cleaning up periodic refresh');
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading analytics...</p>
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

