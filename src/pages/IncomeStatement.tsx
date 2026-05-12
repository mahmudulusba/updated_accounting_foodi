import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, FileSpreadsheet, FileText, Settings, ChevronDown, ChevronRight, ChevronsDownUp, ChevronsUpDown } from 'lucide-react';
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

const monthCols = ['April','May','June','July','August','September','October','November','December','January','February','March'];

interface DetailRow { label: string; bold?: boolean; values?: number[]; }
const detailRows: DetailRow[] = [
  { label: 'Revenue', bold: true, values: Array(12).fill(0) },
  { label: 'Core commerce', values: Array(12).fill(0) },
  { label: 'RETAIL COINS DISCOUNT', values: Array(12).fill(0) },
  { label: 'SALES DISCOUNT REIMBURSEMENT', values: Array(12).fill(0) },
  { label: 'RETAIL SHIPPING DISCOUNT', values: Array(12).fill(0) },
  { label: 'RETAIL SALES DISCOUNTS', values: Array(12).fill(0) },
  { label: 'RETURNS FROM B2C NON-GROUP NATIONAL CUST', values: Array(12).fill(0) },
  { label: 'RETURNS - SHIPPING FEES', values: Array(12).fill(0) },
  { label: 'RETURNS - MARKETPLACE SHIPPING FEES', values: Array(12).fill(0) },
  { label: 'Variable costs', bold: true, values: Array(12).fill(0) },
  { label: 'Sales tax' },
  { label: 'Commission to salesmen' },
  { label: 'Commission to agents & others', values: Array(12).fill(0) },
  { label: 'SALES CONSULTANTS(DFORCE)', values: Array(12).fill(0) },
  { label: 'Traffic acquisition cost' },
  { label: 'Traffic acquisition cost (Adj)' },
  { label: 'Royalty fee' },
  { label: 'Gross Profit', bold: true, values: Array(12).fill(0) },
  { label: 'Operating Expenses', bold: true, values: Array(12).fill(0) },
  { label: 'Operating Profit', bold: true, values: Array(12).fill(0) },
  { label: 'Net Profit', bold: true, values: Array(12).fill(0) },
];


interface DimNode {
  id: string;
  label: string;
  level: 'sbu' | 'dept' | 'hub' | 'city';
  current?: number;
  previous?: number;
  children?: DimNode[];
}

interface IncomeItem {
  id: string;
  particulars: string;
  currentPeriod: number;
  previousPeriod: number;
  variance: number;
  children?: IncomeItem[];
  isTotal?: boolean;
  dimensions?: DimNode[];
}

// Shared dummy dimension tree (SBU > Department > Hub > City) used per leaf account
const buildDimTree = (base: number, prevBase: number): DimNode[] => [
  {
    id: 'sbu-foodi', label: 'Foodi', level: 'sbu',
    children: [
      { id: 'd-foodi-acc', label: 'Accounts', level: 'dept', children: [
        { id: 'h-foodi-acc-dhk', label: 'Dhaka', level: 'hub', children: [
          { id: 'c-foodi-acc-dhk-dhk', label: 'Dhaka', level: 'city', current: base * 0.20, previous: prevBase * 0.20 },
          { id: 'c-foodi-acc-dhk-nrg', label: 'Narayangonj', level: 'city', current: base * 0.10, previous: prevBase * 0.09 },
        ]},
      ]},
      { id: 'd-foodi-mkt', label: 'Marketing', level: 'dept', children: [
        { id: 'h-foodi-mkt-rj', label: 'Rajshahi', level: 'hub', children: [
          { id: 'c-foodi-mkt-rj-rj', label: 'Rajshahi', level: 'city', current: base * 0.08, previous: prevBase * 0.07 },
        ]},
      ]},
    ],
  },
  {
    id: 'sbu-mart', label: 'Mart', level: 'sbu',
    children: [
      { id: 'd-mart-acc', label: 'Accounts', level: 'dept', children: [
        { id: 'h-mart-acc-dhk', label: 'Dhaka', level: 'hub', children: [
          { id: 'c-mart-acc-dhk-dhk', label: 'Dhaka', level: 'city', current: base * 0.18, previous: prevBase * 0.19 },
        ]},
        { id: 'h-mart-acc-rj', label: 'Rajshahi', level: 'hub', children: [
          { id: 'c-mart-acc-rj-rj', label: 'Rajshahi', level: 'city', current: base * 0.09, previous: prevBase * 0.10 },
        ]},
      ]},
    ],
  },
  {
    id: 'sbu-shop', label: 'Shop', level: 'sbu',
    children: [
      { id: 'd-shop-acc', label: 'Accounts', level: 'dept', children: [
        { id: 'h-shop-acc-dhk', label: 'Dhaka', level: 'hub', children: [
          { id: 'c-shop-acc-dhk-dhk', label: 'Dhaka', level: 'city', current: base * 0.20, previous: prevBase * 0.20 },
        ]},
        { id: 'h-shop-acc-rj', label: 'Rajshahi', level: 'hub', children: [
          { id: 'c-shop-acc-rj-rj', label: 'Rajshahi', level: 'city', current: base * 0.15, previous: prevBase * 0.15 },
        ]},
      ]},
    ],
  },
];

