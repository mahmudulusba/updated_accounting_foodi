import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, ChevronsDownUp, ChevronsUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface TreeNode {
  id: string;
  label: string;
  level: 'budget' | 'sbu' | 'dept' | 'hub' | 'city';
  children?: TreeNode[];
}

interface ValueState {
  initial: Record<string, string>;
  initialDate: Record<string, string>;
  adjusted: Record<string, string>;
  adjustedDate: Record<string, string>;
  remarks: Record<string, string>;
}

const seedTree: TreeNode[] = [
  {
    id: 'bh-1',
    label: 'Head Office Cash (11101001)',
    level: 'budget',
    children: [
      {
        id: 'sbu-foodi',
        label: 'Foodi',
        level: 'sbu',
        children: [
          {
            id: 'dept-foodi-acc',
            label: 'Accounts',
            level: 'dept',
            children: [
              {
                id: 'hub-foodi-acc-dhk',
                label: 'Dhaka',
                level: 'hub',
                children: [
                  { id: 'city-foodi-acc-dhk-dhk', label: 'Dhaka', level: 'city' },
                  { id: 'city-foodi-acc-dhk-nrg', label: 'Narayangonj', level: 'city' },
                ],
              },
            ],
          },
          {
            id: 'dept-foodi-mkt',
            label: 'Marketing',
            level: 'dept',
            children: [
              {
                id: 'hub-foodi-mkt-rj',
                label: 'Rajshahi',
                level: 'hub',
                children: [{ id: 'city-foodi-mkt-rj-rj', label: 'Rajshahi', level: 'city' }],
              },
            ],
          },
        ],
      },
      {
        id: 'sbu-mart',
        label: 'Mart',
        level: 'sbu',
        children: [
          {
            id: 'dept-mart-acc',
            label: 'Accounts',
            level: 'dept',
            children: [
              {
                id: 'hub-mart-acc-dhk',
                label: 'Dhaka',
                level: 'hub',
                children: [{ id: 'city-mart-acc-dhk-dhk', label: 'Dhaka', level: 'city' }],
              },
              {
                id: 'hub-mart-acc-rj',
                label: 'Rajshahi',
                level: 'hub',
                children: [{ id: 'city-mart-acc-rj-rj', label: 'Rajshahi', level: 'city' }],
              },
            ],
          },
        ],
      },
      {
        id: 'sbu-shop',
        label: 'Shop',
        level: 'sbu',
        children: [
          {
            id: 'dept-shop-mkt',
            label: 'Marketing',
            level: 'dept',
            children: [
              {
                id: 'hub-shop-mkt-dhk',
                label: 'Dhaka',
                level: 'hub',
                children: [{ id: 'city-shop-mkt-dhk-dhk', label: 'Dhaka', level: 'city' }],
              },
            ],
          },
          {
            id: 'dept-shop-acc',
            label: 'Accounts',
            level: 'dept',
            children: [
              {
                id: 'hub-shop-acc-dhk',
                label: 'Dhaka',
                level: 'hub',
                children: [{ id: 'city-shop-acc-dhk-dhk', label: 'Dhaka', level: 'city' }],
              },
              {
                id: 'hub-shop-acc-rj',
                label: 'Rajshahi',
                level: 'hub',
                children: [{ id: 'city-shop-acc-rj-rj', label: 'Rajshahi', level: 'city' }],
              },
            ],
          },
        ],
      },
    ],
  },
];

// Dummy seed values demonstrating roll-up behavior
const seedInitial: Record<string, string> = {
  'city-foodi-acc-dhk-dhk': '50000',
  'city-foodi-acc-dhk-nrg': '20000',
  'city-foodi-mkt-rj-rj': '30000',
  'city-mart-acc-dhk-dhk': '40000',
  'city-mart-acc-rj-rj': '25000',
  'city-shop-mkt-dhk-dhk': '15000',
  'city-shop-acc-dhk-dhk': '35000',
  'city-shop-acc-rj-rj': '18000',
};
const seedAdjusted: Record<string, string> = {
  'city-foodi-acc-dhk-dhk': '5000',
  'city-mart-acc-dhk-dhk': '4000',
};

