import React, { useState, useEffect, useMemo } from "react";
import { useData } from "../../../../Context/DataContext";
import { useAuth } from "../../../../Context/AuthContext";
import {
  BarChart3,
  Link,
  Pin,
  FolderOpen,
  Activity,
  ArrowUpRight,
  Clock,
  Eye,
  Star,
  Zap,
  Calendar,
  MousePointerClick,
  Globe,
  TrendingUp,
} from "lucide-react";
import { Line, Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js";
import LazyImage from "../../../../Components/LazyImg";
import ProfilePlaceholder from "../../../../assets/profile_placeholder.png";

import "./Analytics.scss";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const { links, categories, analytics } = useData();
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("week");
  const [heatmapData, setHeatmapData] = useState([]);
  const [deviceStats, setDeviceStats] = useState({
    mobile: Math.floor(Math.random() * 60) + 20,
    desktop: Math.floor(Math.random() * 40) + 10,
    tablet: Math.floor(Math.random() * 20) + 5,
  });

  // Get data based on time range
  const getTimeRangeData = () => {
    const now = new Date();
    const data = [];
    let days = timeRange === "week" ? 7 : timeRange === "month" ? 30 : 365;

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const count = links.filter((link) => {
        const linkDate = new Date(link.createdAt);
        return linkDate.toDateString() === date.toDateString();
      }).length;
      data.push({
        date: date.toLocaleDateString("en-US", {
          month: timeRange === "week" ? "short" : "numeric",
          day: "numeric",
          year: timeRange === "year" ? "2-digit" : undefined,
        }),
        count,
      });
    }
    return data;
  };

  // Calculate click-through rate trends
  const clickTrends = useMemo(() => {
    return links
      .map((link) => ({
        name: link.name || link.url,
        rate: Math.floor(Math.random() * 100), // Simulated CTR
      }))
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 5);
  }, [links]);

  // Generate engagement score
  const getEngagementScore = () => {
    const maxScore = 100;
    const factors = {
      totalLinks: links.length * 2,
      pinnedLinks: analytics.pinnedLinks * 3,
      categories: categories.length * 5,
      activity: analytics.recentLinks.length * 4,
    };

    const score = Object.values(factors).reduce((sum, val) => sum + val, 0);
    return Math.min(Math.round(score / 2), maxScore);
  };

  const StatCard = ({ title, value, icon: Icon, secondaryText }) => (
    <div className="stat-card">
      <div className="stat-icon">
        <Icon size={20} className="icon" stroke="#141414" />
      </div>
      <div className="stat-content">
        <h3 className="stat-value">{value}</h3>
        <p className="stat-title">{title}</p>
        {secondaryText && (
          <span className="stat-secondary">{secondaryText}</span>
        )}
      </div>
    </div>
  );

  // Activity over time chart data
  const activityChartData = {
    labels: analytics.last7Days.map((date) => {
      const d = new Date(date);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }),
    datasets: [
      {
        label: "Links Added",
        data: analytics.dailyLinkCounts,
        borderColor: "#9f86ff",
        backgroundColor: "rgba(159, 134, 255, 0.1)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#9f86ff",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  // Category distribution chart data
  const categoryChartData = {
    labels: categories.map((cat) => cat.name),
    datasets: [
      {
        data: categories.map(
          (cat) => links.filter((link) => link.category === cat.id).length
        ),
        backgroundColor: [
          "#3b82f6",
          "#ef4444",
          "#10b981",
          "#f59e0b",
          "#8b5cf6",
          "#ec4899",
          "#6366f1",
        ],
        borderColor: "#ffffff",
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  // Links per day of week chart data
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const linksPerDay = new Array(7).fill(0);

  links.forEach((link) => {
    const date = new Date(link.createdAt);
    linksPerDay[date.getDay()]++;
  });

  const weekdayActivityData = {
    labels: daysOfWeek,
    datasets: [
      {
        label: "Links Created",
        data: linksPerDay,
        backgroundColor: "#8b5cf6",
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "rgba(163, 163, 163, 0.4)",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#64748b",
          font: {
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: "#64748b",
          font: {
            size: 11,
          },
          stepSize: 1,
        },
        beginAtZero: true,
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          padding: 15,
          usePointStyle: true,
          pointStyle: "circle",
          color: "#64748b",
          font: {
            size: 11,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "#3b82f6",
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function (context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} links (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="Analytics">
      <header>
        <div className="header-content">
          <div className="profile">
            <img
              src={user?.profileURL || ProfilePlaceholder}
              className="profile-img"
            />
            <div className="user-info">
              <h1>
                {user?.displayName}'s Analytics <BarChart3 stroke="#e3dcff" />{" "}
              </h1>
              <p>View detailed statistics and insights about your links</p>
            </div>
          </div>
        </div>
      </header>

      <div className="analytics-content">
        {/* Quick Stats */}
        <div className="stats-section">
          <h2>Overview</h2>
          <div className="stats-grid">
            <StatCard
              title="Total Links"
              value={analytics.totalLinks}
              icon={Link}
              secondaryText="All time"
            />
            <StatCard
              title="Active Links"
              value={links.filter((link) => !link.hidden).length}
              icon={Eye}
              secondaryText="Currently visible"
            />
            <StatCard
              title="Pinned Links"
              value={analytics.pinnedLinks}
              icon={Pin}
              secondaryText="Featured links"
            />
            <StatCard
              title="Categories"
              value={analytics.categoriesCount}
              icon={FolderOpen}
              secondaryText="Link organization"
            />
            <StatCard
              title="This Week"
              value={analytics.recentLinks.length}
              icon={Activity}
              secondaryText="Recently added"
            />
            <StatCard
              title="Most Active Category"
              value={analytics.mostPopularCategory?.name || "None"}
              icon={Star}
              secondaryText={`${
                analytics.mostPopularCategory?.linkCount || 0
              } links`}
            />
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="chart-grid">
            {/* Activity Timeline */}
            <div className="chart-card activity-chart">
              <div className="chart-header">
                <h3>
                  <Clock size={18} />
                  Activity Timeline
                </h3>
                <div className="time-range-controls">
                  <button
                    className={timeRange === "week" ? "active" : ""}
                    onClick={() => setTimeRange("week")}
                  >
                    Week
                  </button>
                  <button
                    className={timeRange === "month" ? "active" : ""}
                    onClick={() => setTimeRange("month")}
                  >
                    Month
                  </button>
                  <button
                    className={timeRange === "year" ? "active" : ""}
                    onClick={() => setTimeRange("year")}
                  >
                    Year
                  </button>
                </div>
              </div>
              <div className="chart-container">
                <Line
                  data={{
                    labels: getTimeRangeData().map((d) => d.date),
                    datasets: [
                      {
                        label: "Links Added",
                        data: getTimeRangeData().map((d) => d.count),
                        borderColor: "#9f86ff",
                        backgroundColor: "rgba(159, 134, 255, 0.1)",
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: "#9f86ff",
                        pointBorderColor: "#ffffff",
                        pointBorderWidth: 2,
                        pointRadius: 4,
                      },
                    ],
                  }}
                  options={chartOptions}
                />
              </div>
            </div>

            {/* Category Distribution */}
            <div className="chart-card category-chart">
              <h3>
                <FolderOpen size={18} />
                Category Distribution
              </h3>
              <div className="chart-container">
                <Pie data={categoryChartData} options={pieChartOptions} />
              </div>
            </div>

            {/* Weekly Pattern */}
            <div className="chart-card weekly-chart">
              <h3>
                <BarChart3 size={18} />
                Weekly Pattern
              </h3>
              <div className="chart-container">
                <Bar data={weekdayActivityData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="engagement-section">
          <h2>Engagement Metrics</h2>
          <div className="metrics-grid">
            <div className="metric-card engagement-score">
              <div className="score-ring">
                <svg viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#eee"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#9f86ff"
                    strokeWidth="3"
                    strokeDasharray={`${getEngagementScore()}, 100`}
                  />
                </svg>
                <div className="score-value">
                  <h3>{getEngagementScore()}</h3>
                  <p>Engagement Score</p>
                </div>
              </div>
              <div className="score-details">
                <p>
                  Based on link activity, categories, and overall engagement
                </p>
              </div>
            </div>

            <div className="metric-card device-breakdown">
              <h3>
                <Globe size={18} /> Traffic by Device
              </h3>
              <div className="device-stats">
                <div className="device-stat">
                  <div className="stat-bar">
                    <div
                      className="bar-fill"
                      style={{ width: `${deviceStats.mobile}%` }}
                    ></div>
                  </div>
                  <div className="stat-label">
                    <span>Mobile</span>
                    <span>{deviceStats.mobile}%</span>
                  </div>
                </div>
                <div className="device-stat">
                  <div className="stat-bar">
                    <div
                      className="bar-fill"
                      style={{ width: `${deviceStats.desktop}%` }}
                    ></div>
                  </div>
                  <div className="stat-label">
                    <span>Desktop</span>
                    <span>{deviceStats.desktop}%</span>
                  </div>
                </div>
                <div className="device-stat">
                  <div className="stat-bar">
                    <div
                      className="bar-fill"
                      style={{ width: `${deviceStats.tablet}%` }}
                    ></div>
                  </div>
                  <div className="stat-label">
                    <span>Tablet</span>
                    <span>{deviceStats.tablet}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="metric-card click-through">
              <h3>
                <MousePointerClick size={18} /> Top Performing Links
              </h3>
              <div className="ctr-list">
                {clickTrends.map((link, index) => (
                  <div key={index} className="ctr-item">
                    <div className="link-info">
                      <span className="link-name">{link.name}</span>
                      <span className="ctr-rate">{link.rate}% CTR</span>
                    </div>
                    <div className="ctr-bar">
                      <div
                        className="bar-fill"
                        style={{ width: `${link.rate}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top Links Section */}
        {analytics.topPinnedLinks.length > 0 && (
          <div className="top-links-section">
            <h2>Top Pinned Links</h2>
            <div className="links-grid">
              {analytics.topPinnedLinks.map((link, index) => (
                <div key={link.id} className="link-card">
                  <div className="link-rank">#{index + 1}</div>
                  <div className="link-content">
                    <h4>{link.name || link.url}</h4>
                    <p>{link.description || link.url}</p>
                  </div>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-button"
                  >
                    <ArrowUpRight size={16} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
