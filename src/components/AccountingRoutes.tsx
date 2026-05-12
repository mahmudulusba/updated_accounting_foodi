import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { AccountingModeProvider, useAccountingMode } from '@/contexts/AccountingModeContext';
import Dashboard from '@/pages/Dashboard';
import Homepage from '@/pages/Homepage';
import GeneralLedger from '@/pages/GeneralLedger';
import GLVoucherTypeMapping from '@/pages/GLVoucherTypeMapping';
import ParentGL from '@/pages/ParentGL';
import ChartOfAccounts from '@/pages/ChartOfAccounts';
import VoucherList from '@/pages/VoucherList';
import TransactionReport from '@/pages/TransactionReport';
import GeneralLedgerReport from '@/pages/GeneralLedgerReport';
import GeneralLedgerSummaryReport from '@/pages/GeneralLedgerSummaryReport';
import TrialBalanceReport from '@/pages/TrialBalanceReport';
import FinancialReport from '@/pages/FinancialReport';
import CashFlowReport from '@/pages/CashFlowReport';
import IncomeStatement from '@/pages/IncomeStatement';
import BalanceSheet from '@/pages/BalanceSheet';
import RatioAnalysisReport from '@/pages/RatioAnalysisReport';
import RatioAnalysisConfig from '@/pages/RatioAnalysisConfig';
import TrialBalanceExtendedReport from '@/pages/TrialBalanceExtendedReport';
import PaymentReceiptReport from '@/pages/PaymentReceiptReport';
import BatchVoucherEntry from '@/pages/BatchVoucherEntry';
import BatchVoucherList from '@/pages/BatchVoucherList';
import PartyTypeSetup from '@/pages/PartyTypeSetup';
import PartyMaster from '@/pages/PartyMaster';
import SubGLSetup from '@/pages/SubGLSetup';
import PartyAdd from '@/pages/PartyAdd';
import PartyListPage from '@/pages/PartyListPage';
import PartyReconGLConfig from '@/pages/PartyReconGLConfig';
import CurrencyRateReport from '@/pages/CurrencyRateReport';
import GLAgingReport from '@/pages/GLAgingReport';
import PolicySetup from '@/pages/PolicySetup';
import FundTransfer from '@/pages/FundTransfer';
import LockDateSetup from '@/pages/LockDateSetup';
import ApprovalLayerConfig from '@/pages/ApprovalLayerConfig';
import DataUpload from '@/pages/DataUpload';
import MenuTreeView from '@/pages/admin/MenuTreeView';
import RoleManagement from '@/pages/admin/RoleManagement';
import UserManagement from '@/pages/admin/UserManagement';
import MenuActionPermission from '@/pages/admin/MenuActionPermission';
import APAgingReport from '@/pages/APAgingReport';
import ARAgingReport from '@/pages/ARAgingReport';
import InventoryAgingReport from '@/pages/InventoryAgingReport';
import InventoryTransactionReport from '@/pages/InventoryTransactionReport';
import CurrencySetup from '@/pages/CurrencySetup';
import FiscalYearSetup from '@/pages/FiscalYearSetup';
import HolidaySetup from '@/pages/HolidaySetup';
import WeekendSetup from '@/pages/WeekendSetup';
import SBUSetup from '@/pages/SBUSetup';
import DepartmentSetup from '@/pages/DepartmentSetup';
import CitySetup from '@/pages/CitySetup';
import ZoneSetup from '@/pages/ZoneSetup';
import HubSetup from '@/pages/HubSetup';
import VoucherTypeSetup from '@/pages/VoucherTypeSetup';
import MonthClosing from '@/pages/MonthClosing';
import FiscalYearClosing from '@/pages/FiscalYearClosing';

// Revenue Accounting Pages
import RAGLMapping from '@/pages/revenue-accounting/RAGLMapping';
import RAExcelUpload from '@/pages/revenue-accounting/RAExcelUpload';
import CAGLMapping from '@/pages/cost-accounting/CAGLMapping';
import CAExcelUpload from '@/pages/cost-accounting/CAExcelUpload';

