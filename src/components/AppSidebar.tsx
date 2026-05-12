import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { USBanglaLogo } from './USBanglaLogo';
import { useApp } from '@/contexts/AppContext';
import { useAccountingMode } from '@/contexts/AccountingModeContext';
import {
  Home,
  Settings,
  FileSpreadsheet,
  ChevronDown,
  ChevronRight,
  Search,
  Upload,
  Receipt,
  RefreshCw,
  BarChart3,
  Truck,
  Users,
  Building,
  Clock,
  FileText,
  Globe,
  GitBranch,
  BookOpen,
  Coins,
  CreditCard,
  List,
  LayoutGrid,
  Layers,
  Menu,
  MousePointer,
  Shield,
  UserCog,
  Plane,
  MapPin,
  Package,
  Wrench,
  FileCheck,
  ClipboardList,
  PieChart,
  Plus,
  Box,
  HardDrive,
  ArrowRightLeft,
  Hammer,
  TrendingUp,
  Archive,
  Wallet,
  DollarSign,
} from 'lucide-react';
import { ShoppingCart, Warehouse as WarehouseIcon, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { SecondaryMenuType } from '@/contexts/AppContext';

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: MenuItem[];
}

// ─── Grouped reports (shared across portals) ───
const getGroupedReportItems = (prefix: string): MenuItem[] => [
  {
    label: 'Accounting Core Reports',
    icon: <FileText size={16} />,
    children: [
      { label: 'Transaction Report', icon: <FileText size={16} />, path: `${prefix}/reports/transaction` },
      { label: 'General Ledger Report', icon: <FileText size={16} />, path: `${prefix}/reports/general-ledger` },
      { label: 'General Ledger Summary', icon: <FileText size={16} />, path: `${prefix}/reports/gl-summary` },
      { label: 'Payment & Receipt Report', icon: <FileText size={16} />, path: `${prefix}/reports/payment-receipt` },
    ],
  },
  {
    label: 'Financial Statements',
    icon: <FileText size={16} />,
    children: [
      { label: 'Trial Balance Report', icon: <FileText size={16} />, path: `${prefix}/reports/trial-balance` },
      { label: 'Trial Balance Details Report', icon: <FileText size={16} />, path: `${prefix}/reports/trial-balance-extended` },
      { label: 'Financial Report', icon: <FileText size={16} />, path: `${prefix}/reports/financial` },
      { label: 'Cash Flow Report', icon: <FileText size={16} />, path: `${prefix}/reports/cash-flow` },
    ],
  },
  {
    label: 'Aging Reports',
    icon: <FileText size={16} />,
    children: [
      { label: 'AP Aging Report', icon: <FileText size={16} />, path: `${prefix}/reports/ap-aging` },
      { label: 'AR Aging Report', icon: <FileText size={16} />, path: `${prefix}/reports/ar-aging` },
      { label: 'GL Aging Report', icon: <FileText size={16} />, path: `${prefix}/reports/gl-aging` },
      { label: 'Inventory Aging Report', icon: <FileText size={16} />, path: `${prefix}/reports/inventory-aging` },
    ],
  },
  {
    label: 'Analysis & Other Report',
    icon: <FileText size={16} />,
    children: [
      { label: 'Ratio Analysis Report', icon: <FileText size={16} />, path: `${prefix}/reports/ratio-analysis` },
      { label: 'Currency Rate Report', icon: <FileText size={16} />, path: `${prefix}/reports/currency-rate` },
      { label: 'Inventory Transaction Report', icon: <FileText size={16} />, path: `${prefix}/reports/inventory-transaction` },
    ],
  },
];

