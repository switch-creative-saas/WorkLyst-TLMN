import { Home, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  route?: string;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-1.5 px-4 py-2 bg-white border-b border-gray-100 text-sm">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1 text-gray-500 hover:text-[#82154F] transition-colors"
      >
        <Home className="w-4 h-4" />
      </button>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1.5">
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          {item.route ? (
            <button
              onClick={() => navigate(item.route!)}
              className="text-gray-600 hover:text-[#82154F] transition-colors"
            >
              {item.label}
            </button>
          ) : (
            <span className={index === items.length - 1 ? 'text-[#82154F] font-medium' : 'text-gray-600'}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

