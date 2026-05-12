import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, ArrowLeft, Pencil, Trash2, Search, ChevronRight, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

interface AssetGroup {
  id: string;
  groupCode: string;
  groupName: string;
  assetType: 'Tangible' | 'Intangible';
  description: string;
  parentGL: string;
  parentGLCode: string;
  subsidiaryLedger: string;
  status: 'Active' | 'Inactive';
  isParent: boolean;
  children?: AssetGroup[];
}

const defaultGroups: AssetGroup[] = [
  { id: '1', groupCode: 'PPE-001', groupName: 'Property, Plant & Equipment', assetType: 'Tangible', description: 'All tangible fixed assets', parentGL: 'Property, Plant & Equipments (PPE)', parentGLCode: '10001', subsidiaryLedger: 'Fixed Assets', status: 'Active', isParent: true, children: [
    { id: '1a', groupCode: 'LTP-101', groupName: 'Laptop', assetType: 'Tangible', description: 'IT related products', parentGL: 'IT Equipment', parentGLCode: '10002', subsidiaryLedger: 'IT Equipments', status: 'Active', isParent: false },
    { id: '1b', groupCode: 'FRN-102', groupName: 'Furniture & Fixture', assetType: 'Tangible', description: 'Office furniture', parentGL: 'Furniture', parentGLCode: '10003', subsidiaryLedger: 'Office Furniture', status: 'Active', isParent: false },
  ]},
  { id: '2', groupCode: 'INT-001', groupName: 'Intangible Assets', assetType: 'Intangible', description: 'Software, patents, etc.', parentGL: 'Intangible Assets', parentGLCode: '10010', subsidiaryLedger: 'Intangibles', status: 'Active', isParent: true, children: [
    { id: '2a', groupCode: 'SFT-201', groupName: 'Software Licenses', assetType: 'Intangible', description: 'Application licenses', parentGL: 'Software', parentGLCode: '10011', subsidiaryLedger: 'Software', status: 'Active', isParent: false },
  ]},
];

