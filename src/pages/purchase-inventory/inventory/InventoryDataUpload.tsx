import ModuleDataUpload from '@/pages/shared/ModuleDataUpload';

export default function InventoryDataUpload() {
  return (
    <ModuleDataUpload
      moduleName="Inventory"
      excelTypes={['Item Master', 'Warehouse', 'Warehouse Location', 'Opening Stock', 'Stock Adjustment']}
    />
  );
}
