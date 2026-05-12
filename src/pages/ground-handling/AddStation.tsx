import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { SearchableSelect } from '@/components/ground-handling/SearchableSelect';
import { COUNTRIES, REGIONS, STATION_TYPES } from '@/lib/groundHandlingData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AddStation() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    stationType: '',
    iataCode: '',
    icaoCode: '',
    stationName: '',
    country: '',
    region: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.stationType || !formData.iataCode || !formData.icaoCode || !formData.stationName || !formData.country || !formData.region) {
      toast.error('Please fill in all required fields');
      return;
    }

    toast.success('Station saved successfully');
    navigate('/management/ground-handling/station/list');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/management/ground-handling/station/list')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Add New Station</h1>
            <p className="text-muted-foreground">Create a new station entry</p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit}>
              <h2 className="text-lg font-semibold mb-6">Station Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Station Type */}
                <div className="space-y-2">
                  <Label>Station Type <span className="text-destructive">*</span></Label>
                  <Select 
                    value={formData.stationType} 
                    onValueChange={(value) => setFormData({ ...formData, stationType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select station type" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-[9999]">
                      {STATION_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* IATA Code */}
                <div className="space-y-2">
                  <Label>IATA Code <span className="text-destructive">*</span></Label>
                  <Input
                    placeholder="E.G., DAC"
                    value={formData.iataCode}
                    onChange={(e) => setFormData({ ...formData, iataCode: e.target.value.toUpperCase() })}
                    maxLength={3}
                  />
                </div>

                {/* ICAO Code */}
                <div className="space-y-2">
                  <Label>ICAO Code <span className="text-destructive">*</span></Label>
                  <Input
                    placeholder="E.G., VGZR"
                    value={formData.icaoCode}
                    onChange={(e) => setFormData({ ...formData, icaoCode: e.target.value.toUpperCase() })}
                    maxLength={4}
                  />
                </div>

                {/* Station Name */}
                <div className="space-y-2">
                  <Label>Station Name <span className="text-destructive">*</span></Label>
                  <Input
                    placeholder="Enter station name"
                    value={formData.stationName}
                    onChange={(e) => setFormData({ ...formData, stationName: e.target.value })}
                  />
                </div>

                {/* Country */}
                <SearchableSelect
                  label="Country"
                  required
                  options={COUNTRIES}
                  value={formData.country}
                  onChange={(value) => setFormData({ ...formData, country: value })}
                  placeholder="Select country"
                />

                {/* Region */}
                <div className="space-y-2">
                  <Label>Region <span className="text-destructive">*</span></Label>
                  <Select 
                    value={formData.region} 
                    onValueChange={(value) => setFormData({ ...formData, region: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-[9999]">
                      {REGIONS.map((region) => (
                        <SelectItem key={region} value={region}>{region}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-8">
                <Button type="submit" className="bg-primary">
                  Save Station
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate('/management/ground-handling/station/list')}
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
