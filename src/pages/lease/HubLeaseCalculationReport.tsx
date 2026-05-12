import React, { useMemo, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Search, RotateCcw, FileDown, Printer } from 'lucide-react';
import { toast } from 'sonner';

const cities = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna'];
const hubs: Record<string, string[]> = {
  Dhaka: ['Dhanmondi Hub', 'Gulshan Hub', 'Uttara Hub', 'Mirpur Hub'],
  Chittagong: ['GEC Hub', 'Agrabad Hub'],
  Sylhet: ['Zindabazar Hub'],
  Rajshahi: ['Shaheb Bazar Hub'],
  Khulna: ['Sonadanga Hub'],
};

interface ScheduleRow {
  month: string;
  period: number;
  rentalPayment: number;
  initialDirectCost: number;
  leaseIncentive: number;
  penalty: number;
  purchaseOption: number;
  totalCashFlow: number;
  pv: number;
  interest: number;
  liabilityBalance: number;
  rentalExp: number;
  plInterest: number;
  amortization: number;
  rouBalance: number;
  vds: number;
  tds: number;
  netPayment: number;
}

// Sample amortization schedule modeled on the uploaded "Dhanmondi Hub" sheet
const buildSampleSchedule = (): ScheduleRow[] => {
  const rows: ScheduleRow[] = [];
  const startLiability = 18051549.18;
  const monthlyRate = 0.008333;
  const rental = 368184;
  const amort = 300859.153042;
  const vds = 48024;
  const tds = 16008;
  let liability = startLiability;
  let rou = startLiability;

  rows.push({
    month: '2024-07-01',
    period: 0,
    rentalPayment: 0,
    initialDirectCost: 0,
    leaseIncentive: 0,
    penalty: 0,
    purchaseOption: 0,
    totalCashFlow: 0,
    pv: 0,
    interest: 0,
    liabilityBalance: liability,
    rentalExp: 0,
    plInterest: 0,
    amortization: 0,
    rouBalance: rou,
    vds: 0,
    tds: 0,
    netPayment: 0,
  });

  for (let p = 1; p <= 24; p++) {
    const interest = liability * monthlyRate;
    liability = liability + interest - rental;
    rou = rou - amort;
    const date = new Date(2024, 6 + p, 0); // last day of month
    rows.push({
      month: date.toISOString().slice(0, 10),
      period: p,
      rentalPayment: rental,
      initialDirectCost: 0,
      leaseIncentive: 0,
      penalty: 0,
      purchaseOption: 0,
      totalCashFlow: rental,
      pv: rental / Math.pow(1 + monthlyRate, p),
      interest,
      liabilityBalance: Math.max(liability, 0),
      rentalExp: interest + amort,
      plInterest: interest,
      amortization: amort,
      rouBalance: Math.max(rou, 0),
      vds,
      tds,
      netPayment: rental - vds - tds,
    });
  }
  return rows;
};

