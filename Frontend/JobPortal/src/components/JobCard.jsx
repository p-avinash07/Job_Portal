import React, { useState } from 'react';
import { Building2, MapPin, IndianRupee, Briefcase } from 'lucide-react';

const JobCard = ({ job, onApply, userRole, hasApplied }) => {
  const [applying, setApplying] = useState(false);

  const handleApply = async () => {
    setApplying(true);
    await onApply(job.id || job.jobId);
    setApplying(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full hover:shadow-md hover:-translate-y-1 transition-all duration-300">
      <div className="flex justify-between items-start mb-5">
        <div className="bg-primary/10 p-3 rounded-xl border border-primary/10">
          <Briefcase className="w-6 h-6 text-primary" />
        </div>
        {hasApplied && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-success/10 text-success">
            Applied
          </span>
        )}
      </div>
      
      <h3 className="text-lg font-bold text-secondary mb-2 line-clamp-1" title={job.title}>
        {job.title}
      </h3>
      
      <div className="space-y-2.5 mb-6 flex-grow">
        <div className="flex items-center text-gray-500 text-sm">
          <Building2 className="w-4 h-4 mr-2.5 text-gray-400" />
          <span className="truncate block font-medium">{job.company}</span>
        </div>
        <div className="flex items-center text-gray-500 text-sm">
          <MapPin className="w-4 h-4 mr-2.5 text-gray-400" />
          <span className="truncate block">{job.location}</span>
        </div>
        <div className="flex items-center text-gray-500 text-sm">
          <IndianRupee className="w-4 h-4 mr-2.5 text-gray-400" />
          <span className="truncate block">{job.salary || 'Salary not disclosed'}</span>
        </div>
      </div>
      
      <div className="text-gray-500 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
        {job.description}
      </div>
      
      {userRole === 'USER' && (
        <button 
          onClick={handleApply}
          disabled={hasApplied || applying}
          className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 shadow-sm ${
            hasApplied 
              ? 'bg-gray-100 text-gray-400 shadow-none cursor-not-allowed' 
              : 'bg-primary text-white hover:bg-primary/90 hover:shadow-primary/30 active:scale-[0.98]'
          }`}
        >
          {applying ? 'Submitting...' : hasApplied ? 'Application Sent' : 'Easy Apply'}
        </button>
      )}
    </div>
  );
};

export default JobCard;
