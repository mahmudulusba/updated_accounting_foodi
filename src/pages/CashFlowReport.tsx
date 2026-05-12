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


interface CashFlowItem {
  id: string;
  category: string;
  inflow: number;
  outflow: number;
  net: number;
  children?: CashFlowItem[];
}

const dummyData: CashFlowItem[] = [
  { id: '1', category: 'Operating Activities', inflow: 3500000000.00, outflow: 3200000000.00, net: 300000000.00, children: [
    { id: '1.1', category: 'Cash from Ticket Sales', inflow: 2850000000.00, outflow: 0.00, net: 2850000000.00 },
    { id: '1.2', category: 'Cash from Cargo', inflow: 450000000.00, outflow: 0.00, net: 450000000.00 },
    { id: '1.3', category: 'Payment to Suppliers', inflow: 0.00, outflow: 1500000000.00, net: -1500000000.00 },
    { id: '1.4', category: 'Payment to Employees', inflow: 0.00, outflow: 850000000.00, net: -850000000.00 },
    { id: '1.5', category: 'Other Operating Cash Flows', inflow: 200000000.00, outflow: 850000000.00, net: -650000000.00 },
  ]},
  { id: '2', category: 'Investing Activities', inflow: 50000000.00, outflow: 250000000.00, net: -200000000.00, children: [
    { id: '2.1', category: 'Sale of Aircraft Parts', inflow: 50000000.00, outflow: 0.00, net: 50000000.00 },
    { id: '2.2', category: 'Aircraft Purchase/Lease', inflow: 0.00, outflow: 200000000.00, net: -200000000.00 },
    { id: '2.3', category: 'Equipment Purchase', inflow: 0.00, outflow: 50000000.00, net: -50000000.00 },
  ]},
  { id: '3', category: 'Financing Activities', inflow: 100000000.00, outflow: 150000000.00, net: -50000000.00, children: [
    { id: '3.1', category: 'Loan Proceeds', inflow: 100000000.00, outflow: 0.00, net: 100000000.00 },
    { id: '3.2', category: 'Loan Repayment', inflow: 0.00, outflow: 120000000.00, net: -120000000.00 },
    { id: '3.3', category: 'Interest Payment', inflow: 0.00, outflow: 30000000.00, net: -30000000.00 },
  ]},
  { id: '4', category: 'Net Change in Cash', inflow: 3650000000.00, outflow: 3600000000.00, net: 50000000.00 },
];

const CashFlowReport = () => {
  const { isConsolidated, filterBranchCodes, setFilterBranchCodes, isMultipleBranchesSelected, effectiveBaseCurrencyCode } = useBranchFilter();
  const baseCurrencyCode = effectiveBaseCurrencyCode;
  
  const [currency, setCurrency] = useState<CurrencyType>('base');
  const [fromDate, setFromDate] = useState<Date>(new Date(2025, 0, 1));
  const [toDate, setToDate] = useState<Date>(new Date());
  const [showReport, setShowReport] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set(['1', '2', '3']));
  const [searchTerm, setSearchTerm] = useState('');

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) { newSet.delete(id); } else { newSet.add(id); }
      return newSet;
    });
  };

  const currencyLabel = getCurrencyLabel(currency, baseCurrencyCode);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div><h1 className="text-2xl font-semibold text-foreground">Cash Flow Report</h1></div>
        <Card>
          <CardHeader><CardTitle className="text-lg">Report Filters</CardTitle></CardHeader>
          <CardContent className="space-y-6">
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
              <div className="text-center py-12 text-muted-foreground">Click "Generate Report" to view the cash flow report</div>
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <h2 className="text-xl font-semibold">Cash Flow Report</h2>
                  <p className="text-muted-foreground">{format(fromDate, "dd-MMM-yyyy")} To {format(toDate, "dd-MMM-yyyy")}</p>
                </div>
                <div className="flex items-center justify-between">
                  <Button variant="outline" size="icon"><Settings className="h-4 w-4" /></Button>
                  <Input placeholder="Search all columns..." className="max-w-xs" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <TableWithSearch>
                    <TableHeader>
                      <TableRow className="bg-table-header hover:bg-table-header">
                        <TableHead className="text-table-header-foreground font-bold w-12"></TableHead>
                        <TableHead className="text-table-header-foreground font-bold">Category</TableHead>
                        <TableHead className="text-table-header-foreground font-bold text-right">Inflow {currencyLabel}</TableHead>
                        <TableHead className="text-table-header-foreground font-bold text-right">Outflow {currencyLabel}</TableHead>
                        <TableHead className="text-table-header-foreground font-bold text-right">Net {currencyLabel}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dummyData.map((item) => (
                        <React.Fragment key={item.id}>
                          <TableRow className={cn("hover:bg-muted/50", !item.children && "font-semibold bg-muted")}>
                            <TableCell className="w-12">
                              {item.children && <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => toggleRow(item.id)}>
                                {expandedRows.has(item.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                              </Button>}
                            </TableCell>
                            <TableCell className="font-medium">{item.category}</TableCell>
                            <TableCell className="text-right">{formatAmount(item.inflow, currency, baseCurrencyCode)}</TableCell>
                            <TableCell className="text-right">{formatAmount(item.outflow, currency, baseCurrencyCode)}</TableCell>
                            <TableCell className={cn("text-right", item.net < 0 ? "text-red-600" : "text-green-600")}>{formatAmount(item.net, currency, baseCurrencyCode)}</TableCell>
                          </TableRow>
                          {expandedRows.has(item.id) && item.children?.map((child) => (
                            <TableRow key={child.id} className="bg-muted/30 hover:bg-muted/50">
                              <TableCell className="w-12"></TableCell>
                              <TableCell className="pl-8">{child.category}</TableCell>
                              <TableCell className="text-right">{child.inflow > 0 ? formatAmount(child.inflow, currency, baseCurrencyCode) : '-'}</TableCell>
                              <TableCell className="text-right">{child.outflow > 0 ? formatAmount(child.outflow, currency, baseCurrencyCode) : '-'}</TableCell>
                              <TableCell className={cn("text-right", child.net < 0 ? "text-red-600" : "text-green-600")}>{formatAmount(child.net, currency, baseCurrencyCode)}</TableCell>
                            </TableRow>
                          ))}
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </TableWithSearch>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CashFlowReport;
