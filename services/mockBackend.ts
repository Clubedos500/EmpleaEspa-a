import { Job, JobType, Modality, User, UserRole, Application } from '../types';

// --- Seed Data Generators ---

const CITIES = ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao', 'Málaga'];
const SKILLS = ['Java', 'React', 'Python', 'Ventas', 'Atención al cliente', 'Inglés', 'Excel'];
const COMPANIES = ['TechSpain S.L.', 'Hostelería Mediterránea', 'Global Retailers', 'StartUp Now', 'Constructora Norte'];

const generateJobs = (count: number): Job[] => {
  return Array.from({ length: count }, (_, i) => {
    const isNight = Math.random() > 0.8;
    const minAge = isNight ? 18 : 16;
    
    return {
      id: `job-${i}`,
      title: i % 3 === 0 ? 'Desarrollador Full Stack' : i % 3 === 1 ? 'Dependiente/a de Tienda' : 'Camarero/a',
      company: COMPANIES[i % COMPANIES.length],
      description: `Buscamos un perfil dinámico para incorporarse a nuestro equipo en ${CITIES[i % CITIES.length]}. Se valora experiencia y proactividad.`,
      location: CITIES[i % CITIES.length],
      salaryRange: `${18000 + Math.floor(Math.random() * 30000)}€ - ${25000 + Math.floor(Math.random() * 40000)}€`,
      type: Object.values(JobType)[i % 4],
      modality: Object.values(Modality)[i % 3],
      minAge,
      isNightShift: isNight,
      tags: [SKILLS[i % SKILLS.length], isNight ? 'Turno Noche' : 'Turno Día'],
      postedAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString()
    };
  });
};

// --- Mock Database State ---

const db = {
  jobs: generateJobs(50),
  users: [] as User[],
  applications: [] as Application[],
  currentUser: null as User | null
};

// --- Simulated API Services ---

export const api = {
  auth: {
    login: async (email: string): Promise<User> => {
      await new Promise(resolve => setTimeout(resolve, 500)); // Network latency
      
      // Simulating a logged in user (Minor for demo purposes or standard)
      const isMinor = email.includes('minor');
      const user: User = {
        id: 'user-123',
        name: isMinor ? 'Juan Menor' : 'Ana Candidata',
        email,
        role: UserRole.CANDIDATE,
        birthdate: isMinor ? '2008-05-20' : '1995-05-20', // 16yo vs 29yo
        nationality: 'ES',
        documentId: '12345678Z',
        skills: ['React', 'Java'],
        consentVerified: isMinor ? false : true // Minor starts unverified
      };
      db.currentUser = user;
      return user;
    },
    getCurrentUser: () => db.currentUser,
    logout: () => { db.currentUser = null; }
  },
  
  jobs: {
    search: async (query: string, location: string, minAge?: number): Promise<Job[]> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return db.jobs.filter(job => {
        const matchesQuery = job.title.toLowerCase().includes(query.toLowerCase()) || 
                             job.company.toLowerCase().includes(query.toLowerCase());
        const matchesLoc = location ? job.location === location : true;
        const matchesAge = minAge ? job.minAge <= minAge : true; // Allow jobs suitable for age
        
        return matchesQuery && matchesLoc && matchesAge;
      });
    },
    getById: async (id: string): Promise<Job | undefined> => {
      return db.jobs.find(j => j.id === id);
    }
  },

  applications: {
    apply: async (jobId: string): Promise<boolean> => {
      await new Promise(resolve => setTimeout(resolve, 800));
      if (!db.currentUser) throw new Error("Not authenticated");
      
      db.applications.push({
        id: `app-${Date.now()}`,
        jobId,
        userId: db.currentUser.id,
        status: 'PENDING',
        appliedAt: new Date().toISOString()
      });
      return true;
    }
  },

  // Specific simulation for Minors (16-17)
  compliance: {
    uploadParentalConsent: async (file: File): Promise<void> => {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate S3 upload + verification
      if (db.currentUser) {
        db.currentUser.consentVerified = true;
      }
    }
  }
};