const sumDim = (n: DimNode, key: 'current' | 'previous'): number => {
  if (!n.children || n.children.length === 0) return Number(n[key] ?? 0);
  return n.children.reduce((acc, c) => acc + sumDim(c, key), 0);
};

const dummyData: IncomeItem[] = [
  { id: '1', particulars: 'Revenue', currentPeriod: 3362296965.06, previousPeriod: 3150000000.00, variance: 212296965.06, children: [
    { id: '1.1', particulars: 'Passenger Revenue', currentPeriod: 2850000000.00, previousPeriod: 2650000000.00, variance: 200000000.00, dimensions: buildDimTree(2850000000, 2650000000) },
    { id: '1.2', particulars: 'Cargo Revenue', currentPeriod: 350000000.00, previousPeriod: 320000000.00, variance: 30000000.00, dimensions: buildDimTree(350000000, 320000000) },
    { id: '1.3', particulars: 'Ancillary Revenue', currentPeriod: 162296965.06, previousPeriod: 180000000.00, variance: -17703034.94, dimensions: buildDimTree(162296965, 180000000) },
  ]},
  { id: '2', particulars: 'Cost of Sales', currentPeriod: 2800000000.00, previousPeriod: 2650000000.00, variance: 150000000.00, children: [
    { id: '2.1', particulars: 'Fuel Cost', currentPeriod: 1200000000.00, previousPeriod: 1100000000.00, variance: 100000000.00, dimensions: buildDimTree(1200000000, 1100000000) },
    { id: '2.2', particulars: 'Airport Charges', currentPeriod: 450000000.00, previousPeriod: 420000000.00, variance: 30000000.00, dimensions: buildDimTree(450000000, 420000000) },
    { id: '2.3', particulars: 'Navigation Charges', currentPeriod: 280000000.00, previousPeriod: 260000000.00, variance: 20000000.00, dimensions: buildDimTree(280000000, 260000000) },
    { id: '2.4', particulars: 'Catering & Handling', currentPeriod: 420000000.00, previousPeriod: 400000000.00, variance: 20000000.00, dimensions: buildDimTree(420000000, 400000000) },
    { id: '2.5', particulars: 'Crew Costs', currentPeriod: 450000000.00, previousPeriod: 470000000.00, variance: -20000000.00, dimensions: buildDimTree(450000000, 470000000) },
  ]},
  { id: '3', particulars: 'Gross Profit', currentPeriod: 562296965.06, previousPeriod: 500000000.00, variance: 62296965.06, isTotal: true },
  { id: '4', particulars: 'Operating Expenses', currentPeriod: 451357649.02, previousPeriod: 420000000.00, variance: 31357649.02, children: [
    { id: '4.1', particulars: 'Employee Benefits', currentPeriod: 180000000.00, previousPeriod: 170000000.00, variance: 10000000.00, dimensions: buildDimTree(180000000, 170000000) },
    { id: '4.2', particulars: 'Maintenance & Repairs', currentPeriod: 120000000.00, previousPeriod: 110000000.00, variance: 10000000.00, dimensions: buildDimTree(120000000, 110000000) },
    { id: '4.3', particulars: 'Depreciation', currentPeriod: 85000000.00, previousPeriod: 80000000.00, variance: 5000000.00, dimensions: buildDimTree(85000000, 80000000) },
    { id: '4.4', particulars: 'Administrative Expenses', currentPeriod: 66357649.02, previousPeriod: 60000000.00, variance: 6357649.02, dimensions: buildDimTree(66357649, 60000000) },
  ]},
  { id: '5', particulars: 'Operating Profit', currentPeriod: 110939316.04, previousPeriod: 80000000.00, variance: 30939316.04, isTotal: true },
  { id: '6', particulars: 'Other Income/(Expenses)', currentPeriod: -20000000.00, previousPeriod: -15000000.00, variance: -5000000.00, children: [
    { id: '6.1', particulars: 'Interest Income', currentPeriod: 15000000.00, previousPeriod: 12000000.00, variance: 3000000.00, dimensions: buildDimTree(15000000, 12000000) },
    { id: '6.2', particulars: 'Interest Expense', currentPeriod: -35000000.00, previousPeriod: -27000000.00, variance: -8000000.00, dimensions: buildDimTree(-35000000, -27000000) },
  ]},
  { id: '7', particulars: 'Profit Before Tax', currentPeriod: 90939316.04, previousPeriod: 65000000.00, variance: 25939316.04, isTotal: true },
  { id: '8', particulars: 'Income Tax Expense', currentPeriod: 22734829.01, previousPeriod: 16250000.00, variance: 6484829.01, dimensions: buildDimTree(22734829, 16250000) },
  { id: '9', particulars: 'Net Profit', currentPeriod: 68204487.03, previousPeriod: 48750000.00, variance: 19454487.03, isTotal: true },
];

