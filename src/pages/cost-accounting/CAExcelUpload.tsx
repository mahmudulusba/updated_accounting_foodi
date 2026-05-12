import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Upload, Download, FileSpreadsheet, CheckCircle2, AlertTriangle, AlertCircle, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type UploadType = 'Goods Receipt' | 'Vendor Invoice' | 'Production Consumption' | 'Freight' | 'Overhead Allocation' | 'Cost Adjustment';

const uploadTypes: { id: UploadType; subtitle: string; version: string }[] = [
  { id: 'Goods Receipt', subtitle: 'Inventory in from vendors', version: 'v2.0' },
  { id: 'Vendor Invoice', subtitle: 'Invoice matching with GRN', version: 'v1.5' },
  { id: 'Production Consumption', subtitle: 'Material issued to production', version: 'v1.3' },
  { id: 'Freight', subtitle: 'Inbound freight & logistics', version: 'v1.1' },
  { id: 'Overhead Allocation', subtitle: 'Cost center overhead', version: 'v1.0' },
  { id: 'Cost Adjustment', subtitle: 'Manual cost corrections', version: 'v1.0' },
];

interface ValidationRow {
  row: number;
  ref: string;
  field: string;
  error: string;
  fix: string;
  severity: 'error' | 'warning';
}

interface BatchHistory {
  id: string;
  type: UploadType;
  date: string;
  vouchers: number;
  status: 'Unposted' | 'Posted' | 'Validation Error';
}

const mockValidation: ValidationRow[] = [
  { row: 12, ref: 'GRN-22834', field: 'Item Code', error: 'Item RM-XYZ not found in inventory master', fix: 'Verify item code; use RM-RICE-50 or RM-OIL-20', severity: 'error' },
  { row: 27, ref: 'GRN-22847', field: 'Quantity', error: 'GRN qty exceeds PO qty by 12 units', fix: 'Verify receipt against PO line', severity: 'error' },
  { row: 54, ref: 'INV-99201', field: 'Vendor Code', error: 'Vendor V-1098 inactive', fix: 'Activate vendor or update master', severity: 'error' },
  { row: 88, ref: 'GRN-22901', field: 'Cost Center', error: 'Cost center CC-PROD-99 not configured', fix: 'Add cost center mapping', severity: 'error' },
  { row: 142, ref: 'INV-99315', field: 'Currency', error: 'Currency code missing — defaulted to BDT', fix: 'Add currency in column N', severity: 'warning' },
  { row: 201, ref: 'OH-1042', field: 'Allocation Basis', error: 'Allocation basis ambiguous; using machine hours', fix: 'Confirm basis with operations', severity: 'warning' },
];

const mockBatches: BatchHistory[] = [
  { id: 'BATCH-20260410-001', type: 'Goods Receipt', date: '10 Apr 2026', vouchers: 612, status: 'Unposted' },
  { id: 'BATCH-20260402-002', type: 'Vendor Invoice', date: '02 Apr 2026', vouchers: 187, status: 'Posted' },
  { id: 'BATCH-20260326-001', type: 'Production Consumption', date: '26 Mar 2026', vouchers: 944, status: 'Posted' },
  { id: 'BATCH-20260316-002', type: 'Overhead Allocation', date: '16 Mar 2026', vouchers: 32, status: 'Posted' },
];