// ─── Accounting: Configuration ───
const getConfigurationMenuItems = (prefix: string): MenuItem[] => [
  { label: 'Homepage', icon: <Home size={18} />, path: `${prefix}/homepage` },
  {
    label: 'Central Configuration',
    icon: <Settings size={18} />,
    children: [
      {
        label: 'Core Config',
        icon: <Settings size={16} />,
        children: [
          { label: 'Currency', icon: <Coins size={16} />, path: `${prefix}/currency-setup` },
          { label: 'Fiscal Year', icon: <Clock size={16} />, path: `${prefix}/fiscal-year-setup` },
          { label: 'Holidays', icon: <Clock size={16} />, path: `${prefix}/holiday-setup` },
          { label: 'Weekend', icon: <Clock size={16} />, path: `${prefix}/weekend-setup` },
          { label: 'Voucher Type', icon: <Receipt size={16} />, path: `${prefix}/voucher-type-setup` },
          { label: 'Policy', icon: <Shield size={16} />, path: `${prefix}/policy-setup` },
          { label: 'Lock Date', icon: <Clock size={16} />, path: `${prefix}/lock-date-setup` },
        ],
      },
      {
        label: 'Other Config',
        icon: <LayoutGrid size={16} />,
        children: [
          { label: 'SBU', icon: <Layers size={16} />, path: `${prefix}/sbu-setup` },
          { label: 'Department', icon: <Users size={16} />, path: `${prefix}/department-setup` },
          { label: 'City', icon: <MapPin size={16} />, path: `${prefix}/city-setup` },
          { label: 'Hub', icon: <Building size={16} />, path: `${prefix}/hub-setup` },
          { label: 'Zone', icon: <Globe size={16} />, path: `${prefix}/zone-setup` },
          { label: 'Approval Layer Config', icon: <Shield size={16} />, path: `${prefix}/approval-layer-config` },
        ],
      },
      {
        label: 'Report Config',
        icon: <FileText size={16} />,
        children: [
          { label: 'Ratio Analysis Config', icon: <FileText size={16} />, path: `${prefix}/report-config/ratio-analysis` },
        ],
      },
    ],
  },
  {
    label: 'GL Setup',
    icon: <FileSpreadsheet size={18} />,
    children: [
      { label: 'Parent GL', icon: <BookOpen size={16} />, path: `${prefix}/parent-gl` },
      { label: 'General Ledger', icon: <FileSpreadsheet size={16} />, path: `${prefix}/general-ledger` },
      { label: 'Chart of Accounts', icon: <FileText size={16} />, path: `${prefix}/chart-of-account` },
      { label: 'Voucher Type wise GL Mapping', icon: <Receipt size={16} />, path: `${prefix}/gl-voucher-type-mapping` },
    ],
  },
  {
    label: 'Periodical Process',
    icon: <Clock size={18} />,
    children: [
      { label: 'Month Closing', icon: <Clock size={16} />, path: `${prefix}/month-closing` },
      { label: 'Fiscal Year Closing', icon: <Clock size={16} />, path: `${prefix}/fiscal-year-closing` },
    ],
  },
];

// ─── Foodi Integration ───
const getFoodiIntegrationMenuItems = (prefix: string): MenuItem[] => [
  { label: 'Homepage', icon: <Home size={18} />, path: `${prefix}/foodi-integration/home` },
  {
    label: 'Foodi Integration',
    icon: <Globe size={18} />,
    children: [
      { label: 'Overview', icon: <Globe size={16} />, path: `${prefix}/foodi-integration/home` },
    ],
  },
  {
    label: 'GL Mapping',
    icon: <GitBranch size={18} />,
    children: [
      { label: 'Service wise Parent GL Mapping', icon: <BookOpen size={16} />, path: `${prefix}/foodi-integration/service-parent-gl-mapping` },
      { label: 'Service wise GL Mapping', icon: <FileSpreadsheet size={16} />, path: `${prefix}/foodi-integration/service-gl-mapping` },
    ],
  },
];

