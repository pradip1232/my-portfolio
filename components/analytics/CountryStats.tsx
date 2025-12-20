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
import { motion } from "framer-motion";
import { Globe } from "lucide-react";

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
  const chartAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

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

  // Prepare data with country names
  const chartData = countryData.map((item) => ({
    ...item,
    name: getCountryName(item.country),
  }));

  // Top 10 countries for pie chart
  const topCountries = chartData.slice(0, 10);

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
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Top Countries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {chartData.slice(0, 12).map((item, index) => (
                <motion.div
                  key={item.country}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.country}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{item.visitors}</p>
                      <p className="text-xs text-muted-foreground">
                        {((item.visitors / chartData.reduce((sum, c) => sum + c.visitors, 0)) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
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
            <CardTitle>Visitors by Country</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={chartData.slice(0, 15)}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
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
                  }}
                />
                <Legend />
                <Bar
                  dataKey="visitors"
                  fill="hsl(var(--primary))"
                  name="Visitors"
                  radius={[8, 8, 0, 0]}
                />
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
              <CardTitle>Top Countries Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={topCountries}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="visitors"
                  >
                    {topCountries.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

