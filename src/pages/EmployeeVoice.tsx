import { useState } from 'react';
import { HrPageShell } from '@/components/layout/HrPageShell';
import { employeeVoiceRecords } from '@/data/common';
import { Plus, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export function EmployeeVoice() {
  const [activeTab, setActiveTab] = useState('My Records');
  const tabs = ['My Records', 'Employee Records', 'Types', 'Templates'];

  const types = [
    { id: 1, typeName: 'Conflicts with Supervisors or Colleagues', template: 'Conflicts with Supervisors or Colleagues', anonymity: true, locations: 'All' },
    { id: 2, typeName: 'Harassment or bullying', template: 'Harassment or bullying', anonymity: true, locations: 'All' },
    { id: 3, typeName: 'Issues related to pay, benefits or promotions', template: 'Issues related to pay, benefits or promotions', anonymity: false, locations: 'All' },
  ];

  const statusColor = (status: string) => {
    switch (status) {
      case 'Resolved': return 'bg-green-100 text-green-700';
      case 'Submitted': return 'bg-blue-100 text-blue-700';
      case 'Saved': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <HrPageShell title="Employee Voice" breadcrumbs={[{ label: 'Employee Voice' }]}>
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
        {activeTab === 'My Records' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">({employeeVoiceRecords.length}) Records Found</span>
              <div className="flex items-center gap-3">
                <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Settings className="w-4 h-4 text-gray-500" />
                </button>
                <button className="h-10 px-4 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm font-medium flex items-center gap-2 transition-colors">
                  <Plus className="w-4 h-4" /> Add Record
                </button>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Employee ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Employee</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Anonymity</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Locations</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Created Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Last Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {employeeVoiceRecords.map(record => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-600">{record.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{record.employeeId}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{record.employeeName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{record.type}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{record.title || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{record.anonymity ? 'Yes' : 'No'}</td>
                      <td className="px-4 py-3">
                        <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', statusColor(record.status))}>{record.status}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{record.locations.join(', ')}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{record.createdDate}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{record.lastUpdated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'Types' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">({types.length}) Records Found</span>
              <div className="flex items-center gap-3">
                <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Settings className="w-4 h-4 text-gray-500" />
                </button>
                <button className="h-10 px-4 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm font-medium flex items-center gap-2 transition-colors">
                  <Plus className="w-4 h-4" /> Add Type
                </button>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Type Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Template</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Anonymity</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Locations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {types.map(t => (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{t.typeName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{t.template}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{t.anonymity ? 'Yes' : 'No'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{t.locations}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'Templates' && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
            <p className="text-gray-500">No templates found</p>
          </div>
        )}
      </div>
    </div>
    </HrPageShell>
  );
}
