import { useState } from 'react';
import { HrPageShell } from '@/components/layout/HrPageShell';
import { appraisalCycles, performanceTrackers } from '@/data/common';
import { Search, Plus, Trash2, Pencil, Download, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Performance() {
  const [activeTab, setActiveTab] = useState('Appraisal List');
  const tabs = ['Appraisal List', 'Appraisal Cycles', 'My Appraisals', 'Performance Trackers'];
  const [cycleFilter, setCycleFilter] = useState('All');

  const cycleFilters = [
    { key: 'All', count: 12 },
    { key: 'Created', count: 7 },
    { key: 'Appraisals Created', count: 0 },
    { key: 'Activated', count: 5 },
    { key: 'Closed', count: 0 },
    { key: 'Reopened', count: 0 },
  ];

  const statusColor = (status: string) => {
    switch (status) {
      case 'Created': return 'bg-blue-100 text-blue-700';
      case 'Activated': return 'bg-green-100 text-green-700';
      case 'Closed': return 'bg-gray-100 text-gray-700';
      case 'Reopened': return 'bg-[#82154F]/10 text-[#82154F]';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <HrPageShell title="Performance" breadcrumbs={[{ label: 'Performance' }]}>
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
        {activeTab === 'Appraisal Cycles' && (
          <div className="flex gap-6">
            {/* Left Panel */}
            <div className="w-48 flex-shrink-0">
              <button className="w-full h-10 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm font-medium flex items-center justify-center gap-2 transition-colors mb-4">
                <Plus className="w-4 h-4" /> Create Appraisal Cycle
              </button>
              <div className="space-y-1">
                {cycleFilters.map(cf => (
                  <button
                    key={cf.key}
                    onClick={() => setCycleFilter(cf.key)}
                    className={cn('w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
                      cycleFilter === cf.key ? 'bg-[#82154F]/5 text-[#82154F]' : 'text-gray-600 hover:bg-gray-50')}
                  >
                    <span>{cf.key}</span>
                    <span className={cn('text-xs font-medium', cycleFilter === cf.key ? 'text-[#82154F]' : 'text-gray-400')}>{cf.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">({appraisalCycles.length}) Appraisal Cycles Found</span>
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
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Appraisal Cycle Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Due Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {appraisalCycles.map(cycle => (
                      <tr key={cycle.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3"><input type="checkbox" className="rounded" /></td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{cycle.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{cycle.dueDate}</td>
                        <td className="px-4 py-3">
                          <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', statusColor(cycle.status))}>
                            {cycle.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button className="p-1 hover:bg-gray-100 rounded"><Trash2 className="w-4 h-4 text-gray-500" /></button>
                            <button className="p-1 hover:bg-gray-100 rounded"><Download className="w-4 h-4 text-gray-500" /></button>
                            <button className="p-1 hover:bg-gray-100 rounded"><Pencil className="w-4 h-4 text-gray-500" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Appraisal List' && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
            <div className="flex items-center justify-between mb-4">
              <button className="h-10 px-4 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm font-medium flex items-center gap-2 transition-colors">
                <Plus className="w-4 h-4" /> Add Appraisal
              </button>
            </div>
            <div className="text-center py-12">
              <p className="text-gray-500">No appraisals found</p>
            </div>
          </div>
        )}

        {activeTab === 'Performance Trackers' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">({performanceTrackers.length}) Performance Trackers Found</span>
              <div className="flex items-center gap-3">
                <button className="h-10 px-4 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm font-medium flex items-center gap-2 transition-colors">
                  <Plus className="w-4 h-4" /> Add Performance Tracker
                </button>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Employee</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Tracker Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Reviewers</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Added Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Modified Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {performanceTrackers.map(pt => (
                    <tr key={pt.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700">{pt.employeeName}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{pt.trackerName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{pt.reviewers}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{pt.addedDate}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{pt.modifiedDate}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button className="p-1 hover:bg-gray-100 rounded"><Eye className="w-4 h-4 text-gray-500" /></button>
                          <button className="p-1 hover:bg-gray-100 rounded"><Download className="w-4 h-4 text-gray-500" /></button>
                        </div>
                      </td>
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


