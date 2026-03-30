import React, { useState, useEffect } from 'react';
import { companyService } from '../services/api';
import '../styles/CompanyProfiles.css';

function CompanyProfiles() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await companyService.getAll();
        setCompanies(response.data);
      } catch (err) {
        console.error('Error fetching companies:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(search.toLowerCase()) ||
    (company.industry && company.industry.toLowerCase().includes(search.toLowerCase())) ||
    (company.jobProfile && company.jobProfile.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return <div className="page-loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="companies-page">
      <div className="page-header">
        <h1>Company Profiles</h1>
        <p>Explore companies visiting for campus recruitment</p>
      </div>

      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search by company name, industry, or job profile..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {filteredCompanies.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🏢</div>
          <h3>{search ? 'No companies match your search' : 'No Companies Listed Yet'}</h3>
          <p>{search ? 'Try a different search term.' : 'Company profiles will appear here once added by the placement cell.'}</p>
        </div>
      ) : (
        <div className="companies-grid">
          {filteredCompanies.map((company) => (
            <div
              key={company._id}
              className="company-card"
              onClick={() => setSelectedCompany(company)}
            >
              <div className="company-card-header">
                <div className="company-logo">
                  {company.logoUrl ? (
                    <img src={company.logoUrl} alt={company.name} />
                  ) : (
                    <span className="company-initial">{company.name.charAt(0)}</span>
                  )}
                </div>
                <div className="company-basic-info">
                  <h3>{company.name}</h3>
                  <p className="company-industry">{company.industry || 'Technology'}</p>
                </div>
              </div>

              <div className="company-card-body">
                {company.jobProfile && (
                  <div className="company-detail">
                    <span className="detail-icon">💼</span>
                    <span>{company.jobProfile}</span>
                  </div>
                )}
                {company.location && (
                  <div className="company-detail">
                    <span className="detail-icon">📍</span>
                    <span>{company.location}</span>
                  </div>
                )}
                <div className="company-detail">
                  <span className="detail-icon">💰</span>
                  <span>
                    {company.salaryPackage?.minimum || 0} - {company.salaryPackage?.maximum || 0} {company.salaryPackage?.currency || 'LPA'}
                  </span>
                </div>
                {company.minimumCGPA && (
                  <div className="company-detail">
                    <span className="detail-icon">📊</span>
                    <span>Min CGPA: {company.minimumCGPA}</span>
                  </div>
                )}
              </div>

              {company.eligibleBranches && company.eligibleBranches.length > 0 && (
                <div className="eligible-branches">
                  {company.eligibleBranches.map((branch) => (
                    <span key={branch} className="branch-tag">{branch}</span>
                  ))}
                </div>
              )}

              <div className="company-card-footer">
                {company.recruitmentPeriod?.start && (
                  <span className="recruitment-period">
                    📅 {new Date(company.recruitmentPeriod.start).toLocaleDateString()} -{' '}
                    {new Date(company.recruitmentPeriod.end).toLocaleDateString()}
                  </span>
                )}
                <button className="btn-secondary btn-sm">View Details</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Company Detail Modal */}
      {selectedCompany && (
        <div className="modal-overlay" onClick={() => setSelectedCompany(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedCompany(null)}>✕</button>

            <div className="modal-header">
              <div className="company-logo large">
                {selectedCompany.logoUrl ? (
                  <img src={selectedCompany.logoUrl} alt={selectedCompany.name} />
                ) : (
                  <span className="company-initial">{selectedCompany.name.charAt(0)}</span>
                )}
              </div>
              <div>
                <h2>{selectedCompany.name}</h2>
                <p>{selectedCompany.industry}</p>
                {selectedCompany.website && (
                  <a href={selectedCompany.website} target="_blank" rel="noopener noreferrer" className="company-website">
                    🌐 {selectedCompany.website}
                  </a>
                )}
              </div>
            </div>

            <div className="modal-body">
              {selectedCompany.description && (
                <div className="modal-section">
                  <h3>About the Company</h3>
                  <p>{selectedCompany.description}</p>
                </div>
              )}

              <div className="modal-section">
                <h3>Recruitment Details</h3>
                <div className="modal-details-grid">
                  <div className="modal-detail-item">
                    <span className="modal-detail-label">Job Profile</span>
                    <span>{selectedCompany.jobProfile || 'N/A'}</span>
                  </div>
                  <div className="modal-detail-item">
                    <span className="modal-detail-label">Package</span>
                    <span>{selectedCompany.salaryPackage?.minimum} - {selectedCompany.salaryPackage?.maximum} {selectedCompany.salaryPackage?.currency || 'LPA'}</span>
                  </div>
                  <div className="modal-detail-item">
                    <span className="modal-detail-label">Location</span>
                    <span>{selectedCompany.location || 'N/A'}</span>
                  </div>
                  <div className="modal-detail-item">
                    <span className="modal-detail-label">Min CGPA</span>
                    <span>{selectedCompany.minimumCGPA || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {selectedCompany.eligibleBranches?.length > 0 && (
                <div className="modal-section">
                  <h3>Eligible Branches</h3>
                  <div className="eligible-branches">
                    {selectedCompany.eligibleBranches.map(b => (
                      <span key={b} className="branch-tag">{b}</span>
                    ))}
                  </div>
                </div>
              )}

              {selectedCompany.recruitmentPeriod?.start && (
                <div className="modal-section">
                  <h3>Recruitment Period</h3>
                  <p>
                    {new Date(selectedCompany.recruitmentPeriod.start).toLocaleDateString()} to{' '}
                    {new Date(selectedCompany.recruitmentPeriod.end).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompanyProfiles;
