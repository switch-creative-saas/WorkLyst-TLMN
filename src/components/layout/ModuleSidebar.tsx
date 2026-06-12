import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, LogOut, ShieldAlert } from 'lucide-react';
import { navForRole } from '@/config/roleNavigation';
import { useAppStore } from '@/stores/useAppStore';
import { useBrandingStore } from '@/stores/useBrandingStore';
import { useAuth } from '@/contexts/AuthContext';
import { useSafeguardingStore } from '@/stores/useSafeguardingStore';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function ModuleSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const unreadSafeguarding = useSafeguardingStore((state) => state.unreadForLead(user?.id ?? ''));
  const safeguardingLeadId = useSafeguardingStore((state) => state.safeguardingLeadId);
  const navigationGroups = [
    ...navForRole(user?.role ?? 'Employee (ESS)'),
    ...(user?.id === safeguardingLeadId
      ? [
          {
            id: 'safeguarding',
            label: 'Safeguarding',
            items: [{ label: 'Safeguarding Inbox', route: '/safeguarding/inbox', icon: ShieldAlert }],
          },
        ]
      : []),
  ];
  const { sidebarCollapsed, toggleSidebar, mobileNavOpen, setMobileNavOpen } = useAppStore();
  const { organizationName, organizationAcronym, organizationLogo, sidebarStyle } = useBrandingStore(
    (s) => s.settings
  );
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    insights: true,
    operations: true,
    people: true,
  });
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  const toggleGroup = (id: string) => {
    setExpandedGroups((g) => ({ ...g, [id]: !g[id] }));
  };

  const handleLogout = async () => {
    await logout();
    setLogoutConfirmOpen(false);
    setMobileNavOpen(false);
    navigate('/login', { replace: true });
  };

  const sidebarClass = cn(
    'fixed left-0 top-0 z-40 flex h-screen shrink-0 flex-col overflow-x-hidden border-r transition-all duration-300 lg:relative',
    sidebarStyle === 'glass' && 'bg-glass/90 backdrop-blur-glass border-white/10 shadow-glass',
    sidebarStyle === 'solid' && 'bg-sidebar border-sidebar-border',
    sidebarStyle === 'minimal' && 'bg-background/95 border-border',
    sidebarCollapsed ? 'w-16' : 'w-[260px]',
    'lg:translate-x-0',
    mobileNavOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
  );

  return (
    <>
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            onClick={() => setMobileNavOpen(false)}
          />
        )}
      </AnimatePresence>
      <aside className={sidebarClass}>
        <div className="flex h-16 shrink-0 items-center gap-2 border-b border-border/30 px-3">
          {organizationLogo ? (
            <img src={organizationLogo} alt="" className="h-9 w-9 shrink-0 rounded-lg object-contain" />
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-primary text-sm font-bold text-white">
              {organizationAcronym.slice(0, 2)}
            </div>
          )}
          {!sidebarCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{organizationAcronym}</p>
              <p className="truncate text-[10px] text-muted-foreground leading-tight">
                {organizationName}
              </p>
            </div>
          )}
        </div>

        <nav className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden py-3 px-2">
          {navigationGroups.map((group) => (
            <div key={group.id} className="mb-3 min-w-0">
              {!sidebarCollapsed && (
                <button
                  type="button"
                  onClick={() => toggleGroup(group.id)}
                  className="mb-1 flex w-full items-center justify-between px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  {group.label}
                  <ChevronRight
                    className={cn('h-3 w-3 transition-transform', expandedGroups[group.id] !== false && 'rotate-90')}
                  />
                </button>
              )}
              {(sidebarCollapsed || expandedGroups[group.id] !== false) && (
                <ul className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const itemPath = item.route.split('?')[0];
                    const active =
                      itemPath === '/'
                        ? location.pathname === '/'
                        : location.pathname.startsWith(itemPath);

                    return (
                      <li key={item.route}>
                        <NavLink
                          to={item.route}
                          onClick={() => setMobileNavOpen(false)}
                          className={cn(
                            'flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors',
                            active
                              ? 'bg-brand-primary/15 text-brand-primary font-medium'
                              : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                          )}
                          title={sidebarCollapsed ? item.label : undefined}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                          {!sidebarCollapsed && item.route === '/safeguarding/inbox' && unreadSafeguarding > 0 && (
                            <span className="ml-auto rounded-full bg-[#E1332A] px-2 py-0.5 text-[10px] font-bold text-white">
                              {unreadSafeguarding}
                            </span>
                          )}
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ))}
        </nav>

        <div className="min-w-0 shrink-0 space-y-1 border-t border-border/30 p-2">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2 rounded-lg px-2 py-2">
              <img src={user?.avatar} alt="" className="h-8 w-8 shrink-0 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium">{user?.name ?? 'TLMN User'}</p>
                <p className="truncate text-[10px] text-muted-foreground">
                  {user?.designation ?? user?.role ?? 'Staff'}
                </p>
              </div>
            </div>
          )}
          <div className="relative">
            {logoutConfirmOpen && (
              <div className="absolute bottom-full left-2 right-2 z-50 mb-2 rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-lg">
                <p className="text-xs font-medium">Are you sure you want to log out?</p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-md bg-[#E1332A] px-2.5 py-1.5 text-xs font-medium text-white hover:bg-[#C42B24]"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogoutConfirmOpen(false)}
                    className="rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={() => setLogoutConfirmOpen((open) => !open)}
              className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-[#E1332A]/10 hover:text-[#E1332A]"
              title={sidebarCollapsed ? 'Log out' : undefined}
            >
              <LogOut className="h-4 w-4" />
              {!sidebarCollapsed && <span>Log out</span>}
            </button>
          </div>
          <button
            type="button"
            onClick={toggleSidebar}
            className="hidden lg:flex w-full items-center justify-center rounded-lg py-2 text-muted-foreground hover:bg-muted/60"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
      </aside>
    </>
  );
}
