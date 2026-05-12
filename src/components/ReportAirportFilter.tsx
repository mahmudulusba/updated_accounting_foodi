import React, { useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { mockAirportStations, AirportStation } from '@/lib/ticketSalesData';

interface ReportAirportFilterProps {
  selectedBranchIds: string[];
  selectedAirportId: string;
  onAirportChange: (airportId: string) => void;
  label?: string;
  showAllOption?: boolean;
}

export function ReportAirportFilter({
  selectedBranchIds,
  selectedAirportId,
  onAirportChange,
  label = 'Airport / Station',
  showAllOption = true,
}: ReportAirportFilterProps) {
  // Filter airports based on selected branches
  const availableAirports = useMemo(() => {
    if (selectedBranchIds.includes('all') || selectedBranchIds.length === 0) {
      return mockAirportStations.filter(a => a.status === 'active');
    }
    return mockAirportStations.filter(
      a => a.status === 'active' && selectedBranchIds.includes(a.branchId)
    );
  }, [selectedBranchIds]);

  // Group airports by branch for display
  const airportsByBranch = useMemo(() => {
    const grouped: Record<string, AirportStation[]> = {};
    availableAirports.forEach(airport => {
      if (!grouped[airport.branchName]) {
        grouped[airport.branchName] = [];
      }
      grouped[airport.branchName].push(airport);
    });
    return grouped;
  }, [availableAirports]);

  const selectedAirport = availableAirports.find(a => a.id === selectedAirportId);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={selectedAirportId} onValueChange={onAirportChange}>
        <SelectTrigger>
          <SelectValue placeholder="All Airports (Consolidated)">
            {selectedAirportId === 'all' || !selectedAirportId ? (
              <span>All Airports (Consolidated)</span>
            ) : selectedAirport ? (
              <span className="flex items-center gap-2">
                <span className="font-medium">{selectedAirport.airportCode}</span>
                <span className="text-muted-foreground">- {selectedAirport.airportName}</span>
              </span>
            ) : (
              <span>Select airport</span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-popover z-[9999] max-h-80">
          {showAllOption && (
            <SelectItem value="all">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/10 text-primary">All</Badge>
                <span>All Airports (Consolidated View)</span>
              </div>
            </SelectItem>
          )}
          {Object.entries(airportsByBranch).map(([branchName, airports]) => (
            <React.Fragment key={branchName}>
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50">
                {branchName}
              </div>
              {airports.map((airport) => (
                <SelectItem key={airport.id} value={airport.id}>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-primary">{airport.airportCode}</span>
                    <span className="text-muted-foreground">- {airport.airportName}</span>
                  </div>
                </SelectItem>
              ))}
            </React.Fragment>
          ))}
        </SelectContent>
      </Select>
      {selectedAirportId && selectedAirportId !== 'all' && selectedAirport && (
        <p className="text-xs text-muted-foreground">
          Showing revenue data for {selectedAirport.airportCode} only. Unearned revenue is not shown at airport level.
        </p>
      )}
    </div>
  );
}

export default ReportAirportFilter;
