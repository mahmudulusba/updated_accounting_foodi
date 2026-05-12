import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useApp } from '@/contexts/AppContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Card, CardContent } from '@/components/ui/card';
import { Download, X, Search, Edit2, Trash2, ChevronRight, Plus } from 'lucide-react';
import { toast } from 'sonner';

const accountTypes = ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'];

interface ParentGLEntry {
  id: string;
  glName: string;
  glCode: string;
  glType: string;
  parentGLCode: string;
  status: 'active' | 'inactive';
}

const defaultParentGLEntries: ParentGLEntry[] = [
  { id: '1', glName: 'Assets', glCode: '10000', glType: 'Asset', parentGLCode: '', status: 'active' },
  { id: '2', glName: 'Liabilities', glCode: '20000', glType: 'Liabilities', parentGLCode: '', status: 'active' },
  { id: '3', glName: 'Equity', glCode: '30000', glType: 'Equity', parentGLCode: '', status: 'active' },
  { id: '4', glName: 'Revenue', glCode: '40000', glType: 'Revenue', parentGLCode: '', status: 'active' },
];

export default function ParentGL() {
  const { selectedBranch } = useApp();
  const isConsolidated = selectedBranch?.isConsolidated === true;
  const [entries, setEntries] = useState<ParentGLEntry[]>(defaultParentGLEntries);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    parentGLCode: '',
    parentGLName: '',
    accountType: '',
    glCode: '',
    glName: '',
    glLevel: '',
    status: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.glName || !formData.glCode) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newEntry: ParentGLEntry = {
      id: Date.now().toString(),
      glName: formData.glName,
      glCode: formData.glCode,
      glType: formData.accountType,
      parentGLCode: formData.parentGLCode,
      status: formData.status ? 'active' : 'inactive',
    };
    setEntries([...entries, newEntry]);
    toast.success('Parent GL created successfully');
    handleClear();
    setShowForm(false);
  };

  const handleClear = () => {
    setFormData({
      parentGLCode: '',
      parentGLName: '',
      accountType: '',
      glCode: '',
      glName: '',
      glLevel: '',
      status: true,
    });
  };

  const handleDelete = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
    toast.success('Parent GL deleted successfully');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <nav className="text-sm text-muted-foreground mb-2">
              <span className="text-primary">GL Module</span> / Parent GL
            </nav>
            <h1 className="text-2xl font-bold">Parent GL {showForm ? '/ Create' : '/ List'}</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="default" size="icon">
              <Download className="h-4 w-4" />
            </Button>
            {!isConsolidated && !showForm && (
              <Button variant="default" size="icon" onClick={() => setShowForm(true)} title="Add">
                <Plus className="h-4 w-4" />
              </Button>
            )}
            {showForm && (
              <Button variant="destructive" size="icon" onClick={() => { handleClear(); setShowForm(false); }} title="Close">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {isConsolidated ? (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Parent GL creation is available from company-level configuration only. You are viewing all Parent GLs in read-only mode.
            </AlertDescription>
          </Alert>
        ) : showForm ? (
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Parent GL code<span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <Input
                      placeholder="Enter Parent GL code"
                      value={formData.parentGLCode}
                      onChange={(e) => setFormData({ ...formData, parentGLCode: e.target.value })}
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary cursor-pointer" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Parent GL Name</Label>
                  <Input
                    placeholder="Parent GL Name"
                    value={formData.parentGLName}
                    className="bg-muted"
                    readOnly
                  />
                </div>

                <div className="space-y-2">
                  <Label>Account Type<span className="text-destructive">*</span></Label>
                  <Select
                    value={formData.accountType}
                    onValueChange={(value) => setFormData({ ...formData, accountType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Account Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {accountTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>GL Code<span className="text-destructive">*</span></Label>
                  <Input
                    placeholder=""
                    value={formData.glCode}
                    onChange={(e) => setFormData({ ...formData, glCode: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>GL Name<span className="text-destructive">*</span></Label>
                  <Input
                    placeholder="Enter GL name"
                    value={formData.glName}
                    onChange={(e) => setFormData({ ...formData, glName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>GL Level</Label>
                  <Input
                    placeholder="GL level"
                    value={formData.glLevel}
                    className="bg-muted"
                    readOnly
                  />
                </div>

                <div className="space-y-2">
                  <Label>Status<span className="text-destructive">*</span></Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="status"
                      checked={formData.status}
                      onCheckedChange={(checked) => setFormData({ ...formData, status: !!checked })}
                    />
                    <Label htmlFor="status">Active</Label>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 flex justify-center gap-4 pt-4">
                <Button type="button" variant="secondary" onClick={handleClear}>
                  Clear
                </Button>
                <Button type="submit">
                  Submit
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        ) : null}

        <Card>
          <CardContent className="pt-6">
            <div className="rounded-md border overflow-hidden">
              <TableWithSearch>
                <TableHeader>
                  <TableRow className="bg-table-header hover:bg-table-header">
                    <TableHead className="text-table-header-foreground font-semibold w-10"></TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">GL Name</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">GL Code</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">GL Type</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Parent GL Code</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Status</TableHead>
                    <TableHead className="text-table-header-foreground font-semibold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.map((entry, index) => (
                    <TableRow key={entry.id} className={index % 2 === 1 ? 'bg-table-row-alt' : ''}>
                      <TableCell>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </TableCell>
                      <TableCell>{entry.glName}</TableCell>
                      <TableCell>{entry.glCode}</TableCell>
                      <TableCell>{entry.glType}</TableCell>
                      <TableCell>{entry.parentGLCode || '-'}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center gap-1.5 text-sm ${entry.status === 'active' ? 'text-success' : 'text-muted-foreground'}`}>
                          <span className={`w-2 h-2 rounded-full ${entry.status === 'active' ? 'bg-success' : 'bg-muted-foreground'}`}></span>
                          {entry.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-primary hover:text-primary">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(entry.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </TableWithSearch>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
