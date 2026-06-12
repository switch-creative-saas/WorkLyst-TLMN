import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { demoUsers, type DemoUser, type UserRole } from '@/stores/useAuthStore';

export type UnifiedRequestType =
  | 'Program Activity Request'
  | 'Procurement Request'
  | 'Travel Request'
  | 'Asset Request'
  | 'General Payment Request'
  | 'Budget Request';

export type UnifiedRequestStatus =
  | 'Draft'
  | 'Submitted'
  | 'Under Review'
  | 'Revision Required'
  | 'Rejected'
  | 'Awaiting ND Approval'
  | 'Disbursed';

export interface BudgetLineItem {
  id: string;
  description: string;
  unit: string;
  qty: number;
  unitCost: number;
  total: number;
}

export interface RequestAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: string;
}

export interface RequestSignature {
  id: string;
  stage: string;
  signedById: string;
  signedByName: string;
  signedName: string;
  action: 'Submitted' | 'Approved' | 'SentBack' | 'Rejected';
  comment?: string;
  ipAddress?: string;
  signedAt: string;
}

export interface FinanceDisbursement {
  paymentMethod: 'Cash' | 'Bank Transfer' | 'Cheque';
  paymentDate: string;
  transactionRef: string;
  paymentEvidenceUrl?: string;
  amountDisbursed: number;
  financeNotes?: string;
}

export interface UnifiedRequestInput {
  title: string;
  requestType: UnifiedRequestType;
  fundSource: string;
  otherFundSource?: string;
  thematicArea: string;
  project: string;
  station: string;
  dateOfRequest: string;
  background: string;
  objectives: string;
  plannedActivities: string;
  expectedOutputs: string;
  expectedOutcomes: string;
  startDate: string;
  endDate: string;
  implementingTeam: string;
  lineItems: BudgetLineItem[];
  totalAmount: number;
  amountInWords: string;
  beingPaymentFor: string;
  attachments: RequestAttachment[];
}

export interface UnifiedRequest extends UnifiedRequestInput {
  id: string;
  requestCode: string;
  requestingOfficerId: string;
  requestingOfficerName: string;
  requestingOfficerDesignation: string;
  status: UnifiedRequestStatus;
  currentStage: string;
  workflowChain: string[];
  returnToStage?: string;
  revisionComment?: string;
  revisionFrom?: string;
  signatures: RequestSignature[];
  financeDisbursement?: FinanceDisbursement;
  createdAt: string;
  updatedAt: string;
}

interface UnifiedRequestState {
  requests: UnifiedRequest[];
  ndApprovalThreshold: number;
  submitRequest: (input: UnifiedRequestInput, user: DemoUser, signedName: string) => UnifiedRequest;
  approveRequest: (
    requestId: string,
    user: DemoUser,
    signedName: string,
    comment?: string,
    financeDisbursement?: FinanceDisbursement
  ) => UnifiedRequest | undefined;
  sendBackRequest: (requestId: string, user: DemoUser, comment: string) => UnifiedRequest | undefined;
  rejectRequest: (requestId: string, user: DemoUser, comment: string) => UnifiedRequest | undefined;
  resubmitRequest: (requestId: string, user: DemoUser, signedName: string, input?: Partial<UnifiedRequestInput>) => UnifiedRequest | undefined;
  pendingForRole: (role: UserRole) => UnifiedRequest[];
  pendingForUser: (user: DemoUser) => UnifiedRequest[];
  visibleForUser: (user: DemoUser) => UnifiedRequest[];
  canViewRequest: (request: UnifiedRequest, user: DemoUser) => boolean;
  requestForId: (requestId: string | undefined) => UnifiedRequest | undefined;
}

const ROLE_STAGE: Partial<Record<UserRole, string[]>> = {
  Supervisor: ['Supervisor'],
  'Program Lead': ['Program Lead'],
  'Audit Officer': ['Audit'],
  'Finance Officer': ['Finance'],
  'HR Officer': ['HR'],
  'HR Manager': ['HR'],
  'National Director': ['National Director'],
  Admin: ['Supervisor', 'Program Lead', 'Audit', 'Finance', 'HR', 'National Director'],
  'Admin / Global Admin': ['Supervisor', 'Program Lead', 'Audit', 'Finance', 'HR', 'National Director'],
};

