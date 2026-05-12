import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { SearchableSelect } from '@/components/ground-handling/SearchableSelect';
import { COUNTRIES, SUPPLIER_TYPES, mockStations } from '@/lib/groundHandlingData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AddSupplier() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    supplierType: '',
    country: '',
    station: '',
    name: '',
    contactName: '',
    designation: '',
    email: '',
    phone: '',
    fax: '',
    remarks: '',
    bankName: '',
    accountName: '',
    accountNumber: '',
    branchName: '',
    swiftCode: '',
    routingNumber: '',
  });

  // Filter stations by selected country
  const filteredStations = formData.country 
    ? mockStations.filter(s => s.country === formData.country)
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.supplierType || !formData.country || !formData.station || !formData.name || 
        !formData.contactName || !formData.designation || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    toast.success('Supplier saved successfully');
    navigate('/management/ground-handling/suppliers/list');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Add New Supplier</h1>
        </div>

        {/* Form */}
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Supplier Type */}
                <div className="space-y-2">
                  <Label>Supplier Type <span className="text-destructive">*</span></Label>
                  <Select 
                    value={formData.supplierType} 
                    onValueChange={(value) => setFormData({ ...formData, supplierType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-[9999]">
                      {SUPPLIER_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Country */}
                <SearchableSelect
                  label="Country"
                  required
                  options={COUNTRIES}
                  value={formData.country}
                  onChange={(value) => setFormData({ ...formData, country: value, station: '' })}
                  placeholder="Select country"
                />

                {/* Station */}
                <div className="space-y-2">
                  <Label>Station <span className="text-destructive">*</span></Label>
                  <Select 
                    value={formData.station} 
                    onValueChange={(value) => setFormData({ ...formData, station: value })}
                    disabled={!formData.country}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select station" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-[9999]">
                      {filteredStations.map((station) => (
                        <SelectItem key={station.id} value={station.iataCode}>
                          {station.iataCode} - {station.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!formData.country && (
                    <p className="text-xs text-muted-foreground">Select a country first</p>
                  )}
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <Label>Name <span className="text-destructive">*</span></Label>
                  <Input
                    placeholder="Supplier name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                {/* Contact Name */}
                <div className="space-y-2">
                  <Label>Contact Name <span className="text-destructive">*</span></Label>
                  <Input
                    placeholder="Contact person"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  />
                </div>

                {/* Designation */}
                <div className="space-y-2">
                  <Label>Designation <span className="text-destructive">*</span></Label>
                  <Input
                    placeholder="Job title"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label>Email <span className="text-destructive">*</span></Label>
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    placeholder="+1 234 567 8900"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                {/* Fax */}
                <div className="space-y-2 md:col-span-1">
                  <Label>Fax</Label>
                  <Input
                    placeholder="+1 234 567 8901"
                    value={formData.fax}
                    onChange={(e) => setFormData({ ...formData, fax: e.target.value })}
                  />
                </div>
              </div>

              {/* Remarks */}
              <div className="mt-6 space-y-2">
                <Label>Remarks / Notes</Label>
                <Textarea
                  placeholder="Additional notes about this supplier..."
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  rows={3}
                />
              </div>

              {/* Account Information */}
              <h3 className="text-lg font-semibold mt-8 mb-4">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Bank Name</Label>
                  <Input
                    placeholder="Enter bank name"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Account Name</Label>
                  <Input
                    placeholder="Enter account name"
                    value={formData.accountName}
                    onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Account Number</Label>
                  <Input
                    placeholder="Enter account number"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Branch Name</Label>
                  <Input
                    placeholder="Enter branch name"
                    value={formData.branchName}
                    onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>SWIFT Code</Label>
                  <Input
                    placeholder="Enter SWIFT code"
                    value={formData.swiftCode}
                    onChange={(e) => setFormData({ ...formData, swiftCode: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Routing Number</Label>
                  <Input
                    placeholder="Enter routing number"
                    value={formData.routingNumber}
                    onChange={(e) => setFormData({ ...formData, routingNumber: e.target.value })}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-8">
                <Button type="submit" className="bg-primary">
                  Save Supplier
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate('/management/ground-handling/suppliers/list')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
