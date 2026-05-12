import React, { useMemo, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { MultiSelectDropdown } from '@/components/ground-handling/MultiSelectDropdown';
import { Search, RotateCcw, FileDown, Printer } from 'lucide-react';
import { toast } from 'sonner';

const cities = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna'];
const hubsByCity: Record<string, string[]> = {
  Dhaka: ['Dhanmondi Hub', 'Mirpur 10 Hub', 'Khilgaon Hub', 'Jatrabari Hub', 'Uttara', 'Lalbagh Hub', 'Tongi Hub'],
  Chittagong: ['GEC Hub', 'Agrabad Hub'],
  Sylhet: ['Zindabazar Hub'],
  Rajshahi: ['Shaheb Bazar Hub'],
  Khulna: ['Sonadanga Hub'],
};

interface SummaryRow {
  hub: string;
  city: string;
  initial: number;
  interest: number;
  liability: number;
  amortization: number;
  rouBalance: number;
  totalExpenses: number;
  vds: number;
  tds: number;
  netPayment: number;
}

const allRows: SummaryRow[] = [
  { hub: 'Dhanmondi Hub', city: 'Dhaka', initial: 18051549, interest: 148182, liability: 17561886, amortization: 300859, rouBalance: 17148972, totalExpenses: 449042, vds: 48024, tds: 16008, netPayment: 304152 },
  { hub: 'Mirpur 10 Hub', city: 'Dhaka', initial: 13813810, interest: 113395, liability: 13439100, amortization: 230230, rouBalance: 13123120, totalExpenses: 343626, vds: 36750, tds: 12250, netPayment: 232750 },
  { hub: 'Khilgaon Hub', city: 'Dhaka', initial: 21621226, interest: 178037, liability: 21105439, amortization: 360354, rouBalance: 20900518, totalExpenses: 538390, vds: 57000, tds: 19000, netPayment: 361000 },
  { hub: 'Jatrabari Hub', city: 'Dhaka', initial: 3539782, interest: 29139, liability: 3453156, amortization: 58996, rouBalance: 3421789, totalExpenses: 88135, vds: 9474, tds: 3158, netPayment: 60000 },
  { hub: 'Uttara', city: 'Dhaka', initial: 11441512, interest: 94791, liability: 11241648, amortization: 190692, rouBalance: 11060128, totalExpenses: 285483, vds: 29754, tds: 9918, netPayment: 188442 },
  { hub: 'Lalbagh Hub', city: 'Dhaka', initial: 14338287, interest: 119486, liability: 14167972, amortization: 238971, rouBalance: 14099315, totalExpenses: 358457, vds: 37800, tds: 12600, netPayment: 239400 },
  { hub: 'Tongi Hub', city: 'Dhaka', initial: 8272879, interest: 65316, liability: 7772694, amortization: 137881, rouBalance: 8134997, totalExpenses: 203197, vds: 21750, tds: 7250, netPayment: 101500 },
  { hub: 'GEC Hub', city: 'Chittagong', initial: 9540000, interest: 78500, liability: 9300000, amortization: 159000, rouBalance: 9100000, totalExpenses: 237500, vds: 25000, tds: 8500, netPayment: 168000 },
  { hub: 'Agrabad Hub', city: 'Chittagong', initial: 7250000, interest: 59500, liability: 7050000, amortization: 120800, rouBalance: 6900000, totalExpenses: 180300, vds: 19000, tds: 6400, netPayment: 128000 },
  { hub: 'Zindabazar Hub', city: 'Sylhet', initial: 5120000, interest: 42100, liability: 4980000, amortization: 85300, rouBalance: 4870000, totalExpenses: 127400, vds: 13500, tds: 4500, netPayment: 89500 },
  { hub: 'Shaheb Bazar Hub', city: 'Rajshahi', initial: 4350000, interest: 35800, liability: 4230000, amortization: 72500, rouBalance: 4140000, totalExpenses: 108300, vds: 11500, tds: 3850, netPayment: 76200 },
  { hub: 'Sonadanga Hub', city: 'Khulna', initial: 3980000, interest: 32700, liability: 3870000, amortization: 66300, rouBalance: 3790000, totalExpenses: 99000, vds: 10500, tds: 3500, netPayment: 69800 },
];

const fmt = (n: number) =>
  n === 0 ? '-' : n.toLocaleString('en-US', { maximumFractionDigits: 0 });

export default function LeaseRentSummaryReport() {
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedHubs, setSelectedHubs] = useState<string[]>([]);
  const [fromDate, setFromDate] = useState('2024-09-01');
  const [toDate, setToDate] = useState('2024-09-30');
  const [showReport, setShowReport] = useState(false);

  const availableHubs = useMemo(() => {
    const src = selectedCities.length > 0 ? selectedCities : cities;
    return src.flatMap(c => hubsByCity[c] || []);
  }, [selectedCities]);

  const filteredRows = useMemo(() => {
    return allRows.filter(r => {
      const cityOk = selectedCities.length === 0 || selectedCities.includes(r.city);
      const hubOk = selectedHubs.length === 0 || selectedHubs.includes(r.hub);
      return cityOk && hubOk;
    });
  }, [selectedCities, selectedHubs]);

  const totals = useMemo(() => filteredRows.reduce((a, r) => ({
    initial: a.initial + r.initial,
    interest: a.interest + r.interest,
    liability: a.liability + r.liability,
    amortization: a.amortization + r.amortization,
    rouBalance: a.rouBalance + r.rouBalance,
    totalExpenses: a.totalExpenses + r.totalExpenses,
    vds: a.vds + r.vds,
    tds: a.tds + r.tds,
    netPayment: a.netPayment + r.netPayment,
  }), { initial: 0, interest: 0, liability: 0, amortization: 0, rouBalance: 0, totalExpenses: 0, vds: 0, tds: 0, netPayment: 0 }), [filteredRows]);

  const handleSearch = () => {
    if (!fromDate || !toDate) {
      toast.error('From Date and To Date are required');
      return;
    }
    setShowReport(true);
  };

  const handleReset = () => {
    setSelectedCities([]);
    setSelectedHubs([]);
    setFromDate('');
    setToDate('');
    setShowReport(false);
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-[1600px] mx-auto space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Lease / Rent Summary Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div>
                <Label>City</Label>
                <MultiSelectDropdown
                  options={cities}
                  selected={selectedCities}
                  onChange={(v) => { setSelectedCities(v); setSelectedHubs([]); }}
                  placeholder="All Cities"
                />
              </div>
              <div>
                <Label>Hub</Label>
                <MultiSelectDropdown
                  options={availableHubs}
                  selected={selectedHubs}
                  onChange={setSelectedHubs}
                  placeholder="All Hubs"
                />
              </div>
              <div>
                <Label>From Date <span className="text-destructive">*</span></Label>
                <Input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
              </div>
              <div>
                <Label>To Date <span className="text-destructive">*</span></Label>
                <Input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="h-4 w-4 mr-2" /> Reset
              </Button>
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" /> Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {showReport && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Lease / Rent Summary Report</CardTitle>
                <div className="text-sm text-muted-foreground mt-1">
                  {selectedCities.length === 0 ? 'All Cities' : selectedCities.join(', ')} &nbsp;|&nbsp;
                  {selectedHubs.length === 0 ? ' All Hubs' : ' ' + selectedHubs.join(', ')} &nbsp;|&nbsp;
                  {fromDate} to {toDate} &nbsp;|&nbsp; Currency: BDT
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm"><FileDown className="h-4 w-4 mr-2" />Export</Button>
                <Button variant="outline" size="sm"><Printer className="h-4 w-4 mr-2" />Print</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <TableWithSearch className="text-xs">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="border">SL</TableHead>
                      <TableHead className="border">Hub</TableHead>
                      <TableHead className="border">City</TableHead>
                      <TableHead className="border text-right">Initial ROUA and LL</TableHead>
                      <TableHead className="border text-right">Interest</TableHead>
                      <TableHead className="border text-right">Liability</TableHead>
                      <TableHead className="border text-right">Amortization</TableHead>
                      <TableHead className="border text-right">Balance of RoU Assets</TableHead>
                      <TableHead className="border text-right">Total Expenses</TableHead>
                      <TableHead className="border text-right">VDS</TableHead>
                      <TableHead className="border text-right">TDS</TableHead>
                      <TableHead className="border text-right">Net Payment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRows.map((r, i) => (
                      <TableRow key={r.hub}>
                        <TableCell className="border">{i + 1}</TableCell>
                        <TableCell className="border">{r.hub}</TableCell>
                        <TableCell className="border">{r.city}</TableCell>
                        <TableCell className="border text-right">{fmt(r.initial)}</TableCell>
                        <TableCell className="border text-right">{fmt(r.interest)}</TableCell>
                        <TableCell className="border text-right">{fmt(r.liability)}</TableCell>
                        <TableCell className="border text-right">{fmt(r.amortization)}</TableCell>
                        <TableCell className="border text-right">{fmt(r.rouBalance)}</TableCell>
                        <TableCell className="border text-right font-semibold">{fmt(r.totalExpenses)}</TableCell>
                        <TableCell className="border text-right">{fmt(r.vds)}</TableCell>
                        <TableCell className="border text-right">{fmt(r.tds)}</TableCell>
                        <TableCell className="border text-right">{fmt(r.netPayment)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow key="__total" className="bg-muted font-semibold">
                      <TableCell className="border" colSpan={3}>Total</TableCell>
                      <TableCell className="border text-right">{fmt(totals.initial)}</TableCell>
                      <TableCell className="border text-right">{fmt(totals.interest)}</TableCell>
                      <TableCell className="border text-right">{fmt(totals.liability)}</TableCell>
                      <TableCell className="border text-right">{fmt(totals.amortization)}</TableCell>
                      <TableCell className="border text-right">{fmt(totals.rouBalance)}</TableCell>
                      <TableCell className="border text-right">{fmt(totals.totalExpenses)}</TableCell>
                      <TableCell className="border text-right">{fmt(totals.vds)}</TableCell>
                      <TableCell className="border text-right">{fmt(totals.tds)}</TableCell>
                      <TableCell className="border text-right">{fmt(totals.netPayment)}</TableCell>
                    </TableRow>
                  </TableBody>
                </TableWithSearch>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
