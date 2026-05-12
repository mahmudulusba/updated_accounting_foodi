import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useApp } from '@/contexts/AppContext';
import { useFilteredGLEntries } from '@/hooks/useAccountingFilter';
import {
  TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { ChevronDown, ChevronRight, Download, Filter, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ParentNode {
  id: string;
  glName: string;
  glCode: string;
  glType: string;
  parentGLCode: string;
  isReconGL?: boolean;
  reconGLFor?: string;
  status: string;
  isLeaf: boolean;
  children: ParentNode[];
  depth: number;
}

function buildHierarchy(
  parentGLs: { glCode: string; glName: string; glType: string; parentGLCode: string; status: string }[],
  glEntries: { glCode: string; glName: string; glType: string; parentGLCode: string; isReconGL: boolean; reconGLFor: string; status: string; branchConsolidation?: string }[]
): ParentNode[] {
  const topLevel = parentGLs
    .filter(p => !p.parentGLCode)
    .sort((a, b) => a.glCode.localeCompare(b.glCode));

  const buildNode = (code: string, name: string, type: string, parentCode: string, status: string, depth: number): ParentNode => {
    const subParents = parentGLs
      .filter(p => p.parentGLCode === code)
      .sort((a, b) => a.glCode.localeCompare(b.glCode));

    const leafGLs = glEntries
      .filter(e => e.parentGLCode === code)
      .sort((a, b) => a.glCode.localeCompare(b.glCode));

    const children: ParentNode[] = [
      ...subParents.map(sp => buildNode(sp.glCode, sp.glName, sp.glType, sp.parentGLCode, sp.status, depth + 1)),
      ...leafGLs.map(gl => ({
        id: gl.glCode,
        glName: gl.glName,
        glCode: gl.glCode,
        glType: gl.glType,
        parentGLCode: code,
        isReconGL: gl.isReconGL,
        reconGLFor: gl.reconGLFor,
        status: gl.status === 'active' ? 'Active' : 'Inactive',
        isLeaf: true,
        children: [],
        depth: depth + 1,
      })),
    ];

    return {
      id: code,
      glName: name,
      glCode: code,
      glType: type,
      parentGLCode: parentCode,
      status: status === 'active' ? 'Active' : 'Inactive',
      isLeaf: false,
      children,
      depth,
    };
  };

  return topLevel.map(t => buildNode(t.glCode, t.glName, t.glType, '', t.status, 0));
}

const dummyParentGLs = [
  { glCode: '10000', glName: 'Assets', glType: 'Asset', parentGLCode: '', status: 'active' },
  { glCode: '11000', glName: 'Current Asset', glType: 'Asset', parentGLCode: '10000', status: 'active' },
  { glCode: '10201', glName: 'Accounts Receivable', glType: 'Asset', parentGLCode: '11000', status: 'active' },
  { glCode: '11100', glName: 'Cash & cash Equivalents', glType: 'Asset', parentGLCode: '11000', status: 'active' },
  { glCode: '11101', glName: 'Cash in Hand', glType: 'Asset', parentGLCode: '11100', status: 'active' },
  { glCode: '11102', glName: 'Cash at Bank', glType: 'Asset', parentGLCode: '11100', status: 'active' },
  { glCode: '11201', glName: 'Trade Receivables', glType: 'Asset', parentGLCode: '11000', status: 'active' },
  { glCode: '11301', glName: 'Employee Advance', glType: 'Asset', parentGLCode: '11000', status: 'active' },
  { glCode: '11302', glName: 'Supplier Advance', glType: 'Asset', parentGLCode: '11000', status: 'active' },
  { glCode: '11303', glName: 'Security Deposit', glType: 'Asset', parentGLCode: '11000', status: 'active' },
  { glCode: '20000', glName: 'Liabilities', glType: 'Liabilities', parentGLCode: '', status: 'active' },
  { glCode: '21000', glName: 'Current Liabilities', glType: 'Liabilities', parentGLCode: '20000', status: 'active' },
  { glCode: '21101', glName: 'Trade Payables', glType: 'Liabilities', parentGLCode: '21000', status: 'active' },
  { glCode: '21201', glName: 'Customer Advance', glType: 'Liabilities', parentGLCode: '21000', status: 'active' },
  { glCode: '30000', glName: 'Equity', glType: 'Equity', parentGLCode: '', status: 'active' },
  { glCode: '40000', glName: 'Revenue', glType: 'Revenue', parentGLCode: '', status: 'active' },
  { glCode: '41101', glName: 'Operating Revenue', glType: 'Revenue', parentGLCode: '40000', status: 'active' },
  { glCode: '50000', glName: 'Expenses', glType: 'Expense', parentGLCode: '', status: 'active' },
  { glCode: '51101', glName: 'Office Expenses', glType: 'Expense', parentGLCode: '50000', status: 'active' },
  { glCode: '51102', glName: 'Conveyance Expenses', glType: 'Expense', parentGLCode: '50000', status: 'active' },
  { glCode: '51201', glName: 'Staff Expenses', glType: 'Expense', parentGLCode: '50000', status: 'active' },
  { glCode: '51301', glName: 'Utility Expenses', glType: 'Expense', parentGLCode: '50000', status: 'active' },
];

// Demo party list shown in View dialog for Recon GLs
const demoReconParties: Record<string, { id: string; partyId: string; partyName: string }[]> = {
  default: [
    { id: '1', partyId: '101', partyName: 'ARABI TRAVELS' },
    { id: '2', partyId: '106', partyName: 'Travel Times & Tours' },
    { id: '3', partyId: '109', partyName: 'Travel Care Tours & Travels' },
    { id: '4', partyId: '110', partyName: 'NAHAR TRAVELS' },
    { id: '5', partyId: '111', partyName: 'sheikh travels and tourism' },
  ],
};

interface RowFilters {
  glName: string;
  glCode: string;
  parentGLCode: string;
  glType: string;
  isReconGL: string; // 'all' | 'yes' | 'no'
  reconGLFor: string;
  status: string; // 'all' | 'Active' | 'Inactive'
}

const emptyFilters: RowFilters = {
  glName: '',
  glCode: '',
  parentGLCode: '',
  glType: '',
  isReconGL: 'all',
  reconGLFor: '',
  status: 'all',
};

function nodeMatchesFilters(node: ParentNode, f: RowFilters): boolean {
  if (f.glName && !node.glName.toLowerCase().includes(f.glName.toLowerCase())) return false;
  if (f.glCode && !node.glCode.toLowerCase().includes(f.glCode.toLowerCase())) return false;
  if (f.parentGLCode && !(node.parentGLCode || '').toLowerCase().includes(f.parentGLCode.toLowerCase())) return false;
  if (f.glType && !node.glType.toLowerCase().includes(f.glType.toLowerCase())) return false;
  if (f.isReconGL !== 'all') {
    const yes = !!node.isReconGL;
    if (f.isReconGL === 'yes' && !yes) return false;
    if (f.isReconGL === 'no' && yes) return false;
  }
  if (f.reconGLFor && !(node.reconGLFor || '').toLowerCase().includes(f.reconGLFor.toLowerCase())) return false;
  if (f.status !== 'all' && node.status !== f.status) return false;
  return true;
}

function filterTree(nodes: ParentNode[], f: RowFilters): ParentNode[] {
  const active = f.glName || f.glCode || f.parentGLCode || f.glType || f.reconGLFor
    || f.isReconGL !== 'all' || f.status !== 'all';
  if (!active) return nodes;
  const result: ParentNode[] = [];
  nodes.forEach(n => {
    const filteredChildren = filterTree(n.children, f);
    if (nodeMatchesFilters(n, f) || filteredChildren.length > 0) {
      result.push({ ...n, children: filteredChildren });
    }
  });
  return result;
}

function TreeRow({
  node, expanded, onToggle, onView,
}: {
  node: ParentNode;
  expanded: Set<string>;
  onToggle: (id: string) => void;
  onView: (node: ParentNode) => void;
}) {
  const isExpanded = expanded.has(node.id);
  const hasChildren = node.children.length > 0;
  const indent = node.depth * 24;

  return (
    <>
      <TableRow className={cn(
        node.isLeaf ? '' : 'font-semibold',
        !node.isLeaf && 'bg-muted/30',
      )}>
        <TableCell className="w-10 text-center">
          {hasChildren ? (
            <button onClick={() => onToggle(node.id)} className="p-0.5 hover:bg-muted rounded">
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          ) : (
            <ChevronRight size={16} className="text-primary inline" />
          )}
        </TableCell>
        <TableCell style={{ paddingLeft: `${indent + 16}px` }}>
          {node.isLeaf ? <span className="italic text-muted-foreground">{node.glName}</span> : node.glName}
        </TableCell>
        <TableCell className="font-mono text-sm">{node.isLeaf ? node.glCode : <strong>{node.glCode}</strong>}</TableCell>
        <TableCell className="font-mono text-sm text-muted-foreground">{node.parentGLCode || ''}</TableCell>
        <TableCell>
          <span className={cn(
            'text-xs font-medium',
            node.glType.includes('Asset') && 'text-primary',
            node.glType.includes('Liabilit') && 'text-orange-600',
            node.glType.includes('Equity') && 'text-purple-600',
            node.glType.includes('Revenue') && 'text-success',
            node.glType.includes('Expense') && 'text-destructive',
          )}>
            {node.glType}
          </span>
        </TableCell>
        <TableCell className="text-center">{node.isLeaf ? (node.isReconGL ? 'Yes' : 'No') : ''}</TableCell>
        <TableCell>
          {node.isLeaf && node.isReconGL ? (
            <Badge variant="secondary" className="text-xs">{node.reconGLFor}</Badge>
          ) : ''}
        </TableCell>
        <TableCell className="text-center">
          {node.isLeaf && (
            <span className={cn(
              'inline-flex items-center gap-1 text-xs',
              node.status === 'Active' ? 'text-success' : 'text-muted-foreground'
            )}>
              <span className={cn('w-2 h-2 rounded-full', node.status === 'Active' ? 'bg-success' : 'bg-muted-foreground')} />
              {node.status}
            </span>
          )}
        </TableCell>
        <TableCell className="text-center">
          {node.isLeaf && node.isReconGL && (
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onView(node)}>
              <Eye size={15} className="text-primary" />
            </Button>
          )}
        </TableCell>
      </TableRow>
      {isExpanded && node.children.map(child => (
        <TreeRow key={child.id} node={child} expanded={expanded} onToggle={onToggle} onView={onView} />
      ))}
    </>
  );
}

export default function ChartOfAccounts() {
  const { glEntries } = useApp();
  const filteredGLEntries = useFilteredGLEntries(glEntries);
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['10000', '11000', '11100', '11101', '11102']));
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<RowFilters>(emptyFilters);
  const [viewNode, setViewNode] = useState<ParentNode | null>(null);

  const tree = useMemo(() => {
    const glForTree = filteredGLEntries.map(e => ({
      glCode: e.glCode,
      glName: e.glName,
      glType: e.glType,
      parentGLCode: e.parentGLCode,
      isReconGL: e.isReconGL,
      reconGLFor: e.reconGLFor,
      status: e.status,
      branchConsolidation: e.branchConsolidation,
    }));
    return buildHierarchy(dummyParentGLs, glForTree);
  }, [filteredGLEntries]);

  const visibleTree = useMemo(() => filterTree(tree, filters), [tree, filters]);

  const toggleNode = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const updateFilter = <K extends keyof RowFilters>(key: K, value: RowFilters[K]) =>
    setFilters(prev => ({ ...prev, [key]: value }));

  const parties = viewNode ? (demoReconParties[viewNode.glCode] || demoReconParties.default) : [];

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Top bar: breadcrumb left, action icons right */}
        <div className="flex items-center justify-between">
          <nav className="text-sm text-muted-foreground">
            <span className="text-primary font-medium">GL Module</span> / Chart of Accounts
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-9 w-9"><Download size={16} /></Button>
            <Button
              variant={showFilters ? 'default' : 'outline'}
              size="icon"
              className="h-9 w-9"
              onClick={() => setShowFilters(s => !s)}
            >
              <Filter size={16} />
            </Button>
          </div>
        </div>

        {/* Centered title */}
        <h1 className="text-xl font-bold text-center">Chart Of Accounts</h1>

        <div className="border rounded-lg overflow-hidden">
          <TableWithSearch>
            <TableHeader>
              <TableRow className="bg-table-header hover:bg-table-header">
                <TableHead className="text-table-header-foreground font-semibold w-10" />
                <TableHead className="text-table-header-foreground font-semibold">GL Name</TableHead>
                <TableHead className="text-table-header-foreground font-semibold">Account</TableHead>
                <TableHead className="text-table-header-foreground font-semibold">GL Parent No.</TableHead>
                <TableHead className="text-table-header-foreground font-semibold">GL Type</TableHead>
                <TableHead className="text-table-header-foreground font-semibold text-center">Is ReconGL</TableHead>
                <TableHead className="text-table-header-foreground font-semibold">Recon GL For</TableHead>
                <TableHead className="text-table-header-foreground font-semibold text-center">Status</TableHead>
                <TableHead className="text-table-header-foreground font-semibold text-center w-20">View</TableHead>
              </TableRow>
              {showFilters && (
                <TableRow key="__filter-row" className="bg-muted/40 hover:bg-muted/40">
                  <TableHead />
                  <TableHead><Input value={filters.glName} onChange={e => updateFilter('glName', e.target.value)} placeholder="Search..." className="h-8" /></TableHead>
                  <TableHead><Input value={filters.glCode} onChange={e => updateFilter('glCode', e.target.value)} placeholder="Search..." className="h-8" /></TableHead>
                  <TableHead><Input value={filters.parentGLCode} onChange={e => updateFilter('parentGLCode', e.target.value)} placeholder="Search..." className="h-8" /></TableHead>
                  <TableHead><Input value={filters.glType} onChange={e => updateFilter('glType', e.target.value)} placeholder="Search..." className="h-8" /></TableHead>
                  <TableHead>
                    <Select value={filters.isReconGL} onValueChange={v => updateFilter('isReconGL', v)}>
                      <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">-- All --</SelectItem>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableHead>
                  <TableHead><Input value={filters.reconGLFor} onChange={e => updateFilter('reconGLFor', e.target.value)} placeholder="Search..." className="h-8" /></TableHead>
                  <TableHead>
                    <Select value={filters.status} onValueChange={v => updateFilter('status', v)}>
                      <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">-- All --</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableHead>
                  <TableHead />
                </TableRow>
              )}
            </TableHeader>
            <TableBody>
              {visibleTree.map(node => (
                <TreeRow key={node.id} node={node} expanded={expanded} onToggle={toggleNode} onView={setViewNode} />
              ))}
              {visibleTree.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">No GL entries found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </TableWithSearch>
        </div>
      </div>

      {/* View dialog: list of suppliers/customers mapped to the Recon GL */}
      <Dialog open={!!viewNode} onOpenChange={(o) => !o && setViewNode(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {viewNode?.reconGLFor || 'Recon GL'} mapped to {viewNode?.glCode} - {viewNode?.glName}
            </DialogTitle>
          </DialogHeader>
          <div className="rounded-md border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-table-header">
                <tr>
                  <th className="h-10 px-3 text-left text-table-header-foreground font-semibold w-16">SL No</th>
                  <th className="h-10 px-3 text-left text-table-header-foreground font-semibold w-28">{viewNode?.reconGLFor === 'Customer' ? 'Customer ID' : 'Supplier ID'}</th>
                  <th className="h-10 px-3 text-left text-table-header-foreground font-semibold">{viewNode?.reconGLFor === 'Customer' ? 'Customer Name' : 'Supplier Name'}</th>
                </tr>
              </thead>
              <tbody>
                {parties.map((p, i) => (
                  <tr key={p.id} className={i % 2 ? 'bg-muted/30' : ''}>
                    <td className="px-3 py-2">{i + 1}</td>
                    <td className="px-3 py-2 font-mono">{p.partyId}</td>
                    <td className="px-3 py-2">{p.partyName}</td>
                  </tr>
                ))}
                {parties.length === 0 && (
                  <tr><td colSpan={3} className="text-center py-6 text-muted-foreground">No parties mapped</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