// ─── Reconciliation ───
const getReconciliationMenuItems = (prefix: string): MenuItem[] => [
  { label: 'Homepage', icon: <Home size={18} />, path: `${prefix}/homepage` },
  {
    label: 'Reconciliation',
    icon: <RefreshCw size={18} />,
    children: [
      { label: 'Bank Reconciliation', icon: <CreditCard size={16} />, path: `${prefix}/reconciliation/bank` },
      { label: 'MFS Reconciliation', icon: <Wallet size={16} />, path: `${prefix}/reconciliation/mfs` },
    ],
  },
];
const getOperationsMenuItems = (prefix: string, isTaxMode: boolean): MenuItem[] => [
  { label: 'Homepage', icon: <Home size={18} />, path: `${prefix}/homepage` },
  { label: 'Data Upload', icon: <Upload size={18} />, path: `${prefix}/data-upload` },
  {
    label: 'Voucher',
    icon: <Receipt size={18} />,
    children: [
      { label: 'Voucher Entry', icon: <FileText size={16} />, path: `${prefix}/batch-voucher` },
      { label: 'Voucher List', icon: <List size={16} />, path: `${prefix}/voucher-list` },
      { label: 'Batch Voucher List', icon: <List size={16} />, path: `${prefix}/batch-voucher-list` },
    ],
  },
  {
    label: 'Reports',
    icon: <BarChart3 size={18} />,
    children: [
      ...getGroupedReportItems(prefix),
    ],
  },
];

// ─── Revenue Accounting Portal ───
const getRevenueAccountingMenuItems = (prefix: string): MenuItem[] => [
  { label: 'Homepage', icon: <Home size={18} />, path: `${prefix}/homepage` },
  {
    label: 'Configuration',
    icon: <Settings size={18} />,
    children: [
      { label: 'GL Mapping', icon: <GitBranch size={16} />, path: `${prefix}/revenue-accounting/gl-mapping` },
    ],
  },
  {
    label: 'Operations',
    icon: <TrendingUp size={18} />,
    children: [
      { label: 'Excel Upload', icon: <Upload size={16} />, path: `${prefix}/revenue-accounting/excel-upload` },
    ],
  },
];

// ─── Cost Accounting Portal ───
const getCostAccountingMenuItems = (prefix: string): MenuItem[] => [
  { label: 'Homepage', icon: <Home size={18} />, path: `${prefix}/homepage` },
  {
    label: 'Configuration',
    icon: <Settings size={18} />,
    children: [
      { label: 'GL Mapping', icon: <GitBranch size={16} />, path: `${prefix}/cost-accounting/gl-mapping` },
    ],
  },
  {
    label: 'Operations',
    icon: <TrendingUp size={18} />,
    children: [
      { label: 'Excel Upload', icon: <Upload size={16} />, path: `${prefix}/cost-accounting/excel-upload` },
    ],
  },
];

// ─── Accounting: Report ───
const getReportMenuItems = (prefix: string): MenuItem[] => [
  { label: 'Homepage', icon: <Home size={18} />, path: `${prefix}/homepage` },
  {
    label: 'Reports',
    icon: <BarChart3 size={18} />,
    children: getGroupedReportItems(prefix),
  },
];

// ─── Admin Portal ───
const getAdminMenuItems = (prefix: string): MenuItem[] => [
  { label: 'Homepage', icon: <Home size={18} />, path: `${prefix}/homepage` },
  {
    label: 'System Setup',
    icon: <Settings size={18} />,
    children: [
      { label: 'Menu', icon: <Menu size={16} />, path: `${prefix}/admin/menu` },
    ],
  },
  {
    label: 'Access Control',
    icon: <Shield size={18} />,
    children: [
      { label: 'Menu wise action permission', icon: <Menu size={16} />, path: `${prefix}/admin/menu-action-permission` },
    ],
  },
  {
    label: 'User Management',
    icon: <Shield size={18} />,
    children: [
      { label: 'Role', icon: <Shield size={16} />, path: `${prefix}/admin/roles` },
      { label: 'User', icon: <Menu size={16} />, path: `${prefix}/admin/users` },
    ],
  },
];

