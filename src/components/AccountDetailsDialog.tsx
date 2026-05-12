import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Check } from 'lucide-react';

export interface AccountDetailsValue {
  accountNumber: string;
  accountName: string;
  scb: string;
  sbu: string;
  department: string;
  city: string;
  hub: string;
  zone: string;
}

const empty: AccountDetailsValue = {
  accountNumber: '',
  accountName: '',
  scb: '',
  sbu: '',
  department: '',
  city: '',
  hub: '',
  zone: '',
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  voucherIndex: number;
  rowIndex: number;
  value?: AccountDetailsValue;
  onSave: (v: AccountDetailsValue) => void;
}

export function AccountDetailsDialog({
  open,
  onOpenChange,
  voucherIndex,
  rowIndex,
  value,
  onSave,
}: Props) {
  const [data, setData] = useState<AccountDetailsValue>(value ?? empty);

  useEffect(() => {
    if (open) setData(value ?? empty);
  }, [open, value]);

  const update = (k: keyof AccountDetailsValue, v: string) =>
    setData(prev => ({ ...prev, [k]: v }));

  const handleSearch = () => {
    // Mock auto-fill behavior
    if (data.accountNumber) {
      update('accountName', `Account ${data.accountNumber}`);
    }
  };

  const handleSubmit = () => {
    onSave(data);
    onOpenChange(false);
  };

  const sel = (label: string, key: keyof AccountDetailsValue, opts: string[]) => (
    <div className="space-y-1">
      <Label className="text-sm font-bold">{label}</Label>
      <Select value={data[key]} onValueChange={v => update(key, v)}>
        <SelectTrigger className="bg-muted/40">
          <SelectValue placeholder="--- Select ---" />
        </SelectTrigger>
        <SelectContent>
          {opts.map(o => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden gap-0">
        <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between">
          <span className="font-semibold">
            Voucher {voucherIndex} &gt; Acc info &gt; Details &gt; Row: {rowIndex}
          </span>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/20"
            onClick={handleSubmit}
          >
            <Check className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label className="text-sm">
                Account Number <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  value={data.accountNumber}
                  onChange={e => update('accountNumber', e.target.value)}
                  placeholder="Enter Number"
                  className="pr-10 ring-1 ring-primary/40"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-primary"
                  onClick={handleSearch}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-sm">
                Account Name <span className="text-destructive">*</span>
              </Label>
              <Input
                value={data.accountName}
                readOnly
                placeholder="Auto-filled"
                className="bg-muted/40"
              />
            </div>
            {sel('S / C / B', 'scb', ['S', 'C', 'B'])}
          </div>

          <div className="grid grid-cols-3 gap-4">
            {sel('SBU', 'sbu', ['SBU 1', 'SBU 2', 'SBU 3'])}
            {sel('Department', 'department', ['Finance', 'Operations', 'Sales', 'HR'])}
            {sel('City', 'city', ['Dhaka', 'Chittagong', 'Sylhet'])}
          </div>

          <div className="grid grid-cols-3 gap-4">
            {sel('Hub', 'hub', ['Hub 1', 'Hub 2', 'Hub 3'])}
            {sel('Zone', 'zone', ['Zone A', 'Zone B', 'Zone C'])}
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <Button variant="outline" onClick={() => setData(empty)}>
              Clear
            </Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
