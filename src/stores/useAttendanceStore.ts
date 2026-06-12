import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { demoUsers, type DemoUser } from '@/stores/useAuthStore';

export type AttendanceStatus =
  | 'Present'
  | 'Late'
  | 'Absent'
  | 'Early Departure'
  | 'Present - Full Day'
  | 'Present - No Sign Out';

export interface AttendanceConfig {
  workStartTime: string;
  workEndTime: string;
  gracePeriodMinutes: number;
  earlyDepartureMinutes: number;
  workDays: string[];
  breakDurationMinutes: number;
  notifyLate: boolean;
  notifyAbsent: boolean;
  dailySummaryToHR: boolean;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeePhoto: string;
  date: string;
  signInTime?: string;
  signOutTime?: string;
  status: AttendanceStatus;
  minutesLate: number;
  minutesEarly: number;
}

export interface ScanResult {
  ok: boolean;
  action?: 'SIGNED IN' | 'SIGNED OUT';
  record?: AttendanceRecord;
  employee?: DemoUser;
  message: string;
}

interface AttendanceState {
  config: AttendanceConfig;
  records: AttendanceRecord[];
  scannerAccessCode: string;
  scannerAuthorized: boolean;
  offlineQueue: Array<{ qrPayload: string; deviceId: string; queuedAt: string }>;
  updateConfig: (partial: Partial<AttendanceConfig>) => void;
  generateScannerCode: () => string;
  authorizeScanner: (code: string) => boolean;
  revokeScanner: () => void;
  scanQrPayload: (qrPayload: string, deviceId?: string, now?: Date) => ScanResult;
  queueScan: (qrPayload: string, deviceId: string) => void;
  syncQueuedScans: () => ScanResult[];
  recordsForEmployee: (employeeId: string) => AttendanceRecord[];
  todaysRecords: () => AttendanceRecord[];
  summary: () => { expected: number; present: number; late: number; absent: number; notYetIn: number };
}

const defaultConfig: AttendanceConfig = {
  workStartTime: '08:00',
  workEndTime: '17:00',
  gracePeriodMinutes: 15,
  earlyDepartureMinutes: 30,
  workDays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
  breakDurationMinutes: 60,
  notifyLate: true,
  notifyAbsent: true,
  dailySummaryToHR: true,
};

const dayCodes = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const dateKey = (date: Date) => date.toISOString().slice(0, 10);

const timeOnDate = (date: Date, time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  const next = new Date(date);
  next.setHours(hours || 0, minutes || 0, 0, 0);
  return next;
};

const minutesBetween = (a: Date, b: Date) => Math.max(0, Math.round((a.getTime() - b.getTime()) / 60000));

export const qrPayloadForEmployee = (employeeId: string, date = new Date()) =>
  `TLMN-EMP-${employeeId}-${dateKey(date).replaceAll('-', '')}`;

const employeeFromQr = (payload: string) =>
  demoUsers.find((user) => payload.includes(user.employeeId) || payload.includes(user.id));

export const useAttendanceStore = create<AttendanceState>()(
  persist(
    (set, get) => ({
      config: defaultConfig,
      records: [],
      scannerAccessCode: 'SCAN-TLMN-2026',
      scannerAuthorized: false,
      offlineQueue: [],
      updateConfig: (partial) => set((state) => ({ config: { ...state.config, ...partial } })),
      generateScannerCode: () => {
        const code = `SCAN-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
        set({ scannerAccessCode: code });
        return code;
      },
      authorizeScanner: (code) => {
        const ok = code.trim().toUpperCase() === get().scannerAccessCode;
        if (ok) set({ scannerAuthorized: true });
        return ok;
      },
      revokeScanner: () => set({ scannerAuthorized: false }),
      queueScan: (qrPayload, deviceId) =>
        set((state) => ({
          offlineQueue: [...state.offlineQueue, { qrPayload, deviceId, queuedAt: new Date().toISOString() }],
        })),
      syncQueuedScans: () => {
        const queued = get().offlineQueue;
        const results = queued.map((scan) => get().scanQrPayload(scan.qrPayload, scan.deviceId));
        set({ offlineQueue: [] });
        return results;
      },
      scanQrPayload: (qrPayload, _deviceId = 'scanner-tablet', now = new Date()) => {
        const employee = employeeFromQr(qrPayload);
        if (!employee) return { ok: false, message: 'Unrecognized QR code' };
        if (employee.status === 'Disabled') return { ok: false, employee, message: 'Account disabled' };

        const { config } = get();
        const todayCode = dayCodes[now.getDay()];
        if (!config.workDays.includes(todayCode)) {
          return { ok: false, employee, message: 'Outside configured work day' };
        }

        const today = dateKey(now);
        const existing = get().records.find((record) => record.employeeId === employee.id && record.date === today);
        const startWithGrace = new Date(timeOnDate(now, config.workStartTime).getTime() + config.gracePeriodMinutes * 60000);
        const signOutThreshold = new Date(timeOnDate(now, config.workEndTime).getTime() - config.earlyDepartureMinutes * 60000);

        if (!existing) {
          const late = now > startWithGrace;
          const minutesLate = late ? minutesBetween(now, startWithGrace) : 0;
          const record: AttendanceRecord = {
            id: `att-${Date.now()}`,
            employeeId: employee.id,
            employeeName: employee.name,
            employeePhoto: employee.avatar,
            date: today,
            signInTime: now.toISOString(),
            status: late ? 'Late' : 'Present',
            minutesLate,
            minutesEarly: 0,
          };
          set((state) => ({ records: [record, ...state.records] }));
          return {
            ok: true,
            action: 'SIGNED IN',
            employee,
            record,
            message: late ? `LATE - ${minutesLate} mins late` : 'SIGNED IN',
          };
        }

        if (existing.signOutTime) {
          return { ok: false, employee, record: existing, message: 'Already scanned in and out today' };
        }

        const early = now < signOutThreshold;
        const minutesEarly = early ? minutesBetween(signOutThreshold, now) : 0;
        const nextRecord: AttendanceRecord = {
          ...existing,
          signOutTime: now.toISOString(),
          status: early ? 'Early Departure' : 'Present - Full Day',
          minutesEarly,
        };
        set((state) => ({
          records: state.records.map((record) => (record.id === existing.id ? nextRecord : record)),
        }));
        return {
          ok: true,
          action: 'SIGNED OUT',
          employee,
          record: nextRecord,
          message: early ? `EARLY DEPARTURE - ${minutesEarly} mins early` : 'SIGNED OUT',
        };
      },
      recordsForEmployee: (employeeId) => get().records.filter((record) => record.employeeId === employeeId),
      todaysRecords: () => get().records.filter((record) => record.date === dateKey(new Date())),
      summary: () => {
        const today = get().todaysRecords();
        const expected = demoUsers.filter((user) => user.status === 'Active').length;
        const present = today.filter((record) => record.status.includes('Present')).length;
        const late = today.filter((record) => record.status === 'Late').length;
        const absent = today.filter((record) => record.status === 'Absent').length;
        return { expected, present, late, absent, notYetIn: Math.max(0, expected - today.length) };
      },
    }),
    { name: 'tlmn-attendance-config-v1' }
  )
);
