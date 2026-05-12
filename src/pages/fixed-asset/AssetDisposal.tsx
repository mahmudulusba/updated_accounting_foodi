import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, ArrowLeft, Eye, Search, Download, Filter, FileText } from 'lucide-react';
import { toast } from 'sonner';

const defaultDisposals = [
  { id: '1', assetName: 'Old Printer', serialNo: 'PRT-001', voucher: 'JV-DSP-2025-001', reason: 'Obsolete', disposalDate: '2025-06-15', createdInfo: '15 Jun 2025 10:30 AM' },
  { id: '2', assetName: 'Dell Monitor', serialNo: 'MON-034', voucher: 'JV-DSP-2025-002', reason: 'Damaged beyond repair', disposalDate: '2025-09-20', createdInfo: '20 Sep 2025 02:15 PM' },
];

const groups = [
  { value: 'it', label: 'IT Equipment' },
  { value: 'furniture', label: 'Furniture & Fixture' },
  { value: 'vehicle', label: 'Vehicles' },
];
const subGroupsByGroup: Record<string, { value: string; label: string }[]> = {
  it: [{ value: 'desktop', label: 'Desktop' }, { value: 'laptop', label: 'Laptop' }, { value: 'printer', label: 'Printer' }, { value: 'monitor', label: 'Monitor' }],
  furniture: [{ value: 'desk', label: 'Desk' }, { value: 'chair', label: 'Chair' }],
  vehicle: [{ value: 'car', label: 'Car' }, { value: 'bus', label: 'Bus' }],
};

const assetsByPath: Record<string, { code: string; name: string; serials: string[] }[]> = {
  'it-laptop': [
    { code: 'AST-101', name: 'HP Laptop', serials: ['HP-9812', 'HP-9813', 'HP-9814'] },
    { code: 'AST-102', name: 'Dell Latitude', serials: ['DL-5520-01', 'DL-5520-02'] },
  ],
  'it-monitor': [
    { code: 'AST-201', name: 'Dell 24" Monitor', serials: ['MON-034', 'MON-035'] },
  ],
  'it-desktop': [
    { code: 'AST-301', name: 'Dell Vostro Desktop', serials: ['6YR7Q03', '6YR7Q04'] },
  ],
};

interface SerialPick { code: string; name: string; serial: string; }

