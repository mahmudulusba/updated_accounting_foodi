import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, ArrowLeft, RefreshCw, Eye, Search, Download, Filter, AlertTriangle, Printer, Layers } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface Asset {
  id: string;
  assetCode: string;
  assetName: string;
  assetGroup: string;
  assetSubGroup: string;
  assetType: string;
  location: string;
  status: string;
}

const defaultAssets: Asset[] = [
  { id: '1', assetCode: 'AST-001', assetName: 'Dell Vostro Desktop', assetGroup: 'IT Equipment', assetSubGroup: 'Desktop', assetType: 'Tangible', location: 'Dhaka HQ', status: 'Active' },
  { id: '2', assetCode: 'AST-002', assetName: 'Office Desk', assetGroup: 'Furniture & Fixture', assetSubGroup: 'Desk', assetType: 'Tangible', location: 'Dhaka HQ', status: 'Active' },
  { id: '3', assetCode: 'AST-003', assetName: 'ERP Software License', assetGroup: 'Software', assetSubGroup: 'License', assetType: 'Intangible', location: 'Central IT', status: 'Active' },
];

const groups = [
  { value: 'it', label: 'IT Equipment' },
  { value: 'furniture', label: 'Furniture & Fixture' },
  { value: 'vehicle', label: 'Vehicles' },
  { value: 'software', label: 'Software' },
  { value: 'building', label: 'Building' },
];

const subGroupsByGroup: Record<string, { value: string; label: string }[]> = {
  it: [{ value: 'desktop', label: 'Desktop' }, { value: 'laptop', label: 'Laptop' }, { value: 'printer', label: 'Printer' }],
  furniture: [{ value: 'desk', label: 'Desk' }, { value: 'chair', label: 'Chair' }, { value: 'cabinet', label: 'Cabinet' }],
  vehicle: [{ value: 'car', label: 'Car' }, { value: 'bus', label: 'Bus' }],
  software: [{ value: 'license', label: 'License' }, { value: 'subscription', label: 'Subscription' }],
  building: [{ value: 'office', label: 'Office Building' }, { value: 'warehouse', label: 'Warehouse' }],
};

const employees = [
  { value: 'emp-001', label: 'Farzana Islam (EMP-001)' },
  { value: 'emp-002', label: 'Md. Mahmudul Hasan (EMP-002)' },
  { value: 'emp-003', label: 'Farzana Islam (EMP-003)' },
];

