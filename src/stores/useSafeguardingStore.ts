import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { demoUsers, type DemoUser } from './useAuthStore';

export type SafeguardingStatus = 'New' | 'Under Review' | 'Resolved' | 'Escalated';

export interface SafeguardingStatusHistory {
  id: string;
  status: SafeguardingStatus;
  updatedBy: string;
  note?: string;
  createdAt: string;
}

export interface SafeguardingReport {
  id: string;
  reportCode: string;
  reporterId?: string;
  reporterName?: string;
  privateReporterId: string;
  isAnonymous: boolean;
  issueType: string;
  incidentDate: string;
  location: string;
  description: string;
  personsInvolved?: string;
  evidenceUrl?: string;
  status: SafeguardingStatus;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
  readByLead: boolean;
  statusHistory: SafeguardingStatusHistory[];
}

interface SafeguardingState {
  safeguardingLeadId: string;
  reports: SafeguardingReport[];
  setLead: (leadId: string) => void;
  getLead: () => DemoUser | undefined;
  submitReport: (
    reporter: DemoUser,
    input: Omit<SafeguardingReport, 'id' | 'reportCode' | 'reporterId' | 'reporterName' | 'privateReporterId' | 'status' | 'createdAt' | 'updatedAt' | 'readByLead' | 'statusHistory'>
  ) => SafeguardingReport;
  markLeadRead: () => void;
  updateStatus: (reportId: string, status: SafeguardingStatus, updatedBy: DemoUser, note?: string) => SafeguardingReport | undefined;
  updateInternalNotes: (reportId: string, internalNotes: string) => void;
  unreadForLead: (userId: string) => number;
  reportsForReporter: (userId: string) => SafeguardingReport[];
}

const now = () => new Date().toISOString();

const codeFor = (count: number) => `SG-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

export const useSafeguardingStore = create<SafeguardingState>()(
  persist(
    (set, get) => ({
      safeguardingLeadId: 'u-grace',
      reports: [],
      setLead: (leadId) => set({ safeguardingLeadId: leadId }),
      getLead: () => demoUsers.find((user) => user.id === get().safeguardingLeadId),
      submitReport: (reporter, input) => {
        const timestamp = now();
        const report: SafeguardingReport = {
          ...input,
          id: `sgr-${Date.now()}`,
          reportCode: codeFor(get().reports.length),
          reporterId: input.isAnonymous ? undefined : reporter.id,
          reporterName: input.isAnonymous ? undefined : reporter.name,
          privateReporterId: reporter.id,
          status: 'New',
          createdAt: timestamp,
          updatedAt: timestamp,
          readByLead: false,
          statusHistory: [
            {
              id: `sgh-${Date.now()}`,
              status: 'New',
              updatedBy: reporter.name,
              note: 'Report submitted',
              createdAt: timestamp,
            },
          ],
        };
        set((state) => ({ reports: [report, ...state.reports] }));
        return report;
      },
      markLeadRead: () =>
        set((state) => ({
          reports: state.reports.map((report) => ({ ...report, readByLead: true })),
        })),
      updateStatus: (reportId, status, updatedBy, note = '') => {
        let updated: SafeguardingReport | undefined;
        const timestamp = now();
        set((state) => ({
          reports: state.reports.map((report) => {
            if (report.id !== reportId) return report;
            updated = {
              ...report,
              status,
              updatedAt: timestamp,
              statusHistory: [
                ...report.statusHistory,
                {
                  id: `sgh-${Date.now()}`,
                  status,
                  updatedBy: updatedBy.name,
                  note,
                  createdAt: timestamp,
                },
              ],
            };
            return updated;
          }),
        }));
        return updated;
      },
      updateInternalNotes: (reportId, internalNotes) =>
        set((state) => ({
          reports: state.reports.map((report) => (report.id === reportId ? { ...report, internalNotes } : report)),
        })),
      unreadForLead: (userId) =>
        userId === get().safeguardingLeadId ? get().reports.filter((report) => !report.readByLead).length : 0,
      reportsForReporter: (userId) =>
        get().reports.filter((report) => report.privateReporterId === userId),
    }),
    { name: 'tlmn-safeguarding-v1' }
  )
);
