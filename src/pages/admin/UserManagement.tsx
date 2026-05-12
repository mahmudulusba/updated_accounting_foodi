import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pencil, Key, Lock } from 'lucide-react';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';

interface UserRow {
  id: number; name: string; email: string; role: string; status: 'Active' | 'Inactive';
}

const ROLES = [
  'Super Admin', 'Acc_BA_QA', 'Master', 'CRM and Reservation', 'Revenue',
  'Acc_Admin', 'Acc_User', 'Acc_Audit', 'Digital Marketing', 'TN_Dev',
];

const initial: UserRow[] = [
  { id: 1, name: 'Junaid Pathan', email: 'junaid.pathan@technonext.com', role: 'Super Admin', status: 'Active' },
  { id: 2, name: 'Minhazul Sayem', email: 'minhazul.sayem@technonext.com', role: 'Acc_BA_QA', status: 'Active' },
  { id: 3, name: 'Mahdee Kabir', email: 'mahdee.kabir@taketrip.com', role: 'Master', status: 'Active' },
  { id: 4, name: 'Sajal Chowdhury', email: 'sajal.chowdhury@triplover.com', role: 'CRM and Reservation', status: 'Active' },
  { id: 5, name: 'Raihan Gmail Dev', email: 'raihan.emailbox@gmail.com', role: 'Acc_BA_QA', status: 'Active' },
  { id: 6, name: 'Ferdousur Rabbi', email: 'ferdousur.rabbi@triplover.com', role: 'Revenue', status: 'Active' },
  { id: 7, name: 'Rawnak Mahmud', email: 'rawnak.mahmud@triplover.com', role: 'Revenue', status: 'Active' },
  { id: 8, name: 'Tazin Inteeser Khan', email: 'tazin.inteeser@triplover.com', role: 'Revenue', status: 'Active' },
  { id: 9, name: 'Mustafa Shabab', email: 'mustafa.shabab@triplover.com', role: 'Revenue', status: 'Active' },
];