// Fixed Asset Pages
import AssetGroupSetup from '@/pages/fixed-asset/AssetGroupSetup';
import ValueAdjustmentRules from '@/pages/fixed-asset/ValueAdjustmentRules';
import EmployeeDirectory from '@/pages/fixed-asset/EmployeeDirectory';
import AssetDataUpload from '@/pages/fixed-asset/AssetDataUpload';
import AssetReconGLMapping from '@/pages/fixed-asset/AssetReconGLMapping';
import AssetRegistration from '@/pages/fixed-asset/AssetRegistration';
import AssetAllocation from '@/pages/fixed-asset/AssetAllocation';
import AssetDepreciation from '@/pages/fixed-asset/AssetDepreciation';
import AssetDisposal from '@/pages/fixed-asset/AssetDisposal';
import AssetRevaluation from '@/pages/fixed-asset/AssetRevaluation';
import AssetRenovation from '@/pages/fixed-asset/AssetRenovation';
import AssetMaintenance from '@/pages/fixed-asset/AssetMaintenance';
import AssetTransfer from '@/pages/fixed-asset/AssetTransfer';
import AssetDetailsReport from '@/pages/fixed-asset/AssetDetailsReport';
import AssetAllocationReport from '@/pages/fixed-asset/AssetAllocationReport';
import AssetScheduleReport from '@/pages/fixed-asset/AssetScheduleReport';
import AssetDisposalReport from '@/pages/fixed-asset/AssetDisposalReport';
import AssetMaintenanceReport from '@/pages/fixed-asset/AssetMaintenanceReport';

// Budget Pages
import BudgetSetup from '@/pages/budget/BudgetSetup';
import BudgetCostHeadAmountSetup from '@/pages/budget/BudgetCostHeadAmountSetup';
import BudgetReport from '@/pages/budget/BudgetReport';
import BudgetAllocationReport from '@/pages/budget/BudgetAllocationReport';
import BudgetVarianceReport from '@/pages/budget/BudgetVarianceReport';

// Lease Pages
import LeaseSetup from '@/pages/lease/LeaseSetup';
import LeaseRentScheduler from '@/pages/lease/LeaseRentScheduler';
import HubLeaseCalculationReport from '@/pages/lease/HubLeaseCalculationReport';
import LeaseRentSummaryReport from '@/pages/lease/LeaseRentSummaryReport';

// Purchase & Inventory - Purchase
import VendorSetup from '@/pages/purchase-inventory/purchase/VendorSetup';
import PurchaseRequisition from '@/pages/purchase-inventory/purchase/PurchaseRequisition';
import RequestForQuotation from '@/pages/purchase-inventory/purchase/RequestForQuotation';
import Quotation from '@/pages/purchase-inventory/purchase/Quotation';
import ComparativeStatement from '@/pages/purchase-inventory/purchase/ComparativeStatement';
import NoteSheet from '@/pages/purchase-inventory/purchase/NoteSheet';
import LocalPurchaseOrder from '@/pages/purchase-inventory/purchase/LocalPurchaseOrder';
import ForeignPurchaseOrder from '@/pages/purchase-inventory/purchase/ForeignPurchaseOrder';
import ProformaInvoice from '@/pages/purchase-inventory/purchase/ProformaInvoice';
import LetterOfCredit from '@/pages/purchase-inventory/purchase/LetterOfCredit';
import LCAmendment from '@/pages/purchase-inventory/purchase/LCAmendment';
import PassedForPayment from '@/pages/purchase-inventory/purchase/PassedForPayment';

// Purchase & Inventory - Inventory
import Warehouse from '@/pages/purchase-inventory/inventory/Warehouse';
import WarehouseLocation from '@/pages/purchase-inventory/inventory/WarehouseLocation';
import RouteSetup from '@/pages/purchase-inventory/inventory/Route';
import MaterialRequisition from '@/pages/purchase-inventory/inventory/MaterialRequisition';
import SalesLoanRequest from '@/pages/purchase-inventory/inventory/SalesLoanRequest';
import SalesLoanIssue from '@/pages/purchase-inventory/inventory/SalesLoanIssue';
import SalesOrder from '@/pages/purchase-inventory/inventory/SalesOrder';
import DeliveryNote from '@/pages/purchase-inventory/inventory/DeliveryNote';

import QAApproval from '@/pages/purchase-inventory/inventory/QAApproval';
import MRR from '@/pages/purchase-inventory/inventory/MRR';
import MRRReturn from '@/pages/purchase-inventory/inventory/MRRReturn';
import LandedCost from '@/pages/purchase-inventory/inventory/LandedCost';
import MaterialIssue from '@/pages/purchase-inventory/inventory/MaterialIssue';
import MaterialIssueReturn from '@/pages/purchase-inventory/inventory/MaterialIssueReturn';

