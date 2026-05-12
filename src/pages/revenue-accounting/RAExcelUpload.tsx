import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Upload, Download, FileSpreadsheet, CheckCircle2, AlertTriangle, AlertCircle, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type UploadType = 'POS Sales' | 'Order Fulfillment' | 'Wholesale' | 'Marketplace' | 'Promotion' | 'Adjustment';

const uploadTypes: { id: UploadType; subtitle: string; version: string }[] = [
  { id: 'POS Sales', subtitle: 'Foodi Mart counter sales', version: 'v2.1' },
  { id: 'Order Fulfillment', subtitle: 'Online orders delivered', version: 'v1.4' },
  { id: 'Wholesale', subtitle: 'Bulk / B2B deliveries', version: 'v1.2' },
  { id: 'Marketplace', subtitle: 'Marketplace settlement', version: 'v1.0' },
  { id: 'Promotion', subtitle: 'Promo / discount input', version: 'v1.0' },
  { id: 'Adjustment', subtitle: 'Manual corrections', version: 'v1.0' },
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
  { row: 14, ref: 'INV-3847322', field: 'SKU Code', error: 'SKU FM-XYZ not found in product master', fix: 'Verify SKU; use FM-RICE-5KG or FM-OIL-1L', severity: 'error' },
  { row: 38, ref: 'INV-3847488', field: 'Net Amount', error: 'Subtotal + tax ≠ total (off by $100)', fix: 'Recheck column K and L arithmetic', severity: 'error' },
  { row: 71, ref: 'INV-3847601', field: 'Outlet Code', error: 'Outlet code 1234567 not on approved list', fix: 'Verify outlet code with operations', severity: 'error' },
  { row: 112, ref: 'INV-3847744', field: 'Delivery Date', error: 'Delivery date 2024-01-15 is before order date', fix: 'Correct delivery date in column I', severity: 'error' },
  { row: 205, ref: 'INV-3847901', field: 'Currency', error: 'Currency code missing — defaulted to BDT', fix: 'Add currency in column M', severity: 'warning' },
  { row: 318, ref: 'INV-3848012', field: 'Promo Code', error: 'Promo code unknown; treated as standard price', fix: 'Verify promo code with marketing', severity: 'warning' },
];

const mockBatches: BatchHistory[] = [
  { id: 'BATCH-20260409-001', type: 'POS Sales', date: '09 Apr 2026', vouchers: 1841, status: 'Unposted' },
  { id: 'BATCH-20260401-003', type: 'Order Fulfillment', date: '01 Apr 2026', vouchers: 312, status: 'Posted' },
  { id: 'BATCH-20260325-002', type: 'POS Sales', date: '25 Mar 2026', vouchers: 2104, status: 'Posted' },
  { id: 'BATCH-20260315-001', type: 'Wholesale', date: '15 Mar 2026', vouchers: 48, status: 'Posted' },
];

export default function RAExcelUpload() {
  const navigate = useNavigate();
  const fileInput = useRef<HTMLInputElement>(null);
  const [selectedType, setSelectedType] = useState<UploadType>('POS Sales');
  const [fileName, setFileName] = useState<string | null>(null);
  const [validated, setValidated] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File) => {
    setFileName(file.name);
    setValidated(false);
    // mock async validation
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
    toast.success('1,841 vouchers created in Unposted status');
    setFileName(null);
    setValidated(false);
  };

  const stats = { total: 1847, valid: 1841, errors: 4, warnings: 2 };

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
            <span>Revenue Accounting</span><span>›</span><span>Excel Upload</span>
          </div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Upload className="h-6 w-6 text-primary" />
            Excel Upload
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-3xl">
            Upload structured Excel templates to create revenue accounting vouchers. Vouchers are held as <b>Unposted</b> until validated and posted.
          </p>
        </div>

        {/* Step 1 */}
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

        {/* Step 2 */}
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

        {/* Step 3 */}
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

        {/* Recent batches */}
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
                        <Button variant="ghost" size="sm" onClick={() => navigate('/management/revenue-accounting/voucher-list')}>
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
