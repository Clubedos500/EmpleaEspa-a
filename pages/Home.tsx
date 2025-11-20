import React, { useState, useEffect } from 'react';
import { Job, User } from '../types';
import { api } from '../services/mockBackend';
import { JobCard } from '../components/JobCard';

interface HomeProps {
  user: User | null;
  onJobClick: (job: Job) => void;
}

export const Home: React.FC<HomeProps> = ({ user, onJobClick }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');

  // Calculate age once for filtering
  const age = user ? new Date().getFullYear() - new Date(user.birthdate).getFullYear() : 18;

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        // If user is < 18, the backend would filter out unsafe jobs
        const data = await api.jobs.search(search, location, user ? age : undefined);
        setJobs(data);
      } catch (error) {
        console.error("Failed to fetch jobs", error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchJobs, 500);
    return () => clearTimeout(debounce);
  }, [search, location, user, age]);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Hero Section */}
      <div className="bg-brand-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Encuentra tu trabajo ideal
          </h1>
          <p className="mt-6 text-xl text-brand-100 max-w-3xl mx-auto">
            Miles de ofertas de empleo en España. Oportunidades para todos los niveles de experiencia, incluyendo primer empleo para jóvenes.
          </p>
          
          <div className="mt-10 max-w-xl mx-auto bg-white rounded-lg p-2 flex flex-col sm:flex-row gap-2 shadow-lg">
            <div className="flex-grow relative">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                 </svg>
               </div>
               <input 
                 type="text"
                 className="block w-full pl-10 pr-3 py-3 border-transparent rounded-md leading-5 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 sm:text-sm"
                 placeholder="Cargo, empresa o palabra clave..."
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
               />
            </div>
            <div className="flex-grow relative border-t sm:border-t-0 sm:border-l border-gray-200">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                 </svg>
               </div>
               <select
                  className="block w-full pl-10 pr-3 py-3 border-transparent rounded-md leading-5 text-gray-900 focus:outline-none focus:ring-0 sm:text-sm appearance-none bg-transparent"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
               >
                 <option value="">Toda España</option>
                 <option value="Madrid">Madrid</option>
                 <option value="Barcelona">Barcelona</option>
                 <option value="Valencia">Valencia</option>
                 <option value="Sevilla">Sevilla</option>
               </select>
            </div>
          </div>
        </div>
      </div>

      {/* Job List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Últimas Ofertas</h2>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map(job => (
              <JobCard key={job.id} job={job} onClick={onJobClick} />
            ))}
          </div>
        )}
        {!loading && jobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No se encontraron ofertas con esos criterios.</p>
          </div>
        )}
      </div>
    </div>
  );
};