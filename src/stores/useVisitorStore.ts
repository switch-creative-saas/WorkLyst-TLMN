import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DemoUser } from '@/stores/useAuthStore';

export interface VisitorRecord {
  id: string;
  visitorName: string;
  visitorPhone?: string;
  hostEmployeeId: string;
  hostEmployeeName: string;
  purpose: string;
  checkInTime: string;
  checkOutTime?: string;
  expectedDuration: string;
  status: 'Checked In' | 'Checked Out';
  photoUrl?: string;
  loggedById: string;
  createdAt: string;
}

interface VisitorState {
  visitors: VisitorRecord[];
  logVisitor: (input: Omit<VisitorRecord, 'id' | 'status' | 'createdAt' | 'loggedById'>, loggedBy: DemoUser) => VisitorRecord;
  checkOut: (visitorId: string) => void;
}

const todayIso = () => new Date().toISOString();

export const useVisitorStore = create<VisitorState>()(
  persist(
    (set) => ({
      visitors: [
        {
          id: 'vis-001',
          visitorName: 'Maryam Sani',
          visitorPhone: '0803 000 1122',
          hostEmployeeId: 'u-aaron',
          hostEmployeeName: 'Aaron Hamilton',
          purpose: 'HR onboarding documentation',
          checkInTime: new Date().toISOString(),
          expectedDuration: '1 hr',
          status: 'Checked In',
          loggedById: 'u-amina',
          createdAt: new Date().toISOString(),
        },
      ],
      logVisitor: (input, loggedBy) => {
        const record: VisitorRecord = {
          ...input,
          id: `vis-${Date.now()}`,
          status: 'Checked In',
          loggedById: loggedBy.id,
          createdAt: todayIso(),
        };
        set((state) => ({ visitors: [record, ...state.visitors] }));
        return record;
      },
      checkOut: (visitorId) =>
        set((state) => ({
          visitors: state.visitors.map((visitor) =>
            visitor.id === visitorId
              ? { ...visitor, status: 'Checked Out', checkOutTime: todayIso() }
              : visitor
          ),
        })),
    }),
    { name: 'tlmn-visitor-log-v1' }
  )
);
