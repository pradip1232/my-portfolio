"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MetricCard from "@/components/analytics/MetricCard";
import VisitorCharts from "@/components/analytics/VisitorCharts";
import { Users, Eye, TrendingUp } from "lucide-react";

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
  lastUpdated: string;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Track visitor on page load
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        await fetch("/api/analytics/track", {
          method: "POST",
        });
      } catch (err) {
        console.error("Error tracking visitor:", err);
      }
    };

    trackVisitor();
  }, []);

  // Fetch initial stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/analytics/stats");
        if (!response.ok) throw new Error("Failed to fetch stats");
        const stats = await response.json();
        setData(stats);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load analytics");
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Set up SSE for live visitor updates
  useEffect(() => {
    if (!data) return;

    const eventSource = new EventSource("/api/analytics/live");

    eventSource.onmessage = (event) => {
      try {
        const { liveVisitors } = JSON.parse(event.data);
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
        console.error("Error parsing SSE data:", err);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [data]);

  // Refresh stats periodically
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch("/api/analytics/stats");
        if (response.ok) {
          const stats = await response.json();
          setData((prev) => {
            if (!prev) return stats;
            return {
              ...stats,
              liveVisitors: prev.liveVisitors, // Preserve live count from SSE
            };
          });
        }
      } catch (err) {
        console.error("Error refreshing stats:", err);
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
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
        />
        <MetricCard
          title="Live Visitors"
          value={data.liveVisitors}
          icon={Eye}
          color="text-green-500"
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
    </div>
  );
}

