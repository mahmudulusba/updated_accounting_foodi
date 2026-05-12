import React, { useState, useRef } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Mail, History, Download, Upload, Plus, Trash2, ArrowLeft, FileSpreadsheet, RefreshCw, X } from 'lucide-react';
import { toast } from 'sonner';

interface Row { id: number; code: string; name: string; shop: string; ppf: number; pickup: number; pen: number; pkg: number; claim: number; mailed: boolean; }
interface AdjLine { id: number; adjustment: string; type: string; amount: number; }

const seed: Row[] = [
  { id: 1, code: 'SLC00001058', name: 'UAT Test 2', shop: 'UAT Test 2', ppf: 0, pickup: 0, pen: 0, pkg: 0, claim: 0, mailed: false },
  { id: 2, code: 'SLC00001059', name: 'Onik Mustafiz', shop: 'Fashion_TEST', ppf: 0, pickup: 0, pen: 0, pkg: 0, claim: 0, mailed: true },
  { id: 3, code: 'SLC00001060', name: 'Daily Star', shop: 'Daily Star', ppf: 0, pickup: 0, pen: 0, pkg: 0, claim: 0, mailed: false },
  { id: 4, code: 'SLC00001061', name: 'DEMO TEST', shop: 'DEMO TEST', ppf: 0, pickup: 0, pen: 0, pkg: 0, claim: 0, mailed: false },
  { id: 5, code: 'SLC00001062', name: 'MD. TAIYOB HOSSAIN', shop: 'SPORTS HOUSE', ppf: 0, pickup: 0, pen: 0, pkg: 0, claim: 0, mailed: false },
  { id: 6, code: 'SLC00001064', name: 'Ashraful Alam', shop: 'Agrey Hometex', ppf: 0, pickup: 0, pen: 0, pkg: 0, claim: 0, mailed: false },
  { id: 7, code: 'SLC00001065', name: 'Md. Imran Hossen', shop: 'Basonto Gadget', ppf: 0, pickup: 0, pen: 0, pkg: 0, claim: 0, mailed: false },
  { id: 8, code: 'SLC00001066', name: 'Fair Deal', shop: 'Fair Deal', ppf: 0, pickup: 0, pen: 0, pkg: 0, claim: 0, mailed: false },
];

const ADJ_TYPES = ['Payment Processing Fee', 'Pick Up Fee', 'Penalties', 'Packaging Materials Cost', 'Approved Claim', 'Compensation for warehouse & Logistic Losses', 'Penalties Adjustment'];

const adjHistorySeed = [
  { sn: 1, source: 'sellerstatement-1761477095245.xlsx', processed: 'N/A', total: '', success: '', failed: '', status: 'Reject', message: 'Invalid file format. Please use the provided template for bulk upload.', by: 'Naveed', at: '03-Mar-2026, 10:22:30 am' },
  { sn: 2, source: 'BulkAdjustmentTemplate (3).xlsx', processed: 'ProcessedFile.xlsx', total: '1', success: '1', failed: '0', status: 'Processed', message: 'Success', by: 'Taysir Ahmed Saeed', at: '26-Oct-2025, 05:11:34 pm' },
  { sn: 3, source: 'BulkAdjustmentTemplate (3).xlsx', processed: 'ProcessedFile.xlsx', total: '3', success: '3', failed: '0', status: 'Processed', message: 'Success', by: 'Taysir Ahmed Saeed', at: '19-Oct-2025, 06:27:13 pm' },
  { sn: 4, source: 'BulkAdjustmentTemplate May-Aug & Sept Reimbursement.xlsx', processed: 'ProcessedFile.xlsx', total: '62', success: '62', failed: '0', status: 'Processed', message: 'Success', by: 'Taysir Ahmed Saeed', at: '12-Oct-2025, 08:06:53 pm' },
];

const exportHistorySeed = [
  { sn: 1, processed: 'N/A', total: '', status: 'Processing', message: '', by: 'Naveed', at: '02-Mar-2026, 03:16:57 pm' },
  { sn: 2, processed: 'N/A', total: '', status: 'Processing', message: '', by: 'Naveed', at: '02-Mar-2026, 03:06:14 pm' },
  { sn: 3, processed: 'N/A', total: '', status: 'Processing', message: '', by: 'Naveed', at: '02-Mar-2026, 03:01:23 pm' },
];

