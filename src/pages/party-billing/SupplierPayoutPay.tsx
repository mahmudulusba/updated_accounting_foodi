import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function SupplierPayoutPay() {
  const navigate = useNavigate();
  const [paymentType, setPaymentType] = useState('default');
  const [amount, setAmount] = useState('-92');
  const [ref, setRef] = useState('');
  const [remarks, setRemarks] = useState('');
  const [advance, setAdvance] = useState('0');
  const [payInAdvance, setPayInAdvance] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <nav className="text-sm text-muted-foreground">
          Home / Supplier Billing / <span className="text-primary font-medium">Supplier Payout</span> / Pay
        </nav>
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4 mr-1" />Back</Button>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div><span className="text-muted-foreground">Statement No:</span> <strong>BAT-2604272123566959854</strong></div>
              <div><span className="text-muted-foreground">Shop Name:</span> <strong>Digital Pack</strong></div>
              <div><span className="text-muted-foreground">Supplier Name:</span> <strong>Khan Nazmul Islam</strong></div>
              <div><span className="text-muted-foreground">Supplier Code:</span> <strong>SLC00009470</strong></div>
              <div><span className="text-muted-foreground">Date Cycle:</span> <strong>20-Apr-2026 - 26-Apr-2026</strong></div>
              <div><span className="text-muted-foreground">Payment Status:</span> <strong className="text-warning">Pending</strong></div>
              <div><span className="text-muted-foreground">Generation Method:</span> <strong>Auto</strong></div>
              <div><span className="text-muted-foreground">Paid Amount:</span> <strong>0</strong></div>
              <div><span className="text-muted-foreground">Statement Amount:</span> <strong>-92</strong></div>
              <div><span className="text-muted-foreground">Remaining Amount:</span> <strong>-92</strong></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4">Payment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Payment Type *</Label>
                <Select value={paymentType} onValueChange={setPaymentType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover z-[9999]">
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                    <SelectItem value="bkash">bKash</SelectItem>
                    <SelectItem value="nagad">Nagad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Payment Amount *</Label>
                <Input value={amount} onChange={e => setAmount(e.target.value)} />
              </div>
              <div>
                <Label>Payment Reference *</Label>
                <Input value={ref} onChange={e => setRef(e.target.value)} placeholder="Enter Payment Reference" />
              </div>
              <div className="md:col-span-2">
                <Label>Remarks</Label>
                <Textarea value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="Enter Remarks" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Checkbox id="pay-in-advance" checked={payInAdvance} onCheckedChange={(v) => setPayInAdvance(!!v)} />
                  <Label htmlFor="pay-in-advance" className="cursor-pointer">Pay In Advance</Label>
                </div>
                <Input value={advance} onChange={e => setAdvance(e.target.value)} type="number" disabled={!payInAdvance} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => { setAmount(''); setRef(''); setRemarks(''); setAdvance('0'); }}>Reset</Button>
              <Button onClick={() => { toast.success('Payment submitted'); navigate(-1); }}>Submit</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}