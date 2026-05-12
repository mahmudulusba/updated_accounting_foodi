import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StatCardWithIcon } from '@/components/dashboard/StatCardWithIcon';
import { RevenueExpenseTrendChart } from '@/components/dashboard/RevenueExpenseTrendChart';
import { ProfitLossSummaryCard } from '@/components/dashboard/ProfitLossSummaryCard';
import { CashFlowOverviewChart } from '@/components/dashboard/CashFlowOverviewChart';
import { AgingDonutCard } from '@/components/dashboard/AgingDonutCard';
import { ExpenseBreakdownChart } from '@/components/dashboard/ExpenseBreakdownChart';
import { TopPartiesTable } from '@/components/dashboard/TopPartiesTable';
import { RecentTransactionsTable } from '@/components/dashboard/RecentTransactionsTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Calendar, Filter, RefreshCw, Plus, DollarSign, ArrowUp, TrendingUp, Building, FileText, Wallet, AlertTriangle, ChevronRight } from 'lucide-react';
import foodiIcon from '@/assets/foodi-icon.png';

const arAging = [
  { name: 'Current (0-30 days)', value: 235456, color: 'hsl(142, 76%, 40%)' },
  { name: '31-60 days', value: 156789, color: 'hsl(38, 92%, 55%)' },
  { name: '61-90 days', value: 98765, color: 'hsl(25, 90%, 55%)' },
  { name: '91-120 days', value: 45678, color: 'hsl(0, 75%, 60%)' },
  { name: '>120 days', value: 50000, color: 'hsl(270, 60%, 60%)' },
];

const apAging = [
  { name: 'Current (0-30 days)', value: 187654, color: 'hsl(215, 85%, 50%)' },
  { name: '31-60 days', value: 123456, color: 'hsl(38, 92%, 55%)' },
  { name: '61-90 days', value: 76543, color: 'hsl(25, 90%, 55%)' },
  { name: '91-120 days', value: 54321, color: 'hsl(0, 75%, 60%)' },
  { name: '>120 days', value: 50000, color: 'hsl(270, 60%, 60%)' },
];

// Payment Receipt Overview (donut) — same structure as aging cards
const paymentReceiptOverview = [
  { name: 'Salaries & Wages', value: 147300, color: 'hsl(0, 75%, 60%)' },
  { name: 'Rent & Utilities', value: 68200, color: 'hsl(215, 85%, 50%)' },
  { name: 'Marketing', value: 46600, color: 'hsl(38, 92%, 55%)' },
  { name: 'Depreciation', value: 37800, color: 'hsl(142, 76%, 40%)' },
  { name: 'Other Expenses', value: 66700, color: 'hsl(270, 60%, 60%)' },
];

const topCustomers = [
  { name: 'Global Solutions Inc.', amount: '125,430 BDT', pct: '21.4%' },
  { name: 'TechSphere Corp.', amount: '98,765 BDT', pct: '16.9%' },
  { name: 'ABC Enterprises', amount: '87,654 BDT', pct: '14.9%' },
  { name: 'Prime Retail Ltd.', amount: '76,543 BDT', pct: '13.1%' },
  { name: 'Bright Future LLC', amount: '65,432 BDT', pct: '11.2%' },
];

