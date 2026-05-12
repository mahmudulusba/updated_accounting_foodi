import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Eye, Printer, Code, FileText, FileType, FileSpreadsheet, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useApp } from '@/contexts/AppContext';
import { useBranchFilter } from '@/components/ReportBranchFilter';

interface RatioItem {
  name: string;
  value: number;
  formula?: string;
  numerator?: number;
  denominator?: number;
}

interface RatioSection {
  title: string;
  items: RatioItem[];
}

const RatioAnalysisReport: React.FC = () => {
  const { branches, selectedBranch } = useApp();
  const { isConsolidated, filterBranchCodes, setFilterBranchCodes, isMultipleBranchesSelected } = useBranchFilter();
  const [fromDate, setFromDate] = useState<Date>(new Date('2023-01-20'));
  const [toDate, setToDate] = useState<Date>(new Date('2026-01-20'));
  const [showReport, setShowReport] = useState(false);
  const [selectedRatio, setSelectedRatio] = useState('all');

  // Filter branches based on login context
  const availableBranches = isConsolidated 
    ? branches.filter(b => !b.isConsolidated) // Show all non-consolidated branches
    : branches.filter(b => b.code === selectedBranch?.code); // Show only current branch

  // Mock ratio data based on the uploaded image
  const ratioData: RatioSection[] = [
    {
      title: 'Liquidity Ratios',
      items: [
        { name: 'Current Ratio', value: -1.18, formula: 'Current Assets ÷ Current Liabilities', numerator: 1850000000, denominator: -1567796610 },
        { name: 'Quick Ratio', value: -0.13, formula: '(Current Assets - Inventory) ÷ Current Liabilities', numerator: 200000000, denominator: -1538461538 },
        { name: 'Cash Ratio', value: -2.97, formula: 'Cash & Equivalents ÷ Current Liabilities', numerator: 4655000000, denominator: -1567340067 },
      ]
    },
    {
      title: 'Working Capital Efficiency/ Activity Ratio',
      items: [
        { name: 'Net Working Capital', value: 2421653526.51, formula: 'Current Assets - Current Liabilities', numerator: 4250000000, denominator: 1828346473.49 },
        { name: 'Account Receivable to Working Capital', value: 0.25, formula: 'Accounts Receivable ÷ Net Working Capital', numerator: 605413381.63, denominator: 2421653526.51 },
        { name: 'Inventory to Working Capital', value: 0.48, formula: 'Inventory ÷ Net Working Capital', numerator: 1162393692.72, denominator: 2421653526.51 },
        { name: 'Long-Term Liabilities to Working Capital', value: 0.00, formula: 'Long-Term Liabilities ÷ Net Working Capital', numerator: 0, denominator: 2421653526.51 },
        { name: 'Sales to Working Capital', value: -1.41, formula: 'Net Sales ÷ Net Working Capital', numerator: -3414531471.38, denominator: 2421653526.51 },
        { name: 'Capital Turnover Ratio', value: -0.02, formula: 'Net Sales ÷ Shareholder Equity', numerator: -3414531471.38, denominator: 170726573569.00 },
      ]
    },
    {
      title: 'Activity Ratios',
      items: [
        { name: 'Inventory Turnover', value: 0.04, formula: 'COGS ÷ Average Inventory', numerator: 46495747.69, denominator: 1162393692.72 },
        { name: 'Inventory Turnover Days', value: 28468.24, formula: '365 ÷ Inventory Turnover', numerator: 365, denominator: 0.0128 },
        { name: 'Receivable/Debtors Turnover', value: -4.60, formula: 'Net Credit Sales ÷ Avg Accounts Receivable', numerator: -2784901555.50, denominator: 605413381.63 },
        { name: 'Receivable Collection Days', value: -238.36, formula: '365 ÷ Receivable Turnover', numerator: 365, denominator: -1.531 },
        { name: 'Accounts Payable/Creditors Turnover', value: -0.21, formula: 'Net Credit Purchases ÷ Avg Accounts Payable', numerator: -329214309.69, denominator: 1567796610.00 },
        { name: 'Payable Payments Days', value: -5106.73, formula: '365 ÷ Payable Turnover', numerator: 365, denominator: -0.0715 },
        { name: 'Cash Operating Cycle', value: 0.00, formula: 'Inventory Days + Receivable Days - Payable Days', numerator: 0, denominator: 1 },
        { name: 'Sales to Net Fixed Assets', value: -3408784247.72, formula: 'Net Sales ÷ Net Fixed Assets', numerator: -3408784247.72, denominator: 1.00 },
        { name: 'Fixed Asset Turnover', value: 0.00, formula: 'Net Sales ÷ Average Fixed Assets', numerator: 0, denominator: 1 },
        { name: 'Asset Turnover Ratio', value: 0.03, formula: 'Net Sales ÷ Total Assets', numerator: -3414531471.38, denominator: -113817715712.67 },
      ]
    },
    {
      title: 'Profitability Ratios',
      items: [
        { name: 'Net Profit Margin', value: -0.56, formula: '(Net Profit ÷ Net Sales) × 100', numerator: 1901012841.46, denominator: -3414531471.38 },
        { name: 'Gross Profit Margin', value: 1.02, formula: '(Gross Profit ÷ Net Sales) × 100', numerator: -3483022747.81, denominator: -3414531471.38 },
        { name: 'Operating Profit Margin', value: 1.44, formula: '(Operating Profit ÷ Net Sales) × 100', numerator: -4916925318.78, denominator: -3414531471.38 },
        { name: 'Return on Assets Ratio', value: 1.19, formula: 'Net Profit ÷ Total Assets', numerator: 1901012841.46, denominator: 1597490623.91 },
        { name: 'Return on Capital Employed', value: -0.80, formula: 'EBIT ÷ Capital Employed', numerator: -4916925318.78, denominator: 6146156648.48 },
        { name: 'Dividend Payout Ratio', value: 0.00, formula: 'Dividends ÷ Net Profit', numerator: 0, denominator: 1901012841.46 },
      ]
    },
    {
      title: 'Coverage Ratios',
      items: [
        { name: 'Percent Owners Equity', value: -147.72, formula: '(Total Equity ÷ Total Assets) × 100', numerator: 170726573569.00, denominator: -1155631380.59 },
        { name: 'Equity Multiplier', value: -0.68, formula: 'Total Assets ÷ Total Equity', numerator: -113817715712.67, denominator: 167382934060.00 },
        { name: 'Debt to Equity', value: 0.57, formula: 'Total Liabilities ÷ Total Equity', numerator: 95413351912.00, denominator: 167382934060.00 },
        { name: 'Debt Ratio', value: -0.84, formula: 'Total Liabilities ÷ Total Assets', numerator: 95413351912.00, denominator: -113563513004.76 },
        { name: 'Gearing Ratio', value: 0.00, formula: 'Long-Term Debt ÷ (Long-Term Debt + Equity)', numerator: 0, denominator: 167382934060.00 },
      ]
    },
    {
      title: 'Investors Measures Ratio',
      items: [
        { name: 'Earning Per Share', value: 1901012841.46, formula: 'Net Profit ÷ Shares Outstanding', numerator: 1901012841.46, denominator: 1.00 },
        { name: 'Dividend Per Share', value: 0.00, formula: 'Total Dividends ÷ Shares Outstanding', numerator: 0, denominator: 1 },
        { name: 'No of Shares Eligible', value: 0.00, formula: 'Total Eligible Shares Count', numerator: 0, denominator: 1 },
        { name: 'Price Earning Ratio', value: 0.00, formula: 'Market Price Per Share ÷ EPS', numerator: 0, denominator: 1 },
        { name: 'Dividend Yield', value: 0.00, formula: '(Dividend Per Share ÷ Market Price Per Share) × 100', numerator: 0, denominator: 1 },
      ]
    },
  ];

  // Filter ratio data based on selected ratio
  const displayData = selectedRatio === 'all' 
    ? ratioData 
    : ratioData.filter(s => s.title === selectedRatio);

  const formatValue = (value: number): string => {
    if (Math.abs(value) >= 1000000) {
      return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return value.toFixed(2);
  };

  const handlePreview = () => {
    setShowReport(true);
  };

  const handlePrint = () => {
    window.print();
  };

  // Handle branch selection for the ratio analysis (single select for this page)
  const handleBranchChange = (value: string) => {
    if (value === 'all') {
      setFilterBranchCodes(['all']);
    } else {
      setFilterBranchCodes([value]);
    }
  };

  const currentBranchValue = filterBranchCodes.includes('all') ? 'all' : filterBranchCodes[0] || '';

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Ratio Analysis</h1>
          <div className="flex items-center gap-4">
            <button className="text-sm text-primary hover:underline">Reports</button>
            <button className="text-sm text-primary hover:underline">Filter</button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-2">
          <span className="text-sm text-muted-foreground">Download:</span>
          <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white">
            <FileText className="h-4 w-4 mr-1" />
            PDF
          </Button>
          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
            <FileSpreadsheet className="h-4 w-4 mr-1" />
            XLS
          </Button>
        </div>

        <div className="flex gap-4">
          {/* Left Panel - Filter Section */}
          <Card className="w-64 shrink-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Filter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Ratio<span className="text-destructive">*</span></Label>
                <Select value={selectedRatio} onValueChange={setSelectedRatio}>
                  <SelectTrigger><SelectValue placeholder="Select ratio" /></SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="all">All Ratios</SelectItem>
                    {ratioData.map(s => <SelectItem key={s.title} value={s.title}>{s.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {/* From Date */}
              <div className="space-y-2">
                <Label>From</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !fromDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fromDate ? format(fromDate, "dd-MMM-yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={fromDate}
                      onSelect={(date) => date && setFromDate(date)}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* To Date */}
              <div className="space-y-2">
                <Label>To</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !toDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {toDate ? format(toDate, "dd-MMM-yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={toDate}
                      onSelect={(date) => date && setToDate(date)}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Branch Dropdown */}
              <div className="space-y-2">
                <Label>Branch</Label>
                {isConsolidated ? (
                  <Select value={currentBranchValue} onValueChange={handleBranchChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border z-50">
                      <SelectItem value="all">--All--</SelectItem>
                      {availableBranches.map((branch) => (
                        <SelectItem key={branch.code} value={branch.code}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    value={selectedBranch?.name || ''}
                    readOnly
                    className="bg-muted cursor-not-allowed"
                  />
                )}
              </div>

              <Button onClick={handlePreview} className="w-full">
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </Button>
            </CardContent>
          </Card>

          {/* Right Panel - Report Display */}
          <Card className="flex-1">
            <CardContent className="p-6">
              {showReport ? (
                <div className="space-y-0 print:text-black" id="ratio-report">
                  {/* Report Header */}
                  <div className="text-center mb-6 border-b pb-4">
                    <h2 className="text-xl font-bold">Ratio Analysis</h2>
                    <p className="text-sm text-muted-foreground">
                      Date : From: {format(fromDate, "dd-MMM-yyyy")} To: {format(toDate, "dd-MMM-yyyy")}
                    </p>
                  </div>

                  {/* Ratio Sections */}
                  {displayData.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="mb-4">
                      {/* Section Header */}
                      <div className="bg-muted/50 border-t border-b py-1 px-2">
                        <h3 className="font-semibold text-sm underline">{section.title}</h3>
                      </div>

                      {/* Section Items - table view with Formula & Calculation */}
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-muted/30 text-xs">
                            <th className="text-left py-1 px-2 w-1/4">Ratio Name</th>
                            <th className="text-left py-1 px-2 w-1/3">Formula</th>
                            <th className="text-left py-1 px-2">Calculation</th>
                            <th className="text-right py-1 px-2 w-32">Value</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {section.items.map((item, itemIndex) => (
                            <tr key={itemIndex} className="hover:bg-muted/30">
                              <td className="py-1 px-2">{item.name}</td>
                              <td className="py-1 px-2 text-xs text-muted-foreground">{item.formula}</td>
                              <td className="py-1 px-2 font-mono text-xs">
                                {item.numerator !== undefined && item.denominator !== undefined
                                  ? `${formatValue(item.numerator)} ÷ ${formatValue(item.denominator)} = ${formatValue(item.value)}`
                                  : '-'}
                              </td>
                              <td className="font-mono text-right py-1 px-2">{formatValue(item.value)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}

                  {/* Report Footer */}
                  <div className="flex justify-between items-center text-xs text-muted-foreground mt-8 pt-4 border-t">
                    <span>{format(new Date(), "MM/dd/yyyy HH:mm")}</span>
                    <span>Page 1 of 1</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-96 text-muted-foreground">
                  <div className="text-center">
                    <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Click "Preview" to generate the Ratio Analysis Report</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RatioAnalysisReport;
