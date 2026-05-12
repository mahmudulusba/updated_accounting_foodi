import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Check } from 'lucide-react';
import { GLEntry } from '@/contexts/AppContext';

interface GLSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  glEntries: GLEntry[];
  onSelect: (entry: GLEntry) => void;
}

export function GLSearchDialog({ open, onOpenChange, glEntries, onSelect }: GLSearchDialogProps) {
  const [filters, setFilters] = useState({
    accountType: '',
    accountNo: '',
    accountName: '',
  });

  const filteredEntries = glEntries.filter(entry => {
    const matchesType = !filters.accountType || entry.glType.toLowerCase().includes(filters.accountType.toLowerCase());
    const matchesNo = !filters.accountNo || entry.glCode.includes(filters.accountNo);
    const matchesName = !filters.accountName || entry.glName.toLowerCase().includes(filters.accountName.toLowerCase());
    return matchesType && matchesNo && matchesName && entry.status === 'active';
  });

  const handleSearch = () => {
    // Search is already reactive via filters
  };

  const handleSelect = (entry: GLEntry) => {
    onSelect(entry);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Search Account</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Account Type</Label>
              <Select
                value={filters.accountType}
                onValueChange={(value) => setFilters({ ...filters, accountType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Account Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Asset">Asset</SelectItem>
                  <SelectItem value="Liability">Liability</SelectItem>
                  <SelectItem value="Income">Income</SelectItem>
                  <SelectItem value="Expense">Expense</SelectItem>
                  <SelectItem value="Equity">Equity</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Account No.</Label>
              <Input
                value={filters.accountNo}
                onChange={(e) => setFilters({ ...filters, accountNo: e.target.value })}
                placeholder="Account No."
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Account Name</Label>
              <Input
                value={filters.accountName}
                onChange={(e) => setFilters({ ...filters, accountName: e.target.value })}
                placeholder="Account Name"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <Button onClick={handleSearch} className="bg-primary">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          {/* Results Table */}
          <div className="rounded-md border overflow-auto max-h-[350px]">
            <Table>
              <TableHeader className="sticky top-0 z-10">
                <TableRow className="bg-table-header hover:bg-table-header">
                  <TableHead className="text-table-header-foreground font-semibold">SL</TableHead>
                  <TableHead className="text-table-header-foreground font-semibold">Account Name</TableHead>
                  <TableHead className="text-table-header-foreground font-semibold">GL Code</TableHead>
                  <TableHead className="text-table-header-foreground font-semibold">GL Type</TableHead>
                  <TableHead className="text-table-header-foreground font-semibold w-20">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No accounts found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEntries.map((entry, index) => (
                    <TableRow key={entry.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{entry.glName}</TableCell>
                      <TableCell className="font-mono">{entry.glCode}</TableCell>
                      <TableCell>{entry.glType} ({entry.currency})</TableCell>
                      <TableCell>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 bg-primary text-primary-foreground hover:bg-primary/90"
                          onClick={() => handleSelect(entry)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