const dimLevelIdx: Record<DimNode['level'], number> = { sbu: 0, dept: 1, hub: 2, city: 3 };


const renderDimensionRows = (
  nodes: DimNode[],
  parentKey: string,
  expandedRows: Set<string>,
  toggleRow: (id: string) => void,
  currency: CurrencyType,
  baseCurrencyCode: string,
  depth = 0,
): React.ReactNode[] => {
  const rows: React.ReactNode[] = [];
  nodes.forEach(n => {
    const idx = dimLevelIdx[n.level];
    const cur = sumDim(n, 'current');
    const prev = sumDim(n, 'previous');
    const variance = cur - prev;
    const hasChildren = !!n.children && n.children.length > 0;
    const rowId = `${parentKey}::${n.id}`;
    const isExpanded = expandedRows.has(rowId);
    rows.push(
      <TableRow key={rowId} className="bg-muted/10 hover:bg-muted/30">
        <TableCell className="w-12"></TableCell>
        <TableCell></TableCell>
        {[0,1,2,3].map(i => (
          <TableCell key={i} className="bg-muted/5">
            {i === idx ? (
              <div className="flex items-center gap-1" style={{ paddingLeft: depth * 8 }}>
                {hasChildren ? (
                  <button onClick={() => toggleRow(rowId)} className="hover:bg-muted rounded p-0.5">
                    {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                  </button>
                ) : (
                  <span className="w-4 inline-block" />
                )}
                <span className={cn(
                  'text-xs',
                  n.level === 'sbu' && 'font-semibold',
                  n.level === 'city' && 'italic text-muted-foreground',
                )}>{n.label}</span>
              </div>
            ) : null}
          </TableCell>
        ))}
        <TableCell className="text-right text-xs">{formatAmount(cur, currency, baseCurrencyCode)}</TableCell>
        <TableCell className="text-right text-xs">{formatAmount(prev, currency, baseCurrencyCode)}</TableCell>
        <TableCell className={cn("text-right text-xs", variance < 0 ? "text-red-600" : "text-green-600")}>{formatAmount(variance, currency, baseCurrencyCode)}</TableCell>
      </TableRow>
    );
    if (isExpanded && n.children) {
      rows.push(...renderDimensionRows(n.children, parentKey, expandedRows, toggleRow, currency, baseCurrencyCode, depth + 1));
    }
  });
  return rows;
};

const IncomeStatement = () => {
  const { isConsolidated, filterBranchCodes, setFilterBranchCodes, isMultipleBranchesSelected, effectiveBaseCurrencyCode } = useBranchFilter();
  const baseCurrencyCode = effectiveBaseCurrencyCode;
  
  const [currency, setCurrency] = useState<CurrencyType>('base');
  const [fromDate, setFromDate] = useState<Date>(new Date(2025, 0, 1));
  const [toDate, setToDate] = useState<Date>(new Date());
  const [showReport, setShowReport] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set(['1', '2', '4']));
  const [searchTerm, setSearchTerm] = useState('');
  const [reportMode, setReportMode] = useState<'summary' | 'details'>('summary');

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) { newSet.delete(id); } else { newSet.add(id); }
      return newSet;
    });
  };

  const collectDimIds = (nodes: DimNode[], parentKey: string, out: Set<string>) => {
    nodes.forEach(n => {
      const rowId = `${parentKey}::${n.id}`;
      if (n.children && n.children.length) {
        out.add(rowId);
        collectDimIds(n.children, parentKey, out);
      }
    });
  };
  const expandAll = () => {
    const s = new Set<string>();
    dummyData.forEach(item => {
      if (item.children) {
        s.add(item.id);
        item.children.forEach(child => {
          if (child.dimensions) {
            s.add(child.id);
            collectDimIds(child.dimensions, child.id, s);
          }
        });
      }
    });
    setExpandedRows(s);
  };
  const collapseAll = () => setExpandedRows(new Set());

  const currencyLabel = getCurrencyLabel(currency, baseCurrencyCode);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div><h1 className="text-2xl font-semibold text-foreground">Income Statement</h1></div>
        <Card>
          <CardHeader><CardTitle className="text-lg">Report Filters</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Report Type</Label>
              <RadioGroup value={reportMode} onValueChange={(v) => { setReportMode(v as 'summary' | 'details'); setShowReport(false); }} className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="summary" id="is-summary" />
                  <Label htmlFor="is-summary" className="font-normal cursor-pointer">Summary Report</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="details" id="is-details" />
                  <Label htmlFor="is-details" className="font-normal cursor-pointer">Details Report</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ReportBranchFilter
                selectedBranchCodes={filterBranchCodes}
                onBranchChange={setFilterBranchCodes}
              />
              <div></div>
            </div>
            <ReportCurrencySelector 
              value={currency} 
              onChange={setCurrency} 
              baseCurrencyCode={baseCurrencyCode}
              restrictToCommonCurrencies={isMultipleBranchesSelected}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">From Date *</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !fromDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fromDate ? format(fromDate, "dd-MMM-yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={fromDate} onSelect={(date) => date && setFromDate(date)} initialFocus className="pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">To Date *</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !toDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {toDate ? format(toDate, "dd-MMM-yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={toDate} onSelect={(date) => date && setToDate(date)} initialFocus className="pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowReport(false)}>Clear</Button>
              <Button className="bg-primary hover:bg-primary/90" onClick={() => setShowReport(true)}>Generate Report</Button>
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
              <div className="text-center py-12 text-muted-foreground">Click "Generate Report" to view the income statement</div>
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <h2 className="text-xl font-semibold">Income Statement</h2>
                  <p className="text-muted-foreground">{format(fromDate, "dd-MMM-yyyy")} To {format(toDate, "dd-MMM-yyyy")}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon"><Settings className="h-4 w-4" /></Button>
                    <Button variant="outline" size="sm" onClick={expandAll} className="h-9">
                      <ChevronsUpDown className="h-4 w-4 mr-1" /> Expand All
                    </Button>
                    <Button variant="outline" size="sm" onClick={collapseAll} className="h-9">
                      <ChevronsDownUp className="h-4 w-4 mr-1" /> Collapse All
                    </Button>
                  </div>
                  <Input placeholder="Search all columns..." className="max-w-xs" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="border rounded-lg overflow-hidden">
                  {reportMode === 'summary' ? (
                  <TableWithSearch>
                    <TableHeader>
                      <TableRow className="bg-table-header hover:bg-table-header">
                        <TableHead className="text-table-header-foreground font-bold w-12"></TableHead>
                        <TableHead className="text-table-header-foreground font-bold min-w-[220px]">Particulars</TableHead>
                        <TableHead className="text-table-header-foreground font-bold">SBU</TableHead>
                        <TableHead className="text-table-header-foreground font-bold">Department</TableHead>
                        <TableHead className="text-table-header-foreground font-bold">Hub</TableHead>
                        <TableHead className="text-table-header-foreground font-bold">City</TableHead>
                        <TableHead className="text-table-header-foreground font-bold text-right">Current Period {currencyLabel}</TableHead>
                        <TableHead className="text-table-header-foreground font-bold text-right">Previous Period {currencyLabel}</TableHead>
                        <TableHead className="text-table-header-foreground font-bold text-right">Variance {currencyLabel}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dummyData.map((item) => (
                        <React.Fragment key={item.id}>
                          <TableRow className={cn("hover:bg-muted/50", item.isTotal && "font-semibold bg-muted")}>
                            <TableCell className="w-12">
                              {item.children && <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => toggleRow(item.id)}>
                                {expandedRows.has(item.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                              </Button>}
                            </TableCell>
                            <TableCell className="font-medium">{item.particulars}</TableCell>
                            <TableCell colSpan={4} className="bg-muted/10"></TableCell>
                            <TableCell className="text-right">{formatAmount(item.currentPeriod, currency, baseCurrencyCode)}</TableCell>
                            <TableCell className="text-right">{formatAmount(item.previousPeriod, currency, baseCurrencyCode)}</TableCell>
                            <TableCell className={cn("text-right", item.variance < 0 ? "text-red-600" : "text-green-600")}>{formatAmount(item.variance, currency, baseCurrencyCode)}</TableCell>
                          </TableRow>
                          {expandedRows.has(item.id) && item.children?.map((child) => (
                            <React.Fragment key={child.id}>
                              <TableRow className="bg-muted/30 hover:bg-muted/50">
                                <TableCell className="w-12">
                                  {child.dimensions && <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => toggleRow(child.id)}>
                                    {expandedRows.has(child.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                  </Button>}
                                </TableCell>
                                <TableCell className="pl-8">{child.particulars}</TableCell>
                                <TableCell colSpan={4} className="bg-muted/10"></TableCell>
                                <TableCell className="text-right">{formatAmount(child.currentPeriod, currency, baseCurrencyCode)}</TableCell>
                                <TableCell className="text-right">{formatAmount(child.previousPeriod, currency, baseCurrencyCode)}</TableCell>
                                <TableCell className={cn("text-right", child.variance < 0 ? "text-red-600" : "text-green-600")}>{formatAmount(child.variance, currency, baseCurrencyCode)}</TableCell>
                              </TableRow>
                              {expandedRows.has(child.id) && child.dimensions && renderDimensionRows(child.dimensions, child.id, expandedRows, toggleRow, currency, baseCurrencyCode)}
                            </React.Fragment>
                          ))}
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </TableWithSearch>
                  ) : (
                  <div className="overflow-x-auto">

                    <TableWithSearch>
                      <TableHeader>
                        <TableRow className="bg-table-header hover:bg-table-header">
                          <TableHead className="text-table-header-foreground font-bold sticky left-0 bg-table-header z-10 min-w-[280px]">Particulars</TableHead>
                          <TableHead className="text-table-header-foreground font-bold text-right whitespace-nowrap">Current Month Actual</TableHead>
                          <TableHead className="text-table-header-foreground font-bold text-right whitespace-nowrap">Previous Month Actual</TableHead>
                          {monthCols.map(m => (
                            <TableHead key={m} className="text-table-header-foreground font-bold text-right whitespace-nowrap">{m}</TableHead>
                          ))}
                          <TableHead className="text-table-header-foreground font-bold text-right whitespace-nowrap">Full Year</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {detailRows.map((row, idx) => {
                          const fullYear = row.values ? row.values.reduce((a, b) => a + b, 0) : null;
                          return (
                            <TableRow key={idx} className={cn("hover:bg-muted/50", row.bold && "font-semibold bg-muted")}>
                              <TableCell className={cn("font-medium sticky left-0 bg-background z-10", row.bold && "bg-muted")}>{row.label}</TableCell>
                              <TableCell className="text-right">{row.values ? formatAmount(0, currency, baseCurrencyCode) : ''}</TableCell>
                              <TableCell className="text-right">{row.values ? formatAmount(0, currency, baseCurrencyCode) : ''}</TableCell>
                              {(row.values ?? Array(12).fill(null)).map((v, i) => (
                                <TableCell key={i} className="text-right">{v !== null ? formatAmount(v, currency, baseCurrencyCode) : ''}</TableCell>
                              ))}
                              <TableCell className="text-right">{fullYear !== null ? formatAmount(fullYear, currency, baseCurrencyCode) : ''}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </TableWithSearch>
                  </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default IncomeStatement;
