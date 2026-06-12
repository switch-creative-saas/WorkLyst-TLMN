import { useState } from 'react';
import { HrPageShell } from '@/components/layout/HrPageShell';
import { employees } from '@/data/employees';
import { ChevronLeft, ChevronRight, Plus, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Roster() {
  const [activeTab, setActiveTab] = useState('Roster Schedule');
  const tabs = ['Roster Schedule', 'Configuration'];
  const weekDays = ['MON 1', 'TUE 2', 'WED 3', 'THU 4', 'FRI 5', 'SAT 6', 'SUN 7'];

  return (
    <HrPageShell title="Roster" breadcrumbs={[{ label: 'Roster' }]}>
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
        {activeTab === 'Roster Schedule' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-gray-100 rounded-lg"><ChevronLeft className="w-5 h-5" /></button>
                <span className="text-sm font-medium">1 Jun - 7 Jun</span>
                <button className="p-2 hover:bg-gray-100 rounded-lg"><ChevronRight className="w-5 h-5" /></button>
              </div>
              <div className="flex items-center gap-3">
                <select className="h-10 px-3 text-sm border border-gray-200 rounded-lg"><option>US Office</option></select>
                <select className="h-10 px-3 text-sm border border-gray-200 rounded-lg"><option>View By Shift Group</option></select>
                <select className="h-10 px-3 text-sm border border-gray-200 rounded-lg"><option>Schedule Period Week</option></select>
                <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"><Settings className="w-4 h-4" /></button>
                <button className="h-10 px-4 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm font-medium flex items-center gap-2 transition-colors">
                  <Plus className="w-4 h-4" /> Add a New Shift Group
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="grid grid-cols-[200px_repeat(7,1fr)] border-b border-gray-200">
                <div className="px-4 py-3 bg-gray-50 font-semibold text-xs text-gray-600">Employee</div>
                {weekDays.map(day => (
                  <div key={day} className={cn('px-2 py-3 text-center text-xs font-semibold', day.startsWith('SAT') || day.startsWith('SUN') ? 'text-gray-400 bg-gray-50' : 'text-[#82154F] bg-[#82154F]/5')}>
                    {day}
                  </div>
                ))}
              </div>

              <div className="divide-y divide-gray-100">
                <div className="grid grid-cols-[200px_repeat(7,1fr)] items-center">
                  <div className="px-4 py-3 text-sm font-medium text-gray-500">Time Off</div>
                  {weekDays.map(day => (
                    <div key={day} className="h-12 border-r border-gray-50" />
                  ))}
                </div>
                <div className="grid grid-cols-[200px_repeat(7,1fr)] items-center">
                  <div className="px-4 py-3 text-sm font-medium text-gray-500">US Office Default</div>
                  {weekDays.map(day => (
                    <div key={day} className="h-12 border-r border-gray-50" />
                  ))}
                </div>
                {employees.slice(0, 10).map(emp => (
                  <div key={emp.id} className="grid grid-cols-[200px_repeat(7,1fr)] items-center hover:bg-gray-50">
                    <div className="px-4 py-2 flex items-center gap-2">
                      <img src={emp.avatar} alt="" className="w-7 h-7 rounded-full" />
                      <span className="text-sm text-gray-700 truncate">{emp.firstName} {emp.lastName}</span>
                    </div>
                    {weekDays.map(day => (
                      <div key={day} className="h-10 border-r border-gray-50" />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Configuration' && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 max-w-lg">
            <h3 className="text-lg font-semibold mb-4">General</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Swap Shifts</p>
                </div>
                <button className="w-12 h-6 bg-[#82154F] rounded-full">
                  <div className="w-5 h-5 bg-white rounded-full shadow translate-x-6" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Manager approval for shift swaps</p>
                </div>
                <button className="w-12 h-6 bg-gray-300 rounded-full">
                  <div className="w-5 h-5 bg-white rounded-full shadow translate-x-0.5" />
                </button>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button className="h-10 px-6 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm font-medium transition-colors">
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    </HrPageShell>
  );
}


