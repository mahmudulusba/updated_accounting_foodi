import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, FileSpreadsheet, FileText, ChevronDown, ChevronRight, Settings } from 'lucide-react';
import ReportCurrencySelector, { CurrencyType, getCurrencyLabel, formatAmount } from '@/components/ReportCurrencySelector';
import ReportBranchFilter, { useBranchFilter } from '@/components/ReportBranchFilter';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface RPLineItem {
  id: string;
  particular: string;
  work: number; // sub-item amount
  tk: number;   // parent total
  children?: RPLineItem[];
}

// Receipt side data (Opening balance + receipts)
const receiptData: RPLineItem[] = [
  {
    id: 'ob', particular: 'Opening Balance', work: 0, tk: 0,
    children: [
      {
        id: 'ob-bank', particular: 'Bank Accounts-Domestic', work: 0, tk: 197647459.43,
        children: [
          { id: 'ob-b1', particular: 'Bank A/C-Al Arafah', work: 44192.50, tk: 0 },
          { id: 'ob-b2', particular: 'Bank A/C-Brac', work: -14990803.78, tk: 0 },
          { id: 'ob-b3', particular: 'Bank A/C-CD-DBBL', work: 7942913.47, tk: 0 },
          { id: 'ob-b4', particular: 'Bank A/C-City', work: 5188039.06, tk: 0 },
          { id: 'ob-b5', particular: 'Bank A/C-Dhaka', work: 569229.14, tk: 0 },
          { id: 'ob-b6', particular: 'Bank A/C-IBBL-3775', work: -233594818.07, tk: 0 },
          { id: 'ob-b7', particular: 'Bank A/C-IBBL-FC-11510', work: 0.02, tk: 0 },
          { id: 'ob-b8', particular: 'Bank A/C-IBBL-FC-12410', work: 1630662.37, tk: 0 },
          { id: 'ob-b9', particular: 'Bank A/C-IBBL-SND', work: 332768864.33, tk: 0 },
          { id: 'ob-b10', particular: 'Bank A/C-Commercial', work: 592948971.53, tk: 0 },
          { id: 'ob-b11', particular: 'Bank A/C-Emirates NBD', work: 801993914.80, tk: 0 },
          { id: 'ob-b12', particular: 'Bank A/C-SCB Kolkata', work: 1173741336.93, tk: 0 },
        ],
      },
      {
        id: 'ob-bank-intl', particular: 'Bank Accounts-International', work: 0, tk: -222825694.73,
        children: [
          { id: 'ob-bi1', particular: 'Bank A/C-Alinma', work: -222825694.73, tk: 0 },
          { id: 'ob-bi2', particular: 'Bank A/C-Bangkok', work: 0.00, tk: 0 },
        ],
      },
      {
        id: 'ob-cash-dom', particular: 'Cash In Counter-Domestic', work: 0, tk: 1033377.00,
        children: [
          { id: 'ob-c1', particular: 'Cash In Counter-Agrabad (Ctg.)', work: 10.00, tk: 0 },
          { id: 'ob-c2', particular: 'Cash In Counter-Barishal', work: 1891.00, tk: 0 },
          { id: 'ob-c3', particular: 'Cash In Counter-Chauhatta (Sylhet)', work: 21741.00, tk: 0 },
          { id: 'ob-c4', particular: 'Cash In Counter-Chittagong Airport', work: 526786.00, tk: 0 },
          { id: 'ob-c5', particular: 'Cash In Counter-Dhaka Airport', work: 36115.00, tk: 0 },
          { id: 'ob-c6', particular: 'Cash In Counter-Hotel Kollol (CXB)', work: 200000.00, tk: 0 },
          { id: 'ob-c7', particular: 'Cash In Counter-Jessore Airport', work: 40400.00, tk: 0 },
          { id: 'ob-c8', particular: 'Cash In Counter-Maa Plaza (Saidpur)', work: 164362.00, tk: 0 },
        ],
      },
      {
        id: 'ob-cash-intl', particular: 'Cash In Counter-International', work: 0, tk: 123065616.88,
        children: [
          { id: 'ob-ci1', particular: 'Cash in Counter-Bangkok', work: 20681369.12, tk: 0 },
          { id: 'ob-ci2', particular: 'Cash in Counter-China', work: -3848398.73, tk: 0 },
          { id: 'ob-ci3', particular: 'Cash in Counter-Dubai', work: 42122143.38, tk: 0 },
          { id: 'ob-ci4', particular: 'Cash in Counter-Jeddah', work: 1103082.95, tk: 0 },
          { id: 'ob-ci5', particular: 'Cash in Counter-Kolkata', work: 9079937.11, tk: 0 },
          { id: 'ob-ci6', particular: 'Cash in Counter-KUL', work: 6921813.00, tk: 0 },
          { id: 'ob-ci7', particular: 'Cash in Counter-Maldives', work: 34418285.35, tk: 0 },
          { id: 'ob-ci8', particular: 'Cash in Counter-Singapore', work: 1644563.06, tk: 0 },
        ],
      },
      {
        id: 'ob-cash-hand', particular: 'Cash in Hand', work: 0, tk: 92323689.37,
        children: [
          { id: 'ob-ch1', particular: 'Cash', work: 90894724.66, tk: 0 },
          { id: 'ob-ch2', particular: 'Cash-Uttara Office', work: 1428964.71, tk: 0 },
        ],
      },
    ],
  },
  {
    id: 'receipt', particular: 'Receipt', work: 0, tk: 0,
    children: [
      { id: 'r1', particular: 'Unidentified Received', work: 0, tk: 1086731.86 },
      {
        id: 'r2', particular: 'Accounts Receivable-BSP Sales-Int\'l', work: 0, tk: 980923716.85,
        children: [
          { id: 'r2-1', particular: 'A/R-BSP Sales China', work: 14744806.93, tk: 0 },
          { id: 'r2-2', particular: 'A/R-BSP Sales India', work: 52319934.26, tk: 0 },
          { id: 'r2-3', particular: 'A/R-BSP Sales Malaysia', work: 114343961.73, tk: 0 },
          { id: 'r2-4', particular: 'A/R-BSP Sales Oman', work: 50243364.03, tk: 0 },
          { id: 'r2-5', particular: 'A/R-BSP Sales Qatar', work: 50897813.45, tk: 0 },
          { id: 'r2-6', particular: 'A/R-BSP Sales Saudi Arabia', work: 257492738.99, tk: 0 },
          { id: 'r2-7', particular: 'A/R-BSP Sales Singapore', work: 95481554.30, tk: 0 },
          { id: 'r2-8', particular: 'A/R-BSP Sales UAE', work: 335941425.22, tk: 0 },
        ],
      },
      {
        id: 'r3', particular: 'Accounts Receivable-Air Ticket Sales-Domestic', work: 0, tk: 678045753.15,
        children: [
          { id: 'r3-1', particular: 'A/R-BSP Sales BD (SSL)-Web Sales', work: 555564026.00, tk: 0 },
        ],
      },
      {
        id: 'r4', particular: 'Accounts Receivable-Cargo Sales', work: 0, tk: 85185404.70,
        children: [
          { id: 'r4-1', particular: 'A/R-Abda Aviation Cargo-Thailand', work: 10533210.00, tk: 0 },
          { id: 'r4-2', particular: 'A/R-Cargo Media Agency', work: 11158951.00, tk: 0 },
          { id: 'r4-3', particular: 'A/R-Dallah Bangladesh', work: 10210762.00, tk: 0 },
          { id: 'r4-4', particular: 'A/R-Apan International Cargo', work: 6421970.00, tk: 0 },
        ],
      },
      {
        id: 'r5', particular: 'Accounts Receivable-Non BSP Agents-Domestic', work: 0, tk: 1987997817.50,
        children: [
          { id: 'r5-1', particular: 'A/R-BE FRESH', work: 55950000.00, tk: 0 },
          { id: 'r5-2', particular: 'A/R-Takeoff Foods', work: 354000.00, tk: 0 },
          { id: 'r5-3', particular: 'A/R-Flyers Zone (BD) Ltd', work: 851100.00, tk: 0 },
        ],
      },
    ],
  },
];

