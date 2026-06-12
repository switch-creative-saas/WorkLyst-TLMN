import { ModulePage } from '@/components/layout/ModulePage';
import { DataTable } from '@/components/shared/DataTable';
import { beneficiaries } from '@/data/ngo/programs';
import type { Beneficiary } from '@/types/ngo';

export function BeneficiariesPage() {
  const columns = [
    { key: 'name', header: 'Beneficiary Group' },
    { key: 'category', header: 'Category' },
    { key: 'location', header: 'Location' },
    { key: 'programId', header: 'Program ID' },
  ];

  return (
    <ModulePage title="Beneficiaries" breadcrumbs={[{ label: 'Operations' }, { label: 'Beneficiaries' }]}>
      <DataTable columns={columns} data={beneficiaries as Beneficiary[]} />
    </ModulePage>
  );
}
