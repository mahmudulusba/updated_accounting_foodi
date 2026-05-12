import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Download, X, ChevronRight, Eye, MessageSquare, AlertTriangle, CheckCircle2, XCircle, Search, Scale, Upload, FileUp } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const mockReconData = [
  { id: '1', flightNo: 'BS-101', date: '2026-02-05', station: 'DAC', provider: 'Biman GH', invoiceNo: 'INV-2026-001', forecasted: '৳6,594.5', invoiced: '৳7,411.25', varianceAmt: '+৳816.75', variancePct: '(+12.4%)', status: 'Variance', services: '5/8', reconciledBy: 'Admin' },
  { id: '2', flightNo: 'BS-201', date: '2026-02-06', station: 'DXB', provider: 'DNATA', invoiceNo: 'INV-2026-045', forecasted: 'د.إ4,500', invoiced: 'د.إ4,500', varianceAmt: 'د.إ0', variancePct: '(0.0%)', status: 'Matched', services: '12/12', reconciledBy: 'Operator1' },
  { id: '3', flightNo: 'BS-301', date: '2026-02-07', station: 'SIN', provider: 'SATS', invoiceNo: 'INV-2026-078', forecasted: 'S$3,200', invoiced: 'S$3,050', varianceAmt: 'S$-150', variancePct: '(-4.7%)', status: 'Variance', services: '8/10', reconciledBy: '—' },
  { id: '4', flightNo: 'BS-401', date: '2026-02-08', station: 'CCU', provider: 'AI-SATS', invoiceNo: 'INV-2026-102', forecasted: '₹28,000', invoiced: '₹32,500', varianceAmt: '+₹4,500', variancePct: '(+16.1%)', status: 'Disputed', services: '4/6', reconciledBy: 'Admin' },
  { id: '5', flightNo: 'BS-501', date: '2026-02-09', station: 'BKK', provider: 'BFS Ground', invoiceNo: 'INV-2026-155', forecasted: '฿45,000', invoiced: '฿44,000', varianceAmt: '฿-1,000', variancePct: '(-2.2%)', status: 'Approved', services: '9/9', reconciledBy: 'Manager' },
];

const TABS = [
  { key: 'all', label: 'All', count: 5 },
  { key: 'Matched', label: 'Matched', count: 1 },
  { key: 'Variance', label: 'Variance', count: 2 },
  { key: 'Disputed', label: 'Disputed', count: 1 },
  { key: 'Approved', label: 'Approved', count: 1 },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Matched': return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 gap-1"><CheckCircle2 className="h-3 w-3" />{status}</Badge>;
    case 'Variance': return <Badge className="bg-amber-100 text-amber-700 border-amber-200 gap-1"><AlertTriangle className="h-3 w-3" />{status}</Badge>;
    case 'Disputed': return <Badge className="bg-red-100 text-red-700 border-red-200 gap-1"><XCircle className="h-3 w-3" />{status}</Badge>;
    case 'Approved': return <Badge className="bg-teal-100 text-primary border-teal-200 gap-1"><CheckCircle2 className="h-3 w-3" />{status}</Badge>;
    default: return <Badge variant="outline">{status}</Badge>;
  }
};