// ─── Ground Handling ───
const getGroundHandlingMenuItems = (prefix: string): MenuItem[] => [
  { label: 'Dashboard', icon: <PieChart size={18} />, path: `${prefix}/ground-handling/reports/dashboard` },
  {
    label: 'Configuration',
    icon: <Settings size={18} />,
    children: [
      { label: 'Stations', icon: <MapPin size={16} />, path: `${prefix}/ground-handling/station/list` },
      { label: 'Suppliers', icon: <Truck size={16} />, path: `${prefix}/ground-handling/suppliers/list` },
      { label: 'Services', icon: <Wrench size={16} />, path: `${prefix}/ground-handling/services/list` },
      { label: 'Criteria', icon: <List size={16} />, path: `${prefix}/ground-handling/criteria/list` },
      { label: 'Aircraft Setup', icon: <Plane size={16} />, path: `${prefix}/ground-handling/aircraft-setup` },
      { label: 'Route Setup', icon: <Globe size={16} />, path: `${prefix}/ground-handling/route-setup` },
      {
        label: 'Agreements',
        icon: <FileCheck size={16} />,
        children: [
          { label: 'New Agreement', icon: <FileCheck size={16} />, path: `${prefix}/ground-handling/agreements/station-wise` },
          { label: 'Agreement Comparison', icon: <FileText size={16} />, path: `${prefix}/ground-handling/agreements/comparison` },
        ],
      },
    ],
  },
  {
    label: 'Operation',
    icon: <Plane size={18} />,
    children: [
      {
        label: 'Flight Operations',
        icon: <Plane size={16} />,
        children: [
          { label: 'Journey Log', icon: <ClipboardList size={16} />, path: `${prefix}/ground-handling/flight-ops/journey-log` },
          { label: 'Service Data Entry', icon: <FileText size={16} />, path: `${prefix}/ground-handling/flight-ops/service-data` },
        ],
      },
      {
        label: 'Invoice',
        icon: <Receipt size={16} />,
        children: [
          { label: 'Forecasted Costing', icon: <FileText size={16} />, path: `${prefix}/ground-handling/invoice/forecasted-costing` },
          { label: 'Add Invoice', icon: <CreditCard size={16} />, path: `${prefix}/ground-handling/invoice/add` },
          { label: 'Invoice List', icon: <List size={16} />, path: `${prefix}/ground-handling/invoice/list` },
          { label: 'Reconciliation', icon: <RefreshCw size={16} />, path: `${prefix}/ground-handling/invoice/reconciliation` },
        ],
      },
    ],
  },
  {
    label: 'Reports',
    icon: <BarChart3 size={18} />,
    children: [
      { label: 'Dashboard', icon: <PieChart size={16} />, path: `${prefix}/ground-handling/reports/dashboard` },
      { label: 'Station Wise Report', icon: <FileText size={16} />, path: `${prefix}/ground-handling/reports/station-wise` },
      { label: 'Service Utilization Report', icon: <FileText size={16} />, path: `${prefix}/ground-handling/reports/service-utilization` },
      { label: 'Reconciliation', icon: <RefreshCw size={16} />, path: `${prefix}/ground-handling/reports/reconciliation` },
    ],
  },
];

// ─── Fixed Asset: Configuration ───
const getFixedAssetConfigurationItems = (prefix: string): MenuItem[] => [
  {
    label: 'Configuration',
    icon: <Settings size={18} />,
    children: [
      { label: 'Asset Group', icon: <Box size={16} />, path: `${prefix}/fixed-asset/asset-group` },
      { label: 'Asset Depreciation Rules', icon: <TrendingUp size={16} />, path: `${prefix}/fixed-asset/value-adjustment-rules` },
      { label: 'Employee Directory', icon: <Users size={16} />, path: `${prefix}/fixed-asset/employee-directory` },
      { label: 'Data Upload', icon: <Upload size={16} />, path: `${prefix}/fixed-asset/data-upload` },
      { label: 'Recon GL Mapping', icon: <GitBranch size={16} />, path: `${prefix}/fixed-asset/recon-gl-mapping` },
    ],
  },
];

