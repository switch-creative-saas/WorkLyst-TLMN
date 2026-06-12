export interface WorkflowStep {
  id: string;
  name: string;
  role: string;
  order: number;
  deadlineDays?: number;
  escalateTo?: string;
  condition?: WorkflowCondition;
}

export interface WorkflowCondition {
  field: string;
  operator: 'gt' | 'lt' | 'eq' | 'contains';
  value: string | number;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  entityType: string;
  steps: WorkflowStep[];
  active: boolean;
}

export interface WorkflowInstance {
  id: string;
  definitionId: string;
  entityId: string;
  entityType: string;
  currentStepIndex: number;
  status: 'Active' | 'Completed' | 'Rejected';
  startedAt: string;
}
