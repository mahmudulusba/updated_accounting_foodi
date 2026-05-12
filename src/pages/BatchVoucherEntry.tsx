import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Calendar, Plus, Minus, Trash2, Paperclip } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { AccountDetailsDialog, AccountDetailsValue } from '@/components/AccountDetailsDialog';

interface VoucherLine {
  sl: number;
  drAmount: number;
  crAmount: number;
  drAccount?: AccountDetailsValue;
  crAccount?: AccountDetailsValue;
}

interface VoucherBlock {
  id: number;
  lines: VoucherLine[];
  excludeTax: boolean;
}

const newLine = (sl: number): VoucherLine => ({ sl, drAmount: 0, crAmount: 0 });
const newVoucher = (id: number): VoucherBlock => ({ id, lines: [newLine(1)], excludeTax: false });

// Demo data prefilled into the entry screen
const demoVouchers: VoucherBlock[] = [
  {
    id: 1,
    excludeTax: false,
    lines: [
      {
        sl: 1,
        drAmount: 250000,
        crAmount: 0,
        drAccount: { accountNumber: '62101001', accountName: 'Office Rent', scb: 'S', department: 'Admin', city: 'Dhaka', hub: 'HO', sbu: 'HO', zone: 'Central' },
      },
      {
        sl: 2,
        drAmount: 0,
        crAmount: 250000,
        crAccount: { accountNumber: '11102001', accountName: 'City Bank A/C', scb: 'B', department: 'Finance', city: 'Dhaka', hub: 'HO', sbu: 'HO', zone: 'Central' },
      },
    ],
  },
  {
    id: 2,
    excludeTax: false,
    lines: [
      {
        sl: 1,
        drAmount: 142800,
        crAmount: 0,
        drAccount: { accountNumber: '62402001', accountName: 'Electricity Expense', scb: 'S', department: 'Admin', city: 'Dhaka', hub: 'HO', sbu: 'HO', zone: 'Central' },
      },
      {
        sl: 2,
        drAmount: 0,
        crAmount: 142800,
        crAccount: { accountNumber: '11102001', accountName: 'City Bank A/C', scb: 'B', department: 'Finance', city: 'Dhaka', hub: 'HO', sbu: 'HO', zone: 'Central' },
      },
    ],
  },
  {
    id: 3,
    excludeTax: true,
    lines: [
      {
        sl: 1,
        drAmount: 524000,
        crAmount: 0,
        drAccount: { accountNumber: '51301001', accountName: 'Catering Expense', scb: 'S', department: 'Inflight', city: 'Dhaka', hub: 'HO', sbu: 'HO', zone: 'Central' },
      },
      {
        sl: 2,
        drAmount: 0,
        crAmount: 524000,
        crAccount: { accountNumber: '11102003', accountName: 'EBL Bank A/C', scb: 'B', department: 'Finance', city: 'Dhaka', hub: 'HO', sbu: 'HO', zone: 'Central' },
      },
    ],
  },
];

