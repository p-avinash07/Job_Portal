import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Settings from '../components/Settings';
import { LayoutDashboard, LogOut, Briefcase, Building2, MapPin, IndianRupee, List, FileText, CheckCircle2, TrendingUp, Users, Settings as SettingsIcon } from 'lucide-react';

const RecruiterDashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [jobs, setJobs] = useState([]);
  const [applicationsCount, setApplicationsCount] = useState({});
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');

  const [jobData, setJobData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    salary: ''
  });

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const loadData = async () => {
    try {
      setLoading(true);
      const jobsRes = await api.get('/jobs/all');
      const allJobs = jobsRes.data || [];
      
      let myJobs = allJobs.filter(job => String(job.userId) === String(user.id));

      console.log("All Jobs:", allJobs);
      console.log("Filtered Jobs:", myJobs);
      
      setJobs(myJobs);

      // Fetch applications counts for myJobs
      const appCounts = {};
      const allCandidates = [];
      for (const job of myJobs) {
        const jobId = job.id || job.jobId;
        if (jobId) {
          try {
            const appsRes = await api.get(`/applications/job/${jobId}`);
            if (appsRes.data && Array.isArray(appsRes.data)) {
              appCounts[jobId] = appsRes.data.length;
              allCandidates.push(...appsRes.data.map(app => ({ ...app, jobTitle: job.title, company: job.company })));
            } else {
              appCounts[jobId] = 0;
            }
          } catch (e) {
            appCounts[jobId] = 0;
          }
        }
      }
      setApplicationsCount(appCounts);
      setCandidates(allCandidates);
    } catch (error) {
      console.error('API Error:', error);
      alert("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'RECRUITER') {
      navigate('/login');
      return;
    }
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark');
    }
  }, []);

  const handleChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = { ...jobData, userId: user.id };
      await api.post('/jobs/add', dataToSubmit);

      setSuccessMsg('Role successfully published!');
      loadData();
      setJobData({ title: '', company: '', location: '', description: '', salary: '' });
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleJob = async (jobId) => {
    try {
      await api.put(`/jobs/toggle/${jobId}`);
      loadData();
    } catch (err) {
      console.error(err);
      alert("Error toggling job status");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    document.body.classList.remove('dark');
    navigate('/login');
  };

  const handleUpdateStatus = async (appId, newStatus, candidateEmail, appItem) => {
    try {
      console.log("Updating:", appId, newStatus);

      const res = await api.put(`/applications/status/${appId}?status=${newStatus}`);

      // The Java backend automatically triggers the formal email now, no need to wait on a client-side API call!
      setSuccessMsg(`Candidate moved to ${newStatus}`);
      setTimeout(() => setSuccessMsg(''), 4000);
      loadData(); // reload candidates
    } catch (err) {
      console.error("FULL ERROR:", err);

      if (err.response) {
        console.error("Backend Error:", err.response.data);
        alert(err.response.data || "Backend error");
      } else if (err.request) {
        alert("No response from server. Check backend.");
      } else {
        alert("Error updating status");
      }
    }
  };

  if (loading) {
    return (
      <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
        <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Loading your workspace...</p>
      </div>
    );
  }

  const safeJobs = Array.isArray(jobs) ? jobs : [];

  return (
    <div className="app-container">
      <div className="topbar">
        <h2>Job Portal</h2>
        <div className="topbar-right">
          <div className="user-profile">
            <div className="avatar" style={{ background: 'var(--primary-light)' }}>
              {(user.name || user.username || 'R').charAt(0).toUpperCase()}
            </div>
            <span>{user.name || 'Recruiter'}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Log out</button>
        </div>
      </div>

      <div className="dashboard">
        <div className="sidebar">
          <h3>Main Menu</h3>
          <p className={currentView === 'dashboard' ? 'active' : ''} onClick={() => setCurrentView('dashboard')}>
            <LayoutDashboard size={18} /> Dashboard
          </p>
          <p className={currentView === 'candidates' ? 'active' : ''} onClick={() => setCurrentView('candidates')}>
            <Users size={18} /> Candidates
          </p>
          <h3 style={{ marginTop: '20px' }}>Preferences</h3>
          <p className={currentView === 'settings' ? 'active' : ''} onClick={() => setCurrentView('settings')}>
            <SettingsIcon size={18} /> Settings
          </p>
        </div>

        <div className="content">
          {currentView === 'settings' && <Settings user={user} />}
          
          {currentView === 'dashboard' && (
            <>
              <div className="page-header">
                <h1>Recruitment Hub</h1>
                <p>Manage your sourcing operations efficiently.</p>
              </div>

              {successMsg && (
                <div style={{
                  padding: '15px',
                  borderRadius: '12px',
                  marginBottom: '25px',
                  background: 'var(--success-bg)',
                  color: 'var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: '600',
                  fontSize: '14px'
                }}>
                  <CheckCircle2 size={20} style={{ marginRight: '10px' }} />
                  {successMsg}
                </div>
              )}

              <div className="stats-grid">
                <div className="card stat-card highlight">
                  <div className="stat-icon"><Briefcase /></div>
                  <div className="stat-content">
                    <p>My Active Listings</p>
                    <h3>{safeJobs.length}</h3>
                  </div>
                </div>
                <div 
                  className="card stat-card" 
                  style={{ borderLeft: '5px solid #F59E0B', cursor: 'pointer' }}
                  onClick={() => setCurrentView('candidates')}
                >
                  <div className="stat-icon" style={{ background: '#FEF3C7', color: '#F59E0B' }}><Users /></div>
                  <div className="stat-content">
                    <p>Total Applications</p>
                    <h3>{safeJobs.reduce((acc, job) => acc + (applicationsCount[job.id || job.jobId] || 0), 0)}</h3>
                  </div>
                </div>
              </div>

              <div className="settings-grid">
                <div>
                  <h2 className="section-title" style={{ marginTop: 0 }}><FileText size={24} color="var(--primary)" /> Create New Role</h2>
                  <div className="form-card">
                    <form onSubmit={handlePostJob}>
                      <div className="form-group">
                        <label>Job Title</label>
                        <input type="text" className="form-input" name="title" required value={jobData.title} onChange={handleChange} placeholder="e.g. Senior Frontend Engineer" />
                      </div>

                      <div className="form-group">
                        <label>Company</label>
                        <input type="text" className="form-input" name="company" required value={jobData.company} onChange={handleChange} placeholder="Tech Industries" />
                      </div>

                      <div className="form-group" style={{ display: 'flex', gap: '15px' }}>
                        <div style={{ flex: '1' }}>
                          <label>Location</label>
                          <input type="text" className="form-input" name="location" required value={jobData.location} onChange={handleChange} placeholder="Remote, US" />
                        </div>
                        <div style={{ flex: '1' }}>
                          <label>Annual Salary</label>
                          <input type="text" className="form-input" name="salary" required value={jobData.salary} onChange={handleChange} placeholder="₹12 LPA - ₹15 LPA" />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Description Context</label>
                        <textarea
                          className="form-input"
                          name="description"
                          required
                          value={jobData.description}
                          onChange={handleChange}
                          placeholder="Outline core responsibilities..."
                          style={{ height: '120px', resize: 'vertical' }}
                        ></textarea>
                      </div>

                      <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>Publish Job Role</button>
                    </form>
                  </div>
                </div>

                <div>
                  <h2 className="section-title" style={{ marginTop: 0 }}><List size={24} color="var(--primary)" /> Manage Job Listings</h2>

                  {safeJobs.length === 0 ? (
                    <div className="empty-state">
                      <List size={40} style={{ opacity: 0.5, marginBottom: '15px', margin: '0 auto' }} />
                      <h3>No jobs found</h3>
                      <p>Deploy your first requisition into the global ecosystem.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      {safeJobs.map((job) => (
                        <div className="card" key={job.id || job.jobId || Math.random()} style={{ marginBottom: '0', padding: '20px' }}>
                          <h3 style={{ margin: '0 0 8px 0', fontSize: '17px', color: 'var(--text)' }}>{job.title}</h3>

                          <div className="job-details" style={{ margin: '10px 0' }}>
                            <div className="job-meta"><Building2 size={16} /> <span style={{ fontWeight: '500', color: 'var(--text)' }}>{job.company}</span></div>
                            <div className="job-meta"><MapPin size={16} /> {job.location}</div>
                            <div className="job-meta"><IndianRupee size={16} /> {job.salary || 'Competitive'}</div>
                            <div 
                              className="job-meta" 
                              style={{ color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer' }}
                              onClick={() => setCurrentView('candidates')}
                            >
                              <Users size={16} /> {applicationsCount[job.id || job.jobId] || 0} Applications
                            </div>
                            <div className="job-meta" style={{ 
                              color: job.isActive !== false ? 'var(--success)' : 'var(--error)', 
                              fontWeight: 'bold',
                              background: job.isActive !== false ? 'transparent' : '#f3f4f6',
                              padding: job.isActive !== false ? '0' : '2px 8px',
                              borderRadius: '4px'
                            }}>
                              <CheckCircle2 size={16} /> {job.isActive !== false ? 'Open' : 'Closed'}
                            </div>
                          </div>
                          <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '10px 0 15px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {job.description}
                          </p>
                          <button
                            onClick={() => toggleJob(job.id || job.jobId)}
                            className="btn-primary"
                            style={{
                              padding: '6px 14px',
                              fontSize: '13px',
                              width: 'fit-content',
                              background: job.isActive !== false ? 'var(--error)' : 'var(--success)',
                              margin: '0',
                            }}
                          >
                            {job.isActive !== false ? "Stop Applications" : "Start Applications"}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {currentView === 'candidates' && (
            <>
              <div className="page-header">
                <h1>Candidate Management</h1>
                <p>Review and process incoming applications.</p>
              </div>

              {successMsg && (
                <div style={{ padding: '15px', borderRadius: '12px', marginBottom: '25px', background: 'var(--success-bg)', color: 'var(--success)', display: 'flex', alignItems: 'center', fontWeight: '600', fontSize: '14px' }}>
                  <CheckCircle2 size={20} style={{ marginRight: '10px' }} />
                  {successMsg}
                </div>
              )}

              {candidates.length === 0 ? (
                <div className="empty-state">
                  <Users size={40} style={{ opacity: 0.5, marginBottom: '15px', margin: '0 auto' }} />
                  <h3>No candidates found</h3>
                  <p>Wait for applications to start arriving.</p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Candidate Profile</th>
                        <th>Job Applying For</th>
                        <th>Resume</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {candidates.map((app, idx) => {
                        const status = app.status ? app.status.toUpperCase() : 'APPLIED';
                        let badgeClass = "status-applied";
                        if (status === 'SHORTLISTED') badgeClass = "status-shortlisted";
                        if (status === 'REJECTED') badgeClass = "status-rejected";
                        if (status === 'INTERVIEW') badgeClass = "status-interview";

                        const name = app.applicantName || `Candidate User ID: ${app.userId || 'Unknown'}`;
                        const email = app.applicantEmail || `N/A`;
                        const resumeLink = app.resume ? app.resume : null;
                        const appliedDateStr = app.appliedDate ? new Date(app.appliedDate).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Date not available';

                        return (
                          <tr key={app.id || idx} style={{ cursor: 'pointer' }} onClick={() => navigate(`/candidate/${app.id}`)} className="candidate-row-hover">
                            <td data-label="Candidate Profile">
                              <div style={{ fontWeight: '600', color: 'var(--text)' }}>{name}</div>
                              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{email}</div>
                              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}><strong>Applied on:</strong> {appliedDateStr}</div>
                            </td>
                            <td data-label="Job Applying For">{app.jobTitle}</td>
                            <td data-label="Resume">
                              {resumeLink ? (
                                <a href={`https://job-portal-ev3y.onrender.com/applications/resume/${app.id}`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} style={{ color: 'var(--primary)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none' }}>
                                  <FileText size={16} /> View PDF
                                </a>
                              ) : 'Not Provided'}
                            </td>
                            <td data-label="Status">
                              <span className={`status-badge ${badgeClass}`}>{status}</span>
                            </td>
                            <td data-label="Actions">
                              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                <button className="btn-primary" onClick={(e) => { e.stopPropagation(); handleUpdateStatus(app.id, 'SHORTLISTED', email, app); }} style={{ padding: '6px 12px', fontSize: '12px', width: 'auto', background: 'var(--success)', margin: 0 }}>Shortlist</button>
                                <button className="btn-primary" onClick={(e) => { e.stopPropagation(); handleUpdateStatus(app.id, 'INTERVIEW', email, app); }} style={{ padding: '6px 12px', fontSize: '12px', width: 'auto', background: 'var(--primary)', margin: 0 }}>Interview</button>
                                <button className="btn-primary" onClick={(e) => { e.stopPropagation(); handleUpdateStatus(app.id, 'REJECTED', email, app); }} style={{ padding: '6px 12px', fontSize: '12px', width: 'auto', background: 'var(--error)', margin: 0 }}>Reject</button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
