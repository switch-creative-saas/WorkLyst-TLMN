import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DemoUser, UserRole } from './useAuthStore';

export type WorkflowStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'revision_requested';

export type WorkflowType = 'timesheet' | 'leave' | 'payment' | 'activity_report' | 'concept_note';

export interface WorkflowHistoryEntry {
  approverName: string;
  role: string;
  action: 'submitted' | 'approved' | 'rejected' | 'revision_requested';
  comment: string;
  timestamp: string;
}

export interface WorkflowItem {
  id: string;
  type: WorkflowType;
  submitterId: string;
  submitterName: string;
  title: string;
  summary: string;
  status: WorkflowStatus;
  currentStage: string;
  stages: string[];
  payload: unknown;
  submittedAt: string;
  workflowHistory: WorkflowHistoryEntry[];
}

interface WorkflowState {
  items: WorkflowItem[];
  submitWorkflow: (input: {
    type: WorkflowType;
    submitter: DemoUser;
    title: string;
    summary: string;
    payload: unknown;
  }) => WorkflowItem;
  pendingForRole: (role: UserRole) => WorkflowItem[];
  actOnWorkflow: (
    itemId: string,
    approver: DemoUser,
    action: 'approved' | 'rejected' | 'revision_requested',
    comment?: string
  ) => WorkflowItem | undefined;
}

export const workflowStages: Record<WorkflowType, string[]> = {
  timesheet: ['Employee', 'Supervisor', 'Finance'],
  leave: ['Employee', 'Supervisor', 'HR Manager'],
  payment: ['Employee', 'Supervisor', 'Audit', 'Finance', 'National Director'],
  activity_report: ['Employee', 'Supervisor', 'Program Lead', 'Archive'],
  concept_note: ['Employee', 'Program Lead', 'Finance', 'National Director'],
};

export const workflowLabels: Record<WorkflowType, string> = {
  timesheet: 'Timesheet',
  leave: 'Leave Request',
  payment: 'Payment Request',
  activity_report: 'Activity Report',
  concept_note: 'Concept Note',
};

export const roleStageAliases: Record<UserRole, string[]> = {
  'Employee (ESS)': ['Employee'],
  Supervisor: ['Supervisor'],
  'Program Officer': ['Employee'],
  'Program Lead': ['Program Lead', 'Supervisor'],
  'Audit Officer': ['Audit'],
  'Finance Officer': ['Finance'],
  'HR Officer': ['HR Manager'],
  'HR Manager': ['HR Manager', 'Supervisor'],
  'National Director': ['National Director'],
  Receptionist: ['Employee'],
  'Communications Officer': ['Employee'],
  'Admin / Global Admin': ['Supervisor', 'Program Lead', 'Audit', 'Finance', 'HR Manager', 'National Director'],
  Admin: ['Supervisor', 'Program Lead', 'Audit', 'Finance', 'HR Manager', 'National Director'],
};

const now = () => new Date().toISOString();

export const useWorkflowStore = create<WorkflowState>()(
  persist(
    (set, get) => ({
      items: [],
      submitWorkflow: ({ type, submitter, title, summary, payload }) => {
        const stages = workflowStages[type];
        const nextStage = stages[1] ?? stages[0];
        const item: WorkflowItem = {
          id: `${type}-${Date.now()}`,
          type,
          submitterId: submitter.id,
          submitterName: submitter.name,
          title,
          summary,
          status: 'submitted',
          currentStage: nextStage,
          stages,
          payload,
          submittedAt: now(),
          workflowHistory: [
            {
              approverName: submitter.name,
              role: submitter.role,
              action: 'submitted',
              comment: 'Submitted for approval',
              timestamp: now(),
            },
          ],
        };
        set((state) => ({ items: [item, ...state.items] }));
        return item;
      },
      pendingForRole: (role) => {
        const stages = roleStageAliases[role] ?? [];
        return get().items.filter(
          (item) =>
            ['submitted', 'under_review'].includes(item.status) && stages.includes(item.currentStage)
        );
      },
      actOnWorkflow: (itemId, approver, action, comment = '') => {
        let updatedItem: WorkflowItem | undefined;
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id !== itemId) return item;
            const currentIndex = item.stages.indexOf(item.currentStage);
            const nextStage = item.stages[currentIndex + 1];
            const approvedTerminal = action === 'approved' && (!nextStage || nextStage === 'Archive');
            updatedItem = {
              ...item,
              status:
                action === 'approved'
                  ? approvedTerminal
                    ? 'approved'
                    : 'under_review'
                  : action,
              currentStage:
                action === 'approved'
                  ? approvedTerminal
                    ? 'Completed'
                    : nextStage
                  : item.stages[0],
              workflowHistory: [
                ...item.workflowHistory,
                {
                  approverName: approver.name,
                  role: approver.role,
                  action,
                  comment,
                  timestamp: now(),
                },
              ],
            };
            return updatedItem;
          }),
        }));
        return updatedItem;
      },
    }),
    { name: 'tlmn-workflows' }
  )
);
