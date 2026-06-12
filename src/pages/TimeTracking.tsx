import { useState } from 'react';
import { HrPageShell } from '@/components/layout/HrPageShell';
import { attendanceSheets } from '@/data/common';
import { Edit, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function TimeTracking() {
  const [activeTab, setActiveTab] = useState('Employee Timesheets');
  const tabs = ['Employee Timesheets', 'My Timesheets', 'Activity Info', 'Configuration'];

  return (
    <HrPageShell title="Time Tracking" breadcrumbs={[{ label: 'Time Tracking' }]}>
    <div>
      

      <div className="bg-glass/40 border-b border-border/40 backdrop-blur-sm px-4">
        <div className="flex items-center gap-1 overflow-x-auto">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={cn('px-4 py-2.5 text-sm font-medium whitespace-nowrap', activeTab === tab ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-gray-600')}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'Employee Timesheets' && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
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
                    <td className="px-4 py-3 text-sm text-gray-700">{sheet.employeeName}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{sheet.supervisors.join(', ')}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{sheet.regularTime}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{sheet.overtime}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{sheet.doubleTime}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{sheet.totalLeaveTime}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{sheet.totalTime}</td>
                    <td className="px-4 py-3">
                      <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', sheet.status === 'Submitted' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700')}>
                        {sheet.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'My Timesheets' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Timesheet</span>
                <select className="h-10 px-3 border border-gray-200 rounded-lg text-sm">
                  <option>2026-06-01 to 2026-06-07</option>
                </select>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">Status: <span className="text-yellow-600 font-medium">Not Submitted</span></span>
                <button className="h-10 px-4 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2">
                  Create timesheet
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Project Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Activity Name</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-[#82154F]">Mon 1</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-[#82154F]">Tue 2</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-[#82154F]">Wed 3</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-[#82154F]">Thu 4</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-[#82154F]">Fri 5</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Sat 6</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Sun 7</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={10} className="px-4 py-12 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 6v6l4 2" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-500">No Records Found</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>H - Holiday</span>
                <span>L - Leave</span>
                <span>W - Weekend</span>
                <span>* Full day-off</span>
                <span>* Partial day-off</span>
              </div>
              <div className="flex items-center gap-3">
                <button className="h-10 px-6 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm font-medium transition-colors flex items-center gap-2">
                  <Edit className="w-4 h-4" /> EDIT
                </button>
                <button className="h-10 px-6 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm font-medium transition-colors flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> SUBMIT
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Activity Info' && (
          <div>
            <div className="flex items-center gap-1 mb-4 border-b border-gray-200">
              {['Customers', 'Projects', 'Common Activities'].map(sub => (
                <button key={sub} className="px-3 py-2 text-sm text-gray-600 hover:text-[#82154F]">{sub}</button>
              ))}
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Common Activities</h3>
              {['Applied Leave', 'Entertainment', 'Public Holiday', 'Tea break', 'Team meetings'].map(activity => (
                <div key={activity} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-700">{activity}</span>
                  <div className="flex items-center gap-2 opacity-0 hover:opacity-100 transition-opacity">
                    <button className="p-1 hover:bg-gray-100 rounded"><Edit className="w-4 h-4 text-gray-500" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    </HrPageShell>
  );
}

