import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, UploadCloud, FileText, CheckCircle2, AlertTriangle, ChevronRight, XCircle } from 'lucide-react';
import api from '../services/api';

const ATSChecker = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'USER') {
      navigate('/login');
    }
  }, [navigate, user]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const startAnalysis = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    setResults(null);
    
    try {
      // Create request based on strict backend mapping.
      // Call atsScore mapping - assumes string payload endpoints. If Spring Boot maps JSON:
      // We will securely pass payload strings and extract from raw Gemini response block.
      const res = await api.post('/ai/ats', {
        resume: file.name,
        job: jobDesc || "Software Engineer"
      }).catch(async () => {
          // If backend natively accepts FormData or params:
          const fd = new FormData();
          fd.append('resume', file.name);
          fd.append('jobDesc', jobDesc || "Software Engineer");
          return await api.post('/ai/ats', fd);
      });

      console.log("AI Response:", res.data);
      
      const rawResponse = typeof res.data === 'string' ? res.data : JSON.stringify(res.data);
      
      // Attempt parse for score reliably since backend returns formatted string: "ATS Score: 85..."
      const scoreMatch = rawResponse.match(/(\d{1,3})\s*(?:\/|out of)\s*100/i) || rawResponse.match(/(?:Score|score).*?(\d{1,3})/);
      let extractedScore = 0;
      if (scoreMatch && scoreMatch[1]) {
        extractedScore = parseInt(scoreMatch[1]);
      }

      setResults({
         score: extractedScore,
         raw: rawResponse
      });

    } catch (err) {
      console.error(err);
      alert("Failed to analyze resume. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGoBack = () => {
    navigate('/user-dashboard');
  };

  return (
    <div className="app-container">
      <div className="topbar">
        <h2>Job Portal</h2>
        <div className="topbar-right">
          <button className="logout-btn" onClick={handleGoBack} style={{ background: 'var(--primary)', color: '#fff', borderColor: 'var(--primary)' }}>
            Back to Dashboard
          </button>
        </div>
      </div>

      <div className="content" style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
        <div className="page-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
            <FileText size={32} color="var(--primary)" /> 
            ATS Resume Scanner
          </h1>
          <p>Instantly check if your resume passes Applicant Tracking Systems.</p>
        </div>

        {!results ? (
          <div className="form-card" style={{ margin: '0 auto', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <label className={`upload-zone ${file ? 'active' : ''}`} htmlFor="resume-upload">
              <UploadCloud size={60} color={file ? 'var(--primary)' : 'var(--text-muted)'} style={{ marginBottom: '10px' }} />
              {file ? (
                <div>
                  <h3 style={{ margin: '0 0 5px 0', color: 'var(--primary)', fontSize: '18px' }}>{file.name}</h3>
                  <p>Click to change file</p>
                </div>
              ) : (
                <div>
                  <h3 style={{ margin: '0 0 5px 0', color: 'var(--text)', fontSize: '18px' }}>Upload your Resume</h3>
                  <p>Drag & drop or click to select a PDF</p>
                </div>
              )}
              <input 
                type="file" 
                id="resume-upload" 
                accept=".pdf,.doc,.docx" 
                style={{ display: 'none' }} 
                onChange={handleFileChange}
              />
            </label>

            <div style={{ textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Job Description (Optional)</label>
              <textarea 
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                placeholder="Paste the job description here to check compatibility..."
                rows="4"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontFamily: 'inherit' }}
              />
            </div>

            <button 
              className="btn-primary" 
              onClick={startAnalysis}
              disabled={!file || isAnalyzing}
              style={{ padding: '16px 30px', fontSize: '16px' }}
            >
              {isAnalyzing ? 'Analyzing Document with AI...' : 'Scan Resume Now'}
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '30px', gridTemplateColumns: 'minmax(0,1fr)' }} className="card-grid">
            
            {/* Score & Raw Data Panel */}
            <div className="card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <h3 style={{ color: 'var(--text)', marginBottom: '20px', fontSize: '18px' }}>ATS Compatibility</h3>
              
              <svg viewBox="0 0 36 36" className="circular-chart" style={{ width: '200px', height: '200px', marginBottom: '30px' }}>
                <path className="circle-bg"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path className="circle"
                  strokeDasharray={`${results.score}, 100`}
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <text x="18" y="19" className="percentage">{results.score}</text>
                <text x="18" y="24" className="score-label">OUT OF 100</text>
              </svg>

              <div style={{ width: '100%', textAlign: 'left', background: 'var(--bg)', padding: '25px', borderRadius: '12px', border: '1px solid var(--border)', whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '15px' }}>
                {results.raw}
              </div>
              
              <button className="btn-primary" onClick={() => setResults(null)} style={{ marginTop: '30px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', boxShadow: 'none' }}>
                Scan Another Resume
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default ATSChecker;