export default function AssetGroupSetup() {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [groups, setGroups] = useState<AssetGroup[]>(defaultGroups);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [searchText, setSearchText] = useState('');
  const [editingGroup, setEditingGroup] = useState<AssetGroup | null>(null);
  const [form, setForm] = useState<{ groupCode: string; groupName: string; assetType: 'Tangible' | 'Intangible'; description: string; parentGL: string; parentGLCode: string; subsidiaryLedger: string; status: 'Active' | 'Inactive'; isParent: boolean }>({ groupCode: '', groupName: '', assetType: 'Tangible', description: '', parentGL: '', parentGLCode: '', subsidiaryLedger: '', status: 'Active', isParent: false });

  const toggleExpand = (id: string) => {
    const next = new Set(expandedGroups);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpandedGroups(next);
  };

  const handleSave = () => {
    if (!form.groupCode || !form.groupName) { toast.error('Please fill required fields'); return; }
    if (!form.isParent && !form.subsidiaryLedger) { toast.error('Subsidiary Ledger is mandatory for Sub Group'); return; }
    if (editingGroup) {
      toast.success('Asset group updated');
    } else {
      toast.success('Asset group created');
    }
    setView('list');
    setEditingGroup(null);
  };

  const handleEdit = (group: AssetGroup) => {
    setEditingGroup(group);
    setForm({ groupCode: group.groupCode, groupName: group.groupName, assetType: group.assetType, description: group.description, parentGL: group.parentGL, parentGLCode: group.parentGLCode, subsidiaryLedger: group.subsidiaryLedger, status: group.status, isParent: group.isParent });
    setView('form');
  };

  const renderRow = (group: AssetGroup, depth = 0) => {
    const isExpanded = expandedGroups.has(group.id);
    const hasChildren = group.children && group.children.length > 0;
    return (
      <React.Fragment key={group.id}>
        <TableRow>
          <TableCell style={{ paddingLeft: `${depth * 24 + 16}px` }}>
            {hasChildren && (
              <button onClick={() => toggleExpand(group.id)} className="mr-2 inline-flex">
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
            )}
          </TableCell>
          <TableCell className="font-mono">{group.groupCode}</TableCell>
          <TableCell>{group.groupName}</TableCell>
          <TableCell>{group.description}</TableCell>
          <TableCell>{group.parentGL}</TableCell>
          <TableCell><Badge variant={group.status === 'Active' ? 'default' : 'secondary'}>{group.status}</Badge></TableCell>
          <TableCell>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => handleEdit(group)}><Pencil size={14} /></Button>
              <Button variant="ghost" size="icon"><Trash2 size={14} /></Button>
            </div>
          </TableCell>
        </TableRow>
        {hasChildren && isExpanded && group.children!.map(child => renderRow(child, depth + 1))}
      </React.Fragment>
    );
  };

  return (
    <DashboardLayout>
      {view === 'list' ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Asset Group List</h1>
            <Button onClick={() => { setEditingGroup(null); setForm({ groupCode: '', groupName: '', assetType: 'Tangible', description: '', parentGL: '', parentGLCode: '', subsidiaryLedger: '', status: 'Active', isParent: false }); setView('form'); }}>
              <Plus size={16} className="mr-2" /> Create
            </Button>
          </div>
          <Card>
            <CardHeader><CardTitle className="text-sm">Advanced Search</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div><Label>Asset Code</Label><Input placeholder="Search by code" /></div>
                <div><Label>Name</Label><Input placeholder="Search by name" /></div>
                <div><Label>Group</Label><Input placeholder="Asset Group" /></div>
                <div><Label>Sub Group</Label><Input placeholder="Asset Sub Group" /></div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm"><Search size={14} className="mr-1" /> Search</Button>
                <Button size="sm" variant="outline">Clear</Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-0">
              <TableWithSearch>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Asset Group Code</TableHead>
                    <TableHead>Asset Group Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Parent GL</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>{groups.map(g => renderRow(g))}</TableBody>
              </TableWithSearch>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Asset Group Setup</h1>
            <Button variant="outline" onClick={() => setView('list')}><ArrowLeft size={16} className="mr-2" /> Back to List</Button>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-6">
                <div><Label>Asset Group Code *</Label><Input value={form.groupCode} onChange={e => setForm({...form, groupCode: e.target.value})} placeholder="e.g. LTP-101" /></div>
                <div><Label>Asset Group Name *</Label><Input value={form.groupName} onChange={e => setForm({...form, groupName: e.target.value})} placeholder="e.g. Laptop" /></div>
                <div><Label>Asset Type *</Label>
                  <Select value={form.assetType} onValueChange={v => setForm({...form, assetType: v as any})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="Tangible">Tangible</SelectItem><SelectItem value="Intangible">Intangible</SelectItem></SelectContent>
                  </Select>
                </div>
                <div><Label>Description</Label><Input value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
                <div><Label>Parent GL *</Label><Input value={form.parentGL} onChange={e => setForm({...form, parentGL: e.target.value})} placeholder="Property, Plant & Equipments (PPE)" /></div>
                <div><Label>Parent GL Code</Label><Input value={form.parentGLCode} onChange={e => setForm({...form, parentGLCode: e.target.value})} placeholder="10001" /></div>
                {!form.isParent && (
                  <div><Label>Subsidiary Ledger *</Label><Input value={form.subsidiaryLedger} onChange={e => setForm({...form, subsidiaryLedger: e.target.value})} placeholder="Mandatory for Sub Group" /></div>
                )}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2"><Label>Status</Label><Switch checked={form.status === 'Active'} onCheckedChange={c => setForm({...form, status: c ? 'Active' : 'Inactive'})} /><span className="text-sm">{form.status}</span></div>
                  <div className="flex items-center gap-2"><Label>Is Parent</Label><Switch checked={form.isParent} onCheckedChange={c => setForm({...form, isParent: c})} /></div>
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <Button onClick={handleSave}>Save</Button>
                <Button variant="outline" onClick={() => setView('list')}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}
