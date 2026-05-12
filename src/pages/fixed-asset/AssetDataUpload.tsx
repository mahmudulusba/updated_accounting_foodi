import ModuleDataUpload from '@/pages/shared/ModuleDataUpload';

export default function AssetDataUpload() {
  return (
    <ModuleDataUpload
      moduleName="Fixed Asset"
      excelTypes={['Asset Group', 'Asset Master', 'Asset History', 'Bulk Asset Registration', 'Depreciation Rules', 'Asset Allocation']}
    />
  );
}
