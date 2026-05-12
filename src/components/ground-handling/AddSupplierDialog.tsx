import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';
import { SearchableSelect } from '@/components/ground-handling/SearchableSelect';
import { COUNTRIES, SUPPLIER_TYPES, mockStations } from '@/lib/groundHandlingData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddSupplierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSupplierAdded?: () => void;
}

export function AddSupplierDialog({ open, onOpenChange, onSupplierAdded }: AddSupplierDialogProps) {
  const [formData, setFormData] = useState({
    name: '', contactName: '', designation: '', email: '', phone: '', fax: '',
    supplierType: '', country: '', station: '', remarks: '',
    bankName: '', accountName: '', accountNumber: '', branchName: '', swiftCode: '', routingNumber: '',
  });

  const filteredStations = formData.country ? mockStations.filter(s => s.country === formData.country) : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.contactName || !formData.designation || !formData.email || !formData.supplierType || !formData.country || !formData.station) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Supplier saved successfully');
    onSupplierAdded?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Supplier</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            {/* Supplier Information */}
            <div className="space-y-4 border rounded-lg p-4">
              <h3 className="font-semibold">Supplier Information</h3>
              <div className="space-y-2">
                <Label>Name <span className="text-destructive">*</span></Label>
                <Input placeholder="Supplier name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Contact Name <span className="text-destructive">*</span></Label>
                <Input placeholder="Contact person" value={formData.contactName} onChange={(e) => setFormData({ ...formData, contactName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Designation <span className="text-destructive">*</span></Label>
                <Input placeholder="Job title" value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Email <span className="text-destructive">*</span></Label>
                <Input type="email" placeholder="email@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input placeholder="+1 234 567 8900" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Fax</Label>
                <Input placeholder="+1 234 567 8901" value={formData.fax} onChange={(e) => setFormData({ ...formData, fax: e.target.value })} />
              </div>
            </div>

            {/* Other Information */}
            <div className="space-y-4 border rounded-lg p-4">
              <h3 className="font-semibold">Other Information</h3>
              <div className="space-y-2">
                <Label>Type <span className="text-destructive">*</span></Label>
                <Select value={formData.supplierType} onValueChange={(v) => setFormData({ ...formData, supplierType: v })}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent className="bg-popover z-[9999]">
                    {SUPPLIER_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <SearchableSelect label="Country" required options={COUNTRIES} value={formData.country} onChange={(v) => setFormData({ ...formData, country: v, station: '' })} placeholder="Select country" />
              <div className="space-y-2">
                <Label>Station <span className="text-destructive">*</span></Label>
                <Select value={formData.station} onValueChange={(v) => setFormData({ ...formData, station: v })} disabled={!formData.country}>
                  <SelectTrigger><SelectValue placeholder="Select station" /></SelectTrigger>
                  <SelectContent className="bg-popover z-[9999]">
                    {filteredStations.map((s) => <SelectItem key={s.id} value={s.iataCode}>{s.iataCode} - {s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                {!formData.country && <p className="text-xs text-muted-foreground">Select a country first</p>}
              </div>
              <div className="space-y-2">
                <Label>Remarks / Notes</Label>
                <Textarea placeholder="Additional notes about this supplier..." value={formData.remarks} onChange={(e) => setFormData({ ...formData, remarks: e.target.value })} rows={4} />
              </div>
            </div>
          </div>

          {/* Account Information - Collapsible */}
          <Accordion type="single" collapsible className="mb-4">
            <AccordionItem value="account">
              <AccordionTrigger className="text-base font-semibold">Account Information</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <Label>Bank Name</Label>
                    <Input placeholder="Enter bank name" value={formData.bankName} onChange={(e) => setFormData({ ...formData, bankName: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Account Name</Label>
                    <Input placeholder="Enter account name" value={formData.accountName} onChange={(e) => setFormData({ ...formData, accountName: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Account Number</Label>
                    <Input placeholder="Enter account number" value={formData.accountNumber} onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Branch Name</Label>
                    <Input placeholder="Enter branch name" value={formData.branchName} onChange={(e) => setFormData({ ...formData, branchName: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>SWIFT Code</Label>
                    <Input placeholder="Enter SWIFT code" value={formData.swiftCode} onChange={(e) => setFormData({ ...formData, swiftCode: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Routing Number</Label>
                    <Input placeholder="Enter routing number" value={formData.routingNumber} onChange={(e) => setFormData({ ...formData, routingNumber: e.target.value })} />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Save Supplier</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
