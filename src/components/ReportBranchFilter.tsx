import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ReportBranchFilterProps {
  selectedBranchCodes: string[];
  onBranchChange: (branchCodes: string[]) => void;
  className?: string;
  label?: string;
  showAllOption?: boolean;
}

export default function ReportBranchFilter({
  selectedBranchCodes,
  onBranchChange,
  className = '',
  label = 'Branch',
  showAllOption = true,
}: ReportBranchFilterProps) {
  // Branch filter UI hidden per requirement; data filtering still flows
  // through the useBranchFilter hook below.
  void selectedBranchCodes; void onBranchChange; void className; void label; void showAllOption;
  return null;
}

// Helper hook to manage branch filter state with multi-select
export function useBranchFilter() {
  const { selectedBranch, branches } = useApp();
  const isConsolidated = selectedBranch?.isConsolidated === true;
  const [filterBranchCodes, setFilterBranchCodes] = React.useState<string[]>(
    isConsolidated ? ['all'] : [selectedBranch?.code || '']
  );

  // Update filter when selected branch changes
  React.useEffect(() => {
    if (!isConsolidated && selectedBranch) {
      setFilterBranchCodes([selectedBranch.code]);
    }
  }, [selectedBranch, isConsolidated]);

  // Check if single branch is selected (not 'all' and only one branch)
  const isSingleBranchSelected = filterBranchCodes.length === 1 && !filterBranchCodes.includes('all');

  // Check if multiple branches or all selected
  const isMultipleBranchesSelected = filterBranchCodes.includes('all') || filterBranchCodes.length > 1;

  // Get the effective base currency code based on selection
  // When a single branch is selected, use that branch's currency
  // Otherwise, use BDT as the common currency (since consolidated has no own currency)
  const getEffectiveBaseCurrencyCode = (): string => {
    if (!isConsolidated) {
      return selectedBranch?.baseCurrency || 'BDT';
    }
    
    // For consolidated view
    if (isSingleBranchSelected) {
      // Find the selected branch and return its currency
      const selectedBranchCode = filterBranchCodes[0];
      const branch = branches.find(b => b.code === selectedBranchCode);
      return branch?.baseCurrency || 'BDT';
    }
    
    // For multiple branches or 'all', there's no single base currency
    // Return a placeholder - currency selector should restrict options anyway
    return 'BDT';
  };

  const effectiveBaseCurrencyCode = getEffectiveBaseCurrencyCode();

  return {
    isConsolidated,
    filterBranchCodes,
    setFilterBranchCodes,
    isSingleBranchSelected,
    isMultipleBranchesSelected,
    effectiveBaseCurrencyCode,
    // Returns true if data should be shown based on its branch code
    shouldShowData: (dataBranchCode: string) => {
      if (!isConsolidated) {
        return dataBranchCode === selectedBranch?.code;
      }
      if (filterBranchCodes.includes('all')) {
        return true;
      }
      return filterBranchCodes.includes(dataBranchCode);
    },
  };
}
