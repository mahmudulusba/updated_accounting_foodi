import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Download } from 'lucide-react';
import BudgetTreeReport, { MetricColumn } from '@/components/budget/BudgetTreeReport';
import { budgetTreeData } from '@/lib/budgetTreeData';

const metrics: MetricColumn[] = [
  { key: 'budget', label: 'Budget Amount' },
  { key: 'actual', label: 'Actual Amount' },
  { key: 'variance', label: 'Variance', compute: s => s.budget - s.actual, colorRule: 'positive-good' },
  {
    key: 'pct',
    label: 'Variance %',
    compute: s => (s.budget ? ((s.budget - s.actual) / s.budget) * 100 : 0),
    suffix: '%',
    colorRule: 'positive-good',
    format: n => n.toFixed(2),
  },
];

export default function BudgetVarianceReport() {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Budget Variance &amp; Details Report</h1>
          <Button variant="outline" size="sm"><Download size={14} className="mr-1" /> Download</Button>
        </div>
        <Card>
          <CardHeader><CardTitle className="text-sm">Filter</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-3">
              <div><Label>Parent GL</Label><Input /></div>
              <div><Label>Fiscal Year</Label><Input placeholder="2025-2026" /></div>
              <div><Label>Budget Category</Label><Input /></div>
              <div><Label>Budget Head</Label><Input /></div>
            </div>
            <div className="flex gap-2 mt-3"><Button size="sm"><Search size={14} className="mr-1" /> Search</Button><Button size="sm" variant="outline">Clear</Button></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <BudgetTreeReport data={budgetTreeData} metrics={metrics} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
