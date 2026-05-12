import React, { useMemo, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileText } from 'lucide-react';

type Node = { label: string; children?: Node[] };

const TREE: Record<string, Record<string, Node>> = {
  Accounting: {
    'Central Configuration': {
      label: 'Root',
      children: [
        {
          label: 'Central Configuration',
          children: [
            { label: 'Currency' },
            { label: 'Branch' },
            { label: 'Branch Wise GL Code Mapping' },
            { label: 'Currency Rate' },
            { label: 'Fiscal Year' },
            { label: 'Holiday' },
            { label: 'Weekend' },
            { label: 'Lock Date' },
            { label: 'Voucher Type' },
            { label: 'Policy Setup' },
          ],
        },
        {
          label: 'Center Setup',
          children: [
            { label: 'SBU' },
            { label: 'Service Line' },
            { label: 'Department' },
            { label: 'Financial Center' },
          ],
        },
        {
          label: 'GL Module',
          children: [
            { label: 'Parent GL' },
            { label: 'General Ledger' },
            { label: 'Chart of Accounts' },
          ],
        },
        { label: 'Data Upload' },
        {
          label: 'Voucher',
          children: [
            { label: 'Voucher Entry' },
            { label: 'Voucher List' },
            { label: 'Batch Voucher' },
            { label: 'Batch Voucher List' },
          ],
        },
        {
          label: 'Reports',
          children: [
            { label: 'Transaction Report' },
            { label: 'General Ledger Report' },
            { label: 'General Ledger Summary Report' },
            { label: 'Trial Balance Report' },
            { label: 'Trial Balance Extended Report' },
            { label: 'Payment Receipt Report' },
            { label: 'Financial Report' },
            { label: 'Cash Flow Report' },
            { label: 'Income Statement' },
            { label: 'Balance Sheet' },
            { label: 'Ratio Analysis Report' },
            { label: 'Currency Rate Report' },
            { label: 'GL Aging Report' },
          ],
        },
        {
          label: 'Party',
          children: [
            { label: 'Party Type Setup' },
            { label: 'Party Master' },
            { label: 'Party List' },
            { label: 'Party Recon GL Config' },
          ],
        },
      ],
    },
    Voucher: {
      label: 'Root',
      children: [
        {
          label: 'Voucher',
          children: [
            { label: 'Voucher Entry' },
            { label: 'Voucher List' },
            { label: 'Batch Voucher' },
            { label: 'Batch Voucher List' },
            { label: 'Fund Transfer' },
          ],
        },
      ],
    },
    Reports: {
      label: 'Root',
      children: [
        {
          label: 'Reports',
          children: [
            { label: 'Transaction Report' },
            { label: 'General Ledger Report' },
            { label: 'Trial Balance Report' },
            { label: 'Income Statement' },
            { label: 'Balance Sheet' },
            { label: 'Cash Flow Report' },
          ],
        },
      ],
    },
  },
  'Ground Handling': {
    Configuration: {
      label: 'Root',
      children: [
        {
          label: 'Configuration',
          children: [
            { label: 'Stations' },
            { label: 'Suppliers' },
            { label: 'Services' },
            { label: 'Criteria' },
            { label: 'Aircraft Setup' },
            { label: 'Route Setup' },
            {
              label: 'Agreements',
              children: [
                { label: 'New Agreement' },
                { label: 'Agreement Comparison' },
              ],
            },
            { label: 'Terms & Conditions' },
          ],
        },
        {
          label: 'Operations',
          children: [
            { label: 'Service Data Entry' },
            { label: 'Journey Log' },
            { label: 'Invoice List' },
            { label: 'Invoice Reconciliation' },
          ],
        },
        {
          label: 'Reports',
          children: [
            { label: 'Station Wise Report' },
            { label: 'Service Utilization Report' },
            { label: 'Reconciliation Report' },
            { label: 'Forecasted Costing' },
          ],
        },
      ],
    },
  },
  'Fixed Asset': {
    Configuration: {
      label: 'Root',
      children: [
        {
          label: 'Configuration',
          children: [
            { label: 'Asset Group Setup' },
            { label: 'Asset Recon GL Mapping' },
            { label: 'Value Adjustment Rules' },
            { label: 'Employee Directory' },
          ],
        },
        {
          label: 'Operations',
          children: [
            { label: 'Asset Registration' },
            { label: 'Asset Allocation' },
            { label: 'Asset Transfer' },
            { label: 'Asset Maintenance' },
            { label: 'Asset Renovation' },
            { label: 'Asset Revaluation' },
            { label: 'Asset Depreciation' },
            { label: 'Asset Disposal' },
          ],
        },
        {
          label: 'Reports',
          children: [
            { label: 'Asset Details Report' },
            { label: 'Asset Schedule Report' },
            { label: 'Asset Allocation Report' },
            { label: 'Asset Maintenance Report' },
            { label: 'Asset Disposal Report' },
          ],
        },
      ],
    },
  },
};

function TreeRow({ node, depth = 0 }: { node: Node; depth?: number }) {
  const [open, setOpen] = useState(true);
  const hasChildren = !!node.children?.length;
  return (
    <div>
      <div
        className="flex items-center gap-1.5 py-1 hover:bg-muted/50 rounded cursor-pointer"
        style={{ paddingLeft: depth * 20 }}
        onClick={() => hasChildren && setOpen(!open)}
      >
        {hasChildren ? (
          <>
            {open ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
            {open ? <FolderOpen className="h-4 w-4 text-primary" /> : <Folder className="h-4 w-4 text-primary" />}
            <span className="text-sm font-medium">{node.label}</span>
          </>
        ) : (
          <>
            <span className="w-3.5" />
            <span className="text-primary">→</span>
            <span className="text-sm">{node.label}</span>
          </>
        )}
      </div>
      {hasChildren && open && (
        <div>
          {node.children!.map((c, i) => <TreeRow key={i} node={c} depth={depth + 1} />)}
        </div>
      )}
    </div>
  );
}

export default function MenuTreeView() {
  const [module, setModule] = useState('Accounting');
  const [submodule, setSubmodule] = useState('Central Configuration');

  const modules = Object.keys(TREE);
  const submodules = useMemo(() => Object.keys(TREE[module] ?? {}), [module]);
  const tree = TREE[module]?.[submodule];

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <Card className="px-4 py-3 rounded-md">
          <div className="text-sm">
            <span className="text-primary font-semibold">Configuration</span>
            <span className="mx-2 text-muted-foreground">/</span>
            <span>Menu</span>
          </div>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">Menu</h2>
            <div className="border-b mb-4" />
            <div className="grid gap-4 md:grid-cols-2 max-w-3xl">
              <div className="grid grid-cols-[160px_1fr] items-center gap-3">
                <Label>Module Name <span className="text-destructive">*</span></Label>
                <Select value={module} onValueChange={(v) => { setModule(v); const subs = Object.keys(TREE[v] ?? {}); setSubmodule(subs[0] ?? ''); }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover z-[9999]">
                    {modules.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-[160px_1fr] items-center gap-3">
                <Label>Submodule Name <span className="text-destructive">*</span></Label>
                <Select value={submodule} onValueChange={setSubmodule}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover z-[9999]">
                    {submodules.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">Menu Tree View</h2>
            <div className="border-b mb-4" />
            {tree ? (
              <div className="font-sans">
                <TreeRow node={tree} />
              </div>
            ) : (
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" />
                No menu found for this selection.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
