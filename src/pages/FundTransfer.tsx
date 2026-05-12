import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Search, RotateCcw, Save, Eye } from 'lucide-react';
import { toast } from 'sonner';

const bankAccounts = [
  { code: '11102001', name: 'City Bank A/C: 1233305341001', currency: 'BDT', clearedBalance: 2450000, totalBalance: 2780000, odLimit: 500000 },
  { code: '11102010', name: 'IBBL Bank A/C: 20501770100479609', currency: 'BDT', clearedBalance: 1890000, totalBalance: 2100000, odLimit: 0 },
  { code: '11102011', name: 'SCB Bank A/C: 01357924601', currency: 'BDT', clearedBalance: 3200000, totalBalance: 3450000, odLimit: 1000000 },
  { code: '11102012', name: 'UCB Bank A/C: 0901101000002235', currency: 'BDT', clearedBalance: 980000, totalBalance: 1050000, odLimit: 200000 },
  { code: '11101001', name: 'Head Office Cash', currency: 'BDT', clearedBalance: 150000, totalBalance: 150000, odLimit: 0 },
];

const projects = ['General', 'Flight Operations', 'Ground Handling', 'Maintenance', 'Cargo'];

function numberToWords(num: number): string {
  if (num === 0) return 'Zero';
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  if (num < 20) return ones[num];
  if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
  if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' ' + numberToWords(num % 100) : '');
  if (num < 100000) return numberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + numberToWords(num % 1000) : '');
  if (num < 10000000) return numberToWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 ? ' ' + numberToWords(num % 100000) : '');
  return numberToWords(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 ? ' ' + numberToWords(num % 10000000) : '');
}