const baseChains: Record<UnifiedRequestType, string[]> = {
  'Program Activity Request': ['Submitter', 'Program Lead', 'Audit', 'Finance', 'National Director'],
  'Procurement Request': ['Submitter', 'Supervisor', 'Audit', 'Finance', 'National Director'],
  'Travel Request': ['Submitter', 'Supervisor', 'HR', 'Finance'],
  'Asset Request': ['Submitter', 'Supervisor', 'Audit', 'Finance'],
  'General Payment Request': ['Submitter', 'Supervisor', 'Audit', 'Finance', 'National Director'],
  'Budget Request': ['Submitter', 'Program Lead', 'Finance', 'National Director'],
};

export const unifiedRequestTypes = Object.keys(baseChains) as UnifiedRequestType[];

export const getWorkflowChain = (requestType: UnifiedRequestType, totalAmount: number, threshold = 500000) => {
  const chain = baseChains[requestType];
  const conditionalNdTypes: UnifiedRequestType[] = [
    'Program Activity Request',
    'Procurement Request',
    'General Payment Request',
  ];
  if (conditionalNdTypes.includes(requestType) && totalAmount < threshold) {
    return chain.filter((stage) => stage !== 'National Director');
  }
  return chain;
};

const now = () => new Date().toISOString();
const newId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const requestCodeFor = (requests: UnifiedRequest[]) => {
  const year = new Date().getFullYear();
  const next = requests.filter((request) => request.requestCode.includes(`${year}`)).length + 1;
  return `REQ-${year}-${String(next).padStart(3, '0')}`;
};

const publicIpPlaceholder = () => 'local-demo';

const signatureFor = (
  stage: string,
  user: DemoUser,
  signedName: string,
  action: RequestSignature['action'],
  comment?: string
): RequestSignature => ({
  id: newId('sig'),
  stage,
  signedById: user.id,
  signedByName: user.name,
  signedName,
  action,
  comment,
  ipAddress: publicIpPlaceholder(),
  signedAt: now(),
});

const nextStageAfter = (request: UnifiedRequest, stage: string) => {
  const index = request.workflowChain.indexOf(stage);
  return index >= 0 ? request.workflowChain[index + 1] : undefined;
};

export const stageForRole = (role: UserRole) => ROLE_STAGE[role] ?? [];

const privilegedRoles: UserRole[] = ['Admin', 'Admin / Global Admin', 'HR Manager', 'HR Officer'];

const submitterForRequest = (request: UnifiedRequest) =>
  demoUsers.find((user) => user.id === request.requestingOfficerId);

const sharesThematic = (request: UnifiedRequest, user: DemoUser) => {
  const leadThematics = new Set(user.thematics ?? []);
  if (leadThematics.has(request.thematicArea)) return true;
  return user.assignedProjects.includes(request.project);
};

const canUserViewRequest = (request: UnifiedRequest, user: DemoUser) => {
  if (request.requestingOfficerId === user.id) return true;
  if (privilegedRoles.includes(user.role)) return true;

  if (user.role === 'National Director') return request.workflowChain.includes('National Director');
  if (user.role === 'Audit Officer') return request.workflowChain.includes('Audit');
  if (user.role === 'Finance Officer') return request.workflowChain.includes('Finance');

  if (user.role === 'Program Lead') {
    return request.workflowChain.includes('Program Lead') && sharesThematic(request, user);
  }

  if (user.role === 'Supervisor') {
    const submitter = submitterForRequest(request);
    return request.workflowChain.includes('Supervisor') && submitter?.supervisor === user.name;
  }

  return false;
};

const isActiveApprovalStatus = (status: UnifiedRequestStatus) =>
  status === 'Submitted' || status === 'Under Review' || status === 'Awaiting ND Approval';