const topVendors = [
  { name: 'Office Supplies Co.', amount: '98,765 BDT', pct: '20.1%' },
  { name: 'Tech Equipment Ltd.', amount: '87,654 BDT', pct: '17.8%' },
  { name: 'Building Maintenance', amount: '76,543 BDT', pct: '15.6%' },
  { name: 'Energy Provider Inc.', amount: '65,432 BDT', pct: '13.3%' },
  { name: 'Logistics Services', amount: '54,321 BDT', pct: '11.0%' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [timePeriod, setTimePeriod] = useState('last-30');
  const [sbu, setSbu] = useState('');
  const [department, setDepartment] = useState('');
  const [city, setCity] = useState('');
  const [hub, setHub] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <DashboardLayout>
      <div className="space-y-4" key={refreshKey}>
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={showFilters ? 'default' : 'outline'}
              size="sm"
              className="gap-2"
              onClick={() => setShowFilters((v) => !v)}
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setRefreshKey((k) => k + 1)}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Filters - toggled */}
        {showFilters && (
        <Card className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            <div>
              <Label className="text-xs font-semibold">Time Period</Label>
              <Select value={timePeriod} onValueChange={setTimePeriod}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-day">Last day</SelectItem>
                  <SelectItem value="last-7">Last 7 days</SelectItem>
                  <SelectItem value="last-30">Last 30 days</SelectItem>
                  <SelectItem value="last-90">Last 90 days</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-semibold">SBU</Label>
              <Select value={sbu} onValueChange={setSbu}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="aviation">Aviation</SelectItem>
                  <SelectItem value="cargo">Cargo</SelectItem>
                  <SelectItem value="ground">Ground Handling</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-semibold">Department</Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="ops">Operations</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-semibold">City</Label>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="dhaka">Dhaka</SelectItem>
                  <SelectItem value="ctg">Chittagong</SelectItem>
                  <SelectItem value="syl">Sylhet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-semibold">Hub</Label>
              <Select value={hub} onValueChange={setHub}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="dac">DAC</SelectItem>
                  <SelectItem value="cgp">CGP</SelectItem>
                  <SelectItem value="zyl">ZYL</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {timePeriod === 'custom' && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-3">
              <div>
                <Label className="text-xs font-semibold">From</Label>
                <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
              </div>
              <div>
                <Label className="text-xs font-semibold">To</Label>
                <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
              </div>
            </div>
          )}
        </Card>
        )}

        {/* Unposted Voucher section */}
        <Card className="p-2.5 border-warning/50 bg-warning/15">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-3.5 w-3.5 text-warning" />
            <h3 className="font-semibold text-xs">Unposted Voucher</h3>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-warning/30 text-warning font-medium">Action Required</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <button
              onClick={() => navigate('/management/voucher-list?tab=unposted')}
              className="flex items-center justify-between px-2.5 py-1.5 rounded-md border bg-card hover:border-primary hover:shadow-sm transition-all text-left"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium text-xs">Management Accounts</span>
                <span className="text-base font-bold text-primary">12</span>
              </div>
              <span className="text-[10px] text-primary flex items-center gap-1">Click to view <ChevronRight className="h-3 w-3" /></span>
            </button>
            <button
              onClick={() => navigate('/management/voucher-list?tab=tax-unposted')}
              className="flex items-center justify-between px-2.5 py-1.5 rounded-md border bg-card hover:border-primary hover:shadow-sm transition-all text-left"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium text-xs">TAX Accounts</span>
                <span className="text-base font-bold text-primary">20</span>
              </div>
              <span className="text-[10px] text-primary flex items-center gap-1">Click to view <ChevronRight className="h-3 w-3" /></span>
            </button>
          </div>
        </Card>

        {/* Stat cards row - 6 KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCardWithIcon
            title="Total Revenue"
            value="1,234,567 BDT"
            change={12.5}
            comparedTo="vs Mar 2024"
            icon={DollarSign}
            iconColor="green"
          />
          <StatCardWithIcon
            title="Total Expenses"
            value="823,456 BDT"
            change={8.3}
            comparedTo="vs Mar 2024"
            icon={ArrowUp}
            iconColor="red"
          />
          <StatCardWithIcon
            title="Net Profit"
            value="411,111 BDT"
            change={18.7}
            comparedTo="vs Mar 2024"
            icon={TrendingUp}
            iconColor="blue"
          />
          <StatCardWithIcon
            title="Change in Asset"
            value="5,678,910 BDT"
            change={9.4}
            comparedTo="vs Mar 2024"
            icon={Building}
            iconColor="purple"
          />
          <StatCardWithIcon
            title="Change in Liability"
            value="2,345,678 BDT"
            change={7.1}
            comparedTo="vs Mar 2024"
            icon={FileText}
            iconColor="amber"
          />
          <StatCardWithIcon
            title="Cash Balance"
            value="1,234,567 BDT"
            change={-2.4}
            comparedTo="vs Mar 2024"
            icon={Wallet}
            iconColor="cyan"
          />
        </div>

        {/* Row 2: Trend chart + P&L Summary + Cash Flow donut */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch [&>*]:h-full">
          <RevenueExpenseTrendChart />
          <ProfitLossSummaryCard />
          <CashFlowOverviewChart />
        </div>

        {/* Row 3: AR Aging + AP Aging + Expense Breakdown + Bank Accounts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AgingDonutCard
            title="Accounts Receivable Aging"
            asOf="As of 30 Apr, 2024"
            data={arAging}
          />
          <AgingDonutCard
            title="Accounts Payable Aging"
            asOf="As of 30 Apr, 2024"
            data={apAging}
          />
          <ExpenseBreakdownChart />
          <AgingDonutCard
            title="Payment Receipt Overview"
            asOf="This Month"
            data={paymentReceiptOverview}
          />
        </div>

        {/* Row 4: Top Customers + Top Vendors + Recent Transactions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <TopPartiesTable
            title="Top 5 Customers (Receivables)"
            asOf="As of 30 Apr, 2024"
            nameLabel="Customer Name"
            rows={topCustomers}
            total="453,824 BDT"
            totalPct="77.5%"
          />
          <TopPartiesTable
            title="Top 5 Vendors (Payables)"
            asOf="As of 30 Apr, 2024"
            nameLabel="Vendor Name"
            rows={topVendors}
            total="382,715 BDT"
            totalPct="77.8%"
          />
          <RecentTransactionsTable />
        </div>

        {/* Footer */}
        <div className="bg-background/90 backdrop-blur-sm py-3 text-center">
          <p className="text-sm text-muted-foreground">
            Copyright © Designed & Developed by{' '}
            <span className="text-primary font-medium">Foodi</span> 2026
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
