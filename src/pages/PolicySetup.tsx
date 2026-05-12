import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, X, Pencil, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface PolicyRecord {
  id: number;
  policyRulesName: string;
  allowed: boolean;
}

const policyRulesOptions = [
  'Back Date Transaction',
  'Holiday Transaction',
  'Week End Transaction',
  'Future Date Transaction',
  'Auto Posting',
  'Same Person Maker Checker',
];

export default function PolicySetup() {
  const [selectedPolicy, setSelectedPolicy] = useState('');
  const [allowed, setAllowed] = useState('');
  const [policies, setPolicies] = useState<PolicyRecord[]>([
    { id: 1, policyRulesName: 'Back Date Transaction', allowed: true },
    { id: 2, policyRulesName: 'Holiday Transaction', allowed: false },
  ]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [nextId, setNextId] = useState(3);
  const [modalOpen, setModalOpen] = useState(false);

  const handleSubmit = () => {
    if (!selectedPolicy || !allowed) {
      toast.error('Please fill all required fields');
      return;
    }

    const isAllowed = allowed === 'Yes';

    if (editingId !== null) {
      setPolicies(prev =>
        prev.map(p => p.id === editingId
          ? { ...p, policyRulesName: selectedPolicy, allowed: isAllowed }
          : p
        )
      );
      setEditingId(null);
      toast.success('Policy updated successfully');
    } else {
      const exists = policies.some(
        p => p.policyRulesName === selectedPolicy
      );
      if (exists) {
        toast.error('This policy already exists. Please edit the existing one.');
        return;
      }
      setPolicies(prev => [...prev, { id: nextId, policyRulesName: selectedPolicy, allowed: isAllowed }]);
      setNextId(prev => prev + 1);
      toast.success('Policy added successfully');
    }
    handleClear();
    setModalOpen(false);
  };

  const handleClear = () => {
    setSelectedPolicy('');
    setAllowed('');
    setEditingId(null);
  };

  const handleEdit = (record: PolicyRecord) => {
    setSelectedPolicy(record.policyRulesName);
    setAllowed(record.allowed ? 'Yes' : 'No');
    setEditingId(record.id);
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setPolicies(prev => prev.filter(p => p.id !== id));
    toast.success('Policy deleted successfully');
  };

  const getPolicyDescription = (name: string) => {
    switch (name) {
      case 'Back Date Transaction': return 'Allow back-dated transactions';
      case 'Holiday Transaction': return 'Allow transactions on holidays';
      case 'Week End Transaction': return 'Allow transactions on weekends';
      case 'Future Date Transaction': return 'Allow future-dated transactions';
      case 'Auto Posting': return 'Enable automatic posting';
      case 'Same Person Maker Checker': return 'Maker & Checker can be the same person';
      default: return '';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <nav className="text-sm text-muted-foreground">
          <span className="text-primary font-medium">Central Configuration</span> / Policy
        </nav>

        <Card>
          <CardContent className="pt-4 space-y-6">
            <div className="flex items-center justify-between border-b pb-2">
              <h1 className="text-lg font-bold">Policy</h1>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => { handleClear(); setModalOpen(true); }}>
                  <Plus size={16} className="mr-1" />Add Policy
                </Button>
                <Button variant="default" size="icon" className="h-8 w-8 bg-primary">
                  <Download size={16} />
                </Button>
              </div>
            </div>

            <div className="border rounded-md">
              <TableWithSearch>
                <TableHeader>
                  <TableRow className="bg-table-header hover:bg-table-header">
                    <TableHead className="text-table-header-foreground font-semibold w-16 text-center">SL</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Policy Rules Name</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold text-center w-28">Allowed</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold text-center w-28">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {policies.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No policies configured
                      </TableCell>
                    </TableRow>
                  ) : (
                    policies.map((row, idx) => (
                      <TableRow key={row.id}>
                        <TableCell className="text-center text-muted-foreground">{idx + 1}</TableCell>
                        <TableCell className="font-medium">{row.policyRulesName}</TableCell>
                        <TableCell className="text-center">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded ${row.allowed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {row.allowed ? 'Yes' : 'No'}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                              onClick={() => handleEdit(row)}
                            >
                              <Pencil size={14} />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleDelete(row.id)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </TableWithSearch>
            </div>
          </CardContent>
        </Card>

        <Dialog open={modalOpen} onOpenChange={(o) => { setModalOpen(o); if (!o) handleClear(); }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Policy' : 'Add Policy'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">
                  Policy Rules Name <span className="text-destructive">*</span>
                </Label>
                <Select value={selectedPolicy} onValueChange={setSelectedPolicy}>
                  <SelectTrigger><SelectValue placeholder="Select Policy" /></SelectTrigger>
                  <SelectContent>
                    {policyRulesOptions.map(opt => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedPolicy && (
                  <p className="text-xs text-muted-foreground italic">{getPolicyDescription(selectedPolicy)}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">
                  Allowed <span className="text-destructive">*</span>
                </Label>
                <Select value={allowed} onValueChange={setAllowed}>
                  <SelectTrigger><SelectValue placeholder="Yes / No" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { handleClear(); setModalOpen(false); }}>Cancel</Button>
              <Button onClick={handleSubmit}>{editingId ? 'Update' : 'Submit'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
