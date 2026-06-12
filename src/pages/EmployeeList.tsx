import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HrPageShell } from '@/components/layout/HrPageShell';
import { employees } from '@/data/employees';
import { Search, Filter, ChevronLeft, ChevronRight, Plus, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function EmployeeList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredEmployees = employees.filter(emp =>
    `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.employeeId.includes(searchQuery) ||
    emp.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + rowsPerPage);

  return (
    <HrPageShell title="Employee List" breadcrumbs={[{ label: 'Employee Management' }, { label: 'Employee List' }]}>
      {/* Tabs */}
      <div className="bg-glass/40 border-b border-border/40 backdrop-blur-sm px-4">
        <div className="flex items-center gap-1">
          <button onClick={() => navigate('/')} className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900">
            <span className="flex items-center gap-1"><ChevronLeft className="w-4 h-4" /> Home</span>
          </button>
          <button className="px-4 py-2.5 text-sm font-medium text-brand-primary border-b-2 border-brand-primary">Employee List</button>
          <button onClick={() => navigate('/hr/employee-management/my-info')} className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900">My Info</button>
          <button onClick={() => navigate('/hr/employee-management/directory')} className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900">Directory</button>
          <button className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900">Buzz</button>
          <button className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900">Announcements</button>
          <button onClick={() => navigate('/')} className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900">Dashboard</button>
        </div>
      </div>

      <div className="p-6">
        {/* Search and Filters */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Employee Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 pl-9 pr-4 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82154F]/20 focus:border-[#82154F] w-64"
              />
            </div>
            <button className="h-10 px-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-600">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Employee Id</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Employee Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Job Title</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Employment Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Sub Unit</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cost Center</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Supervisor</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-4 py-3">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{emp.employeeId}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <img src={emp.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                        <span className="text-sm font-medium text-gray-900">{emp.firstName} {emp.lastName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{emp.jobTitle}</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        'px-2 py-0.5 rounded-full text-xs font-medium',
                        emp.employmentStatus === 'Full-Time Permanent' ? 'bg-green-100 text-green-700' :
                        emp.employmentStatus === 'Contract' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      )}>
                        {emp.employmentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{emp.subUnit}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{emp.costCenter}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{emp.location}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{emp.supervisor}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Pencil className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rows per page</span>
              <select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                className="h-8 px-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-[#82154F]/20"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-gray-600">
                {startIndex + 1} - {Math.min(startIndex + rowsPerPage, filteredEmployees.length)} of {filteredEmployees.length}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    'w-8 h-8 rounded text-sm font-medium transition-colors',
                    currentPage === page ? 'bg-[#82154F] text-white' : 'hover:bg-gray-200 text-gray-600'
                  )}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => navigate('/hr/employee-management/add-employee')}
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 z-50"
      >
        <Plus className="w-6 h-6" />
      </button>
    </HrPageShell>
  );
}

