import React, { useState, useEffect } from 'react';
import { reportService } from '../services/api';
import '../styles/Reports.css';

const BRANCHES = ['CSE', 'ISE', 'ECE', 'EEE', 'ME', 'CE', 'AIML', 'AIDS', 'CSD'];

function Reports() {
  const [placements, setPlacements] = useState([]);
  const [branchReport, setBranchReport] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('placements');

  useEffect(() => {
    fetchPlacements();
  }, []);

  const fetchPlacements = async () => {
    setLoading(true);
    try {
      const response = await reportService.exportPlacements();
      setPlacements(response.data);
    } catch (err) {
      console.error('Error fetching placements:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBranchReport = async (branch) => {
    if (!branch) return;
    setLoading(true);
    try {
      const response = await reportService.getBranchReport(branch);
      setBranchReport(response.data);
    } catch (err) {
      console.error('Error fetching branch report:', err);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) {
      alert('No data to export.');
      return;
    }
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row =>
        headers.map(h => {
          const val = row[h] !== null && row[h] !== undefined ? row[h] : '';
          return `"${String(val).replace(/"/g, '""')}"`;
        }).join(',')
      )
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
      const response = await reportService.exportPlacements();
      exportToCSV(response.data, 'placement_report.csv');
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="reports-page">
      <div className="page-header">
        <div>
          <h1>Reports</h1>
          <p>Detailed placement reports and analytics</p>
        </div>
        <button
          className="btn-primary export-btn"
          onClick={handleExport}
          disabled={exportLoading}
        >
          {exportLoading ? <span className="btn-spinner"></span> : '📥 Export to CSV'}
        </button>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'placements' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('placements')}
        >
          All Placement Records
        </button>
        <button
          className={`tab ${activeTab === 'branch' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('branch')}
        >
          Branch Report
        </button>
      </div>

      {activeTab === 'placements' && (
        <div className="report-section">
          <div className="section-header">
            <h2>Complete Placement Records</h2>
            <span className="record-count">{placements.length} records</span>
          </div>

          {loading ? (
            <div className="page-loading"><div className="spinner"></div></div>
          ) : placements.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <h3>No Placement Records</h3>
              <p>Placement records will appear here once students are placed.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>USN</th>
                    <th>Student Name</th>
                    <th>Branch</th>
                    <th>Batch</th>
                    <th>CGPA</th>
                    <th>Company</th>
                    <th>Job Profile</th>
                    <th>Package (LPA)</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {placements.map((record, index) => (
                    <tr key={index}>
                      <td>{record.usn}</td>
                      <td>{record.studentName}</td>
                      <td><span className="branch-badge">{record.branch}</span></td>
                      <td>{record.batch}</td>
                      <td>{record.cgpa}</td>
                      <td>{record.company}</td>
                      <td>{record.jobProfile || 'N/A'}</td>
                      <td className="text-green font-bold">{record.package} {record.packageCurrency}</td>
                      <td>{record.location || 'N/A'}</td>
                      <td>
                        <span className={`status-chip status-${record.status?.replace(/\s+/g, '-').toLowerCase()}`}>
                          {record.status}
                        </span>
                      </td>
                      <td>{record.placementDate ? new Date(record.placementDate).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'branch' && (
        <div className="report-section">
          <div className="branch-selector">
            <label className="form-label">Select Branch</label>
            <select
              className="form-input branch-select"
              value={selectedBranch}
              onChange={(e) => {
                setSelectedBranch(e.target.value);
                fetchBranchReport(e.target.value);
              }}
            >
              <option value="">-- Select a Branch --</option>
              {BRANCHES.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {loading && <div className="page-loading"><div className="spinner"></div></div>}

          {!loading && branchReport && (
            <>
              <div className="branch-report-summary">
                <div className="summary-stat">
                  <span className="summary-value">{branchReport.totalStudents}</span>
                  <span className="summary-label">Total Students</span>
                </div>
                <div className="summary-stat">
                  <span className="summary-value text-green">{branchReport.placedStudents}</span>
                  <span className="summary-label">Placed</span>
                </div>
                <div className="summary-stat">
                  <span className="summary-value text-red">
                    {branchReport.totalStudents - branchReport.placedStudents}
                  </span>
                  <span className="summary-label">Not Placed</span>
                </div>
                <div className="summary-stat">
                  <span className="summary-value text-blue">{branchReport.placementPercentage}%</span>
                  <span className="summary-label">Placement Rate</span>
                </div>
              </div>

              {branchReport.students.length > 0 && (
                <div className="table-section">
                  <h3>Student List - {branchReport.branch}</h3>
                  <div className="table-responsive">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>USN</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>CGPA</th>
                          <th>Batch</th>
                          <th>Placement Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {branchReport.students.map((student) => (
                          <tr key={student._id}>
                            <td>{student.usn}</td>
                            <td>{student.name}</td>
                            <td>{student.email}</td>
                            <td>{student.phone}</td>
                            <td>{student.cgpa || 'N/A'}</td>
                            <td>{student.batch}</td>
                            <td>
                              <span className={`status-chip ${student.placementStatus !== 'Not Placed' ? 'status-placed' : 'status-not-placed'}`}>
                                {student.placementStatus}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <button
                    className="btn-secondary export-branch-btn"
                    onClick={() => exportToCSV(
                      branchReport.students.map(s => ({
                        USN: s.usn, Name: s.name, Email: s.email,
                        Phone: s.phone, Branch: s.branch, Batch: s.batch,
                        CGPA: s.cgpa, Status: s.placementStatus
                      })),
                      `${branchReport.branch}_students.csv`
                    )}
                  >
                    📥 Export {branchReport.branch} Students
                  </button>
                </div>
              )}
            </>
          )}

          {!loading && !branchReport && selectedBranch && (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No data for {selectedBranch}</h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Reports;
