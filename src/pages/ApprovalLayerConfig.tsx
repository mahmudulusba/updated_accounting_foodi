import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { ChevronsRight, ChevronsLeft } from 'lucide-react';
import { toast } from 'sonner';

interface Role {
  id: number;
  name: string;
}

interface SelectedRole extends Role {
  amount: number;
}

const allRoles: Role[] = [
  { id: 1, name: 'MD' },
  { id: 2, name: 'Chairman' },
  { id: 3, name: 'Accounts Head' },
  { id: 4, name: 'Admin Head' },
  { id: 5, name: 'Sr. Admin' },
  { id: 6, name: 'Admin' },
  { id: 7, name: 'Director' },
  { id: 8, name: 'CFO' },
  { id: 9, name: 'Finance Head' },
  { id: 10, name: 'Accountant' },
];

export default function ApprovalLayerConfig() {
  const [leftChecked, setLeftChecked] = useState<Set<number>>(new Set());
  const [rightChecked, setRightChecked] = useState<Set<number>>(new Set());
  const [available, setAvailable] = useState<Role[]>(allRoles.slice(3));
  const [selected, setSelected] = useState<SelectedRole[]>([
    { id: 1, name: 'MD', amount: 1000000 },
    { id: 2, name: 'Chairman', amount: 700000 },
    { id: 3, name: 'Accounts Head', amount: 500000 },
  ]);

  const toggleLeft = (id: number) => {
    const next = new Set(leftChecked);
    next.has(id) ? next.delete(id) : next.add(id);
    setLeftChecked(next);
  };

  const toggleRight = (id: number) => {
    const next = new Set(rightChecked);
    next.has(id) ? next.delete(id) : next.add(id);
    setRightChecked(next);
  };

  const moveRight = () => {
    const moving = available.filter(r => leftChecked.has(r.id));
    if (moving.length === 0) return;
    setSelected([...selected, ...moving.map(r => ({ ...r, amount: 0 }))]);
    setAvailable(available.filter(r => !leftChecked.has(r.id)));
    setLeftChecked(new Set());
  };

  const moveLeft = () => {
    const moving = selected.filter(r => rightChecked.has(r.id));
    if (moving.length === 0) return;
    setAvailable([...available, ...moving.map(({ amount, ...r }) => r)]);
    setSelected(selected.filter(r => !rightChecked.has(r.id)));
    setRightChecked(new Set());
  };

  const updateAmount = (id: number, amount: number) => {
    setSelected(selected.map(r => r.id === id ? { ...r, amount } : r));
  };

  const selectAllLeft = (checked: boolean) => {
    setLeftChecked(checked ? new Set(available.map(r => r.id)) : new Set());
  };
  const selectAllRight = (checked: boolean) => {
    setRightChecked(checked ? new Set(selected.map(r => r.id)) : new Set());
  };

  const handleSave = () => {
    if (selected.length === 0) {
      toast.error('Please select at least one role');
      return;
    }
    toast.success('Approval layer configuration saved');
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Approval Layer Configuration</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 items-start">
          {/* Available roles */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">All Roles</CardTitle></CardHeader>
            <CardContent>
              <TableWithSearch>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">SL No</TableHead>
                    <TableHead className="w-28">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={available.length > 0 && leftChecked.size === available.length}
                          onCheckedChange={(c) => selectAllLeft(!!c)}
                        />
                        <span>Select All</span>
                      </div>
                    </TableHead>
                    <TableHead>Role Name</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {available.map((r, idx) => (
                    <TableRow key={r.id}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>
                        <Checkbox checked={leftChecked.has(r.id)} onCheckedChange={() => toggleLeft(r.id)} />
                      </TableCell>
                      <TableCell>{r.name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </TableWithSearch>
            </CardContent>
          </Card>

          {/* Move buttons */}
          <div className="flex flex-col gap-2 self-center">
            <Button variant="outline" size="icon" onClick={moveRight} title="Add Selected">
              <ChevronsRight size={18} />
            </Button>
            <Button variant="outline" size="icon" onClick={moveLeft} title="Remove Selected">
              <ChevronsLeft size={18} />
            </Button>
          </div>

          {/* Selected roles with amounts */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Approval Layer</CardTitle></CardHeader>
            <CardContent>
              <TableWithSearch>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">SL No</TableHead>
                    <TableHead className="w-40">Amount</TableHead>
                    <TableHead className="w-28">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={selected.length > 0 && rightChecked.size === selected.length}
                          onCheckedChange={(c) => selectAllRight(!!c)}
                        />
                        <span>Select All</span>
                      </div>
                    </TableHead>
                    <TableHead>Role Name</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selected.map((r, idx) => (
                    <TableRow key={r.id}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={r.amount}
                          onChange={(e) => updateAmount(r.id, Number(e.target.value))}
                          className="h-8"
                        />
                      </TableCell>
                      <TableCell>
                        <Checkbox checked={rightChecked.has(r.id)} onCheckedChange={() => toggleRight(r.id)} />
                      </TableCell>
                      <TableCell>{r.name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </TableWithSearch>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </DashboardLayout>
  );
}