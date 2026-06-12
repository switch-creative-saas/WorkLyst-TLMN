import { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Node,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ModulePage } from '@/components/layout/ModulePage';
import { GlassCard } from '@/components/glass';
import { useWorkflows } from '@/api/hooks';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const initialNodes: Node[] = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'Supervisor' }, type: 'input' },
  { id: '2', position: { x: 200, y: 0 }, data: { label: 'Program Manager' } },
  { id: '3', position: { x: 400, y: 0 }, data: { label: 'Finance' } },
  { id: '4', position: { x: 600, y: 0 }, data: { label: 'Director' }, type: 'output' },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e3-4', source: '3', target: '4' },
];

export function WorkflowBuilderPage() {
  const { data: workflows = [] } = useWorkflows();
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <ModulePage
      title="Workflow Builder"
      breadcrumbs={[{ label: 'Settings' }, { label: 'Workflows' }]}
      actions={
        <Button onClick={() => toast.success('Workflow saved')} className="bg-brand-primary text-white">
          Save Workflow
        </Button>
      }
    >
      <GlassCard className="mb-4" padding="sm">
        <p className="text-sm text-muted-foreground">
          Configure approval steps, roles, escalation, and deadlines without code. Active workflows:{' '}
          {workflows.filter((w) => w.active).length}
        </p>
      </GlassCard>
      <div className="h-[500px] rounded-[var(--radius)] border border-border/50 bg-background/50 overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </ModulePage>
  );
}