export default function AssetDisposal() {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [group, setGroup] = useState('');
  const [subGroup, setSubGroup] = useState('');
  const [selectedAssetCode, setSelectedAssetCode] = useState('');
  const [picked, setPicked] = useState<SerialPick[]>([]);

  const path = group && subGroup ? `${group}-${subGroup}` : '';
  const availableAssets = assetsByPath[path] || [];
  const selectedAsset = availableAssets.find(a => a.code === selectedAssetCode);

  const toggleSerial = (s: string) => {
    if (!selectedAsset) return;
    const exists = picked.find(p => p.code === selectedAsset.code && p.serial === s);
    if (exists) setPicked(picked.filter(p => !(p.code === selectedAsset.code && p.serial === s)));
    else setPicked([...picked, { code: selectedAsset.code, name: selectedAsset.name, serial: s }]);
  };

  const isPicked = (s: string) => !!selectedAsset && !!picked.find(p => p.code === selectedAsset.code && p.serial === s);

  const handleSubmit = () => {
    if (picked.length === 0) { toast.error('Select at least one asset/serial to dispose'); return; }
    toast.success(`Disposal recorded for ${picked.length} asset(s). Auto journal voucher created in Unposted state.`);
    setView('list');
    setPicked([]); setGroup(''); setSubGroup(''); setSelectedAssetCode('');
  };

  return (
    <DashboardLayout>
      {view === 'list' ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Asset Disposal List</h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm"><Download size={14} className="mr-1" /> Download</Button>
              <Button variant="outline" size="sm"><Filter size={14} className="mr-1" /> Filter</Button>
              <Button onClick={() => setView('form')}><Plus size={16} className="mr-2" /> Add Disposal</Button>
            </div>
          </div>
          <Card>
            <CardHeader><CardTitle className="text-sm">Search</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div><Label>Asset Name</Label><Input /></div>
                <div><Label>Asset Serial Number</Label><Input /></div>
                <div><Label>Disposal Date</Label><Input type="date" /></div>
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
                    <TableHead>Disposal Reason</TableHead>
                    <TableHead>Disposal Date</TableHead>
                    <TableHead>Created Info</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {defaultDisposals.map((d, i) => (
                    <TableRow key={d.id}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{d.assetName}</TableCell>
                      <TableCell className="font-mono">{d.serialNo}</TableCell>
                      <TableCell className="font-mono text-primary">{d.voucher}</TableCell>
                      <TableCell>{d.reason}</TableCell>
                      <TableCell>{d.disposalDate}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{d.createdInfo}</TableCell>
                      <TableCell><Button variant="ghost" size="icon"><Eye size={14} /></Button></TableCell>
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
            <h1 className="text-2xl font-bold text-foreground">Asset Disposal Setup</h1>
            <Button variant="outline" onClick={() => setView('list')}><ArrowLeft size={16} className="mr-2" /> Back to List</Button>
          </div>
          <Card>
            <CardHeader><CardTitle className="text-base">Select Asset(s) for Disposal</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Asset Group *</Label>
                  <Select value={group} onValueChange={v => { setGroup(v); setSubGroup(''); setSelectedAssetCode(''); }}>
                    <SelectTrigger><SelectValue placeholder="Select group" /></SelectTrigger>
                    <SelectContent>{groups.map(g => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Asset Sub Group *</Label>
                  <Select value={subGroup} onValueChange={v => { setSubGroup(v); setSelectedAssetCode(''); }} disabled={!group}>
                    <SelectTrigger><SelectValue placeholder={group ? 'Select sub group' : 'Select group first'} /></SelectTrigger>
                    <SelectContent>{(subGroupsByGroup[group] || []).map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Asset *</Label>
                  <Select value={selectedAssetCode} onValueChange={setSelectedAssetCode} disabled={!subGroup}>
                    <SelectTrigger><SelectValue placeholder={subGroup ? 'Select asset' : 'Select sub group first'} /></SelectTrigger>
                    <SelectContent>{availableAssets.map(a => <SelectItem key={a.code} value={a.code}>{a.code} — {a.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>

              {selectedAsset && (
                <div className="mt-4 rounded-md border p-3">
                  <div className="text-sm font-medium mb-2">Asset Code: <span className="font-mono">{selectedAsset.code}</span> · Available Serials (multi-select):</div>
                  <div className="grid grid-cols-4 gap-2">
                    {selectedAsset.serials.map(s => (
                      <label key={s} className="flex items-center gap-2 rounded-md border p-2 cursor-pointer hover:bg-muted/40">
                        <Checkbox checked={isPicked(s)} onCheckedChange={() => toggleSerial(s)} />
                        <span className="font-mono text-sm">{s}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {picked.length > 0 && (
                <div className="mt-4">
                  <Label className="text-sm">Selected for Disposal ({picked.length})</Label>
                  <TableWithSearch>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Asset Code</TableHead>
                        <TableHead>Asset Name</TableHead>
                        <TableHead>Serial No</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {picked.map((p, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-mono">{p.code}</TableCell>
                          <TableCell>{p.name}</TableCell>
                          <TableCell className="font-mono">{p.serial}</TableCell>
                          <TableCell><Button variant="ghost" size="sm" onClick={() => setPicked(picked.filter((_, idx) => idx !== i))}>Remove</Button></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </TableWithSearch>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Disposal Details</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div><Label>Disposal Date *</Label><Input type="date" defaultValue={new Date().toISOString().split('T')[0]} /></div>
                <div>
                  <Label>Disposal Method</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sale">Sale</SelectItem>
                      <SelectItem value="scrap">Scrap</SelectItem>
                      <SelectItem value="donate">Donation</SelectItem>
                      <SelectItem value="writeoff">Write-off</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Sale / Recovery Value</Label><Input type="number" placeholder="0.00" /></div>
                <div><Label>Buyer / Vendor</Label><Input placeholder="Optional" /></div>
              </div>
              <div className="mt-4"><Label>Disposal Reason *</Label><Textarea placeholder="Reason for disposal" /></div>
              <div className="mt-4 flex items-start gap-2 rounded-md border bg-muted/30 p-3 text-sm">
                <FileText size={16} className="mt-0.5 text-primary" />
                <div className="text-muted-foreground">
                  On submit, the system will automatically create a <span className="font-medium text-foreground">Journal Voucher in Unposted state</span> for the disposal. You can review and post it from the Voucher List.
                </div>
              </div>
              <div className="flex gap-2 mt-6"><Button onClick={handleSubmit}>Submit & Create Voucher</Button><Button variant="outline" onClick={() => { setPicked([]); setGroup(''); setSubGroup(''); setSelectedAssetCode(''); }}>Clear</Button></div>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}
