import type { Program, Project, Activity, Beneficiary, Donor, Partner } from '@/types/ngo';

export const programs: Program[] = [
  {
    id: 'prog-1',
    name: 'Community Rehabilitation – North Central',
    code: 'CR-NC-2025',
    status: 'Active',
    budget: 45000000,
    spent: 28500000,
    donor: 'TLM International',
    location: 'Nasarawa, Plateau',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    manager: 'Dr. Sarah Okonkwo',
    description: 'Integrated community-based rehabilitation for persons affected by leprosy.',
  },
  {
    id: 'prog-2',
    name: 'Disability Inclusion & Advocacy',
    code: 'DIA-2025',
    status: 'Active',
    budget: 12000000,
    spent: 4200000,
    donor: 'EU Humanitarian Aid',
    location: 'National',
    startDate: '2025-03-01',
    endDate: '2026-02-28',
    manager: 'James Adeyemi',
    description: 'Policy advocacy and disability rights awareness.',
  },
  {
    id: 'prog-3',
    name: 'Primary Health Outreach',
    code: 'PHO-2024',
    status: 'Completed',
    budget: 8000000,
    spent: 7950000,
    donor: 'WHO Nigeria',
    location: 'Kaduna',
    startDate: '2024-06-01',
    endDate: '2024-12-31',
    manager: 'Grace Emeka',
    description: 'Mobile clinic and health education in underserved communities.',
  },
];

export const projects: Project[] = [
  { id: 'proj-1', programId: 'prog-1', name: 'Self-Care Groups', status: 'Active', budget: 15000000, indicators: 5 },
  { id: 'proj-2', programId: 'prog-1', name: 'Livelihood Support', status: 'Active', budget: 20000000, indicators: 8 },
  { id: 'proj-3', programId: 'prog-2', name: 'Policy Engagement', status: 'Active', budget: 6000000, indicators: 3 },
];

export const activities: Activity[] = [
  {
    id: 'act-1',
    programId: 'prog-1',
    projectId: 'proj-1',
    title: 'Self-Care Group Training – Lafia',
    type: 'Training',
    status: 'Approved',
    date: '2025-05-15',
    location: 'Lafia, Nasarawa',
    lead: 'Aaron Hamilton',
    budget: 250000,
    participants: 45,
    expectedOutcomes: '45 members trained in wound care and self-management',
    actualOutcomes: '48 participants completed training',
  },
  {
    id: 'act-2',
    programId: 'prog-1',
    title: 'Field Monitoring Visit Q2',
    type: 'Monitoring Visit',
    status: 'In Review',
    date: '2025-06-01',
    location: 'Plateau State',
    lead: 'Dr. Sarah Okonkwo',
    budget: 180000,
    participants: 4,
    expectedOutcomes: 'Monitoring report with recommendations',
  },
  {
    id: 'act-3',
    programId: 'prog-2',
    title: 'Stakeholder Sensitization – Abuja',
    type: 'Sensitization Campaign',
    status: 'Submitted',
    date: '2025-06-10',
    location: 'Abuja FCT',
    lead: 'James Adeyemi',
    budget: 500000,
    participants: 80,
    expectedOutcomes: 'Increased awareness among policymakers',
  },
];

export const beneficiaries: Beneficiary[] = [
  { id: 'ben-1', name: 'Self-Care Group Members', category: 'PWD', location: 'Lafia', programId: 'prog-1' },
  { id: 'ben-2', name: 'Community Health Workers', category: 'CHW', location: 'Jos', programId: 'prog-1' },
  { id: 'ben-3', name: 'Policy Stakeholders', category: 'Institutional', location: 'Abuja', programId: 'prog-2' },
];

export const donors: Donor[] = [
  { id: 'don-1', name: 'TLM International', type: 'Faith-based', totalFunding: 57000000, activePrograms: 2 },
  { id: 'don-2', name: 'EU Humanitarian Aid', type: 'Multilateral', totalFunding: 12000000, activePrograms: 1 },
  { id: 'don-3', name: 'WHO Nigeria', type: 'UN Agency', totalFunding: 8000000, activePrograms: 0 },
];

export const partners: Partner[] = [
  { id: 'part-1', name: 'Nasarawa State Ministry of Health', type: 'Government', location: 'Lafia' },
  { id: 'part-2', name: 'Jos University Teaching Hospital', type: 'Medical', location: 'Jos' },
];
