import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Plane, ClipboardList } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { EnhancedCalendar } from '@/components/ui/enhanced-calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { mockJourneyLogs, mockStations } from '@/lib/groundHandlingData';
import { Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const getFlightStatusBadge = (status: string) => {
  switch (status) {
    case 'Arrived':
      return <Badge className="bg-success/20 text-success border-success/30">{status}</Badge>;
    case 'Delayed':
      return <Badge className="bg-warning/20 text-warning border-warning/30">{status}</Badge>;
    case 'Cancelled':
      return <Badge className="bg-destructive/20 text-destructive border-destructive/30">{status}</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getServiceStatusBadge = (status: string) => {
  switch (status) {
    case 'Approved':
      return <Badge className="bg-success/20 text-success border-success/30">{status}</Badge>;
    case 'Submitted':
      return <Badge className="bg-primary/20 text-primary border-primary/30">{status}</Badge>;
    case 'Draft':
      return <Badge className="bg-warning/20 text-warning border-warning/30">{status}</Badge>;
    case 'Not Started':
      return <Badge variant="outline" className="text-muted-foreground">{status}</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function JourneyLog() {
  const navigate = useNavigate();
  const [station, setStation] = useState('');
  const [flightDate, setFlightDate] = useState<Date>(new Date());
  const [flightNo, setFlightNo] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newLog, setNewLog] = useState({
    flightNo: '', flightDate: new Date(), aircraftReg: '', aircraftType: '',
    station: '', aircraftWeight: '', arrivalTime: '', departureTime: '',
  });

  const filteredLogs = mockJourneyLogs.filter(log => {
    const matchesStation = !station || log.station === station;
    const matchesFlight = !flightNo || log.flightNo.toLowerCase().includes(flightNo.toLowerCase());
    return matchesStation && matchesFlight;
  });

  const handleEnterServices = (flightId: string) => {
    navigate(`/management/ground-handling/flight-ops/service-data?flightId=${flightId}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Plane className="h-6 w-6 text-primary rotate-[-45deg]" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Journey Log</h1>
            <p className="text-muted-foreground">Station-wise flight movements and service data entry point</p>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="py-4">
            <h3 className="text-sm font-medium mb-3">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              {/* Station */}
              <div className="space-y-1">
                <label className="text-sm text-muted-foreground">Station</label>
                <Select value={station} onValueChange={setStation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select station" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-[9999]">
                    <SelectItem value="all">All Stations</SelectItem>
                    {mockStations.map((s) => (
                      <SelectItem key={s.id} value={s.iataCode}>{s.iataCode} - {s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Flight Date */}
              <div className="space-y-1">
                <label className="text-sm text-muted-foreground">Flight Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <Calendar className="mr-2 h-4 w-4" />
                      {format(flightDate, 'MMMM do, yyyy')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-popover z-[9999]" align="start">
                    <EnhancedCalendar
                      mode="single"
                      selected={flightDate}
                      onSelect={(date) => date && setFlightDate(date)}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Flight No */}
              <div className="space-y-1">
                <label className="text-sm text-muted-foreground">Flight No</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search flight..."
                    value={flightNo}
                    onChange={(e) => setFlightNo(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Create Button */}
              <Button className="bg-primary w-full" onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Journey Log
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <TableWithSearch>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Flight No</TableHead>
                  <TableHead>Flight Date</TableHead>
                  <TableHead>Aircraft Registration</TableHead>
                  <TableHead>Aircraft Type</TableHead>
                  <TableHead>Station</TableHead>
                  <TableHead>Aircraft Weight</TableHead>
                  <TableHead>Arrival Time</TableHead>
                  <TableHead>Departure Time</TableHead>
                  <TableHead>Flight Status</TableHead>
                  <TableHead>Service Entry Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.flightNo}</TableCell>
                    <TableCell>{log.flightDate}</TableCell>
                    <TableCell className="text-primary font-medium">{log.aircraftReg}</TableCell>
                    <TableCell>{log.aircraftType}</TableCell>
                    <TableCell>{log.station}</TableCell>
                    <TableCell>{parseInt(log.aircraftWeight).toLocaleString()} kg</TableCell>
                    <TableCell>{log.arrivalTime}</TableCell>
                    <TableCell>{log.departureTime}</TableCell>
                    <TableCell>{getFlightStatusBadge(log.flightStatus)}</TableCell>
                    <TableCell>{getServiceStatusBadge(log.serviceEntryStatus)}</TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        className={log.flightStatus === 'Cancelled' 
                          ? 'bg-destructive/80 hover:bg-destructive' 
                          : 'bg-primary'
                        }
                        onClick={() => handleEnterServices(log.id)}
                        disabled={log.flightStatus === 'Cancelled'}
                      >
                        <ClipboardList className="h-4 w-4 mr-1" />
                        Enter Services
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </TableWithSearch>
          </CardContent>
        </Card>
      </div>
      {/* Create Journey Log Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Journey Log</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="font-medium">Flight No *</Label>
                <Input placeholder="e.g. BS-101" value={newLog.flightNo} onChange={e => setNewLog({...newLog, flightNo: e.target.value})} />
              </div>
              <div className="space-y-1">
                <Label className="font-medium">Flight Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <Calendar className="mr-2 h-4 w-4" />
                      {format(newLog.flightDate, 'MMMM do, yyyy')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-popover z-[9999]" align="start">
                    <EnhancedCalendar mode="single" selected={newLog.flightDate} onSelect={(d) => d && setNewLog({...newLog, flightDate: d})} />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="font-medium">Aircraft Registration *</Label>
                <Input placeholder="e.g. S2-AJV" value={newLog.aircraftReg} onChange={e => setNewLog({...newLog, aircraftReg: e.target.value})} />
              </div>
              <div className="space-y-1">
                <Label className="font-medium">Aircraft Type *</Label>
                <Select value={newLog.aircraftType} onValueChange={v => setNewLog({...newLog, aircraftType: v})}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent className="bg-popover z-[9999]">
                    <SelectItem value="B737-800">B737-800</SelectItem>
                    <SelectItem value="DHC-8-Q400">DHC-8-Q400</SelectItem>
                    <SelectItem value="ATR 72-600">ATR 72-600</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="font-medium">Station *</Label>
                <Select value={newLog.station} onValueChange={v => setNewLog({...newLog, station: v})}>
                  <SelectTrigger><SelectValue placeholder="Select station" /></SelectTrigger>
                  <SelectContent className="bg-popover z-[9999]">
                    {mockStations.map(s => <SelectItem key={s.id} value={s.iataCode}>{s.iataCode} - {s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="font-medium">Aircraft Weight (kg)</Label>
                <Input type="number" placeholder="e.g. 41000" value={newLog.aircraftWeight} onChange={e => setNewLog({...newLog, aircraftWeight: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="font-medium">Arrival Time *</Label>
                <Input type="time" value={newLog.arrivalTime} onChange={e => setNewLog({...newLog, arrivalTime: e.target.value})} />
              </div>
              <div className="space-y-1">
                <Label className="font-medium">Departure Time *</Label>
                <Input type="time" value={newLog.departureTime} onChange={e => setNewLog({...newLog, departureTime: e.target.value})} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
            <Button className="bg-primary" onClick={() => {
              if (!newLog.flightNo || !newLog.station || !newLog.aircraftReg) {
                toast.error('Please fill in all required fields');
                return;
              }
              toast.success('Journey log created successfully');
              setShowCreateDialog(false);
              setNewLog({ flightNo: '', flightDate: new Date(), aircraftReg: '', aircraftType: '', station: '', aircraftWeight: '', arrivalTime: '', departureTime: '' });
            }}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
