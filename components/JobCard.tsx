import React from 'react';
import { Job } from '../types';

interface JobCardProps {
  job: Job;
  onClick: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onClick }) => {
  return (
    <div 
      onClick={() => onClick(job)}
      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer group"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-brand-600">{job.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{job.company}</p>
        </div>
        {job.minAge < 18 && (
           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
             +16 Apto Menores
           </span>
        )}
      </div>
      
      <div className="mt-4 flex flex-wrap gap-2 text-sm text-gray-500">
        <div className="flex items-center">
          <svg className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {job.location}
        </div>
        <div className="flex items-center">
          <svg className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {job.type}
        </div>
        <div className="flex items-center">
          <svg className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {job.salaryRange}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
        {job.tags.slice(0, 3).map(tag => (
          <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};