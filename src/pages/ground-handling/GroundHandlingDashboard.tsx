import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { 
  DollarSign, FileText, MapPin, TrendingUp, Download, Filter,
  CheckCircle2, Clock, Calendar, BarChart3, Eye
} from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { toast } from 'sonner';

const CHART_COLORS = [
  'hsl(215, 85%, 45%)', 'hsl(142, 76%, 36%)', 'hsl(38, 92%, 50%)', 'hsl(0, 72%, 51%)',
  'hsl(280, 65%, 55%)', 'hsl(180, 60%, 40%)', 'hsl(340, 75%, 55%)', 'hsl(50, 85%, 45%)',
  'hsl(160, 60%, 35%)', 'hsl(215, 60%, 70%)'
];

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const monthlyPayments = [
  { month: 'Jan', current: 3376230, previous: 2800000 },
  { month: 'Feb', current: 1200000, previous: 1500000 },
  { month: 'Mar', current: 600000, previous: 400000 },
  { month: 'Apr', current: 0, previous: 350000 },
  { month: 'May', current: 0, previous: 300000 },
  { month: 'Jun', current: 0, previous: 280000 },
  { month: 'Jul', current: 0, previous: 320000 },
  { month: 'Aug', current: 0, previous: 350000 },
  { month: 'Sep', current: 0, previous: 400000 },
  { month: 'Oct', current: 0, previous: 380000 },
  { month: 'Nov', current: 0, previous: 420000 },
  { month: 'Dec', current: 0, previous: 450000 },
];

const stationPayments = [
  { station: 'DAC', paid: 300000, pending: 140000 },
  { station: 'LHR', paid: 450000, pending: 120000 },
  { station: 'JFK', paid: 500000, pending: 80000 },
  { station: 'DXB', paid: 350000, pending: 160000 },
  { station: 'SIN', paid: 250000, pending: 100000 },
  { station: 'CAN', paid: 280000, pending: 50000 },
  { station: 'BKK', paid: 80000, pending: 40000 },
  { station: 'CCU', paid: 120000, pending: 60000 },
  { station: 'DOH', paid: 100000, pending: 50000 },
];

const serviceCostData = [
  { name: 'Ramp Services', value: 20 },
  { name: 'Aircraft Handling', value: 14 },
  { name: 'Ground Power Unit', value: 10 },
  { name: 'Cabin Cleaning', value: 14 },
  { name: 'De-Icing Services', value: 19 },
  { name: 'Lounge Services', value: 2 },
  { name: 'Passenger Services', value: 4 },
  { name: 'Push-Back', value: 11 },
  { name: 'Baggage Handling', value: 3 },
  { name: 'Aircraft Parking', value: 4 },
];

const cumulativeTrend = [
  { month: 'Jan', cumulative: 3376230, period: 3376230 },
  { month: 'Feb', cumulative: 4576230, period: 1200000 },
  { month: 'Mar', cumulative: 5176230, period: 600000 },
  { month: 'Apr', cumulative: 5176230, period: 0 },
  { month: 'May', cumulative: 5176230, period: 0 },
  { month: 'Jun', cumulative: 5176230, period: 0 },
  { month: 'Jul', cumulative: 5176230, period: 0 },
  { month: 'Aug', cumulative: 5176230, period: 0 },
  { month: 'Sep', cumulative: 5176230, period: 0 },
  { month: 'Oct', cumulative: 5176230, period: 0 },
  { month: 'Nov', cumulative: 5176230, period: 0 },
  { month: 'Dec', cumulative: 5176230, period: 0 },
];

