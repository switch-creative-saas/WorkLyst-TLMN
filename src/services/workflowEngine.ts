import type { WorkflowDefinition, WorkflowInstance } from '@/types/workflow';
import type { NGORequest } from '@/types/ngo';

export function evaluateCondition(
  condition: WorkflowDefinition['steps'][0]['condition'],
  entity: Record<string, unknown>
): boolean {
  if (!condition) return true;
  const val = entity[condition.field];
  switch (condition.operator) {
    case 'gt':
      return Number(val) > Number(condition.value);
    case 'lt':
      return Number(val) < Number(condition.value);
    case 'eq':
      return val === condition.value;
    case 'contains':
      return String(val).includes(String(condition.value));
    default:
      return true;
  }
}

export function getActiveSteps(definition: WorkflowDefinition, entity: Record<string, unknown>) {
  return definition.steps.filter((step) => evaluateCondition(step.condition, entity));
}

export function advanceWorkflow(
  instance: WorkflowInstance,
  definition: WorkflowDefinition,
  action: 'approve' | 'reject'
): WorkflowInstance {
  if (action === 'reject') {
    return { ...instance, status: 'Rejected' };
  }
  const nextIndex = instance.currentStepIndex + 1;
  if (nextIndex >= definition.steps.length) {
    return { ...instance, currentStepIndex: nextIndex, status: 'Completed' };
  }
  return { ...instance, currentStepIndex: nextIndex };
}

export function requestToEntity(request: NGORequest): Record<string, unknown> {
  return {
    amount: request.amount ?? 0,
    type: request.type,
    department: request.department,
  };
}