export const useUnifiedRequestStore = create<UnifiedRequestState>()(
  persist(
    (set, get) => ({
      requests: [],
      ndApprovalThreshold: 500000,
      submitRequest: (input, user, signedName) => {
        const timestamp = now();
        const workflowChain = getWorkflowChain(input.requestType, input.totalAmount, get().ndApprovalThreshold);
        const request: UnifiedRequest = {
          ...input,
          id: newId('req'),
          requestCode: requestCodeFor(get().requests),
          requestingOfficerId: user.id,
          requestingOfficerName: user.name,
          requestingOfficerDesignation: user.designation,
          status: 'Under Review',
          currentStage: workflowChain[1] ?? 'Finance',
          workflowChain,
          signatures: [signatureFor('Submitter', user, signedName, 'Submitted')],
          createdAt: timestamp,
          updatedAt: timestamp,
        };
        set((state) => ({ requests: [request, ...state.requests] }));
        return request;
      },
      approveRequest: (requestId, user, signedName, comment, financeDisbursement) => {
        let updated: UnifiedRequest | undefined;
        set((state) => ({
          requests: state.requests.map((request) => {
            if (request.id !== requestId) return request;
            const nextStage = nextStageAfter(request, request.currentStage);
            const disbursement = request.currentStage === 'Finance' ? financeDisbursement : request.financeDisbursement;
            const status: UnifiedRequestStatus = nextStage
              ? nextStage === 'National Director'
                ? 'Awaiting ND Approval'
                : 'Under Review'
              : 'Disbursed';
            updated = {
              ...request,
              status,
              currentStage: nextStage ?? 'Completed',
              financeDisbursement: disbursement,
              signatures: [
                ...request.signatures,
                signatureFor(request.currentStage, user, signedName, 'Approved', comment),
              ],
              updatedAt: now(),
            };
            return updated;
          }),
        }));
        return updated;
      },
      sendBackRequest: (requestId, user, comment) => {
        let updated: UnifiedRequest | undefined;
        set((state) => ({
          requests: state.requests.map((request) => {
            if (request.id !== requestId) return request;
            updated = {
              ...request,
              status: 'Revision Required',
              returnToStage: request.currentStage,
              currentStage: 'Submitter',
              revisionComment: comment,
              revisionFrom: user.name,
              signatures: [
                ...request.signatures,
                signatureFor(request.currentStage, user, user.name, 'SentBack', comment),
              ],
              updatedAt: now(),
            };
            return updated;
          }),
        }));
        return updated;
      },
      rejectRequest: (requestId, user, comment) => {
        let updated: UnifiedRequest | undefined;
        set((state) => ({
          requests: state.requests.map((request) => {
            if (request.id !== requestId) return request;
            updated = {
              ...request,
              status: 'Rejected',
              signatures: [
                ...request.signatures,
                signatureFor(request.currentStage, user, user.name, 'Rejected', comment),
              ],
              updatedAt: now(),
            };
            return updated;
          }),
        }));
        return updated;
      },
      resubmitRequest: (requestId, user, signedName, input) => {
        let updated: UnifiedRequest | undefined;
        set((state) => ({
          requests: state.requests.map((request) => {
            if (request.id !== requestId) return request;
            const patched = { ...request, ...input };
            const workflowChain = getWorkflowChain(patched.requestType, patched.totalAmount, get().ndApprovalThreshold);
            updated = {
              ...patched,
              workflowChain,
              status: 'Under Review',
              currentStage: request.returnToStage ?? workflowChain[1] ?? 'Finance',
              returnToStage: undefined,
              revisionComment: undefined,
              revisionFrom: undefined,
              signatures: [
                ...request.signatures,
                signatureFor('Submitter', user, signedName, 'Submitted', 'Resubmitted after correction'),
              ],
              updatedAt: now(),
            };
            return updated;
          }),
        }));
        return updated;
      },
      pendingForRole: (role) => {
        const stages = stageForRole(role);
        return get().requests.filter((request) => stages.includes(request.currentStage) && isActiveApprovalStatus(request.status));
      },
      pendingForUser: (user) => {
        const stages = stageForRole(user.role);
        return get().requests.filter(
          (request) => stages.includes(request.currentStage) && isActiveApprovalStatus(request.status) && canUserViewRequest(request, user)
        );
      },
      visibleForUser: (user) => get().requests.filter((request) => canUserViewRequest(request, user)),
      canViewRequest: (request, user) => canUserViewRequest(request, user),
      requestForId: (requestId) =>
        get().requests.find((request) => request.id === requestId || request.requestCode.toLowerCase() === requestId?.toLowerCase()),
    }),
    { name: 'tlmn-unified-requests-v1' }
  )
);