export default function CAExcelUpload() {
  const navigate = useNavigate();
  const fileInput = useRef<HTMLInputElement>(null);
  const [selectedType, setSelectedType] = useState<UploadType>('Goods Receipt');
  const [fileName, setFileName] = useState<string | null>(null);
  const [validated, setValidated] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File) => {
    setFileName(file.name);
    setValidated(false);
    setTimeout(() => {
      setValidated(true);
      toast.success(`Validated ${file.name}`);
    }, 700);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const createVouchers = () => {
    toast.success('612 vouchers created in Unposted status');
    setFileName(null);
    setValidated(false);
  };

  const stats = { total: 618, valid: 612, errors: 4, warnings: 2 };

  const statusBadge = (s: BatchHistory['status']) => {
    const map: Record<BatchHistory['status'], string> = {
      Unposted: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
      Posted: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
      'Validation Error': 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
    };
    return <span className={`px-2 py-0.5 rounded text-xs ${map[s]}`}>{s}</span>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <span>Cost Accounting</span><span>›</span><span>Excel Upload</span>
          </div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Upload className="h-6 w-6 text-primary" />
            Excel Upload
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-3xl">
            Upload structured Excel templates to create cost accounting vouchers. Vouchers are held as <b>Unposted</b> until validated and posted.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Step 1 — Select Upload Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {uploadTypes.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedType(t.id)}
                  className={cn(
                    'p-4 rounded-lg border text-left transition-all',
                    selectedType === t.id
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                      : 'border-border hover:border-primary/40 hover:bg-muted/50'
                  )}
                >
                  <div className="font-medium text-sm">{t.id}</div>
                  <div className="text-xs text-muted-foreground mt-1">{t.subtitle}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Step 2 — Upload File</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                className={cn(
                  'border-2 border-dashed rounded-lg p-10 text-center transition-colors',
                  dragOver ? 'border-primary bg-primary/5' : 'border-border bg-muted/30'
                )}
              >
                <FileSpreadsheet className="h-10 w-10 mx-auto text-muted-foreground" />
                <div className="mt-3 font-medium">Drag & drop Excel file here</div>
                <div className="text-sm text-muted-foreground mt-1">or</div>
                <Button variant="outline" className="mt-3" onClick={() => fileInput.current?.click()}>
                  Browse File
                </Button>
                <input
                  ref={fileInput}
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
                {fileName && (
                  <div className="mt-4 text-sm text-muted-foreground">
                    Selected: <span className="font-medium text-foreground">{fileName}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Download Template</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <div className="font-medium">{selectedType} {uploadTypes.find(t => t.id === selectedType)?.version}</div>
                <div className="text-xs text-muted-foreground mt-1">Last updated: Apr 2026</div>
              </div>
              <Button className="w-full mt-4" onClick={() => toast.success('Template downloaded')}>
                <Download className="h-4 w-4 mr-2" />
                Download .xlsx
              </Button>
              <div className="text-xs text-muted-foreground mt-3">
                Use the template columns exactly. Do not rename or reorder columns.
              </div>
            </CardContent>
          </Card>
        </div>

        {validated && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Step 3 — Validation Result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground">Total Rows</div>
                  <div className="text-2xl font-bold mt-1">{stats.total.toLocaleString()}</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-emerald-600" /> Valid</div>
                  <div className="text-2xl font-bold mt-1 text-emerald-600">{stats.valid.toLocaleString()}</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground flex items-center gap-1"><AlertCircle className="h-3 w-3 text-red-600" /> Errors</div>
                  <div className="text-2xl font-bold mt-1 text-red-600">{stats.errors}</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3 text-amber-600" /> Warnings</div>
                  <div className="text-2xl font-bold mt-1 text-amber-600">{stats.warnings}</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground">File</div>
                  <div className="text-sm font-medium mt-1 truncate">{fileName}</div>
                </div>
              </div>

              <div className="rounded-md border overflow-x-auto">
                <TableWithSearch>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Row</TableHead>
                      <TableHead>Reference No.</TableHead>
                      <TableHead>Field</TableHead>
                      <TableHead>Issue</TableHead>
                      <TableHead>Fix Suggestion</TableHead>
                      <TableHead className="text-center">Severity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockValidation.map((v, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-mono text-xs">{v.row}</TableCell>
                        <TableCell className="font-mono text-xs">{v.ref}</TableCell>
                        <TableCell>{v.field}</TableCell>
                        <TableCell className="text-sm">{v.error}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{v.fix}</TableCell>
                        <TableCell className="text-center">
                          {v.severity === 'error'
                            ? <span className="px-2 py-0.5 rounded text-xs bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">Error</span>
                            : <span className="px-2 py-0.5 rounded text-xs bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">Warning</span>}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </TableWithSearch>
              </div>

              <div className="flex flex-wrap gap-3 justify-end">
                <Button variant="outline" onClick={() => { setFileName(null); setValidated(false); }}>
                  Re-upload Corrected File
                </Button>
                <Button onClick={createVouchers}>
                  Create Vouchers from Valid Rows ({stats.valid.toLocaleString()})
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Upload Batches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <TableWithSearch>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Vouchers</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBatches.map(b => (
                    <TableRow key={b.id}>
                      <TableCell className="font-mono text-xs">{b.id}</TableCell>
                      <TableCell>{b.type}</TableCell>
                      <TableCell>{b.date}</TableCell>
                      <TableCell>{b.vouchers.toLocaleString()} vouchers</TableCell>
                      <TableCell>{statusBadge(b.status)}</TableCell>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="sm" onClick={() => navigate('/management/cost-accounting/voucher-list')}>
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </TableWithSearch>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
