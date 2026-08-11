export type QualificationType = '10th' | '12th' | 'Graduate' | 'PostGraduate' | 'Diploma' | 'ITI' | 'All';
export type DepartmentType = 'MaharashtraGovt' | 'CentralGovt' | 'Railway' | 'PoliceDefence' | 'Banking' | 'MPSC' | 'All';
export type LocationType = 'Maharashtra' | 'AllIndia' | 'Mumbai' | 'Pune' | 'Nagpur' | 'SambhajiNagar';
export type JobType = 'Permanent' | 'Contract' | 'Apprentice';

export interface JobItem {
  id: string;
  title: string;
  department: string;
  departmentCategory: DepartmentType;
  qualification: string;
  qualificationCategory: QualificationType;
  ageLimit: string;
  lastDate: string;
  postDate: string;
  vacancies: string;
  location: string;
  locationCategory: LocationType;
  jobType: JobType;
  description: string;
  salary: string;
  applicationFee: string;
  selectionProcess: string[];
  howToApply: string[];
  officialWebsite: string;
  notificationUrl?: string;
  isHot?: boolean;
}

export interface SchemeItem {
  id: string;
  title: string;
  category: 'Student' | 'Women' | 'Farmer' | 'Employment' | 'FinancialAid' | 'General';
  categoryLabel: string;
  shortDescription: string;
  fullDescription: string;
  eligibility: string[];
  documentsRequired: string[];
  benefits: string;
  howToApply: string[];
  officialPortal: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface StudyTopic {
  id: string;
  subject: 'Maths' | 'Reasoning' | 'GK' | 'Marathi' | 'English' | 'CurrentAffairs';
  subjectLabel: string;
  title: string;
  topicSummary: string;
  readTime: string;
  keyPoints: string[];
  questions: QuizQuestion[];
}

export interface ResultItem {
  id: string;
  title: string;
  category: 'AdmitCard' | 'Result' | 'AnswerKey' | 'HallTicket';
  date: string;
  department: string;
  status: 'New' | 'Active' | 'Closed';
  linkText: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  deptKey: DepartmentType;
  iconName: string;
  count: number;
  description: string;
  badgeColor: string;
}

export interface FilterState {
  searchQuery: string;
  qualification: QualificationType;
  department: DepartmentType;
  location: LocationType;
  jobType: JobType | 'All';
  categoryFilter: string;
}