// Payment side data
const paymentData: RPLineItem[] = [
  {
    id: 'payment', particular: 'Payment', work: 0, tk: 0,
    children: [
      {
        id: 'p1', particular: 'A/P-Aeronautical Service-Domestic', work: 0, tk: 26736800.39,
        children: [
          { id: 'p1-1', particular: 'A/P-Aeronautical Service (HSIA)', work: 13666254.65, tk: 0 },
          { id: 'p1-2', particular: 'A/P-Aeronautical Service-CGP', work: 6767942.22, tk: 0 },
          { id: 'p1-3', particular: 'A/P-Aeronautical Service-CXB', work: 1232524.08, tk: 0 },
          { id: 'p1-4', particular: 'A/P-Aeronautical Service-ZYL', work: 844289.64, tk: 0 },
          { id: 'p1-5', particular: 'A/P-Aeronautical Service-(JSR)', work: 280705.86, tk: 0 },
          { id: 'p1-6', particular: 'A/P-Aeronautical Service-Rajshahi', work: 363114.72, tk: 0 },
          { id: 'p1-7', particular: 'A/P-CAAB-HSIA', work: 3033738.00, tk: 0 },
          { id: 'p1-8', particular: 'A/P-Aeronautical Service-Others', work: 548231.22, tk: 0 },
        ],
      },
      {
        id: 'p2', particular: 'A/P-Aeronautical Service-Int\'l', work: 0, tk: 410869477.77,
        children: [
          { id: 'p2-1', particular: 'A/P-Aeronautical Service-CGP to INT.', work: 57062804.57, tk: 0 },
          { id: 'p2-2', particular: 'A/P-Aeronautical Service-DAC to INT.', work: 353806673.20, tk: 0 },
        ],
      },
      {
        id: 'p3', particular: 'A/P-Aircraft Fuel', work: 0, tk: 81778303.14,
        children: [
          { id: 'p3-1', particular: 'A/P-Adnoc', work: 57733581.95, tk: 0 },
          { id: 'p3-2', particular: 'A/P-CNAF-CAN', work: 24044721.19, tk: 0 },
        ],
      },
      {
        id: 'p4', particular: 'A/P-Aircraft Lease Rent', work: 0, tk: 168176455.76,
        children: [
          { id: 'p4-1', particular: 'A/P-Rolls Royce', work: 161680528.69, tk: 0 },
          { id: 'p4-2', particular: 'A/P-TrueNoord Boyne', work: 4688221.26, tk: 0 },
          { id: 'p4-3', particular: 'A/P-TrueNoord Sheelin', work: 1807705.81, tk: 0 },
        ],
      },
      {
        id: 'p5', particular: 'A/P-Airport Development Fees', work: 0, tk: 24560176.98,
        children: [
          { id: 'p5-1', particular: 'A/P-Airport Development Fee-Domestic', work: 5603300.00, tk: 0 },
          { id: 'p5-2', particular: 'A/P-Airport Development Fee-Int\'l', work: 18956876.98, tk: 0 },
        ],
      },
      {
        id: 'p6', particular: 'A/P-Aviator', work: 0, tk: 53341206.90,
        children: [
          { id: 'p6-1', particular: 'A/P-MSN-30728-Base Rent', work: 17943361.39, tk: 0 },
          { id: 'p6-2', particular: 'A/P-MSN-30728-Maintenance Rent', work: 35397845.51, tk: 0 },
        ],
      },
      {
        id: 'p7', particular: 'A/P-Embarkation Fees (BD)-Domestic', work: 0, tk: 8620400.00,
        children: [
          { id: 'p7-1', particular: 'A/P-Embarkation Fees (BD)', work: 8620400.00, tk: 0 },
        ],
      },
      {
        id: 'p8', particular: 'A/P-Embarkation Fees (BD)-Int\'l', work: 0, tk: 137261000.00,
        children: [
          { id: 'p8-1', particular: 'A/P-Embarkation Fee-CGP-AUH', work: 4204000.00, tk: 0 },
          { id: 'p8-2', particular: 'A/P-Embarkation Fee-CGP-CCU', work: 2377000.00, tk: 0 },
          { id: 'p8-3', particular: 'A/P-Embarkation Fee-CGP-DOH', work: 1896000.00, tk: 0 },
          { id: 'p8-4', particular: 'A/P-Embarkation Fee-CGP-DXB', work: 7303500.00, tk: 0 },
          { id: 'p8-5', particular: 'A/P-Embarkation Fee-DAC-BKK', work: 9222500.00, tk: 0 },
          { id: 'p8-6', particular: 'A/P-Embarkation Fee-DAC-CAN', work: 8720000.00, tk: 0 },
          { id: 'p8-7', particular: 'A/P-Embarkation Fee-DAC-DOH', work: 12443000.00, tk: 0 },
          { id: 'p8-8', particular: 'A/P-Embarkation Fee-DAC-DXB', work: 6453500.00, tk: 0 },
          { id: 'p8-9', particular: 'A/P-Embarkation Fee-DAC-JED', work: 13589000.00, tk: 0 },
          { id: 'p8-10', particular: 'A/P-Embarkation Fee-DAC-KUL', work: 12904000.00, tk: 0 },
          { id: 'p8-11', particular: 'A/P-Embarkation Fee-DAC-SIN', work: 6739500.00, tk: 0 },
        ],
      },
      {
        id: 'p9', particular: 'A/P-Excise Duty (OW)-Domestic', work: 0, tk: 65064000.00,
        children: [
          { id: 'p9-1', particular: 'A/P-Excise Duty-Chittagong', work: 8261000.00, tk: 0 },
          { id: 'p9-2', particular: 'A/P-Excise Duty-Cox\'s Bazar', work: 8783500.00, tk: 0 },
          { id: 'p9-3', particular: 'A/P-Excise Duty-Dhaka', work: 29701000.00, tk: 0 },
          { id: 'p9-4', particular: 'A/P-Excise Duty-Jessore', work: 1962500.00, tk: 0 },
          { id: 'p9-5', particular: 'A/P-Excise Duty-Rajshahi', work: 2775500.00, tk: 0 },
          { id: 'p9-6', particular: 'A/P-Excise Duty-Saidpur', work: 5769000.00, tk: 0 },
          { id: 'p9-7', particular: 'A/P-Excise Duty-Sylhet', work: 7811500.00, tk: 0 },
        ],
      },
      {
        id: 'p10', particular: 'A/P-Salary & Allowances', work: 0, tk: 205541298.35,
        children: [
          { id: 'p10-1', particular: 'A/P-Salary & Allowances (Local)', work: 176901577.00, tk: 0 },
          { id: 'p10-2', particular: 'A/P-Director Remuneration', work: 2662122.00, tk: 0 },
          { id: 'p10-3', particular: 'A/P-Flying Allowance-Cabin Crew', work: 10148081.00, tk: 0 },
          { id: 'p10-4', particular: 'A/P-Lay Over-Cabin Crew', work: 4012700.00, tk: 0 },
          { id: 'p10-5', particular: 'A/P-Training Allowances', work: 633907.00, tk: 0 },
          { id: 'p10-6', particular: 'A/P-Salary Foreigner', work: 22836024.96, tk: 0 },
        ],
      },
      {
        id: 'p11', particular: 'A/P-Chevron (Aircraft Fuel)', work: 0, tk: 190815797.51,
        children: [
          { id: 'p11-1', particular: 'A/P-Chevron-BKK', work: 29898999.30, tk: 0 },
          { id: 'p11-2', particular: 'A/P-Chevron-DXB', work: 78497194.33, tk: 0 },
          { id: 'p11-3', particular: 'A/P-Chevron-MCT', work: 38293369.18, tk: 0 },
          { id: 'p11-4', particular: 'A/P-Chevron-SIN', work: 44126234.70, tk: 0 },
        ],
      },
      {
        id: 'p12', particular: 'A/P-Suppliers & Others', work: 0, tk: 463626839.80,
        children: [
          { id: 'p12-1', particular: 'A/P-Bilash Enterprise', work: 19035480.00, tk: 0 },
          { id: 'p12-2', particular: 'A/P-Skyup Capital LLC', work: 335549969.89, tk: 0 },
          { id: 'p12-3', particular: 'A/P-BOC Aviation Ltd.', work: 76737715.77, tk: 0 },
          { id: 'p12-4', particular: 'A/P-CIT Aerospace', work: 122038342.18, tk: 0 },
        ],
      },
    ],
  },
];

