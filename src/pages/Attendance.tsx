import { useState } from 'react';
import { HrPageShell } from '@/components/layout/HrPageShell';
import { attendanceSheets, attendanceRecords } from '@/data/common';
import { Search, ChevronLeft, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Attendance() {
  const [activeTab, setActiveTab] = useState('Attendance Sheets');
  const tabs = ['Attendance Sheets', 'Approve Attendance Sheets', 'Employee Records', 'Punch In/Out', 'My Attendance Sheet'];
  const moreTabs = ['Exception Records', 'My Monthly Attendance', 'Pay Policies', 'Data Upload', 'Configurations'];

  return (
    <HrPageShell title="Attendance" breadcrumbs={[{ label: 'Attendance' }]}>
    <div>
      

      <div className="bg-glass/40 border-b border-border/40 backdrop-blur-sm px-4">
        <div className="flex items-center gap-1 overflow-x-auto">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={cn('px-4 py-2.5 text-sm font-medium whitespace-nowrap', activeTab === tab ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-gray-600')}>
              {tab}
            </button>
          ))}
          <div className="relative group">
            <button className="px-4 py-2.5 text-sm font-medium text-gray-600 flex items-center gap-1">More <ChevronLeft className="w-3 h-3 rotate-[-90deg]" /></button>
            <div className="absolute top-full right-0 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              {moreTabs.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">{tab}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'Attendance Sheets' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="Employee Name" className="h-10 pl-9 pr-4 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82154F]/20 w-48" />
                </div>
                <select className="h-10 px-3 text-sm bg-white border border-gray-200 rounded-lg"><option>Pay Policy</option></select>
                <select className="h-10 px-3 text-sm bg-white border border-gray-200 rounded-lg"><option>Location</option></select>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600"><input type="checkbox" className="rounded" /></th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Employee Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Supervisor(s)</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Regular Time</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Overtime</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Double Time</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Total Leave Time</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Total Time</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {attendanceSheets.map(sheet => (
                    <tr key={sheet.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3"><input type="checkbox" className="rounded" /></td>
                      <td className="px-4 py-3 text-sm text-gray-700">{sheet.employeeName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{sheet.supervisors.join(', ')}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{sheet.regularTime}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{sheet.overtime}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{sheet.doubleTime}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{sheet.totalLeaveTime}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{sheet.totalTime}</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">{sheet.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'Employee Records' && (
          <div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-4">
              <div className="grid grid-cols-4 gap-4">
                <div><label className="block text-xs text-gray-500 mb-1">Date Range</label><input type="date" className="w-full h-10 px-3 border border-gray-200 rounded-lg" /></div>
                <div><label className="block text-xs text-gray-500 mb-1">Employee Name</label><input type="text" placeholder="Type for hints" className="w-full h-10 px-3 border border-gray-200 rounded-lg" /></div>
                <div><label className="block text-xs text-gray-500 mb-1">Job Title</label><input type="text" placeholder="Type for hints" className="w-full h-10 px-3 border border-gray-200 rounded-lg" /></div>
                <div><label className="block text-xs text-gray-500 mb-1">Employment Status</label><select className="w-full h-10 px-3 border border-gray-200 rounded-lg"><option>Current Employees Only</option></select></div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Employee ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Employee Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Punch In</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Punch In Note</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Punch Out</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Punch Out Note</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {attendanceRecords.map(rec => (
                    <tr key={rec.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700">{rec.date}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{rec.employeeId}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{rec.employeeName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{rec.punchIn}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{rec.punchInNote || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{rec.punchOut}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{rec.punchOutNote || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{rec.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-end mt-4 text-sm text-gray-500">
              <span>({attendanceRecords.length}) Records Found</span>
            </div>
          </div>
        )}

        {activeTab === 'Punch In/Out' && (
          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Date</label>
                  <input type="text" defaultValue="2026-06-01" readOnly className="w-full h-10 px-3 border border-gray-200 rounded-lg bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Time</label>
                  <div className="flex items-center gap-2">
                    <input type="text" defaultValue="19:02" className="h-10 px-3 border border-gray-200 rounded-lg w-20" />
                    <span className="text-sm text-gray-500">HH:MM</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Note</label>
                  <textarea rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg resize-none" />
                </div>
                <div className="flex justify-center pt-4">
                  <button className="h-12 px-12 bg-green-500 hover:bg-green-600 text-white rounded-full text-lg font-semibold transition-colors">
                    IN
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'My Attendance Sheet' && (
          <div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#82154F]/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-[#82154F]">AH</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Aaron Hamilton</p>
                    <p className="text-xs text-[#82154F]">Punched Out: 05:13 PM (GMT 5.5)</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center"><p className="text-lg font-semibold text-gray-400">0h 00m</p><p className="text-xs text-gray-500">Total Time</p></div>
                  <div className="text-center"><p className="text-lg font-semibold text-gray-400">0h 00m</p><p className="text-xs text-gray-500">Regular Time</p></div>
                  <div className="text-center"><p className="text-lg font-semibold text-gray-400">0h 00m</p><p className="text-xs text-gray-500">Overtime</p></div>
                  <div className="text-center"><p className="text-lg font-semibold text-gray-400">0h 00m</p><p className="text-xs text-gray-500">Double Time</p></div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <p className="text-sm font-medium text-[#82154F] mb-4">0h 00m Today</p>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-gray-500">Status</span>
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">NOT SUBMITTED</span>
              </div>
              <div className="space-y-3">
                {['Mon 03 Jun', 'Tue 04 Jun', 'Wed 05 Jun', 'Thu 06 Jun', 'Fri 07 Jun'].map(day => (
                  <div key={day} className="flex items-center justify-between py-2 border-b border-gray-50">
                    <span className="text-sm text-gray-700">{day}</span>
                    <span className="text-sm text-gray-400">0h 00m</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Configurations' && (
          <div>
            <div className="flex items-center gap-1 mb-4 border-b border-gray-200">
              {['General Configuration', 'Exception Rule Configuration'].map(sub => (
                <button key={sub} className="px-3 py-2 text-sm text-brand-primary border-b-2 border-brand-primary">{sub}</button>
              ))}
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Attendance Configuration</h3>
              <div className="space-y-3">
                {[
                  'Employee can change current time when punching in/out',
                  'Employee can edit/delete own attendance records',
                  'Supervisor/Head of Department can add/edit/delete attendance records of employees',
                ].map(label => (
                  <label key={label} className="flex items-center gap-3 text-sm text-gray-700">
                    <input type="checkbox" className="rounded border-gray-300" />
                    {label}
                  </label>
                ))}
                <label className="flex items-center gap-3 text-sm text-gray-700">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                  Pay Policies enabled
                </label>
                <label className="flex items-center gap-3 text-sm text-gray-700">
                  <input type="checkbox" className="rounded border-gray-300" />
                  IP based Punch In/Out restriction enabled
                </label>
              </div>
              <div className="flex justify-end mt-6">
                <button className="h-10 px-6 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm font-medium transition-colors flex items-center gap-2">
                  <Save className="w-4 h-4" /> SAVE
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </HrPageShell>
  );
}

