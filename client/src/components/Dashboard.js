import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import { reportService } from '../services/api';
import '../styles/Dashboard.css';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
  ArcElement, PointElement, LineElement
);

function StatCard({ title, value, subtitle, icon, color }) {
  return (
    <div className={`stat-card stat-card-${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <h3 className="stat-value">{value}</h3>
        <p className="stat-title">{title}</p>
        {subtitle && <p className="stat-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
}

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await reportService.getDashboard();
        setData(response.data);
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="page-loading"><div className="spinner"></div></div>;
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  const branchChartData = {
    labels: data?.branchStats?.map(b => b._id) || [],
    datasets: [
      {
        label: 'Total Students',
        data: data?.branchStats?.map(b => b.total) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1
      },
      {
        label: 'Placed Students',
        data: data?.branchStats?.map(b => b.placed) || [],
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1
      }
    ]
  };

  const placementPieData = {
    labels: ['Placed', 'Not Placed'],
    datasets: [{
      data: [data?.summary?.placedStudents || 0, data?.summary?.notPlacedStudents || 0],
      backgroundColor: ['rgba(16, 185, 129, 0.8)', 'rgba(239, 68, 68, 0.8)'],
      borderColor: ['rgba(16, 185, 129, 1)', 'rgba(239, 68, 68, 1)'],
      borderWidth: 2
    }]
  };

  const companyChartData = {
    labels: data?.companyStats?.map(c => c.companyName) || [],
    datasets: [{
      label: 'Students Placed',
      data: data?.companyStats?.map(c => c.studentsPlaced) || [],
      backgroundColor: 'rgba(139, 92, 246, 0.7)',
      borderColor: 'rgba(139, 92, 246, 1)',
      borderWidth: 1
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: false }
    }
  };

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Placement Dashboard</h1>
        <p>Overview of placement statistics and analytics</p>
      </div>

      {/* Summary Stats */}
      <div className="stats-grid">
        <StatCard
          title="Total Students"
          value={data?.summary?.totalStudents || 0}
          icon="👥"
          color="blue"
        />
        <StatCard
          title="Placed Students"
          value={data?.summary?.placedStudents || 0}
          subtitle={`${data?.summary?.placementPercentage || 0}% placement rate`}
          icon="🎯"
          color="green"
        />
        <StatCard
          title="Not Placed"
          value={data?.summary?.notPlacedStudents || 0}
          icon="⏳"
          color="orange"
        />
        <StatCard
          title="Companies Visited"
          value={data?.summary?.totalCompanies || 0}
          icon="🏢"
          color="purple"
        />
        <StatCard
          title="Total Placements"
          value={data?.summary?.totalPlacements || 0}
          icon="📋"
          color="teal"
        />
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3 className="chart-title">Branch-wise Placement Statistics</h3>
          <Bar data={branchChartData} options={chartOptions} />
        </div>

        <div className="chart-card chart-card-small">
          <h3 className="chart-title">Placement Overview</h3>
          <Doughnut data={placementPieData} options={{ ...chartOptions, cutout: '60%' }} />
          <div className="placement-rate-text">
            <span className="rate-value">{data?.summary?.placementPercentage || 0}%</span>
            <span className="rate-label">Placement Rate</span>
          </div>
        </div>

        {data?.companyStats?.length > 0 && (
          <div className="chart-card">
            <h3 className="chart-title">Top Companies by Students Placed</h3>
            <Bar
              data={companyChartData}
              options={{
                ...chartOptions,
                indexAxis: 'y'
              }}
            />
          </div>
        )}
      </div>

      {/* Branch Stats Table */}
      {data?.branchStats?.length > 0 && (
        <div className="table-card">
          <h3 className="table-title">Branch-wise Placement Details</h3>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Branch</th>
                  <th>Total Students</th>
                  <th>Placed</th>
                  <th>Not Placed</th>
                  <th>Placement %</th>
                </tr>
              </thead>
              <tbody>
                {data.branchStats.map((branch) => (
                  <tr key={branch._id}>
                    <td><span className="branch-badge">{branch._id}</span></td>
                    <td>{branch.total}</td>
                    <td className="text-green">{branch.placed}</td>
                    <td className="text-red">{branch.total - branch.placed}</td>
                    <td>
                      <div className="progress-wrapper">
                        <div
                          className="progress-bar"
                          style={{ width: `${branch.total > 0 ? (branch.placed / branch.total) * 100 : 0}%` }}
                        ></div>
                        <span className="progress-text">
                          {branch.total > 0 ? ((branch.placed / branch.total) * 100).toFixed(1) : 0}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Company Stats Table */}
      {data?.companyStats?.length > 0 && (
        <div className="table-card">
          <h3 className="table-title">Company Recruitment Statistics</h3>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Students Placed</th>
                  <th>Average Package (LPA)</th>
                  <th>Highest Package (LPA)</th>
                </tr>
              </thead>
              <tbody>
                {data.companyStats.map((company, index) => (
                  <tr key={index}>
                    <td>{company.companyName}</td>
                    <td>{company.studentsPlaced}</td>
                    <td>{company.avgPackage}</td>
                    <td>{company.maxPackage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
