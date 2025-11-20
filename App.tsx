import React, { useState, useEffect } from 'react';
import { User, Job } from './types';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { api } from './services/mockBackend';
import { ConsentModal } from './components/ConsentModal';

// Simple routing using hash for SPA without server config
enum Page {
  HOME = 'HOME',
  JOB_DETAILS = 'JOB_DETAILS',
  LOGIN = 'LOGIN'
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  
  // Consent Modal State
  const [showConsentModal, setShowConsentModal] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = api.auth.getCurrentUser();
      if (currentUser) setUser(currentUser);
    };
    checkAuth();
  }, []);

  const handleLogin = async (email: string) => {
    try {
      const loggedInUser = await api.auth.login(email);
      setUser(loggedInUser);
      setCurrentPage(Page.HOME);
      
      // Check if minor and needs consent
      const age = new Date().getFullYear() - new Date(loggedInUser.birthdate).getFullYear();
      if (age >= 16 && age < 18 && !loggedInUser.consentVerified) {
        setTimeout(() => setShowConsentModal(true), 1000);
      }
    } catch (e) {
      alert("Login failed");
    }
  };

  const handleLogout = () => {
    api.auth.logout();
    setUser(null);
    setCurrentPage(Page.HOME);
  };

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    setCurrentPage(Page.JOB_DETAILS);
  };

  const handleApply = async () => {
    if (!selectedJob) return;
    if (!user) {
      setCurrentPage(Page.LOGIN);
      return;
    }

    const age = new Date().getFullYear() - new Date(user.birthdate).getFullYear();
    
    // 1. Check Legal Age
    if (age < 16) {
      alert("Lo sentimos, debes tener al menos 16 años para trabajar en España.");
      return;
    }

    // 2. Check Job Restrictions for Minors
    if (age < 18 && selectedJob.isNightShift) {
      alert("Por regulaciones laborales, los menores de 18 años no pueden realizar trabajos nocturnos.");
      return;
    }

    // 3. Check Parental Consent
    if (age < 18 && !user.consentVerified) {
      setShowConsentModal(true);
      return;
    }

    try {
      await api.applications.apply(selectedJob.id);
      alert("¡Candidatura enviada con éxito!");
      setCurrentPage(Page.HOME);
    } catch (e) {
      alert("Error al enviar la candidatura.");
    }
  };

  const handleConsentUpload = async (file: File) => {
    try {
      await api.compliance.uploadParentalConsent(file);
      // Update local user state
      if (user) setUser({ ...user, consentVerified: true });
      alert("Documento subido. Un administrador lo revisará pronto.");
    } catch (e) {
      alert("Error subiendo el documento.");
    }
  };

  // -- Render Views --

  const renderLogin = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Acceder a tu cuenta</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
             Simulación de Login
          </p>
        </div>
        <div className="space-y-4">
          <button
            onClick={() => handleLogin("candidate@example.com")}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
          >
            Entrar como Candidato (Adulto)
          </button>
          <button
            onClick={() => handleLogin("minor@example.com")}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-accent-500 hover:bg-accent-600 focus:outline-none"
          >
            Entrar como Menor (16 años)
          </button>
        </div>
      </div>
    </div>
  );

  const renderJobDetails = () => {
    if (!selectedJob) return null;
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <button onClick={() => setCurrentPage(Page.HOME)} className="mb-6 text-brand-600 hover:underline flex items-center">
          ← Volver a ofertas
        </button>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-2xl leading-6 font-medium text-gray-900">{selectedJob.title}</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{selectedJob.company} - {selectedJob.location}</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Salario</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{selectedJob.salaryRange}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Tipo de contrato</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{selectedJob.type}</dd>
              </div>
               <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Restricciones</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {selectedJob.minAge >= 18 ? (
                    <span className="text-red-600 font-bold">Requiere ser mayor de edad (+18)</span>
                  ) : (
                     <span className="text-green-600 font-bold">Apto para mayores de 16 años</span>
                  )}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Descripción</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-line">
                  {selectedJob.description}
                </dd>
              </div>
            </dl>
          </div>
          <div className="bg-gray-50 px-4 py-4 sm:px-6 flex justify-end">
            <button
              onClick={handleApply}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 focus:outline-none"
            >
              Inscribirme a esta oferta
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Navbar user={user} onLogout={handleLogout} onLoginClick={() => setCurrentPage(Page.LOGIN)} />
      
      <main>
        {currentPage === Page.HOME && <Home user={user} onJobClick={handleJobClick} />}
        {currentPage === Page.LOGIN && renderLogin()}
        {currentPage === Page.JOB_DETAILS && renderJobDetails()}
      </main>

      <ConsentModal 
        isOpen={showConsentModal} 
        onClose={() => setShowConsentModal(false)} 
        onUpload={handleConsentUpload} 
      />
      
      {/* GDPR Footer */}
      <footer className="bg-white border-t mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>&copy; 2023 EmpleaEspaña. Cumplimos con RGPD y normativa laboral española.</p>
          <p className="mt-2">El uso de esta plataforma implica la aceptación de nuestras políticas de privacidad.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;