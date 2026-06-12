import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { ModulePage } from '@/components/layout/ModulePage';
import { DataTable } from '@/components/shared/DataTable';
import { WorkflowStatusBadge } from '@/components/shared/WorkflowStatusBadge';
import { Input } from '@/components/ui/input';
import { useDocuments } from '@/api/hooks';
import { Search } from 'lucide-react';
import type { NGODocument } from '@/types/ngo';

export function DocumentsPage() {
  const { data: documents = [] } = useDocuments();
  const [search, setSearch] = useState('');

  const fuse = useMemo(
    () => new Fuse(documents, { keys: ['title', 'category', 'tags'] }),
    [documents]
  );

  const filtered =
    search.trim() === '' ? documents : fuse.search(search).map((r) => r.item);

  const columns = [
    { key: 'title', header: 'Document' },
    { key: 'category', header: 'Category' },
    {
      key: 'version',
      header: 'Version',
      render: (row: NGODocument) => `v${row.version}`,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: NGODocument) => <WorkflowStatusBadge status={row.status} />,
    },
    { key: 'uploadedBy', header: 'Uploaded By' },
    { key: 'uploadedAt', header: 'Date' },
  ];

  return (
    <ModulePage title="Document Management" breadcrumbs={[{ label: 'Documents' }]}>
      <div className="relative max-w-md mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search documents..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <DataTable columns={columns} data={filtered} />
    </ModulePage>
  );
}
