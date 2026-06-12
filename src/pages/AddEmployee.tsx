import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

export function AddEmployee() {
  const navigate = useNavigate();
  const [autoGenerateId, setAutoGenerateId] = useState(true);
  const [preboarding, setPreboarding] = useState(false);
  const [createLogin, setCreateLogin] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={() => navigate('/hr/employee-management/employee-list')} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Add Employee</h2>
          <button
            onClick={() => navigate('/hr/employee-management/employee-list')}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
              </svg>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#82154F] mb-2">Employee Full Name*</label>
            <div className="grid grid-cols-3 gap-3">
              <input type="text" placeholder="First Name" className="h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82154F]/20" />
              <input type="text" placeholder="Middle Name" className="h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82154F]/20" />
              <input type="text" placeholder="Last Name" className="h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82154F]/20" />
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-700">Auto Generate Employee ID</span>
            <button
              onClick={() => setAutoGenerateId(!autoGenerateId)}
              className={`w-12 h-6 rounded-full transition-colors ${autoGenerateId ? 'bg-[#82154F]' : 'bg-gray-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${autoGenerateId ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#82154F] mb-1">Joined Date*</label>
              <input type="date" defaultValue="2026-06-01" className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82154F]/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#82154F] mb-1">Location*</label>
              <select className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82154F]/20">
                <option>-- Select --</option>
                <option>US Office</option>
                <option>UK Office</option>
                <option>Australia office</option>
                <option>Canada</option>
                <option>India</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <span className="text-sm text-gray-700">Initiate Preboarding upon Adding Employee</span>
              <p className="text-xs text-gray-500">(This is an irreversible action.)</p>
            </div>
            <button
              onClick={() => setPreboarding(!preboarding)}
              className={`w-12 h-6 rounded-full transition-colors ${preboarding ? 'bg-[#82154F]' : 'bg-gray-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${preboarding ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-700">Create Login Details</span>
            <button
              onClick={() => setCreateLogin(!createLogin)}
              className={`w-12 h-6 rounded-full transition-colors ${createLogin ? 'bg-[#82154F]' : 'bg-gray-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${createLogin ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
          <button
            onClick={() => navigate('/hr/employee-management/employee-list')}
            className="h-10 px-6 border border-gray-300 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button className="h-10 px-6 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm font-medium transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

