import React, { useMemo, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

const ROLES = [
  'Acc_Admin', 'Acc_User', 'Acc_BA_QA', 'Acc_Audit', 'Acc_Master_Admin',
  'Super Admin', 'Master', 'CRM and Reservation', 'Revenue', 'Digital Marketing', 'TN_Dev',
];

type MenuDef = { name: string; actions: string[] };
type SubmoduleMenus = Record<string, MenuDef[]>;
type ModuleMenus = Record<string, SubmoduleMenus>;

const MENUS: ModuleMenus = {
  Accounting: {
    'Central Configuration': [
      { name: 'Currency', actions: ['Add', 'Update', 'Delete', 'View', 'Download'] },
      { name: 'Branch', actions: ['View', 'Download'] },
      { name: 'Branch Wise GL Code Mapping', actions: ['Add'] },
      { name: 'Currency Rate', actions: ['Add', 'Update', 'Delete', 'View', 'Download'] },
      { name: 'Fiscal Year', actions: ['Get All Retained GL', 'Download'] },
      { name: 'Holiday', actions: ['Add - update', 'Download', 'View'] },
      { name: 'Weekend', actions: ['Add', 'Update', 'Delete', 'View', 'Download'] },
      { name: 'Policy', actions: ['Add', 'Update', 'View', 'Download'] },
      { name: 'Day Open Close', actions: ['Add', 'View'] },
      { name: 'Fiscal Year Close', actions: ['Calculate Year Closing', 'Get Pre Posting Transaction', 'View'] },
    ],
    'Reports': [
      { name: 'Cash Flow Report', actions: ['View'] },
      { name: 'Financial Report', actions: ['Balance Sheet View', 'Income Statement View'] },
      { name: 'General Ledger Report', actions: ['View'] },
      { name: 'Trial Balance Report', actions: ['View'] },
    ],
    'Voucher': [
      { name: 'Voucher Entry', actions: ['Add', 'Update', 'Delete', 'View', 'Download'] },
      { name: 'Voucher List', actions: ['View', 'Download', 'Approve', 'Reject'] },
      { name: 'Batch Voucher', actions: ['Add', 'Update', 'Delete', 'View'] },
    ],
  },
  Dashboard: {
    'Dashboard Segments': [
      { name: 'Unposted Voucher', actions: ['View'] },
      { name: 'Cash Position', actions: ['View'] },
      { name: 'Bank Position', actions: ['View'] },
      { name: 'AR Aging', actions: ['View'] },
      { name: 'AP Aging', actions: ['View'] },
      { name: 'Profit & Loss Summary', actions: ['View'] },
      { name: 'Revenue vs Expense Trend', actions: ['View'] },
      { name: 'Top Parties', actions: ['View'] },
      { name: 'Recent Transactions', actions: ['View'] },
    ],
  },
  'Ground Handling': {
    'Configuration': [
      { name: 'Stations', actions: ['Add', 'Update', 'Delete', 'View'] },
      { name: 'Suppliers', actions: ['Add', 'Update', 'Delete', 'View'] },
      { name: 'Services', actions: ['Add', 'Update', 'Delete', 'View'] },
      { name: 'Criteria', actions: ['Add', 'Update', 'Delete', 'View'] },
    ],
  },
};

type PermState = Record<string, Record<string, boolean>>;

export default function MenuActionPermission() {
  const [role, setRole] = useState('Acc_Admin');
  const [module, setModule] = useState('Accounting');
  const [submodule, setSubmodule] = useState('Central Configuration');
  const [perms, setPerms] = useState<PermState>(() => seed());

  function seed(): PermState {
    const s: PermState = {};
    Object.values(MENUS).forEach(subs => {
      Object.values(subs).forEach(menus => {
        menus.forEach(m => {
          s[m.name] = s[m.name] ?? {};
          m.actions.forEach(a => { s[m.name][a] = true; });
        });
      });
    });
    return s;
  }

  const modules = Object.keys(MENUS);
  const submodules = useMemo(() => Object.keys(MENUS[module] ?? {}), [module]);
  const menus = MENUS[module]?.[submodule] ?? [];

  const toggle = (menu: string, action: string, value: boolean) => {
    setPerms(p => ({ ...p, [menu]: { ...(p[menu] ?? {}), [action]: value } }));
  };

  const checkAll = (menu: MenuDef, value: boolean) => {
    setPerms(p => ({
      ...p,
      [menu.name]: menu.actions.reduce((acc, a) => ({ ...acc, [a]: value }), {}),
    }));
  };

  const isAllChecked = (menu: MenuDef) =>
    menu.actions.every(a => perms[menu.name]?.[a]);

  const onSave = () => toast({ title: `Permissions saved for ${role}` });

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <Card className="px-4 py-3 rounded-md">
          <div className="text-sm">
            <span className="text-primary font-semibold">Access Control</span>
            <span className="mx-2 text-muted-foreground">/</span>
            <span>Menu wise action permission</span>
          </div>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">Menu Search</h2>
            <div className="border-b mb-4" />
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-1.5">
                <Label>Role <span className="text-destructive">*</span></Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover z-[9999]">
                    {ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Module Name <span className="text-destructive">*</span></Label>
                <Select value={module} onValueChange={(v) => { setModule(v); const s = Object.keys(MENUS[v] ?? {}); setSubmodule(s[0] ?? ''); }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover z-[9999]">
                    {modules.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Submodule Name <span className="text-destructive">*</span></Label>
                <Select value={submodule} onValueChange={setSubmodule}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover z-[9999]">
                    {submodules.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Menu Action Permission</h2>
              <Button onClick={onSave}>Save Permissions</Button>
            </div>
            <div className="border-b mb-4" />
            {menus.length === 0 ? (
              <div className="text-sm text-muted-foreground">No menus available for this selection.</div>
            ) : (
              <div className="space-y-5">
                {menus.map(menu => (
                  <div key={menu.name} className="border-b pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-primary">{menu.name}</h3>
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <Checkbox
                          checked={isAllChecked(menu)}
                          onCheckedChange={(v) => checkAll(menu, !!v)}
                        />
                        <span>Check All</span>
                      </label>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-2 gap-x-4">
                      {menu.actions.map(action => (
                        <label key={action} className="flex items-center gap-2 text-sm cursor-pointer">
                          <Checkbox
                            checked={!!perms[menu.name]?.[action]}
                            onCheckedChange={(v) => toggle(menu.name, action, !!v)}
                          />
                          <span>{action}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
