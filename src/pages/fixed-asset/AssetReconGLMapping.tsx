import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface GLMapping {
  id: string;
  assetGroup: string;
  depreciationExpenseGL: string;
  accumulatedDepreciationGL: string;
  gainLossGL: string;
  revaluationReserveGL: string;
  status: 'Active' | 'Inactive';
}

const defaultMappings: GLMapping[] = [
  { id: '1', assetGroup: 'IT Equipment', depreciationExpenseGL: '51401001 - Depreciation Expense (IT)', accumulatedDepreciationGL: '12901001 - Accum. Depreciation (IT)', gainLossGL: '71101001 - Gain/Loss on Disposal', revaluationReserveGL: '31201001 - Revaluation Reserve', status: 'Active' },
  { id: '2', assetGroup: 'Furniture & Fixture', depreciationExpenseGL: '51401002 - Depreciation Expense (Furniture)', accumulatedDepreciationGL: '12901002 - Accum. Depreciation (Furniture)', gainLossGL: '71101001 - Gain/Loss on Disposal', revaluationReserveGL: '31201001 - Revaluation Reserve', status: 'Active' },
];

export default function AssetReconGLMapping() {
  const [mappings] = useState<GLMapping[]>(defaultMappings);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Fixed Asset Recon GL Mapping</h1>
          <Button><Plus size={16} className="mr-2" /> Add Mapping</Button>
        </div>
        <Card>
          <CardContent className="p-0">
            <TableWithSearch>
              <TableHeader>
                <TableRow>
                  <TableHead>SL</TableHead>
                  <TableHead>Asset Group</TableHead>
                  <TableHead>Depreciation Expense GL</TableHead>
                  <TableHead>Accumulated Depreciation GL</TableHead>
                  <TableHead>Gain/Loss GL</TableHead>
                  <TableHead>Revaluation Reserve GL</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mappings.map((m, i) => (
                  <TableRow key={m.id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell className="font-medium">{m.assetGroup}</TableCell>
                    <TableCell className="text-sm">{m.depreciationExpenseGL}</TableCell>
                    <TableCell className="text-sm">{m.accumulatedDepreciationGL}</TableCell>
                    <TableCell className="text-sm">{m.gainLossGL}</TableCell>
                    <TableCell className="text-sm">{m.revaluationReserveGL}</TableCell>
                    <TableCell><Badge variant="default">{m.status}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon"><Pencil size={14} /></Button>
                        <Button variant="ghost" size="icon"><Trash2 size={14} /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </TableWithSearch>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
