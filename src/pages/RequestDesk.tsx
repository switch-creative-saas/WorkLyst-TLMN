import { useState } from 'react';
import { HrPageShell } from '@/components/layout/HrPageShell';
import { requestDeskItems } from '@/data/common';
import { Search, Plus, ChevronLeft, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export function RequestDesk() {
  const [activeTab, setActiveTab] = useState('Employee Requests');
  const tabs = ['Employee Requests', 'General Requests', 'Employee My Requests', 'Configure Request Type'];
  const moreTabs = ['Hiring Requests', 'Employee Hiring Requests', 'Configure Hiring Request', 'Employee Request Flows'];

  const statusColor = (status: string) => {
    switch (status) {
      case 'Submitted': return 'bg-blue-100 text-blue-700';
      case 'In Progress': return 'bg-yellow-100 text-yellow-700';
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'Cancelled': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const priorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'text-red-600';
      case 'Reasonably Urgent': return 'text-[#82154F]';
      case 'Not Urgent': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <HrPageShell title="Request Desk" breadcrumbs={[{ label: 'Request Desk' }]}>
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
            <div className="absolute top-full right-0 w-56 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              {moreTabs.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">{tab}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'Employee Requests' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <button className="h-10 px-4 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm font-medium flex items-center gap-2 transition-colors">
                  <Plus className="w-4 h-4" /> Submit Request
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search" className="h-10 pl-9 pr-4 text-sm border border-gray-200 rounded-lg w-48" />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600"><input type="checkbox" className="rounded" /></th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Request ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Request Title</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Request Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Priority</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Employee Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Submitted Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Due Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">View Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {requestDeskItems.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3"><input type="checkbox" className="rounded" /></td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.requestId}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.title}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.requestType}</td>
                      <td className="px-4 py-3">
                        <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', statusColor(item.status))}>{item.status}</span>
                      </td>
                      <td className={cn('px-4 py-3 text-sm font-medium', priorityColor(item.priority))}>{item.priority}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.employeeName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.submittedDate}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.dueDate}</td>
                      <td className="px-4 py-3">
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <TrendingUp className="w-4 h-4 text-gray-500" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'Employee Request Flows' && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v-2h-2v2zm0-4h2V7h-2v6z" />
              </svg>
            </div>
            <p className="text-gray-500 mb-2">No Flows Found</p>
            <p className="text-sm text-gray-400">Sorry, No Data Found!</p>
          </div>
        )}
      </div>
    </div>
    </HrPageShell>
  );
}

