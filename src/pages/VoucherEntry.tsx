import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useApp } from '@/contexts/AppContext';
import { useAccountingMode } from '@/contexts/AccountingModeContext';
import { useCanCreateVoucher, useHasTaxEntryPermission } from '@/hooks/useAccountingFilter';
import { usePeriodLock } from '@/hooks/usePeriodLock';
import { GLSearchDialog } from '@/components/GLSearchDialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Info, FileWarning, Lock, Search, Plus, Minus, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription,
  AlertDialogFooter, AlertDialogAction, AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  mockPointsOfSale, PointOfSale,
} from '@/lib/ticketSalesData';
import { mockAirportStations } from '@/lib/ticketSalesData';
import { defaultPartyTypes, defaultParties } from '@/pages/PartyTypeSetup';
import { defaultSubGLMappings } from '@/pages/SubGLSetup';

// Remove TSV from document types
const documentTypes = [
  { value: 'JE', label: 'Journal Entry (JE)' },
  { value: 'BP', label: 'Bank Payment (BP)' },
  { value: 'BR', label: 'Bank Receipt (BR)' },
  { value: 'CP', label: 'Cash Payment (CP)' },
  { value: 'CR', label: 'Cash Receipt (CR)' },
  { value: 'KR', label: 'Vendor Invoice (KR)' },
];

const currencySymbols: Record<string, string> = {
  BDT: '৳', USD: '$', SGD: 'S$', INR: '₹', EUR: '€', GBP: '£',
};

interface VoucherLine {
  id: string;
  accountNumber: string;
  accountName: string;
  drAmount: string;
  crAmount: string;
  posId: string;
  airportStationId: string;
  remarks: string;
  tAccServer: boolean;
  excludeFromTax: boolean;
}

// Build SubGL display name like "Adv.-Employee-Mahmudul"
function buildSubGLOptions() {
  return defaultSubGLMappings
    .filter(m => m.status === 'active')
    .map(m => {
      const party = defaultParties.find(p => p.id === m.partyId);
      const partyType = defaultPartyTypes.find(pt => pt.id === m.partyTypeId);
      // Build display: "GLName-PartyType-PartyName" like "Adv.-Employee-Mahmudul"
      return m.assignedGLCodes.map((glCode, idx) => ({
        subGLId: m.id,
        glCode,
        glName: m.assignedGLNames[idx] || '',
        partyName: party?.name || m.partyName,
        partyTypeName: partyType?.name || m.partyTypeName,
        displayName: `${m.assignedGLNames[idx]?.split(' ')[0] || ''}-${partyType?.name || m.partyTypeName}-${(party?.name || m.partyName).split(' ')[0]}`,
        fullDisplayName: `${m.assignedGLNames[idx]}-${m.partyTypeName}-${m.partyName}`,
      }));
    })
    .flat();
}