// ─── Fixed Asset: Operation (includes Reports) ───
const getFixedAssetOperationItems = (prefix: string): MenuItem[] => [
  {
    label: 'Operation',
    icon: <HardDrive size={18} />,
    children: [
      { label: 'Asset Registration', icon: <FileText size={16} />, path: `${prefix}/fixed-asset/registration` },
      { label: 'Asset Allocation', icon: <Users size={16} />, path: `${prefix}/fixed-asset/allocation` },
      { label: 'Depreciation & Amortization', icon: <TrendingUp size={16} />, path: `${prefix}/fixed-asset/depreciation` },
      { label: 'Asset Disposal', icon: <Archive size={16} />, path: `${prefix}/fixed-asset/disposal` },
      { label: 'Asset Revaluation', icon: <TrendingUp size={16} />, path: `${prefix}/fixed-asset/revaluation` },
      { label: 'Asset Renovation', icon: <Hammer size={16} />, path: `${prefix}/fixed-asset/renovation` },
      { label: 'Asset Maintenance', icon: <Wrench size={16} />, path: `${prefix}/fixed-asset/maintenance` },
      { label: 'Asset Transfer', icon: <ArrowRightLeft size={16} />, path: `${prefix}/fixed-asset/transfer` },
    ],
  },
  {
    label: 'Reports',
    icon: <BarChart3 size={18} />,
    children: [
      { label: 'Asset Details Report', icon: <FileText size={16} />, path: `${prefix}/fixed-asset/reports/details` },
      { label: 'Allocation Report', icon: <FileText size={16} />, path: `${prefix}/fixed-asset/reports/allocation` },
      { label: 'Asset Schedule Report', icon: <FileText size={16} />, path: `${prefix}/fixed-asset/reports/schedule` },
      { label: 'Disposal Report', icon: <FileText size={16} />, path: `${prefix}/fixed-asset/reports/disposal` },
      { label: 'Maintenance Report', icon: <FileText size={16} />, path: `${prefix}/fixed-asset/reports/maintenance` },
    ],
  },
];

// ─── Budget ───
const getBudgetMenuItems = (prefix: string): MenuItem[] => [
  {
    label: 'Budget Setup',
    icon: <Settings size={18} />,
    children: [
      { label: 'Budget Setup', icon: <Wallet size={16} />, path: `${prefix}/budget/setup` },
      { label: 'Cost Head Wise Amount', icon: <DollarSign size={16} />, path: `${prefix}/budget/cost-head-amount` },
    ],
  },
  { label: 'Data Upload', icon: <Upload size={18} />, path: `${prefix}/budget/data-upload` },
  {
    label: 'Reports',
    icon: <BarChart3 size={18} />,
    children: [
      { label: 'Budget Report', icon: <FileText size={16} />, path: `${prefix}/budget/reports/budget-report` },
      { label: 'Budget Allocation Report', icon: <FileText size={16} />, path: `${prefix}/budget/reports/allocation` },
      { label: 'Budget Variance Report', icon: <FileText size={16} />, path: `${prefix}/budget/reports/variance` },
    ],
  },
];

// ─── Lease ───
const getLeaseMenuItems = (prefix: string): MenuItem[] => [
  {
    label: 'Operations',
    icon: <Settings size={18} />,
    children: [
      { label: 'Lease / Rent Setup', icon: <FileText size={16} />, path: `${prefix}/lease/setup` },
      { label: 'Lease / Rent Scheduler', icon: <FileText size={16} />, path: `${prefix}/lease/scheduler` },
    ],
  },
  { label: 'Data Upload', icon: <Upload size={18} />, path: `${prefix}/lease/data-upload` },
  {
    label: 'Reports',
    icon: <BarChart3 size={18} />,
    children: [
      { label: 'Hub-wise Lease Calculation', icon: <FileText size={16} />, path: `${prefix}/lease/reports/hub-calculation` },
      { label: 'Lease / Rent Summary Report', icon: <FileText size={16} />, path: `${prefix}/lease/reports/summary` },
    ],
  },
];

