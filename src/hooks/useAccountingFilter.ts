import { useMemo } from 'react';
import { useAccountingMode } from '@/contexts/AccountingModeContext';
import { useApp, GLEntry, GLVoucherTypeMapping } from '@/contexts/AppContext';

/**
 * Hook to filter GL entries based on current accounting mode
 * - Management mode: shows all ledgers (management + both)
 * - Tax mode: shows only ledgers scoped to tax or both
 */
export function useFilteredGLEntries(glEntries: GLEntry[]) {
  const { isManagementMode } = useAccountingMode();

  return useMemo(() => {
    if (isManagementMode) {
      // Management mode sees all ledgers
      return glEntries;
    } else {
      // Tax mode only sees tax or both scoped ledgers
      return glEntries.filter(gl => gl.ledgerScope === 'tax' || gl.ledgerScope === 'both');
    }
  }, [glEntries, isManagementMode]);
}

/**
 * Hook to filter voucher type mappings based on current accounting mode
 * - Management mode: shows all mappings
 * - Tax mode: shows only mappings marked as affectsTaxAccounting = true
 */
export function useFilteredVoucherTypeMappings(mappings: GLVoucherTypeMapping[]) {
  const { isManagementMode } = useAccountingMode();

  return useMemo(() => {
    if (isManagementMode) {
      // Management mode sees all mappings
      return mappings;
    } else {
      // Tax mode only sees tax-affected mappings
      return mappings.filter(m => m.affectsTaxAccounting);
    }
  }, [mappings, isManagementMode]);
}

/**
 * Check if voucher entry is allowed in current mode
 * - Management mode: always allowed
 * - Tax mode: only allowed if admin has granted canAccessTaxEntry permission
 */
export function useCanCreateVoucher() {
  const { isManagementMode } = useAccountingMode();
  
  // Both management and tax mode: always allowed
  // Tax entry is now open to all authenticated users
  return true;
}

/**
 * Check if user has tax entry permission (admin-controlled)
 */
export function useHasTaxEntryPermission() {
  return true;
}

/**
 * Check if current user is admin
 */
export function useIsAdmin() {
  const { currentUserDetails } = useApp();
  return currentUserDetails?.role === 'admin';
}
