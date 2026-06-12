import { useState } from 'react';
import { HrPageShell } from '@/components/layout/HrPageShell';
import { surveyCampaigns } from '@/data/common';
import { Search, Plus, Eye, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Survey() {
  const [activeTab, setActiveTab] = useState('Survey Campaigns');
  const tabs = ['Survey Campaigns', 'Survey Templates'];

  const templates = [
    { id: 1, name: 'eNPS - Employee Net Promoter Score (eNPS) Survey', lastEdited: '2026-02-16' },
    { id: 2, name: 'Post-Training Evaluation', lastEdited: '2026-02-16' },
    { id: 3, name: 'Training Needs Assessment', lastEdited: '2026-02-16' },
    { id: 4, name: 'Customer Satisfaction', lastEdited: '2026-02-16' },
    { id: 5, name: 'Employee Satisfaction', lastEdited: '2026-02-16' },
  ];

  return (
    <HrPageShell title="Survey" breadcrumbs={[{ label: 'Survey' }]}>
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
        {activeTab === 'Survey Campaigns' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">({surveyCampaigns.length}) Records Found</span>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="Search" className="h-10 pl-9 pr-4 text-sm border border-gray-200 rounded-lg w-48" />
                </div>
                <button className="h-10 px-4 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm font-medium flex items-center gap-2 transition-colors">
                  <Plus className="w-4 h-4" /> Add Campaign
                </button>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Campaign ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Campaign Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Template</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Due Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Anonymity</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Locations</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Reports</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {surveyCampaigns.map(sc => (
                    <tr key={sc.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-600">{sc.campaignId}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{sc.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{sc.template}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{sc.dueDate}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{sc.anonymity ? 'Yes' : 'No'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{sc.locations.join(', ')}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">{sc.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <BarChart3 className="w-4 h-4 text-gray-500" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'Survey Templates' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {templates.map(template => (
              <div key={template.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6 text-blue-500" />
                </div>
                <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{template.name}</h4>
                <p className="text-xs text-gray-500 mt-2">Last Edited: {template.lastEdited}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </HrPageShell>
  );
}