// ─── Purchase & Inventory: Purchase ───
const getPurchaseMenuItems = (prefix: string): MenuItem[] => [
  {
    label: 'Purchase',
    icon: <ShoppingCart size={18} />,
    children: [
      { label: 'Vendor Setup', icon: <Users size={16} />, path: `${prefix}/purchase-inventory/purchase/vendor-setup` },
      { label: 'Purchase Requisition', icon: <ClipboardList size={16} />, path: `${prefix}/purchase-inventory/purchase/requisition` },
      { label: 'Request for Quotation', icon: <FileText size={16} />, path: `${prefix}/purchase-inventory/purchase/rfq` },
      { label: 'Quotation', icon: <FileText size={16} />, path: `${prefix}/purchase-inventory/purchase/quotation` },
      { label: 'Comparative Statement', icon: <FileSpreadsheet size={16} />, path: `${prefix}/purchase-inventory/purchase/comparative-statement` },
      { label: 'Note Sheet', icon: <FileCheck size={16} />, path: `${prefix}/purchase-inventory/purchase/note-sheet` },
      { label: 'Local Purchase Order', icon: <Receipt size={16} />, path: `${prefix}/purchase-inventory/purchase/local-po` },
      { label: 'Foreign Purchase Order', icon: <Globe size={16} />, path: `${prefix}/purchase-inventory/purchase/foreign-po` },
      { label: 'Proforma Invoice', icon: <FileText size={16} />, path: `${prefix}/purchase-inventory/purchase/proforma-invoice` },
      { label: 'Letter of Credit (LC)', icon: <CreditCard size={16} />, path: `${prefix}/purchase-inventory/purchase/lc` },
      { label: 'LC Amendment', icon: <RefreshCw size={16} />, path: `${prefix}/purchase-inventory/purchase/lc-amendment` },
      { label: 'Passed for Payment', icon: <FileCheck size={16} />, path: `${prefix}/purchase-inventory/purchase/passed-for-payment` },
    ],
  },
];

