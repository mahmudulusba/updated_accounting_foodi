import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import {
  Upload, Plus, Download, X, ArrowLeftRight, RotateCcw, FileText,
  Copy, ChevronDown, ChevronUp, Users, CalendarDays, BarChart3, Eye, Check, Replace
} from 'lucide-react';
import { mockStations, mockSuppliers } from '@/lib/groundHandlingData';

const COUNTRIES = ['India', 'Bangladesh', 'Singapore', 'Malaysia', 'Thailand', 'Nepal'];

interface AgreementData {
  country: string;
  station: string;
  supplier: string;
  period: string;
  // auto-populated
  agreementNo: string;
  currency: string;
  currencySymbol: string;
  supplierType: string;
  authority: string;
  manager: string;
  contact: string;
  email: string;
  validFrom: string;
  validTo: string;
  duration: string;
  status: string;
  daysUntilExpiry: number;
  totalServices: number;
  totalRate: number;
  invoiceFrequency: string;
  paymentTerms: string;
  vatRate: string;
  createdBy: string;
  createdOn: string;
  lastModified: string;
}

const MOCK_AGREEMENT_A: AgreementData = {
  country: 'India', station: 'CCU - Netaji Subhas Chandra Bose International',
  supplier: 'AAI Ground Services', period: '01 Jan 2025 - 31 Dec 2025 (Active)',
  agreementNo: 'AGR-2025-CCU-AAI-001', currency: 'INR', currencySymbol: '₹',
  supplierType: 'Airport Authority', authority: 'Airports Authority of India',
  manager: 'Rajesh Kumar', contact: '+91 9876543210', email: 'rajesh@aai.aero',
  validFrom: '01 Jan 2025', validTo: '31 Dec 2025', duration: '365 days (12 months)',
  status: 'Active', daysUntilExpiry: 325, totalServices: 10, totalRate: 5200,
  invoiceFrequency: 'Monthly', paymentTerms: 'Net 30', vatRate: '15%',
  createdBy: 'Admin User', createdOn: '12 Dec 2024', lastModified: '18 Dec 2024',
};

const MOCK_AGREEMENT_B: AgreementData = {
  country: 'Bangladesh', station: 'DAC - Hazrat Shahjalal International',
  supplier: 'Civil Aviation Authority Bangladesh', period: '01 Jan 2025 - 31 Dec 2025 (Active)',
  agreementNo: 'AGR-2025-DAC-CAAB-001', currency: 'BDT', currencySymbol: '৳',
  supplierType: 'Airport Authority', authority: 'Civil Aviation Authority Bangladesh',
  manager: 'Nasreen Akter', contact: '+880 1898765432', email: 'nasreen@caab.gov.bd',
  validFrom: '01 Jan 2025', validTo: '31 Dec 2025', duration: '365 days (12 months)',
  status: 'Active', daysUntilExpiry: 325, totalServices: 10, totalRate: 5200,
  invoiceFrequency: 'Monthly', paymentTerms: 'Net 30', vatRate: '15%',
  createdBy: 'Admin User', createdOn: '12 Dec 2024', lastModified: '18 Dec 2024',
};

const MOCK_SERVICES = [
  { sn: 1, service: 'Landing Charge- B737', rateA: 1200, rateB: 1200 },
  { sn: 2, service: 'Parking Charges', rateA: 400, rateB: 400 },
  { sn: 3, service: 'Navigation Charge', rateA: 800, rateB: 800 },
  { sn: 4, service: 'Aerobridge', rateA: 350, rateB: 350 },
  { sn: 5, service: 'Security Charges', rateA: 250, rateB: 250 },
  { sn: 6, service: 'Passenger Service Charge', rateA: 500, rateB: 500 },
  { sn: 7, service: 'Passenger Security Service Charge', rateA: 300, rateB: 300 },
  { sn: 8, service: 'Passenger Facility Charge', rateA: 200, rateB: 200 },
  { sn: 9, service: 'Air Development Fee (ADF)', rateA: 600, rateB: 600 },
  { sn: 10, service: 'Night-Landing Charges', rateA: 600, rateB: 600 },
];

