import type { WorkflowDefinition } from '@/types/workflow';

export const workflowDefinitions: WorkflowDefinition[] = [
  {
    id: 'wf-1',
    name: 'Travel Request Approval',
    entityType: 'Travel',
    active: true,
    steps: [
      { id: 'st1', name: 'Supervisor', role: 'Supervisor', order: 1, deadlineDays: 2 },
      { id: 'st2', name: 'Program Manager', role: 'Program Manager', order: 2, deadlineDays: 3 },
      { id: 'st3', name: 'Finance', role: 'Finance Officer', order: 3, deadlineDays: 2, escalateTo: 'Finance Director' },
    ],
  },
  {
    id: 'wf-2',
    name: 'Procurement Approval',
    entityType: 'Procurement',
    active: true,
    steps: [
      { id: 'st1', name: 'Supervisor', role: 'Supervisor', order: 1 },
      {
        id: 'st2',
        name: 'Finance Review',
        role: 'Finance Officer',
        order: 2,
        condition: { field: 'amount', operator: 'gt', value: 100000 },
      },
      { id: 'st3', name: 'Director', role: 'Program Director', order: 3, condition: { field: 'amount', operator: 'gt', value: 500000 } },
    ],
  },
];