// ─── Purchase & Inventory: Inventory ───
const getInventoryMenuItems = (prefix: string): MenuItem[] => [
  {
    label: 'Setup',
    icon: <Settings size={18} />,
    children: [
      { label: 'Warehouse', icon: <WarehouseIcon size={16} />, path: `${prefix}/purchase-inventory/inventory/warehouse` },
      { label: 'Warehouse Location', icon: <MapPin size={16} />, path: `${prefix}/purchase-inventory/inventory/warehouse-location` },
      { label: 'Route', icon: <Globe size={16} />, path: `${prefix}/purchase-inventory/inventory/route` },
    ],
  },
  { label: 'Data Upload', icon: <Upload size={18} />, path: `${prefix}/purchase-inventory/inventory/data-upload` },
  {
    label: 'Operations',
    icon: <Package size={18} />,
    children: [
      { label: 'Material Requisition', icon: <ClipboardList size={16} />, path: `${prefix}/purchase-inventory/inventory/material-requisition` },
      { label: 'Sales / Loan Request', icon: <FileText size={16} />, path: `${prefix}/purchase-inventory/inventory/sales-loan-request` },
      { label: 'Sales / Loan Issue', icon: <FileText size={16} />, path: `${prefix}/purchase-inventory/inventory/sales-loan-issue` },
      { label: 'Sales Order', icon: <Receipt size={16} />, path: `${prefix}/purchase-inventory/inventory/sales-order` },
      { label: 'Delivery Note', icon: <Truck size={16} />, path: `${prefix}/purchase-inventory/inventory/delivery-note` },
      { label: 'QA Approval', icon: <Shield size={16} />, path: `${prefix}/purchase-inventory/inventory/qa-approval` },
      { label: 'MRR', icon: <Box size={16} />, path: `${prefix}/purchase-inventory/inventory/mrr` },
      { label: 'MRR Return', icon: <ArrowRightLeft size={16} />, path: `${prefix}/purchase-inventory/inventory/mrr-return` },
      { label: 'Landed Cost', icon: <DollarSign size={16} />, path: `${prefix}/purchase-inventory/inventory/landed-cost` },
      { label: 'Material Issue', icon: <Package size={16} />, path: `${prefix}/purchase-inventory/inventory/material-issue` },
      { label: 'Material Issue Return', icon: <ArrowRightLeft size={16} />, path: `${prefix}/purchase-inventory/inventory/material-issue-return` },
    ],
  },
  {
    label: 'Reports',
    icon: <BarChart3 size={18} />,
    children: [
      { label: 'Cost Head Wise Monthly Consumption', icon: <FileText size={16} />, path: `${prefix}/purchase-inventory/inventory/reports/cost-head-consumption` },
      { label: 'Cost Head Wise Monthly Materials Receive', icon: <FileText size={16} />, path: `${prefix}/purchase-inventory/inventory/reports/cost-head-receive` },
      { label: 'Inventory Shipment Transfer Summary', icon: <FileText size={16} />, path: `${prefix}/purchase-inventory/inventory/reports/shipment-transfer` },
      { label: 'Inventory Shipment Receive Summary', icon: <FileText size={16} />, path: `${prefix}/purchase-inventory/inventory/reports/shipment-receive` },
      { label: 'Cost Head Wise PO Summary', icon: <FileText size={16} />, path: `${prefix}/purchase-inventory/inventory/reports/cost-head-po` },
      { label: 'PR Status Report', icon: <FileText size={16} />, path: `${prefix}/purchase-inventory/inventory/reports/pr-status` },
      { label: 'Landed Cost Check Report', icon: <FileText size={16} />, path: `${prefix}/purchase-inventory/inventory/reports/landed-cost-check` },
    ],
  },
];

// ─── Party Management: Party Config ───
const getPartyConfigMenuItems = (prefix: string): MenuItem[] => [
  { label: 'Homepage', icon: <Home size={18} />, path: `${prefix}/homepage` },
  {
    label: 'Party Config',
    icon: <Users size={18} />,
    children: [
      { label: 'Party Type Setup', icon: <Settings size={16} />, path: `${prefix}/party-type-setup` },
      { label: 'Party Mgt', icon: <List size={16} />, path: `${prefix}/party-list` },
      { label: 'Party Recon GL Config', icon: <Settings size={16} />, path: `${prefix}/party-recon-gl-config` },
    ],
  },
  { label: 'Data Upload', icon: <Upload size={18} />, path: `${prefix}/party-management/data-upload` },
];
const getPartyBillingMenuItems = (prefix: string): MenuItem[] => [
  { label: 'Homepage', icon: <Home size={18} />, path: `${prefix}/homepage` },
  {
    label: 'Supplier Billing',
    icon: <CreditCard size={18} />,
    children: [
      { label: 'Supplier Billing Config', icon: <Settings size={16} />, path: `${prefix}/party-billing/supplier-billing-config` },
      { label: 'Supplier Adjustment', icon: <FileCheck size={16} />, path: `${prefix}/party-billing/supplier-adjustment` },
      { label: 'Supplier Payout', icon: <Wallet size={16} />, path: `${prefix}/party-billing/supplier-payout` },
      { label: 'Manual Statement Generate', icon: <FileText size={16} />, path: `${prefix}/party-billing/manual-statement-generate` },
    ],
  },
];

function isDescendantActive(items: MenuItem[] | undefined, pathname: string): boolean {
  if (!items) return false;
  return items.some(
    child => child.path === pathname || isDescendantActive(child.children, pathname)
  );
}

