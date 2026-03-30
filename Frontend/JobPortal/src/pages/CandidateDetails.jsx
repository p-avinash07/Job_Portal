import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, FileText, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const CandidateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/applications/${id}`);
        setCandidate(res.data);
      } catch (err) {
        console.error("Error:", err.response?.data || err.message);
        setError("Failed to load candidate details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id]);

  if (loading) {
    return (
      <div className="app-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Loading candidate profile...</p>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="app-container" style={{ padding: '40px' }}>
        <div className="empty-state">
          <h3>Oops!</h3>
          <p>{error || "Candidate not found."}</p>
          <button className="btn-primary" onClick={() => navigate('/recruiter-dashboard')} style={{ marginTop: '20px', width: 'auto' }}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const name = candidate.applicantName || `Candidate ID: ${candidate.userId || 'Unknown'}`;
  const email = candidate.applicantEmail || 'N/A';
  const status = candidate.status || 'APPLIED';
  const resumeLink = candidate.resume || null;

  return (
    <div className="app-container" style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div className="topbar">
        <h2>Job Portal</h2>
        <div className="topbar-right">
          <button className="logout-btn" onClick={() => navigate('/recruiter-dashboard')} style={{ background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)' }}>
            Dashboard
          </button>
        </div>
      </div>
      
      <div className="content" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '40px' }}>
        <button 
          onClick={() => navigate('/recruiter-dashboard')} 
          style={{ 
            background: 'transparent', 
            border: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            color: 'var(--primary)', 
            cursor: 'pointer', 
            fontWeight: '600', 
            marginBottom: '30px' 
          }}
        >
          <ArrowLeft size={18} /> Back to dashboard
        </button>

        <div className="card">
          <h1 style={{ margin: '0 0 5px 0', fontSize: '28px', color: 'var(--text)' }}>Candidate Profile</h1>
          <p style={{ color: 'var(--text-muted)', margin: '0 0 30px 0' }}>Job Application Reference: {id}</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={24} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Full Name</p>
                <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--text)' }}>{name}</h3>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: '#FEF3C7', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Mail size={24} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Email Address</p>
                <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--text)' }}>{email}</h3>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'var(--success-bg)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Current Status</p>
                <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--text)' }}>{status}</h3>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
              <div>
                <p style={{ margin: '0 0 10px 0', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Attached Resume</p>
                {resumeLink ? (
                  <a href={`http://localhost:8080/applications/resume/${id}`} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', padding: '10px 16px', background: 'var(--primary-light)', borderRadius: '8px' }}>
                    <FileText size={18} /> Download/View PDF
                  </a>
                ) : (
                  <p style={{ margin: 0, color: 'var(--text-muted)' }}>No resume provided.</p>
                )}
              </div>
            </div>

            {candidate.message && (
              <div style={{ marginTop: '15px' }}>
                <p style={{ margin: '0 0 10px 0', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Cover Message</p>
                <div style={{ background: 'var(--bg)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '15px', lineHeight: '1.6', color: 'var(--text)' }}>
                  {candidate.message}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetails;
