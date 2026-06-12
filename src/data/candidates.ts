import type { Candidate } from '@/types';

export const candidates: Candidate[] = [
  { id: '1', firstName: 'Callie', lastName: 'Torress', email: 'torresscallie.doc@mail.com', contactNumber: '01632 960112', vacancy: 'HR Assistant - UK', dateApplied: '2025-04-07', stage: 'Job Offer', source: 'LinkedIn' },
  { id: '2', firstName: 'Christina', lastName: 'Tang', email: 'christinatang@mail.com', contactNumber: '01632 960524', vacancy: 'HR Assistant - UK', dateApplied: '2025-04-02', stage: 'Shortlisted', source: 'LinkedIn' },
  { id: '3', firstName: 'Derek', lastName: 'Sheperd', email: 'dsheperd@mail.com', contactNumber: '01632 960258', vacancy: 'HR Assistant - UK', dateApplied: '2025-04-02', stage: 'Application Received', source: 'Indeed' },
  { id: '4', firstName: 'Kevin', lastName: 'Scott', email: 'kevinscott@gmail.com', contactNumber: '202-555-0120', vacancy: 'HR Assistant - UK', dateApplied: '2025-04-02', stage: 'Hired', source: 'LinkedIn' },
  { id: '5', firstName: 'Mark', lastName: 'Sloan', email: 'marksloan@mail.com', contactNumber: '01632 960015', vacancy: 'HR Assistant - UK', dateApplied: '2025-04-02', stage: 'Skills-Based Interview', source: 'Referral' },
  { id: '6', firstName: 'Nia', lastName: 'Walker', email: 'nia.walker@mail.com', contactNumber: '021-874-0850', vacancy: 'IT Support Engineer Internship', dateApplied: '2025-02-01', stage: 'Preboarding', source: 'University' },
  { id: '7', firstName: 'John', lastName: 'Roe', email: 'johnroe@live.com', contactNumber: '555-0100', vacancy: 'Sales Manager - USA', dateApplied: '2025-09-27', stage: 'Reference Check', source: 'LinkedIn' },
  { id: '8', firstName: 'Christina', lastName: 'Yang', email: 'christinayang@he.com', contactNumber: '555-0145', vacancy: 'HR Manager - Canada', dateApplied: '2025-09-27', stage: '321 Forms Onboarding', source: 'Indeed' },
  { id: '9', firstName: 'James', lastName: 'Wilson', email: 'james.wilson@hotmail.com', contactNumber: '416-555-0190', vacancy: 'Sales Manager', dateApplied: '2025-09-27', stage: 'Shortlisted', source: 'LinkedIn' },
  { id: '10', firstName: 'Abhinav', lastName: 'Sharma', email: 'abhinavsharma@gmail.com', contactNumber: '919742833851', vacancy: 'Project Manager - India', dateApplied: '2025-06-04', stage: 'HR Interview Round', source: 'Naukri' },
  { id: '11', firstName: 'Ashutosh', lastName: 'Singh', email: 'ashutosh.singh@yahoo.com', contactNumber: '917470583394', vacancy: 'Senior Web Developer - USA', dateApplied: '2025-06-04', stage: 'Technical Interview', source: 'LinkedIn' },
  { id: '12', firstName: 'Christine', lastName: 'Smith', email: 'christine.smith@gmail.com', contactNumber: '+1(970)333-3633', vacancy: 'Senior Web Developer - USA', dateApplied: '2025-06-04', stage: 'Skills-Based Interview', source: 'Referral' },
  { id: '13', firstName: 'Isabelle', lastName: 'Todd', email: 'isabelletodd@gmail.com', contactNumber: '202-555-0181', vacancy: 'Developer - USA', dateApplied: '2025-06-04', stage: 'Shortlisted', source: 'Indeed' },
  { id: '14', firstName: 'Rissa', lastName: 'Quan', email: 'rissa.quan@mail.com', contactNumber: '555-0167', vacancy: 'QA Engineer - Canada', dateApplied: '2025-02-01', stage: 'Application Received', source: 'LinkedIn' },
  { id: '15', firstName: 'Alex', lastName: 'Karev', email: 'Alexk@mail.com', contactNumber: '202-555-0170', vacancy: 'Senior Web Developer - USA', dateApplied: '2025-06-04', stage: 'Rejected', source: 'LinkedIn' },
  { id: '16', firstName: 'Meredith', lastName: 'Grey', email: 'meredithgrey@mail.com', contactNumber: '202-555-0133', vacancy: 'HR Assistant - UK', dateApplied: '2025-04-01', stage: 'Preboarding', source: 'Referral' },
  { id: '17', firstName: 'Owen', lastName: 'Hunt', email: 'owen.hunt@mail.com', contactNumber: '416-555-0144', vacancy: 'IT Manager - Canada', dateApplied: '2025-03-15', stage: 'In Progress', source: 'Indeed' },
  { id: '18', firstName: 'Arizona', lastName: 'Robbins', email: 'arizona.robbins@mail.com', contactNumber: '202-555-0155', vacancy: 'Sales Manager - USA', dateApplied: '2025-02-20', stage: 'Job Offer', source: 'LinkedIn' },
  { id: '19', firstName: 'Richard', lastName: 'Webber', email: 'richard.webber@mail.com', contactNumber: '555-0188', vacancy: 'Project Manager - India', dateApplied: '2025-01-10', stage: 'Hired', source: 'Referral' },
  { id: '20', firstName: 'Miranda', lastName: 'Bailey', email: 'miranda.bailey@mail.com', contactNumber: '202-555-0199', vacancy: 'HR Manager - Canada', dateApplied: '2025-04-10', stage: 'Preboarding', source: 'LinkedIn' },
];

export const stageCounts = {
  'All Candidates': candidates.length,
  'Application Received': candidates.filter(c => c.stage === 'Application Received').length,
  'Shortlisted': candidates.filter(c => c.stage === 'Shortlisted').length,
  'In Progress': candidates.filter(c => c.stage === 'In Progress' || c.stage === 'Skills-Based Interview' || c.stage === 'Technical Interview' || c.stage === 'HR Interview Round' || c.stage === 'Reference Check' || c.stage === '321 Forms Onboarding').length,
  'Job Offer': candidates.filter(c => c.stage === 'Job Offer').length,
  'Preboarding': candidates.filter(c => c.stage === 'Preboarding').length,
  'Hired': candidates.filter(c => c.stage === 'Hired').length,
  'Rejected': candidates.filter(c => c.stage === 'Rejected').length,
};
