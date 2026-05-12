import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useApp } from '@/contexts/AppContext';
import { useFilteredGLEntries } from '@/hooks/useAccountingFilter';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, RotateCcw, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgingRow {
  slNo: number;
  glCode: string;
  glName: string;
  last3Month: number;
  days0_30: number;
  days31_90: number;
  days91_180: number;
  days181_365: number;
  daysOver365: number;
  totalAmount: number;
}

// Hardcoded dummy aging data for display
const dummyAgingData: AgingRow[] = [
  { slNo: 1, glCode: '10056', glName: 'NOTES PAYABLE', last3Month: 0, days0_30: 1, days31_90: 0, days91_180: 0, days181_365: 0, daysOver365: 0, totalAmount: 245000 },
  { slNo: 2, glCode: '10057', glName: 'CHEQUES RECEIVABLE', last3Month: 0, days0_30: 0, days31_90: 0, days91_180: 0, days181_365: 0, daysOver365: 0, totalAmount: 0 },
  { slNo: 3, glCode: '10592', glName: 'UN-ISSUED CUSTOMER REFUNDS', last3Month: 0, days0_30: 0, days31_90: 0, days91_180: 0, days181_365: 0, daysOver365: 0, totalAmount: 0 },
  { slNo: 4, glCode: '10590', glName: 'OWN FLEET DELIVERY (COD)', last3Month: 0, days0_30: 0, days31_90: 0, days91_180: 0, days181_365: 0, daysOver365: 0, totalAmount: 0 },
  { slNo: 5, glCode: '11002', glName: 'AR B2B NON-GROUP NATIONAL', last3Month: 0, days0_30: 0, days31_90: 0, days91_180: 0, days181_365: 0, daysOver365: 0, totalAmount: 0 },
  { slNo: 6, glCode: '11101', glName: 'Cash in Hand', last3Month: 2, days0_30: 5, days31_90: 3, days91_180: 1, days181_365: 0, daysOver365: 0, totalAmount: 1850000 },
  { slNo: 7, glCode: '11102', glName: 'Cash at Bank', last3Month: 4, days0_30: 8, days31_90: 6, days91_180: 2, days181_365: 1, daysOver365: 0, totalAmount: 4520000 },
  { slNo: 8, glCode: '11201', glName: 'Trade Receivables', last3Month: 3, days0_30: 12, days31_90: 7, days91_180: 4, days181_365: 2, daysOver365: 1, totalAmount: 8750000 },
  { slNo: 9, glCode: '11301', glName: 'Employee Advance', last3Month: 1, days0_30: 3, days31_90: 2, days91_180: 1, days181_365: 0, daysOver365: 0, totalAmount: 320000 },
  { slNo: 10, glCode: '11302', glName: 'Supplier Advance', last3Month: 0, days0_30: 2, days31_90: 1, days91_180: 0, days181_365: 0, daysOver365: 0, totalAmount: 560000 },
  { slNo: 11, glCode: '11303', glName: 'Security Deposit', last3Month: 0, days0_30: 0, days31_90: 0, days91_180: 0, days181_365: 1, daysOver365: 1, totalAmount: 1200000 },
  { slNo: 12, glCode: '21101', glName: 'Trade Payables', last3Month: 5, days0_30: 15, days31_90: 9, days91_180: 3, days181_365: 2, daysOver365: 1, totalAmount: 6340000 },
  { slNo: 13, glCode: '21201', glName: 'Customer Advance', last3Month: 2, days0_30: 6, days31_90: 4, days91_180: 1, days181_365: 0, daysOver365: 0, totalAmount: 2150000 },
  { slNo: 14, glCode: '41101', glName: 'Operating Revenue', last3Month: 8, days0_30: 22, days31_90: 18, days91_180: 12, days181_365: 5, daysOver365: 2, totalAmount: 32500000 },
  { slNo: 15, glCode: '51101', glName: 'Office Expenses', last3Month: 3, days0_30: 7, days31_90: 5, days91_180: 2, days181_365: 0, daysOver365: 0, totalAmount: 890000 },
  { slNo: 16, glCode: '51102', glName: 'Conveyance Expenses', last3Month: 1, days0_30: 4, days31_90: 3, days91_180: 1, days181_365: 0, daysOver365: 0, totalAmount: 475000 },
  { slNo: 17, glCode: '51201', glName: 'Staff Expenses', last3Month: 6, days0_30: 10, days31_90: 8, days91_180: 4, days181_365: 1, daysOver365: 0, totalAmount: 5620000 },
  { slNo: 18, glCode: '51301', glName: 'Utility Expenses', last3Month: 2, days0_30: 6, days31_90: 4, days91_180: 2, days181_365: 0, daysOver365: 0, totalAmount: 340000 },
];

function getFilteredAgingData(accountCode: string): AgingRow[] {
  if (accountCode && accountCode !== '__all__') {
    const filtered = dummyAgingData.filter(d => d.glCode === accountCode);
    return filtered.map((r, i) => ({ ...r, slNo: i + 1 }));
  }
  return dummyAgingData;
}