const stationRanking = [
  { rank: 1, code: 'LHR', name: 'London Heathrow', currency: 'GBP', amount: 1032950, color: 'hsl(215, 85%, 45%)' },
  { rank: 2, code: 'JFK', name: 'John F.', currency: 'USD', amount: 983450, color: 'hsl(142, 76%, 36%)' },
  { rank: 3, code: 'DXB', name: 'Dubai International', currency: 'AED', amount: 896940, color: 'hsl(38, 92%, 50%)' },
  { rank: 4, code: 'SIN', name: 'Singapore Changi', currency: 'SGD', amount: 717750, color: 'hsl(280, 65%, 55%)' },
  { rank: 5, code: 'CAN', name: 'Guangzhou Baiyun', currency: 'CNY', amount: 570000, color: 'hsl(0, 72%, 51%)' },
  { rank: 6, code: 'DAC', name: 'Hazrat Shahjalal', currency: 'BDT', amount: 440000, color: 'hsl(180, 60%, 40%)' },
];

const paymentDetails = [
  { station: 'DAC', stationName: 'Hazrat Shahjalal Internatio...', serviceType: 'Aircraft Handling', paymentDate: '2026-01-15', status: 'Paid', amountStation: 125000, currency: 'BDT', amountBDT: 125000, vatBDT: 6250, exchangeRate: 1, year: 2026, month: 'January' },
  { station: 'DAC', stationName: 'Hazrat Shahjalal Internatio...', serviceType: 'Passenger Services', paymentDate: '2026-01-18', status: 'Paid', amountStation: 85000, currency: 'BDT', amountBDT: 85000, vatBDT: 4250, exchangeRate: 1, year: 2026, month: 'January' },
  { station: 'BKK', stationName: 'Suvarnabhumi Airport', serviceType: 'Lounge Services', paymentDate: '2026-01-10', status: 'Paid', amountStation: 15000, currency: 'THB', amountBDT: 47250, vatBDT: 2363, exchangeRate: 3.15, year: 2026, month: 'January' },
  { station: 'BKK', stationName: 'Suvarnabhumi Airport', serviceType: 'Baggage Handling', paymentDate: '2026-01-12', status: 'Pending', amountStation: 22000, currency: 'THB', amountBDT: 69300, vatBDT: 3465, exchangeRate: 3.15, year: 2026, month: 'January' },
  { station: 'DXB', stationName: 'Dubai International Airport', serviceType: 'Ground Power Unit', paymentDate: '2026-01-08', status: 'Paid', amountStation: 8500, currency: 'AED', amountBDT: 256700, vatBDT: 12835, exchangeRate: 30.2, year: 2026, month: 'January' },
  { station: 'DXB', stationName: 'Dubai International Airport', serviceType: 'Aircraft Handling', paymentDate: '2026-01-20', status: 'Paid', amountStation: 12000, currency: 'AED', amountBDT: 362400, vatBDT: 18120, exchangeRate: 30.2, year: 2026, month: 'January' },
  { station: 'LHR', stationName: 'London Heathrow Airport', serviceType: 'Ramp Services', paymentDate: '2026-01-05', status: 'Paid', amountStation: 3500, currency: 'GBP', amountBDT: 495250, vatBDT: 24763, exchangeRate: 141.5, year: 2026, month: 'January' },
  { station: 'SIN', stationName: 'Singapore Changi Airport', serviceType: 'Cabin Cleaning', paymentDate: '2026-01-14', status: 'Pending', amountStation: 4200, currency: 'SGD', amountBDT: 346500, vatBDT: 17325, exchangeRate: 82.5, year: 2026, month: 'January' },
];

const rankingBarData = stationRanking.map(s => ({ station: s.code, amount: s.amount }));

