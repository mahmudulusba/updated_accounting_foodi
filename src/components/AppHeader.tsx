import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { useAccountingMode } from '@/contexts/AccountingModeContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, User, ChevronDown, LogOut, Settings, LayoutGrid, ArrowRightLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export function AppHeader() {
  const { currentUser, setIsLoggedIn, setSelectedBranch, setCurrentUser, activePortal, setActivePortal, activeSecondaryMenu, setActiveSecondaryMenu } = useApp();
  const { accountingMode, isManagementMode } = useAccountingMode();
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSelectedBranch(null);
    setCurrentUser(null);
    navigate('/');
  };

  const handleSwitchAccountingMode = () => {
    if (isManagementMode) {
      navigate('/tax/dashboard');
    } else {
      navigate('/management/dashboard');
    }
  };

  // Secondary menu labels per portal
  const getSecondaryMenuOptions = () => {
    if (activePortal === 'accounting') {
      return [
        { key: 'configuration' as const, label: 'Configuration' },
        { key: 'operations' as const, label: 'Operations' },
      ];
    }
    if (activePortal === 'fixed-asset') {
      return [
        { key: 'configuration' as const, label: 'Configuration' },
        { key: 'operations' as const, label: 'Operation' },
      ];
    }
    if (activePortal === 'purchase-inventory') {
      return [
        { key: 'purchase' as const, label: 'Purchase' },
        { key: 'inventory' as const, label: 'Inventory' },
      ];
    }
    if (activePortal === 'party-management') {
      return [
        { key: 'party-config' as const, label: 'Party Config' },
        { key: 'party-billing' as const, label: 'Party Billing' },
      ];
    }
    if (activePortal === 'foodi-integration') {
      return [];
    }
    if (activePortal === 'reconciliation') {
      return [];
    }
    if (activePortal === 'lease') {
      return [];
    }
    if (activePortal === 'budget') {
      return [];
    }
    if (activePortal === 'revenue-accounting') {
      return [];
    }
    if (activePortal === 'cost-accounting') {
      return [];
    }
    return [
      { key: 'configuration' as const, label: 'Security' },
      { key: 'operations' as const, label: 'Audit Logs' },
    ];
  };

  const secondaryOptions = getSecondaryMenuOptions();
  const currentSecondaryLabel = secondaryOptions.find(o => o.key === activeSecondaryMenu)?.label || secondaryOptions[0]?.label;

  return (
    <>
      <header className="h-14 bg-card border-b border-border flex items-center justify-between px-6 fixed top-0 left-56 right-0 z-10">
        <div className="flex items-center gap-4">
          <LayoutGrid className="h-5 w-5 text-muted-foreground" />
          <h1 className="font-semibold text-lg">
            FoodiBD
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 min-w-[140px] justify-between">
                {activePortal === 'accounting' ? 'Accounting' : activePortal === 'fixed-asset' ? 'Fixed Asset' : activePortal === 'lease' ? 'Lease' : activePortal === 'budget' ? 'Budget' : activePortal === 'revenue-accounting' ? 'Revenue Accounting' : activePortal === 'cost-accounting' ? 'Cost Accounting' : activePortal === 'purchase-inventory' ? 'Purchase & Inventory' : activePortal === 'party-management' ? 'Party Management' : activePortal === 'foodi-integration' ? 'Foodi Integration' : activePortal === 'reconciliation' ? 'Reconciliation' : 'Admin Portal'}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
               <DropdownMenuItem onClick={() => {
                 setActivePortal('accounting');
                 setActiveSecondaryMenu('configuration');
                 navigate('/management/homepage');
               }}>
                Accounting
              </DropdownMenuItem>
               <DropdownMenuItem onClick={() => {
                 setActivePortal('fixed-asset');
                 setActiveSecondaryMenu('configuration');
                 navigate('/management/fixed-asset/asset-group');
               }}>
                Fixed Asset
              </DropdownMenuItem>
               <DropdownMenuItem onClick={() => {
                 setActivePortal('lease');
                 setActiveSecondaryMenu('configuration');
                 navigate('/management/lease/setup');
               }}>
                Lease
              </DropdownMenuItem>
               <DropdownMenuItem onClick={() => {
                 setActivePortal('budget');
                 setActiveSecondaryMenu('configuration');
                 navigate('/management/budget/setup');
               }}>
                Budget
              </DropdownMenuItem>
               <DropdownMenuItem onClick={() => {
                 setActivePortal('revenue-accounting');
                 setActiveSecondaryMenu('configuration');
                 navigate('/management/revenue-accounting/gl-mapping');
               }}>
                Revenue Accounting
              </DropdownMenuItem>
               <DropdownMenuItem onClick={() => {
                 setActivePortal('cost-accounting');
                 setActiveSecondaryMenu('configuration');
                 navigate('/management/cost-accounting/gl-mapping');
               }}>
                Cost Accounting
              </DropdownMenuItem>
               <DropdownMenuItem onClick={() => {
                 setActivePortal('purchase-inventory');
                 setActiveSecondaryMenu('purchase');
                 navigate('/management/purchase-inventory/purchase/vendor-setup');
               }}>
                Purchase & Inventory
              </DropdownMenuItem>
               <DropdownMenuItem onClick={() => {
                 setActivePortal('party-management');
                 setActiveSecondaryMenu('party-config');
                 navigate('/management/party-list');
               }}>
                Party Management
               </DropdownMenuItem>
               <DropdownMenuItem onClick={() => {
                 setActivePortal('foodi-integration');
                 setActiveSecondaryMenu('configuration');
                 navigate('/management/foodi-integration/home');
               }}>
                Foodi Integration
               </DropdownMenuItem>
               <DropdownMenuItem onClick={() => {
                 setActivePortal('reconciliation');
                 setActiveSecondaryMenu('configuration');
                 navigate('/management/reconciliation/bank');
               }}>
                Reconciliation
               </DropdownMenuItem>
               <DropdownMenuItem onClick={() => {
                 setActivePortal('admin');
                 setActiveSecondaryMenu('configuration');
                 navigate('/management/admin/module');
               }}>
                Admin Portal
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Secondary dropdown - Configuration / Operations / Report (hidden for ground handling) */}
          {secondaryOptions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 min-w-[140px] justify-between">
                  {currentSecondaryLabel}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {secondaryOptions.map(opt => (
                  <DropdownMenuItem
                    key={opt.key}
                    onClick={() => setActiveSecondaryMenu(opt.key)}
                    className={activeSecondaryMenu === opt.key ? 'bg-accent' : ''}
                  >
                    {opt.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-2">
                <p className="font-medium text-sm">{currentUser?.name || 'User'}</p>
                <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSwitchAccountingMode}>
                <ArrowRightLeft className="mr-2 h-4 w-4" />
                Switch to {isManagementMode ? 'Tax' : 'Management'} Accounting
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  );
}
