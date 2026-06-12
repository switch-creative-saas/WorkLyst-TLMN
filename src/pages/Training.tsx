import { useState } from 'react';
import { HrPageShell } from '@/components/layout/HrPageShell';
import { courses } from '@/data/common';
import { Search, Plus, ChevronLeft, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Training() {
  const [activeTab, setActiveTab] = useState('Courses');
  const tabs = ['Courses', 'Sessions', 'My Participating Sessions'];
  const moreTabs = ['Online Assessment Courses'];

  return (
    <HrPageShell title="Training / Learning Courses" breadcrumbs={[{ label: 'Training' }]}>
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
            <div className="absolute top-full right-0 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              {moreTabs.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">{tab}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'Courses' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">({courses.length}) Courses Found</span>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="Search" className="h-10 pl-9 pr-4 text-sm border border-gray-200 rounded-lg w-48" />
                </div>
                <button className="h-10 px-4 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm font-medium flex items-center gap-2 transition-colors">
                  <Plus className="w-4 h-4" /> Add Course
                </button>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600"><input type="checkbox" className="rounded" /></th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Course Title</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Subunit</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Coordinator</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Company</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {courses.map(course => (
                    <tr key={course.id} className="hover:bg-gray-50 group">
                      <td className="px-4 py-3"><input type="checkbox" className="rounded" /></td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{course.title}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{course.subunit}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{course.coordinator}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{course.company}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">{course.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="p-1 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          <Eye className="w-4 h-4 text-gray-500" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'Sessions' && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
            <p className="text-gray-500">No sessions found</p>
          </div>
        )}

        {activeTab === 'My Participating Sessions' && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
            <p className="text-gray-500">No records found</p>
          </div>
        )}
      </div>
    </div>
    </HrPageShell>
  );
}
