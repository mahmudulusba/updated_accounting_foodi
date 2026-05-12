import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Printer, FileSpreadsheet, FileText, Settings, Search, Minus, Plus, CalendarIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { TableWithSearch } from '@/components/ui/table-with-search';
const dummyRows = [
  { sl: 1, date: 'Opening Balance', dr: 0, cr: 0, current: 0, cumulative: 25330000, cumulativeType: 'Cr.' as const, hasAction: false },
  { sl: 2, date: 'October -2025', dr: 0, cr: 4860000, current: 4860000, currentType: 'Cr.' as const, cumulative: 30190000, cumulativeType: 'Cr.' as const, hasAction: true },
];

const fmt = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const GeneralLedgerSummaryReport = () => {
  const [accountNumber, setAccountNumber] = useState('41201002');
  const [accountName] = useState('Cash Back Income');
  const [fromDate, setFromDate] = useState<Date | undefined>(new Date(2025, 9, 1));
  const [toDate, setToDate] = useState<Date | undefined>(new Date(2026, 3, 30));
  const [sbu, setSbu] = useState(''); const [city, setCity] = useState('');
  const [hub, setHub] = useState(''); const [department, setDepartment] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [showPreview, setShowPreview] = useState(true);
  const [showReport, setShowReport] = useState(true);
  const [search, setSearch] = useState('');

  const totalDr = dummyRows.filter(r => r.sl > 0 && r.date !== 'Opening Balance').reduce((s, r) => s + r.dr, 0);
  const totalCr = dummyRows.filter(r => r.sl > 0 && r.date !== 'Opening Balance').reduce((s, r) => s + r.cr, 0);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-4">
        <nav className="text-sm text-muted-foreground">
          <span className="text-primary font-medium">Reports</span> / General Ledger Summary Report
        </nav>

        <Card className="border-2">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h3 className="font-semibold text-foreground">General Ledger Summary Filters</h3>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowFilters(s => !s)}>
              {showFilters ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </Button>
          </div>
          {showFilters && (
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-foreground mb-3">GL Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Account Number <span className="text-destructive">*</span></Label>
                      <div className="relative">
                        <Input placeholder="Enter Account Number" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} />
                        <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-10 w-10 text-primary"><Search className="h-4 w-4" /></Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Account Name</Label>
                      <Input value={accountName} readOnly className="bg-muted" placeholder="Select Account To Autofill" />
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-3">Date Range</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>From Date <span className="text-destructive">*</span></Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !fromDate && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />{fromDate ? format(fromDate, "dd MMM yyyy") : "dd MMM yyyy"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={fromDate} onSelect={setFromDate} className="pointer-events-auto" /></PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label>To Date <span className="text-destructive">*</span></Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !toDate && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />{toDate ? format(toDate, "dd MMM yyyy") : "dd MMM yyyy"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={toDate} onSelect={setToDate} className="pointer-events-auto" /></PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-3">Other Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { label: 'SBU', val: sbu, set: setSbu },
                    { label: 'City', val: city, set: setCity },
                    { label: 'Hub', val: hub, set: setHub },
                    { label: 'Department', val: department, set: setDepartment },
                  ].map(f => (
                    <div key={f.label} className="space-y-2">
                      <Label className="text-center block">{f.label}</Label>
                      <Select value={f.val} onValueChange={f.set}>
                        <SelectTrigger><SelectValue placeholder="--- Select ---" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="opt1">Option 1</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center gap-3">
                <Button variant="destructive" onClick={() => setShowReport(false)}>Clear</Button>
                <Button className="bg-primary" onClick={() => setShowReport(true)}>Generate Report</Button>
              </div>
            </CardContent>
          )}
        </Card>

        <Card className="border-2">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h3 className="font-semibold text-foreground">General Ledger Summary Preview</h3>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowPreview(s => !s)}>
              {showPreview ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </Button>
          </div>
          {showPreview && (
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-end gap-2">
                <Button size="icon" className="bg-primary"><Printer className="h-4 w-4" /></Button>
                <Button size="icon" className="bg-destructive hover:bg-destructive/90"><FileText className="h-4 w-4" /></Button>
                <Button size="icon" className="bg-blue-600 hover:bg-blue-700"><FileSpreadsheet className="h-4 w-4" /></Button>
              </div>
              {showReport && (
                <>
                  <div className="border rounded">
                    <div className="text-center py-3 font-bold text-lg border-b">General Ledger Summary Report</div>
                    <div className="grid grid-cols-3 px-4 py-2 text-sm">
                      <div><strong>Account No:</strong> {accountNumber}</div>
                      <div className="text-center"><strong>Account Name:</strong> {accountName}</div>
                      <div className="text-right"><strong>Date Range:</strong> {fromDate && format(fromDate, 'dd MMM yyyy')} - {toDate && format(toDate, 'dd MMM yyyy')}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Button size="icon" className="bg-primary"><Settings className="h-4 w-4" /></Button>
                    <Input placeholder="Search all columns..." className="max-w-xs" value={search} onChange={e => setSearch(e.target.value)} />
                  </div>
                  <div className="border rounded overflow-hidden">
                    <TableWithSearch>
                      <TableHeader>
                        <TableRow className="bg-primary hover:bg-primary">
                          <TableHead className="text-primary-foreground text-center">SL</TableHead>
                          <TableHead className="text-primary-foreground">Document Date</TableHead>
                          <TableHead className="text-primary-foreground text-right">Dr Amount</TableHead>
                          <TableHead className="text-primary-foreground text-right">Cr Amount</TableHead>
                          <TableHead className="text-primary-foreground text-right">Current Balance</TableHead>
                          <TableHead className="text-primary-foreground text-right">Cumulative Balance</TableHead>
                          <TableHead className="text-primary-foreground text-center">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dummyRows.map(r => (
                          <TableRow key={r.sl}>
                            <TableCell className="text-center">{r.sl}</TableCell>
                            <TableCell>{r.date}</TableCell>
                            <TableCell className="text-right">{fmt(r.dr)}</TableCell>
                            <TableCell className="text-right">{fmt(r.cr)}</TableCell>
                            <TableCell className="text-right">{fmt(r.current)}{r.current > 0 && r.currentType ? ' ' + r.currentType : ''}</TableCell>
                            <TableCell className="text-right">{fmt(r.cumulative)} {r.cumulativeType}</TableCell>
                            <TableCell className="text-center">{r.hasAction && <Button size="icon" variant="ghost" className="h-7 w-7 bg-primary text-primary-foreground"><FileText className="h-4 w-4" /></Button>}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="bg-muted font-semibold">
                          <TableCell colSpan={2} className="text-right">Grand Total:</TableCell>
                          <TableCell className="text-right">{fmt(totalDr)}</TableCell>
                          <TableCell className="text-right">{fmt(totalCr)}</TableCell>
                          <TableCell className="text-right">{fmt(totalCr - totalDr)} Cr.</TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableBody>
                    </TableWithSearch>
                  </div>
                </>
              )}
            </CardContent>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default GeneralLedgerSummaryReport;