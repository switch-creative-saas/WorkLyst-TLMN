import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DemoUser, UserRole } from '@/stores/useAuthStore';

export type AnnouncementType = 'News' | 'Policy Update' | 'Event' | 'General Announcement' | 'Emergency Notice';
export type AnnouncementVisibility = 'All Staff' | 'HR Only' | 'Program Staff' | 'Finance & Audit';

export interface AnnouncementRecord {
  id: string;
  title: string;
  type: AnnouncementType;
  body: string;
  thumbnail?: string;
  visibility: AnnouncementVisibility;
  pinned: boolean;
  publishDate: string;
  expiryDate?: string;
  createdById: string;
  createdByName: string;
  createdByRole: UserRole;
  createdAt: string;
}

interface AnnouncementState {
  announcements: AnnouncementRecord[];
  canManage: (role: UserRole) => boolean;
  createAnnouncement: (input: Omit<AnnouncementRecord, 'id' | 'createdById' | 'createdByName' | 'createdByRole' | 'createdAt'>, user: DemoUser) => AnnouncementRecord | undefined;
  deleteAnnouncement: (id: string, role: UserRole) => boolean;
}

export const announcementManagers: UserRole[] = [
  'Communications Officer',
  'Receptionist',
  'HR Manager',
  'HR Officer',
  'Admin',
  'Admin / Global Admin',
];

export const useAnnouncementsStore = create<AnnouncementState>()(
  persist(
    (set, get) => ({
      announcements: [
        {
          id: 'ann-001',
          title: 'TLMN digital operations briefing',
          type: 'News',
          body: 'All staff are encouraged to use DOHRMP for leave, attendance, requests, and reports from this week.',
          visibility: 'All Staff',
          pinned: true,
          publishDate: new Date().toISOString(),
          createdById: 'u-ada',
          createdByName: 'Ada Balogun',
          createdByRole: 'Communications Officer',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'ann-002',
          title: 'Front desk visitor process updated',
          type: 'News',
          body: 'Visitors should now be logged digitally at reception before proceeding to host offices.',
          visibility: 'All Staff',
          pinned: false,
          publishDate: new Date().toISOString(),
          createdById: 'u-amina',
          createdByName: 'Amina Yusuf',
          createdByRole: 'Receptionist',
          createdAt: new Date().toISOString(),
        },
      ],
      canManage: (role) => announcementManagers.includes(role),
      createAnnouncement: (input, user) => {
        if (!get().canManage(user.role)) return undefined;
        const record: AnnouncementRecord = {
          ...input,
          id: `ann-${Date.now()}`,
          createdById: user.id,
          createdByName: user.name,
          createdByRole: user.role,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ announcements: [record, ...state.announcements] }));
        return record;
      },
      deleteAnnouncement: (id, role) => {
        if (!get().canManage(role)) return false;
        set((state) => ({ announcements: state.announcements.filter((item) => item.id !== id) }));
        return true;
      },
    }),
    { name: 'tlmn-announcements-v1' }
  )
);
