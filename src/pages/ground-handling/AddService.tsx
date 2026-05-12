import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { MultiSelectDropdown } from '@/components/ground-handling/MultiSelectDropdown';
import { SUPPLIER_TYPES, UNITS_OF_MEASUREMENT } from '@/lib/groundHandlingData';

export default function AddService() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    serviceName: '',
    serviceCode: '',
    supplierTypes: [] as string[],
    units: [] as string[],
    description: '',
    criteria: [] as string[],
  });
  const [newCriterion, setNewCriterion] = useState('');

  const handleAddCriterion = () => {
    if (newCriterion.trim()) {
      setFormData({
        ...formData,
        criteria: [...formData.criteria, newCriterion.trim()],
      });
      setNewCriterion('');
    }
  };

  const handleRemoveCriterion = (index: number) => {
    setFormData({
      ...formData,
      criteria: formData.criteria.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.serviceName || formData.supplierTypes.length === 0 || formData.units.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    toast.success('Service created successfully');
    navigate('/management/ground-handling/services/list');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/management/ground-handling/services/list')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Add New Service</h1>
            <p className="text-muted-foreground">Create a new service entry</p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit}>
              <h2 className="text-lg font-semibold mb-6">Service Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Service Name */}
                <div className="space-y-2">
                  <Label>Service Name <span className="text-destructive">*</span></Label>
                  <Input
                    placeholder="Enter service name"
                    value={formData.serviceName}
                    onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                  />
                </div>

                {/* Service Code */}
                <div className="space-y-2">
                  <Label>Service Code</Label>
                  <Input
                    placeholder="Enter service code (optional)"
                    value={formData.serviceCode}
                    onChange={(e) => setFormData({ ...formData, serviceCode: e.target.value })}
                  />
                </div>

                {/* Supplier Type */}
                <MultiSelectDropdown
                  label="Supplier Type"
                  options={SUPPLIER_TYPES}
                  selected={formData.supplierTypes}
                  onChange={(selected) => setFormData({ ...formData, supplierTypes: selected })}
                  placeholder="Select supplier types"
                  showSelectAll
                  searchable
                />

                {/* Unit of Measurement */}
                <MultiSelectDropdown
                  label="Unit of Measurement"
                  options={UNITS_OF_MEASUREMENT}
                  selected={formData.units}
                  onChange={(selected) => setFormData({ ...formData, units: selected })}
                  placeholder="Select units"
                  showSelectAll
                  searchable
                />
              </div>

              {/* Description */}
              <div className="mt-6 space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Enter service description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              {/* Criteria */}
              <div className="mt-6 space-y-2">
                <Label>Criteria</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter criterion"
                    value={newCriterion}
                    onChange={(e) => setNewCriterion(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCriterion();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleAddCriterion}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.criteria.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.criteria.map((criterion, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full text-sm"
                      >
                        {criterion}
                        <button
                          type="button"
                          onClick={() => handleRemoveCriterion(index)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-8">
                <Button type="submit" className="bg-primary">
                  Create Service
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate('/management/ground-handling/services/list')}
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
