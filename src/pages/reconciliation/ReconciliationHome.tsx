import React, { useRef, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { FileSpreadsheet, Upload, RefreshCw, AlertTriangle, CheckCircle2, FileText, Trash2, Eye, Download, Search } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// ──────────────────────────────────────────────────────────────────────
// Sample data (mirrors the structure of the supplied P&L Reconciliation
// workbook: GL Code, GL Name, Voucher Amount, P&L Amount, Difference)
// ──────────────────────────────────────────────────────────────────────
const SAMPLE_PREP_ROWS = [
  { glCode: '4101001', glName: 'Food & Beverage Sales', voucher: 12_50_000, pl: 12_50_000 },
  { glCode: '4101002', glName: 'Beverage Sales', voucher: 4_25_000, pl: 4_25_000 },
  { glCode: '4102001', glName: 'Service Charge Income', voucher: 95_000, pl: 92_500 },
  { glCode: '5101001', glName: 'Raw Material Consumption', voucher: 6_80_000, pl: 6_85_000 },
  { glCode: '5102001', glName: 'Salary & Wages - Kitchen', voucher: 2_40_000, pl: 2_40_000 },
  { glCode: '5201001', glName: 'Rent Expense', voucher: 1_20_000, pl: 1_20_000 },
  { glCode: '5202001', glName: 'Utility Expense', voucher: 38_500, pl: 41_200 },
  { glCode: '5203001', glName: 'Marketing & Promotion', voucher: 55_000, pl: 60_000 },
];

const ERROR_ROWS = SAMPLE_PREP_ROWS
  .map(r => ({ ...r, diff: r.voucher - r.pl }))
  .filter(r => r.diff !== 0)
  .map((r, i) => ({
    ...r,
    sl: i + 1,
    type: r.diff > 0 ? 'Voucher > P&L' : 'P&L > Voucher',
    remarks: r.diff > 0 ? 'Possible un-posted P&L entry' : 'Possible missing voucher',
  }));

const LOG_ROWS = [
  { sl: 1, ts: '2026-05-04 11:24', user: 'Mahmudul Hasan', action: 'File Uploaded', file: 'PL_April_2026.xlsx', status: 'Success' },
  { sl: 2, ts: '2026-05-04 11:25', user: 'Mahmudul Hasan', action: 'Data Prepared', file: '—', status: 'Success' },
  { sl: 3, ts: '2026-05-04 11:27', user: 'Mahmudul Hasan', action: 'Reconciliation Run', file: '—', status: 'Errors Found' },
  { sl: 4, ts: '2026-05-04 11:32', user: 'Farzana Islam', action: 'Cleared Logs', file: '—', status: 'Success' },
  { sl: 5, ts: '2026-05-04 11:36', user: 'Mahmudul Hasan', action: 'Reconciliation Re-run', file: '—', status: 'Success' },
];

const fmt = (n: number) =>
  n === 0 ? '-' : new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

export default function ReconciliationHome() {
  // Upload tab
  const fileInput = useRef<HTMLInputElement>(null);
  const [period, setPeriod] = useState<string>('');
  const [reconType, setReconType] = useState<string>('Bank');
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // Reconcile prep tab
  const [prepRows, setPrepRows] = useState(SAMPLE_PREP_ROWS);
  const [selected, setSelected] = useState<string[]>([]);

  const handleFile = (file: File) => {
    if (!/\.(xlsx|xls|csv)$/i.test(file.name)) {
      toast.error('Please upload an Excel / CSV file');
      return;
    }
    setFileName(file.name);
    toast.success(`File "${file.name}" attached`);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const totals = prepRows.reduce(
    (acc, r) => {
      acc.voucher += r.voucher;
      acc.pl += r.pl;
      return acc;
    },
    { voucher: 0, pl: 0 },
  );
  const diffTotal = totals.voucher - totals.pl;

  const errorTotals = ERROR_ROWS.reduce(
    (acc, r) => {
      acc.voucher += r.voucher;
      acc.pl += r.pl;
      acc.diff += r.diff;
      return acc;
    },
    { voucher: 0, pl: 0, diff: 0 },
  );

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Breadcrumb */}
        <Card className="px-4 py-3 rounded-md">
          <div className="text-sm">
            <span className="font-semibold text-foreground">Reconciliation</span>
            <span className="mx-2 text-muted-foreground">/</span>
            <span className="text-primary">P&amp;L Reconciliation</span>
          </div>
        </Card>

        <Card className="p-4 rounded-md">
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid grid-cols-3 lg:grid-cols-6 gap-1 h-auto p-1 bg-muted">
              <TabsTrigger value="upload" className="text-xs lg:text-sm whitespace-normal py-2">
                1. Upload File &amp; Data Preparation
              </TabsTrigger>
              <TabsTrigger value="prepare" className="text-xs lg:text-sm whitespace-normal py-2">
                2. Reconcile Preparation
              </TabsTrigger>
              <TabsTrigger value="errors" className="text-xs lg:text-sm whitespace-normal py-2">
                3. Reconcile Error With P&amp;L
              </TabsTrigger>
              <TabsTrigger value="update" className="text-xs lg:text-sm whitespace-normal py-2">
                4. Update Reconcile After Clear Logs
              </TabsTrigger>
              <TabsTrigger value="summary" className="text-xs lg:text-sm whitespace-normal py-2">
                5. Reconciliation Summary
              </TabsTrigger>
              <TabsTrigger value="logs" className="text-xs lg:text-sm whitespace-normal py-2">
                6. Reconciliation Logs
              </TabsTrigger>
            </TabsList>

            {/* 1. Upload File & Data Preparation */}
            <TabsContent value="upload" className="mt-4 space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm">Reconciliation Type <span className="text-destructive">*</span></Label>
                  <Select value={reconType} onValueChange={setReconType}>
                    <SelectTrigger className="mt-2 h-10"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-popover z-[9999]">
                      <SelectItem value="Bank">Bank Reconciliation</SelectItem>
                      <SelectItem value="MFS">MFS Reconciliation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm">Reconciliation Period <span className="text-destructive">*</span></Label>
                  <Input type="month" value={period} onChange={e => setPeriod(e.target.value)} className="mt-2 h-10" />
                </div>
                <div>
                  <Label className="text-sm">Branch</Label>
                  <Select defaultValue="ho">
                    <SelectTrigger className="mt-2 h-10"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-popover z-[9999]">
                      <SelectItem value="ho">Head Office</SelectItem>
                      <SelectItem value="dhk">Dhaka</SelectItem>
                      <SelectItem value="ctg">Chittagong</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                className={cn(
                  'rounded-md border-2 border-dashed p-8 text-center transition-colors flex flex-col items-center justify-center min-h-[200px]',
                  dragOver ? 'border-primary bg-primary/5' : 'border-primary/40 bg-muted/30',
                )}
                style={{
                  backgroundImage: dragOver ? undefined :
                    'repeating-linear-gradient(135deg, hsl(var(--muted)) 0 10px, transparent 10px 20px)',
                }}
              >
                <p className="text-primary font-medium">Drag and drop your P&amp;L Excel file here</p>
                <p className="text-xs italic text-primary/80 mt-2">Use Only Excel / CSV File</p>
                <Button className="mt-4" onClick={() => fileInput.current?.click()}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" /> Choose [ Excel File ]
                </Button>
                <input
                  ref={fileInput}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
                {fileName && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    Selected: <span className="font-medium text-foreground">{fileName}</span>
                  </p>
                )}
              </div>

              <div className="border-t pt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => { setFileName(null); setPeriod(''); }}>
                  <RefreshCw className="h-4 w-4 mr-2" /> Reset
                </Button>
                <Button onClick={() => {
                  if (!fileName) return toast.error('Please upload a file');
                  if (!period) return toast.error('Please select a period');
                  toast.success('Data prepared successfully');
                }}>
                  <Upload className="h-4 w-4 mr-2" /> Prepare Data
                </Button>
              </div>
            </TabsContent>

            {/* 2. Reconcile Preparation */}
            <TabsContent value="prepare" className="mt-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search GL Code / Name" className="pl-8 h-9 w-64" />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="h-9 w-40"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-popover z-[9999]">
                      <SelectItem value="all">All Accounts</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" /> Export</Button>
                  <Button size="sm" onClick={() => toast.success('Reconciliation executed')}>
                    <RefreshCw className="h-4 w-4 mr-2" /> Run Reconciliation
                  </Button>
                </div>
              </div>

              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/60">
                      <TableHead className="w-10">
                        <Checkbox
                          checked={selected.length === prepRows.length && prepRows.length > 0}
                          onCheckedChange={(v) => setSelected(v ? prepRows.map(r => r.glCode) : [])}
                        />
                      </TableHead>
                      <TableHead className="w-12">SL</TableHead>
                      <TableHead>GL Code</TableHead>
                      <TableHead>GL Name</TableHead>
                      <TableHead className="text-right">Voucher Amount</TableHead>
                      <TableHead className="text-right">P&amp;L Amount</TableHead>
                      <TableHead className="text-right">Difference</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prepRows.map((r, i) => {
                      const diff = r.voucher - r.pl;
                      const matched = diff === 0;
                      return (
                        <TableRow key={r.glCode}>
                          <TableCell>
                            <Checkbox
                              checked={selected.includes(r.glCode)}
                              onCheckedChange={(v) => setSelected(v
                                ? [...selected, r.glCode]
                                : selected.filter(s => s !== r.glCode))}
                            />
                          </TableCell>
                          <TableCell>{i + 1}</TableCell>
                          <TableCell className="font-mono text-xs">{r.glCode}</TableCell>
                          <TableCell>{r.glName}</TableCell>
                          <TableCell className="text-right font-mono">{fmt(r.voucher)}</TableCell>
                          <TableCell className="text-right font-mono">{fmt(r.pl)}</TableCell>
                          <TableCell className={cn('text-right font-mono', diff !== 0 && 'text-destructive font-semibold')}>
                            {fmt(diff)}
                          </TableCell>
                          <TableCell className="text-center">
                            {matched
                              ? <Badge variant="outline" className="border-green-600 text-green-700">Matched</Badge>
                              : <Badge variant="destructive">Mismatch</Badge>}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow className="bg-muted/40 font-semibold">
                      <TableCell colSpan={4} className="text-right">Total</TableCell>
                      <TableCell className="text-right font-mono">{fmt(totals.voucher)}</TableCell>
                      <TableCell className="text-right font-mono">{fmt(totals.pl)}</TableCell>
                      <TableCell className={cn('text-right font-mono', diffTotal !== 0 && 'text-destructive')}>
                        {fmt(diffTotal)}
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* 3. Reconcile Errors */}
            <TabsContent value="errors" className="mt-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <span><b>{ERROR_ROWS.length}</b> mismatches found vs Profit &amp; Loss Report</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" /> Export Errors</Button>
                  <Button size="sm" variant="destructive" onClick={() => toast.success('Logs cleared. Switch to "Update" tab to re-run.')}>
                    <Trash2 className="h-4 w-4 mr-2" /> Clear Logs
                  </Button>
                </div>
              </div>

              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/60">
                      <TableHead className="w-12">SL</TableHead>
                      <TableHead>GL Code</TableHead>
                      <TableHead>GL Name</TableHead>
                      <TableHead className="text-right">Voucher</TableHead>
                      <TableHead className="text-right">P&amp;L</TableHead>
                      <TableHead className="text-right">Difference</TableHead>
                      <TableHead>Error Type</TableHead>
                      <TableHead>Remarks</TableHead>
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ERROR_ROWS.map(r => (
                      <TableRow key={r.glCode}>
                        <TableCell>{r.sl}</TableCell>
                        <TableCell className="font-mono text-xs">{r.glCode}</TableCell>
                        <TableCell>{r.glName}</TableCell>
                        <TableCell className="text-right font-mono">{fmt(r.voucher)}</TableCell>
                        <TableCell className="text-right font-mono">{fmt(r.pl)}</TableCell>
                        <TableCell className="text-right font-mono text-destructive font-semibold">{fmt(r.diff)}</TableCell>
                        <TableCell><Badge variant="outline">{r.type}</Badge></TableCell>
                        <TableCell className="text-xs text-muted-foreground">{r.remarks}</TableCell>
                        <TableCell className="text-center">
                          <Button size="icon" variant="ghost" className="h-7 w-7"><Eye className="h-4 w-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/40 font-semibold">
                      <TableCell colSpan={3} className="text-right">Total</TableCell>
                      <TableCell className="text-right font-mono">{fmt(errorTotals.voucher)}</TableCell>
                      <TableCell className="text-right font-mono">{fmt(errorTotals.pl)}</TableCell>
                      <TableCell className="text-right font-mono text-destructive">{fmt(errorTotals.diff)}</TableCell>
                      <TableCell colSpan={3} />
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* 4. Update Reconcile After Clear Logs */}
            <TabsContent value="update" className="mt-4 space-y-3">
              <Card className="p-4 bg-muted/30 border-dashed">
                <div className="flex items-start gap-3">
                  <RefreshCw className="h-5 w-5 text-primary mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">Re-run reconciliation after clearing previous error logs.</p>
                    <p className="text-muted-foreground mt-1">
                      Adjust the GL accounts below, post any missing journal vouchers, then click <b>Update Reconciliation</b>.
                      The system will re-validate every line against the latest Profit &amp; Loss report.
                    </p>
                  </div>
                </div>
              </Card>

              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/60">
                      <TableHead className="w-12">SL</TableHead>
                      <TableHead>GL Code</TableHead>
                      <TableHead>GL Name</TableHead>
                      <TableHead className="text-right">Old Difference</TableHead>
                      <TableHead className="text-right">Adjustment Amount</TableHead>
                      <TableHead>Adjustment Voucher #</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ERROR_ROWS.map(r => (
                      <TableRow key={r.glCode}>
                        <TableCell>{r.sl}</TableCell>
                        <TableCell className="font-mono text-xs">{r.glCode}</TableCell>
                        <TableCell>{r.glName}</TableCell>
                        <TableCell className="text-right font-mono">{fmt(r.diff)}</TableCell>
                        <TableCell className="text-right">
                          <Input className="h-8 text-right font-mono" defaultValue={Math.abs(r.diff).toFixed(2)} />
                        </TableCell>
                        <TableCell><Input className="h-8" placeholder="JV-2026-XXX" /></TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">Pending</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end gap-2 border-t pt-4">
                <Button variant="outline">Reset</Button>
                <Button onClick={() => toast.success('Reconciliation updated. All entries matched.')}>
                  <CheckCircle2 className="h-4 w-4 mr-2" /> Update Reconciliation
                </Button>
              </div>
            </TabsContent>

            {/* 5. Summary */}
            <TabsContent value="summary" className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {[
                  { label: 'Total GL Accounts', value: prepRows.length, tone: 'text-foreground' },
                  { label: 'Matched', value: prepRows.length - ERROR_ROWS.length, tone: 'text-green-700' },
                  { label: 'Mismatched', value: ERROR_ROWS.length, tone: 'text-destructive' },
                  { label: 'Net Difference', value: fmt(diffTotal), tone: diffTotal === 0 ? 'text-green-700' : 'text-destructive' },
                ].map(c => (
                  <Card key={c.label} className="p-4">
                    <p className="text-xs text-muted-foreground">{c.label}</p>
                    <p className={cn('text-2xl font-semibold mt-1 font-mono', c.tone)}>{c.value}</p>
                  </Card>
                ))}
              </div>

              <Card className="p-4">
                <h3 className="font-medium mb-3">Reconciliation Snapshot — {reconType} ({period || 'YYYY-MM'})</h3>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/60">
                      <TableHead>Group</TableHead>
                      <TableHead className="text-right">Voucher</TableHead>
                      <TableHead className="text-right">P&amp;L</TableHead>
                      <TableHead className="text-right">Difference</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Income</TableCell>
                      <TableCell className="text-right font-mono">17,70,000.00</TableCell>
                      <TableCell className="text-right font-mono">17,67,500.00</TableCell>
                      <TableCell className="text-right font-mono text-destructive">2,500.00</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Expense</TableCell>
                      <TableCell className="text-right font-mono">11,33,500.00</TableCell>
                      <TableCell className="text-right font-mono">11,46,200.00</TableCell>
                      <TableCell className="text-right font-mono text-destructive">(12,700.00)</TableCell>
                    </TableRow>
                    <TableRow className="bg-muted/40 font-semibold">
                      <TableCell>Net P&amp;L</TableCell>
                      <TableCell className="text-right font-mono">6,36,500.00</TableCell>
                      <TableCell className="text-right font-mono">6,21,300.00</TableCell>
                      <TableCell className="text-right font-mono text-destructive">15,200.00</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Card>

              <div className="flex justify-end gap-2">
                <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export Summary</Button>
                <Button><FileText className="h-4 w-4 mr-2" /> Generate Final Report</Button>
              </div>
            </TabsContent>

            {/* 6. Logs */}
            <TabsContent value="logs" className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">All reconciliation activities are tracked here.</p>
                <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" /> Export Logs</Button>
              </div>
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/60">
                      <TableHead className="w-12">SL</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>File</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {LOG_ROWS.map(l => (
                      <TableRow key={l.sl}>
                        <TableCell>{l.sl}</TableCell>
                        <TableCell className="font-mono text-xs">{l.ts}</TableCell>
                        <TableCell>{l.user}</TableCell>
                        <TableCell>{l.action}</TableCell>
                        <TableCell className="text-xs">{l.file}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={l.status === 'Errors Found' ? 'destructive' : 'outline'}
                                 className={l.status === 'Success' ? 'border-green-600 text-green-700' : ''}>
                            {l.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </DashboardLayout>
  );
}
