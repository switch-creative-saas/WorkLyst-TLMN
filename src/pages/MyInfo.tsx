import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HrPageShell } from '@/components/layout/HrPageShell';
import { currentUser } from '@/data/employees';
import { leaveRequests } from '@/data/leave';
import { goals } from '@/data/goals';
import { Calendar, Clock, Settings, ChevronLeft, MapPin, Phone, Mail, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MyInfo() {
  const navigate = useNavigate();
  const [subTabs, setSubTabs] = useState('Profile');

  const tabs = ['Profile', 'Personal Details', 'Job'];
  const moreTabs = ['Contact Details', 'Emergency Contacts', 'Dependents', 'Immigration', 'Salary', 'Tax Exemptions', 'Report To', 'Qualifications', 'Memberships'];

  const myLeaves = leaveRequests.filter(lr => lr.employeeId === currentUser.id);
  const myGoals = goals.filter(g => g.owner === `${currentUser.firstName} ${currentUser.lastName}`).slice(0, 3);

  return (
    <HrPageShell title="My Info" breadcrumbs={[{ label: 'Employee Management' }, { label: 'My Info' }]}>
      {/* Tabs */}
      <div className="bg-glass/40 border-b border-border/40 backdrop-blur-sm px-4">
        <div className="flex items-center gap-1">
          <button onClick={() => navigate('/hr/employee-management')} className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900">
            <span className="flex items-center gap-1"><ChevronLeft className="w-4 h-4" /> Home</span>
          </button>
          <button onClick={() => navigate('/hr/employee-management/employee-list')} className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900">Employee List</button>
          <button className="px-4 py-2.5 text-sm font-medium text-[#82154F] border-b-2 border-[#82154F]">My Info</button>
          <button onClick={() => navigate('/hr/employee-management/directory')} className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900">Directory</button>
        </div>
      </div>

      <div className="p-6">
        {/* Profile Header */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-start gap-6">
            <img src={currentUser.avatar} alt="" className="w-24 h-24 rounded-full object-cover border-4 border-[#82154F]/15" />
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">{currentUser.firstName} {currentUser.lastName}</h2>
              <p className="text-sm text-gray-500">{currentUser.jobTitle}</p>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <h4 className="text-sm font-semibold text-[#82154F] mb-2">Basic Info</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-500">Full Name:</span> <span className="text-gray-900">{currentUser.firstName} {currentUser.lastName}</span></p>
                    <p><span className="text-gray-500">Employee Id:</span> <span className="text-gray-900">{currentUser.employeeId}</span></p>
                    <p><span className="text-gray-500">Birthday:</span> <span className="text-gray-900">{currentUser.dateOfBirth}</span></p>
                    <p><span className="text-gray-500">Gender:</span> <span className="text-gray-900">{currentUser.gender}</span></p>
                    <p><span className="text-gray-500">Joined Date:</span> <span className="text-gray-900">{currentUser.joinedDate}</span></p>
                    <p><span className="text-gray-500">Status:</span> <span className="text-green-600 font-medium">Active</span></p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#82154F] mb-2">Contact</h4>
                  <div className="space-y-1 text-sm">
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{currentUser.location} - {currentUser.nationality}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">Mobile: {currentUser.mobile}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{currentUser.email}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sub Tabs */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-1 px-4 border-b border-gray-200">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setSubTabs(tab)}
                className={cn(
                  'px-4 py-2.5 text-sm font-medium transition-colors',
                  subTabs === tab ? 'text-[#82154F] border-b-2 border-[#82154F]' : 'text-gray-600 hover:text-gray-900'
                )}
              >
                {tab}
              </button>
            ))}
            <div className="relative group">
              <button className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1">
                More <ChevronLeft className="w-3 h-3 rotate-[-90deg]" />
              </button>
              <div className="absolute top-full right-0 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                {moreTabs.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setSubTabs(tab)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6">
            {subTabs === 'Profile' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Leave Balance */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" /> Leave Balance
                    </h4>
                    <Settings className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 mb-3">December 2025</p>
                  <div className="space-y-2">
                    {myLeaves.slice(0, 3).map(leave => (
                      <div key={leave.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{leave.leaveType}</span>
                        <span className={cn(
                          'px-2 py-0.5 rounded-full text-xs',
                          leave.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        )}>{leave.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Leave List */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" /> Leave List
                    </h4>
                    <Settings className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="space-y-2">
                    {myLeaves.map(leave => (
                      <div key={leave.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{leave.leaveType}</span>
                        <span className="text-gray-500">{leave.fromDate} - {leave.toDate}</span>
                        <span className={cn(
                          'px-2 py-0.5 rounded-full text-xs',
                          leave.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        )}>{leave.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Time At Work */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" /> Time At Work
                    </h4>
                    <Settings className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex items-center gap-3">
                    <img src={currentUser.avatar} alt="" className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="text-sm font-medium text-[#82154F]">Punched Out</p>
                      <p className="text-xs text-gray-500">Punched Out : Mar 25th at 05:13 PM (GMT 5.5)</p>
                    </div>
                  </div>
                  <div className="mt-3 inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
                    <span className="text-lg font-semibold text-gray-400">0h 00m</span>
                    <span className="text-sm text-gray-500">Today</span>
                  </div>
                </div>

                {/* Goals */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" /> Goals/OKRs
                    </h4>
                    <Settings className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="space-y-3">
                    {myGoals.map(goal => (
                      <div key={goal.id} className="flex items-center gap-3">
                        <div className="relative w-10 h-10 flex-shrink-0">
                          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="10" />
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#00578A" strokeWidth="10"
                              strokeDasharray={`${(goal.completion / 100) * 251.2} ${251.2}`} strokeLinecap="round" />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[10px] font-bold">{goal.completion}%</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-1">{goal.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {subTabs === 'Personal Details' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Personal Details</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#82154F] mb-1">First Name*</label>
                    <input type="text" defaultValue={currentUser.firstName} className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82154F]/20 focus:border-[#82154F]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Middle Name</label>
                    <input type="text" className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82154F]/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#82154F] mb-1">Last Name*</label>
                    <input type="text" defaultValue={currentUser.lastName} className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82154F]/20 focus:border-[#82154F]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Employee Id</label>
                    <input type="text" defaultValue={currentUser.employeeId} readOnly className="w-full h-10 px-3 border border-gray-200 rounded-lg bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Other Id</label>
                    <input type="text" className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82154F]/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">SSN/AADHAAR/ID NO</label>
                    <input type="text" className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82154F]/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Date of Birth</label>
                    <input type="date" defaultValue={currentUser.dateOfBirth} className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82154F]/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Marital Status</label>
                    <select defaultValue={currentUser.maritalStatus} className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82154F]/20">
                      <option>Single</option>
                      <option>Married</option>
                      <option>Divorced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Gender</label>
                    <select defaultValue={currentUser.gender} className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82154F]/20">
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Nationality</label>
                    <select defaultValue={currentUser.nationality} className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82154F]/20">
                      <option>Filipino</option>
                      <option>Australian</option>
                      <option>American</option>
                      <option>British</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Driver's License Number</label>
                    <input type="text" defaultValue={currentUser.driversLicenseNumber} className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82154F]/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">License Expiry Date</label>
                    <input type="date" defaultValue={currentUser.licenseExpiryDate} className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82154F]/20" />
                  </div>
                </div>

                {/* Attachments */}
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Attachments</h4>
                  <p className="text-sm text-gray-500 mb-3">0 records found</p>
                  <button className="h-10 px-4 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm font-medium transition-colors">
                    ADD
                  </button>
                </div>

                <div className="flex justify-end">
                  <button className="h-10 px-6 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm font-medium transition-colors flex items-center gap-2">
                    <Save className="w-4 h-4" /> SAVE
                  </button>
                </div>
              </div>
            )}

            {subTabs === 'Job' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Job Details</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Joined Date</label>
                    <input type="date" defaultValue="2010-02-23" className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82154F]/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Job Title</label>
                    <input type="text" defaultValue={currentUser.jobTitle} className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82154F]/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Employment Status</label>
                    <select defaultValue="Full-Time Permanent" className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82154F]/20">
                      <option>Full-Time Permanent</option>
                      <option>Part-Time</option>
                      <option>Contract</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Job Category</label>
                    <select className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82154F]/20">
                      <option>Officials and Managers</option>
                      <option>Professionals</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Sub Unit</label>
                    <select defaultValue="Human Resources" className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82154F]/20">
                      <option>Human Resources</option>
                      <option>Engineering</option>
                      <option>Sales</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Work Shift</label>
                    <select className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82154F]/20">
                      <option>General</option>
                      <option>Morning</option>
                      <option>Evening</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Location</label>
                    <select defaultValue={currentUser.location} className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82154F]/20">
                      <option>US Office</option>
                      <option>UK Office</option>
                      <option>Australia office</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Cost Center</label>
                    <input type="text" defaultValue={currentUser.costCenter} className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82154F]/20" />
                  </div>
                </div>

                {/* Job History */}
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Job History</h4>
                  <p className="text-sm text-gray-500 mb-3">(5) Job History Records Found</p>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Event</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Effective From</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Field</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Changed From</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Changed To</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm text-gray-700">Pay Policy Criteria Updated</td>
                          <td className="px-4 py-2 text-sm text-gray-600">2025-04-02</td>
                          <td className="px-4 py-2 text-sm text-gray-600">Pay Policy</td>
                          <td className="px-4 py-2 text-sm text-gray-600">Pay Policy for USA 1</td>
                          <td className="px-4 py-2 text-sm text-gray-600">USA</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm text-gray-700">Promoted</td>
                          <td className="px-4 py-2 text-sm text-gray-600">2021-01-01</td>
                          <td className="px-4 py-2 text-sm text-gray-600">Job Title</td>
                          <td className="px-4 py-2 text-sm text-gray-600">Assistant Manager - ...</td>
                          <td className="px-4 py-2 text-sm text-gray-600">Regional HR Manager</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm text-gray-700">Promoted</td>
                          <td className="px-4 py-2 text-sm text-gray-600">2016-01-01</td>
                          <td className="px-4 py-2 text-sm text-gray-600">Job Title</td>
                          <td className="px-4 py-2 text-sm text-gray-600">Senior HR Executive</td>
                          <td className="px-4 py-2 text-sm text-gray-600">Assistant Manager - ...</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm text-gray-700">Promoted</td>
                          <td className="px-4 py-2 text-sm text-gray-600">2013-07-01</td>
                          <td className="px-4 py-2 text-sm text-gray-600">Job Title</td>
                          <td className="px-4 py-2 text-sm text-gray-600">HR Executive</td>
                          <td className="px-4 py-2 text-sm text-gray-600">Senior HR Executive</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm text-gray-700">Joined</td>
                          <td className="px-4 py-2 text-sm text-gray-600">2010-02-23</td>
                          <td className="px-4 py-2 text-sm text-gray-600">Job Title</td>
                          <td className="px-4 py-2 text-sm text-gray-600">-</td>
                          <td className="px-4 py-2 text-sm text-gray-600">HR Executive</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button className="h-10 px-6 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm font-medium transition-colors flex items-center gap-2">
                    <Save className="w-4 h-4" /> SAVE
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </HrPageShell>
  );
}


