import { useEffect } from 'react';
import { ModuleSidebar } from './ModuleSidebar';

/** Mobile overlay nav — sidebar handles mobile state */
export function MobileNav() {
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) {
        // desktop: sidebar always visible via CSS
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return <ModuleSidebar />;
}
