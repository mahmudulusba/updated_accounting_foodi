import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Trash2, Search, MapPin, Plane } from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '@/contexts/AppContext';
import { mockAirportStations, AirportStation } from '@/lib/ticketSalesData';
import { COUNTRIES } from '@/lib/groundHandlingData';
import { SearchableSelect } from '@/components/ground-handling/SearchableSelect';

export default function AirportStationSetup() {
  const { branches } = useApp();
  const activeBranches = branches.filter(b => b.status === 'active' && !b.isConsolidated);
  const defaultBranch = activeBranches[0];

  const [airports, setAirports] = useState<AirportStation[]>(mockAirportStations);
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAirport, setEditingAirport] = useState<AirportStation | null>(null);

  const [formData, setFormData] = useState({
    airportCode: '',
    airportName: '',
    city: '',
    country: '',
    branchId: '',
    isActive: true,
  });

  const filteredAirports = useMemo(() => {
    return airports.filter(airport => {
      const matchesSearch = 
        airport.airportCode.toLowerCase().includes(search.toLowerCase()) ||
        airport.airportName.toLowerCase().includes(search.toLowerCase()) ||
        airport.city.toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    });
  }, [airports, search]);

  const handleOpenDialog = (airport?: AirportStation) => {
    if (airport) {
      setEditingAirport(airport);
      setFormData({
        airportCode: airport.airportCode,
        airportName: airport.airportName,
        city: airport.city,
        country: airport.country,
        branchId: airport.branchId || defaultBranch?.id || '',
        isActive: airport.status === 'active',
      });
    } else {
      setEditingAirport(null);
      setFormData({
        airportCode: '',
        airportName: '',
        city: '',
        country: '',
        branchId: defaultBranch?.id || '',
        isActive: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.airportCode || !formData.airportName || !formData.city || !formData.country) {
      toast.error('Please fill in all required fields');
      return;
    }
    const selectedBranch = activeBranches.find(b => b.id === formData.branchId) || defaultBranch;
    if (!selectedBranch) {
      toast.error('Company setup is not available');
      return;
    }
    const status = formData.isActive ? 'active' : 'inactive';
    if (editingAirport) {
      setAirports(airports.map(a => 
        a.id === editingAirport.id 
          ? { ...a, ...formData, status: status as 'active' | 'inactive', branchCode: selectedBranch.code, branchName: selectedBranch.name }
          : a
      ));
      toast.success('Airport/Station updated successfully');
    } else {
      const newAirport: AirportStation = {
        id: Date.now().toString(),
        airportCode: formData.airportCode,
        airportName: formData.airportName,
        city: formData.city,
        country: formData.country,
        branchId: formData.branchId,
        status: status as 'active' | 'inactive',
        branchCode: selectedBranch.code,
        branchName: selectedBranch.name,
        createdAt: new Date(),
      };
      setAirports([...airports, newAirport]);
      toast.success('Airport/Station created successfully');
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setAirports(airports.filter(a => a.id !== id));
    toast.success('Airport/Station deleted successfully');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Plane className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Airport / Station Master</h1>
            <p className="text-muted-foreground">Manage operational airport stations for revenue recognition</p>
          </div>
        </div>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-foreground">Airport/Station Rules:</p>
                <ul className="text-muted-foreground mt-1 space-y-1">
                  <li>• Revenue recognition happens at Airport level (when flight departs)</li>
                  <li>• Airport is mandatory only during flown revenue recognition</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search airports..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
          </div>
          <Button className="bg-primary" onClick={() => handleOpenDialog()}>
            <Plus className="h-4 w-4 mr-2" /> Add Airport/Station
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <TableWithSearch>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Airport Code</TableHead>
                  <TableHead>Airport Name</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAirports.map((airport) => (
                  <TableRow key={airport.id}>
                    <TableCell className="font-semibold text-primary">{airport.airportCode}</TableCell>
                    <TableCell>{airport.airportName}</TableCell>
                    <TableCell>{airport.city}</TableCell>
                    <TableCell>{airport.country}</TableCell>
                    <TableCell>
                      <Badge className={airport.status === 'active' ? 'bg-success/20 text-success border-success/30' : 'bg-muted text-muted-foreground'}>{airport.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenDialog(airport)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(airport.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredAirports.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No airports/stations found</TableCell></TableRow>
                )}
              </TableBody>
            </TableWithSearch>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingAirport ? 'Edit Airport/Station' : 'Add New Airport/Station'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Airport Code <span className="text-destructive">*</span></Label>
                  <Input
                    placeholder="e.g., HSIA"
                    value={formData.airportCode}
                    onChange={(e) => setFormData({ ...formData, airportCode: e.target.value.toUpperCase() })}
                    maxLength={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id="airport-status"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: !!checked })}
                    />
                    <Label htmlFor="airport-status">Active</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Airport Name <span className="text-destructive">*</span></Label>
                <Input placeholder="Enter airport name" value={formData.airportName} onChange={(e) => setFormData({ ...formData, airportName: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>City <span className="text-destructive">*</span></Label>
                  <Input placeholder="Enter city" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                </div>
                <SearchableSelect
                  label="Country"
                  required
                  options={COUNTRIES}
                  value={formData.country}
                  onChange={(value) => setFormData({ ...formData, country: value })}
                  placeholder="Select country"
                />
              </div>

            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>{editingAirport ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
