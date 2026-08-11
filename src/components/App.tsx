import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Categories } from './components/Categories';
import { FilterBar } from './components/FilterBar';
import { JobCard } from './components/JobCard';
import { JobDetailModal } from './components/JobDetailModal';
import { SchemesSection } from './components/SchemesSection';
import { StudyMaterialSection } from './components/StudyMaterialSection';
import { ResultsSection } from './components/ResultsSection';
import { TrustAndDisclaimer } from './components/TrustAndDisclaimer';
import { ContactModal } from './components/ContactModal';
import { SearchModal } from './components/SearchModal';
import { SavedJobsModal } from './components/SavedJobsModal';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';

import { 
  DEMO_CATEGORIES, DEMO_JOBS, DEMO_SCHEMES, 
  DEMO_STUDY_TOPICS, DEMO_RESULTS 
} from './data/mockData';
import { FilterState, JobItem, DepartmentType } from './types';
import { Building2, Search, RotateCcw, AlertCircle, Sparkles } from 'lucide-react';

export default function App() {
  // Dark Mode State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('mahanaukri_dark_mode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('mahanaukri_dark_mode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Active Nav Tab
  const [activeTab, setActiveTab] = useState<string>('home');

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    qualification: 'All',
    department: 'All',
    location: 'Maharashtra',
    jobType: 'All',
    categoryFilter: 'All',
  });

  // Saved Jobs Bookmarks State
  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('mahanaukri_saved_jobs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('mahanaukri_saved_jobs', JSON.stringify(savedJobIds));
  }, [savedJobIds]);

  // Modals
  const [selectedJobForModal, setSelectedJobForModal] = useState<JobItem | null>(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [savedModalOpen, setSavedModalOpen] = useState(false);
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'contact' | 'about' | 'privacy' | 'terms'>('contact');

  // Handlers
  const handleToggleSave = (jobId: string) => {
    setSavedJobIds(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId) 
        : [...prev, jobId]
    );
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      qualification: 'All',
      department: 'All',
      location: 'Maharashtra',
      jobType: 'All',
      categoryFilter: 'All',
    });
  };

  const handleSelectCategory = (deptKey: DepartmentType) => {
    setFilters(prev => ({ ...prev, department: deptKey }));
    const jobsEl = document.getElementById('jobs');
    if (jobsEl) {
      jobsEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenModal = (type: 'contact' | 'about' | 'privacy' | 'terms') => {
    setLegalModalType(type);
    setLegalModalOpen(true);
  };

  const scrollToJobs = () => {
    const el = document.getElementById('jobs');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtered Jobs Computation
  const filteredJobs = useMemo(() => {
    return DEMO_JOBS.filter(job => {
      // Search Query
      if (filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(q);
        const matchesDept = job.department.toLowerCase().includes(q);
        const matchesQual = job.qualification.toLowerCase().includes(q);
        const matchesLoc = job.location.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDept && !matchesQual && !matchesLoc) {
          return false;
        }
      }

      // Qualification
      if (filters.qualification !== 'All') {
        if (job.qualificationCategory !== filters.qualification && !job.qualification.includes(filters.qualification)) {
          return false;
        }
      }

      // Department
      if (filters.department !== 'All') {
        if (job.departmentCategory !== filters.department) {
          return false;
        }
      }

      // Location
      if (filters.location !== 'AllIndia' && filters.location !== 'Maharashtra') {
        if (job.locationCategory !== filters.location && !job.location.includes(filters.location)) {
          return false;
        }
      }

      // Job Type
      if (filters.jobType !== 'All') {
        if (job.jobType !== filters.jobType) {
          return false;
        }
      }

      return true;
    });
  }, [filters]);

  const savedJobsList = useMemo(() => {
    return DEMO_JOBS.filter(j => savedJobIds.includes(j.id));
  }, [savedJobIds]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200">
      
      {/* Header Bar */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedJobsCount={savedJobIds.length}
        onOpenSavedModal={() => setSavedModalOpen(true)}
        onOpenContactModal={() => handleOpenModal('contact')}
        onOpenAboutModal={() => handleOpenModal('about')}
        onOpenSearch={() => setSearchModalOpen(true)}
      />

      {/* Main Content Areas */}
      <main className="flex-1">
        
        {/* Hero Section */}
        <Hero
          searchQuery={filters.searchQuery}
          setSearchQuery={(q) => setFilters(prev => ({ ...prev, searchQuery: q }))}
          onSearchSubmit={scrollToJobs}
          onScrollToJobs={scrollToJobs}
        />

        {/* Category Cards Section */}
        <Categories
          categories={DEMO_CATEGORIES}
          selectedDept={filters.department}
          onSelectCategory={handleSelectCategory}
        />

        {/* Latest Jobs Section */}
        <section id="jobs" className="py-12 bg-white dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Title & Badge */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider bg-orange-100 dark:bg-orange-950/80 px-3 py-1 rounded-full border border-orange-200 dark:border-orange-800/80 inline-block mb-2">
                  नवीन जाहिराती (Latest Recruitment)
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white font-serif">
                  महाराष्ट्र व केंद्रीय भरती अपडेट्स
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md">
                जिल्हा परिषद, पोलीस, रेल्वे, SSC, IBPS आणि विविध सरकारी विभागांमधील ताज्या नोकरीच्या संधी
              </p>
            </div>

            {/* Smart Filter Bar */}
            <FilterBar
              filters={filters}
              setFilters={setFilters}
              totalJobsCount={filteredJobs.length}
              onResetFilters={handleResetFilters}
            />

            {/* Quick Department Switcher Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none text-xs sm:text-sm font-semibold">
              {[
                { id: 'All', label: 'सर्व जाहिराती' },
                { id: 'MaharashtraGovt', label: 'महाराष्ट्र शासन भरती' },
                { id: 'Railway', label: 'रेल्वे भरती (RRB)' },
                { id: 'PoliceDefence', label: 'पोलीस व संरक्षण' },
                { id: 'Banking', label: 'बँक भरती' },
                { id: 'CentralGovt', label: 'केंद्र शासन / SSC' },
                { id: 'MPSC', label: 'MPSC आयोग' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilters(prev => ({ ...prev, department: tab.id as DepartmentType }))}
                  className={`px-3.5 py-2 rounded-xl shrink-0 transition-all cursor-pointer ${
                    filters.department === tab.id
                      ? 'bg-slate-900 text-white dark:bg-orange-600 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Job Grid / Empty State */}
            {filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isSaved={savedJobIds.includes(job.id)}
                    onToggleSave={handleToggleSave}
                    onViewDetails={(j) => setSelectedJobForModal(j)}
                    onApplyNow={(j) => setSelectedJobForModal(j)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 dark:bg-slate-800/60 p-10 rounded-3xl border border-slate-200 dark:border-slate-700 text-center space-y-3">
                <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="font-serif font-bold text-lg text-slate-800 dark:text-slate-200">
                  निवडलेल्या फिल्टर्सनुसार कोणतीही जाहिरात आढळली नाही.
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  कृपया तुमचे फिल्टर्स बदला किंवा शोधलेला शब्द काढून पुन्हा प्रयत्न करा.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>सर्व फिल्टर्स रीसेट करा</span>
                </button>
              </div>
            )}

          </div>
        </section>

        {/* Government Schemes Section */}
        <SchemesSection schemes={DEMO_SCHEMES} />

        {/* Study Material & Practice Section */}
        <StudyMaterialSection studyTopics={DEMO_STUDY_TOPICS} />

        {/* Results & Admit Cards Section */}
        <ResultsSection results={DEMO_RESULTS} />

        {/* Trust & Independent Disclaimer Section */}
        <TrustAndDisclaimer />

      </main>

      {/* Footer */}
      <Footer
        onOpenModal={handleOpenModal}
        onScrollToTop={scrollToTop}
      />

      {/* Mobile Sticky Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSearch={() => setSearchModalOpen(true)}
      />

      {/* Modals */}
      <JobDetailModal
        job={selectedJobForModal}
        onClose={() => setSelectedJobForModal(null)}
        isSaved={selectedJobForModal ? savedJobIds.includes(selectedJobForModal.id) : false}
        onToggleSave={handleToggleSave}
      />

      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        jobs={DEMO_JOBS}
        schemes={DEMO_SCHEMES}
        onSelectJob={(job) => setSelectedJobForModal(job)}
      />

      <SavedJobsModal
        isOpen={savedModalOpen}
        onClose={() => setSavedModalOpen(false)}
        savedJobs={savedJobsList}
        onRemoveSave={handleToggleSave}
        onViewJob={(job) => setSelectedJobForModal(job)}
      />

      <ContactModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        type={legalModalType}
      />

    </div>
  );
}