export default function UserManagement() {
  const [users, setUsers] = useState<UserRow[]>(initial);
  const [search, setSearch] = useState('');
  const [searchActive, setSearchActive] = useState('');
  const [editing, setEditing] = useState<UserRow | null>(null);
  const [editRole, setEditRole] = useState<string>('');
  const [resetPwdUser, setResetPwdUser] = useState<UserRow | null>(null);
  const [resetAuthUser, setResetAuthUser] = useState<UserRow | null>(null);
  const [pwdSuccess, setPwdSuccess] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  const filtered = users.filter(u => {
    if (!searchActive) return true;
    const q = searchActive.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  const openEdit = (u: UserRow) => { setEditing(u); setEditRole(u.role); };

  const saveRole = () => {
    if (!editing) return;
    setUsers(users.map(u => u.id === editing.id ? { ...u, role: editRole } : u));
    toast({ title: 'User role updated' });
    setEditing(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <Card className="px-4 py-3 rounded-md">
          <div className="text-sm">
            <span className="text-primary font-semibold">Access Control</span>
            <span className="mx-2 text-muted-foreground">/</span>
            <span>Users</span>
          </div>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Users List</h2>
              <div className="flex gap-2">
                <Input
                  placeholder="Search with User Name or Email"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && setSearchActive(search)}
                  className="w-80"
                />
                <Button onClick={() => setSearchActive(search)}>Search</Button>
              </div>
            </div>
            <div className="border-b mb-4" />
            <div className="overflow-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-primary text-primary-foreground">
                    <th className="px-3 py-2 text-left border w-16">SL</th>
                    <th className="px-3 py-2 text-left border">User Name</th>
                    <th className="px-3 py-2 text-left border">Email</th>
                    <th className="px-3 py-2 text-left border">User Role</th>
                    <th className="px-3 py-2 text-left border w-28">Status</th>
                    <th className="px-3 py-2 text-center border w-40">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u, i) => (
                    <tr key={u.id} className="border-b hover:bg-muted/30">
                      <td className="px-3 py-2 border">{i + 1}</td>
                      <td className="px-3 py-2 border">{u.name}</td>
                      <td className="px-3 py-2 border">{u.email}</td>
                      <td className="px-3 py-2 border">{u.role}</td>
                      <td className="px-3 py-2 border">
                        <span className="inline-flex items-center gap-1.5">
                          <span className={`h-2 w-2 rounded-full ${u.status === 'Active' ? 'bg-emerald-500' : 'bg-muted-foreground'}`} />
                          {u.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 border">
                        <div className="flex justify-center gap-2">
                          <Button size="icon" variant="default" className="h-8 w-8" title="Update Role" onClick={() => openEdit(u)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button size="icon" className="h-8 w-8 bg-amber-500 hover:bg-amber-600 text-white" title="Reset Password" onClick={() => setResetPwdUser(u)}>
                            <Key className="h-4 w-4" />
                          </Button>
                          <Button size="icon" className="h-8 w-8 bg-zinc-800 hover:bg-zinc-900 text-white" title="Reset Authenticator" onClick={() => setResetAuthUser(u)}>
                            <Lock className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={6} className="px-3 py-6 text-center text-muted-foreground border">No users found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Update Role Dialog */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update User Role</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div className="grid grid-cols-[120px_1fr] items-center gap-3">
                <Label>User Name</Label>
                <Input value={editing.name} disabled />
              </div>
              <div className="grid grid-cols-[120px_1fr] items-center gap-3">
                <Label>Email</Label>
                <Input value={editing.email} disabled />
              </div>
              <div className="grid grid-cols-[120px_1fr] items-center gap-3">
                <Label>User Role <span className="text-destructive">*</span></Label>
                <Select value={editRole} onValueChange={setEditRole}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover z-[9999]">
                    {ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={saveRole}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <AlertDialog open={!!resetPwdUser} onOpenChange={(o) => !o && setResetPwdUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Password for {resetPwdUser?.name}?</AlertDialogTitle>
            <AlertDialogDescription>You won't be able to revert this!</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => { setResetPwdUser(null); setPwdSuccess(true); }}>
              Yes, reset it!
            </AlertDialogAction>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Authenticator Dialog */}
      <AlertDialog open={!!resetAuthUser} onOpenChange={(o) => !o && setResetAuthUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Authenticator for {resetAuthUser?.name}?</AlertDialogTitle>
            <AlertDialogDescription>You won't be able to revert this!</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => { setResetAuthUser(null); setAuthSuccess(true); }}>
              Yes, reset it!
            </AlertDialogAction>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Password Reset Success Dialog */}
      <Dialog open={pwdSuccess} onOpenChange={setPwdSuccess}>
        <DialogContent className="max-w-md">
          <div className="flex flex-col items-center text-center py-4">
            <div className="h-20 w-20 rounded-full border-2 border-emerald-300 flex items-center justify-center mb-4">
              <svg className="h-10 w-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">Reset Password!</h3>
            <p className="text-muted-foreground mb-6">Password has been reset. A mail send to the respective user.</p>
            <Button onClick={() => setPwdSuccess(false)} className="bg-teal-500 hover:bg-teal-600 text-white px-8">OK</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Authenticator Reset Success Dialog */}
      <Dialog open={authSuccess} onOpenChange={setAuthSuccess}>
        <DialogContent className="max-w-md">
          <div className="flex flex-col items-center text-center py-4">
            <div className="h-20 w-20 rounded-full border-2 border-emerald-300 flex items-center justify-center mb-4">
              <svg className="h-10 w-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">Reset Authenticator!</h3>
            <p className="text-muted-foreground mb-6">Authenticator has been reset. A mail send to the respective user.</p>
            <Button onClick={() => setAuthSuccess(false)} className="bg-teal-500 hover:bg-teal-600 text-white px-8">OK</Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
