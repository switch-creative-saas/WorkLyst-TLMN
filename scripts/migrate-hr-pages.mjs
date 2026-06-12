import fs from 'fs';
import path from 'path';

const pagesDir = path.join(process.cwd(), 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter((f) => f.endsWith('.tsx') && f !== 'HomePage.tsx' && !f.includes('settings'));

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('TopHeader')) continue;

  content = content.replace(
    /import \{ TopHeader \} from '@\/components\/layout\/TopHeader';\nimport \{ BreadcrumbNav \} from '@\/components\/layout\/BreadcrumbNav';/,
    "import { HrPageShell } from '@/components/layout/HrPageShell';"
  );

  const headerMatch = content.match(
    /<TopHeader title="([^"]+)" \/>\s*\n\s*<BreadcrumbNav items=\{(\[[\s\S]*?\])\} \/>/
  );
  if (!headerMatch) {
    console.log('Skip (no match):', file);
    continue;
  }

  const title = headerMatch[1];
  const breadcrumbs = headerMatch[2];
  content = content.replace(headerMatch[0], '');

  content = content.replace(
    /return \(\s*\n\s*<div>/,
    `return (\n    <HrPageShell title="${title}" breadcrumbs={${breadcrumbs}}>\n    <div>`
  );

  const lastDivClose = content.lastIndexOf('    </div>\n  );');
  if (lastDivClose !== -1) {
    content =
      content.slice(0, lastDivClose) +
      '    </div>\n    </HrPageShell>\n  );' +
      content.slice(lastDivClose + '    </div>\n  );'.length);
  }

  content = content.replace(/\/employee-management/g, '/hr/employee-management');
  content = content.replace(/text-orange-600 border-b-2 border-orange-500/g, 'text-brand-primary border-b-2 border-brand-primary');
  content = content.replace(/bg-white border-b border-gray-200/g, 'bg-glass/40 border-b border-border/40 backdrop-blur-sm');

  fs.writeFileSync(filePath, content);
  console.log('Migrated:', file);
}