// Compute totals
const computeTotal = (items: RPLineItem[]): number => {
  return items.reduce((sum, item) => {
    if (item.tk > 0) return sum + item.tk;
    if (item.children) return sum + computeTotal(item.children);
    return sum + (item.work || 0);
  }, 0);
};

const totalReceipt = computeTotal(receiptData);
const totalPayment = computeTotal(paymentData);

// Collapsible row renderer
function RPRows({ items, depth, currency, baseCurrencyCode, expandedRows, toggleRow, side }: {
  items: RPLineItem[];
  depth: number;
  currency: CurrencyType;
  baseCurrencyCode: string;
  expandedRows: Set<string>;
  toggleRow: (id: string) => void;
  side: 'receipt' | 'payment';
}) {
  return (
    <>
      {items.map((item) => {
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = expandedRows.has(`${side}-${item.id}`);
        const isParent = depth === 0 || (hasChildren && depth <= 1);

        return (
          <React.Fragment key={`${side}-${item.id}`}>
            <TableRow className={cn(
              "hover:bg-muted/50",
              isParent && "font-semibold bg-muted/20",
              depth === 0 && "bg-muted font-bold text-base"
            )}>
              <TableCell className="py-1.5" style={{ paddingLeft: `${depth * 20 + 8}px` }}>
                <span className="flex items-center gap-1">
                  {hasChildren && (
                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0 shrink-0" onClick={() => toggleRow(`${side}-${item.id}`)}>
                      {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                    </Button>
                  )}
                  <span className="text-sm">{item.particular}</span>
                </span>
              </TableCell>
              <TableCell className="text-right py-1.5 text-sm">
                {item.work !== 0 ? formatAmount(Math.abs(item.work), currency, baseCurrencyCode) : ''}
                {item.work < 0 && item.work !== 0 ? ' (-)' : ''}
              </TableCell>
              <TableCell className="text-right py-1.5 text-sm font-medium">
                {item.tk > 0 ? formatAmount(item.tk, currency, baseCurrencyCode) : ''}
              </TableCell>
            </TableRow>
            {hasChildren && isExpanded && (
              <RPRows items={item.children!} depth={depth + 1} currency={currency} baseCurrencyCode={baseCurrencyCode} expandedRows={expandedRows} toggleRow={toggleRow} side={side} />
            )}
          </React.Fragment>
        );
      })}
    </>
  );
}

const PaymentReceiptReport = () => {
  const { filterBranchCodes, setFilterBranchCodes, isMultipleBranchesSelected, effectiveBaseCurrencyCode } = useBranchFilter();
  const baseCurrencyCode = effectiveBaseCurrencyCode;
  const [currency, setCurrency] = useState<CurrencyType>('base');
  const [fromDate, setFromDate] = useState<Date>(new Date(2025, 0, 1));
  const [toDate, setToDate] = useState<Date>(new Date(2025, 0, 31));
  const [showReport, setShowReport] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'parent' | 'all'>('parent');

  const toggleRow = (id: string) => {
    setExpandedRows(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const expandAll = () => {
    const allIds = new Set<string>();
    const collect = (items: RPLineItem[], side: string) => {
      items.forEach(i => { allIds.add(`${side}-${i.id}`); if (i.children) collect(i.children, side); });
    };
    collect(receiptData, 'receipt');
    collect(paymentData, 'payment');
    setExpandedRows(allIds);
  };

  const collapseAll = () => {
    setExpandedRows(new Set());
  };

  const currencyLabel = getCurrencyLabel(currency, baseCurrencyCode);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-foreground">Payment & Receipt Report</h1>

        <Card>
          <CardHeader><CardTitle className="text-lg">Report Filters</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ReportBranchFilter selectedBranchCodes={filterBranchCodes} onBranchChange={setFilterBranchCodes} />
              <div />
              <div />
            </div>
            <ReportCurrencySelector value={currency} onChange={setCurrency} baseCurrencyCode={baseCurrencyCode} restrictToCommonCurrencies={isMultipleBranchesSelected} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">From Date *</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !fromDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />{fromDate ? format(fromDate, "dd-MMM-yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={fromDate} onSelect={(d) => d && setFromDate(d)} initialFocus className="pointer-events-auto" /></PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">To Date *</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !toDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />{toDate ? format(toDate, "dd-MMM-yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={toDate} onSelect={(d) => d && setToDate(d)} initialFocus className="pointer-events-auto" /></PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">View Mode</Label>
              <RadioGroup value={viewMode} onValueChange={(v) => { setViewMode(v as 'parent' | 'all'); v === 'all' ? expandAll() : collapseAll(); }} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="parent" id="view-parent" />
                  <Label htmlFor="view-parent" className="text-sm cursor-pointer">Parent Only (Collapsed)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="view-all" />
                  <Label htmlFor="view-all" className="text-sm cursor-pointer">All Details (Expanded)</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => { setShowReport(false); collapseAll(); }}>Clear</Button>
              <Button className="bg-primary hover:bg-primary/90 text-white" onClick={() => setShowReport(true)}>Generate Report</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Report Preview</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="bg-primary text-primary-foreground hover:bg-primary/90"><Printer className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon" className="bg-red-500 text-white hover:bg-red-600"><FileText className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon" className="bg-primary text-primary-foreground hover:bg-primary/90"><FileSpreadsheet className="h-4 w-4" /></Button>
            </div>
          </CardHeader>
          <CardContent>
            {!showReport ? (
              <div className="text-center py-12 text-muted-foreground">Click "Generate Report" to view the payment & receipt report</div>
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <h2 className="text-lg font-bold">Foodi Ltd.</h2>
                  <p className="text-sm text-muted-foreground">77, Sohrawardi Avenue, Baridhara Diplomatic Zone, Dhaka-1212</p>
                  <h3 className="text-base font-semibold mt-2">Receipt and Payment</h3>
                  <p className="text-muted-foreground text-sm">{format(fromDate, "dd-MMM-yyyy")} to {format(toDate, "dd-MMM-yyyy")}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={expandAll}>Expand All</Button>
                    <Button variant="outline" size="sm" onClick={collapseAll}>Collapse All</Button>
                    <Button variant="outline" size="icon"><Settings className="h-4 w-4" /></Button>
                  </div>
                  <Input placeholder="Search..." className="max-w-xs" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>

                {/* Two-column layout: Receipt | Payment */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Receipt Side */}
                  <div className="border rounded-lg overflow-hidden">
                    <TableWithSearch>
                      <TableHeader>
                        <TableRow className="bg-table-header hover:bg-table-header">
                          <TableHead className="text-table-header-foreground font-bold">Particulars (Receipt)</TableHead>
                          <TableHead className="text-table-header-foreground font-bold text-right">Work {currencyLabel}</TableHead>
                          <TableHead className="text-table-header-foreground font-bold text-right">Tk {currencyLabel}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <RPRows items={receiptData} depth={0} currency={currency} baseCurrencyCode={baseCurrencyCode} expandedRows={expandedRows} toggleRow={toggleRow} side="receipt" />
                        <TableRow className="bg-muted font-bold">
                          <TableCell className="text-right">Total Receipt:</TableCell>
                          <TableCell></TableCell>
                          <TableCell className="text-right">{formatAmount(totalReceipt, currency, baseCurrencyCode)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </TableWithSearch>
                  </div>

                  {/* Payment Side */}
                  <div className="border rounded-lg overflow-hidden">
                    <TableWithSearch>
                      <TableHeader>
                        <TableRow className="bg-table-header hover:bg-table-header">
                          <TableHead className="text-table-header-foreground font-bold">Particulars (Payment)</TableHead>
                          <TableHead className="text-table-header-foreground font-bold text-right">Work {currencyLabel}</TableHead>
                          <TableHead className="text-table-header-foreground font-bold text-right">Tk {currencyLabel}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <RPRows items={paymentData} depth={0} currency={currency} baseCurrencyCode={baseCurrencyCode} expandedRows={expandedRows} toggleRow={toggleRow} side="payment" />
                        <TableRow className="bg-muted font-bold">
                          <TableCell className="text-right">Total Payment:</TableCell>
                          <TableCell></TableCell>
                          <TableCell className="text-right">{formatAmount(totalPayment, currency, baseCurrencyCode)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </TableWithSearch>
                  </div>
                </div>

                {/* Closing Balance Summary */}
                <div className="border rounded-lg p-4 bg-muted/30">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-semibold">Closing Balance (Receipt Side):</p>
                      <p className="text-lg font-bold text-primary">{formatAmount(totalReceipt, currency, baseCurrencyCode)}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Closing Balance (Payment Side):</p>
                      <p className="text-lg font-bold text-red-600">{formatAmount(totalPayment, currency, baseCurrencyCode)}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PaymentReceiptReport;