export default function SupplierAdjustment() {
  const [rows, setRows] = useState<Row[]>(seed);
  const [search, setSearch] = useState('');

  const [adjOpen, setAdjOpen] = useState(false);
  const [adjRow, setAdjRow] = useState<Row | null>(null);
  const [adjLines, setAdjLines] = useState<AdjLine[]>([{ id: 1, adjustment: '', type: '', amount: 0 }]);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyRow, setHistoryRow] = useState<Row | null>(null);

  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkFile, setBulkFile] = useState<string>('');
  const fileRef = useRef<HTMLInputElement>(null);

  const [adjHistOpen, setAdjHistOpen] = useState(false);
  const [exportHistOpen, setExportHistOpen] = useState(false);

  const filtered = rows.filter(r => !search || r.code.toLowerCase().includes(search.toLowerCase()) || r.name.toLowerCase().includes(search.toLowerCase()));

  const sendMail = (id: number) => {
    setRows(rows.map(r => r.id === id ? { ...r, mailed: true } : r));
    toast.success('Statement mailed to supplier');
  };

  const openAdjustment = (r: Row) => {
    setAdjRow(r);
    setAdjLines([{ id: 1, adjustment: '', type: '', amount: 0 }]);
    setAdjOpen(true);
  };

  const addLine = () => setAdjLines(l => [...l, { id: Date.now(), adjustment: '', type: '', amount: 0 }]);
  const removeLine = (id: number) => setAdjLines(l => l.length > 1 ? l.filter(x => x.id !== id) : l);
  const updateLine = (id: number, patch: Partial<AdjLine>) => setAdjLines(l => l.map(x => x.id === id ? { ...x, ...patch } : x));

  const submitAdjustment = () => {
    if (adjLines.some(l => !l.adjustment || !l.type)) return toast.error('Please complete all adjustment lines');
    toast.success('Adjustment submitted');
    setAdjOpen(false);
  };

  const openHistory = (r: Row) => { setHistoryRow(r); setHistoryOpen(true); };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <nav className="text-sm text-muted-foreground">
          Supplier Billing / <span className="text-primary font-medium">Supplier Adjustment</span> / List
        </nav>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Supplier Adjustment List</h2>
              <div className="flex gap-2">
                <Input placeholder="Search by Supplier Code, Statement..." value={search} onChange={e => setSearch(e.target.value)} className="w-72" />
                <Button variant="outline" onClick={() => setSearch('')}>Reset</Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              <Button variant="outline" size="sm" onClick={() => setBulkOpen(true)}><Upload className="h-4 w-4 mr-1" />Bulk Adjustment</Button>
              <Button variant="outline" size="sm" onClick={() => setAdjHistOpen(true)}><History className="h-4 w-4 mr-1" />Adjustment History</Button>
              <Button variant="outline" size="sm"><Upload className="h-4 w-4 mr-1" />Bulk Export</Button>
              <Button variant="outline" size="sm" onClick={() => setExportHistOpen(true)}><History className="h-4 w-4 mr-1" />Export History</Button>
              <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" />Download</Button>
            </div>
            <div className="rounded-md border overflow-x-auto">
              <TableWithSearch>
                <TableHeader>
                  <TableRow className="bg-table-header hover:bg-table-header">
                    <TableHead className="text-table-header-foreground font-semibold w-10"><Checkbox /></TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">SN</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Supplier Code</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Supplier Name</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Shop Name</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Payment Processing Fee</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Pick Up Fee</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Penalties</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Packaging Material Cost</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Approved Claims</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Mail</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r, i) => (
                    <TableRow key={r.id} className={i % 2 === 1 ? 'bg-table-row-alt' : ''}>
                      <TableCell><Checkbox /></TableCell>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{r.code}</TableCell>
                      <TableCell>{r.name}</TableCell>
                      <TableCell>{r.shop}</TableCell>
                      <TableCell>{r.ppf}</TableCell>
                      <TableCell>{r.pickup}</TableCell>
                      <TableCell>{r.pen}</TableCell>
                      <TableCell>{r.pkg}</TableCell>
                      <TableCell>{r.claim}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" title={r.mailed ? 'Mail Sent' : 'Send Mail'} onClick={() => sendMail(r.id)} className={r.mailed ? 'text-success' : 'text-muted-foreground'}>
                          <Mail className="h-4 w-4" />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => openAdjustment(r)}>Adjustment</Button>
                          <Button size="sm" variant="secondary" onClick={() => openHistory(r)}>History</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </TableWithSearch>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              <Mail className="inline h-3 w-3 mr-1" />Green icon = mail sent · Grey icon = pending
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Adjustment Dialog */}
      <Dialog open={adjOpen} onOpenChange={setAdjOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Supplier Adjustment</DialogTitle>
              <Button variant="outline" size="sm" onClick={() => setAdjOpen(false)}><ArrowLeft className="h-4 w-4 mr-1" />Back</Button>
            </div>
          </DialogHeader>
          {adjRow && (
            <>
              <Card className="bg-muted/30">
                <CardContent className="pt-4">
                  <div className="text-sm font-semibold mb-2">Supplier Details</div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>Supplier Code: <span className="font-medium">{adjRow.code}</span></div>
                    <div>Supplier Name: <span className="font-medium">{adjRow.name}</span></div>
                    <div>Shop Name: <span className="font-medium">{adjRow.shop}</span></div>
                  </div>
                </CardContent>
              </Card>
              <div>
                <div className="text-sm font-semibold mb-2">Adjustment Details</div>
                <div className="space-y-2">
                  {adjLines.map(line => (
                    <div key={line.id} className="grid grid-cols-12 gap-2 items-end">
                      <div className="col-span-4">
                        <label className="text-xs text-muted-foreground">Adjustment*</label>
                        <Select value={line.adjustment} onValueChange={(v) => updateLine(line.id, { adjustment: v })}>
                          <SelectTrigger><SelectValue placeholder="Select Adjustment" /></SelectTrigger>
                          <SelectContent className="bg-popover z-[9999]">
                            {ADJ_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-3">
                        <label className="text-xs text-muted-foreground">Type*</label>
                        <Select value={line.type} onValueChange={(v) => updateLine(line.id, { type: v })}>
                          <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                          <SelectContent className="bg-popover z-[9999]">
                            <SelectItem value="Add">Add</SelectItem>
                            <SelectItem value="Deduct">Deduct</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-3">
                        <label className="text-xs text-muted-foreground">Amount*</label>
                        <Input type="number" value={line.amount} onChange={(e) => updateLine(line.id, { amount: +e.target.value })} />
                      </div>
                      <div className="col-span-2 flex gap-1">
                        <Button variant="destructive" size="sm" onClick={() => removeLine(line.id)}><Trash2 className="h-4 w-4 mr-1" />Remove</Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="mt-3" onClick={addLine}><Plus className="h-4 w-4 mr-1" />Add Line</Button>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAdjLines([{ id: 1, adjustment: '', type: '', amount: 0 }])}>Reset</Button>
                <Button onClick={submitAdjustment}>Submit</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Per-row Adjustment History */}
      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent className="max-w-5xl">
          <DialogHeader><DialogTitle>Adjustment History {historyRow ? `- ${historyRow.code}` : ''}</DialogTitle></DialogHeader>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-table-header hover:bg-table-header">
                  <TableHead className="text-table-header-foreground font-semibold">Supplier Code</TableHead>
                  <TableHead className="text-table-header-foreground font-semibold">Date</TableHead>
                  <TableHead className="text-table-header-foreground font-semibold">Date Cycle</TableHead>
                  <TableHead className="text-table-header-foreground font-semibold">Payment Processing Fee</TableHead>
                  <TableHead className="text-table-header-foreground font-semibold">Pickup Fee</TableHead>
                  <TableHead className="text-table-header-foreground font-semibold">Penalties</TableHead>
                  <TableHead className="text-table-header-foreground font-semibold">Packaging Material Cost</TableHead>
                  <TableHead className="text-table-header-foreground font-semibold">Approved Claim</TableHead>
                  <TableHead className="text-table-header-foreground font-semibold">Compensation For Warehouse & Logistic Losses</TableHead>
                  <TableHead className="text-table-header-foreground font-semibold">Penalties (Adjustment)</TableHead>
                  <TableHead className="text-table-header-foreground font-semibold">Adjustment Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow><TableCell colSpan={11} className="text-center text-muted-foreground py-8">No results found</TableCell></TableRow>
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Adjustment Dialog */}
      <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Bulk Adjustment</DialogTitle></DialogHeader>
          <div className="border rounded-md p-4 flex items-center gap-3">
            <Button variant="outline" onClick={() => fileRef.current?.click()}><FileSpreadsheet className="h-4 w-4 mr-1" />Choose an Excel File</Button>
            <input ref={fileRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={(e) => setBulkFile(e.target.files?.[0]?.name || '')} />
            <Button onClick={() => { if (!bulkFile) return toast.error('Choose a file first'); toast.success('Uploaded ' + bulkFile); setBulkOpen(false); setBulkFile(''); }}><Upload className="h-4 w-4 mr-1" />Upload</Button>
            <Button variant="outline" onClick={() => { setBulkOpen(false); setBulkFile(''); }}><X className="h-4 w-4 mr-1" />Cancel</Button>
          </div>
          {bulkFile && <p className="text-xs text-muted-foreground">Selected: <span className="font-medium text-foreground">{bulkFile}</span></p>}
        </DialogContent>
      </Dialog>

      {/* Adjustment History (global) */}
      <Dialog open={adjHistOpen} onOpenChange={setAdjHistOpen}>
        <DialogContent className="max-w-6xl">
          <DialogHeader><DialogTitle>Adjustment History</DialogTitle></DialogHeader>
          <div className="flex gap-2">
            <Input placeholder="Search by Source File Name" className="w-72" />
            <Button>Search</Button>
            <Button variant="destructive">Reset</Button>
          </div>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-table-header hover:bg-table-header">
                  {['SN','Source File','Processed File','Total Rows','Total Success Rows','Total Failed Rows','Process Status','Message','Adjustment By','Adjustment At'].map(h =>
                    <TableHead key={h} className="text-table-header-foreground font-semibold">{h}</TableHead>)}
                </TableRow>
              </TableHeader>
              <TableBody>
                {adjHistorySeed.map((r, i) => (
                  <TableRow key={r.sn} className={i % 2 === 1 ? 'bg-table-row-alt' : ''}>
                    <TableCell>{r.sn}</TableCell>
                    <TableCell className="text-primary underline">{r.source}</TableCell>
                    <TableCell className="text-primary underline">{r.processed}</TableCell>
                    <TableCell>{r.total}</TableCell>
                    <TableCell className="text-primary">{r.success}</TableCell>
                    <TableCell>{r.failed}</TableCell>
                    <TableCell>{r.status}</TableCell>
                    <TableCell className="text-xs max-w-xs">{r.message}</TableCell>
                    <TableCell>{r.by}</TableCell>
                    <TableCell>{r.at}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Export History (global) */}
      <Dialog open={exportHistOpen} onOpenChange={setExportHistOpen}>
        <DialogContent className="max-w-5xl">
          <DialogHeader><DialogTitle>Export History</DialogTitle></DialogHeader>
          <div><Button variant="destructive" size="sm"><RefreshCw className="h-4 w-4 mr-1" />Refresh</Button></div>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-table-header hover:bg-table-header">
                  {['SN','Processed File','Total Rows','Process Status','Message','Export By','Export At'].map(h =>
                    <TableHead key={h} className="text-table-header-foreground font-semibold">{h}</TableHead>)}
                </TableRow>
              </TableHeader>
              <TableBody>
                {exportHistorySeed.map((r, i) => (
                  <TableRow key={r.sn} className={i % 2 === 1 ? 'bg-table-row-alt' : ''}>
                    <TableCell>{r.sn}</TableCell>
                    <TableCell>{r.processed}</TableCell>
                    <TableCell>{r.total}</TableCell>
                    <TableCell>{r.status}</TableCell>
                    <TableCell>{r.message}</TableCell>
                    <TableCell>{r.by}</TableCell>
                    <TableCell>{r.at}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