import CostHeadConsumptionReport from '@/pages/purchase-inventory/inventory/CostHeadConsumptionReport';
import CostHeadReceiveReport from '@/pages/purchase-inventory/inventory/CostHeadReceiveReport';
import ShipmentTransferReport from '@/pages/purchase-inventory/inventory/ShipmentTransferReport';
import ShipmentReceiveReport from '@/pages/purchase-inventory/inventory/ShipmentReceiveReport';
import CostHeadPOReport from '@/pages/purchase-inventory/inventory/CostHeadPOReport';
import PRStatusReport from '@/pages/purchase-inventory/inventory/PRStatusReport';
import LandedCostCheckReport from '@/pages/purchase-inventory/inventory/LandedCostCheckReport';

// Purchase & Inventory - New / Create pages
import NewVendor from '@/pages/purchase-inventory/purchase/new/NewVendor';
import NewPurchaseRequisition from '@/pages/purchase-inventory/purchase/new/NewPurchaseRequisition';
import NewRFQ from '@/pages/purchase-inventory/purchase/new/NewRFQ';
import NewQuotation from '@/pages/purchase-inventory/purchase/new/NewQuotation';
import NewComparativeStatement from '@/pages/purchase-inventory/purchase/new/NewComparativeStatement';
import NewNoteSheet from '@/pages/purchase-inventory/purchase/new/NewNoteSheet';
import NewLPO from '@/pages/purchase-inventory/purchase/new/NewLPO';
import NewFPO from '@/pages/purchase-inventory/purchase/new/NewFPO';
import NewProformaInvoice from '@/pages/purchase-inventory/purchase/new/NewProformaInvoice';
import NewLC from '@/pages/purchase-inventory/purchase/new/NewLC';
import NewLCAmendment from '@/pages/purchase-inventory/purchase/new/NewLCAmendment';
import NewPassedForPayment from '@/pages/purchase-inventory/purchase/new/NewPassedForPayment';

import NewWarehouse from '@/pages/purchase-inventory/inventory/new/NewWarehouse';
import NewWarehouseLocation from '@/pages/purchase-inventory/inventory/new/NewWarehouseLocation';
import NewRoute from '@/pages/purchase-inventory/inventory/new/NewRoute';
import NewMaterialRequisition from '@/pages/purchase-inventory/inventory/new/NewMaterialRequisition';
import NewSalesLoanRequest from '@/pages/purchase-inventory/inventory/new/NewSalesLoanRequest';
import NewSalesLoanIssue from '@/pages/purchase-inventory/inventory/new/NewSalesLoanIssue';
import NewSalesOrder from '@/pages/purchase-inventory/inventory/new/NewSalesOrder';
import NewDeliveryNote from '@/pages/purchase-inventory/inventory/new/NewDeliveryNote';

import NewQAApproval from '@/pages/purchase-inventory/inventory/new/NewQAApproval';
import NewMRR from '@/pages/purchase-inventory/inventory/new/NewMRR';
import NewMRRReturn from '@/pages/purchase-inventory/inventory/new/NewMRRReturn';
import NewLandedCost from '@/pages/purchase-inventory/inventory/new/NewLandedCost';
import NewMaterialIssue from '@/pages/purchase-inventory/inventory/new/NewMaterialIssue';
import NewMaterialIssueReturn from '@/pages/purchase-inventory/inventory/new/NewMaterialIssueReturn';


// Party Billing
import SupplierBillingConfig from '@/pages/party-billing/SupplierBillingConfig';
import SupplierAdjustment from '@/pages/party-billing/SupplierAdjustment';
import SupplierPayout from '@/pages/party-billing/SupplierPayout';
import SupplierPayoutPay from '@/pages/party-billing/SupplierPayoutPay';
import SupplierStatementView from '@/pages/party-billing/SupplierStatementView';
import ManualStatementGenerate from '@/pages/party-billing/ManualStatementGenerate';

// Foodi Integration
import FoodiIntegrationHome from '@/pages/foodi-integration/FoodiIntegrationHome';
import ServiceParentGLMapping from '@/pages/foodi-integration/ServiceParentGLMapping';
import ServiceGLMapping from '@/pages/foodi-integration/ServiceGLMapping';

// Reconciliation
import ReconciliationHome from '@/pages/reconciliation/ReconciliationHome';

// Module Data Uploads
import BudgetDataUpload from '@/pages/budget/BudgetDataUpload';
import LeaseDataUpload from '@/pages/lease/LeaseDataUpload';
import InventoryDataUpload from '@/pages/purchase-inventory/inventory/InventoryDataUpload';
import PartyDataUpload from '@/pages/party-billing/PartyDataUpload';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useApp();
  
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