export default function GroundHandlingDashboard() {
  const [stationFilter, setStationFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('2026');
  const [monthFilter, setMonthFilter] = useState('January');
  const [currencyFilter, setCurrencyFilter] = useState('BDT');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [includeVAT, setIncludeVAT] = useState(true);
  const [trendView, setTrendView] = useState('Monthly');

  const completionPercent = 82;
  const pendingAmount = 622180;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Ground Handling Payment Dashboard</h1>
            <p className="text-muted-foreground">Track and compare payments across stations with detailed analytics</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => toast.success('Exporting CSV...')}><Download className="h-4 w-4 mr-2" />Export CSV</Button>
            <Button variant="outline" onClick={() => toast.success('Exporting PDF...')}><Download className="h-4 w-4 mr-2" />Export PDF</Button>
          </div>
        </div>

        {/* Filters & Controls */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">Filters & Controls</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Station</label>
                <Select value={stationFilter} onValueChange={setStationFilter}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover z-[9999]">
                    <SelectItem value="all">All Stations</SelectItem>
                    {stationRanking.map(s => <SelectItem key={s.code} value={s.code}>{s.code}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Year</label>
                <Select value={yearFilter} onValueChange={setYearFilter}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover z-[9999]">
                    <SelectItem value="2026">2026</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Month</label>
                <Select value={monthFilter} onValueChange={setMonthFilter}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover z-[9999]">
                    {MONTHS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Currency</label>
                <Select value={currencyFilter} onValueChange={setCurrencyFilter}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover z-[9999]">
                    <SelectItem value="BDT">BDT</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Service Types</label>
                <Select value={serviceTypeFilter} onValueChange={setServiceTypeFilter}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover z-[9999]">
                    <SelectItem value="all">All Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Advanced</label>
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-xs"><input type="radio" name="payFilter" checked={paymentFilter === 'paid'} onChange={() => setPaymentFilter('paid')} className="h-3 w-3" /> Paid Only</label>
                  <label className="flex items-center gap-2 text-xs"><input type="radio" name="payFilter" checked={paymentFilter === 'pending'} onChange={() => setPaymentFilter('pending')} className="h-3 w-3" /> Pending Only</label>
                  <label className="flex items-center gap-2 text-xs"><Checkbox checked={includeVAT} onCheckedChange={(c) => setIncludeVAT(!!c)} className="h-3 w-3" /> Include VAT</label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1"><DollarSign className="h-3 w-3" /> Total (BDT)</div>
              <div className="text-xs text-muted-foreground">{monthFilter} {yearFilter}</div>
              <div className="text-2xl font-bold mt-1">৳3,376,230</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-warning">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1"><FileText className="h-3 w-3" /> VAT Total</div>
              <div className="text-xs text-muted-foreground">for {yearFilter}</div>
              <div className="text-2xl font-bold mt-1">৳264,002</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1"><MapPin className="h-3 w-3" /> Stations</div>
              <div className="text-xs text-muted-foreground">Paid / Pending</div>
              <div className="text-2xl font-bold mt-1"><span className="text-primary">7</span> / <span className="text-warning">3</span></div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-success">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1"><TrendingUp className="h-3 w-3" /> MoM Change</div>
              <div className="text-xs text-muted-foreground">vs previous month</div>
              <div className="text-2xl font-bold mt-1 text-success">+0.0%</div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card>
          <CardContent className="py-3 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span className="text-sm font-medium text-success">Good</span>
            </div>
            <span className="text-sm text-muted-foreground">7 of 9 stations have completed payments</span>
            <div className="flex-1">
              <Progress value={completionPercent} className="h-3" />
            </div>
            <div className="text-right text-sm">
              <span className="font-medium">{completionPercent}% Complete</span>
              <div className="text-xs text-warning">৳{pendingAmount.toLocaleString()} pending</div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Payments + Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><Calendar className="h-4 w-4" /> Monthly Ground Handling Payments (Current Year)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthlyPayments}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 15%, 90%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                  <Tooltip formatter={(v: number) => [`৳${v.toLocaleString()}`, 'Amount']} />
                  <Bar dataKey="current" fill="hsl(215, 85%, 45%)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Comparison: Current vs Previous Year</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthlyPayments}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 15%, 90%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                  <Tooltip formatter={(v: number) => [`৳${v.toLocaleString()}`, '']} />
                  <Legend />
                  <Bar dataKey="current" fill="hsl(215, 85%, 45%)" name="2026" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="previous" fill="hsl(210, 15%, 70%)" name="2025" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Total Payments by Station + Service Wise Pie */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><BarChart3 className="h-4 w-4" /> Total Payments by Station</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stationPayments} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 15%, 90%)" />
                  <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                  <YAxis dataKey="station" type="category" tick={{ fontSize: 11 }} width={40} />
                  <Tooltip formatter={(v: number) => [`৳${v.toLocaleString()}`, '']} />
                  <Legend />
                  <Bar dataKey="paid" stackId="a" fill="hsl(142, 76%, 36%)" name="Paid" />
                  <Bar dataKey="pending" stackId="a" fill="hsl(38, 92%, 50%)" name="Pending" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4" /> Service-Wise Cost Contribution ({yearFilter})</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={serviceCostData}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={{ strokeWidth: 1 }}
                  >
                    {serviceCostData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => [`${v}%`, 'Share']} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Cumulative Trend */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Cumulative Payment Trend</CardTitle>
              <div className="flex gap-1">
                {['Weekly', 'Monthly', 'Yearly'].map(v => (
                  <Button key={v} variant={trendView === v ? 'default' : 'outline'} size="sm" className="h-7 text-xs" onClick={() => setTrendView(v)}>{v}</Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={cumulativeTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 15%, 90%)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                <Tooltip formatter={(v: number) => [`৳${v.toLocaleString()}`, '']} />
                <Legend />
                <Line type="monotone" dataKey="cumulative" stroke="hsl(215, 85%, 45%)" strokeWidth={2} dot={{ r: 4 }} name="Cumulative" />
                <Line type="monotone" dataKey="period" stroke="hsl(142, 76%, 36%)" strokeWidth={2} dot={{ r: 4 }} name="Period" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Station Expense Ranking */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2"><MapPin className="h-4 w-4" /> Station Expense Ranking ({yearFilter})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                {stationRanking.map((s) => (
                  <div key={s.code} className="flex items-center gap-3 p-3 rounded-lg border">
                    <span className="text-sm font-bold text-muted-foreground w-6">#{s.rank}</span>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{s.code} - {s.name}</div>
                      <div className="text-xs text-muted-foreground">{s.currency}</div>
                    </div>
                    <div className="font-bold text-sm">৳{s.amount.toLocaleString()}</div>
                  </div>
                ))}
              </div>
              <div>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={rankingBarData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 15%, 90%)" />
                    <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                    <YAxis dataKey="station" type="category" tick={{ fontSize: 11 }} width={40} />
                    <Tooltip formatter={(v: number) => [`৳${v.toLocaleString()}`, 'Amount']} />
                    <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                      {rankingBarData.map((_, i) => <Cell key={i} fill={stationRanking[i]?.color || CHART_COLORS[0]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Details Table */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4" /> Payment Details</CardTitle>
              <Badge variant="outline" className="text-xs">{paymentDetails.length} records</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <TableWithSearch>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>Station</TableHead>
                  <TableHead>Service Type</TableHead>
                  <TableHead>Payment Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount (Station)</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead className="text-right">Amount (BDT)</TableHead>
                  <TableHead className="text-right">VAT (BDT)</TableHead>
                  <TableHead className="text-right">Exchange Rate</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Month</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentDetails.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="font-medium text-primary">{row.station}</div>
                      <div className="text-xs text-muted-foreground">{row.stationName}</div>
                    </TableCell>
                    <TableCell><Badge variant="outline" className="text-xs">{row.serviceType}</Badge></TableCell>
                    <TableCell className="text-sm">{row.paymentDate}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={row.status === 'Paid' ? 'text-success border-success/30' : 'text-warning border-warning/30'}>
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">{row.amountStation.toLocaleString()}</TableCell>
                    <TableCell className="font-medium">{row.currency}</TableCell>
                    <TableCell className="text-right">৳{row.amountBDT.toLocaleString()}</TableCell>
                    <TableCell className="text-right">৳{row.vatBDT.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{row.exchangeRate}</TableCell>
                    <TableCell>{row.year}</TableCell>
                    <TableCell>{row.month}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </TableWithSearch>
          </CardContent>
        </Card>

        <div className="bg-background/90 backdrop-blur-sm py-3 text-center">
          <p className="text-sm text-muted-foreground">
            Copyright © Designed & Developed by <span className="text-primary font-medium">Foodi</span> 2026
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