const BatchVoucherEntry = () => {
  const [batchDate, setBatchDate] = useState(
    new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  );
  const [batchReference, setBatchReference] = useState('');
  const [vouchers, setVouchers] = useState<VoucherBlock[]>(demoVouchers);
  const [accDialog, setAccDialog] = useState<{
    open: boolean;
    vid: number;
    vIndex: number;
    sl: number;
    side: 'dr' | 'cr';
  } | null>(null);

  const openAcc = (vid: number, vIndex: number, sl: number, side: 'dr' | 'cr') =>
    setAccDialog({ open: true, vid, vIndex, sl, side });

  const saveAcc = (val: AccountDetailsValue) => {
    if (!accDialog) return;
    setVouchers(prev =>
      prev.map(v =>
        v.id !== accDialog.vid
          ? v
          : {
              ...v,
              lines: v.lines.map(l =>
                l.sl !== accDialog.sl
                  ? l
                  : { ...l, [accDialog.side === 'dr' ? 'drAccount' : 'crAccount']: val }
              ),
            }
      )
    );
  };

  const renderAcc = (acc?: AccountDetailsValue) => {
    if (!acc || !acc.accountNumber) {
      return (
        <>
          <div>Account Name&gt; S/C/B&gt;</div>
          <div>Department&gt; City &gt; Hub&gt;</div>
          <div>Zone &gt; Account Number</div>
        </>
      );
    }
    return (
      <>
        <div className="truncate">{acc.accountName} &gt; {acc.scb || '-'}</div>
        <div className="truncate">{acc.department || '-'} &gt; {acc.city || '-'} &gt; {acc.hub || '-'}</div>
        <div className="truncate">{acc.zone || '-'} &gt; {acc.accountNumber}</div>
      </>
    );
  };

  const addVoucher = () =>
    setVouchers(prev => [...prev, newVoucher(prev.length + 1)]);

  const removeVoucher = (id: number) => {
    if (vouchers.length > 1) setVouchers(prev => prev.filter(v => v.id !== id));
  };

  const addLine = (vid: number) =>
    setVouchers(prev =>
      prev.map(v =>
        v.id === vid ? { ...v, lines: [...v.lines, newLine(v.lines.length + 1)] } : v
      )
    );

  const removeLine = (vid: number, sl: number) =>
    setVouchers(prev =>
      prev.map(v =>
        v.id === vid && v.lines.length > 1
          ? { ...v, lines: v.lines.filter(l => l.sl !== sl).map((l, i) => ({ ...l, sl: i + 1 })) }
          : v
      )
    );

  const clearAll = () => setVouchers([newVoucher(1)]);

  const grandTotal = vouchers.reduce(
    (sum, v) => sum + v.lines.reduce((s, l) => s + l.drAmount, 0),
    0
  );
  const unbalanced = vouchers
    .map((v, i) => ({
      idx: i + 1,
      bad:
        v.lines.reduce((s, l) => s + l.drAmount, 0) !==
        v.lines.reduce((s, l) => s + l.crAmount, 0),
    }))
    .filter(x => x.bad);

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground">
          <span className="text-foreground font-semibold">Voucher</span> / Voucher Entry
        </div>

        {/* Header Row */}
        <div className="bg-card p-4 rounded-lg border grid grid-cols-12 gap-4 items-start">
          <div className="col-span-3 flex items-center gap-3">
            <Label className="font-semibold whitespace-nowrap">Batch Date</Label>
            <div className="relative flex-1">
              <Input
                value={batchDate}
                onChange={e => setBatchDate(e.target.value)}
                className="pr-8"
              />
              <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="col-span-6 flex items-center gap-3">
            <Label className="font-semibold whitespace-nowrap">Batch Reference</Label>
            <Input
              value={batchReference}
              onChange={e => setBatchReference(e.target.value)}
              placeholder="Enter reference"
              className="flex-1"
            />
          </div>
          <div className="col-span-3 flex flex-col items-end gap-1">
            <div className="flex items-center gap-3 w-full">
              <Label className="font-semibold whitespace-nowrap">Grand Total</Label>
              <Input
                value={grandTotal.toFixed(2)}
                readOnly
                className="text-right font-bold flex-1"
              />
            </div>
            {unbalanced.length > 0 && (
              <span className="text-xs text-destructive font-semibold">
                {unbalanced.map(u => `Voucher # ${u.idx} : DR ≠ CR`).join(' | ')}
              </span>
            )}
          </div>
        </div>

        {/* Voucher Blocks */}
        {vouchers.map((voucher, vi) => (
          <div key={voucher.id} className="bg-card border rounded-lg">
            <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30">
              <h3 className="font-semibold">Voucher # {vi + 1}</h3>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer select-none bg-yellow-100 dark:bg-yellow-900/40 px-2 py-1 rounded">
                  <span>Exclude Tax</span>
                  <Checkbox
                    checked={voucher.excludeTax}
                    onCheckedChange={(checked) =>
                      setVouchers(prev =>
                        prev.map(v => v.id === voucher.id ? { ...v, excludeTax: !!checked } : v)
                      )
                    }
                  />
                </label>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeVoucher(voucher.id)}
                  title="Collapse / Remove"
                >
                  <Minus size={16} />
                </Button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              <div className="grid grid-cols-12 gap-4 items-start">
                <div className="col-span-3 flex flex-col">
                  <Label className="text-xs font-semibold mb-1 h-4">
                    Voucher Date <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input placeholder="dd-MMM-yyyy" className="pr-8 h-10" />
                    <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="col-span-3 flex flex-col">
                  <Label className="text-xs font-semibold mb-1 h-4">
                    Voucher Type <span className="text-destructive">*</span>
                  </Label>
                  <Select>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="journal">Journal</SelectItem>
                      <SelectItem value="payment">Payment</SelectItem>
                      <SelectItem value="receipt">Receipt</SelectItem>
                      <SelectItem value="contra">Contra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-6 flex flex-col">
                  <Label className="text-xs font-semibold mb-1 h-4">
                    Particular <span className="text-destructive">*</span>
                  </Label>
                  <Textarea placeholder="Enter Particular" className="min-h-[40px] h-10 resize-none" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <TableWithSearch className="min-w-[1400px]">
                  <TableHeader>
                    <TableRow className="border-b bg-slate-300 hover:bg-slate-300">
                      <TableHead className="w-12 text-foreground font-bold">SL</TableHead>
                      <TableHead className="text-foreground font-bold min-w-[180px]">Account Details</TableHead>
                      <TableHead className="text-foreground font-bold min-w-[160px]">Descriptions</TableHead>
                      <TableHead className="text-right text-foreground font-bold min-w-[110px]">Dr. Amount</TableHead>
                      <TableHead className="text-right text-foreground font-bold min-w-[110px]">Cr. Amount</TableHead>
                      <TableHead className="text-foreground font-bold min-w-[180px]">Account Details</TableHead>
                      <TableHead className="text-foreground font-bold min-w-[160px]">Descriptions</TableHead>
                      <TableHead className="text-right text-foreground font-bold min-w-[110px]">Budget Amt.</TableHead>
                      <TableHead className="text-foreground font-bold min-w-[140px]">Reference</TableHead>
                      <TableHead className="text-center w-20 text-foreground font-bold leading-tight">Excl.<br/>Tax</TableHead>
                      <TableHead className="text-center w-24 text-foreground font-bold">Attachment</TableHead>
                      <TableHead className="text-center w-24 text-foreground font-bold">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {voucher.lines.map(line => (
                      <TableRow key={line.sl}>
                        <TableCell className="align-middle text-center">{line.sl}</TableCell>
                        <TableCell className="align-middle">
                          <div
                            onClick={() => openAcc(voucher.id, vi + 1, line.sl, 'dr')}
                            className="border rounded px-2 py-1.5 text-xs leading-tight bg-background h-[60px] flex flex-col justify-center cursor-pointer hover:border-primary whitespace-nowrap"
                          >
                            {renderAcc(line.drAccount)}
                          </div>
                        </TableCell>
                        <TableCell className="align-middle">
                          <Textarea placeholder="Descriptions" className="h-[60px] min-h-[60px] text-xs resize-none" />
                        </TableCell>
                        <TableCell className="align-middle">
                          <Input type="number" value={line.drAmount} onChange={() => {}} className="text-right h-[60px]" />
                        </TableCell>
                        <TableCell className="align-middle">
                          <Input type="number" value={line.crAmount} onChange={() => {}} className="text-right h-[60px]" />
                        </TableCell>
                        <TableCell className="align-middle">
                          <div
                            onClick={() => openAcc(voucher.id, vi + 1, line.sl, 'cr')}
                            className="border rounded px-2 py-1.5 text-xs leading-tight bg-background h-[60px] flex flex-col justify-center cursor-pointer hover:border-primary whitespace-nowrap"
                          >
                            {renderAcc(line.crAccount)}
                          </div>
                        </TableCell>
                        <TableCell className="align-middle">
                          <Textarea placeholder="Descriptions" defaultValue={line.drAccount?.accountName ? `${line.drAccount.accountName} entry` : ''} className="h-[60px] min-h-[60px] text-xs resize-none" />
                        </TableCell>
                        <TableCell className="align-middle">
                          <Input type="number" value={(line.drAmount || line.crAmount) * 1.1} readOnly className="text-right h-[60px]" />
                        </TableCell>
                        <TableCell className="align-middle">
                          <Input placeholder="Reference" className="h-[60px]" />
                        </TableCell>
                        <TableCell className="text-center align-middle">
                          <Checkbox />
                        </TableCell>
                        <TableCell className="text-center align-middle">
                          <Button variant="ghost" size="icon" title="Attach file">
                            <Paperclip size={16} />
                          </Button>
                        </TableCell>
                        <TableCell className="text-center align-middle">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-full bg-muted hover:bg-muted/80"
                              onClick={() => removeLine(voucher.id, line.sl)}
                            >
                              <Minus size={14} />
                            </Button>
                            {line.sl === voucher.lines.length && (
                              <Button
                                size="icon"
                                className="h-7 w-7 rounded-full"
                                onClick={() => addLine(voucher.id)}
                              >
                                <Plus size={14} />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/40 font-semibold">
                      <TableCell colSpan={3} className="text-right">
                        Total Amount:
                      </TableCell>
                      <TableCell className="text-right">
                        {voucher.lines.reduce((s, l) => s + l.drAmount, 0).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        {voucher.lines.reduce((s, l) => s + l.crAmount, 0).toFixed(2)}
                      </TableCell>
                      <TableCell colSpan={7}></TableCell>
                    </TableRow>
                  </TableBody>
                </TableWithSearch>
              </div>
            </div>
          </div>
        ))}

        {/* Footer Actions */}
        <div className="relative flex items-center justify-center gap-4 p-4">
          <Button variant="outline">Clear</Button>
          <Button>Submit</Button>
          <div className="absolute right-4 flex items-center gap-2">
            <Button
              size="icon"
              className="rounded-full h-9 w-9"
              onClick={addVoucher}
              title="Add voucher"
            >
              <Plus size={18} />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              className="rounded h-9 w-9"
              onClick={clearAll}
              title="Clear all"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </div>

      {accDialog && (
        <AccountDetailsDialog
          open={accDialog.open}
          onOpenChange={(o) => setAccDialog(prev => prev ? { ...prev, open: o } : prev)}
          voucherIndex={accDialog.vIndex}
          rowIndex={accDialog.sl}
          value={
            vouchers.find(v => v.id === accDialog.vid)?.lines.find(l => l.sl === accDialog.sl)?.[
              accDialog.side === 'dr' ? 'drAccount' : 'crAccount'
            ]
          }
          onSave={saveAcc}
        />
      )}
    </DashboardLayout>
  );
};

export default BatchVoucherEntry;
