# Software Requirements Specification (SRS)
## US-Bangla Airlines – Integrated Financial & Operations Management System
### Version 1.0 | Date: March 8, 2026

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [System Overview](#2-system-overview)
3. [Module 1: Accounting System](#3-module-1-accounting-system)
4. [Module 2: Ground Handling System](#4-module-2-ground-handling-system)
5. [Module 3: Fixed Asset Management](#5-module-3-fixed-asset-management)
6. [Module 4: Admin Portal](#6-module-4-admin-portal)
7. [Cross-Cutting Concerns](#7-cross-cutting-concerns)
8. [Non-Functional Requirements](#8-non-functional-requirements)

---

## 1. Introduction

### 1.1 Purpose
This SRS document defines the functional and business requirements for the US-Bangla Airlines Integrated Financial & Operations Management System. The system manages core accounting, ground handling operations, fixed asset lifecycle, and administrative functions across multiple branches.

### 1.2 Scope
The system consists of four major portals:
- **Accounting Portal** (Management & Tax Accounting)
- **Ground Handling Portal**
- **Fixed Asset Portal**
- **Admin Portal**

### 1.3 Users & Roles
| Role | Access |
|------|--------|
| Admin | Full access to all modules, user management, branch mapping |
| Manager | Branch-level operations, report viewing |
| User | Data entry, limited operations |

### 1.4 Dual Accounting Mode
The system supports **two parallel accounting modes**:
- **Management Accounting** (`/management/*`): Full access to all ledgers and voucher types.
- **Tax Accounting** (`/tax/*`): Restricted view showing only ledgers scoped as `tax` or `both`, and voucher types marked as `affectsTaxAccounting = true`.

Tax exclusion is determined at the voucher or individual line-item level. Vouchers excluded from Tax Accounting during Management mode entry can be re-included later via the Voucher List.

---

## 2. System Overview

### 2.1 Architecture
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Lovable Cloud (Supabase)
- **State Management**: React Context API + TanStack React Query
- **Routing**: React Router v6 with nested route structure

### 2.2 Authentication & Authorization
- Login with email and password
- Password reset functionality
- Branch selection required after login before accessing any module
- User-Branch mapping controls which branches a user can operate on
- Access levels: `full`, `read-only`, `restricted`

### 2.3 Navigation Structure
```
├── Accounting Portal
│   ├── Configuration (sidebar menu)
│   ├── Operations (sidebar menu)
│   └── Reports (sidebar menu)
├── Ground Handling Portal
│   ├── Configuration
│   ├── Operations
│   └── Reports
├── Fixed Asset Portal
│   ├── General Setup
│   ├── Asset Management
│   └── Reports
└── Admin Portal
    ├── System Setup
    ├── Access Control
    └── User Management
```

### 2.4 Multi-Branch Architecture
- Each branch has a unique code, base currency, and contact person.
- A special **Consolidated** branch (`CONS`) provides aggregated views across all branches.
- GL entries support branch consolidation modes: `all` (available in all branches), `unique` (branch-specific), `consolidate` (consolidated view only).

---

## 3. Module 1: Accounting System

### 3.1 Configuration

#### 3.1.1 Branch Setup
**Path**: `/management/branch-setup`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Branch Name | Text | Yes | Name of the branch |
| Branch Code | Text | Yes | Unique identifier code |
| Contact Person Name | Text | Yes | Primary contact |
| Contact Person Email | Email | Yes | Contact email |
| Base Currency | Select | Yes | Branch's base currency |
| Status | Toggle | Yes | Active / Inactive |

**Business Rules**:
- Branch code must be unique across the system.
- Branches cannot be deleted if they have active GL mappings or transactions.
- Consolidated branch is system-generated and cannot be modified.

---

#### 3.1.2 Currency Setup
**Path**: `/management/currency-setup`

**Purpose**: Define all currencies supported by the system.

**Business Rules**:
- BDT (Bangladeshi Taka) is the default base currency.
- Each branch can have a different base currency.
- Currency codes follow ISO 4217 standard.

---

#### 3.1.3 Daily Rate Setup
**Path**: `/management/daily-rate-setup`

**Purpose**: Configure daily exchange rates between currencies. Previously separate IATA Rate and Bank Rate setups are consolidated here.

| Field | Type | Description |
|-------|------|-------------|
| Branch Code | Select | Branch for which rate applies |
| Base Currency | Auto | Branch's base currency |
| Rate to BDT | Number | Conversion rate to BDT |
| Rate to USD | Number | Conversion rate to USD |
| Conversion Date | Date | Date of rate validity |

**Business Rules**:
- Rates are branch-specific.
- Historical rates are preserved for audit trail.
- IATA Rate Setup and Bank Rate Setup redirect to this page.

---

#### 3.1.4 FCY Exchange GL Setup
**Path**: `/management/fcy-exchange-gl-setup`

**Purpose**: Map GL accounts for foreign currency exchange gain/loss recording.

**Business Rules**:
- Links specific GL accounts to handle realized/unrealized foreign exchange gains or losses.
- Required for multi-currency transaction processing.

---

#### 3.1.5 Inter Branch Reconciliation Mapping
**Path**: `/management/inter-branch-recon-mapping`

**Purpose**: Define GL account pairs for inter-branch reconciliation.

**Business Rules**:
- Maps corresponding GL accounts between two branches for inter-branch transactions.
- Enables automated reconciliation of inter-branch balances.

---

#### 3.1.6 Airport / Station Setup
**Path**: `/management/airport-station-setup`

**Purpose**: Maintain airport and station master data for airline ticket sales operations.

---

#### 3.1.7 Point of Sale (POS) Setup
**Path**: `/management/pos-setup`

**Purpose**: Configure POS terminals for ticket sales.

---

#### 3.1.8 Policy Setup
**Path**: `/management/policy-setup`

**Purpose**: Configure internal control policies across branches.

| Policy | Description |
|--------|-------------|
| Same Person Maker Checker | Controls whether one user can both create and authorize the same transaction |
| Back Date Transaction | Allows/disallows transactions with past dates |
| Holiday Transaction | Allows/disallows transactions on holidays |

**Business Rules**:
- Each policy is toggled as `Allowed: Yes/No`.
- Policies are mapped to one or more specific branches.
- Policy enforcement is system-wide and cannot be overridden at user level.

---

#### 3.1.9 Period Setup
**Path**: `/management/period-setup`

**Purpose**: Define fiscal periods for financial reporting and period-locking.

**Business Rules**:
- Periods can be opened, closed, or locked.
- Locked periods prevent any transaction entry.
- Period closing generates trial balance snapshots.

---

### 3.2 GL Setup

#### 3.2.1 Parent GL
**Path**: `/management/parent-gl`

**Purpose**: Define parent-level GL codes that form the hierarchical structure of the chart of accounts.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Parent GL Code | Text | Yes | Hierarchical code |
| Parent GL Name | Text | Yes | Display name |
| GL Type | Select | Yes | Asset, Liability, Equity, Revenue, Expense |
| Status | Toggle | Yes | Active / Inactive |

**Business Rules**:
- Parent GL codes form the top levels of the account hierarchy.
- Simplified structure: T-Acc Server, Ledger Scope, and Currency fields removed.
- Accounts classified as **Bank**, **Cash**, or **Other**.

---

#### 3.2.2 General Ledger
**Path**: `/management/general-ledger`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| GL Code | Text | Yes | Unique ledger code |
| GL Name | Text | Yes | Ledger name |
| GL Type | Select | Yes | Asset/Liability/Equity/Revenue/Expense |
| Currency | Select | Yes | Ledger currency |
| Parent GL Code | Search | Yes | Link to parent GL |
| Is Recon GL | Toggle | No | Whether this is a reconciliation GL |
| Recon GL For | Select | Conditional | Bank/Cash (if isReconGL = true) |
| Branch Consolidation | Select | Yes | All / Unique / Consolidate |
| Ledger Scope | Select | Yes | Management / Tax / Both |
| Status | Toggle | Yes | Active / Inactive |

**Business Rules**:
- GL Code must be unique.
- Ledger Scope determines visibility:
  - `management`: Only visible in Management Accounting mode.
  - `tax`: Only visible in Tax Accounting mode.
  - `both`: Visible in both modes.
- Reconciliation GLs are linked to specific Party Types (Bank/Cash).
- Branch Consolidation controls multi-branch visibility.

---

#### 3.2.3 Branch Wise GL Code Mapping
**Path**: `/management/branch-gl-mapping`

**Purpose**: Map GL accounts to specific branches. A single GL can be mapped to multiple branches through a staging table interface.

| Field | Type | Description |
|-------|------|-------------|
| GL Code | Search + Button | GL code with adjacent search button |
| GL Name | Auto-fill | Populated from GL master |
| Branch | Multi-select | Target branches |
| Currency | Display | GL currency indicator |
| Status | Toggle | Active/Inactive |
| Auto Transaction | Toggle | Allow automatic postings |

**Business Rules**:
- Search button must be positioned immediately adjacent to the GL Code input field.
- GL Code search opens a dialog for GL selection.
- One GL can be mapped to multiple branches simultaneously.
- Mapping status can be toggled without deletion.

---

#### 3.2.4 Chart of Accounts
**Path**: `/management/chart-of-account`

**Purpose**: Hierarchical tree-view of the complete account structure.

**Business Rules**:
- Supports visibility logic: **Consolidate**, **All**, or **Branch Wise** views.
- Displays Reconciliation GL mappings based on Party Types.
- Read-only view; modifications done through GL Setup pages.

---

#### 3.2.5 Voucher Type wise GL Mapping
**Path**: `/management/gl-voucher-type-mapping`

**Purpose**: Map multiple GL accounts to voucher types with branch-based filtering.

| Field | Type | Description |
|-------|------|-------------|
| GL Code | Search | General ledger code |
| GL Name | Auto-fill | Ledger name |
| Voucher Type | Select | Payment/Receipt/Journal/Contra |
| Affects Tax Accounting | Toggle | Whether this mapping applies in Tax mode |
| Status | Toggle | Active/Inactive |

**Business Rules**:
- Multiple GL accounts can be mapped to a single voucher type.
- Branch-based filtering controls which accounts are available for specific transaction types.
- `affectsTaxAccounting` flag determines visibility in Tax Accounting mode.

---

### 3.3 Party Management

#### 3.3.1 Party Type Setup
**Path**: `/management/party-type-setup`

**Purpose**: Define party types (Customer, Supplier, Employee) and link them to Control Account GLs.

**Business Rules**:
- Uses Control Accounts instead of individual ledgers.
- Party Types are linked to GL accounts using a searchable **Control Account dropdown**.
- Selected GL is added to a linked list with removal ('X') buttons.
- Dropdown-and-list interface used (not checkboxes).

---

#### 3.3.2 Party List
**Path**: `/management/party-list`

**Purpose**: Consolidated interface for managing all parties (Customers, Suppliers, Employees) with categorized tabs.

**Business Rules**:
- Linked accounts auto-populate from the Party Type configuration but can be manually overridden.
- Party Add form accessible from Party List.
- Each party linked to specific GL Control Accounts.

---

### 3.4 Operations

#### 3.4.1 Voucher Entry
**Path**: `/management/voucher-entry`

**Purpose**: Create financial transactions (vouchers).

**Key Features**:
- Voucher types: Payment, Receipt, Journal, Contra
- Multi-line debit/credit entries
- Account Name selector in consolidated format: `GL Name-Party Type-Party Name` (e.g., "Adv.-Employee-Mahmudul")
- Tax exclusion toggle at voucher or line-item level
- Narration/description field
- Maker-checker workflow (controlled by Policy Setup)

**Business Rules**:
- Total debits must equal total credits.
- GL accounts filtered by voucher type mapping and branch mapping.
- Vouchers created in Management mode can be excluded from Tax Accounting.
- Vouchers created in Tax mode are included in Tax by default.
- Back-date and holiday transaction rules enforced by Policy Setup.
- SubGL transactions use the consolidated Account Name format.

---

#### 3.4.2 Voucher List
**Path**: `/management/voucher-list`

**Purpose**: View, search, filter, and manage all vouchers.

**Key Features**:
- Filter by date range, voucher type, branch, status
- View voucher details in dialog
- Re-include previously excluded Tax vouchers
- Voucher approval/rejection workflow

---

#### 3.4.3 Batch Voucher Entry
**Path**: `/management/batch-voucher`

**Purpose**: Bulk voucher creation for recurring or bulk transactions.

---

#### 3.4.4 Batch Voucher List
**Path**: `/management/batch-voucher-list`

**Purpose**: View and manage batch vouchers.

---

#### 3.4.5 Fund Transfer (Instruction Processing)
**Path**: `/management/fund-transfer`

**Purpose**: Process fund transfers between bank accounts.

**Layout**: Three sections:
1. **Credit Account Details**: Account Code, Name, Balance, OD Limit
2. **Debit Account Details**: Account Code, Name, Balance, OD Limit
3. **Transaction Details**: Amount, Amount in Words, Reference, Date

| Field | Type | Description |
|-------|------|-------------|
| Credit Account Code | Select | Source bank account |
| Credit Account Name | Auto-fill | Bank account name |
| Credit Balance | Display | Current balance |
| Credit OD Limit | Display | Overdraft limit |
| Debit Account Code | Select | Destination bank account |
| Debit Account Name | Auto-fill | Bank account name |
| Debit Balance | Display | Current balance |
| Debit OD Limit | Display | Overdraft limit |
| Amount | Number | Transfer amount |
| Amount in Words | Auto | Automated number-to-words conversion |
| Equivalent Credit | Number | Equivalent amount (for cross-currency) |
| Reference | Text | Transaction reference |
| Remarks | Text | Additional notes |

**Business Rules**:
- Credit and Debit accounts cannot be the same.
- Amount in Words is automatically calculated.
- All mandatory fields must be filled before submission.
- Bank accounts are filtered from GL entries where `isReconGL = true` and `reconGLFor = 'Bank'`.

---

### 3.5 Reports

#### 3.5.1 Transaction Report
**Path**: `/management/reports/transaction`

**Purpose**: Detailed transaction listing with date range, branch, and GL filters.

#### 3.5.2 General Ledger Report
**Path**: `/management/reports/general-ledger`

**Purpose**: Detailed GL-wise transaction report showing opening balance, period transactions, and closing balance.

#### 3.5.3 General Ledger Summary Report
**Path**: `/management/reports/gl-summary`

**Purpose**: Summarized GL balances across selected branches and periods.

#### 3.5.4 Trial Balance Report
**Path**: `/management/reports/trial-balance`

**Purpose**: Standard trial balance showing all GL balances (debit/credit columns).

#### 3.5.5 Trial Balance Extended Report
**Path**: `/management/reports/trial-balance-extended`

**Purpose**: Extended trial balance with opening balance, movements, and closing balance columns.

#### 3.5.6 Payment & Receipt Report
**Path**: `/management/reports/payment-receipt`

**Purpose**: Summary of all payment and receipt vouchers.

#### 3.5.7 Financial Report
**Path**: `/management/reports/financial`

**Purpose**: Consolidated financial statements.

#### 3.5.8 Cash Flow Report
**Path**: `/management/reports/cash-flow`

**Purpose**: Cash flow statement categorized by Operating, Investing, and Financing activities.

#### 3.5.9 Income Statement
**Path**: `/management/reports/income-statement`

**Purpose**: Profit & Loss statement showing Revenue, COGS, Operating Expenses, and Net Income.

#### 3.5.10 Balance Sheet
**Path**: `/management/reports/balance-sheet`

**Purpose**: Statement of financial position showing Assets, Liabilities, and Equity.

#### 3.5.11 Ratio Analysis Report
**Path**: `/management/reports/ratio-analysis`

**Purpose**: Financial ratio calculations based on configured formulas.

**Configuration**: `/management/report-config/ratio-analysis`

#### 3.5.12 Currency Rate Report
**Path**: `/management/reports/currency-rate`

**Purpose**: Historical exchange rate reporting.

#### 3.5.13 GL Aging Report
**Path**: `/management/reports/gl-aging`

**Purpose**: Aging analysis of GL balances (30/60/90/120+ days).

---

### 3.6 Dashboard
**Path**: `/management/dashboard`

**Key Widgets**:
- AP/AR Charts (Accounts Payable / Accounts Receivable)
- AP Ratio Analysis Chart
- Asset Liability Equity Chart
- Sales, COGS, OpEx Chart
- Yearly Income vs Expense Chart

---

## 4. Module 2: Ground Handling System

### 4.1 Configuration

#### 4.1.1 Station List
**Path**: `/management/ground-handling/station/list`

**Database Table**: `gh_stations`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| IATA Code | Text | Yes | 3-letter airport code |
| ICAO Code | Text | Yes | 4-letter airport code |
| Name | Text | Yes | Station name |
| Country | Text | Yes | Country |
| Region | Select | Yes | Default: Asia |
| Type | Select | Yes | Domestic / International |
| Status | Toggle | Yes | Active / Inactive |

**Business Rules**:
- IATA and ICAO codes must be unique.
- Stations are referenced by Suppliers, Agreements, and Reports.
- Uses standard list-and-edit-popup pattern.

---

#### 4.1.2 Supplier List
**Path**: `/management/ground-handling/suppliers/list`

**Database Table**: `gh_suppliers`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Company Name | Text | Yes | Supplier company name |
| Supplier Type | Select | Yes | Ground Handling / Fuel / Catering / etc. |
| Station IATA | Select | No | Linked station |
| Contact Name | Text | No | Contact person |
| Email | Email | No | Contact email |
| Phone | Text | No | Contact phone |
| Valid From | Date | No | Agreement start date |
| Valid Till | Date | No | Agreement end date |
| Bank Details | Group | No | Account, Bank, Branch, Swift, Routing |
| Status | Toggle | Yes | Active / Inactive |

---

#### 4.1.3 Service List
**Path**: `/management/ground-handling/services/list`

**Database Table**: `gh_services`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Service Name | Text | Yes | Service name |
| Service Code | Text | No | Unique service code |
| Supplier Type | Select | Yes | Ground Handling / Fuel / etc. |
| Unit of Measurement | Select | Yes | Per flight / Per PAX / Per Kg / etc. |
| Description | Text | No | Service description |
| Status | Toggle | Yes | Active / Inactive |

**Business Rules**:
- Services can be linked to Criteria via the `gh_service_criteria` junction table.

---

#### 4.1.4 Criteria List
**Path**: `/management/ground-handling/criteria/list`

**Database Table**: `gh_criteria`

**Purpose**: Define pricing criteria for ground handling services (e.g., aircraft type, flight type, season).

---

#### 4.1.5 Aircraft Setup
**Path**: `/management/ground-handling/aircraft-setup`

**Purpose**: Maintain aircraft type master data (type, registration, capacity).

---

#### 4.1.6 Route Setup
**Path**: `/management/ground-handling/route-setup`

**Purpose**: Define flight routes (origin-destination pairs, frequency).

---

#### 4.1.7 Agreements

##### Station Wise Agreement
**Path**: `/management/ground-handling/agreements/station-wise`

**Purpose**: Create and manage service agreements with suppliers at specific stations. Includes pricing rules and service terms.

##### Agreement Comparison
**Path**: `/management/ground-handling/agreements/comparison`

**Purpose**: Compare agreements across suppliers/stations for cost optimization.

##### Terms and Conditions
**Path**: `/management/ground-handling/agreements/terms`

**Purpose**: Manage standard terms and conditions for agreements.

---

### 4.2 Operations

#### 4.2.1 Journey Log
**Path**: `/management/ground-handling/flight-ops/journey-log`

**Purpose**: Record flight operation details (departure, arrival, delays, PAX count).

---

#### 4.2.2 Service Data Entry
**Path**: `/management/ground-handling/flight-ops/service-data`

**Purpose**: Record actual ground handling services consumed per flight.

---

#### 4.2.3 Invoice Management

##### Forecasted Costing
**Path**: `/management/ground-handling/invoice/forecasted-costing`

**Purpose**: Calculate expected costs based on agreements and actual service data.

##### Add Invoice
**Path**: `/management/ground-handling/invoice/add`

**Purpose**: Enter supplier invoices for ground handling services.

##### Invoice List
**Path**: `/management/ground-handling/invoice/list`

**Purpose**: View and manage all invoices.

##### Invoice Reconciliation
**Path**: `/management/ground-handling/invoice/reconciliation`

**Purpose**: Compare forecasted costs vs actual invoice amounts; identify and resolve discrepancies.

---

### 4.3 Reports

#### 4.3.1 Ground Handling Dashboard
**Path**: `/management/ground-handling/reports/dashboard`

**Purpose**: Overview dashboard with key metrics, charts, and KPIs for ground handling operations.

#### 4.3.2 Station Wise Report
**Path**: `/management/ground-handling/reports/station-wise`

**Purpose**: Cost and service analysis grouped by station.

#### 4.3.3 Service Utilization Report
**Path**: `/management/ground-handling/reports/service-utilization`

**Purpose**: Analysis of service usage patterns and costs.

#### 4.3.4 Reconciliation Report
**Path**: `/management/ground-handling/reports/reconciliation`

**Purpose**: Summary of invoice reconciliation results.

---

## 5. Module 3: Fixed Asset Management

### 5.1 General Setup

#### 5.1.1 Asset Group Setup
**Path**: `/management/fixed-asset/asset-group`

**Purpose**: Define asset categories in a hierarchical tree structure (e.g., Land → Building → Vehicle → Equipment).

#### 5.1.2 Value Adjustment Rules
**Path**: `/management/fixed-asset/value-adjustment-rules`

**Purpose**: Configure depreciation methods, rates, and useful life for each asset group.

**Depreciation Methods**: Straight Line, Declining Balance, Units of Production.

#### 5.1.3 Employee Directory
**Path**: `/management/fixed-asset/employee-directory`

**Purpose**: Maintain employee records for asset allocation purposes.

#### 5.1.4 Data Upload
**Path**: `/management/fixed-asset/data-upload`

**Purpose**: Bulk import of asset data from external sources.

#### 5.1.5 Recon GL Mapping
**Path**: `/management/fixed-asset/recon-gl-mapping`

**Purpose**: Map asset groups to corresponding GL accounts for automatic journal posting.

---

### 5.2 Asset Management (Lifecycle)

#### 5.2.1 Asset Registration
**Path**: `/management/fixed-asset/registration`

**Purpose**: Register new assets with detailed financial and physical information.

| Key Fields | Description |
|------------|-------------|
| Asset Code | Unique identifier |
| Asset Name | Description |
| Asset Group | Category from tree hierarchy |
| Acquisition Date | Purchase date |
| Acquisition Cost | Original cost |
| Useful Life | Expected life (years/months) |
| Salvage Value | Residual value |
| Location/Branch | Physical location |
| Vendor | Supplier information |

---

#### 5.2.2 Asset Allocation
**Path**: `/management/fixed-asset/allocation`

**Purpose**: Assign assets to employees, departments, or locations.

#### 5.2.3 Depreciation & Amortization
**Path**: `/management/fixed-asset/depreciation`

**Purpose**: Run depreciation calculations and post journal entries.

**Business Rules**:
- Depreciation calculated based on Value Adjustment Rules.
- Automatic GL posting via Recon GL Mapping.
- Period-based processing.

#### 5.2.4 Asset Disposal
**Path**: `/management/fixed-asset/disposal`

**Purpose**: Record asset disposals (sale, write-off, donation).

**Business Rules**:
- Calculates gain/loss on disposal.
- Posts closing journal entries.
- Updates asset status.

#### 5.2.5 Asset Revaluation
**Path**: `/management/fixed-asset/revaluation`

**Purpose**: Adjust asset book values to fair market value.

#### 5.2.6 Asset Renovation
**Path**: `/management/fixed-asset/renovation`

**Purpose**: Record capital improvements that increase asset value or useful life.

#### 5.2.7 Asset Maintenance
**Path**: `/management/fixed-asset/maintenance`

**Purpose**: Track maintenance activities and costs.

#### 5.2.8 Asset Transfer
**Path**: `/management/fixed-asset/transfer`

**Purpose**: Transfer assets between branches, departments, or employees.

---

### 5.3 Reports

| Report | Path | Purpose |
|--------|------|---------|
| Asset Details Report | `/fixed-asset/reports/details` | Complete asset register with current values |
| Allocation Report | `/fixed-asset/reports/allocation` | Current asset-to-employee/dept assignments |
| Asset Schedule Report | `/fixed-asset/reports/schedule` | Fiscal year summary: opening, additions, depreciation, disposals, closing |
| Disposal Report | `/fixed-asset/reports/disposal` | All disposed assets with gain/loss details |
| Maintenance Report | `/fixed-asset/reports/maintenance` | Maintenance history and cost analysis |

---

## 6. Module 4: Admin Portal

### 6.1 System Setup

| Component | Purpose |
|-----------|---------|
| Module | Define system modules |
| Submodule | Define module sub-divisions |
| Menu | Configure navigation menus |
| Menu Action | Define available actions per menu |

### 6.2 User Management

#### 6.2.1 User Branch Mapping
**Path**: `/management/admin/user-branch-mapping`

**Purpose**: Assign users to branches with specific access levels.

| Field | Description |
|-------|-------------|
| User | Select from user list |
| Branch | Target branch |
| Access Level | Full / Read-only / Restricted |
| Status | Active / Inactive |

**Business Rules**:
- Users can be mapped to multiple branches.
- Access level determines operation permissions.
- Admin users can manage other users' mappings.

---

## 7. Cross-Cutting Concerns

### 7.1 Audit Logging
**Database Table**: `audit_logs`

All significant operations are logged with:
- Action type (CREATE, UPDATE, DELETE)
- Table/module affected
- Old and new data (JSON)
- User who made the change
- Timestamp
- IP address and user agent

**RLS**: Authenticated users can insert and view logs. No UPDATE or DELETE allowed.

### 7.2 Period Locking
- Custom hook `usePeriodLock` enforces period-based transaction restrictions.
- Locked periods prevent any data modification.

### 7.3 GL Search Dialog
- Reusable `GLSearchDialog` component used across all pages requiring GL selection.
- Search button must be positioned immediately adjacent to the GL Code input field (consistent UI pattern).

### 7.4 Branch Selector
- Global branch selector in the header.
- All data operations are branch-scoped.
- Consolidated view aggregates data from all branches.

### 7.5 Currency Handling
- Multi-currency support throughout the system.
- Automatic conversion using daily rates.
- Amount-in-words conversion for financial accuracy.

---

## 8. Non-Functional Requirements

### 8.1 Performance
- Page load time < 3 seconds
- Report generation < 5 seconds for standard reports
- Support 100+ concurrent users

### 8.2 Security
- Row-Level Security (RLS) on all database tables
- Role-based access control
- Audit trail for all data modifications
- Session management with automatic timeout

### 8.3 Usability
- Responsive layout (desktop-first, min-width 1024px)
- Consistent UI patterns across all modules
- Sidebar navigation with collapsible menus
- Toast notifications for user feedback
- Keyboard-friendly form navigation

### 8.4 Data Integrity
- Foreign key constraints on related tables
- Validation triggers (not CHECK constraints) for time-based validations
- Double-entry bookkeeping enforcement (debits = credits)
- Period locking to prevent retroactive modifications

### 8.5 Scalability
- Database-backed storage via Lovable Cloud
- Modular architecture supporting additional portals
- Configurable business rules via Policy Setup

---

## Appendix A: Database Schema

### Current Tables
| Table | Module | Purpose |
|-------|--------|---------|
| `audit_logs` | System | Audit trail |
| `gh_stations` | Ground Handling | Station master |
| `gh_suppliers` | Ground Handling | Supplier master |
| `gh_services` | Ground Handling | Service master |
| `gh_criteria` | Ground Handling | Pricing criteria |
| `gh_service_criteria` | Ground Handling | Service-Criteria junction |

### Appendix B: Route Map

| Route Pattern | Module |
|---------------|--------|
| `/management/*` | Management Accounting |
| `/tax/*` | Tax Accounting |
| `/management/ground-handling/*` | Ground Handling |
| `/management/fixed-asset/*` | Fixed Asset |
| `/management/admin/*` | Admin Portal |

---

*Document generated from system codebase analysis on March 8, 2026.*
*Version 1.0 – Subject to updates as system evolves.*
