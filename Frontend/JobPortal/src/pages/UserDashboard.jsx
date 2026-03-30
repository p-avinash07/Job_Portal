import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Settings from '../components/Settings';
import { LayoutDashboard, LogOut, Briefcase, Send, CheckCircle2, TrendingUp, AlertCircle, Building2, MapPin, IndianRupee, ListTodo, Bot, Settings as SettingsIcon, FileText } from 'lucide-react';

const UserDashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyMessage, setApplyMessage] = useState({ text: '', type: '' });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    resume: null,
    message: ''
  });
  
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const loadData = async () => {
    try {
      setLoading(true);
      const jobsRes = await api.get('/jobs/all');
      setJobs(jobsRes.data || []);
      
      const appsRes = await api.get(`/applications/user/${user.id}`);
      setApplications(appsRes.data || []);
    } catch (error) {
      console.error('API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'USER') {
      navigate('/login');
      return;
    }
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update theme globally on mount
  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark');
    }
  }, []);

  const openDetailsModal = (job) => {
    setSelectedJob(job);
    setIsDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
  };

  const openApplyModal = (job) => {
    setSelectedJob(job);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      resume: null,
      message: ''
    });
    setIsModalOpen(true);
  };

  const closeApplyModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.resume) {
      alert("Please fill in all required fields and upload a resume.");
      return;
    }
    const jobIdToApply = selectedJob.id || selectedJob.jobId;
    
    // Using FormData for resume file upload
    try {
      closeApplyModal();
      setApplyMessage({ text: 'Submitting application...', type: 'info' });
      
      const payload = new FormData();
      payload.append('userId', user.id);
      payload.append('jobId', jobIdToApply);
      payload.append('status', 'APPLIED');
      payload.append('applicantName', formData.name);
      payload.append('applicantEmail', formData.email);
      payload.append('message', formData.message);
      payload.append('resume', formData.resume); // Pass the resume File safely

      await api.post('/applications/apply', payload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setApplyMessage({ text: 'Application successfully sent!', type: 'success' });
      
      loadData(); 
    } catch (error) {
      const backendError = error.response?.data?.message || typeof error.response?.data === 'string' ? error.response.data : error.message;
      console.error(backendError);
      alert('Submission Failed: ' + backendError);
      setApplyMessage({ text: 'Failed to submit: ' + backendError, type: 'error' });
    }
    
    setTimeout(() => setApplyMessage({ text: '', type: '' }), 4000);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    document.body.classList.remove('dark');
    navigate('/login');
  };

  const safeJobs = Array.isArray(jobs) ? jobs : [];
  const safeApps = Array.isArray(applications) ? applications : [];
  const appliedJobIds = safeApps.map(app => app.jobId || app.job?.id);

  const filteredJobs = safeJobs.filter(job => {
    const term = searchTerm.toLowerCase();
    return (job.title && job.title.toLowerCase().includes(term)) ||
           (job.company && job.company.toLowerCase().includes(term)) ||
           (job.location && job.location.toLowerCase().includes(term));
  });

  if (loading) {
    return (
      <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
        <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="topbar">
        <h2>Job Portal</h2>
        <div className="topbar-right">
          <div className="user-profile">
            <div className="avatar">
               {(user.name || user.username || 'U').charAt(0).toUpperCase()}
            </div>
            <span>{user.name || 'User'}</span>
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
          <p onClick={() => navigate('/ai-interview')}>
            <Bot size={18} /> AI Interview
          </p>
          <p onClick={() => navigate('/ats-checker')}>
            <FileText size={18} /> ATS Resume Scanner
          </p>
          <h3 style={{ marginTop: '20px' }}>Preferences</h3>
          <p className={currentView === 'settings' ? 'active' : ''} onClick={() => setCurrentView('settings')}>
            <SettingsIcon size={18} /> Settings
          </p>
        </div>

        <div className="content">
          {currentView === 'settings' ? (
            <Settings user={user} />
          ) : (
            <>
              <div className="page-header">
                <h1>Welcome back, {user.name || 'Job Seeker'}!</h1>
                <p>Here's an overview of your job search progress.</p>
              </div>

              {applyMessage.text && (
                <div style={{
                  padding: '15px', 
                  borderRadius: '12px', 
                  marginBottom: '25px', 
                  background: applyMessage.type === 'success' ? 'var(--success-bg)' : 'var(--error-bg)',
                  color: applyMessage.type === 'success' ? 'var(--success)' : 'var(--error)',
                  border: `1px solid ${applyMessage.type === 'success' ? '#BBF7D0' : '#FECACA'}`,
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: '600',
                  fontSize: '14px'
                }}>
                  {applyMessage.type === 'success' ? <CheckCircle2 size={20} style={{marginRight: '10px'}} /> : <AlertCircle size={20} style={{marginRight: '10px'}} />}
                  {applyMessage.text}
                </div>
              )}

              <div className="stats-grid">
                <div className="card stat-card highlight">
                  <div className="stat-icon"><Briefcase /></div>
                  <div className="stat-content">
                    <p>Available Jobs</p>
                    <h3>{safeJobs.length}</h3>
                  </div>
                </div>
                
                <div className="card stat-card" style={{ borderLeft: '5px solid var(--success)' }}>
                  <div className="stat-icon" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}><Send /></div>
                  <div className="stat-content">
                    <p>Applications Sent</p>
                    <h3>{safeApps.length}</h3>
                  </div>
                </div>

                <div className="card stat-card" style={{ borderLeft: '5px solid #8B5CF6' }}>
                  <div className="stat-icon" style={{ background: '#EDE9FE', color: '#8B5CF6' }}><TrendingUp /></div>
                  <div className="stat-content">
                    <p>Profile Score</p>
                    <h3>{Math.min(100, safeApps.length * 15)}%</h3>
                  </div>
                </div>
              </div>

              <div className="section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '15px' }}>
                  <h2 className="section-title" style={{ margin: 0 }}><ListTodo size={24} color="var(--primary)" /> Recommended Jobs</h2>
                  <input
                    type="text"
                    placeholder="Search by title, company, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', width: '100%', maxWidth: '350px', outline: 'none', background: 'var(--bg)', color: 'var(--text)' }}
                  />
                </div>
                
                {filteredJobs.length === 0 ? (
                  <div className="empty-state">
                    <Briefcase size={40} style={{ opacity: 0.5, marginBottom: '15px', margin: '0 auto' }} />
                    <h3>No jobs found</h3>
                    <p>Try adjusting your search criteria.</p>
                  </div>
                ) : (
                  <div className="card-grid">
                    {filteredJobs.map(job => {
                      const hasApplied = appliedJobIds.includes(job.id || job.jobId);
                      return (
                        <div className="card" key={job.id || job.jobId || Math.random()} style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }} onClick={() => openDetailsModal(job)}>
                          <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: 'var(--text)' }}>{job.title}</h3>
                          
                          <div className="job-details" style={{ flex: 1 }}>
                            <div className="job-meta"><Building2 size={16} /> <span style={{ fontWeight: '500', color: 'var(--text)' }}>{job.company}</span></div>
                            <div className="job-meta"><MapPin size={16} /> {job.location}</div>
                            <div className="job-meta"><IndianRupee size={16} /> {job.salary || 'Competitive'}</div>
                          </div>
                          
                          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.5', marginBottom: '20px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {job.description}
                          </p>
                          
                          <button 
                            onClick={(e) => { e.stopPropagation(); openApplyModal(job); }}
                            disabled={hasApplied || job.isActive === false}
                            className="btn-primary"
                            style={{ 
                              marginTop: 'auto',
                              background: hasApplied || job.isActive === false ? 'var(--border)' : 'var(--primary)',
                              color: hasApplied || job.isActive === false ? 'var(--text-muted)' : 'white',
                              boxShadow: hasApplied || job.isActive === false ? 'none' : '',
                              cursor: hasApplied || job.isActive === false ? 'not-allowed' : 'pointer'
                            }}
                          >
                            {hasApplied ? 'Applied' : job.isActive === false ? 'Applications Closed' : 'Apply Now'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="section">
                <h2 className="section-title"><Send size={24} color="var(--primary)" /> My Applications</h2>
                
                {safeApps.length === 0 ? (
                  <div className="empty-state">
                    <Send size={40} style={{ opacity: 0.5, marginBottom: '15px', margin: '0 auto' }} />
                    <h3>No applications yet</h3>
                    <p>You haven't applied to any roles. Start applying to see them here.</p>
                  </div>
                ) : (
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Job Role & Company</th>
                          <th>Status</th>
                          <th>Applied Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {safeApps.map((app, index) => {
                          const job = safeJobs.find(j => (j.id || j.jobId) === (app.jobId || app.job?.id));
                          const status = app.status ? app.status.toUpperCase() : 'APPLIED';
                          
                          let badgeClass = "status-applied";
                          if (status === 'SHORTLISTED') badgeClass = "status-shortlisted";
                          if (status === 'REJECTED') badgeClass = "status-rejected";
                          if (status === 'INTERVIEW') badgeClass = "status-interview";

                          return (
                            <tr key={app.id || index}>
                              <td data-label="Job Role">
                                <div style={{ fontWeight: '600', color: 'var(--text)' }}>{job?.title || 'Unknown Role'}</div>
                                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{job?.company || 'Company'}</div>
                              </td>
                              <td data-label="Status">
                                <span className={`status-badge ${badgeClass}`}>{status}</span>
                              </td>
                              <td data-label="Applied Date">
                                {app.appliedDate || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              
              {isDetailsModalOpen && selectedJob && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                  <div className="card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', margin: '20px', padding: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', margin: '0 0 15px 0' }}>
                      <h2 style={{ margin: 0, color: 'var(--text)', fontSize: '24px' }}>{selectedJob.title}</h2>
                      <button onClick={closeDetailsModal} style={{ background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', color: 'var(--text-muted)' }}>&times;</button>
                    </div>
                    
                    <div className="job-details" style={{ marginBottom: '20px', padding: '15px', background: 'var(--bg)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                      <div className="job-meta" style={{ marginBottom: '8px' }}><Building2 size={18} style={{ marginRight: '8px' }}/> <span style={{ fontWeight: '600', color: 'var(--text)', fontSize: '16px' }}>{selectedJob.company}</span></div>
                      <div className="job-meta" style={{ marginBottom: '8px' }}><MapPin size={18} style={{ marginRight: '8px' }}/> <span style={{ fontSize: '15px' }}>{selectedJob.location}</span></div>
                      <div className="job-meta"><IndianRupee size={18} style={{ marginRight: '8px' }}/> <span style={{ fontSize: '15px' }}>{selectedJob.salary || 'Competitive'}</span></div>
                    </div>
                    
                    <h3 style={{ color: 'var(--text)', marginBottom: '10px' }}>Job Description</h3>
                    <div style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '15px', whiteSpace: 'pre-wrap', marginBottom: '25px' }}>
                      {selectedJob.description}
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '10px' }}>
                      <button type="button" onClick={closeDetailsModal} style={{ padding: '10px 20px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', cursor: 'pointer', fontWeight: 600 }}>Close</button>
                      <button type="button" 
                        disabled={appliedJobIds.includes(selectedJob.id || selectedJob.jobId) || selectedJob.isActive === false}
                        className="btn-primary" 
                        onClick={() => { closeDetailsModal(); openApplyModal(selectedJob); }} 
                        style={{ margin: 0, background: appliedJobIds.includes(selectedJob.id || selectedJob.jobId) || selectedJob.isActive === false ? 'var(--border)' : 'var(--primary)', cursor: appliedJobIds.includes(selectedJob.id || selectedJob.jobId) || selectedJob.isActive === false ? 'not-allowed' : 'pointer', width: 'auto' }}
                      >
                        {appliedJobIds.includes(selectedJob.id || selectedJob.jobId) ? 'Already Applied' : selectedJob.isActive === false ? 'Applications Closed' : 'Apply Now'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                  <div className="card" style={{ width: '100%', maxWidth: '500px', margin: '20px', padding: '30px' }}>
                    <h2 style={{ marginTop: 0, color: 'var(--text)' }}>Apply for {selectedJob?.title}</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Please fill out your details to submit your application.</p>
                    <form onSubmit={handleApply}>
                      <div className="form-group">
                        <label>Full Name *</label>
                        <input type="text" className="form-input" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Your Full Name" />
                      </div>
                      <div className="form-group">
                        <label>Email Address *</label>
                        <input type="email" className="form-input" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="you@domain.com" />
                      </div>
                      <div className="form-group">
                        <label>Resume (PDF) *</label>
                        <input type="file" accept=".pdf" required onChange={(e) => setFormData({...formData, resume: e.target.files[0]})} style={{ width: '100%', padding: '10px', background: 'var(--bg)', borderRadius: '8px', border: '1px solid var(--border)', color: 'var(--text)' }} />
                      </div>
                      <div className="form-group">
                        <label>Optional Message</label>
                        <textarea className="form-input" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} placeholder="Why are you a good fit?" style={{ resize: 'vertical', height: '80px' }}></textarea>
                      </div>
                      <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                        <button type="button" onClick={closeApplyModal} style={{ flex: 1, padding: '12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                        <button type="submit" className="btn-primary" style={{ flex: 1, margin: 0 }}>Submit Application</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