export default function VoucherEntry() {
  const { selectedBranch, glEntries, glVoucherTypeMappings, currencyRates } = useApp();
  const { isTaxMode } = useAccountingMode();
  const canCreateVoucher = useCanCreateVoucher();
  const hasTaxEntryPermission = useHasTaxEntryPermission();
  const { canCreateVoucherForDate } = usePeriodLock();
  const today = new Date();
  const isConsolidated = selectedBranch?.isConsolidated === true;

  const [isGLSearchOpen, setIsGLSearchOpen] = useState(false);
  const [activeLineId, setActiveLineId] = useState<string | null>(null);
  const [showTaxExclusionDialog, setShowTaxExclusionDialog] = useState(false);

  const currentBranchRate = useMemo(() => {
    if (!selectedBranch) return null;
    return currencyRates.find(r => r.branchCode === selectedBranch.code);
  }, [selectedBranch, currencyRates]);

  const baseCurrency = selectedBranch?.baseCurrency || 'BDT';

  // POS and Airport data from modules
  const availablePOS = useMemo(() => {
    if (!selectedBranch) return [];
    return mockPointsOfSale.filter(pos => pos.branchId === selectedBranch.id && pos.status === 'active');
  }, [selectedBranch]);

  const availableAirports = useMemo(() => {
    if (!selectedBranch) return [];
    return mockAirportStations.filter(a => a.branchId === selectedBranch.id && a.status === 'active');
  }, [selectedBranch]);

  const subGLOptions = useMemo(() => buildSubGLOptions(), []);

  const getAvailableLedgers = (docType: string) => {
    const mappedGLCodes = glVoucherTypeMappings
      .filter(m => m.voucherType === docType && m.status === 'active')
      .map(m => m.glCode);
    if (mappedGLCodes.length === 0) return [];
    return glEntries
      .filter(e => mappedGLCodes.includes(e.glCode) && e.status === 'active')
      .map(e => ({ code: e.glCode, name: e.glName, tAccServer: true }));
  };

  const [formData, setFormData] = useState({
    documentType: 'KR',
    documentNumber: 'Auto Generated',
    documentDate: format(today, 'yyyy-MM-dd'),
    poNumber: '',
    referenceNumber: '',
    exchangeRateType: 'bank' as 'iata' | 'bank',
  });

  const isFunctionalBDT = baseCurrency === 'BDT';

  // Exchange rates: USD to functional currency
  const [conversionRates, setConversionRates] = useState({
    usdToBase: currentBranchRate?.rateToBDT || (baseCurrency === 'USD' ? 1 : baseCurrency === 'BDT' ? 122.00 : baseCurrency === 'INR' ? 83.50 : baseCurrency === 'SGD' ? 1.34 : 110.50),
    baseToUsd: currentBranchRate?.rateToUSD || (baseCurrency === 'USD' ? 1 : 0.009),
  });

  // BDT conversion rates (for non-BDT branches)
  const [bdtRates, setBdtRates] = useState({
    usdToBDT: 122.00,
    bdtToUsd: parseFloat((1 / 122.00).toFixed(6)),
  });

  const [lines, setLines] = useState<VoucherLine[]>([
    { id: '1', accountNumber: '', accountName: '', drAmount: '', crAmount: '', posId: '', airportStationId: '', remarks: '', tAccServer: true, excludeFromTax: false },
    { id: '2', accountNumber: '', accountName: '', drAmount: '', crAmount: '', posId: '', airportStationId: '', remarks: '', tAccServer: true, excludeFromTax: false },
  ]);

  const [narration, setNarration] = useState('');

  const addLine = () => {
    setLines([...lines, {
      id: Date.now().toString(), accountNumber: '', accountName: '', drAmount: '', crAmount: '', posId: '', airportStationId: '', remarks: '', tAccServer: true, excludeFromTax: false,
    }]);
  };

  const removeLine = (id: string) => {
    if (lines.length > 2) setLines(lines.filter(l => l.id !== id));
  };

  const updateLine = (id: string, field: keyof VoucherLine, value: string | boolean) => {
    setLines(lines.map(line => {
      if (line.id === id) {
        const updated = { ...line };
        if (field === 'excludeFromTax') {
          updated.excludeFromTax = value === 'true' || value === true;
        } else {
          (updated as any)[field] = value;
        }
        if (field === 'accountNumber') {
          const avail = getAvailableLedgers(formData.documentType);
          const ledger = avail.find(l => l.code === value);
          if (ledger) { updated.accountName = ledger.name; updated.tAccServer = ledger.tAccServer; }
          else { updated.accountName = ''; updated.tAccServer = true; }
        }
        return updated;
      }
      return line;
    }));
  };

  const handleGLSelect = (entry: { glCode: string; glName: string }) => {
    if (activeLineId) {
      setLines(lines.map(line =>
        line.id === activeLineId
          ? { ...line, accountNumber: entry.glCode, accountName: entry.glName, tAccServer: true }
          : line
      ));
      setActiveLineId(null);
    }
  };

  const openGLSearch = (lineId: string) => { setActiveLineId(lineId); setIsGLSearchOpen(true); };

  const availableLedgersForDocType = useMemo(() =>
    getAvailableLedgers(formData.documentType),
    [formData.documentType, glVoucherTypeMappings, glEntries]
  );

  // Combine GL entries with SubGL options for the account name dropdown
  const allAccountOptions = useMemo(() => {
    const glOptions = glEntries.filter(e => e.status === 'active').map(e => ({
      code: e.glCode,
      name: e.glName,
      isSubGL: false,
    }));
    const subOptions = subGLOptions.map(s => ({
      code: s.glCode,
      name: s.fullDisplayName,
      isSubGL: true,
    }));
    return [...glOptions, ...subOptions];
  }, [glEntries, subGLOptions]);

  const totalDr = lines.reduce((s, l) => s + (parseFloat(l.drAmount) || 0), 0);
  const totalCr = lines.reduce((s, l) => s + (parseFloat(l.crAmount) || 0), 0);
  const remainingDr = totalDr - totalCr;
  const remainingCr = totalCr - totalDr;

  const periodLockCheck = useMemo(() => canCreateVoucherForDate(formData.documentDate), [formData.documentDate, canCreateVoucherForDate]);

  const handleSubmitClick = () => {
    if (!periodLockCheck.allowed) {
      toast.error(periodLockCheck.reason || 'Cannot create voucher for this date - period is locked');
      return;
    }
    if (totalDr !== totalCr) {
      toast.error('Debit and Credit amounts must be equal');
      return;
    }
    if (!isTaxMode) {
      const excludedDr = lines.filter(l => l.excludeFromTax).reduce((s, l) => s + (parseFloat(l.drAmount) || 0), 0);
      const excludedCr = lines.filter(l => l.excludeFromTax).reduce((s, l) => s + (parseFloat(l.crAmount) || 0), 0);
      if (excludedDr !== excludedCr && excludedDr + excludedCr > 0) {
        toast.error(`Tax-excluded lines must balance: Excluded Dr (${excludedDr.toFixed(2)}) ≠ Excluded Cr (${excludedCr.toFixed(2)})`);
        return;
      }
      setShowTaxExclusionDialog(true);
    } else {
      const rateLabel = formData.exchangeRateType === 'iata' ? 'IATA Rate' : 'Bank Rate';
      toast.success(`Voucher submitted successfully (${rateLabel})`);
    }
  };

  const handleFinalSubmit = (excludeFromTax: boolean) => {
    setShowTaxExclusionDialog(false);
    const rateLabel = formData.exchangeRateType === 'iata' ? 'IATA Rate' : 'Bank Rate';
    toast.success(`Voucher submitted successfully (${rateLabel})${excludeFromTax ? ' — Excluded from Tax Accounting' : ''}`);
  };

  const handleClear = () => {
    setLines([
      { id: '1', accountNumber: '', accountName: '', drAmount: '', crAmount: '', posId: '', airportStationId: '', remarks: '', tAccServer: true, excludeFromTax: false },
      { id: '2', accountNumber: '', accountName: '', drAmount: '', crAmount: '', posId: '', airportStationId: '', remarks: '', tAccServer: true, excludeFromTax: false },
    ]);
    setNarration('');
  };

  const numberToWords = (num: number): string => {
    if (num === 0) return 'Zero';
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const convert = (n: number): string => {
      if (n < 20) return ones[n];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
      if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convert(n % 100) : '');
      if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
      if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '');
      return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + convert(n % 10000000) : '');
    };
    return convert(Math.floor(num)) + ' Only';
  };

  const amountInWords = totalDr > 0 ? numberToWords(totalDr) + ` ${baseCurrency}` : `Zero ${baseCurrency} Only`;

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground">
          <span className="text-primary font-medium">Voucher</span> / Voucher Entry
        </nav>

        {/* Alerts */}
        {isTaxMode && !hasTaxEntryPermission && (
          <Alert className="bg-amber-50 border-amber-200">
            <FileWarning className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Tax Accounting Mode:</strong> You do not have permission to create entries in Tax Accounting. Contact your administrator to get access.
            </AlertDescription>
          </Alert>
        )}
        {!periodLockCheck.allowed && (
          <Alert className="bg-amber-50 border-amber-200">
            <Lock className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800"><strong>Period Locked:</strong> {periodLockCheck.reason}</AlertDescription>
          </Alert>
        )}

        {isConsolidated ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>Voucher entry is not available from Consolidated Branch. Please switch to a specific branch.</AlertDescription>
          </Alert>
        ) : !canCreateVoucher ? (
          <Alert className="bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">Tax entry access is restricted. Contact your administrator.</AlertDescription>
          </Alert>
        ) : (
          <div className="bg-card border rounded-lg p-6 space-y-6">
            {/* Row 1: Document Type, Number, Date, PO, Reference */}
            <div className="grid grid-cols-5 gap-4">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Document Type <span className="text-destructive">*</span></Label>
                <Select value={formData.documentType} onValueChange={(v) => setFormData({ ...formData, documentType: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover z-[9999]">
                    {documentTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Document Number</Label>
                <Input value={formData.documentNumber} readOnly className="bg-muted" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Document Date <span className="text-destructive">*</span></Label>
                <Input type="date" value={formData.documentDate} onChange={(e) => setFormData({ ...formData, documentDate: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">PO Number</Label>
                <Input placeholder="Enter Purchase Order" value={formData.poNumber} onChange={(e) => setFormData({ ...formData, poNumber: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Reference Number</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select or create" /></SelectTrigger>
                  <SelectContent className="bg-popover z-[9999]">
                    <SelectItem value="new">Create New</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 2: Currency Context & Exchange Rate */}
            <div className="border rounded-lg p-4 bg-muted/30 space-y-4">
              {/* Currency Labels */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-muted-foreground">System Currency</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-mono text-sm px-3 py-1">BDT (৳)</Badge>
                    <span className="text-xs text-muted-foreground">Always BDT</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-muted-foreground">Functional Currency</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-sm px-3 py-1 border-primary text-primary">
                      {baseCurrency} ({currencySymbols[baseCurrency] || baseCurrency})
                    </Badge>
                    <span className="text-xs text-muted-foreground">{selectedBranch?.name} Branch</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-muted-foreground">Foreign Currency</Label>
                  <div className="flex items-center gap-2">
                    <Badge className="font-mono text-sm px-3 py-1 bg-accent text-accent-foreground">USD ($)</Badge>
                  </div>
                </div>
              </div>

              {/* Exchange Rate Row - Functional Currency */}
              <div className="grid grid-cols-4 gap-4 items-end border-t pt-4">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Rate Type <span className="text-destructive">*</span></Label>
                  <Select value={formData.exchangeRateType} onValueChange={(v: 'iata' | 'bank') => {
                    setFormData({ ...formData, exchangeRateType: v });
                    if (baseCurrency === 'BDT') {
                      const newRate = v === 'bank' ? 122.00 : 111.50;
                      setConversionRates({ usdToBase: newRate, baseToUsd: parseFloat((1 / newRate).toFixed(6)) });
                    } else if (baseCurrency === 'INR') {
                      const newRate = v === 'bank' ? 83.50 : 81.00;
                      setConversionRates({ usdToBase: newRate, baseToUsd: parseFloat((1 / newRate).toFixed(6)) });
                    } else if (baseCurrency === 'SGD') {
                      const newRate = v === 'bank' ? 1.34 : 1.31;
                      setConversionRates({ usdToBase: newRate, baseToUsd: parseFloat((1 / newRate).toFixed(6)) });
                    }
                    // BDT rate also updates
                    const bdtRate = v === 'bank' ? 122.00 : 111.50;
                    setBdtRates({ usdToBDT: bdtRate, bdtToUsd: parseFloat((1 / bdtRate).toFixed(6)) });
                  }}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-popover z-[9999]">
                      <SelectItem value="bank">Bank Rate</SelectItem>
                      <SelectItem value="iata">IATA Rate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">
                    1 USD → {baseCurrency} ({currencySymbols[baseCurrency] || baseCurrency})
                  </Label>
                  <Input
                    type="number"
                    value={conversionRates.usdToBase}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setConversionRates({ usdToBase: val, baseToUsd: val > 0 ? parseFloat((1 / val).toFixed(6)) : 0 });
                    }}
                    step="0.01"
                    className="font-mono"
                    disabled={baseCurrency === 'USD'}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">1 {baseCurrency} → USD</Label>
                  <Input
                    type="number"
                    value={conversionRates.baseToUsd}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setConversionRates({ baseToUsd: val, usdToBase: val > 0 ? parseFloat((1 / val).toFixed(6)) : 0 });
                    }}
                    step="0.000001"
                    className="font-mono"
                    disabled={baseCurrency === 'USD'}
                  />
                </div>
                <div className="flex items-end pb-1">
                  <div className="text-xs text-muted-foreground bg-background border rounded-md px-3 py-2 w-full text-center">
                    <span className="font-medium">
                      1 USD = {currencySymbols[baseCurrency] || ''}{conversionRates.usdToBase.toLocaleString('en-US', { minimumFractionDigits: 2 })} {baseCurrency}
                    </span>
                    <span className="ml-1 text-muted-foreground">
                      ({formData.exchangeRateType === 'bank' ? 'Bank' : 'IATA'})
                    </span>
                  </div>
                </div>
              </div>

              {/* BDT Conversion Row (only for non-BDT branches) */}
              {!isFunctionalBDT && (
                <div className="grid grid-cols-4 gap-4 items-end border-t border-dashed border-primary/20 pt-4">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">BDT</Badge>
                      System Currency Rate
                    </Label>
                    <div className="text-xs text-muted-foreground px-1">Auto from Daily Rate Setup</div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">1 USD → BDT (৳)</Label>
                    <Input
                      type="number"
                      value={bdtRates.usdToBDT}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setBdtRates({ usdToBDT: val, bdtToUsd: val > 0 ? parseFloat((1 / val).toFixed(6)) : 0 });
                      }}
                      step="0.01"
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">1 BDT → USD</Label>
                    <Input
                      type="number"
                      value={bdtRates.bdtToUsd}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setBdtRates({ bdtToUsd: val, usdToBDT: val > 0 ? parseFloat((1 / val).toFixed(6)) : 0 });
                      }}
                      step="0.000001"
                      className="font-mono"
                    />
                  </div>
                  <div className="flex items-end pb-1">
                    <div className="text-xs bg-background border rounded-md px-3 py-2 w-full text-center">
                      <span className="font-medium text-muted-foreground">
                        1 USD = ৳{bdtRates.usdToBDT.toLocaleString('en-US', { minimumFractionDigits: 2 })} BDT
                      </span>
                      <div className="text-muted-foreground mt-0.5">
                        Cross: 1 {baseCurrency} = ৳{(conversionRates.usdToBase > 0 ? bdtRates.usdToBDT / conversionRates.usdToBase : 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })} BDT
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Template Selection */}
            <div className="flex items-center gap-4 border-t pt-4">
              <Label className="whitespace-nowrap font-semibold text-sm">Template Selection</Label>
              <Select>
                <SelectTrigger className="max-w-xs"><SelectValue placeholder="--- Select ---" /></SelectTrigger>
                <SelectContent className="bg-popover z-[9999]"><SelectItem value="t1">Template 1</SelectItem></SelectContent>
              </Select>
              <Button variant="ghost" size="icon"><Plus className="h-4 w-4" /></Button>
            </div>

            {/* Voucher Lines Table */}
            <div className="rounded-md border overflow-hidden">
              <TableWithSearch>
                <TableHeader>
                  <TableRow className="bg-table-header hover:bg-table-header">
                     <TableHead className="text-table-header-foreground font-semibold w-12 text-center">SL</TableHead>
                     <TableHead className="text-table-header-foreground font-semibold">Account Number</TableHead>
                     <TableHead className="text-table-header-foreground font-semibold">Account Name</TableHead>
                     <TableHead className="text-table-header-foreground font-semibold">Dr. Amount</TableHead>
                     <TableHead className="text-table-header-foreground font-semibold">Cr. Amount</TableHead>
                     <TableHead className="text-table-header-foreground font-semibold">POS</TableHead>
                     <TableHead className="text-table-header-foreground font-semibold">Airport/Station</TableHead>
                     <TableHead className="text-table-header-foreground font-semibold">Remarks / Note</TableHead>
                     {!isTaxMode && <TableHead className="text-table-header-foreground font-semibold text-center w-20">Excl. Tax</TableHead>}
                     <TableHead className="text-table-header-foreground w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lines.map((line, idx) => (
                    <TableRow key={line.id}>
                      <TableCell className="text-center">{idx + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Input
                            value={line.accountNumber}
                            onChange={(e) => updateLine(line.id, 'accountNumber', e.target.value)}
                            className="w-28"
                          />
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-primary" onClick={() => openGLSearch(line.id)}>
                            <Search className="h-4 w-4" />
                          </Button>
                        </div>
                        {line.accountNumber && (
                          <div className="text-xs text-muted-foreground mt-0.5">C.B.: 0.00</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={line.accountName || undefined}
                          onValueChange={(val) => {
                            // Check if it's a SubGL option
                            const subGL = subGLOptions.find(s => s.fullDisplayName === val);
                            if (subGL) {
                              updateLine(line.id, 'accountName', val);
                              updateLine(line.id, 'accountNumber', subGL.glCode);
                            } else {
                              // Regular GL
                              const gl = glEntries.find(e => e.glName === val);
                              if (gl) {
                                updateLine(line.id, 'accountName', gl.glName);
                                updateLine(line.id, 'accountNumber', gl.glCode);
                              } else {
                                updateLine(line.id, 'accountName', val);
                              }
                            }
                          }}
                        >
                          <SelectTrigger className="w-56">
                            <SelectValue placeholder="Select account..." />
                          </SelectTrigger>
                          <SelectContent className="bg-popover z-[9999] max-h-60">
                            {/* Regular GL entries */}
                            {glEntries.filter(e => e.status === 'active').map(e => (
                              <SelectItem key={`gl-${e.glCode}`} value={e.glName}>
                                {e.glName}
                              </SelectItem>
                            ))}
                            {/* SubGL entries with party names */}
                            {subGLOptions.length > 0 && (
                              <>
                                {subGLOptions.map((s, i) => (
                                  <SelectItem key={`sub-${i}`} value={s.fullDisplayName}>
                                    <span className="text-primary font-medium">{s.displayName}</span>
                                    <span className="text-xs text-muted-foreground ml-1">({s.glCode})</span>
                                  </SelectItem>
                                ))}
                              </>
                            )}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input type="number" value={line.drAmount} onChange={(e) => updateLine(line.id, 'drAmount', e.target.value)} className="w-24" />
                      </TableCell>
                      <TableCell>
                        <Input type="number" value={line.crAmount} onChange={(e) => updateLine(line.id, 'crAmount', e.target.value)} className="w-24" />
                      </TableCell>
                      <TableCell>
                        <Select value={line.posId || undefined} onValueChange={(val) => updateLine(line.id, 'posId', val)}>
                          <SelectTrigger className="w-36 h-7 text-xs">
                            <SelectValue placeholder="POS (optional)" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover z-[9999]">
                            <SelectItem value="none">None</SelectItem>
                            {availablePOS.map(pos => (
                              <SelectItem key={pos.id} value={pos.id}>{pos.posCode} - {pos.posName}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select value={line.airportStationId || undefined} onValueChange={(val) => updateLine(line.id, 'airportStationId', val)}>
                          <SelectTrigger className="w-36 h-7 text-xs">
                            <SelectValue placeholder="Airport (optional)" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover z-[9999]">
                            <SelectItem value="none">None</SelectItem>
                            {availableAirports.map(a => (
                              <SelectItem key={a.id} value={a.id}>{a.airportCode} - {a.airportName}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input value={line.remarks} onChange={(e) => updateLine(line.id, 'remarks', e.target.value)} />
                      </TableCell>
                      {!isTaxMode && (
                        <TableCell className="text-center">
                          <input
                            type="checkbox"
                            checked={line.excludeFromTax}
                            onChange={(e) => updateLine(line.id, 'excludeFromTax', e.target.checked ? 'true' : '')}
                            className="h-4 w-4 rounded border-border"
                            title="Exclude this line from Tax Accounting"
                          />
                        </TableCell>
                      )}
                      <TableCell>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => removeLine(line.id)}>
                          <Minus className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </TableWithSearch>
            </div>

            {/* Narration + Totals side by side */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <Label className="text-xs font-semibold">Narration <span className="text-destructive">*</span></Label>
                  <Textarea placeholder="Narration" value={narration} onChange={(e) => setNarration(e.target.value)} rows={4} className="mt-1" />
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Amount:</span>
                  <div className="flex gap-4">
                    <Input value={totalDr.toFixed(2)} readOnly className="w-28 text-right bg-muted" />
                    <Input value={totalCr.toFixed(2)} readOnly className="w-28 text-right bg-muted" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Remaining Amount:</span>
                  <div className="flex gap-4">
                    <Input value={remainingDr > 0 ? remainingDr.toFixed(2) : '0.00'} readOnly className="w-28 text-right bg-muted" />
                    <Input value={remainingCr > 0 ? remainingCr.toFixed(2) : '0.00'} readOnly className="w-28 text-right bg-muted" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button size="icon" className="h-8 w-8 rounded-full bg-success hover:bg-success/90" onClick={addLine}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="font-semibold">Amount In Words:</span>
                  <Input value={amountInWords} readOnly className="flex-1 ml-2 bg-muted text-sm" />
                </div>
              </div>
            </div>

            {/* Separator line */}
            <div className="border-t-4 border-primary" />

            {/* File Upload */}
            <div className="flex items-center gap-2 text-muted-foreground cursor-pointer hover:text-foreground p-3 border rounded-lg">
              <Upload className="h-4 w-4" />
              <span className="font-semibold">Upload Files or Attach Requisition Details</span>
              <Plus className="h-4 w-4 ml-auto" />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 pt-2">
              <Button className="bg-primary hover:bg-primary/90 px-6">Save Template</Button>
              <Button variant="destructive" onClick={handleClear} className="px-6">Clear</Button>
              <Button onClick={handleSubmitClick} className="px-6">Submit</Button>
            </div>
          </div>
        )}
      </div>

      {/* Tax Exclusion Confirmation Dialog */}
      <AlertDialog open={showTaxExclusionDialog} onOpenChange={setShowTaxExclusionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tax Accounting Exclusion</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              {lines.some(l => l.excludeFromTax) ? (
                <>
                  <p>You have marked <strong>{lines.filter(l => l.excludeFromTax).length} line(s)</strong> for exclusion from Tax Accounting.</p>
                  <div className="bg-muted p-3 rounded-lg text-xs space-y-1">
                    <p>• Line-level excluded items will only appear in Management Accounting.</p>
                    <p>• Non-excluded lines will appear in both Management and Tax Accounting.</p>
                    <p>• You can also choose to exclude the <strong>entire voucher</strong> from Tax below.</p>
                  </div>
                </>
              ) : (
                <p>Do you want to <strong>exclude</strong> this entire transaction from Tax Accounting?</p>
              )}
              <div className="bg-muted p-3 rounded-lg text-xs space-y-1">
                <p>• <strong>Include</strong> — This voucher will appear in both Management and Tax Accounting (line-level exclusions still apply).</p>
                <p>• <strong>Exclude Entire Voucher</strong> — The whole voucher will only appear in Management Accounting.</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowTaxExclusionDialog(false)}>Cancel</AlertDialogCancel>
            <Button variant="outline" onClick={() => handleFinalSubmit(false)}>
              Include in Tax
            </Button>
            <AlertDialogAction onClick={() => handleFinalSubmit(true)} className="bg-destructive hover:bg-destructive/90">
              Exclude Entire Voucher
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* GL Search Dialog */}
      <GLSearchDialog
        open={isGLSearchOpen}
        onOpenChange={setIsGLSearchOpen}
        glEntries={availableLedgersForDocType.length > 0
          ? glEntries.filter(e => availableLedgersForDocType.some(l => l.code === e.glCode))
          : glEntries
        }
        onSelect={handleGLSelect}
      />
    </DashboardLayout>
  );
}
