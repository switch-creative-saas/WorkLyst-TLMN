import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HrPageShell } from '@/components/layout/HrPageShell';
import { employees } from '@/data/employees';
import { Search, Grid3X3, List, ChevronLeft } from 'lucide-react';

export function Directory() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredEmployees = employees.filter(emp =>
    `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <HrPageShell title="Directory" breadcrumbs={[{ label: 'Employee Management' }, { label: 'Directory' }]}>
      <div className="bg-glass/40 border-b border-border/40 backdrop-blur-sm px-4">
        <div className="flex items-center gap-1">
          <button onClick={() => navigate('/hr/employee-management')} className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900">
            <span className="flex items-center gap-1"><ChevronLeft className="w-4 h-4" /> Home</span>
          </button>
          <button onClick={() => navigate('/hr/employee-management/employee-list')} className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900">Employee List</button>
          <button onClick={() => navigate('/hr/employee-management/my-info')} className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900">My Info</button>
          <button className="px-4 py-2.5 text-sm font-medium text-[#82154F] border-b-2 border-[#82154F]">Directory</button>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Employee Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 pl-9 pr-4 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82154F]/20 w-64"
              />
            </div>
            <div className="relative">
              <select className="h-10 px-4 pr-8 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82154F]/20 appearance-none">
                <option>Location</option>
                <option>US Office</option>
                <option>UK Office</option>
                <option>Australia</option>
              </select>
            </div>
            <div className="relative">
              <select className="h-10 px-4 pr-8 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82154F]/20 appearance-none">
                <option>Department</option>
                <option>Human Resources</option>
                <option>Engineering</option>
                <option>Sales</option>
              </select>
            </div>
          </div>
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}>
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredEmployees.map(emp => (
              <div key={emp.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col items-center text-center">
                  <img src={emp.avatar} alt="" className="w-16 h-16 rounded-full object-cover mb-3" />
                  <h4 className="font-semibold text-gray-900 text-sm">{emp.firstName} {emp.lastName}</h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">{emp.jobTitle}</p>
                  <p className="text-xs text-gray-400 mt-1">({emp.employeeId}) - {emp.costCenter}</p>
                  <p className="text-xs text-gray-400">{emp.subUnit}</p>
                  <p className="text-xs text-gray-400 mt-1">{emp.location}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Employee</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Job Title</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEmployees.map(emp => (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={emp.avatar} alt="" className="w-8 h-8 rounded-full" />
                        <span className="text-sm font-medium">{emp.firstName} {emp.lastName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{emp.jobTitle}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{emp.subUnit}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{emp.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </HrPageShell>
  );
}

