import { Bell, Search, Menu } from 'lucide-react';
import { useBrandingStore } from '@/stores/useBrandingStore';
import { useAppStore } from '@/stores/useAppStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface TopBarProps {
  title: string;
  actions?: React.ReactNode;
}

export function TopBar({ title, actions }: TopBarProps) {
  const { organizationName, organizationAcronym, organizationLogo } = useBrandingStore(
    (s) => s.settings
  );
  const { user } = useAuth();
  const { toggleMobileNav } = useAppStore();

  return (
    <header
      className={cn(
        'sticky top-0 z-20 flex h-14 w-full max-w-full min-w-0 shrink-0 items-center gap-3 overflow-hidden border-b border-white/10 md:h-16',
        'bg-glass/80 backdrop-blur-glass px-4 md:px-6 shadow-sm'
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden shrink-0"
        onClick={toggleMobileNav}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {organizationLogo ? (
          <img src={organizationLogo} alt="" className="h-8 w-8 shrink-0 rounded-lg object-contain" />
        ) : (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-primary text-xs font-bold text-white">
            {organizationAcronym.slice(0, 2)}
          </div>
        )}
        <div className="min-w-0 hidden sm:block">
          <p className="truncate text-xs text-muted-foreground">{organizationName}</p>
          <h1 className="truncate text-base font-semibold md:text-lg">{title}</h1>
        </div>
        <h1 className="truncate text-base font-semibold sm:hidden">{title}</h1>
      </div>
      <div className="mx-4 hidden min-w-0 max-w-md flex-1 md:flex">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search programs, requests, staff..." className="pl-9 bg-background/50" />
        </div>
      </div>
      <div className="flex min-w-0 shrink-0 items-center gap-2">
        {actions}
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2 pl-2 border-l border-border/50">
          <img
            src={user?.avatar}
            alt=""
            className="h-8 w-8 shrink-0 rounded-full object-cover ring-2 ring-brand-primary/20"
          />
          <span className="hidden md:inline text-sm font-medium truncate max-w-[120px]">
            {user?.name ?? 'User'}
          </span>
        </div>
      </div>
    </header>
  );
}