const colHeaders = ['Budget Head', 'SBU', 'Department', 'Hub', 'City'] as const;
const levelOrder = ['budget', 'sbu', 'dept', 'hub', 'city'] as const;

function hasAnyDescendantValue(node: TreeNode, values: Record<string, string>): boolean {
  if (!node.children || node.children.length === 0) return false;
  return node.children.some(c => {
    const v = values[c.id];
    if (v && Number(v) > 0) return true;
    return hasAnyDescendantValue(c, values);
  });
}

function rollupSum(node: TreeNode, values: Record<string, string>): number {
  // Leaf: return its own value
  if (!node.children || node.children.length === 0) {
    return Number(values[node.id] || 0);
  }
  // Parent: if any descendant has a value, sum them; else use own typed value
  if (hasAnyDescendantValue(node, values)) {
    return node.children.reduce((acc, c) => acc + rollupSum(c, values), 0);
  }
  return Number(values[node.id] || 0);
}

const fmt = (n: number) => (n ? n.toLocaleString('en-US') : '0');

export default function AmountLinesTree() {
  const [expanded, setExpanded] = useState<Set<string>>(
    new Set(['bh-1', 'sbu-foodi', 'sbu-mart', 'sbu-shop', 'dept-foodi-acc', 'dept-foodi-mkt', 'dept-mart-acc', 'dept-shop-mkt', 'dept-shop-acc', 'hub-foodi-acc-dhk', 'hub-foodi-mkt-rj', 'hub-mart-acc-dhk', 'hub-mart-acc-rj', 'hub-shop-mkt-dhk', 'hub-shop-acc-dhk', 'hub-shop-acc-rj'])
  );
  const [values, setValues] = useState<ValueState>({
    initial: { ...seedInitial },
    initialDate: {},
    adjusted: { ...seedAdjusted },
    adjustedDate: {},
    remarks: {},
  });

  const toggle = (id: string) =>
    setExpanded(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const update = (field: keyof ValueState, id: string, v: string) =>
    setValues(s => ({ ...s, [field]: { ...s[field], [id]: v } }));

  const collectAllIds = (nodes: TreeNode[], out: Set<string>) => {
    nodes.forEach(n => {
      if (n.children && n.children.length) {
        out.add(n.id);
        collectAllIds(n.children, out);
      }
    });
  };
  const expandAll = () => {
    const s = new Set<string>();
    collectAllIds(seedTree, s);
    setExpanded(s);
  };
  const collapseAll = () => setExpanded(new Set());

  type Row = { node: TreeNode; depth: number };
  const flatRows: Row[] = useMemo(() => {
    const out: Row[] = [];
    const walk = (nodes: TreeNode[], depth: number) => {
      nodes.forEach(n => {
        out.push({ node: n, depth });
        if (expanded.has(n.id) && n.children) walk(n.children, depth + 1);
      });
    };
    walk(seedTree, 0);
    return out;
  }, [expanded]);

  const renderHierarchyCells = (row: Row) => {
    const { node, depth } = row;
    const cells: React.ReactNode[] = [];
    const hasChildren = !!node.children && node.children.length > 0;
    const isExpanded = expanded.has(node.id);
    const levelIdx = levelOrder.indexOf(node.level);

    for (let i = 0; i < 5; i++) {
      if (i === levelIdx) {
        cells.push(
          <td key={i} className="border px-2 py-1 align-middle">
            <div className="flex items-center gap-1" style={{ paddingLeft: depth * 14 }}>
              {hasChildren ? (
                <button onClick={() => toggle(node.id)} className="hover:bg-muted rounded p-0.5">
                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
              ) : (
                <span className="w-4 inline-block" />
              )}
              <span
                className={cn(
                  'text-xs',
                  node.level === 'budget' && 'font-semibold text-primary',
                  node.level === 'sbu' && 'font-medium',
                  node.level === 'city' && 'italic text-muted-foreground',
                )}
              >
                {node.level !== 'budget' && '>> '}
                {node.label}
              </span>
            </div>
          </td>
        );
      } else {
        cells.push(<td key={i} className="border bg-muted/10" />);
      }
    }
    return cells;
  };

  const renderAmountCell = (
    node: TreeNode,
    field: 'initial' | 'adjusted'
  ) => {
    const childrenHaveValues = hasAnyDescendantValue(node, values[field]);
    const isLeaf = !node.children || node.children.length === 0;
    const sum = rollupSum(node, values[field]);

    if (!isLeaf && childrenHaveValues) {
      return (
        <div className="px-2 text-right text-xs font-semibold bg-muted/40 py-1 rounded">
          {fmt(sum)}
        </div>
      );
    }
    return (
      <Input
        type="number"
        className="h-7 text-xs text-right"
        value={values[field][node.id] || ''}
        onChange={e => update(field, node.id, e.target.value)}
        placeholder="0"
      />
    );
  };

  const renderDateCell = (node: TreeNode, field: 'initialDate' | 'adjustedDate') => {
    const isLeaf = !node.children || node.children.length === 0;
    const valueField = field === 'initialDate' ? 'initial' : 'adjusted';
    const childrenHaveValues = hasAnyDescendantValue(node, values[valueField]);
    if (!isLeaf && childrenHaveValues) return <div />;
    return (
      <Input
        type="date"
        className="h-7 text-xs"
        value={values[field][node.id] || ''}
        onChange={e => update(field, node.id, e.target.value)}
      />
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-end gap-2">
        <Button type="button" size="sm" variant="outline" onClick={expandAll} className="h-7 text-xs">
          <ChevronsUpDown className="h-3 w-3 mr-1" /> Expand All
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={collapseAll} className="h-7 text-xs">
          <ChevronsDownUp className="h-3 w-3 mr-1" /> Collapse All
        </Button>
      </div>
      <div className="overflow-x-auto border rounded-md">
        <table className="w-full text-xs border-collapse">
        <thead className="bg-table-header">
          <tr>
            <th className="border w-12 px-2 py-2 text-left text-table-header-foreground">SL</th>
            {colHeaders.map(h => (
              <th key={h} className="border px-2 py-2 text-left text-table-header-foreground min-w-[140px]">
                {h}
              </th>
            ))}
            <th className="border px-2 py-2 text-table-header-foreground min-w-[120px]">Initial Amount *</th>
            <th className="border px-2 py-2 text-table-header-foreground min-w-[130px]">Date of Entry</th>
            <th className="border px-2 py-2 text-table-header-foreground min-w-[120px]">Adjusted Amount</th>
            <th className="border px-2 py-2 text-table-header-foreground min-w-[130px]">Date of Entry</th>
            <th className="border px-2 py-2 text-table-header-foreground text-right min-w-[100px]">Total</th>
            <th className="border px-2 py-2 text-table-header-foreground min-w-[150px]">Remarks</th>
          </tr>
        </thead>
        <tbody>
          {flatRows.map((row, idx) => {
            const initialSum = rollupSum(row.node, values.initial);
            const adjustedSum = rollupSum(row.node, values.adjusted);
            const total = initialSum + adjustedSum;
            return (
              <tr key={row.node.id} className={idx % 2 ? 'bg-muted/20' : ''}>
                <td className="border px-2 py-1 text-center">{idx + 1}</td>
                {renderHierarchyCells(row)}
                <td className="border px-1 py-1">{renderAmountCell(row.node, 'initial')}</td>
                <td className="border px-1 py-1">{renderDateCell(row.node, 'initialDate')}</td>
                <td className="border px-1 py-1">{renderAmountCell(row.node, 'adjusted')}</td>
                <td className="border px-1 py-1">{renderDateCell(row.node, 'adjustedDate')}</td>
                <td className="border px-2 py-1 text-right font-semibold">{fmt(total)}</td>
                <td className="border px-1 py-1">
                  <Input
                    className="h-7 text-xs"
                    value={values.remarks[row.node.id] || ''}
                    onChange={e => update('remarks', row.node.id, e.target.value)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
        </table>
      </div>
    </div>
  );
}