export default function GLAgingReport() {
  const { glEntries } = useApp();
  const filteredGLEntries = useFilteredGLEntries(glEntries);

  const [glType, setGlType] = useState<string>('subsidiary');
  const [accountName, setAccountName] = useState<string>('');
  const [dateFrom, setDateFrom] = useState('2026-01-01');
  const [dateTo, setDateTo] = useState('2026-03-31');
  const [showResults, setShowResults] = useState(false);

  const glOptions = useMemo(() => {
    return filteredGLEntries.map(e => ({
      value: e.glCode,
      label: `${e.glCode} - ${e.glName}`,
      name: e.glName,
    }));
  }, [filteredGLEntries]);

  const selectedGL = glOptions.find(o => o.value === accountName);

  const agingData = useMemo(() => {
    if (!showResults) return [];
    return getFilteredAgingData(accountName);
  }, [showResults, accountName]);

  const handleSearch = () => setShowResults(true);
  const handleReset = () => {
    setGlType('subsidiary');
    setAccountName('');
    setDateFrom('2026-01-01');
    setDateTo('2026-03-31');
    setShowResults(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <nav className="text-sm text-muted-foreground">
          <span className="text-primary font-medium">Reports</span> / GL Aging Report
        </nav>

        <h1 className="text-xl font-bold">GL Aging Report</h1>

        {/* Filter Criteria */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">GL Aging Report Filtering Criteria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* GL Type */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">GL Type <span className="text-destructive">*</span></Label>
                <RadioGroup value={glType} onValueChange={setGlType} className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="parent" id="gl-parent" />
                    <Label htmlFor="gl-parent" className="text-sm font-normal cursor-pointer">Parent</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="subsidiary" id="gl-subsidiary" />
                    <Label htmlFor="gl-subsidiary" className="text-sm font-normal cursor-pointer">Subsidiary</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Account Name */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Account Name</Label>
                <Select value={accountName} onValueChange={setAccountName}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">All Accounts</SelectItem>
                    {glOptions.map(o => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Account Number (readonly) */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Account Number</Label>
                <Input
                  value={accountName && accountName !== '__all__' ? accountName : ''}
                  readOnly
                  className="bg-muted"
                  placeholder="Auto-filled from Account Name"
                />
              </div>

              {/* Date Range */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Date Range <span className="text-destructive">*</span></Label>
                <div className="flex items-center gap-2">
                  <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="flex-1" />
                  <span className="text-sm text-muted-foreground">to</span>
                  <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="flex-1" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 mt-6">
              <Button onClick={handleSearch} className="min-w-[120px]">
                <Search size={16} className="mr-2" /> Search
              </Button>
              <Button variant="outline" onClick={handleReset} className="min-w-[120px]">
                <RotateCcw size={16} className="mr-2" /> Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Table */}
        {showResults && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {agingData.length} records | Date Range: {dateFrom} to {dateTo}
              </p>
              <Button variant="outline" size="sm">
                <Download size={16} className="mr-2" /> Export
              </Button>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <TableWithSearch>
                <TableHeader>
                  <TableRow className="bg-table-header hover:bg-table-header">
                    <TableHead rowSpan={2} className="text-table-header-foreground font-semibold border-r text-center align-middle">SL No</TableHead>
                    <TableHead rowSpan={2} className="text-table-header-foreground font-semibold border-r align-middle">GL Code</TableHead>
                    <TableHead rowSpan={2} className="text-table-header-foreground font-semibold border-r align-middle">GL Name</TableHead>
                    <TableHead rowSpan={2} className="text-table-header-foreground font-semibold border-r text-center align-middle">
                      <div>Last 3 Month</div>
                      <div className="text-xs font-normal text-muted-foreground">(Before date range)</div>
                    </TableHead>
                    <TableHead colSpan={5} className="text-table-header-foreground font-semibold text-center border-b border-r">Number of Transaction</TableHead>
                    <TableHead rowSpan={2} className="text-table-header-foreground font-semibold text-right align-middle">
                      <div>Total Amount</div>
                      <div className="text-xs font-normal">(BDT)</div>
                    </TableHead>
                  </TableRow>
                  <TableRow className="bg-table-header hover:bg-table-header">
                    <TableHead className="text-table-header-foreground font-semibold text-center border-r text-xs">0-30 days</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold text-center border-r text-xs">31-90 days</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold text-center border-r text-xs">91-180 days</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold text-center border-r text-xs">181-365 days</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold text-center border-r text-xs">+365 days</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agingData.map((row) => (
                    <TableRow key={row.glCode} className="hover:bg-muted/50">
                      <TableCell className="text-center border-r">{row.slNo}</TableCell>
                      <TableCell className="font-mono text-sm border-r">{row.glCode}</TableCell>
                      <TableCell className="border-r">{row.glName}</TableCell>
                      <TableCell className="text-center border-r">
                        {row.last3Month > 0 ? row.last3Month : '-'}
                      </TableCell>
                      <TableCell className={cn("text-center border-r", row.days0_30 > 0 && "bg-success/10")}>
                        {row.days0_30 > 0 ? row.days0_30 : '-'}
                      </TableCell>
                      <TableCell className={cn("text-center border-r", row.days31_90 > 0 && "bg-success/10")}>
                        {row.days31_90 > 0 ? row.days31_90 : '-'}
                      </TableCell>
                      <TableCell className={cn("text-center border-r", row.days91_180 > 0 && "bg-warning/10")}>
                        {row.days91_180 > 0 ? row.days91_180 : '-'}
                      </TableCell>
                      <TableCell className={cn("text-center border-r", row.days181_365 > 0 && "bg-warning/10")}>
                        {row.days181_365 > 0 ? row.days181_365 : '-'}
                      </TableCell>
                      <TableCell className={cn("text-center border-r", row.daysOver365 > 0 && "bg-destructive/10")}>
                        {row.daysOver365 > 0 ? row.daysOver365 : '-'}
                      </TableCell>
                      <TableCell className="text-right font-mono font-semibold bg-success/20">
                        {row.totalAmount > 0 ? `৳${row.totalAmount.toLocaleString()}` : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                  {agingData.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                        No data found for the selected criteria
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </TableWithSearch>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
