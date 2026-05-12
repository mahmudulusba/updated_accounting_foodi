import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar as CalendarIcon, Download, Printer } from 'lucide-react';
import { format, parseISO, eachDayOfInterval, subDays } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

const currencyNames: Record<string, string> = {
  USD: 'US Dollar',
  INR: 'Indian Rupee',
  SGD: 'Singapurai Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  AED: 'UAE Dirham',
  MYR: 'Malaysian Ringgit',
  THB: 'Thai Baht',
};

interface RateRecord {
  date: string;
  currency: string;
  currencyName: string;
  exchangeRate: number;
  setupDate: string;
  setupBy: string;
}

const users = ['Farzana', 'Mahmudul', 'Raihan', 'Nusrat', 'Tanvir'];

const generateMockRates = (): RateRecord[] => {
  const records: RateRecord[] = [];
  const baseRates: Record<string, number> = {
    USD: 121.25,
    INR: 1.35,
    SGD: 135.35,
    EUR: 128.50,
    GBP: 145.20,
    AED: 33.05,
    MYR: 25.80,
    THB: 3.42,
  };

  const days = eachDayOfInterval({
    start: subDays(new Date(), 30),
    end: new Date(),
  });

  days.forEach((day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    Object.entries(baseRates).forEach(([currency, base]) => {
      const variance = (Math.random() - 0.5) * 0.04;
      records.push({
        date: dateStr,
        currency,
        currencyName: currencyNames[currency] || currency,
        exchangeRate: parseFloat((base * (1 + variance)).toFixed(2)),
        setupDate: dateStr,
        setupBy: users[Math.floor(Math.random() * users.length)],
      });
      // Add IATA variant
      records.push({
        date: dateStr,
        currency,
        currencyName: `${currency}-IATA`,
        exchangeRate: parseFloat((base * (1 + variance) * 0.99).toFixed(2)),
        setupDate: dateStr,
        setupBy: users[Math.floor(Math.random() * users.length)],
      });
    });
  });

  return records;
};

const allRateData = generateMockRates();

export default function CurrencyRateReport() {
  const [fromDate, setFromDate] = useState<Date>(subDays(new Date(), 7));
  const [toDate, setToDate] = useState<Date>(new Date());

  const filteredData = useMemo(() => {
    return allRateData
      .filter((row) => {
        const rowDate = parseISO(row.date);
        return rowDate >= fromDate && rowDate <= toDate;
      })
      .sort((a, b) => {
        const dateCmp = b.date.localeCompare(a.date);
        if (dateCmp !== 0) return dateCmp;
        return a.currency.localeCompare(b.currency);
      });
  }, [fromDate, toDate]);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <nav className="text-sm text-muted-foreground">
          <span className="text-primary font-medium">Reports</span> / Currency Rate Report
        </nav>

        <Card>
          <CardContent className="pt-4 space-y-4">
            {/* Title */}
            <h1 className="text-lg font-bold text-center border-b pb-2">Currency Rate Report</h1>

            {/* Date Range Filter */}
            <div className="flex flex-wrap items-end gap-4 justify-center">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-semibold whitespace-nowrap">Date Range</Label>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">From</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-40 justify-start text-left font-normal h-9", !fromDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fromDate ? format(fromDate, 'dd-MMM-yy') : 'Select'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={fromDate} onSelect={(d) => { if (d) { setFromDate(d); setCurrentPage(1); } }} initialFocus className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">To</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-40 justify-start text-left font-normal h-9", !toDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {toDate ? format(toDate, 'dd-MMM-yy') : 'Select'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={toDate} onSelect={(d) => { if (d) { setToDate(d); setCurrentPage(1); } }} initialFocus className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1.5 h-9">
                  <Printer size={14} /> Print
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5 h-9">
                  <Download size={14} /> Export
                </Button>
              </div>
            </div>

            {/* Data Table */}
            <div className="border rounded-md">
              <TableWithSearch>
                <TableHeader>
                  <TableRow className="bg-table-header hover:bg-table-header">
                    <TableHead className="text-table-header-foreground font-semibold w-16 text-center">Sl No</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Date</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Currency</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Currency Name</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold text-right">Exchange Rate (BDT)</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Setup Date</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Setup By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No rate data found for the selected date range
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedData.map((row, idx) => (
                      <TableRow key={`${row.date}-${row.currency}-${row.currencyName}-${idx}`}>
                        <TableCell className="text-center text-muted-foreground">{(currentPage - 1) * pageSize + idx + 1}</TableCell>
                        <TableCell className="font-medium">{format(parseISO(row.date), 'dd-MMM-yy')}</TableCell>
                        <TableCell>
                          <span className="font-medium">{row.currency}</span>
                        </TableCell>
                        <TableCell>{row.currencyName}</TableCell>
                        <TableCell className="text-right font-mono">{row.exchangeRate.toFixed(2)}</TableCell>
                        <TableCell>{format(parseISO(row.setupDate), 'dd-MMM-yy')}</TableCell>
                        <TableCell>{row.setupBy}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </TableWithSearch>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length}
                </span>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>First</Button>
                  <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>Prev</Button>
                  <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>Next</Button>
                  <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>Last</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
