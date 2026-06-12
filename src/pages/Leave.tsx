import { useState } from 'react';
import { HrPageShell } from '@/components/layout/HrPageShell';
import { leaveRequests, leaveTypes } from '@/data/leave';
import { Search, ChevronLeft, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Leave() {
  const [activeTab, setActiveTab] = useState('Leave List');
  const tabs = ['Leave List', 'Assign Leave', 'Bulk Assign', 'Apply', 'My Leave Usage'];
  const moreTabs = ['Leave Calendar', 'Entitlements', 'Reports', 'Configure'];


  return (
    <HrPageShell title="Leave" breadcrumbs={[{ label: 'Leave' }]}>
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
            <div className="absolute top-full right-0 w-40 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              {moreTabs.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">{tab}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'Leave List' && (
          <div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-4">
              <h3 className="text-sm font-semibold text-gray-500 mb-4">Search (Please specify your search)</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">From</label>
                  <input type="date" defaultValue="2026-01-01" className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82154F]/20" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">To</label>
                  <input type="date" defaultValue="2027-12-31" className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82154F]/20" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Employee Name</label>
                  <input type="text" placeholder="Type for hints..." className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82154F]/20" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Sub Unit</label>
                  <select className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82154F]/20"><option>All</option></select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Location</label>
                  <select className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82154F]/20"><option>All</option></select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Leave Type</label>
                  <select className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82154F]/20"><option>All</option></select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs text-gray-500 mb-2">Show Leave with Status</label>
                <div className="flex items-center gap-4">
                  {['All', 'Cancelled', 'Pending Approval', 'Scheduled', 'Taken', 'Rejected'].map(status => (
                    <label key={status} className="flex items-center gap-1.5 text-sm text-gray-700">
                      <input type="checkbox" defaultChecked={status === 'Pending Approval'} className="rounded border-gray-300" />
                      {status}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button className="h-10 px-6 bg-[#82154F] hover:bg-[#6F1143] text-white rounded-full text-sm font-medium flex items-center gap-2 transition-colors">
                  <RotateCcw className="w-4 h-4" /> RESET
                </button>
                <button className="h-10 px-6 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm font-medium flex items-center gap-2 transition-colors">
                  <Search className="w-4 h-4" /> SEARCH
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Employee</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Leave Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">From</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">To</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Comments</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {leaveRequests.map(leave => (
                    <tr key={leave.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700">{leave.employeeName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{leave.leaveType}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{leave.fromDate}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{leave.toDate}</td>
                      <td className="px-4 py-3">
                        <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium',
                          leave.status === 'Approved' ? 'bg-green-100 text-green-700' :
                          leave.status === 'Pending Approval' ? 'bg-yellow-100 text-yellow-700' :
                          leave.status === 'Taken' ? 'bg-blue-100 text-blue-700' :
                          leave.status === 'Scheduled' ? 'bg-purple-100 text-purple-700' :
                          'bg-red-100 text-red-700'
                        )}>{leave.status}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{leave.comments}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'Apply' && (
          <div className="max-w-2xl">
            <div className="grid grid-cols-4 gap-3 mb-6">
              {['FMLA - US', 'Paternity Leave', 'PTO', 'Sick Leave - US'].map((type, i) => (
                <div key={type} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center cursor-pointer hover:border-[#82154F]/30 transition-colors">
                  <p className="text-xs text-gray-500 mb-1">{type}</p>
                  <p className="text-2xl font-bold text-gray-400">0.00</p>
                  <p className="text-xs text-gray-400">{i < 2 ? 'Hours' : 'Days'}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <p className="text-sm text-gray-500 mb-4">Select a Leave Type to Proceed</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#82154F] mb-1">Leave Type*</label>
                  <select className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82154F]/20">
                    <option>-- Select --</option>
                    {leaveTypes.map(lt => <option key={lt.id}>{lt.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#82154F] mb-1">From Date*</label>
                    <input type="date" className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82154F]/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#82154F] mb-1">To Date*</label>
                    <input type="date" className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82154F]/20" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Comments</label>
                  <textarea rows={3} placeholder="Add your comments here" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82154F]/20 resize-none" />
                </div>
                <div className="flex justify-end">
                  <button className="h-10 px-6 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm font-medium transition-colors">Apply</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'My Leave Usage' && (
          <div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-4">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Leave Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Leave Period</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Unit</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Entitlements</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Pending Approval</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Scheduled</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Taken</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Net Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {leaveTypes.slice(0, 4).map(lt => (
                    <tr key={lt.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700">{lt.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">2026-01-01 to 2026-12-31</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{lt.durationUnit}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">0.00</td>
                      <td className="px-4 py-3 text-sm text-gray-600">0.00</td>
                      <td className="px-4 py-3 text-sm text-gray-600">0.00</td>
                      <td className="px-4 py-3 text-sm text-gray-600">0.00</td>
                      <td className="px-4 py-3 text-sm text-gray-600">0.00</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'Configure' && (
          <div>
            <div className="flex items-center gap-1 mb-4 border-b border-gray-200">
              {['Leave Period', 'Leave Types', 'Holidays', 'Working Weekends', 'Bradford Factor Threshold'].map(sub => (
                <button key={sub} className="px-3 py-2 text-sm text-gray-600 hover:text-[#82154F]">{sub}</button>
              ))}
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Leave Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Short Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Country</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Duration Unit</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Included In Bradford</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Situational</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Nominate Employee</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Short Term Entitlement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {leaveTypes.map(lt => (
                    <tr key={lt.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700">{lt.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{lt.name.split(' ')[0]}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{lt.country}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{lt.durationUnit}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{lt.includedInBradford ? 'Yes' : 'No'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{lt.situational ? 'Yes' : 'No'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{lt.nominateEmployee ? 'Yes' : 'No'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{lt.shortTermEntitlement ? 'Yes' : 'No'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
    </HrPageShell>
  );
}

