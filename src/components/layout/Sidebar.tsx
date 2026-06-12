import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '@/stores/useAppStore';
import { currentUser } from '@/data/employees';
import {
  Users, UserCog, BarChart3, Calendar, Clock, CheckSquare, CalendarDays,
  Search, UserPlus, GraduationCap, Target, TrendingUp, Route, ClipboardList,
  Link2, FileText, MessageSquare, Scale, Settings, ChevronLeft, ChevronRight,
  Search as SearchIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: UserCog, label: 'HR Administration', route: '/hr-administration' },
  { icon: Users, label: 'Employee Management', route: '/employee-management' },
  { icon: BarChart3, label: 'Reports and Analytics', route: '/reports' },
  { icon: Calendar, label: 'Leave', route: '/leave' },
  { icon: Clock, label: 'Time Tracking', route: '/time-tracking' },
  { icon: CheckSquare, label: 'Attendance', route: '/attendance' },
  { icon: CalendarDays, label: 'Roster', route: '/roster' },
  { icon: Search, label: 'Recruitment (ATS)', route: '/recruitment' },
  { icon: UserPlus, label: 'Onboarding', route: '/onboarding' },
  { icon: GraduationCap, label: 'Training', route: '/training' },
  { icon: Target, label: 'Goals', route: '/goals' },
  { icon: TrendingUp, label: 'Performance', route: '/performance' },
  { icon: Route, label: 'Career Development', route: '/career-development' },
  { icon: ClipboardList, label: 'Request Desk', route: '/request-desk' },
  { icon: Link2, label: 'Integrations', route: '/integrations' },
  { icon: FileText, label: 'Survey', route: '/survey' },
  { icon: MessageSquare, label: 'Employee Voice', route: '/employee-voice' },
  { icon: Scale, label: 'Discipline', route: '/discipline' },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarCollapsed, toggleSidebar, setActiveModule } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = searchQuery
    ? menuItems.filter((item) => item.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : menuItems;

  const handleNav = (route: string, label: string) => {
    setActiveModule(label);
    navigate(route);
  };

  const isActive = (route: string) => {
    return location.pathname.startsWith(route);
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-30 flex flex-col transition-all duration-300 ease-in-out',
        sidebarCollapsed ? 'w-16' : 'w-[240px]'
      )}
    >
      {/* User Profile Card */}
      <div className={cn('border-b border-gray-100', sidebarCollapsed ? 'p-2' : 'p-4')}>
        {!sidebarCollapsed ? (
          <div className="flex flex-col items-center">
            <div className="relative mb-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.firstName}
                className="w-16 h-16 rounded-full object-cover border-2 border-orange-200"
              />
              <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full shadow flex items-center justify-center hover:bg-gray-50">
                <Settings className="w-3.5 h-3.5 text-gray-500" />
              </button>
            </div>
            <h3 className="text-sm font-semibold text-gray-900 text-center">
              {currentUser.firstName} {currentUser.lastName}
            </h3>
            <p className="text-xs text-gray-500 text-center mt-0.5">{currentUser.jobTitle}</p>

            {/* Search */}
            <div className="relative w-full mt-3">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#82154F]/20 focus:border-[#82154F]"
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <img
              src={currentUser.avatar}
              alt={currentUser.firstName}
              className="w-10 h-10 rounded-full object-cover border-2 border-orange-200"
            />
          </div>
        )}
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-2 scrollbar-thin">
        {filteredItems.map((item) => {
          const active = isActive(item.route);
          const Icon = item.icon;
          return (
            <button
              key={item.route}
              onClick={() => handleNav(item.route, item.label)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-150 relative',
                active
                  ? 'text-[#82154F] bg-[#82154F]/5'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                sidebarCollapsed && 'justify-center px-2'
              )}
              title={sidebarCollapsed ? item.label : undefined}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#82154F] rounded-r-full" />
              )}
              <Icon className={cn('w-5 h-5 flex-shrink-0', active && 'text-[#82154F]')} />
              {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#82154F] text-white rounded-full flex items-center justify-center shadow-md hover:bg-[#6F1143] transition-colors z-40"
      >
        {sidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>
    </aside>
  );
}