function TaxModeWrapper({ children }: { children: React.ReactNode }) {
  const { isTaxMode } = useAccountingMode();
  return <>{children}</>;
}

export function AccountingRoutes() {
  const { isTaxMode } = useAccountingMode();

  return (
    <Routes>
      <Route path="homepage" element={<ProtectedRoute><Homepage /></ProtectedRoute>} />
      <Route path="admin/menu" element={<ProtectedRoute><MenuTreeView /></ProtectedRoute>} />
      <Route path="admin/roles" element={<ProtectedRoute><RoleManagement /></ProtectedRoute>} />
      <Route path="admin/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
      <Route path="admin/menu-action-permission" element={<ProtectedRoute><MenuActionPermission /></ProtectedRoute>} />
      <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="general-ledger" element={<ProtectedRoute><GeneralLedger /></ProtectedRoute>} />
      <Route path="parent-gl" element={<ProtectedRoute><ParentGL /></ProtectedRoute>} />
      <Route path="gl-voucher-type-mapping" element={<ProtectedRoute><GLVoucherTypeMapping /></ProtectedRoute>} />
      <Route path="chart-of-account" element={<ProtectedRoute><ChartOfAccounts /></ProtectedRoute>} />
      <Route path="currency-setup" element={<ProtectedRoute><CurrencySetup /></ProtectedRoute>} />
      <Route path="fiscal-year-setup" element={<ProtectedRoute><FiscalYearSetup /></ProtectedRoute>} />
      <Route path="holiday-setup" element={<ProtectedRoute><HolidaySetup /></ProtectedRoute>} />
      <Route path="weekend-setup" element={<ProtectedRoute><WeekendSetup /></ProtectedRoute>} />
      <Route path="sbu-setup" element={<ProtectedRoute><SBUSetup /></ProtectedRoute>} />
      <Route path="department-setup" element={<ProtectedRoute><DepartmentSetup /></ProtectedRoute>} />
      <Route path="city-setup" element={<ProtectedRoute><CitySetup /></ProtectedRoute>} />
      <Route path="zone-setup" element={<ProtectedRoute><ZoneSetup /></ProtectedRoute>} />
      <Route path="hub-setup" element={<ProtectedRoute><HubSetup /></ProtectedRoute>} />
      <Route path="voucher-type-setup" element={<ProtectedRoute><VoucherTypeSetup /></ProtectedRoute>} />
      <Route path="month-closing" element={<ProtectedRoute><MonthClosing /></ProtectedRoute>} />
      <Route path="fiscal-year-closing" element={<ProtectedRoute><FiscalYearClosing /></ProtectedRoute>} />
      <Route path="party-type-setup" element={<ProtectedRoute><PartyTypeSetup /></ProtectedRoute>} />
      <Route path="party-master" element={<ProtectedRoute><PartyMaster /></ProtectedRoute>} />
      <Route path="sub-gl-setup" element={<ProtectedRoute><SubGLSetup /></ProtectedRoute>} />
      
      <Route path="party-add" element={<ProtectedRoute><PartyAdd /></ProtectedRoute>} />
      <Route path="party-list" element={<ProtectedRoute><PartyListPage /></ProtectedRoute>} />
      <Route path="party-recon-gl-config" element={<ProtectedRoute><PartyReconGLConfig /></ProtectedRoute>} />
      <Route path="voucher-list" element={<ProtectedRoute><VoucherList /></ProtectedRoute>} />
      <Route path="batch-voucher" element={<ProtectedRoute><BatchVoucherEntry /></ProtectedRoute>} />
      <Route path="batch-voucher-list" element={<ProtectedRoute><BatchVoucherList /></ProtectedRoute>} />
      <Route path="fund-transfer" element={<ProtectedRoute><FundTransfer /></ProtectedRoute>} />

      {/* Revenue Accounting Portal */}
      <Route path="revenue-accounting/gl-mapping" element={<ProtectedRoute><RAGLMapping /></ProtectedRoute>} />
      <Route path="revenue-accounting/excel-upload" element={<ProtectedRoute><RAExcelUpload /></ProtectedRoute>} />
      <Route path="revenue-accounting/voucher-list" element={<ProtectedRoute><VoucherList /></ProtectedRoute>} />

      {/* Cost Accounting Portal */}
      <Route path="cost-accounting/gl-mapping" element={<ProtectedRoute><CAGLMapping /></ProtectedRoute>} />
      <Route path="cost-accounting/excel-upload" element={<ProtectedRoute><CAExcelUpload /></ProtectedRoute>} />
      <Route path="cost-accounting/voucher-list" element={<ProtectedRoute><VoucherList /></ProtectedRoute>} />

      <Route path="policy-setup" element={<ProtectedRoute><PolicySetup /></ProtectedRoute>} />
      <Route path="lock-date-setup" element={<ProtectedRoute><LockDateSetup /></ProtectedRoute>} />
      <Route path="approval-layer-config" element={<ProtectedRoute><ApprovalLayerConfig /></ProtectedRoute>} />
      <Route path="data-upload" element={<ProtectedRoute><DataUpload /></ProtectedRoute>} />
      
      {/* Reports */}
      <Route path="reports/transaction" element={<ProtectedRoute><TransactionReport /></ProtectedRoute>} />
      <Route path="reports/general-ledger" element={<ProtectedRoute><GeneralLedgerReport /></ProtectedRoute>} />
      <Route path="reports/gl-summary" element={<ProtectedRoute><GeneralLedgerSummaryReport /></ProtectedRoute>} />
      <Route path="reports/trial-balance" element={<ProtectedRoute><TrialBalanceReport /></ProtectedRoute>} />
      <Route path="reports/trial-balance-extended" element={<ProtectedRoute><TrialBalanceExtendedReport /></ProtectedRoute>} />
      <Route path="reports/payment-receipt" element={<ProtectedRoute><PaymentReceiptReport /></ProtectedRoute>} />
      <Route path="reports/financial" element={<ProtectedRoute><FinancialReport /></ProtectedRoute>} />
      <Route path="reports/cash-flow" element={<ProtectedRoute><CashFlowReport /></ProtectedRoute>} />
      <Route path="reports/income-statement" element={<ProtectedRoute><IncomeStatement /></ProtectedRoute>} />
      <Route path="reports/balance-sheet" element={<ProtectedRoute><BalanceSheet /></ProtectedRoute>} />
      <Route path="reports/ratio-analysis" element={<ProtectedRoute><RatioAnalysisReport /></ProtectedRoute>} />
      <Route path="reports/currency-rate" element={<ProtectedRoute><CurrencyRateReport /></ProtectedRoute>} />
      <Route path="reports/gl-aging" element={<ProtectedRoute><GLAgingReport /></ProtectedRoute>} />
      <Route path="reports/ap-aging" element={<ProtectedRoute><APAgingReport /></ProtectedRoute>} />
      <Route path="reports/ar-aging" element={<ProtectedRoute><ARAgingReport /></ProtectedRoute>} />
      <Route path="reports/inventory-aging" element={<ProtectedRoute><InventoryAgingReport /></ProtectedRoute>} />
      <Route path="reports/inventory-transaction" element={<ProtectedRoute><InventoryTransactionReport /></ProtectedRoute>} />
      <Route path="report-config/ratio-analysis" element={<ProtectedRoute><RatioAnalysisConfig /></ProtectedRoute>} />
      
      {/* Fixed Asset Routes */}
      <Route path="fixed-asset/asset-group" element={<ProtectedRoute><AssetGroupSetup /></ProtectedRoute>} />
      <Route path="fixed-asset/value-adjustment-rules" element={<ProtectedRoute><ValueAdjustmentRules /></ProtectedRoute>} />
      <Route path="fixed-asset/employee-directory" element={<ProtectedRoute><EmployeeDirectory /></ProtectedRoute>} />
      <Route path="fixed-asset/data-upload" element={<ProtectedRoute><AssetDataUpload /></ProtectedRoute>} />
      <Route path="fixed-asset/recon-gl-mapping" element={<ProtectedRoute><AssetReconGLMapping /></ProtectedRoute>} />
      <Route path="fixed-asset/registration" element={<ProtectedRoute><AssetRegistration /></ProtectedRoute>} />
      <Route path="fixed-asset/allocation" element={<ProtectedRoute><AssetAllocation /></ProtectedRoute>} />
      <Route path="fixed-asset/depreciation" element={<ProtectedRoute><AssetDepreciation /></ProtectedRoute>} />
      <Route path="fixed-asset/disposal" element={<ProtectedRoute><AssetDisposal /></ProtectedRoute>} />
      <Route path="fixed-asset/revaluation" element={<ProtectedRoute><AssetRevaluation /></ProtectedRoute>} />
      <Route path="fixed-asset/renovation" element={<ProtectedRoute><AssetRenovation /></ProtectedRoute>} />
      <Route path="fixed-asset/maintenance" element={<ProtectedRoute><AssetMaintenance /></ProtectedRoute>} />
      <Route path="fixed-asset/transfer" element={<ProtectedRoute><AssetTransfer /></ProtectedRoute>} />
      <Route path="fixed-asset/reports/details" element={<ProtectedRoute><AssetDetailsReport /></ProtectedRoute>} />
      <Route path="fixed-asset/reports/allocation" element={<ProtectedRoute><AssetAllocationReport /></ProtectedRoute>} />
      <Route path="fixed-asset/reports/schedule" element={<ProtectedRoute><AssetScheduleReport /></ProtectedRoute>} />
      <Route path="fixed-asset/reports/disposal" element={<ProtectedRoute><AssetDisposalReport /></ProtectedRoute>} />
      <Route path="fixed-asset/reports/maintenance" element={<ProtectedRoute><AssetMaintenanceReport /></ProtectedRoute>} />

      {/* Budget Routes */}
      <Route path="budget/setup" element={<ProtectedRoute><BudgetSetup /></ProtectedRoute>} />
      <Route path="budget/cost-head-amount" element={<ProtectedRoute><BudgetCostHeadAmountSetup /></ProtectedRoute>} />
      <Route path="budget/reports/budget-report" element={<ProtectedRoute><BudgetReport /></ProtectedRoute>} />
      <Route path="budget/reports/allocation" element={<ProtectedRoute><BudgetAllocationReport /></ProtectedRoute>} />
      <Route path="budget/reports/variance" element={<ProtectedRoute><BudgetVarianceReport /></ProtectedRoute>} />
      
      {/* Lease Routes */}
      <Route path="lease/setup" element={<ProtectedRoute><LeaseSetup /></ProtectedRoute>} />
      <Route path="lease/scheduler" element={<ProtectedRoute><LeaseRentScheduler /></ProtectedRoute>} />
      <Route path="lease/reports/hub-calculation" element={<ProtectedRoute><HubLeaseCalculationReport /></ProtectedRoute>} />
      <Route path="lease/reports/summary" element={<ProtectedRoute><LeaseRentSummaryReport /></ProtectedRoute>} />

      {/* Purchase & Inventory: Purchase */}
      <Route path="purchase-inventory/purchase/vendor-setup" element={<ProtectedRoute><VendorSetup /></ProtectedRoute>} />
      <Route path="purchase-inventory/purchase/requisition" element={<ProtectedRoute><PurchaseRequisition /></ProtectedRoute>} />
      <Route path="purchase-inventory/purchase/rfq" element={<ProtectedRoute><RequestForQuotation /></ProtectedRoute>} />
      <Route path="purchase-inventory/purchase/quotation" element={<ProtectedRoute><Quotation /></ProtectedRoute>} />
      <Route path="purchase-inventory/purchase/comparative-statement" element={<ProtectedRoute><ComparativeStatement /></ProtectedRoute>} />
      <Route path="purchase-inventory/purchase/note-sheet" element={<ProtectedRoute><NoteSheet /></ProtectedRoute>} />
      <Route path="purchase-inventory/purchase/local-po" element={<ProtectedRoute><LocalPurchaseOrder /></ProtectedRoute>} />
      <Route path="purchase-inventory/purchase/foreign-po" element={<ProtectedRoute><ForeignPurchaseOrder /></ProtectedRoute>} />
      <Route path="purchase-inventory/purchase/proforma-invoice" element={<ProtectedRoute><ProformaInvoice /></ProtectedRoute>} />
      <Route path="purchase-inventory/purchase/lc" element={<ProtectedRoute><LetterOfCredit /></ProtectedRoute>} />
      <Route path="purchase-inventory/purchase/lc-amendment" element={<ProtectedRoute><LCAmendment /></ProtectedRoute>} />
      <Route path="purchase-inventory/purchase/passed-for-payment" element={<ProtectedRoute><PassedForPayment /></ProtectedRoute>} />

      {/* Purchase & Inventory: Inventory */}
      <Route path="purchase-inventory/inventory/warehouse" element={<ProtectedRoute><Warehouse /></ProtectedRoute>} />
      <Route path="purchase-inventory/inventory/warehouse-location" element={<ProtectedRoute><WarehouseLocation /></ProtectedRoute>} />
      <Route path="purchase-inventory/inventory/route" element={<ProtectedRoute><RouteSetup /></ProtectedRoute>} />
      <Route path="purchase-inventory/inventory/material-requisition" element={<ProtectedRoute><MaterialRequisition /></ProtectedRoute>} />
      <Route path="purchase-inventory/inventory/sales-loan-request" element={<ProtectedRoute><SalesLoanRequest /></ProtectedRoute>} />
      <Route path="purchase-inventory/inventory/sales-loan-issue" element={<ProtectedRoute><SalesLoanIssue /></ProtectedRoute>} />
      <Route path="purchase-inventory/inventory/sales-order" element={<ProtectedRoute><SalesOrder /></ProtectedRoute>} />
      <Route path="purchase-inventory/inventory/delivery-note" element={<ProtectedRoute><DeliveryNote /></ProtectedRoute>} />
      
      <Route path="purchase-inventory/inventory/qa-approval" element={<ProtectedRoute><QAApproval /></ProtectedRoute>} />
      <Route path="purchase-inventory/inventory/mrr" element={<ProtectedRoute><MRR /></ProtectedRoute>} />
      <Route path="purchase-inventory/inventory/mrr-return" element={<ProtectedRoute><MRRReturn /></ProtectedRoute>} />
      <Route path="purchase-inventory/inventory/landed-cost" element={<ProtectedRoute><LandedCost /></ProtectedRoute>} />
      <Route path="purchase-inventory/inventory/material-issue" element={<ProtectedRoute><MaterialIssue /></ProtectedRoute>} />
      <Route path="purchase-inventory/inventory/material-issue-return" element={<ProtectedRoute><MaterialIssueReturn /></ProtectedRoute>} />
      
      <Route path="purchase-inventory/inventory/reports/cost-head-consumption" element={<ProtectedRoute><CostHeadConsumptionReport /></ProtectedRoute>} />
      <Route path="purchase-inventory/inventory/reports/cost-head-receive" element={<ProtectedRoute><CostHeadReceiveReport /></ProtectedRoute>} />
      <Route path="purchase-inventory/inventory/reports/shipment-transfer" element={<ProtectedRoute><ShipmentTransferReport /></ProtectedRoute>} />
      <Route path="purchase-inventory/inventory/reports/shipment-receive" element={<ProtectedRoute><ShipmentReceiveReport /></ProtectedRoute>} />
      <Route path="purchase-inventory/inventory/reports/cost-head-po" element={<ProtectedRoute><CostHeadPOReport /></ProtectedRoute>} />
      <Route path="purchase-inventory/inventory/reports/pr-status" element={<ProtectedRoute><PRStatusReport /></ProtectedRoute>} />
      <Route path="purchase-inventory/inventory/reports/landed-cost-check" element={<ProtectedRoute><LandedCostCheckReport /></ProtectedRoute>} />

      {/* Purchase & Inventory - New / Create routes */}
      <Route path="purchase-inventory/purchase/vendor-setup/new" element={<ProtectedRoute><NewVendor /></ProtectedRoute>} />
      <Route path="purchase-inventory/purchase/requisition/new" element={<ProtectedRoute><NewPurchaseRequisition /></ProtectedRoute>} />
      <Route path="purchase-inventory/purchase/rfq/new" element={<ProtectedRoute><NewRFQ /></ProtectedRoute>} />
      <Route path="purchase-inventory/purchase/quotation/new" element={<ProtectedRoute><NewQuotation /></ProtectedRoute>} />
      <Route path="purchase-inventory/purchase/comparative-statement/new" element={<ProtectedRoute><NewComparativeStatement /></ProtectedRoute>} />
      <Route path="purchase-inventory/purchase/note-sheet/new" element={<ProtectedRoute><NewNoteSheet /></ProtectedRoute>} />
      <Route path="purchase-inventory/purchase/local-po/new" element={<ProtectedRoute><NewLPO /></ProtectedRoute>} />
      <Route path="purchase-inventory/purchase/foreign-po/new" element={<ProtectedRoute><NewFPO /></ProtectedRoute>} />
      <Route path="purchase-inventory/purchase/proforma-invoice/new" element={<ProtectedRoute><NewProformaInvoice /></ProtectedRoute>} />
      <Route path="purchase-inventory/purchase/lc/new" element={<ProtectedRoute><NewLC /></ProtectedRoute>} />
      <Route path="purchase-inventory/purchase/lc-amendment/new" element={<ProtectedRoute><NewLCAmendment /></ProtectedRoute>} />
      <Route path="purchase-inventory/purchase/passed-for-payment/new" element={<ProtectedRoute><NewPassedForPayment /></ProtectedRoute>} />

      <Route path="purchase-inventory/inventory/warehouse/new" element={<ProtectedRoute><NewWarehouse /></ProtectedRoute>} />
      <Route path="purchase-inventory/inventory/warehouse-location/new" element={<ProtectedRoute><NewWarehouseLocation /></ProtectedRoute>} />
      <Route path="purchase-inventory/inventory/route/new" element={<ProtectedRoute><NewRoute /></ProtectedRoute>} />
      <Route path="purchase-inventory/inventory/material-requisition/new" element={<ProtectedRoute><NewMaterialRequisition /></ProtectedRoute>} />
      <Route path="purchase-inventory/inventory/sales-loan-request/new" element={<ProtectedRoute><NewSalesLoanRequest /></ProtectedRoute>} />
      <Route path="purchase-inventory/inventory/sales-loan-issue/new" element={<ProtectedRoute><NewSalesLoanIssue /></ProtectedRoute>} />
      <Route path="purchase-inventory/inventory/sales-order/new" element={<ProtectedRoute><NewSalesOrder /></ProtectedRoute>} />
      <Route path="purchase-inventory/inventory/delivery-note/new" element={<ProtectedRoute><NewDeliveryNote /></ProtectedRoute>} />
      
      <Route path="purchase-inventory/inventory/qa-approval/new" element={<ProtectedRoute><NewQAApproval /></ProtectedRoute>} />
      <Route path="purchase-inventory/inventory/mrr/new" element={<ProtectedRoute><NewMRR /></ProtectedRoute>} />
      <Route path="purchase-inventory/inventory/mrr-return/new" element={<ProtectedRoute><NewMRRReturn /></ProtectedRoute>} />
      <Route path="purchase-inventory/inventory/landed-cost/new" element={<ProtectedRoute><NewLandedCost /></ProtectedRoute>} />
      <Route path="purchase-inventory/inventory/material-issue/new" element={<ProtectedRoute><NewMaterialIssue /></ProtectedRoute>} />
      <Route path="purchase-inventory/inventory/material-issue-return/new" element={<ProtectedRoute><NewMaterialIssueReturn /></ProtectedRoute>} />
      

      {/* Party Billing */}
      <Route path="party-billing/supplier-billing-config" element={<ProtectedRoute><SupplierBillingConfig /></ProtectedRoute>} />
      <Route path="party-billing/supplier-adjustment" element={<ProtectedRoute><SupplierAdjustment /></ProtectedRoute>} />
      <Route path="party-billing/supplier-payout" element={<ProtectedRoute><SupplierPayout /></ProtectedRoute>} />
      <Route path="party-billing/supplier-payout/pay/:id" element={<ProtectedRoute><SupplierPayoutPay /></ProtectedRoute>} />
      <Route path="party-billing/supplier-payout/view/:id" element={<ProtectedRoute><SupplierStatementView /></ProtectedRoute>} />
      <Route path="party-billing/manual-statement-generate" element={<ProtectedRoute><ManualStatementGenerate /></ProtectedRoute>} />

      {/* Foodi Integration */}
      <Route path="foodi-integration/home" element={<ProtectedRoute><FoodiIntegrationHome /></ProtectedRoute>} />
      <Route path="foodi-integration/service-parent-gl-mapping" element={<ProtectedRoute><ServiceParentGLMapping /></ProtectedRoute>} />
      <Route path="foodi-integration/service-gl-mapping" element={<ProtectedRoute><ServiceGLMapping /></ProtectedRoute>} />

      {/* Reconciliation */}
      <Route path="reconciliation/bank" element={<ProtectedRoute><ReconciliationHome /></ProtectedRoute>} />
      <Route path="reconciliation/mfs" element={<ProtectedRoute><ReconciliationHome /></ProtectedRoute>} />

      {/* Module Data Uploads */}
      <Route path="budget/data-upload" element={<ProtectedRoute><BudgetDataUpload /></ProtectedRoute>} />
      <Route path="lease/data-upload" element={<ProtectedRoute><LeaseDataUpload /></ProtectedRoute>} />
      <Route path="purchase-inventory/inventory/data-upload" element={<ProtectedRoute><InventoryDataUpload /></ProtectedRoute>} />
      <Route path="party-management/data-upload" element={<ProtectedRoute><PartyDataUpload /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="homepage" replace />} />
    </Routes>
  );
}
