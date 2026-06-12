import { useAppStore } from '@/stores/useAppStore';
import { useBrandingStore } from '@/stores/useBrandingStore';
import { HelpCircle, Share2, ChevronDown } from 'lucide-react';

interface TopHeaderProps {
  title?: string;
}

export function TopHeader({ title }: TopHeaderProps) {
  const { activeModule } = useAppStore();
  const { appName, logoUrl } = useBrandingStore((s) => s.config.branding);
  const displayTitle = title || activeModule;

  return (
    <div className="bg-gradient-to-r from-orange-500 to-orange-400 text-white">
      {/* Main Header Bar */}
      <div className="h-12 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          {logoUrl && (
            <img src={logoUrl} alt="" className="h-6" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          )}
          {!logoUrl && <span className="text-sm font-bold">{appName || 'Worklyst'}</span>}
          <span className="text-lg font-semibold">{displayTitle}</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 ml-2 pl-2 border-l border-white/30">
            <span className="text-sm">Log Out</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
