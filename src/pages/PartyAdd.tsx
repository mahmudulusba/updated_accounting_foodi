import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Save, RotateCcw, X } from 'lucide-react';
import { defaultPartyTypes } from '@/pages/PartyTypeSetup';

export default function PartyAdd() {
  const [form, setForm] = useState({
    partyName: '',
    partyCode: '',
    mobile: '',
    nid: '',
    address: '',
    partyType: '',
  });

  const [linkedAccounts, setLinkedAccounts] = useState<{ code: string; name: string }[]>([]);

  const handleTypeChange = (typeId: string) => {
    setForm({ ...form, partyType: typeId });
    const pt = defaultPartyTypes.find(t => t.id === typeId);
    if (pt) {
      const accounts = pt.linkedGLCodes.map((code, i) => ({
        code,
        name: pt.linkedGLNames[i] || code,
      }));
      setLinkedAccounts(accounts);
    } else {
      setLinkedAccounts([]);
    }
  };

  const removeLinkedAccount = (code: string) => {
    setLinkedAccounts(prev => prev.filter(a => a.code !== code));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.partyName || !form.partyCode || !form.partyType) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success(`Party "${form.partyName}" added successfully`);
    handleReset();
  };

  const handleReset = () => {
    setForm({ partyName: '', partyCode: '', mobile: '', nid: '', address: '', partyType: '' });
    setLinkedAccounts([]);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <nav className="text-sm text-muted-foreground mb-2">
            <span className="text-primary">Party</span> / Add Party
          </nav>
          <h1 className="text-2xl font-bold">Add Party</h1>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Party Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="partyType">Type <span className="text-destructive">*</span></Label>
                  <Select value={form.partyType} onValueChange={handleTypeChange}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      {defaultPartyTypes.filter(t => t.status === 'active').map(t => (
                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="partyCode">Party Code <span className="text-destructive">*</span></Label>
                  <Input id="partyCode" value={form.partyCode} onChange={(e) => setForm({ ...form, partyCode: e.target.value })} placeholder="e.g. SUP-001" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="partyName">Party Name <span className="text-destructive">*</span></Label>
                <Input id="partyName" value={form.partyName} onChange={(e) => setForm({ ...form, partyName: e.target.value })} placeholder="Enter party name" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile</Label>
                  <Input id="mobile" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} placeholder="e.g. +880171XXXXXXX" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nid">NID</Label>
                  <Input id="nid" value={form.nid} onChange={(e) => setForm({ ...form, nid: e.target.value })} placeholder="National ID number" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Enter address" rows={3} />
              </div>

              {/* Linked Accounts Section */}
              {linkedAccounts.length > 0 && (
                <div className="space-y-2">
                  <Label>Linked Accounts</Label>
                  <div className="border rounded-md p-3 space-y-2">
                    {linkedAccounts.map(acc => (
                      <div key={acc.code} className="flex items-center justify-between bg-muted/50 rounded-md px-3 py-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs font-mono">{acc.code}</Badge>
                          <span className="text-sm">{acc.name}</span>
                        </div>
                        <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive" onClick={() => removeLinkedAccount(acc.code)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">These accounts are inherited from the selected Party Type. You can remove any that don't apply.</p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button type="submit"><Save className="h-4 w-4 mr-2" /> Save Party</Button>
                <Button type="button" variant="outline" onClick={handleReset}><RotateCcw className="h-4 w-4 mr-2" /> Reset</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
