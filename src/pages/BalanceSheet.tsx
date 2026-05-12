import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, FileSpreadsheet, FileText, Settings, ChevronDown, ChevronRight } from 'lucide-react';
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

interface BSDetailRow { label: string; bold?: boolean; values?: number[]; }
const bsDetailRows: BSDetailRow[] = [
  { label: 'Current assets:', bold: true, values: Array(12).fill(0) },
  { label: 'Cash & Cash Equivalents', values: Array(12).fill(0) },
  { label: 'Accounts Receivable', values: Array(12).fill(0) },
  { label: 'RECEIVABLE VAT - BALOCHISTAN' },
  { label: 'RECEIVABLE VAT - KHYBER PAKHTUNKHWA' },
  { label: 'RECEIVABLE VAT - INTERNATIONAL - MERCHANDISE' },
  { label: 'RECEIVABLE VAT - INTERNATIONAL - SERVICES', values: Array(12).fill(0) },
  { label: 'CLEARING ACCOUNT' },
  { label: 'Copyrights' },
  { label: 'Loan receivables' },
  { label: 'Deferred selling costs' },
  { label: 'Investment securities' },
  { label: 'Total current assets', bold: true, values: Array(12).fill(0) },
  { label: 'Non-current assets:', bold: true, values: Array(12).fill(0) },
  { label: 'Computer equipment and software, net', values: Array(12).fill(0) },
  { label: 'Computer equipment, net', values: Array(12).fill(0) },
  { label: 'IT EQUIPMENTS AND INFRASTRUCTURE', values: Array(12).fill(0) },
  { label: 'ACC DEPR IT EQUIPMENTS AND INFRASTRUCT', values: Array(12).fill(0) },
  { label: 'Computer software, net', values: Array(12).fill(0) },
  { label: 'SOFTWARES', values: Array(12).fill(0) },
];


interface BalanceSheetItem {
  id: string;
  particulars: string;
  currentYear: number;
  previousYear: number;
  children?: BalanceSheetItem[];
  isTotal?: boolean;
}

const dummyData: BalanceSheetItem[] = [
  { id: '1', particulars: 'Assets', currentYear: 547898276.37, previousYear: 520000000.00, children: [
    { id: '1.1', particulars: 'Current Assets', currentYear: 233148298.37, previousYear: 215000000.00, children: [
      { id: '1.1.1', particulars: 'Cash & Cash Equivalents', currentYear: 85000000.00, previousYear: 78000000.00 },
      { id: '1.1.2', particulars: 'Accounts Receivable', currentYear: 95000000.00, previousYear: 88000000.00 },
      { id: '1.1.3', particulars: 'Inventory - Spare Parts', currentYear: 35148298.37, previousYear: 32000000.00 },
      { id: '1.1.4', particulars: 'Prepaid Expenses', currentYear: 18000000.00, previousYear: 17000000.00 },
    ]},
    { id: '1.2', particulars: 'Non-Current Assets', currentYear: 314749978.00, previousYear: 305000000.00, children: [
      { id: '1.2.1', particulars: 'Aircraft Fleet', currentYear: 250000000.00, previousYear: 245000000.00 },
      { id: '1.2.2', particulars: 'Ground Equipment', currentYear: 35000000.00, previousYear: 32000000.00 },
      { id: '1.2.3', particulars: 'Buildings & Property', currentYear: 25000000.00, previousYear: 24000000.00 },
      { id: '1.2.4', particulars: 'Intangible Assets', currentYear: 4749978.00, previousYear: 4000000.00 },
    ]},
  ]},
  { id: '2', particulars: 'Total Assets', currentYear: 547898276.37, previousYear: 520000000.00, isTotal: true },
  { id: '3', particulars: 'Liabilities', currentYear: 279456236.33, previousYear: 270000000.00, children: [
    { id: '3.1', particulars: 'Current Liabilities', currentYear: 139435617.78, previousYear: 130000000.00, children: [
      { id: '3.1.1', particulars: 'Accounts Payable', currentYear: 65000000.00, previousYear: 60000000.00 },
      { id: '3.1.2', particulars: 'Accrued Expenses', currentYear: 35000000.00, previousYear: 32000000.00 },
      { id: '3.1.3', particulars: 'Unearned Revenue', currentYear: 25435617.78, previousYear: 25000000.00 },
      { id: '3.1.4', particulars: 'Current Portion of Long-term Debt', currentYear: 14000000.00, previousYear: 13000000.00 },
    ]},
    { id: '3.2', particulars: 'Non-Current Liabilities', currentYear: 140020618.55, previousYear: 140000000.00, children: [
      { id: '3.2.1', particulars: 'Long-term Loans', currentYear: 100000000.00, previousYear: 105000000.00 },
      { id: '3.2.2', particulars: 'Lease Obligations', currentYear: 35000000.00, previousYear: 30000000.00 },
      { id: '3.2.3', particulars: 'Deferred Tax Liability', currentYear: 5020618.55, previousYear: 5000000.00 },
    ]},
  ]},
  { id: '4', particulars: 'Total Liabilities', currentYear: 279456236.33, previousYear: 270000000.00, isTotal: true },
  { id: '5', particulars: 'Equity', currentYear: 268442040.04, previousYear: 250000000.00, children: [
    { id: '5.1', particulars: 'Share Capital', currentYear: 150000000.00, previousYear: 150000000.00 },
    { id: '5.2', particulars: 'Retained Earnings', currentYear: 100237553.01, previousYear: 82000000.00 },
    { id: '5.3', particulars: 'Current Year Profit', currentYear: 68204487.03, previousYear: 48750000.00 },
    { id: '5.4', particulars: 'Other Reserves', currentYear: -50000000.00, previousYear: -30750000.00 },
  ]},
  { id: '6', particulars: 'Total Equity', currentYear: 268442040.04, previousYear: 250000000.00, isTotal: true },
  { id: '7', particulars: 'Total Liabilities & Equity', currentYear: 547898276.37, previousYear: 520000000.00, isTotal: true },
];