function MenuItemComponent({ item, depth = 0 }: { item: MenuItem; depth?: number }) {
  const location = useLocation();
  const hasChildren = item.children && item.children.length > 0;
  const isActive = item.path === location.pathname;
  const isChildActive = isDescendantActive(item.children, location.pathname);
  const [isOpen, setIsOpen] = useState(isChildActive || false);

  const handleClick = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    }
  };

  const baseClasses = cn(
    'flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-colors text-sm',
    'hover:bg-sidebar-accent',
    isActive && 'bg-sidebar-primary text-sidebar-primary-foreground',
    isChildActive && !isActive && 'bg-sidebar-accent',
    depth > 0 && 'ml-4'
  );

  const content = (
    <>
      {item.icon}
      <span className="flex-1">{item.label}</span>
      {hasChildren && (
        isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />
      )}
    </>
  );

  return (
    <div onClick={(e) => e.stopPropagation()}>
      {item.path && !hasChildren ? (
        <Link to={item.path} className={baseClasses} onClick={(e) => e.stopPropagation()}>
          {content}
        </Link>
      ) : (
        <div className={baseClasses} onClick={handleClick}>
          {content}
        </div>
      )}
      {hasChildren && isOpen && (
        <div className="mt-1 space-y-1">
          {item.children?.map((child, index) => (
            <MenuItemComponent key={index} item={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function AppSidebar() {
  const { activePortal, activeSecondaryMenu } = useApp();
  const { accountingMode, isTaxMode } = useAccountingMode();
  
  const prefix = accountingMode === 'tax' ? '/tax' : '/management';

  const getMenuItems = (): MenuItem[] => {
    if (activePortal === 'admin') return getAdminMenuItems(prefix);
    if (activePortal === 'fixed-asset') {
      return activeSecondaryMenu === 'operations'
        ? getFixedAssetOperationItems(prefix)
        : getFixedAssetConfigurationItems(prefix);
    }
    if (activePortal === 'revenue-accounting') return getRevenueAccountingMenuItems(prefix);
    if (activePortal === 'cost-accounting') return getCostAccountingMenuItems(prefix);
    if (activePortal === 'budget') return getBudgetMenuItems(prefix);
    if (activePortal === 'lease') return getLeaseMenuItems(prefix);
    if (activePortal === 'purchase-inventory') {
      return activeSecondaryMenu === 'inventory'
        ? getInventoryMenuItems(prefix)
        : getPurchaseMenuItems(prefix);
    }
    if (activePortal === 'party-management') {
      return activeSecondaryMenu === 'party-billing'
        ? getPartyBillingMenuItems(prefix)
        : getPartyConfigMenuItems(prefix);
    }
    if (activePortal === 'foodi-integration') {
      return getFoodiIntegrationMenuItems(prefix);
    }
    if (activePortal === 'reconciliation') {
      return getReconciliationMenuItems(prefix);
    }
    
    // Accounting portal - based on secondary menu
    switch (activeSecondaryMenu) {
      case 'operations':
        return getOperationsMenuItems(prefix, isTaxMode);
      case 'configuration':
      default:
        return getConfigurationMenuItems(prefix);
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-56 bg-sidebar text-sidebar-foreground flex flex-col h-screen fixed left-0 top-0">
      <div className="p-4 border-b border-sidebar-border">
        <USBanglaLogo size="md" className="mb-4" />
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-sidebar-muted" />
          <Input
            placeholder="Search"
            className="pl-8 bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-muted h-8 text-sm"
          />
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {menuItems.map((item, index) => (
          <MenuItemComponent key={index} item={item} />
        ))}
      </nav>
      <div className="p-3 border-t border-sidebar-border text-xs text-sidebar-muted">
        Mode: {isTaxMode ? 'Tax' : 'Management'}
      </div>
    </aside>
  );
}
