import ModuleDataUpload from '@/pages/shared/ModuleDataUpload';

export default function PartyDataUpload() {
  return (
    <ModuleDataUpload
      moduleName="Party Management"
      excelTypes={['Party Master', 'Party Type', 'Customer', 'Supplier', 'Party Recon GL Mapping', 'Opening Balance']}
    />
  );
}
