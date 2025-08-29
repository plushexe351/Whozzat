import React, { useMemo } from "react";
import { useData } from "../../Context/DataContext";
import {
  BarChart3,
  Link,
  Pin,
  FolderOpen,
  TrendingUp,
  Activity,
} from "lucide-react";
import { Line, Pie } from "react-chartjs-2";
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
} from "chart.js";

import "./QuickAnalytics.scss";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const QuickAnalytics = ({ isMobile }) => {
  const { links, categories, analytics } = useData();

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="stat-card">
      <div className="stat-icon" style={{ backgroundColor: color }}>
        <Icon size={20} className="icon" />
      </div>
      <div className="stat-content">
        <h3 className="stat-value">{value}</h3>
        <p className="stat-title">{title}</p>
        {trend && <span className="stat-trend">{trend}</span>}
      </div>
    </div>
  );

  // Chart.js Line Chart for 7-day activity
  const lineChartData = {
    labels: analytics.last7Days.map((date) => {
      const d = new Date(date);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }),
    datasets: [
      {
        label: "Links Added",
        data: analytics.dailyLinkCounts,
        borderColor: "#9f86ff",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#000000",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  const lineChartOptions = {
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

  // Chart.js Pie Chart for category distribution
  const pieChartData = {
    labels: categories.slice(0, 5).map((cat) => cat.name),
    datasets: [
      {
        data: categories
          .slice(0, 5)
          .map(
            (cat) => links.filter((link) => link.category === cat.id).length
          ),
        backgroundColor: [
          "#3b82f6",
          "#ef4444",
          "#10b981",
          "#f59e0b",
          "#8b5cf6",
        ],
        borderColor: "#ffffff",
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 15,
          usePointStyle: true,
          pointStyle: "circle",
          color: "#374151",
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
    <div className={`quick-analytics ${isMobile ? "mobile" : ""}`}>
      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-row">
          <div className="mini-chart">
            <h4>Links Added (7 Days)</h4>
            <div className="chart-container">
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
          </div>
          {/* <div className="mini-chart">
            <h4>Links by Category</h4>
            <div className="chart-container">
              <Pie data={pieChartData} options={pieChartOptions} />
            </div>
          </div> */}
        </div>
      </div>
      {/* Stats Cards */}
      <div className="stats-grid">
        <StatCard
          title="Total Links"
          value={analytics.totalLinks}
          icon={Link}
          //   color="#3b82f6"
        />
        <StatCard
          title="Pinned Links"
          value={analytics.pinnedLinks}
          icon={Pin}
          //   color="#ef4444"
        />
        <StatCard
          title="Categories"
          value={analytics.categoriesCount}
          icon={FolderOpen}
          //   color="#10b981"
        />
        <StatCard
          title="This Week"
          value={analytics.recentLinks.length}
          icon={Activity}
          //   color="#f59e0b"
          //   trend={analytics.recentLinks.length > 0 ? "new links added" : ""}
        />
      </div>

      {/* Top Pinned Links */}
      {analytics.topPinnedLinks.length > 0 && (
        <div className="pinned-links-section">
          <h3>Top Pinned Links</h3>
          <div className="pinned-links-grid">
            {analytics.topPinnedLinks.map((link, index) => (
              <div key={link.id} className="pinned-link-card">
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
                  <Link size={16} />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickAnalytics;