const fmt = (n: number) =>
  n === 0 ? '-' : n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function HubLeaseCalculationReport() {
  const [city, setCity] = useState('');
  const [hub, setHub] = useState('');
  const [fromDate, setFromDate] = useState('2024-07-01');
  const [toDate, setToDate] = useState('2026-06-30');
  const [showReport, setShowReport] = useState(false);

  const schedule = useMemo(() => buildSampleSchedule(), []);

  const handleSearch = () => {
    if (!city || !hub || !fromDate || !toDate) {
      toast.error('City, Hub and Date Range are required');
      return;
    }
    setShowReport(true);
  };

  const handleReset = () => {
    setCity('');
    setHub('');
    setFromDate('');
    setToDate('');
    setShowReport(false);
  };

  const totals = useMemo(() => {
    return schedule.reduce(
      (acc, r) => ({
        rental: acc.rental + r.rentalPayment,
        cashFlow: acc.cashFlow + r.totalCashFlow,
        pv: acc.pv + r.pv,
        interest: acc.interest + r.interest,
        rentalExp: acc.rentalExp + r.rentalExp,
        amort: acc.amort + r.amortization,
        vds: acc.vds + r.vds,
        tds: acc.tds + r.tds,
        net: acc.net + r.netPayment,
      }),
      { rental: 0, cashFlow: 0, pv: 0, interest: 0, rentalExp: 0, amort: 0, vds: 0, tds: 0, net: 0 }
    );
  }, [schedule]);

  return (
    <DashboardLayout>
      <div className="p-6 max-w-[1600px] mx-auto space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Hub-wise Lease Calculation Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div>
                <Label>City <span className="text-destructive">*</span></Label>
                <Select value={city} onValueChange={v => { setCity(v); setHub(''); }}>
                  <SelectTrigger><SelectValue placeholder="Select City" /></SelectTrigger>
                  <SelectContent>
                    {cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Hub <span className="text-destructive">*</span></Label>
                <Select value={hub} onValueChange={setHub} disabled={!city}>
                  <SelectTrigger><SelectValue placeholder="Select Hub" /></SelectTrigger>
                  <SelectContent>
                    {(hubs[city] || []).map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                  </SelectContent>
                </Select>
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
                <CardTitle className="text-lg">Hub-wise Lease Calculation Report</CardTitle>
                <div className="text-sm text-muted-foreground mt-1">
                  {city} / {hub} &nbsp;|&nbsp; {fromDate} to {toDate} &nbsp;|&nbsp; Currency: BDT
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Annual Discount Rate: 10.00% &nbsp;•&nbsp; Monthly Discount Rate: 0.8333%
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
                      <TableHead rowSpan={2} className="border">Month</TableHead>
                      <TableHead rowSpan={2} className="border text-center">Period</TableHead>
                      <TableHead colSpan={6} className="border text-center">Payment</TableHead>
                      <TableHead colSpan={3} className="border text-center">Lease Liability</TableHead>
                      <TableHead colSpan={2} className="border text-center">P/L</TableHead>
                      <TableHead colSpan={2} className="border text-center">RoU Assets</TableHead>
                      <TableHead rowSpan={2} className="border text-right">VDS</TableHead>
                      <TableHead rowSpan={2} className="border text-right">TDS</TableHead>
                      <TableHead rowSpan={2} className="border text-right">Net Payment</TableHead>
                    </TableRow>
                    <TableRow>
                      <TableHead className="border text-right">Rental Payment</TableHead>
                      <TableHead className="border text-right">Initial Direct Cost</TableHead>
                      <TableHead className="border text-right">Lease Incentive</TableHead>
                      <TableHead className="border text-right">Penalty</TableHead>
                      <TableHead className="border text-right">Purchase Option</TableHead>
                      <TableHead className="border text-right">Total Cash Flow</TableHead>
                      <TableHead className="border text-right">PV</TableHead>
                      <TableHead className="border text-right">Interest</TableHead>
                      <TableHead className="border text-right">Balance (B/S)</TableHead>
                      <TableHead className="border text-right">Rental Exp</TableHead>
                      <TableHead className="border text-right">Interest</TableHead>
                      <TableHead className="border text-right">Amortization</TableHead>
                      <TableHead className="border text-right">Balance (B/S)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schedule.map(r => (
                      <TableRow key={r.period}>
                        <TableCell className="border">{r.month}</TableCell>
                        <TableCell className="border text-center">{r.period}</TableCell>
                        <TableCell className="border text-right">{fmt(r.rentalPayment)}</TableCell>
                        <TableCell className="border text-right">{fmt(r.initialDirectCost)}</TableCell>
                        <TableCell className="border text-right">{fmt(r.leaseIncentive)}</TableCell>
                        <TableCell className="border text-right">{fmt(r.penalty)}</TableCell>
                        <TableCell className="border text-right">{fmt(r.purchaseOption)}</TableCell>
                        <TableCell className="border text-right">{fmt(r.totalCashFlow)}</TableCell>
                        <TableCell className="border text-right">{fmt(r.pv)}</TableCell>
                        <TableCell className="border text-right">{fmt(r.interest)}</TableCell>
                        <TableCell className="border text-right">{fmt(r.liabilityBalance)}</TableCell>
                        <TableCell className="border text-right">{fmt(r.rentalExp)}</TableCell>
                        <TableCell className="border text-right">{fmt(r.plInterest)}</TableCell>
                        <TableCell className="border text-right">{fmt(r.amortization)}</TableCell>
                        <TableCell className="border text-right">{fmt(r.rouBalance)}</TableCell>
                        <TableCell className="border text-right">{fmt(r.vds)}</TableCell>
                        <TableCell className="border text-right">{fmt(r.tds)}</TableCell>
                        <TableCell className="border text-right">{fmt(r.netPayment)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <tfoot className="bg-muted font-semibold">
                    <TableRow>
                      <TableCell className="border" colSpan={2}>Total</TableCell>
                      <TableCell className="border text-right">{fmt(totals.rental)}</TableCell>
                      <TableCell className="border text-right">-</TableCell>
                      <TableCell className="border text-right">-</TableCell>
                      <TableCell className="border text-right">-</TableCell>
                      <TableCell className="border text-right">-</TableCell>
                      <TableCell className="border text-right">{fmt(totals.cashFlow)}</TableCell>
                      <TableCell className="border text-right">{fmt(totals.pv)}</TableCell>
                      <TableCell className="border text-right">{fmt(totals.interest)}</TableCell>
                      <TableCell className="border text-right">-</TableCell>
                      <TableCell className="border text-right">{fmt(totals.rentalExp)}</TableCell>
                      <TableCell className="border text-right">{fmt(totals.interest)}</TableCell>
                      <TableCell className="border text-right">{fmt(totals.amort)}</TableCell>
                      <TableCell className="border text-right">-</TableCell>
                      <TableCell className="border text-right">{fmt(totals.vds)}</TableCell>
                      <TableCell className="border text-right">{fmt(totals.tds)}</TableCell>
                      <TableCell className="border text-right">{fmt(totals.net)}</TableCell>
                    </TableRow>
                  </tfoot>
                </TableWithSearch>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}