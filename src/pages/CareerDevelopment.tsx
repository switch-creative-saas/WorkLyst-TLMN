import { useState } from 'react';
import { HrPageShell } from '@/components/layout/HrPageShell';
import { idps } from '@/data/common';
import { Search, Plus, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CareerDevelopment() {
  const [activeTab, setActiveTab] = useState('Individual Development Plans');
  const tabs = ['Individual Development Plans', '9 Box Matrix', 'My IDP', 'Configuration'];

  const matrixData = [
    { performance: 'HIGH', potential: 'HIGH', label: 'Star', count: 0 },
    { performance: 'HIGH', potential: 'MODERATE', label: 'Trusted Professional', count: 0 },
    { performance: 'HIGH', potential: 'LOW', label: 'Enigma', count: 0 },
    { performance: 'MODERATE', potential: 'HIGH', label: 'Growth Employee', count: 0 },
    { performance: 'MODERATE', potential: 'MODERATE', label: 'Core Contributor', count: 1 },
    { performance: 'MODERATE', potential: 'LOW', label: 'Effective Employee', count: 0 },
    { performance: 'LOW', potential: 'HIGH', label: 'Inconsistent Player', count: 0 },
    { performance: 'LOW', potential: 'MODERATE', label: 'Under Performer', count: 0 },
    { performance: 'LOW', potential: 'LOW', label: 'Risk', count: 0 },
  ];

  const getCellColor = (label: string) => {
    switch (label) {
      case 'Star': return 'bg-green-100 border-green-300';
      case 'Trusted Professional': return 'bg-blue-100 border-blue-300';
      case 'Enigma': return 'bg-yellow-100 border-yellow-300';
      case 'Growth Employee': return 'bg-emerald-100 border-emerald-300';
      case 'Core Contributor': return 'bg-gray-100 border-gray-300';
      case 'Effective Employee': return 'bg-gray-50 border-gray-200';
      case 'Inconsistent Player': return 'bg-[#82154F]/10 border-[#82154F]/30';
      case 'Under Performer': return 'bg-red-100 border-red-300';
      case 'Risk': return 'bg-red-200 border-red-400';
      default: return 'bg-white border-gray-200';
    }
  };

  return (
    <HrPageShell title="Career Development" breadcrumbs={[{ label: 'Career Development' }]}>
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
        {activeTab === 'Individual Development Plans' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">({idps.length}) Records Found</span>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="Search" className="h-10 pl-9 pr-4 text-sm border border-gray-200 rounded-lg w-48" />
                </div>
                <button className="h-10 px-4 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm font-medium flex items-center gap-2 transition-colors">
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Employee ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Employee</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">IDP Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Coach</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Initiated On</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Closed On</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {idps.map(idp => (
                    <tr key={idp.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-600">{idp.employeeId}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{idp.employeeName}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{idp.idpName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{idp.coach}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{idp.initiatedOn}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{idp.closedOn || '-'}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">{idp.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === '9 Box Matrix' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">9 Box Matrix</h3>
            </div>
            <div className="relative">
              {/* Y-axis label */}
              <div className="absolute -left-8 top-1/2 -translate-y-1/2 -rotate-90 text-sm font-semibold text-gray-500">Performance Assessment</div>

              <div className="grid grid-cols-3 gap-2 ml-4">
                {['HIGH', 'MODERATE', 'LOW'].map(perf => (
                  matrixData
                    .filter(m => m.performance === perf)
                    .map((cell) => (
                      <div
                        key={`${cell.performance}-${cell.potential}`}
                        className={cn('border-2 rounded-lg p-4 min-h-[120px] flex flex-col items-center justify-center', getCellColor(cell.label))}
                      >
                        <span className="text-xs font-medium text-gray-500 mb-1">{cell.label}</span>
                        <span className="text-lg font-bold text-gray-700">
                          {cell.count > 0 ? `${cell.count} employee(s)` : 'no employees'}
                        </span>
                      </div>
                    ))
                ))}
              </div>

              {/* X-axis label */}
              <div className="text-center mt-4 text-sm font-semibold text-gray-500">Potential Assessment</div>
              <div className="flex justify-between px-4 mt-1 text-xs text-gray-400">
                <span>HIGH</span>
                <span>MODERATE</span>
                <span>LOW</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Configuration' && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 max-w-lg">
            <h3 className="text-lg font-semibold mb-4">9 Box Potential Category Answer Options</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#82154F] mb-1">Low*</label>
                <input type="text" defaultValue="Limited to current role only or possible bad fit" className="w-full h-10 px-3 border border-gray-200 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#82154F] mb-1">Medium*</label>
                <input type="text" defaultValue="Good fit at current level, lateral move, or upward 1 level" className="w-full h-10 px-3 border border-gray-200 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#82154F] mb-1">High*</label>
                <input type="text" defaultValue="Highly capable to attain higher roles, upward mobility more than 1 level" className="w-full h-10 px-3 border border-gray-200 rounded-lg" />
              </div>
              <p className="text-xs text-[#82154F]">* Required field</p>
            </div>
            <div className="flex justify-end mt-6">
              <button className="h-10 px-6 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm font-medium transition-colors flex items-center gap-2">
                <Save className="w-4 h-4" /> SAVE
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    </HrPageShell>
  );
}

