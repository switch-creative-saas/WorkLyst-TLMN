import { useState } from 'react';
import { HrPageShell } from '@/components/layout/HrPageShell';
import { onboardingItems } from '@/data/common';
import { Search, Plus, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Onboarding() {
  const [activeTab, setActiveTab] = useState('Preboarding');
  const tabs = ['Preboarding', 'On/Offboarding'];

  const subTabs = ['Manage Events/Templates', 'View Employee Tasks', 'My Events', 'My Tasks'];
  const [subTab, setSubTab] = useState('Manage Events/Templates');

  const onboardingTemplates = [
    { id: 1, name: 'Offboarding Template for All Locations', dueDate: 'N/A', owners: ['Charlie Carter', 'Andrew Keller'], status: 'Created', location: '***', type: 'Offboarding', isTemplate: 'Yes' },
    { id: 2, name: 'Onboarding Template for All Locations', dueDate: 'N/A', owners: ['Jenny Fisher', 'Andrew Keller'], status: 'Created', location: '***', type: 'Onboarding', isTemplate: 'Yes' },
    { id: 3, name: 'Offboarding - UK', dueDate: 'N/A', owners: ['Alice Duval'], status: 'Created', location: '***', type: 'Offboarding', isTemplate: 'Yes' },
    { id: 4, name: 'Offboarding - Singapore', dueDate: 'N/A', owners: ['Rajesh Sharma'], status: 'Created', location: '***', type: 'Offboarding', isTemplate: 'Yes' },
    { id: 5, name: 'Offboarding - USA', dueDate: 'N/A', owners: ['Brad Bellic'], status: 'Created', location: '***', type: 'Offboarding', isTemplate: 'Yes' },
    { id: 6, name: 'Onboarding - South Africa', dueDate: 'N/A', owners: ['Chenzira Chuki'], status: 'Created', location: '***', type: 'Onboarding', isTemplate: 'Yes' },
    { id: 7, name: 'Onboarding - India', dueDate: 'N/A', owners: ['Jiaming Lee'], status: 'Created', location: '***', type: 'Onboarding', isTemplate: 'Yes' },
    { id: 8, name: 'Onboarding - USA', dueDate: 'N/A', owners: ['Peter Anderson'], status: 'Created', location: '***', type: 'Onboarding', isTemplate: 'Yes' },
  ];

  return (
    <HrPageShell title="Onboarding" breadcrumbs={[{ label: 'Onboarding' }]}>
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
        {activeTab === 'Preboarding' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">({onboardingItems.length}) Preboarding New Hires Found</span>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search" className="h-10 pl-9 pr-4 text-sm border border-gray-200 rounded-lg w-48" />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Preboarding New Hire</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Contact Number</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Joined Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Stage</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Preboarding Start Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {onboardingItems.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={`https://i.pravatar.cc/150?u=${item.id + 50}`} alt="" className="w-8 h-8 rounded-full" />
                          <span className="text-sm font-medium text-gray-900">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.contactNumber || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.joinedDate}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.stage}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.preboardingStartDate}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[#82154F] rounded-full" style={{ width: `${item.progress}%` }} />
                          </div>
                          <span className="text-xs text-gray-600">{item.progress}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'On/Offboarding' && (
          <div>
            <div className="flex items-center gap-1 mb-4 border-b border-gray-200">
              {subTabs.map(tab => (
                <button key={tab} onClick={() => setSubTab(tab)} className={cn('px-3 py-2 text-sm', subTab === tab ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-gray-600')}>
                  {tab}
                </button>
              ))}
              <div className="relative group ml-auto">
                <button className="px-3 py-2 text-sm text-gray-600 flex items-center gap-1">More <ChevronLeft className="w-3 h-3 rotate-[-90deg]" /></button>
              </div>
            </div>

            {subTab === 'Manage Events/Templates' && (
              <div>
                <div className="flex justify-end mb-4">
                  <button className="h-10 px-4 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm font-medium flex items-center gap-2 transition-colors">
                    <Plus className="w-4 h-4" /> Add Event
                  </button>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr className="border-b border-gray-200">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600"><input type="checkbox" className="rounded" /></th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Due Date</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Owner(s)</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Location</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Type</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Is Template</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {onboardingTemplates.map(t => (
                        <tr key={t.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3"><input type="checkbox" className="rounded" /></td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{t.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{t.dueDate}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{t.owners.join(', ')}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{t.status}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{t.location}</td>
                          <td className="px-4 py-3">
                            <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', t.type === 'Onboarding' ? 'bg-green-100 text-green-700' : 'bg-[#82154F]/10 text-[#82154F]')}>
                              {t.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{t.isTemplate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </HrPageShell>
  );
}

