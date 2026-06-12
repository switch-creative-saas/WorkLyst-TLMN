import { useState } from 'react';
import { HrPageShell } from '@/components/layout/HrPageShell';
import { candidates, stageCounts } from '@/data/candidates';
import { Search, Filter, Plus, Download, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Recruitment() {
  const [activeTab, setActiveTab] = useState('Candidates');
  const tabs = ['Candidates', 'Vacancies', 'Configuration'];
  const [selectedStage, setSelectedStage] = useState('All Candidates');
  const [filteredCandidates, setFilteredCandidates] = useState(candidates);

  const stages = [
    { key: 'All Candidates', label: 'All Candidates', count: stageCounts['All Candidates'] },
    { key: 'Application Received', label: 'Application Received', count: stageCounts['Application Received'] },
    { key: 'Shortlisted', label: 'Shortlisted', count: stageCounts['Shortlisted'] },
    { key: 'In Progress', label: 'In Progress', count: stageCounts['In Progress'] },
    { key: 'Job Offer', label: 'Job Offer', count: stageCounts['Job Offer'] },
    { key: 'Preboarding', label: 'Preboarding', count: stageCounts['Preboarding'] },
    { key: 'Hired', label: 'Hired', count: stageCounts['Hired'] },
    { key: 'Rejected', label: 'Rejected', count: stageCounts['Rejected'] },
  ];

  const handleStageFilter = (stage: string) => {
    setSelectedStage(stage);
    if (stage === 'All Candidates') {
      setFilteredCandidates(candidates);
    } else if (stage === 'In Progress') {
      setFilteredCandidates(candidates.filter(c =>
        ['In Progress', 'Skills-Based Interview', 'Technical Interview', 'HR Interview Round', 'Reference Check', '321 Forms Onboarding'].includes(c.stage)
      ));
    } else {
      setFilteredCandidates(candidates.filter(c => c.stage === stage));
    }
  };

  return (
    <HrPageShell title="Recruitment (ATS)" breadcrumbs={[{ label: 'Recruitment (ATS)' }]}>
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
        {activeTab === 'Candidates' && (
          <div className="flex gap-6">
            {/* Pipeline Sidebar */}
            <div className="w-48 flex-shrink-0">
              <div className="mb-4">
                <select className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg flex items-center gap-2">
                  <option>All Vacancies</option>
                </select>
              </div>
              <div className="space-y-1">
                {stages.map(stage => (
                  <button
                    key={stage.key}
                    onClick={() => handleStageFilter(stage.key)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
                      selectedStage === stage.key ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'
                    )}
                  >
                    <span>{stage.label}</span>
                    <span className={cn('text-xs font-medium', selectedStage === stage.key ? 'text-green-600' : 'text-gray-400')}>
                      {stage.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <button className="h-10 px-4 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm font-medium flex items-center gap-2 transition-colors">
                  <Plus className="w-4 h-4" /> Add Candidate
                </button>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">({filteredCandidates.length}) Candidates Found</span>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Search" className="h-10 pl-9 pr-4 text-sm border border-gray-200 rounded-lg w-48" />
                  </div>
                  <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <Filter className="w-4 h-4 text-gray-500" />
                  </button>
                  <button className="h-10 px-3 border border-gray-200 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50">
                    <Download className="w-4 h-4" /> CSV
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Candidate</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Contact Number</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Date Applied</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Stage</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredCandidates.map(candidate => (
                      <tr key={candidate.id} className="hover:bg-gray-50 group">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
                              {candidate.firstName.charAt(0)}{candidate.lastName.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{candidate.firstName} {candidate.lastName}</p>
                              <p className="text-xs text-gray-500">{candidate.vacancy}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{candidate.email}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{candidate.contactNumber}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{candidate.dateApplied}</td>
                        <td className="px-4 py-3">
                          <select
                            defaultValue={candidate.stage}
                            className={cn(
                              'text-xs px-2 py-1 rounded-full border-0 font-medium',
                              candidate.stage === 'Hired' ? 'bg-green-100 text-green-700' :
                              candidate.stage === 'Rejected' ? 'bg-red-100 text-red-700' :
                              candidate.stage === 'Job Offer' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            )}
                          >
                            <option>{candidate.stage}</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <button className="p-1 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="w-4 h-4 text-gray-500" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Vacancies' && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
            <p className="text-gray-500">No vacancies found</p>
          </div>
        )}
      </div>
    </div>
    </HrPageShell>
  );
}
