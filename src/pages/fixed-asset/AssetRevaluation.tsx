import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, ArrowLeft, Pencil, Eye, Search, Download, Filter, FileText, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';

const defaultRevaluations = [
  { id: '1', assetName: 'Office Building', serialNo: 'BLD-001', voucher: 'JV-REV-2025-001', valuationType: 'Under Valued', previousValue: 50000000, change: 5000000, updatedValue: 55000000, revaluationDate: '2025-06-30', reason: 'Market value increase', revaluatedBy: 'Mahmudul Hasan' },
  { id: '2', assetName: 'Company Vehicle', serialNo: 'VEH-003', voucher: 'JV-REV-2025-002', valuationType: 'Over Valued', previousValue: 3500000, change: -500000, updatedValue: 3000000, revaluationDate: '2025-09-15', reason: 'Impairment', revaluatedBy: 'Mahmudul Hasan' },
];

// In real app, comes from auth context
const LOGIN_USER = 'Mahmudul Hasan';

export default function AssetRevaluation() {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [valuationType, setValuationType] = useState<'under' | 'over' | ''>('');
  const [previousValue, setPreviousValue] = useState<number>(0);
  const [changeAmount, setChangeAmount] = useState<number>(0);

  const updatedValue = useMemo(() => {
    if (!valuationType || !changeAmount) return previousValue;
    return valuationType === 'under' ? previousValue + changeAmount : previousValue - changeAmount;
  }, [valuationType, previousValue, changeAmount]);

  const handleSubmit = () => {
    toast.success('Revaluation saved. Auto journal voucher created in Unposted state.');
    setView('list');
  };

  return (
    <DashboardLayout>
      {view === 'list' ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Asset Revaluation List</h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm"><Download size={14} className="mr-1" /> Download</Button>
              <Button variant="outline" size="sm"><Filter size={14} className="mr-1" /> Filter</Button>
              <Button onClick={() => setView('form')}><Plus size={16} className="mr-2" /> Revalue Asset</Button>
            </div>
          </div>
          <Card>
            <CardHeader><CardTitle className="text-sm">Search</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div><Label>Asset Name</Label><Input /></div>
                <div><Label>Asset Serial No</Label><Input /></div>
                <div><Label>Revaluation Date</Label><Input type="date" /></div>
                <div>
                  <Label>Valuation Type</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="under">Under Valued</SelectItem>
                      <SelectItem value="over">Over Valued</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2 mt-4"><Button size="sm"><Search size={14} className="mr-1" /> Search</Button><Button size="sm" variant="outline">Clear</Button></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-0">
              <TableWithSearch>
                <TableHeader>
                  <TableRow>
                    <TableHead>SL</TableHead>
                    <TableHead>Asset Name</TableHead>
                    <TableHead>Serial No</TableHead>
                    <TableHead>Auto Voucher</TableHead>
                    <TableHead>Valuation Type</TableHead>
                    <TableHead>Previous Value</TableHead>
                    <TableHead>Added / Declined</TableHead>
                    <TableHead>Updated Value</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Revalued By</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {defaultRevaluations.map((r, i) => (
                    <TableRow key={r.id}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{r.assetName}</TableCell>
                      <TableCell className="font-mono">{r.serialNo}</TableCell>
                      <TableCell className="font-mono text-primary">{r.voucher}</TableCell>
                      <TableCell>
                        <Badge variant={r.valuationType === 'Under Valued' ? 'default' : 'secondary'} className="gap-1">
                          {r.valuationType === 'Under Valued' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                          {r.valuationType}
                        </Badge>
                      </TableCell>
                      <TableCell>{r.previousValue.toLocaleString()}</TableCell>
                      <TableCell className={r.change >= 0 ? 'text-emerald-600' : 'text-destructive'}>
                        {r.change >= 0 ? '+' : ''}{r.change.toLocaleString()}
                      </TableCell>
                      <TableCell className="font-semibold">{r.updatedValue.toLocaleString()}</TableCell>
                      <TableCell>{r.revaluationDate}</TableCell>
                      <TableCell>{r.revaluatedBy}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon"><Pencil size={14} /></Button>
                          <Button variant="ghost" size="icon"><Eye size={14} /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </TableWithSearch>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Asset Revaluation Setup</h1>
            <Button variant="outline" onClick={() => setView('list')}><ArrowLeft size={16} className="mr-2" /> Back to List</Button>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-6">
                <div><Label>Asset Code *</Label><Input placeholder="Searchable Dropdown" /></div>
                <div><Label>Asset Serial No *</Label><Input /></div>
                <div><Label>Asset Name</Label><Input disabled /></div>
                <div><Label>Asset Group</Label><Input disabled /></div>
                <div><Label>Asset Sub Group</Label><Input disabled /></div>
                <div><Label>Previous Value (Book Value)</Label><Input type="number" value={previousValue || ''} onChange={e => setPreviousValue(Number(e.target.value) || 0)} placeholder="Auto-fetched on selection" /></div>
                <div>
                  <Label>Valuation Type *</Label>
                  <Select value={valuationType} onValueChange={v => setValuationType(v as any)}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under">Under Valued (Increase)</SelectItem>
                      <SelectItem value="over">Over Valued (Decrease)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{valuationType === 'over' ? 'Declined Value *' : 'Added Value *'}</Label>
                  <Input type="number" value={changeAmount || ''} onChange={e => setChangeAmount(Number(e.target.value) || 0)} placeholder="0.00" />
                </div>
                <div>
                  <Label>Updated Value</Label>
                  <Input disabled value={updatedValue.toLocaleString()} className="font-semibold" />
                </div>
                <div><Label>Revaluation Date *</Label><Input type="date" defaultValue={new Date().toISOString().split('T')[0]} /></div>
                <div><Label>Revalued By</Label><Input disabled value={LOGIN_USER} /></div>
              </div>
              <div className="mt-4"><Label>Revaluation Reason</Label><Textarea /></div>
              <div className="mt-4 flex items-start gap-2 rounded-md border bg-muted/30 p-3 text-sm">
                <FileText size={16} className="mt-0.5 text-primary" />
                <div className="text-muted-foreground">
                  On submit, the system will automatically create a <span className="font-medium text-foreground">Journal Voucher in Unposted state</span> reflecting the revaluation gain/loss. You can review and post it from the Voucher List.
                </div>
              </div>
              <div className="flex gap-2 mt-6"><Button onClick={handleSubmit}>Submit & Create Voucher</Button><Button variant="outline">Clear</Button></div>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}
