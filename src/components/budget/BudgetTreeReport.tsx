import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, ChevronsDownUp, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface BudgetTreeNode {
  id: string;
  label: string;
  level: 'budget' | 'sbu' | 'dept' | 'hub' | 'city';
  /** Leaf-level metric values (only meaningful on city/leaf nodes; parents auto-sum) */
  values?: Record<string, number>;
  children?: BudgetTreeNode[];
}

export interface MetricColumn {
  key: string;
  label: string;
  /** Optional derived value from row sums, e.g., variance = budget - actual */
  compute?: (sums: Record<string, number>) => number;
  /** Color rule: 'positive-good' shows green when >0, red when <0; 'negative-good' inverts */
  colorRule?: 'positive-good' | 'negative-good';
  /** Suffix like '%' */
  suffix?: string;
  /** Custom number format */
  format?: (n: number) => string;
}

interface Props {
  data: BudgetTreeNode[];
  metrics: MetricColumn[];
  defaultExpandedLevels?: Array<BudgetTreeNode['level']>;
}

const levelOrder: Array<BudgetTreeNode['level']> = ['budget', 'sbu', 'dept', 'hub', 'city'];
const levelHeaders = ['Budget Head', 'SBU', 'Department', 'Hub', 'City'];

const fmt = (n: number) =>
  n.toLocaleString('en-US', { maximumFractionDigits: 0 });

function sumNode(node: BudgetTreeNode, key: string): number {
  if (!node.children || node.children.length === 0) {
    return Number(node.values?.[key] ?? 0);
  }
  return node.children.reduce((acc, c) => acc + sumNode(c, key), 0);
}

function collectIds(nodes: BudgetTreeNode[], levels: Set<BudgetTreeNode['level']>, out: Set<string>) {
  nodes.forEach(n => {
    if (levels.has(n.level)) out.add(n.id);
    if (n.children) collectIds(n.children, levels, out);
  });
}

export default function BudgetTreeReport({
  data,
  metrics,
  defaultExpandedLevels = ['budget', 'sbu', 'dept', 'hub'],
}: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const s = new Set<string>();
    collectIds(data, new Set(defaultExpandedLevels), s);
    return s;
  });

  const expandAll = () => {
    const s = new Set<string>();
    collectIds(data, new Set(levelOrder), s);
    setExpanded(s);
  };
  const collapseAll = () => setExpanded(new Set());

  const toggle = (id: string) =>
    setExpanded(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  type Row = { node: BudgetTreeNode; depth: number };
  const rows: Row[] = useMemo(() => {
    const out: Row[] = [];
    const walk = (nodes: BudgetTreeNode[], depth: number) => {
      nodes.forEach(n => {
        out.push({ node: n, depth });
        if (expanded.has(n.id) && n.children) walk(n.children, depth + 1);
      });
    };
    walk(data, 0);
    return out;
  }, [data, expanded]);

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

  const renderMetricCell = (node: BudgetTreeNode, col: MetricColumn) => {
    const sums: Record<string, number> = {};
    metrics.forEach(m => {
      if (!m.compute) sums[m.key] = sumNode(node, m.key);
    });
    metrics.forEach(m => {
      if (m.compute) sums[m.key] = m.compute(sums);
    });
    const value = sums[col.key] ?? 0;
    let color = '';
    if (col.colorRule === 'positive-good') color = value < 0 ? 'text-destructive' : value > 0 ? 'text-green-600' : '';
    if (col.colorRule === 'negative-good') color = value > 0 ? 'text-destructive' : value < 0 ? 'text-green-600' : '';
    const text = col.format ? col.format(value) : fmt(value);
    return (
      <td
        key={col.key}
        className={cn(
          'border px-2 py-1 text-right text-xs tabular-nums',
          node.level !== 'city' && 'font-semibold bg-muted/20',
          color,
        )}
      >
        {text}{col.suffix || ''}
      </td>
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
            {levelHeaders.map(h => (
              <th key={h} className="border px-2 py-2 text-left text-table-header-foreground min-w-[140px]">
                {h}
              </th>
            ))}
            {metrics.map(m => (
              <th key={m.key} className="border px-2 py-2 text-right text-table-header-foreground min-w-[120px]">
                {m.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={row.node.id} className={idx % 2 ? 'bg-muted/20' : ''}>
              <td className="border px-2 py-1 text-center">{idx + 1}</td>
              {renderHierarchyCells(row)}
              {metrics.map(m => renderMetricCell(row.node, m))}
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </div>
  );
}
