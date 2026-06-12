import { useState } from 'react';
import { HrPageShell } from '@/components/layout/HrPageShell';
import { goals } from '@/data/goals';
import { Search, Filter, Settings, Plus, FileText, Download, Target, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Goals() {
  const [activeTab, setActiveTab] = useState('Goal List');
  const tabs = ['Goal List', 'My Goals', 'Goal Library'];
  const [subTab, setSubTab] = useState<'Goals' | 'OKRs'>('Goals');
  const [statusFilter, setStatusFilter] = useState('All');

  const statusFilters = [
    { key: 'All', count: goals.length },
    { key: 'Pending', count: goals.filter(g => g.status === 'Pending').length },
    { key: 'In Progress', count: goals.filter(g => g.status === 'In Progress').length },
    { key: 'Achieved', count: goals.filter(g => g.status === 'Achieved').length },
    { key: 'Not Achieved', count: goals.filter(g => g.status === 'Not Achieved').length },
    { key: 'On Hold', count: goals.filter(g => g.status === 'On Hold').length },
  ];

  const filteredGoals = statusFilter === 'All' ? goals : goals.filter(g => g.status === statusFilter);

  const priorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-700';
      case 'High': return 'bg-[#82154F]/10 text-[#82154F]';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <HrPageShell title="Goals" breadcrumbs={[{ label: 'Goals' }]}>
    <div>
      

      <div className="bg-glass/40 border-b border-border/40 backdrop-blur-sm px-4">
        <div className="flex items-center gap-1">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={cn('px-4 py-2.5 text-sm font-medium', activeTab === tab ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-gray-600')}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'Goal List' && (
          <div className="flex gap-6">
            {/* Left Panel */}
            <div className="w-56 flex-shrink-0">
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={() => setSubTab('Goals')}
                  className={cn('flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors',
                    subTab === 'Goals' ? 'bg-[#82154F] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}
                >
                  <Target className="w-4 h-4" /> Goals
                </button>
                <button
                  onClick={() => setSubTab('OKRs')}
                  className={cn('flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors',
                    subTab === 'OKRs' ? 'bg-[#82154F] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}
                >
                  <Users className="w-4 h-4" /> OKRs
                </button>
              </div>

              <button className="w-full h-10 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm font-medium flex items-center justify-center gap-2 transition-colors mb-4">
                <Plus className="w-4 h-4" /> Create {subTab === 'Goals' ? 'Goal' : 'Objective'}
              </button>

              <div className="space-y-1">
                {statusFilters.map(sf => (
                  <button
                    key={sf.key}
                    onClick={() => setStatusFilter(sf.key)}
                    className={cn('w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
                      statusFilter === sf.key ? 'bg-[#82154F]/5 text-[#82154F]' : 'text-gray-600 hover:bg-gray-50')}
                  >
                    <span>{sf.key}</span>
                    <span className={cn('text-xs font-medium', statusFilter === sf.key ? 'text-[#82154F]' : 'text-gray-400')}>
                      {sf.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">({filteredGoals.length}) {subTab} Found</span>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Search" className="h-10 pl-9 pr-4 text-sm border border-gray-200 rounded-lg w-48" />
                  </div>
                  <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"><Filter className="w-4 h-4 text-gray-500" /></button>
                  <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"><Settings className="w-4 h-4 text-gray-500" /></button>
                  <button className="h-10 px-3 border border-gray-200 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50">
                    <FileText className="w-4 h-4" /> PDF
                  </button>
                  <button className="h-10 px-3 border border-gray-200 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50">
                    <Download className="w-4 h-4" /> CSV
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 w-10"></th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">{subTab === 'Goals' ? 'Goal' : 'Objective'} Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Weight</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Level</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Owner</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Due Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Priority</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredGoals.map(goal => (
                      <tr key={goal.id} className="hover:bg-gray-50 group">
                        <td className="px-4 py-3">
                          <div className="relative w-8 h-8">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                              <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="12" />
                              <circle cx="50" cy="50" r="40" fill="none" stroke={goal.completion >= 70 ? '#247833' : goal.completion >= 40 ? '#F59E0B' : '#00578A'} strokeWidth="12"
                                strokeDasharray={`${(goal.completion / 100) * 251.2} ${251.2}`} strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-[8px] font-bold">{goal.completion}%</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-gray-900 line-clamp-2">{goal.name}</p>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{goal.weight}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{goal.level}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{goal.owner}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{goal.dueDate}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">{goal.status}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', priorityColor(goal.priority))}>
                            {goal.priority}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'My Goals' && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
            <p className="text-gray-500">My personal goals will appear here</p>
          </div>
        )}

        {activeTab === 'Goal Library' && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
            <p className="text-gray-500">Goal library is empty</p>
          </div>
        )}
      </div>
    </div>
    </HrPageShell>
  );
}


