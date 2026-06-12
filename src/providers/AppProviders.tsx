import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { BrandingProvider } from './BrandingProvider';
import { useBrandingStore } from '@/stores/useBrandingStore';
import { AuthProvider } from '@/contexts/AuthContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, retry: 1 },
  },
});

function ThemeBridge({ children }: { children: React.ReactNode }) {
  const themeMode = useBrandingStore((s) => s.settings.themeMode);
  const theme = themeMode === 'auto' ? 'system' : themeMode === 'custom' ? 'light' : themeMode;
  return (
    <ThemeProvider
      key={themeMode}
      attribute="class"
      defaultTheme={theme}
      forcedTheme={themeMode === 'auto' ? undefined : theme}
      enableSystem={themeMode === 'auto'}
    >
      {children}
    </ThemeProvider>
  );
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrandingProvider>
        <ThemeBridge>
          <AuthProvider>{children}</AuthProvider>
          <Toaster richColors position="top-right" />
        </ThemeBridge>
      </BrandingProvider>
    </QueryClientProvider>
  );
}
