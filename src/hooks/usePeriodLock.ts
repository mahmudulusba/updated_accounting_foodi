import { useMemo } from 'react';
import { parseISO, isAfter, isBefore, isWithinInterval, format } from 'date-fns';

interface Period {
  id: string;
  financialYearId: string;
  financialYearName: string;
  name: string;
  startDate: string;
  endDate: string;
  lockDate: string;
  isActive: boolean;
}

// Mock periods - in production this would come from context/API
// Lock date is 5th of the month after the period end date
const mockPeriods: Period[] = [
  { id: '1', financialYearId: '1', financialYearName: '01 Jul, 2025 to 30 Jun, 2026', name: '1', startDate: '2025-07-01', endDate: '2025-07-31', lockDate: '2025-08-05', isActive: true },
  { id: '2', financialYearId: '1', financialYearName: '01 Jul, 2025 to 30 Jun, 2026', name: '2', startDate: '2025-08-01', endDate: '2025-08-31', lockDate: '2025-09-05', isActive: true },
  { id: '3', financialYearId: '1', financialYearName: '01 Jul, 2025 to 30 Jun, 2026', name: '3', startDate: '2025-09-01', endDate: '2025-09-30', lockDate: '2025-10-05', isActive: true },
  { id: '4', financialYearId: '1', financialYearName: '01 Jul, 2025 to 30 Jun, 2026', name: '4', startDate: '2025-10-01', endDate: '2025-10-31', lockDate: '2025-11-05', isActive: true },
  { id: '5', financialYearId: '1', financialYearName: '01 Jul, 2025 to 30 Jun, 2026', name: '5', startDate: '2025-11-01', endDate: '2025-11-30', lockDate: '2025-12-05', isActive: true },
  { id: '6', financialYearId: '1', financialYearName: '01 Jul, 2025 to 30 Jun, 2026', name: '6', startDate: '2025-12-01', endDate: '2025-12-31', lockDate: '2026-01-05', isActive: true },
  { id: '7', financialYearId: '1', financialYearName: '01 Jul, 2025 to 30 Jun, 2026', name: '7', startDate: '2026-01-01', endDate: '2026-01-31', lockDate: '2026-02-05', isActive: true },
  { id: '8', financialYearId: '1', financialYearName: '01 Jul, 2025 to 30 Jun, 2026', name: '8', startDate: '2026-02-01', endDate: '2026-02-28', lockDate: '2026-03-05', isActive: true },
  { id: '9', financialYearId: '1', financialYearName: '01 Jul, 2025 to 30 Jun, 2026', name: '9', startDate: '2026-03-01', endDate: '2026-03-31', lockDate: '2026-04-05', isActive: true },
  { id: '10', financialYearId: '1', financialYearName: '01 Jul, 2025 to 30 Jun, 2026', name: '10', startDate: '2026-04-01', endDate: '2026-04-30', lockDate: '2026-05-05', isActive: true },
  { id: '11', financialYearId: '1', financialYearName: '01 Jul, 2025 to 30 Jun, 2026', name: '11', startDate: '2026-05-01', endDate: '2026-05-31', lockDate: '2026-06-05', isActive: true },
  { id: '12', financialYearId: '1', financialYearName: '01 Jul, 2025 to 30 Jun, 2026', name: '12', startDate: '2026-06-01', endDate: '2026-06-30', lockDate: '2026-07-05', isActive: true },
];

/**
 * Hook to check if a given date falls within a locked period
 * A period is locked when current date >= lockDate
 */
export function usePeriodLock() {
  const today = new Date();

  /**
   * Find which period a given voucher date belongs to
   */
  const findPeriodForDate = (voucherDate: Date | string): Period | null => {
    const date = typeof voucherDate === 'string' ? parseISO(voucherDate) : voucherDate;
    
    return mockPeriods.find(period => {
      const start = parseISO(period.startDate);
      const end = parseISO(period.endDate);
      return isWithinInterval(date, { start, end });
    }) || null;
  };

  /**
   * Check if a period is locked based on its lock date
   */
  const isPeriodLocked = (period: Period): boolean => {
    const lockDate = parseISO(period.lockDate);
    return isAfter(today, lockDate) || format(today, 'yyyy-MM-dd') === period.lockDate;
  };

  /**
   * Check if a voucher entry is allowed for a given date
   * Returns { allowed: boolean, reason?: string, period?: Period }
   */
  const canCreateVoucherForDate = (voucherDate: Date | string): { 
    allowed: boolean; 
    reason?: string; 
    period?: Period;
  } => {
    const period = findPeriodForDate(voucherDate);
    
    if (!period) {
      return {
        allowed: false,
        reason: 'No active period found for this date. Please ensure a period is configured.',
      };
    }

    if (!period.isActive) {
      return {
        allowed: false,
        reason: `Period ${period.name} is inactive.`,
        period,
      };
    }

    if (isPeriodLocked(period)) {
      return {
        allowed: false,
        reason: `Period ${period.name} (${format(parseISO(period.startDate), 'dd-MMM-yyyy')} - ${format(parseISO(period.endDate), 'dd-MMM-yyyy')}) is locked. Lock date was ${format(parseISO(period.lockDate), 'dd-MMM-yyyy')}.`,
        period,
      };
    }

    return {
      allowed: true,
      period,
    };
  };

  /**
   * Get all periods with their lock status
   */
  const getPeriodsWithLockStatus = useMemo(() => {
    return mockPeriods.map(period => ({
      ...period,
      isLocked: isPeriodLocked(period),
    }));
  }, [today]);

  return {
    findPeriodForDate,
    isPeriodLocked,
    canCreateVoucherForDate,
    getPeriodsWithLockStatus,
    periods: mockPeriods,
  };
}
