import type { NGODocument, NGOReport } from '@/types/ngo';

export const ngoDocuments: NGODocument[] = [
  {
    id: 'doc-1',
    title: 'CR-NC Concept Note 2025',
    category: 'Concept Notes',
    version: 3,
    status: 'Approved',
    uploadedBy: 'Dr. Sarah Okonkwo',
    uploadedAt: '2025-01-10',
    tags: ['program', 'rehabilitation'],
    programId: 'prog-1',
  },
  {
    id: 'doc-2',
    title: 'Q1 Donor Report – TLM International',
    category: 'Donor Reports',
    version: 1,
    status: 'In Review',
    uploadedBy: 'Finance Team',
    uploadedAt: '2025-04-15',
    tags: ['donor', 'quarterly'],
    programId: 'prog-1',
  },
  {
    id: 'doc-3',
    title: 'Field Visit Report – Lafia',
    category: 'Activity Documents',
    version: 2,
    status: 'Approved',
    uploadedBy: 'Aaron Hamilton',
    uploadedAt: '2025-05-18',
    tags: ['field', 'monitoring'],
    programId: 'prog-1',
  },
];

export const ngoReports: NGOReport[] = [
  {
    id: 'rep-1',
    title: 'Monthly Program Report – May 2025',
    type: 'Monthly Report',
    author: 'Dr. Sarah Okonkwo',
    status: 'In Review',
    period: 'May 2025',
    programId: 'prog-1',
    submittedAt: '2025-06-02',
  },
  {
    id: 'rep-2',
    title: 'Field Monitoring Report Q2',
    type: 'Monitoring Report',
    author: 'Aaron Hamilton',
    status: 'Draft',
    period: 'Q2 2025',
    programId: 'prog-1',
  },
];
