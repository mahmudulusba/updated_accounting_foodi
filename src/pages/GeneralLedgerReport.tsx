import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, FileSpreadsheet, FileText, Settings, Search, X, Filter, Eye, ChevronUp, ChevronDown } from 'lucide-react';
import ReportCurrencySelector, { CurrencyType, getCurrencyLabel, formatAmount } from '@/components/ReportCurrencySelector';
import { useBranchFilter } from '@/components/ReportBranchFilter';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp, GLEntry } from '@/contexts/AppContext';
import { GLSearchDialog } from '@/components/GLSearchDialog';

interface GLRow {
  id: string;
  documentDate: string;
  documentNo: string;
  reconGL: string;
  particular: string;
  documentType: string;
  referenceNo: string;
  drAmount: number;
  crAmount: number;
  currentBalance: number;
  cumulativeBalance: number;
  balanceType: 'Dr' | 'Cr';
}

const sampleRows: GLRow[] = [
  { id: 'opening', documentDate: '01 Apr 2026', documentNo: '', reconGL: '', particular: 'Opening Balance', documentType: '', referenceNo: '', drAmount: 0, crAmount: 0, currentBalance: 0, cumulativeBalance: 57500, balanceType: 'Cr' },
  { id: '1', documentDate: '01 Apr 2026', documentNo: 'BP-25-26-14005029', reconGL: 'Brac Bank A/C: 2052735250001(11102002)', particular: 'Brac Bank A/C: 2052735250001(2052735250001)', documentType: 'Bank Payment (BP)', referenceNo: 'S49606478', drAmount: 57500, crAmount: 0, currentBalance: 57500, cumulativeBalance: 0, balanceType: 'Dr' },
];