export default function InvoiceReconciliation() {
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [stationFilter, setStationFilter] = useState('all');
  const [reconStatusFilter, setReconStatusFilter] = useState('all');
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [flightSearch, setFlightSearch] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState('25');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const filteredData = useMemo(() => {
    return mockReconData.filter(item => {
      const matchesTab = activeTab === 'all' || item.status === activeTab;
      const matchesSearch = !search || item.flightNo.toLowerCase().includes(search.toLowerCase()) || item.provider.toLowerCase().includes(search.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, search]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Scale className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Invoice Reconciliation</h1>
              <p className="text-muted-foreground">Match actual invoices with forecasted costs</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button className="bg-primary" onClick={() => setShowUploadDialog(true)}>
              <Upload className="h-4 w-4 mr-2" />Upload Work Order
            </Button>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4 mr-2" />Filters
            </Button>
            <Button variant="outline"><Download className="h-4 w-4 mr-2" />Export</Button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card>
            <CardContent className="py-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Filters</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}><X className="h-4 w-4" /></Button>
              </div>
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Station</label>
                  <Select value={stationFilter} onValueChange={setStationFilter}>
                    <SelectTrigger><SelectValue placeholder="All Stations" /></SelectTrigger>
                    <SelectContent className="bg-popover z-[9999]">
                      <SelectItem value="all">All Stations</SelectItem>
                      <SelectItem value="DAC">DAC</SelectItem>
                      <SelectItem value="DXB">DXB</SelectItem>
                      <SelectItem value="SIN">SIN</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Reconciliation Status</label>
                  <Select value={reconStatusFilter} onValueChange={setReconStatusFilter}>
                    <SelectTrigger><SelectValue placeholder="All Statuses" /></SelectTrigger>
                    <SelectContent className="bg-popover z-[9999]">
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Matched">Matched</SelectItem>
                      <SelectItem value="Variance">Variance</SelectItem>
                      <SelectItem value="Disputed">Disputed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Invoice No</label>
                  <Input placeholder="Search invoice..." value={invoiceSearch} onChange={e => setInvoiceSearch(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Flight Number</label>
                  <Input placeholder="e.g. BS-101" value={flightSearch} onChange={e => setFlightSearch(e.target.value)} />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button className="bg-primary" onClick={() => toast.success('Filters applied')}>Apply</Button>
                <Button variant="outline" onClick={() => toast.info('Cleared')}>Clear</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Row 1 */}
        <div className="grid grid-cols-4 gap-4">
          <Card><CardContent className="py-4"><div className="text-xs text-muted-foreground">Total Invoices</div><div className="text-2xl font-bold">5</div></CardContent></Card>
          <Card><CardContent className="py-4"><div className="text-xs text-muted-foreground">Matched</div><div className="text-2xl font-bold text-emerald-600">1 <span className="text-sm font-normal">(20%)</span></div></CardContent></Card>
          <Card><CardContent className="py-4"><div className="text-xs text-muted-foreground">Variance Found</div><div className="text-2xl font-bold text-amber-600">2 <span className="text-sm font-normal">(40%)</span></div></CardContent></Card>
          <Card><CardContent className="py-4"><div className="text-xs text-muted-foreground">Disputed</div><div className="text-2xl font-bold text-red-600">1 <span className="text-sm font-normal">(20%)</span></div></CardContent></Card>
        </div>

        {/* Stats Row 2 */}
        <div className="grid grid-cols-4 gap-4">
          <Card><CardContent className="py-4"><div className="text-xs text-muted-foreground">Total Forecasted</div><div className="text-lg font-bold">Mixed Currency</div><div className="text-xs text-muted-foreground">Multiple stations</div></CardContent></Card>
          <Card><CardContent className="py-4"><div className="text-xs text-muted-foreground">Total Invoiced</div><div className="text-lg font-bold">Mixed Currency</div><div className="text-xs text-muted-foreground">Multiple stations</div></CardContent></Card>
          <Card><CardContent className="py-4"><div className="text-xs text-muted-foreground">Net Variance</div><div className="text-lg font-bold text-red-600">+4,166.75</div></CardContent></Card>
          <Card><CardContent className="py-4"><div className="text-xs text-muted-foreground">Variance %</div><div className="text-lg font-bold text-red-600">+4.8%</div></CardContent></Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={cn("pb-2 text-sm font-medium border-b-2 transition-colors", activeTab === tab.key ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground')}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label} <span className="ml-1 text-xs">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Reconciliation Table */}
        <Card>
          <CardContent className="p-0">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold">Reconciliation List</h3>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
              </div>
            </div>
            <TableWithSearch>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="w-10"><Checkbox /></TableHead>
                  <TableHead className="w-8"></TableHead>
                  <TableHead>Flight No</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Station</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Invoice No</TableHead>
                  <TableHead className="text-right">Forecasted</TableHead>
                  <TableHead className="text-right">Invoiced</TableHead>
                  <TableHead className="text-right">Variance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Services</TableHead>
                  <TableHead>Reconciled By</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map(item => (
                  <TableRow key={item.id}>
                    <TableCell><Checkbox /></TableCell>
                    <TableCell><ChevronRight className="h-4 w-4 text-muted-foreground cursor-pointer" /></TableCell>
                    <TableCell className="font-medium text-primary">{item.flightNo}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell><Badge variant="outline" className="font-mono">{item.station}</Badge></TableCell>
                    <TableCell>{item.provider}</TableCell>
                    <TableCell className="text-muted-foreground">{item.invoiceNo}</TableCell>
                    <TableCell className="text-right">{item.forecasted}</TableCell>
                    <TableCell className="text-right">{item.invoiced}</TableCell>
                    <TableCell className="text-right">
                      <div className={cn("font-medium", item.varianceAmt.includes('+') ? 'text-red-600' : item.varianceAmt.includes('-') ? 'text-amber-600' : 'text-emerald-600')}>
                        {item.varianceAmt}
                      </div>
                      <div className="text-xs text-muted-foreground">{item.variancePct}</div>
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell className={cn("font-medium", item.services.split('/')[0] === item.services.split('/')[1] ? 'text-emerald-600' : 'text-amber-600')}>{item.services}</TableCell>
                    <TableCell>{item.reconciledBy}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7"><MessageSquare className="h-3.5 w-3.5" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </TableWithSearch>
            <div className="flex items-center justify-between p-4 border-t text-sm text-muted-foreground">
              <span>Showing 1 to {filteredData.length} of 5</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span>Rows:</span>
                  <Select value={rowsPerPage} onValueChange={setRowsPerPage}>
                    <SelectTrigger className="w-16 h-8"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-popover z-[9999]">
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" disabled>Previous</Button>
                  <Button size="sm" className="bg-primary h-8 w-8 p-0">1</Button>
                  <Button variant="outline" size="sm" disabled>Next</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Work Order Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Upload Work Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              Upload a work order or forecasted costing document to compare with invoices and reconcile differences.
            </p>
            <div className="space-y-1">
              <Label className="font-medium">Compare With</Label>
              <Select defaultValue="workorder">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="bg-popover z-[9999]">
                  <SelectItem value="workorder">Work Order</SelectItem>
                  <SelectItem value="forecasted">Forecasted Costing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="font-medium">Station</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select station" /></SelectTrigger>
                <SelectContent className="bg-popover z-[9999]">
                  <SelectItem value="DAC">DAC - Dhaka</SelectItem>
                  <SelectItem value="DXB">DXB - Dubai</SelectItem>
                  <SelectItem value="SIN">SIN - Singapore</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div
              className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => document.getElementById('work-order-upload')?.click()}
            >
              <FileUp className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
              {uploadedFile ? (
                <div>
                  <p className="font-medium text-foreground">{uploadedFile.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Click to upload or drag & drop</p>
                  <p className="text-xs text-muted-foreground mt-1">PDF, Excel, CSV (max 10MB)</p>
                </div>
              )}
              <input id="work-order-upload" type="file" className="hidden" accept=".pdf,.xlsx,.xls,.csv" onChange={e => setUploadedFile(e.target.files?.[0] || null)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowUploadDialog(false); setUploadedFile(null); }}>Cancel</Button>
            <Button className="bg-primary" onClick={() => {
              if (!uploadedFile) { toast.error('Please upload a file'); return; }
              toast.success('Work order uploaded. Reconciliation comparison will begin.');
              setShowUploadDialog(false);
              setUploadedFile(null);
            }}>Upload & Compare</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