const BalanceSheet = () => {
  const { isConsolidated, filterBranchCodes, setFilterBranchCodes, isMultipleBranchesSelected, effectiveBaseCurrencyCode } = useBranchFilter();
  const baseCurrencyCode = effectiveBaseCurrencyCode;
  
  const [currency, setCurrency] = useState<CurrencyType>('base');
  const [asOfDate, setAsOfDate] = useState<Date>(new Date());
  const [showReport, setShowReport] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set(['1', '1.1', '1.2', '3', '3.1', '5']));
  const [searchTerm, setSearchTerm] = useState('');
  const [reportMode, setReportMode] = useState<'summary' | 'details'>('summary');

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) { newSet.delete(id); } else { newSet.add(id); }
      return newSet;
    });
  };

  const currencyLabel = getCurrencyLabel(currency, baseCurrencyCode);

  const renderRows = (items: BalanceSheetItem[], level: number = 0): React.ReactNode[] => {
    return items.flatMap((item) => {
      const rows: React.ReactNode[] = [];
      const hasChildren = item.children && item.children.length > 0;
      rows.push(
        <TableRow key={item.id} className={cn("hover:bg-muted/50", item.isTotal && "font-semibold bg-muted")}>
          <TableCell className="w-12">
            {hasChildren && (
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" style={{ marginLeft: `${level * 16}px` }} onClick={() => toggleRow(item.id)}>
                {expandedRows.has(item.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            )}
          </TableCell>
          <TableCell className="font-medium" style={{ paddingLeft: `${level * 16 + 16}px` }}>{item.particulars}</TableCell>
          <TableCell className="text-right">{formatAmount(item.currentYear, currency, baseCurrencyCode)}</TableCell>
          <TableCell className="text-right">{formatAmount(item.previousYear, currency, baseCurrencyCode)}</TableCell>
        </TableRow>
      );
      if (hasChildren && expandedRows.has(item.id)) { rows.push(...renderRows(item.children!, level + 1)); }
      return rows;
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div><h1 className="text-2xl font-semibold text-foreground">Balance Sheet</h1></div>
        <Card>
          <CardHeader><CardTitle className="text-lg">Report Filters</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Report Type</Label>
              <RadioGroup value={reportMode} onValueChange={(v) => { setReportMode(v as 'summary' | 'details'); setShowReport(false); }} className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="summary" id="bs-summary" />
                  <Label htmlFor="bs-summary" className="font-normal cursor-pointer">Summary Report</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="details" id="bs-details" />
                  <Label htmlFor="bs-details" className="font-normal cursor-pointer">Details Report</Label>
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
                <label className="text-sm font-medium">As of Date *</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !asOfDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {asOfDate ? format(asOfDate, "dd-MMM-yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={asOfDate} onSelect={(date) => date && setAsOfDate(date)} initialFocus className="pointer-events-auto" />
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
              <div className="text-center py-12 text-muted-foreground">Click "Generate Report" to view the balance sheet</div>
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <h2 className="text-xl font-semibold">Balance Sheet</h2>
                  <p className="text-muted-foreground">As of {format(asOfDate, "dd-MMM-yyyy")}</p>
                </div>
                <div className="flex items-center justify-between">
                  <Button variant="outline" size="icon"><Settings className="h-4 w-4" /></Button>
                  <Input placeholder="Search all columns..." className="max-w-xs" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="border rounded-lg overflow-hidden">
                  {reportMode === 'summary' ? (
                  <TableWithSearch>
                    <TableHeader>
                      <TableRow className="bg-table-header hover:bg-table-header">
                        <TableHead className="text-table-header-foreground font-bold w-12"></TableHead>
                        <TableHead className="text-table-header-foreground font-bold">Particulars</TableHead>
                        <TableHead className="text-table-header-foreground font-bold text-right">Current Year {currencyLabel}</TableHead>
                        <TableHead className="text-table-header-foreground font-bold text-right">Previous Year {currencyLabel}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>{renderRows(dummyData)}</TableBody>
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
                        {bsDetailRows.map((row, idx) => {
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

export default BalanceSheet;
