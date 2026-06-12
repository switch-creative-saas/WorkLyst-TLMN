import { useState } from 'react';
import { HrPageShell } from '@/components/layout/HrPageShell';
import { reports } from '@/data/common';
import { Search, Plus, Folder, FileText, ChevronRight, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Reports() {
  const [activeTab, setActiveTab] = useState('Reports');
  const [sidebarItem, setSidebarItem] = useState('All Reports');

  const sidebarItems = ['All Reports', 'Standard Reports', 'My Reports', 'Recent Reports'];
  const categories = [...new Set(reports.map(r => r.category))];

  return (
    <HrPageShell title="Reports and Analytics" breadcrumbs={[{ label: 'Reports and Analytics' }]}>
    <div>
      

      <div className="bg-glass/40 border-b border-border/40 backdrop-blur-sm px-4">
        <div className="flex items-center gap-1">
          <button onClick={() => setActiveTab('Reports')} className={cn('px-4 py-2.5 text-sm font-medium', activeTab === 'Reports' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-gray-600')}>Reports</button>
          <button onClick={() => setActiveTab('Scheduled')} className={cn('px-4 py-2.5 text-sm font-medium', activeTab === 'Scheduled' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-gray-600')}>Scheduled Reports</button>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'Reports' && (
          <div className="flex gap-6">
            {/* Sidebar */}
            <div className="w-56 flex-shrink-0">
              <div className="flex items-center gap-3 mb-4">
                <button className="h-10 px-4 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm font-medium flex items-center gap-2 transition-colors">
                  <Plus className="w-4 h-4" /> New Report
                </button>
                <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Folder className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <div className="space-y-1">
                {sidebarItems.map(item => (
                  <button
                    key={item}
                    onClick={() => setSidebarItem(item)}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2',
                      sidebarItem === item ? 'bg-[#82154F]/5 text-[#82154F]' : 'text-gray-600 hover:bg-gray-50'
                    )}
                  >
                    <FileText className="w-4 h-4" />
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search" className="w-full h-10 pl-9 pr-4 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82154F]/20" />
              </div>

              {categories.map(category => (
                <div key={category} className="mb-4">
                  <button className="flex items-center gap-2 w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <FileText className="w-5 h-5 text-gray-500" />
                    <span className="font-semibold text-gray-900">{category}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                  </button>
                  <div className="mt-1 ml-4 space-y-1">
                    {reports.filter(r => r.category === category).map(report => (
                      <div key={report.id} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-700">{report.name}</p>
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Last accessed by a user: {report.lastAccessed}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Scheduled' && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">No scheduled reports found</p>
          </div>
        )}
      </div>
    </div>
    </HrPageShell>
  );
}


