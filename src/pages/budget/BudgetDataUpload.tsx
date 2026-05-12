import ModuleDataUpload from '@/pages/shared/ModuleDataUpload';

export default function BudgetDataUpload() {
  return (
    <ModuleDataUpload
      moduleName="Budget"
      excelTypes={['Budget Master', 'Cost Head Wise Amount', 'Budget Allocation', 'Budget Revision']}
    />
  );
}
