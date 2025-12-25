"use client";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, TrendingUp, Users, ChevronUp, ChevronDown } from "lucide-react";
import { useState, useMemo } from "react";

interface CountryData {
  country: string;
  visitors: number;
}

interface CountryStatsProps {
  countryData: CountryData[];
}

// Color palette for charts
const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--primary))",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#00ff00",
  "#0088fe",
  "#00c49f",
  "#ffbb28",
];

// Get country name from code (simplified mapping)
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

export default function CountryStats({ countryData }: CountryStatsProps) {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showAll, setShowAll] = useState(false);

  const chartAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  // Prepare data with country names and calculate totals
  const chartData = useMemo(() => {
    const data = countryData.map((item) => ({
      ...item,
      name: getCountryName(item.country),
    }));

    const total = data.reduce((sum, c) => sum + c.visitors, 0);

    return data.map((item) => ({
      ...item,
      percentage: total > 0 ? (item.visitors / total) * 100 : 0,
    }));
  }, [countryData]);

  // Sort data
  const sortedData = useMemo(() => {
    const sorted = [...chartData].sort((a, b) => {
      return sortOrder === "desc" ? b.visitors - a.visitors : a.visitors - b.visitors;
    });
    return sorted;
  }, [chartData, sortOrder]);

  // Top countries for display
  const displayCountries = useMemo(() => {
    return showAll ? sortedData : sortedData.slice(0, 12);
  }, [sortedData, showAll]);

  // Top 10 countries for pie chart
  const topCountries = useMemo(() => {
    return chartData.slice(0, 10);
  }, [chartData]);

  const totalVisitors = useMemo(() => {
    return chartData.reduce((sum, c) => sum + c.visitors, 0);
  }, [chartData]);

  if (!countryData || countryData.length === 0) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={chartAnimation}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Country Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">
              No country data available yet.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Country Cards Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={chartAnimation}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Top Countries
              </CardTitle>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                  className="p-2 rounded-md hover:bg-accent transition-colors"
                  title={`Sort ${sortOrder === "desc" ? "Ascending" : "Descending"}`}
                >
                  {sortOrder === "desc" ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronUp className="h-4 w-4" />
                  )}
                </button>
                {sortedData.length > 12 && (
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showAll ? "Show Less" : `Show All (${sortedData.length})`}
                  </button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              <motion.div
                key={sortOrder + showAll}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                {displayCountries.map((item, index) => {
                  const isSelected = selectedCountry === item.country;
                  const maxVisitors = Math.max(...sortedData.map(c => c.visitors));
                  const progressWidth = (item.visitors / maxVisitors) * 100;

                  return (
                    <motion.div
                      key={item.country}
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ 
                        delay: index * 0.03,
                        type: "spring",
                        stiffness: 100
                      }}
                      whileHover={{ 
                        scale: 1.05,
                        y: -4,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedCountry(isSelected ? null : item.country)}
                      className={`
                        relative p-4 border rounded-lg cursor-pointer transition-all duration-300
                        ${isSelected 
                          ? "border-primary bg-primary/5 shadow-lg shadow-primary/20" 
                          : "hover:border-primary/50 hover:bg-accent/50 hover:shadow-md"
                        }
                      `}
                    >
                      {/* Progress bar background */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted rounded-b-lg overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progressWidth}%` }}
                          transition={{ delay: index * 0.03 + 0.2, duration: 0.5 }}
                          className={`h-full ${
                            isSelected ? "bg-primary" : "bg-primary/60"
                          }`}
                        />
                      </div>

                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-sm truncate">{item.name}</p>
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="h-2 w-2 rounded-full bg-primary"
                              />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            {item.country}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <TrendingUp className="h-3 w-3" />
                            <span>{item.percentage.toFixed(1)}%</span>
                          </div>
                        </div>
                        <div className="text-right ml-2">
                          <motion.p
                            key={item.visitors}
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                            className="text-2xl font-bold"
                          >
                            {item.visitors.toLocaleString()}
                          </motion.p>
                          <p className="text-xs text-muted-foreground">visitors</p>
                        </div>
                      </div>

                      {/* Hover effect overlay */}
                      <motion.div
                        className="absolute inset-0 bg-primary/5 rounded-lg opacity-0"
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bar Chart - Country Visitors */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={chartAnimation}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Visitors by Country</CardTitle>
              {selectedCountry && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <span>Selected: {getCountryName(selectedCountry)}</span>
                  <button
                    onClick={() => setSelectedCountry(null)}
                    className="text-xs hover:text-foreground transition-colors"
                  >
                    Clear
                  </button>
                </motion.div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={chartData.slice(0, 15)}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                onClick={(data: any) => {
                  if (data && data.activePayload) {
                    const country = data.activePayload[0]?.payload?.country;
                    setSelectedCountry(country === selectedCountry ? null : country);
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="name"
                  className="text-xs"
                  tick={{ fill: "currentColor" }}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: "currentColor" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                  cursor={{ fill: "hsl(var(--primary))", opacity: 0.1 }}
                />
                <Legend />
                <Bar
                  dataKey="visitors"
                  fill="hsl(var(--primary))"
                  name="Visitors"
                  radius={[8, 8, 0, 0]}
                  animationDuration={800}
                  animationBegin={0}
                >
                  {chartData.slice(0, 15).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill="hsl(var(--primary))"
                      opacity={entry.country === selectedCountry ? 1 : 0.6}
                      style={{
                        cursor: "pointer",
                        filter: entry.country === selectedCountry ? "brightness(1.2)" : "none",
                        transition: "all 0.3s ease",
                      }}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Pie Chart - Top Countries */}
      {topCountries.length > 0 && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={chartAnimation}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Top Countries Distribution</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Total: {totalVisitors.toLocaleString()}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={topCountries}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(props: any) => {
                      const { name, percent, payload } = props;
                      const visitors = payload?.visitors || 0;
                      return `${name}\n${(percent * 100).toFixed(1)}% (${visitors})`;
                    }}
                    outerRadius={selectedCountry ? 140 : 120}
                    innerRadius={selectedCountry ? 60 : 40}
                    fill="#8884d8"
                    dataKey="visitors"
                    animationBegin={0}
                    animationDuration={800}
                    onClick={(data: any) => {
                      if (data && data.country) {
                        setSelectedCountry(data.country === selectedCountry ? null : data.country);
                      }
                    }}
                  >
                    {topCountries.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke={entry.country === selectedCountry ? "hsl(var(--primary))" : "none"}
                        strokeWidth={entry.country === selectedCountry ? 3 : 0}
                        style={{
                          cursor: "pointer",
                          filter: entry.country === selectedCountry ? "brightness(1.1)" : "none",
                          transition: "all 0.3s ease",
                        }}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                    formatter={(value: any, name: any, props: any) => [
                      `${(value || 0).toLocaleString()} visitors (${(((value || 0) / totalVisitors) * 100).toFixed(1)}%)`,
                      props.payload.name,
                    ]}
                  />
                  <Legend
                    formatter={(value, entry: any) => (
                      <span
                        style={{
                          color: entry.country === selectedCountry ? "hsl(var(--primary))" : "inherit",
                          fontWeight: entry.country === selectedCountry ? "bold" : "normal",
                        }}
                      >
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

