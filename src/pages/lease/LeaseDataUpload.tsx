import ModuleDataUpload from '@/pages/shared/ModuleDataUpload';

export default function LeaseDataUpload() {
  return (
    <ModuleDataUpload
      moduleName="Lease / Rent"
      excelTypes={['Lease / Rent Setup', 'Hub Master', 'Lease Schedule', 'Rent Adjustment']}
    />
  );
}
