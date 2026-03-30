import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { studentService, placementService } from '../services/api';
import '../styles/StudentProfile.css';

function StudentProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, placementsRes] = await Promise.all([
          studentService.getById(user.id),
          studentService.getPlacements(user.id)
        ]);
        setProfile(profileRes.data);
        setPlacements(placementsRes.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.id]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Placed': return 'status-placed';
      case 'Multiple Offers': return 'status-multiple';
      default: return 'status-not-placed';
    }
  };

  const getPlacementStatusColor = (status) => {
    switch (status) {
      case 'Offer Letter Received': return 'badge-blue';
      case 'Joining Confirmed': return 'badge-green';
      case 'Offer Withdrawn': return 'badge-red';
      default: return 'badge-yellow';
    }
  };

  if (loading) {
    return <div className="page-loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>My Profile</h1>
        <p>View your placement records and profile details</p>
      </div>

      {profile && (
        <div className="profile-hero">
          <div className="profile-avatar">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h2>{profile.name}</h2>
            <p className="profile-usn">{profile.usn}</p>
            <p className="profile-branch">{profile.branch} | Batch: {profile.batch}</p>
            <span className={`status-badge ${getStatusColor(profile.placementStatus)}`}>
              {profile.placementStatus}
            </span>
          </div>
        </div>
      )}

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'profile' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile Details
        </button>
        <button
          className={`tab ${activeTab === 'placements' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('placements')}
        >
          Placement Records ({placements.length})
        </button>
      </div>

      {activeTab === 'profile' && profile && (
        <div className="profile-details-card">
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">USN</span>
              <span className="detail-value">{profile.usn}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Full Name</span>
              <span className="detail-value">{profile.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Email</span>
              <span className="detail-value">{profile.email}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Phone</span>
              <span className="detail-value">{profile.phone}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Branch</span>
              <span className="detail-value">{profile.branch}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Batch</span>
              <span className="detail-value">{profile.batch}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">CGPA</span>
              <span className="detail-value">{profile.cgpa || 'Not set'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Placement Status</span>
              <span className={`status-badge ${getStatusColor(profile.placementStatus)}`}>
                {profile.placementStatus}
              </span>
            </div>
          </div>

          {profile.skills && profile.skills.length > 0 && (
            <div className="skills-section">
              <h3>Skills</h3>
              <div className="skills-list">
                {profile.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'placements' && (
        <div className="placements-section">
          {placements.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No Placement Records Yet</h3>
              <p>Your placement records will appear here once you are placed.</p>
            </div>
          ) : (
            <div className="placements-grid">
              {placements.map((placement) => (
                <div key={placement._id} className="placement-card">
                  <div className="placement-card-header">
                    <div className="company-logo-placeholder">
                      {placement.company?.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <h3>{placement.company?.name}</h3>
                      <p className="company-industry">{placement.company?.industry}</p>
                    </div>
                    <span className={`badge ${getPlacementStatusColor(placement.status)}`}>
                      {placement.status}
                    </span>
                  </div>

                  <div className="placement-details">
                    <div className="placement-detail">
                      <span className="detail-label">Package</span>
                      <span className="detail-value package-value">
                        {placement.package} {placement.packageCurrency}
                      </span>
                    </div>
                    <div className="placement-detail">
                      <span className="detail-label">Job Profile</span>
                      <span className="detail-value">{placement.jobProfile || 'N/A'}</span>
                    </div>
                    <div className="placement-detail">
                      <span className="detail-label">Location</span>
                      <span className="detail-value">{placement.location || 'N/A'}</span>
                    </div>
                    <div className="placement-detail">
                      <span className="detail-label">Placement Date</span>
                      <span className="detail-value">
                        {new Date(placement.placementDate).toLocaleDateString()}
                      </span>
                    </div>
                    {placement.joiningDate && (
                      <div className="placement-detail">
                        <span className="detail-label">Joining Date</span>
                        <span className="detail-value">
                          {new Date(placement.joiningDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default StudentProfile;