export default function FundTransfer() {
  const today = new Date().toISOString().split('T')[0];

  const [creditAccount, setCreditAccount] = useState('');
  const [creditProject, setCreditProject] = useState('');
  const [debitAccount, setDebitAccount] = useState('');
  const [debitProject, setDebitProject] = useState('');
  const [valueDate, setValueDate] = useState(today);
  const [transactionDate, setTransactionDate] = useState(today);
  const [debitAmount, setDebitAmount] = useState('');
  const [particulars, setParticulars] = useState('');

  const creditAccDetail = bankAccounts.find(a => a.code === creditAccount);
  const debitAccDetail = bankAccounts.find(a => a.code === debitAccount);

  const amount = parseFloat(debitAmount) || 0;
  const amountInWords = amount > 0 ? numberToWords(Math.floor(amount)) + ' Taka Only' : '';

  const handleReset = () => {
    setCreditAccount('');
    setCreditProject('');
    setDebitAccount('');
    setDebitProject('');
    setValueDate(today);
    setTransactionDate(today);
    setDebitAmount('');
    setParticulars('');
  };

  const handleSave = () => {
    if (!creditAccount || !debitAccount || !debitAmount || !particulars) {
      toast.error('Please fill all mandatory fields');
      return;
    }
    if (creditAccount === debitAccount) {
      toast.error('Credit and Debit accounts cannot be the same');
      return;
    }
    toast.success('Fund Transfer saved successfully');
    handleReset();
  };

  const handlePreview = () => {
    if (!creditAccount || !debitAccount || !debitAmount) {
      toast.error('Please fill Credit Account, Debit Account and Amount to preview');
      return;
    }
    toast.info('Preview generated');
  };

  const formatCurrency = (val: number) => val.toLocaleString('en-BD');

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Fund Transfer</h1>
          <p className="text-sm text-muted-foreground">
            Instruction Processing
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column — Credit & Debit */}
        <div className="lg:col-span-2 space-y-4">
          {/* Credit Account Details */}
          <Card className="border-primary/20">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">C</span>
                </div>
                <h3 className="font-semibold text-sm text-foreground">Credit Account Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Account No. <span className="text-destructive">*</span></Label>
                  <div className="flex gap-1">
                    <Select value={creditAccount} onValueChange={setCreditAccount}>
                      <SelectTrigger className="h-8 text-xs flex-1">
                        <SelectValue placeholder="Select Account" />
                      </SelectTrigger>
                      <SelectContent>
                        {bankAccounts.map(acc => (
                          <SelectItem key={acc.code} value={acc.code} className="text-xs">
                            {acc.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                      <Search size={14} />
                    </Button>
                    {creditAccDetail && (
                      <span className="flex items-center text-[10px] text-muted-foreground bg-muted px-2 rounded">
                        {creditAccDetail.currency}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Account Name</Label>
                  <Input
                    value={creditAccDetail?.name || ''}
                    readOnly
                    className="h-8 text-xs bg-muted"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Project <span className="text-destructive">*</span></Label>
                  <Select value={creditProject} onValueChange={setCreditProject}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Select Project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map(p => (
                        <SelectItem key={p} value={p} className="text-xs">{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">OD Limit</Label>
                  <Input
                    value={creditAccDetail ? formatCurrency(creditAccDetail.odLimit) : ''}
                    readOnly
                    className="h-8 text-xs bg-muted text-right"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Cleared Balance</Label>
                  <Input
                    value={creditAccDetail ? formatCurrency(creditAccDetail.clearedBalance) : ''}
                    readOnly
                    className="h-8 text-xs bg-muted text-right"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Total Balance</Label>
                  <Input
                    value={creditAccDetail ? formatCurrency(creditAccDetail.totalBalance) : ''}
                    readOnly
                    className="h-8 text-xs bg-muted text-right"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Debit Account Details */}
          <Card className="border-primary/20">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-5 h-5 rounded-full bg-destructive/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-destructive">D</span>
                </div>
                <h3 className="font-semibold text-sm text-foreground">Debit Account Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Account No. <span className="text-destructive">*</span></Label>
                  <div className="flex gap-1">
                    <Select value={debitAccount} onValueChange={setDebitAccount}>
                      <SelectTrigger className="h-8 text-xs flex-1">
                        <SelectValue placeholder="Select Account" />
                      </SelectTrigger>
                      <SelectContent>
                        {bankAccounts.map(acc => (
                          <SelectItem key={acc.code} value={acc.code} className="text-xs">
                            {acc.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                      <Search size={14} />
                    </Button>
                    {debitAccDetail && (
                      <span className="flex items-center text-[10px] text-muted-foreground bg-muted px-2 rounded">
                        {debitAccDetail.currency}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Account Name</Label>
                  <Input
                    value={debitAccDetail?.name || ''}
                    readOnly
                    className="h-8 text-xs bg-muted"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Project <span className="text-destructive">*</span></Label>
                  <Select value={debitProject} onValueChange={setDebitProject}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Select Project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map(p => (
                        <SelectItem key={p} value={p} className="text-xs">{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">OD Limit</Label>
                  <Input
                    value={debitAccDetail ? formatCurrency(debitAccDetail.odLimit) : ''}
                    readOnly
                    className="h-8 text-xs bg-muted text-right"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Cleared Balance</Label>
                  <Input
                    value={debitAccDetail ? formatCurrency(debitAccDetail.clearedBalance) : ''}
                    readOnly
                    className="h-8 text-xs bg-muted text-right"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Total Balance</Label>
                  <Input
                    value={debitAccDetail ? formatCurrency(debitAccDetail.totalBalance) : ''}
                    readOnly
                    className="h-8 text-xs bg-muted text-right"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column — Transaction Details */}
        <div className="space-y-4">
          <Card className="border-primary/20">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-5 h-5 rounded-full bg-accent/50 flex items-center justify-center">
                  <span className="text-xs font-bold text-accent-foreground">T</span>
                </div>
                <h3 className="font-semibold text-sm text-foreground">Transaction Details</h3>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">Value Date <span className="text-destructive">*</span></Label>
                  <Input
                    type="date"
                    value={valueDate}
                    onChange={e => setValueDate(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Transaction Date</Label>
                  <Input
                    type="date"
                    value={transactionDate}
                    onChange={e => setTransactionDate(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Debit Trans. Amount <span className="text-destructive">*</span></Label>
                  <Input
                    type="number"
                    value={debitAmount}
                    onChange={e => setDebitAmount(e.target.value)}
                    placeholder="0.00"
                    className="h-8 text-xs text-right"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Amount In Words</Label>
                  <p className="text-[11px] text-muted-foreground italic min-h-[20px] bg-muted rounded px-2 py-1">
                    {amountInWords || '—'}
                  </p>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Equivalent Credit Amount</Label>
                  <Input
                    value={amount > 0 ? formatCurrency(amount) : ''}
                    readOnly
                    className="h-8 text-xs bg-muted text-right"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Amount In Words</Label>
                  <p className="text-[11px] text-muted-foreground italic min-h-[20px] bg-muted rounded px-2 py-1">
                    {amountInWords || '—'}
                  </p>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Transaction Particulars <span className="text-destructive">*</span></Label>
                  <Textarea
                    value={particulars}
                    onChange={e => setParticulars(e.target.value)}
                    placeholder="Enter transaction details..."
                    className="text-xs min-h-[60px]"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={handleReset} className="flex-1 h-8 text-xs">
                    <RotateCcw size={14} className="mr-1" /> Reset
                  </Button>
                  <Button size="sm" onClick={handleSave} className="flex-1 h-8 text-xs">
                    <Save size={14} className="mr-1" /> Save
                  </Button>
                  <Button variant="secondary" size="sm" onClick={handlePreview} className="flex-1 h-8 text-xs">
                    <Eye size={14} className="mr-1" /> Preview
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
