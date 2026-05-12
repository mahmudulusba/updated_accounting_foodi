import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { SearchableSelect } from '@/components/ground-handling/SearchableSelect';
import { COUNTRIES, REGIONS, STATION_TYPES } from '@/lib/groundHandlingData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MultiSelectDropdown } from '@/components/ground-handling/MultiSelectDropdown';

interface AddStationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStationAdded?: () => void;
}

export function AddStationDialog({ open, onOpenChange, onStationAdded }: AddStationDialogProps) {
  const [formData, setFormData] = useState({
    stationType: [] as string[],
    iataCode: '',
    icaoCode: '',
    stationName: '',
    country: '',
    region: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.stationType.length === 0 || !formData.iataCode || !formData.icaoCode || !formData.stationName || !formData.country || !formData.region) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Station saved successfully');
    setFormData({ stationType: [], iataCode: '', icaoCode: '', stationName: '', country: '', region: '' });
    onStationAdded?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Station</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            {/* Col 1: Station Type - Dropdown */}
            <div className="space-y-2">
              <Label>Station Type <span className="text-destructive">*</span></Label>
              <MultiSelectDropdown
                label=""
                options={STATION_TYPES}
                selected={formData.stationType}
                onChange={(s) => setFormData({ ...formData, stationType: s })}
                placeholder="Select station type(s)"
                searchable
              />
            </div>
            {/* Col 2: IATA Code */}
            <div className="space-y-2">
              <Label>IATA Code <span className="text-destructive">*</span></Label>
              <Input placeholder="E.G., DAC" value={formData.iataCode} onChange={(e) => setFormData({ ...formData, iataCode: e.target.value.toUpperCase() })} maxLength={3} />
            </div>
            {/* Col 1: Station Name */}
            <div className="space-y-2">
              <Label>Station Name <span className="text-destructive">*</span></Label>
              <Input placeholder="Enter station name" value={formData.stationName} onChange={(e) => setFormData({ ...formData, stationName: e.target.value })} />
            </div>
            {/* Col 2: ICAO Code */}
            <div className="space-y-2">
              <Label>ICAO Code <span className="text-destructive">*</span></Label>
              <Input placeholder="E.G., VGZR" value={formData.icaoCode} onChange={(e) => setFormData({ ...formData, icaoCode: e.target.value.toUpperCase() })} maxLength={4} />
            </div>
            {/* Col 1: Country */}
            <SearchableSelect label="Country" required options={COUNTRIES} value={formData.country} onChange={(v) => setFormData({ ...formData, country: v })} placeholder="Select country" />
            {/* Col 2: Region */}
            <div className="space-y-2">
              <Label>Region <span className="text-destructive">*</span></Label>
              <Select value={formData.region} onValueChange={(v) => setFormData({ ...formData, region: v })}>
                <SelectTrigger><SelectValue placeholder="Select region" /></SelectTrigger>
                <SelectContent className="bg-popover z-[9999]">
                  {REGIONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Save Station</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
