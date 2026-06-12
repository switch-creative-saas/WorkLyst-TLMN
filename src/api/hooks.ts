import { useQuery } from '@tanstack/react-query';
import { mockDb } from './mockStore';

export function usePrograms() {
  return useQuery({
    queryKey: ['programs'],
    queryFn: async () => mockDb.programs,
  });
}

export function useProgram(id: string) {
  return useQuery({
    queryKey: ['programs', id],
    queryFn: async () => mockDb.programs.find((p) => p.id === id),
    enabled: !!id,
  });
}

export function useActivities(programId?: string) {
  return useQuery({
    queryKey: ['activities', programId],
    queryFn: async () =>
      programId
        ? mockDb.activities.filter((a) => a.programId === programId)
        : mockDb.activities,
  });
}

export function useRequests(type?: string) {
  return useQuery({
    queryKey: ['requests', type],
    queryFn: async () =>
      type ? mockDb.requests.filter((r) => r.type === type) : mockDb.requests,
  });
}

export function useDocuments() {
  return useQuery({
    queryKey: ['documents'],
    queryFn: async () => mockDb.documents,
  });
}

export function useNGOReports() {
  return useQuery({
    queryKey: ['ngo-reports'],
    queryFn: async () => mockDb.reports,
  });
}

export function useWorkflows() {
  return useQuery({
    queryKey: ['workflows'],
    queryFn: async () => mockDb.workflows,
  });
}

export function useAuditItems() {
  return useQuery({
    queryKey: ['audit'],
    queryFn: async () => mockDb.auditItems,
  });
}

export function useTimesheets() {
  return useQuery({
    queryKey: ['timesheets'],
    queryFn: async () => mockDb.timesheets,
  });
}

export function useAttendance() {
  return useQuery({
    queryKey: ['attendance-qr'],
    queryFn: async () => mockDb.attendance,
  });
}

export function useBudgetLines() {
  return useQuery({
    queryKey: ['budget'],
    queryFn: async () => mockDb.budgetLines,
  });
}