const GeneralLedgerReport = () => {
  const { glEntries } = useApp();
  const { isMultipleBranchesSelected, effectiveBaseCurrencyCode } = useBranchFilter();
  const baseCurrencyCode = effectiveBaseCurrencyCode;

  const [activeTab, setActiveTab] = useState<'general' | 'supplier' | 'customer'>('general');
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(true);
  const [showReport, setShowReport] = useState(true);

  const [fromDate, setFromDate] = useState<Date>(new Date(2026, 3, 1));
  const [toDate, setToDate] = useState<Date>(new Date(2026, 3, 29));
  const [referenceNumber, setReferenceNumber] = useState('');
  const [remarks, setRemarks] = useState('');

  const [selectedGL, setSelectedGL] = useState<GLEntry | null>(null);
  const [glSearchOpen, setGlSearchOpen] = useState(false);
  const [documentType, setDocumentType] = useState('all');
  const [accountType, setAccountType] = useState('');
  const [oppositeGL, setOppositeGL] = useState('');

  const [sbu, setSbu] = useState('');
  const [city, setCity] = useState('');
  const [hub, setHub] = useState('');
  const [department, setDepartment] = useState('');

  const [currency] = useState<CurrencyType>('base');
  const [searchTerm, setSearchTerm] = useState('');
  const currencyLabel = getCurrencyLabel(currency, baseCurrencyCode);

  const fmt = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const filteredRows = sampleRows.filter(r =>
    !searchTerm ||
    r.particular.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.documentNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.referenceNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const subTotalDr = filteredRows.reduce((s, r) => s + r.drAmount, 0);
  const subTotalCr = filteredRows.reduce((s, r) => s + r.crAmount, 0);
  const subTotalBal = subTotalDr - subTotalCr;

  const partyLabel = activeTab === 'supplier' ? 'Supplier' : activeTab === 'customer' ? 'Customer' : null;

  const clearFilters = () => {
    setSelectedGL(null);
    setReferenceNumber('');
    setRemarks('');
    setDocumentType('all');
    setAccountType('');
    setOppositeGL('');
    setSbu(''); setCity(''); setHub(''); setDepartment('');
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-4">
        <div className="text-sm">
          <span className="text-primary font-medium">Reports</span>
          <span className="text-muted-foreground"> / General Ledger Report</span>
        </div>

        {/* Filters Card */}
        <Card>
          <CardHeader className="border-b py-3 cursor-pointer flex flex-row items-center justify-between" onClick={() => setFiltersOpen(!filtersOpen)}>
            <CardTitle className="text-base">General Ledger Report Filters</CardTitle>
            {filtersOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CardHeader>
          {filtersOpen && (
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
                <TabsList className="rounded-none border-b w-full justify-start bg-transparent h-auto p-0">
                  <TabsTrigger value="general" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-primary/10 data-[state=active]:shadow-none px-6 py-3">General Ledger</TabsTrigger>
                  <TabsTrigger value="supplier" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-primary/10 data-[state=active]:shadow-none px-6 py-3">Supplier Ledger</TabsTrigger>
                  <TabsTrigger value="customer" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-primary/10 data-[state=active]:shadow-none px-6 py-3">Customer Ledger</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                {/* Column 1: Date Range & Reference */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Date Range & Reference</h3>
                  <div className="space-y-2">
                    <label className="text-sm">From Date <span className="text-red-500">*</span></label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-between font-normal">
                          {format(fromDate, "dd MMM yyyy")}
                          <CalendarIcon className="h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={fromDate} onSelect={(d) => d && setFromDate(d)} initialFocus className="pointer-events-auto" />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">To Date <span className="text-red-500">*</span></label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-between font-normal">
                          {format(toDate, "dd MMM yyyy")}
                          <CalendarIcon className="h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={toDate} onSelect={(d) => d && setToDate(d)} initialFocus className="pointer-events-auto" />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Reference Number</label>
                    <Input value={referenceNumber} onChange={(e) => setReferenceNumber(e.target.value)} placeholder="Enter reference number" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Remarks</label>
                    <Input value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Enter remarks" />
                  </div>
                </div>

                {/* Column 2: GL Details / Party Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">{partyLabel ? `${partyLabel} Details` : 'GL Details'}</h3>
                  <div className="space-y-2">
                    <label className="text-sm">
                      {partyLabel ? `${partyLabel} Code & Name` : 'Account Number & Name'} <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={selectedGL ? `(${selectedGL.glCode}) ${selectedGL.glName}` : ''}
                        readOnly
                        placeholder={partyLabel ? `Select ${partyLabel}` : 'Select Account'}
                        className="flex-1"
                      />
                      {selectedGL ? (
                        <Button variant="outline" size="icon" onClick={() => setSelectedGL(null)}><X className="h-4 w-4" /></Button>
                      ) : (
                        <Button variant="outline" size="icon" onClick={() => setGlSearchOpen(true)}><Search className="h-4 w-4" /></Button>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Document Type <span className="text-red-500">*</span></label>
                    <Select value={documentType} onValueChange={setDocumentType}>
                      <SelectTrigger><SelectValue placeholder="--- Select ---" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All are selected</SelectItem>
                        <SelectItem value="jv">Journal Voucher</SelectItem>
                        <SelectItem value="rv">Receipt Voucher</SelectItem>
                        <SelectItem value="pv">Payment Voucher</SelectItem>
                        <SelectItem value="bp">Bank Payment</SelectItem>
                        <SelectItem value="br">Bank Receipt</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Account Type</label>
                    <Select value={accountType} onValueChange={setAccountType}>
                      <SelectTrigger><SelectValue placeholder="--- Select ---" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asset">Asset</SelectItem>
                        <SelectItem value="liability">Liability</SelectItem>
                        <SelectItem value="equity">Equity</SelectItem>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Opposite GL / Sub GL</label>
                    <Select value={oppositeGL} onValueChange={setOppositeGL}>
                      <SelectTrigger><SelectValue placeholder="Select one or more" /></SelectTrigger>
                      <SelectContent>
                        {glEntries.slice(0, 10).map(gl => (
                          <SelectItem key={gl.id} value={gl.id}>{gl.glCode} - {gl.glName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Column 3: Other Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Other Information</h3>
                  <div className="space-y-2">
                    <label className="text-sm">SBU</label>
                    <Select value={sbu} onValueChange={setSbu}>
                      <SelectTrigger><SelectValue placeholder="--- Select ---" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="retail">Retail Operations</SelectItem>
                        <SelectItem value="cargo">Cargo</SelectItem>
                        <SelectItem value="ground">Ground Handling</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">City</label>
                    <Select value={city} onValueChange={setCity}>
                      <SelectTrigger><SelectValue placeholder="--- Select ---" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dhk">Dhaka</SelectItem>
                        <SelectItem value="ctg">Chittagong</SelectItem>
                        <SelectItem value="syl">Sylhet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Hub</label>
                    <Select value={hub} onValueChange={setHub}>
                      <SelectTrigger><SelectValue placeholder="--- Select ---" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dac">DAC Hub</SelectItem>
                        <SelectItem value="cgp">CGP Hub</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Department</label>
                    <Select value={department} onValueChange={setDepartment}>
                      <SelectTrigger><SelectValue placeholder="--- Select ---" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="ops">Operations</SelectItem>
                        <SelectItem value="hr">Human Resources</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-3 pb-6">
                <Button variant="destructive" className="bg-red-500 hover:bg-red-600 px-8" onClick={clearFilters}>Clear</Button>
                <Button className="bg-primary hover:bg-primary/90 px-8" onClick={() => setShowReport(true)}>Preview</Button>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Preview Card */}
        <Card>
          <CardHeader className="border-b py-3 cursor-pointer flex flex-row items-center justify-between" onClick={() => setPreviewOpen(!previewOpen)}>
            <CardTitle className="text-base">General Ledger Report Preview</CardTitle>
            {previewOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CardHeader>
          {previewOpen && (
            <CardContent className="p-6 space-y-4">
              {!showReport ? (
                <div className="text-center py-12 text-muted-foreground">Click "Preview" to view the report</div>
              ) : (
                <>
                  <div className="flex justify-end gap-2">
                    <Button size="icon" className="bg-primary hover:bg-primary/90"><Printer className="h-4 w-4" /></Button>
                    <Button size="icon" className="bg-red-500 hover:bg-red-600"><FileText className="h-4 w-4" /></Button>
                    <Button size="icon" className="bg-primary hover:bg-primary/90"><FileSpreadsheet className="h-4 w-4" /></Button>
                  </div>

                  <div className="border rounded-lg p-4 space-y-3">
                    <h2 className="text-center text-lg font-semibold">General Ledger Report Details</h2>
                    <div className="grid grid-cols-3 text-sm">
                      <div>Account No: <span className="font-medium">{selectedGL?.glCode || '21104047'}</span></div>
                      <div className="text-center">Account Name: <span className="font-medium">{selectedGL?.glName || 'Audit Fee Payable'}</span></div>
                      <div className="text-right">Date Range: <span className="font-medium">{format(fromDate, 'dd MMM yyyy')} - {format(toDate, 'dd MMM yyyy')}</span></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button size="icon" className="bg-primary hover:bg-primary/90"><Settings className="h-4 w-4" /></Button>
                        <Button size="icon" className="bg-primary hover:bg-primary/90"><Filter className="h-4 w-4" /></Button>
                      </div>
                      <Input
                        placeholder="Search all columns..."
                        className="max-w-xs"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    <div className="border rounded overflow-x-auto">
                      <TableWithSearch>
                        <TableHeader>
                          <TableRow className="bg-table-header hover:bg-table-header">
                            <TableHead className="text-table-header-foreground font-bold">SL</TableHead>
                            <TableHead className="text-table-header-foreground font-bold">Document Date</TableHead>
                            <TableHead className="text-table-header-foreground font-bold">Document No.</TableHead>
                            <TableHead className="text-table-header-foreground font-bold">Recon GL</TableHead>
                            <TableHead className="text-table-header-foreground font-bold">Particular</TableHead>
                            <TableHead className="text-table-header-foreground font-bold">Document Type</TableHead>
                            <TableHead className="text-table-header-foreground font-bold">Reference Number</TableHead>
                            <TableHead className="text-table-header-foreground font-bold text-right">Dr. Amount</TableHead>
                            <TableHead className="text-table-header-foreground font-bold text-right">Cr. Amount</TableHead>
                            <TableHead className="text-table-header-foreground font-bold text-right">Current Balance</TableHead>
                            <TableHead className="text-table-header-foreground font-bold text-right">Cumulative Balance</TableHead>
                            <TableHead className="text-table-header-foreground font-bold">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredRows.map((r, idx) => (
                            <TableRow key={r.id}>
                              <TableCell>{idx + 1}</TableCell>
                              <TableCell>{r.documentDate}</TableCell>
                              <TableCell>{r.documentNo}</TableCell>
                              <TableCell className="text-xs">{r.reconGL}</TableCell>
                              <TableCell className="text-xs">{r.particular}</TableCell>
                              <TableCell>{r.documentType}</TableCell>
                              <TableCell>{r.referenceNo}</TableCell>
                              <TableCell className="text-right">{fmt(r.drAmount)}</TableCell>
                              <TableCell className="text-right">{fmt(r.crAmount)}</TableCell>
                              <TableCell className="text-right">{r.currentBalance > 0 ? `${fmt(r.currentBalance)} ${r.balanceType}.` : fmt(r.currentBalance)}</TableCell>
                              <TableCell className="text-right">{r.cumulativeBalance > 0 ? `${fmt(r.cumulativeBalance)} ${r.balanceType}.` : fmt(r.cumulativeBalance)}</TableCell>
                              <TableCell>
                                {r.id !== 'opening' && (
                                  <Button size="icon" variant="ghost" className="h-7 w-7 bg-primary hover:bg-primary/90 text-white">
                                    <Eye className="h-3.5 w-3.5" />
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow className="bg-muted/50 font-semibold">
                            <TableCell colSpan={7} className="text-right">Sub Total:</TableCell>
                            <TableCell className="text-right">{fmt(subTotalDr)}</TableCell>
                            <TableCell className="text-right">{fmt(subTotalCr)}</TableCell>
                            <TableCell className="text-right">{fmt(Math.abs(subTotalBal))} {subTotalBal >= 0 ? 'Dr' : 'Cr'}.</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                          <TableRow className="bg-muted/50 font-semibold">
                            <TableCell colSpan={7} className="text-right">Grand Total:</TableCell>
                            <TableCell className="text-right">{fmt(subTotalDr)}</TableCell>
                            <TableCell className="text-right">{fmt(subTotalCr)}</TableCell>
                            <TableCell className="text-right">{fmt(Math.abs(subTotalBal))} {subTotalBal >= 0 ? 'Dr' : 'Cr'}.</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        </TableBody>
                      </TableWithSearch>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          )}
        </Card>
      </div>

      <GLSearchDialog
        open={glSearchOpen}
        onOpenChange={setGlSearchOpen}
        glEntries={glEntries}
        onSelect={(entry) => setSelectedGL(entry)}
      />
    </DashboardLayout>
  );
};

export default GeneralLedgerReport;