export default function AssetRegistration() {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [group, setGroup] = useState('');
  const [depMethod, setDepMethod] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);
  const [barcodeDialog, setBarcodeDialog] = useState<{ open: boolean; asset: Asset | null }>({ open: false, asset: null });
  const [unitsDialog, setUnitsDialog] = useState<{ open: boolean; asset: Asset | null }>({ open: false, asset: null });
  const [unitRows, setUnitRows] = useState<Array<{ id: string; assetId: string; location: string; unitPrice: string; installationCost: string; carryingCost: string; otherCost: string; assignTo: string; remarks: string }>>([]);
  const [showFilters, setShowFilters] = useState(false);

  const handleSave = () => {
    const now = new Date().toLocaleString();
    if (editMode) {
      toast.success('Asset updated successfully.');
      setLastUpdatedAt(now);
    } else {
      toast.success('Asset registered. Allocate it under Asset Allocation.');
    }
    setView('list');
    setEditMode(false);
    setEditingAsset(null);
  };

  const openUpdate = (asset: Asset) => {
    setEditingAsset(asset);
    setEditMode(true);
    setView('form');
  };

  const openBarcodes = (asset: Asset) => {
    setBarcodeDialog({ open: true, asset });
  };

  const openUnits = (asset: Asset) => {
    // Mock: 5 units for the selected asset
    const rows = Array.from({ length: 5 }).map((_, i) => ({
      id: `${asset.id}-U${i + 1}`,
      assetId: `${asset.assetCode}-${String(i + 1).padStart(2, '0')}`,
      location: asset.location,
      unitPrice: '',
      installationCost: '',
      carryingCost: '',
      otherCost: '',
      assignTo: '',
      remarks: '',
    }));
    setUnitRows(rows);
    setUnitsDialog({ open: true, asset });
  };

  const updateUnitRow = (id: string, field: string, value: string) => {
    setUnitRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  // Mock barcode list for selected asset (e.g., 5 units)
  const barcodes = barcodeDialog.asset
    ? Array.from({ length: 5 }).map((_, i) => `${barcodeDialog.asset!.assetCode}-${String(i + 1).padStart(4, '0')}`)
    : [];

  // Mock unallocated count
  const unallocatedCount = 3;

  return (
    <DashboardLayout>
      {view === 'list' ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Asset Register</h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm"><Download size={14} className="mr-1" /> Download</Button>
              <Button variant="outline" size="sm" onClick={() => setShowFilters(v => !v)}><Filter size={14} className="mr-1" /> Filter</Button>
              <Button onClick={() => setView('form')}><Plus size={16} className="mr-2" /> Register Asset</Button>
            </div>
          </div>
          {showFilters && (
          <Card>
            <CardHeader><CardTitle className="text-sm">Search</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div><Label>Asset Code</Label><Input placeholder="Search" /></div>
                <div><Label>Name</Label><Input placeholder="Search" /></div>
                <div><Label>Asset Group</Label><Input placeholder="Group" /></div>
                <div><Label>Asset Sub Group</Label><Input placeholder="Sub Group" /></div>
              </div>
              <div className="grid grid-cols-4 gap-4 mt-4">
                <div><Label>Purchase Date From</Label><Input type="date" /></div>
                <div><Label>Purchase Date To</Label><Input type="date" /></div>
                <div><Label>Supplier</Label><Input placeholder="Supplier" /></div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm"><Search size={14} className="mr-1" /> Search</Button>
                <Button size="sm" variant="outline">Clear</Button>
              </div>
            </CardContent>
          </Card>
          )}
          <Card>
            <CardContent className="p-0">
              <TableWithSearch>
                <TableHeader>
                  <TableRow>
                    <TableHead>SL</TableHead>
                    <TableHead>Asset Code</TableHead>
                    <TableHead>Asset Name</TableHead>
                    <TableHead>Asset Group</TableHead>
                    <TableHead>Asset Sub Group</TableHead>
                    <TableHead>Asset Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {defaultAssets.map((a, i) => (
                    <TableRow key={a.id}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell className="font-mono">{a.assetCode}</TableCell>
                      <TableCell>{a.assetName}</TableCell>
                      <TableCell>{a.assetGroup}</TableCell>
                      <TableCell>{a.assetSubGroup}</TableCell>
                      <TableCell>{a.assetType}</TableCell>
                      <TableCell>{a.location}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" title="View Barcodes" onClick={() => openBarcodes(a)}><Eye size={14} /></Button>
                          <Button variant="ghost" size="icon" title="Update Asset" onClick={() => openUpdate(a)}><RefreshCw size={14} /></Button>
                          <Button variant="ghost" size="icon" title="Update Individual Units" onClick={() => openUnits(a)}><Layers size={14} /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </TableWithSearch>
            </CardContent>
          </Card>

          {/* Barcode List Dialog */}
          <Dialog open={barcodeDialog.open} onOpenChange={(o) => setBarcodeDialog({ open: o, asset: o ? barcodeDialog.asset : null })}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Asset Barcodes — {barcodeDialog.asset?.assetName}</DialogTitle>
              </DialogHeader>
              <div className="max-h-[60vh] overflow-auto">
                <TableWithSearch>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset ID</TableHead>
                      <TableHead>Barcode</TableHead>
                      <TableHead className="text-right">Print</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {barcodes.map(code => (
                      <TableRow key={code}>
                        <TableCell className="font-mono">{code}</TableCell>
                        <TableCell>
                          <div className="flex flex-col items-start">
                            <svg width="180" height="50" viewBox="0 0 180 50" className="bg-white">
                              {Array.from({ length: 40 }).map((_, i) => (
                                <rect key={i} x={i * 4.4} y={0} width={Math.random() > 0.5 ? 2 : 1} height={40} fill="black" />
                              ))}
                            </svg>
                            <span className="font-mono text-xs mt-1">{code}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" title="Print" onClick={() => toast.success(`Printing ${code}`)}><Printer size={14} /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </TableWithSearch>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => toast.success('Printing all barcodes')}><Printer size={14} className="mr-1" /> Print All</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Update Individual Units Dialog */}
          <Dialog open={unitsDialog.open} onOpenChange={(o) => setUnitsDialog({ open: o, asset: o ? unitsDialog.asset : null })}>
            <DialogContent className="max-w-6xl">
              <DialogHeader>
                <DialogTitle>Update Individual Units — {unitsDialog.asset?.assetName}</DialogTitle>
              </DialogHeader>
              <div className="max-h-[65vh] overflow-auto">
                <TableWithSearch>
                  <TableHeader>
                    <TableRow className="bg-table-header hover:bg-table-header">
                      <TableHead className="text-table-header-foreground font-bold">SL</TableHead>
                      <TableHead className="text-table-header-foreground font-bold">Asset ID</TableHead>
                      <TableHead className="text-table-header-foreground font-bold">Location</TableHead>
                      <TableHead className="text-table-header-foreground font-bold">Asset Unit Price</TableHead>
                      <TableHead className="text-table-header-foreground font-bold">Cost of Installation</TableHead>
                      <TableHead className="text-table-header-foreground font-bold">Carrying Cost</TableHead>
                      <TableHead className="text-table-header-foreground font-bold">Other Cost</TableHead>
                      <TableHead className="text-table-header-foreground font-bold">Assign To</TableHead>
                      <TableHead className="text-table-header-foreground font-bold">Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {unitRows.map((r, idx) => (
                      <TableRow key={r.id}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell className="font-mono">{r.assetId}</TableCell>
                        <TableCell><Input value={r.location} onChange={e => updateUnitRow(r.id, 'location', e.target.value)} /></TableCell>
                        <TableCell><Input type="number" value={r.unitPrice} onChange={e => updateUnitRow(r.id, 'unitPrice', e.target.value)} /></TableCell>
                        <TableCell><Input type="number" value={r.installationCost} onChange={e => updateUnitRow(r.id, 'installationCost', e.target.value)} /></TableCell>
                        <TableCell><Input type="number" value={r.carryingCost} onChange={e => updateUnitRow(r.id, 'carryingCost', e.target.value)} /></TableCell>
                        <TableCell><Input type="number" value={r.otherCost} onChange={e => updateUnitRow(r.id, 'otherCost', e.target.value)} /></TableCell>
                        <TableCell>
                          <Select value={r.assignTo} onValueChange={v => updateUnitRow(r.id, 'assignTo', v)}>
                            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>
                              {employees.map(e => <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell><Input value={r.remarks} onChange={e => updateUnitRow(r.id, 'remarks', e.target.value)} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </TableWithSearch>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setUnitsDialog({ open: false, asset: null })}>Cancel</Button>
                <Button onClick={() => { toast.success('Unit details updated.'); setUnitsDialog({ open: false, asset: null }); }}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{editMode ? 'Update Asset' : 'Asset Registration'}</h1>
              {editMode && lastUpdatedAt && (
                <p className="text-xs text-muted-foreground mt-1">Last updated: <span className="font-mono">{lastUpdatedAt}</span></p>
              )}
              {editMode && editingAsset && (
                <p className="text-xs text-muted-foreground">Editing: <span className="font-mono">{editingAsset.assetCode}</span> — {editingAsset.assetName}</p>
              )}
            </div>
            <Button variant="outline" onClick={() => { setView('list'); setEditMode(false); setEditingAsset(null); }}><ArrowLeft size={16} className="mr-2" /> Back to List</Button>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-base">Basic Info</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div><Label>Asset Name *</Label><Input defaultValue={editingAsset?.assetName ?? ''} /></div>
                <div><Label>Asset Code *</Label><Input defaultValue={editingAsset?.assetCode ?? ''} /></div>
                <div><Label>Number of Asset</Label><Input type="number" /></div>
                <div><Label>Asset Serial No / Model No</Label><Input /></div>
                <div><Label>Asset Type *</Label><Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="tangible">Tangible</SelectItem><SelectItem value="intangible">Intangible</SelectItem></SelectContent></Select></div>
                <div>
                  <Label>Asset Group *</Label>
                  <Select value={group} onValueChange={setGroup}>
                    <SelectTrigger><SelectValue placeholder="Select group" /></SelectTrigger>
                    <SelectContent>{groups.map(g => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Asset Sub Group *</Label>
                  <Select disabled={!group}>
                    <SelectTrigger><SelectValue placeholder={group ? 'Select sub group' : 'Select group first'} /></SelectTrigger>
                    <SelectContent>{(subGroupsByGroup[group] || []).map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>GL Name & Code</Label><Input /></div>
                <div><Label>Parent GL Name</Label><Input /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>QTY</Label><Input type="number" /></div>
                  <div><Label>Brand</Label><Input /></div>
                </div>
                <div><Label>Model</Label><Input /></div>
                <div><Label>Specification</Label><Textarea /></div>
                <div><Label>Remarks</Label><Textarea /></div>
                <div><Label>Current Status</Label><Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem><SelectItem value="disposed">Disposed</SelectItem></SelectContent></Select></div>
              </CardContent>
            </Card>
            <div className="space-y-6">
              <Card>
                <CardHeader><CardTitle className="text-base">Financial Info</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div><Label>Cost Price per Unit *</Label><Input type="number" /></div>
                  <div><Label>Cost of Purchase *</Label><Input type="number" /></div>
                  <div><Label>Cost of Installation</Label><Input type="number" /></div>
                  <div><Label>Carrying Cost</Label><Input type="number" /></div>
                  <div><Label>Other Cost</Label><Input type="number" /></div>
                  <div><Label>Total Cost (auto)</Label><Input disabled placeholder="Auto-calculated" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>TDS</Label><Input type="number" /></div>
                    <div><Label>VDS</Label><Input type="number" /></div>
                  </div>
                  <div><Label>Salvage Value</Label><Input type="number" /></div>
                  <div><Label>Payment Amount</Label><Input type="number" /></div>
                  <div><Label>Payment Mode</Label><Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="cash">Cash</SelectItem><SelectItem value="bank">Bank</SelectItem><SelectItem value="cheque">Cheque</SelectItem></SelectContent></Select></div>
                  <div><Label>Date of Acquisition</Label><Input type="date" /></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-base">Purchase Info</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div><Label>Supplier</Label><Input /></div>
                  <div><Label>Purchase Order No / Invoice No</Label><Input /></div>
                  <div><Label>Purchase Date</Label><Input type="date" /></div>
                  <div><Label>Warranty Expiry Date</Label><Input type="date" /></div>
                </CardContent>
              </Card>
            </div>
            <Card className="col-span-2">
              <CardHeader><CardTitle className="text-base">Depreciation</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Depreciation Method *</Label>
                    <Select value={depMethod} onValueChange={setDepMethod}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="slm">Straight Line (SLM)</SelectItem>
                        <SelectItem value="wdv">Written Down Value (WDV)</SelectItem>
                        <SelectItem value="ddb">Double Declining Balance</SelectItem>
                        <SelectItem value="uop">Units of Production</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Depreciation Start Date *</Label><Input type="date" /></div>
                </div>
                {depMethod && (
                  <div className="grid grid-cols-2 gap-4 rounded-md border bg-muted/30 p-3">
                    {(depMethod === 'slm' || depMethod === 'wdv' || depMethod === 'ddb') && (
                      <div><Label>Useful Life (Years) *</Label><Input type="number" /></div>
                    )}
                    {(depMethod === 'slm' || depMethod === 'wdv' || depMethod === 'uop') && (
                      <div><Label>Residual / Salvage Value *</Label><Input type="number" /></div>
                    )}
                    {depMethod === 'wdv' && (
                      <div><Label>Depreciation Rate (%) *</Label><Input type="number" /></div>
                    )}
                    {depMethod === 'uop' && (
                      <>
                        <div><Label>Total Estimated Units *</Label><Input type="number" /></div>
                        <div><Label>Unit of Measurement</Label><Input placeholder="e.g. hours, km" /></div>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="col-span-2">
              <CardHeader><CardTitle className="text-base">Responsibility</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Asset Responsible (Employee)</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Select from Employee Directory" /></SelectTrigger>
                      <SelectContent>{employees.map(e => <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">Asset location & detailed allocation are managed in the Asset Allocation module.</p>
              </CardContent>
            </Card>
          </div>
          <div className="flex gap-2"><Button onClick={handleSave}>Submit</Button><Button variant="outline">Clear</Button></div>
        </div>
      )}
    </DashboardLayout>
  );
}
