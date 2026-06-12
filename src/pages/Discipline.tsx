import { useState } from 'react';
import { HrPageShell } from '@/components/layout/HrPageShell';
import { disciplineCases } from '@/data/common';
import { Plus, Settings, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Discipline() {
  const [activeTab, setActiveTab] = useState('My Cases');
  const tabs = ['My Cases', 'Employee Cases', 'Case Types', 'Case Forms'];

  const caseTypes = [
    { id: 1, caseTypeName: 'Misconduct', caseForm: 'Advanced Case Form', locations: 'All', expectedDuration: 42 },
    { id: 2, caseTypeName: 'Policy Violation', caseForm: 'Basic Case Form', locations: 'All', expectedDuration: 28 },
    { id: 3, caseTypeName: 'Workplace Harassment', caseForm: 'Advanced Case Form', locations: 'All', expectedDuration: 56 },
  ];

  const caseForms = [
    { id: 1, name: 'Advanced Case Form', lastEdited: '2025-12-03' },
    { id: 2, name: 'Basic Case Form', lastEdited: '2025-12-03' },
  ];

  const statusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-red-100 text-red-700';
      case 'In Progress': return 'bg-yellow-100 text-yellow-700';
      case 'Closed': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <HrPageShell title="Discipline" breadcrumbs={[{ label: 'Discipline' }]}>
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
        {activeTab === 'My Cases' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">({disciplineCases.length}) Records Found</span>
              <div className="flex items-center gap-3">
                <button className="h-10 px-4 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm font-medium flex items-center gap-2 transition-colors">
                  <Plus className="w-4 h-4" /> Add Case
                </button>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Case ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Case Title</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Case Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Created By</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Created Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {disciplineCases.map(dc => (
                    <tr key={dc.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-600">{dc.caseId}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{dc.caseTitle}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{dc.caseType}</td>
                      <td className="px-4 py-3">
                        <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', statusColor(dc.status))}>{dc.status}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{dc.createdBy}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{dc.createdDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'Employee Cases' && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v-2h-2v2zm0-4h2V7h-2v6z" />
              </svg>
            </div>
            <p className="text-gray-500 mb-2">No Records Found</p>
            <p className="text-sm text-gray-400">Sorry, No Data Found!</p>
          </div>
        )}

        {activeTab === 'Case Types' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">({caseTypes.length}) Records Found</span>
              <div className="flex items-center gap-3">
                <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Settings className="w-4 h-4 text-gray-500" />
                </button>
                <button className="h-10 px-4 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm font-medium flex items-center gap-2 transition-colors">
                  <Plus className="w-4 h-4" /> Add Case Type
                </button>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Case Type Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Case Form</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Locations</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Expected Case Duration (Days)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {caseTypes.map(ct => (
                    <tr key={ct.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{ct.caseTypeName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{ct.caseForm}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{ct.locations}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{ct.expectedDuration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'Case Forms' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {caseForms.map(form => (
              <div key={form.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-blue-500" />
                </div>
                <h4 className="text-sm font-medium text-gray-900">{form.name}</h4>
                <p className="text-xs text-gray-500 mt-2">Last Edited: {form.lastEdited}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </HrPageShell>
  );
}
