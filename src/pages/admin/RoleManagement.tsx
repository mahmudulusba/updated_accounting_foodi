import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';

interface Role { id: number; name: string; }

const initial: Role[] = [
  'Digital Marketing', 'Revenue 2', 'Accounts Supervisor', 'Revenue', 'Acc_Audit',
  'Acc_Master_Admin', 'TN_Dev', 'Acc_BA_QA', 'Acc_User', 'Acc_Admin',
].map((name, i) => ({ id: i + 1, name }));

export default function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>(initial);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [searchActive, setSearchActive] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const reset = () => { setName(''); setEditingId(null); };

  const save = () => {
    if (!name.trim()) {
      toast({ title: 'Role Name is required', variant: 'destructive' });
      return;
    }
    if (editingId !== null) {
      setRoles(roles.map(r => r.id === editingId ? { ...r, name: name.trim() } : r));
      toast({ title: 'Role updated' });
    } else {
      setRoles([...roles, { id: Math.max(0, ...roles.map(r => r.id)) + 1, name: name.trim() }]);
      toast({ title: 'Role created' });
    }
    reset();
  };

  const onEdit = (r: Role) => { setEditingId(r.id); setName(r.name); };
  const onDelete = () => {
    if (deleteId === null) return;
    setRoles(roles.filter(r => r.id !== deleteId));
    toast({ title: 'Role deleted' });
    setDeleteId(null);
    if (editingId === deleteId) reset();
  };

  const filtered = roles.filter(r =>
    !searchActive || r.name.toLowerCase().includes(searchActive.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <Card className="px-4 py-3 rounded-md">
          <div className="text-sm">
            <span className="text-primary font-semibold">Access Control</span>
            <span className="mx-2 text-muted-foreground">/</span>
            <span>Roles</span>
          </div>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">{editingId ? 'Edit Role' : 'Add Role'}</h2>
            <div className="border-b mb-4" />
            <div className="grid grid-cols-[160px_1fr] items-center gap-3 max-w-2xl">
              <Label>Role Name <span className="text-destructive">*</span></Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Name" />
            </div>
            <div className="flex gap-2 mt-4 ml-[172px]">
              <Button onClick={save}>Save</Button>
              <Button variant="destructive" onClick={reset}>Reset</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Roles List</h2>
              <div className="flex gap-2">
                <Input
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && setSearchActive(search)}
                  className="w-64"
                />
                <Button onClick={() => setSearchActive(search)}>Search</Button>
              </div>
            </div>
            <div className="border-b mb-4" />
            <div className="overflow-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-primary text-primary-foreground">
                    <th className="px-3 py-2 text-left border w-20">Id</th>
                    <th className="px-3 py-2 text-left border">Role Name</th>
                    <th className="px-3 py-2 text-center border w-32">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr key={r.id} className="border-b hover:bg-muted/30">
                      <td className="px-3 py-2 border font-semibold">{i + 1}</td>
                      <td className="px-3 py-2 border">{r.name}</td>
                      <td className="px-3 py-2 border">
                        <div className="flex justify-center gap-2">
                          <Button size="icon" variant="default" className="h-8 w-8" onClick={() => onEdit(r)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => setDeleteId(r.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={3} className="px-3 py-6 text-center text-muted-foreground border">No roles found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this role?</AlertDialogTitle>
            <AlertDialogDescription>You won't be able to revert this!</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete}>Yes, delete it!</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
