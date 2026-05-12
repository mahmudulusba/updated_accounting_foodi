import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export type AccountingMode = 'management' | 'tax';

interface AccountingModeContextType {
  accountingMode: AccountingMode;
  isManagementMode: boolean;
  isTaxMode: boolean;
  getModePath: (path: string) => string;
  canAccessManagement: boolean;
}

const AccountingModeContext = createContext<AccountingModeContextType | undefined>(undefined);

export function AccountingModeProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  
  const accountingMode: AccountingMode = useMemo(() => {
    if (location.pathname.startsWith('/tax')) return 'tax';
    return 'management';
  }, [location.pathname]);

  const getModePath = (path: string) => {
    if (accountingMode === 'tax') return `/tax${path}`;
    return `/management${path}`;
  };

  // Management users can access both, Tax users only tax
  const canAccessManagement = accountingMode === 'management';

  const value: AccountingModeContextType = {
    accountingMode,
    isManagementMode: accountingMode === 'management',
    isTaxMode: accountingMode === 'tax',
    getModePath,
    canAccessManagement,
  };

  return (
    <AccountingModeContext.Provider value={value}>
      {children}
    </AccountingModeContext.Provider>
  );
}

export function useAccountingMode() {
  const context = useContext(AccountingModeContext);
  if (context === undefined) {
    throw new Error('useAccountingMode must be used within an AccountingModeProvider');
  }
  return context;
}