export default function AgreementComparison() {
  const [panelA, setPanelA] = useState({ country: '', station: '', supplier: '', period: '' });
  const [panelB, setPanelB] = useState({ country: '', station: '', supplier: '', period: '' });
  const [showComparison, setShowComparison] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadTarget, setUploadTarget] = useState<'A' | 'B'>('A');
  const [selectedCurrency, setSelectedCurrency] = useState('Local');
  const [changeFilter, setChangeFilter] = useState('All Changes');
  const [showOnlyDiff, setShowOnlyDiff] = useState(false);
  const [searchServices, setSearchServices] = useState('');
  const [headerOpen, setHeaderOpen] = useState(true);
  const [servicesOpen, setServicesOpen] = useState(true);
  const [financialOpen, setFinancialOpen] = useState(true);

  const isAFilled = panelA.country && panelA.station && panelA.supplier && panelA.period;
  const isBFilled = panelB.country && panelB.station && panelB.supplier && panelB.period;

  const handleCompare = () => {
    if (!isAFilled || !isBFilled) {
      toast.error('Please fill all fields in both panels');
      return;
    }
    setShowComparison(true);
  };

  const handleSwitch = () => {
    const tempA = { ...panelA };
    setPanelA({ ...panelB });
    setPanelB(tempA);
  };

  const handleReset = () => {
    setPanelA({ country: '', station: '', supplier: '', period: '' });
    setPanelB({ country: '', station: '', supplier: '', period: '' });
    setShowComparison(false);
  };

  const handleClear = (panel: 'A' | 'B') => {
    if (panel === 'A') setPanelA({ country: '', station: '', supplier: '', period: '' });
    else setPanelB({ country: '', station: '', supplier: '', period: '' });
    setShowComparison(false);
  };

  const agr = (panel: 'A' | 'B') => panel === 'A' ? MOCK_AGREEMENT_A : MOCK_AGREEMENT_B;

  const subtotalA = MOCK_SERVICES.reduce((s, item) => s + item.rateA, 0);
  const subtotalB = MOCK_SERVICES.reduce((s, item) => s + item.rateB, 0);
  const vatA = subtotalA * 0.15;
  const vatB = subtotalB * 0.15;

  const renderPanel = (side: 'A' | 'B') => {
    const panel = side === 'A' ? panelA : panelB;
    const setPanel = side === 'A' ? setPanelA : setPanelB;
    const filled = side === 'A' ? isAFilled : isBFilled;
    const data = agr(side);

    return (
      <Card className="flex-1">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h3 className="text-lg font-bold">Agreement {side}</h3>
              <p className="text-sm text-muted-foreground">{side === 'A' ? 'Reference Agreement' : 'Comparison Agreement'}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => handleClear(side)}>
              <X className="h-4 w-4 mr-1" /> Clear
            </Button>
          </div>

          <div className="space-y-4 mt-4">
            <div>
              <Label>Country <span className="text-destructive">*</span></Label>
              <Select value={panel.country} onValueChange={v => setPanel({ ...panel, country: v })}>
                <SelectTrigger><SelectValue placeholder="Select Country" /></SelectTrigger>
                <SelectContent className="bg-popover z-[9999]">
                  {COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Station <span className="text-destructive">*</span></Label>
              <Select value={panel.station} onValueChange={v => setPanel({ ...panel, station: v })}>
                <SelectTrigger><SelectValue placeholder="Select Station" /></SelectTrigger>
                <SelectContent className="bg-popover z-[9999]">
                  {mockStations.map(s => <SelectItem key={s.id} value={`${s.iataCode} - ${s.name}`}>{s.iataCode} - {s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Supplier Name <span className="text-destructive">*</span></Label>
              <Select value={panel.supplier} onValueChange={v => setPanel({ ...panel, supplier: v })}>
                <SelectTrigger><SelectValue placeholder="Select Supplier" /></SelectTrigger>
                <SelectContent className="bg-popover z-[9999]">
                  {mockSuppliers.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Agreement Period <span className="text-destructive">*</span></Label>
              <Select value={panel.period} onValueChange={v => setPanel({ ...panel, period: v })}>
                <SelectTrigger><SelectValue placeholder="Select Agreement Period" /></SelectTrigger>
                <SelectContent className="bg-popover z-[9999]">
                  <SelectItem value="01 Jan 2025 - 31 Dec 2025 (Active)">01 Jan 2025 - 31 Dec 2025 (Active)</SelectItem>
                  <SelectItem value="01 Jan 2024 - 31 Dec 2024 (Expired)">01 Jan 2024 - 31 Dec 2024 (Expired)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Auto-populated fields */}
          {filled && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>🔒</span> AUTO-POPULATED FIELDS (READ-ONLY)
              </div>
              <div className="flex gap-4">
                <div className="flex-1 border rounded-lg p-3 bg-muted/30">
                  <p className="text-xs text-destructive">Agreement Number</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-sm font-semibold">{data.agreementNo}</p>
                    <Copy className="h-3.5 w-3.5 text-muted-foreground cursor-pointer" />
                  </div>
                </div>
                <div className="border rounded-lg p-3 bg-muted/30">
                  <p className="text-xs text-destructive">Currency</p>
                  <p className="font-semibold text-sm">{data.currency} ({data.currencySymbol})</p>
                </div>
              </div>

              {/* Supplier Information */}
              <CollapsibleSection title="Supplier Information" icon={<Users className="h-4 w-4" />}>
                <InfoRow label="Supplier Type" value={<Badge variant="outline">{data.supplierType}</Badge>} />
                <InfoRow label="Authority" value={data.authority} />
                <InfoRow label="Manager" value={data.manager} />
                <InfoRow label="Contact" value={<span>📞 {data.contact}</span>} />
                <InfoRow label="Email" value={<span>✉ {data.email}</span>} />
              </CollapsibleSection>

              {/* Agreement Validity */}
              <CollapsibleSection title="Agreement Validity" icon={<CalendarDays className="h-4 w-4" />}>
                <InfoRow label="Valid From" value={data.validFrom} />
                <InfoRow label="Valid To" value={data.validTo} />
                <InfoRow label="Duration" value={data.duration} />
                <InfoRow label="Status" value={<Badge className="bg-success text-success-foreground">✓ {data.status}</Badge>} />
                <InfoRow label="Days Until Expiry" value={<span className="text-success font-semibold">{data.daysUntilExpiry} days</span>} />
              </CollapsibleSection>

              {/* Agreement Statistics */}
              <CollapsibleSection title="Agreement Statistics" icon={<BarChart3 className="h-4 w-4" />}>
                <InfoRow label="Total Services" value={data.totalServices} />
                <InfoRow label="Total Rate (Per Flight)" value={`${data.currencySymbol}${data.totalRate.toLocaleString()}`} />
                <InfoRow label="Invoice Frequency" value={data.invoiceFrequency} />
                <InfoRow label="Payment Terms" value={data.paymentTerms} />
                <InfoRow label="VAT Rate" value={data.vatRate} />
                <div className="border-t pt-2 mt-2 space-y-1">
                  <InfoRow label="Created By" value={data.createdBy} />
                  <InfoRow label="Created On" value={data.createdOn} />
                  <InfoRow label="Last Modified" value={data.lastModified} />
                </div>
              </CollapsibleSection>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" size="sm"><Eye className="h-4 w-4 mr-1" /> View Full Agreement</Button>
                <Button variant="outline" className="flex-1" size="sm"><FileText className="h-4 w-4 mr-1" /> View Rate Card</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Agreements / Agreement Comparison</p>
            <h1 className="text-2xl font-bold">Station Agreement Comparison</h1>
            <p className="text-muted-foreground">Compare existing agreements to identify changes in rates, terms, and conditions</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowUploadDialog(true)}>
              <Upload className="h-4 w-4 mr-2" /> Upload Agreement
            </Button>
            <Button className="bg-primary">
              <Plus className="h-4 w-4 mr-2" /> Add New Agreement
            </Button>
            <Button variant="ghost"><Download className="h-4 w-4 mr-2" /> Export</Button>
          </div>
        </div>

        {/* Two-panel comparison */}
        <div className="flex gap-4 items-start">
          {renderPanel('A')}

          {/* Center action buttons */}
          <div className="flex flex-col items-center gap-3 pt-32">
            <Button className="bg-primary px-6" onClick={handleCompare} disabled={!isAFilled || !isBFilled}>
              <Replace className="h-4 w-4 mr-2" /> Compare
            </Button>
            <Button variant="outline" size="sm" onClick={handleSwitch}>
              <ArrowLeftRight className="h-4 w-4 mr-1" /> Switch
            </Button>
            <Button variant="outline" size="sm" className="text-destructive" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-1" /> Reset
            </Button>
          </div>

          {renderPanel('B')}
        </div>

        {/* Comparison Results */}
        {showComparison && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Comparison Results</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" /> Export</Button>
                  <Button variant="ghost" size="icon" onClick={() => setShowComparison(false)}><X className="h-4 w-4" /></Button>
                </div>
              </div>

              {/* Currency selector */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-muted-foreground">$ Currency:</span>
                {['Local', 'USD', 'BDT'].map(c => (
                  <Button key={c} variant={selectedCurrency === c ? 'default' : 'outline'} size="sm"
                    className={selectedCurrency === c ? 'bg-primary text-primary-foreground' : ''}
                    onClick={() => setSelectedCurrency(c)}>
                    {c === 'Local' ? `Local (${MOCK_AGREEMENT_A.currency})` : `+ ${c}`}
                  </Button>
                ))}
              </div>

              {/* Summary stats */}
              <div className="grid grid-cols-5 gap-4 mb-4">
                {[
                  { label: 'Total Services', value: '10', color: 'text-foreground', bg: 'bg-primary/5 border-primary/20' },
                  { label: 'Increased', value: '0', color: 'text-destructive', bg: 'bg-destructive/5 border-destructive/20' },
                  { label: 'Decreased', value: '0', color: 'text-success', bg: 'bg-success/5 border-success/20' },
                  { label: 'New', value: '0', color: 'text-primary', bg: 'bg-primary/5 border-primary/20' },
                  { label: 'Removed', value: '0', color: 'text-destructive', bg: 'bg-destructive/5 border-destructive/20' },
                ].map(stat => (
                  <div key={stat.label} className={`rounded-lg border p-4 text-center ${stat.bg}`}>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>

              <p className="text-sm font-semibold text-success mb-4">
                Total Impact: <span className="text-success">₹0.00/flight (0.0%)</span>
              </p>

              {/* Filters */}
              <div className="flex items-center gap-4 mb-6">
                <Select value={changeFilter} onValueChange={setChangeFilter}>
                  <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover z-[9999]">
                    <SelectItem value="All Changes">All Changes</SelectItem>
                    <SelectItem value="Increased">Increased</SelectItem>
                    <SelectItem value="Decreased">Decreased</SelectItem>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Removed">Removed</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative flex-1 max-w-xs">
                  <Input placeholder="Search services..." value={searchServices} onChange={e => setSearchServices(e.target.value)} />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="showDiff" checked={showOnlyDiff} onCheckedChange={v => setShowOnlyDiff(!!v)} />
                  <Label htmlFor="showDiff" className="text-sm">Show only differences</Label>
                </div>
              </div>

              {/* Agreement Header comparison */}
              <CollapsibleSection title="Agreement Header" defaultOpen={headerOpen} onToggle={setHeaderOpen}>
                <TableWithSearch>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="w-48">Field</TableHead>
                      <TableHead>Agreement A</TableHead>
                      <TableHead>Agreement B</TableHead>
                      <TableHead className="w-20 text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { field: 'Agreement No.', a: MOCK_AGREEMENT_A.agreementNo, b: MOCK_AGREEMENT_B.agreementNo, diff: true },
                      { field: 'Currency', a: MOCK_AGREEMENT_A.currency, b: MOCK_AGREEMENT_B.currency, diff: true },
                      { field: 'Supplier Type', a: MOCK_AGREEMENT_A.supplierType, b: MOCK_AGREEMENT_B.supplierType, diff: false },
                      { field: 'Manager', a: MOCK_AGREEMENT_A.manager, b: MOCK_AGREEMENT_B.manager, diff: true },
                      { field: 'Valid From', a: MOCK_AGREEMENT_A.validFrom, b: MOCK_AGREEMENT_B.validFrom, diff: false },
                      { field: 'Valid To', a: MOCK_AGREEMENT_A.validTo, b: MOCK_AGREEMENT_B.validTo, diff: false },
                      { field: 'Duration', a: '365 days', b: '365 days', diff: false },
                      { field: 'Payment Terms', a: MOCK_AGREEMENT_A.paymentTerms, b: MOCK_AGREEMENT_B.paymentTerms, diff: false },
                      { field: 'Invoice Frequency', a: MOCK_AGREEMENT_A.invoiceFrequency, b: MOCK_AGREEMENT_B.invoiceFrequency, diff: false },
                      { field: 'VAT Rate', a: MOCK_AGREEMENT_A.vatRate, b: MOCK_AGREEMENT_B.vatRate, diff: false },
                    ].map(row => (
                      <TableRow key={row.field} className={row.diff ? 'bg-warning/5' : ''}>
                        <TableCell className="text-primary font-medium">{row.field}</TableCell>
                        <TableCell>{row.a}</TableCell>
                        <TableCell>{row.b}</TableCell>
                        <TableCell className="text-right">
                          {row.diff ? <span className="text-primary">🔀</span> : <span className="text-success">✓</span>}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </TableWithSearch>
              </CollapsibleSection>

              {/* Services & Rates */}
              <CollapsibleSection title="Services & Rates" badge={`${MOCK_SERVICES.length} items`} defaultOpen={servicesOpen} onToggle={setServicesOpen}>
                <TableWithSearch>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="w-12">S/N</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead className="text-right">Agr A ({MOCK_AGREEMENT_A.currency})</TableHead>
                      <TableHead className="text-right">Agr B ({MOCK_AGREEMENT_B.currency})</TableHead>
                      <TableHead className="text-right">Diff</TableHead>
                      <TableHead className="text-right">% Δ</TableHead>
                      <TableHead className="text-right">Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_SERVICES.map(s => (
                      <TableRow key={s.sn}>
                        <TableCell>{s.sn}</TableCell>
                        <TableCell className="text-primary font-medium">{s.service}</TableCell>
                        <TableCell className="text-right font-mono">{s.rateA.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-mono">{s.rateB.toFixed(2)}</TableCell>
                        <TableCell className="text-right">–</TableCell>
                        <TableCell className="text-right">–</TableCell>
                        <TableCell className="text-right text-success">✓ No Change</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </TableWithSearch>
              </CollapsibleSection>

              {/* Financial Summary */}
              <CollapsibleSection title="Financial Summary" defaultOpen={financialOpen} onToggle={setFinancialOpen}>
                <TableWithSearch>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead></TableHead>
                      <TableHead className="text-right">Agreement A</TableHead>
                      <TableHead className="text-right">Agreement B</TableHead>
                      <TableHead className="text-right">Difference</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-primary">Subtotal</TableCell>
                      <TableCell className="text-right font-mono">₹{subtotalA.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-mono">₹{subtotalB.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-mono text-success">₹{(subtotalA - subtotalB).toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-primary">Total VAT</TableCell>
                      <TableCell className="text-right font-mono">₹{vatA.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-mono">₹{vatB.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-mono text-success">₹{(vatA - vatB).toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow className="font-bold">
                      <TableCell>Grand Total</TableCell>
                      <TableCell className="text-right font-mono">₹{(subtotalA + vatA).toFixed(2)}</TableCell>
                      <TableCell className="text-right font-mono">₹{(subtotalB + vatB).toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <span className="font-mono text-success">₹{((subtotalA + vatA) - (subtotalB + vatB)).toFixed(2)}</span>
                        <p className="text-xs text-muted-foreground">(0.0%)</p>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </TableWithSearch>
              </CollapsibleSection>

              {/* Footer actions */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <Button variant="outline"><FileText className="h-4 w-4 mr-1" /> Save Comparison</Button>
                <Button variant="outline"><Download className="h-4 w-4 mr-1" /> Export Report</Button>
                <Button className="bg-primary" onClick={handleReset}><RotateCcw className="h-4 w-4 mr-1" /> New Comparison</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upload Agreement Dialog */}
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><Upload className="h-5 w-5" /> Upload Agreement for Comparison</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Label className="font-semibold">Select Target Panel:</Label>
                <RadioGroup value={uploadTarget} onValueChange={v => setUploadTarget(v as 'A' | 'B')} className="flex gap-6 mt-2">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="A" id="panelA" />
                    <Label htmlFor="panelA">Agreement A</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="B" id="panelB" />
                    <Label htmlFor="panelB">Agreement B</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="font-medium">Drag & drop PDF here or click to upload</p>
                <p className="text-sm text-muted-foreground mt-1">Supported: PDF, JPG, PNG (Max 10MB)</p>
              </div>
              <div className="text-center text-sm text-muted-foreground">OR</div>
              <div>
                <Label>Upload Scanned Images:</Label>
                <Input type="file" accept=".jpg,.jpeg,.png" multiple className="mt-1" />
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Check className="h-3 w-3" /> Multiple images accepted
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowUploadDialog(false)}>Cancel</Button>
              <Button className="bg-primary" onClick={() => { setShowUploadDialog(false); toast.success('Agreement uploaded'); }}>Save & Compare</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

/* Helper components */
function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-right">{value}</span>
    </div>
  );
}

function CollapsibleSection({ title, icon, badge, children, defaultOpen = true, onToggle }: {
  title: string; icon?: React.ReactNode; badge?: string; children: React.ReactNode;
  defaultOpen?: boolean; onToggle?: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border rounded-lg mb-4">
      <button className="w-full flex items-center justify-between p-3 hover:bg-muted/30 transition-colors"
        onClick={() => { setOpen(!open); onToggle?.(!open); }}>
        <div className="flex items-center gap-2 font-semibold text-sm">
          {icon} {title}
        </div>
        <div className="flex items-center gap-2">
          {badge && <span className="text-xs text-muted-foreground">{badge}</span>}
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>
      {open && <div className="px-4 pb-3">{children}</div>}
    </div>
  );
}
