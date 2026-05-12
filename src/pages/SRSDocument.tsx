import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Printer, Download } from 'lucide-react';

interface RSDEntry {
  srsId: string;
  title: string;
  proposedRequirement: string[];
  precondition: string[];
  businessRules: string;
  postCondition: string[];
  acceptanceCriteria: string[];
  priority: string;
}

function RSDTable({ entry }: { entry: RSDEntry }) {
  return (
    <table className="w-full border-collapse border border-black mb-8 text-sm" style={{ pageBreakInside: 'avoid' }}>
      <tbody>
        <tr>
          <td className="border border-black p-2 font-bold w-[200px] align-top bg-gray-50">SRS ID</td>
          <td className="border border-black p-2">{entry.srsId}</td>
        </tr>
        <tr>
          <td className="border border-black p-2 font-bold align-top bg-gray-50">SRS Title</td>
          <td className="border border-black p-2">{entry.title}</td>
        </tr>
        <tr>
          <td className="border border-black p-2 font-bold align-top bg-gray-50">Proposed Requirement</td>
          <td className="border border-black p-2">
            <ol className="list-decimal ml-4 space-y-1">
              {entry.proposedRequirement.map((r, i) => <li key={i}>{r}</li>)}
            </ol>
          </td>
        </tr>
        <tr>
          <td className="border border-black p-2 font-bold align-top bg-gray-50">Precondition</td>
          <td className="border border-black p-2">
            <ol className="list-decimal ml-4 space-y-1">
              {entry.precondition.map((r, i) => <li key={i}>{r}</li>)}
            </ol>
          </td>
        </tr>
        <tr>
          <td className="border border-black p-2 font-bold align-top bg-gray-50">Business Rules</td>
          <td className="border border-black p-2 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: entry.businessRules }} />
        </tr>
        <tr>
          <td className="border border-black p-2 font-bold align-top bg-gray-50">Post-Condition</td>
          <td className="border border-black p-2">
            <ol className="list-decimal ml-4 space-y-1">
              {entry.postCondition.map((r, i) => <li key={i}>{r}</li>)}
            </ol>
          </td>
        </tr>
        <tr>
          <td className="border border-black p-2 font-bold align-top bg-gray-50">Acceptance Criteria</td>
          <td className="border border-black p-2">
            <ol className="list-decimal ml-4 space-y-1">
              {entry.acceptanceCriteria.map((r, i) => <li key={i}>{r}</li>)}
            </ol>
          </td>
        </tr>
        <tr>
          <td className="border border-black p-2 font-bold align-top bg-gray-50">Requirement Collection Method</td>
          <td className="border border-black p-2">Accounting & Operations system analysis.</td>
        </tr>
        <tr>
          <td className="border border-black p-2 font-bold align-top bg-gray-50">Priority</td>
          <td className="border border-black p-2">{entry.priority}</td>
        </tr>
      </tbody>
    </table>
  );
}

// ============ ALL RSD DATA ============

const centralConfigRSDs: RSDEntry[] = [
  {
    srsId: 'SRS-CC-1.1',
    title: 'Branch Setup',
    proposedRequirement: [
      'Users will be able to view the branch list with all branch information.',
      'Users will be able to create and save new branches from here.',
      'Users will be able to search / partially search branch information based on filtering criteria.',
      'Users will be able to edit existing branch information.',
    ],
    precondition: [
      'The user must have a valid user ID and Password to login into the system.',
      'The user must have permission for this function and access this UI.',
      'Authorized users must have access permission to access this UI and feature.',
    ],
    businessRules: `<b>1. Branch List</b>
<ol type="a" style="margin-left:20px">
  <li>On coming to this UI, system will show the branch list with the below data:
    <ol type="i" style="margin-left:20px">
      <li>SL No</li>
      <li>Branch Name</li>
      <li>Branch Code</li>
      <li>Contact Person Name</li>
      <li>Contact Person Email</li>
      <li>Base Currency</li>
      <li>Status (Active/Inactive)</li>
    </ol>
  </li>
  <li>Search by: Users will be able to search / partially search data based on Branch Name, Branch Code, Status.</li>
  <li>By default, the system will show 20 rows in the list. User will be able to paginate.</li>
  <li>Action options: Active, Inactive, Delete.</li>
  <li>System will not allow deletion of a branch that has active GL mappings, transactions, or user mappings.</li>
</ol>
<b>2. Branch Setup Form</b>
<ol type="a" style="margin-left:20px">
  <li>Branch Name - Required, text input.</li>
  <li>Branch Code - Required, unique alphanumeric code (max 10 characters).</li>
  <li>Contact Person Name - Required.</li>
  <li>Contact Person Email - Required, valid email format.</li>
  <li>Base Currency - Required, selected from Currency master list.</li>
  <li>Status - Toggle, default Active.</li>
  <li>A special "Consolidated" branch (code: CONS) is system-generated and cannot be modified or deleted. It provides aggregated views across all branches.</li>
</ol>`,
    postCondition: [
      'New branch will be available for GL mapping, user mapping, and operations.',
      'Inactive branches will not appear in operational dropdowns.',
    ],
    acceptanceCriteria: [
      'Authorized users will be able to view the branch list.',
      'Authorized users will be able to create new branches successfully.',
      'Branch code uniqueness is enforced.',
      'Consolidated branch cannot be edited or deleted.',
    ],
    priority: 'High',
  },
  {
    srsId: 'SRS-CC-1.2',
    title: 'Currency Setup',
    proposedRequirement: [
      'Users will be able to view the list of all currencies configured in the system.',
      'Users will be able to add new currencies.',
      'Users will be able to edit or deactivate existing currencies.',
    ],
    precondition: [
      'The user must have a valid user ID and Password to login into the system.',
      'The user must have permission for this function and access this UI.',
    ],
    businessRules: `<b>1. Currency List</b>
<ol type="a" style="margin-left:20px">
  <li>System will show: SL No, Currency Code (ISO 4217), Currency Name, Symbol, Status.</li>
  <li>Search by Currency Code, Currency Name, Status.</li>
  <li>Action: Active, Inactive.</li>
  <li>System will not allow deactivation of a currency that is set as base currency for any active branch.</li>
</ol>
<b>2. Currency Setup Form</b>
<ol type="a" style="margin-left:20px">
  <li>Currency Code - Required, ISO 4217 standard (e.g., BDT, USD, SGD, INR).</li>
  <li>Currency Name - Required.</li>
  <li>Symbol - Optional.</li>
  <li>Status - Toggle, default Active.</li>
  <li>BDT (Bangladeshi Taka) is the default system base currency.</li>
</ol>`,
    postCondition: [
      'New currency will be available for branch setup and rate configuration.',
      'Inactive currencies will not appear in transaction screens.',
    ],
    acceptanceCriteria: [
      'Authorized users can add currencies with valid ISO codes.',
      'Duplicate currency codes are rejected.',
      'Currencies linked to active branches cannot be deactivated.',
    ],
    priority: 'High',
  },
  {
    srsId: 'SRS-CC-1.3',
    title: 'Daily Rate Setup',
    proposedRequirement: [
      'Users will be able to view exchange rate history.',
      'Users will be able to set daily exchange rates between currencies.',
      'This replaces the separate IATA Rate Setup and Bank Rate Setup modules.',
    ],
    precondition: [
      'At least two currencies must be configured in the system.',
      'The user must have permission for rate configuration.',
    ],
    businessRules: `<b>1. Rate List</b>
<ol type="a" style="margin-left:20px">
  <li>System will show: Branch Code, Base Currency, Rate to BDT, Rate to USD, Conversion Date, Created By.</li>
  <li>Rates are branch-specific - each branch maintains its own exchange rates.</li>
  <li>Search by Branch, Date Range, Currency.</li>
</ol>
<b>2. Rate Setup Form</b>
<ol type="a" style="margin-left:20px">
  <li>Branch Code - Required, selected from branch list.</li>
  <li>Base Currency - Auto-populated from branch setup.</li>
  <li>Rate to BDT - Required, numeric with up to 6 decimal places.</li>
  <li>Rate to USD - Required, numeric with up to 6 decimal places.</li>
  <li>Conversion Date - Required, date picker (DD-MM-YYYY).</li>
  <li>Historical rates are preserved for audit trail and cannot be deleted.</li>
  <li>Only one rate per branch per date is allowed.</li>
</ol>`,
    postCondition: [
      'Exchange rates will be available for multi-currency transactions.',
      'Historical rates are preserved for reporting.',
    ],
    acceptanceCriteria: [
      'Rates can be set per branch per date.',
      'Duplicate date entries for same branch are rejected.',
      'Historical rates cannot be modified after use in transactions.',
    ],
    priority: 'High',
  },
  {
    srsId: 'SRS-CC-1.4',
    title: 'FCY Exchange GL Setup',
    proposedRequirement: [
      'Users will be able to map GL accounts for foreign currency exchange gain/loss recording.',
      'Users will be able to view and edit existing FCY GL mappings.',
    ],
    precondition: [
      'GL accounts must be configured in the system.',
      'Multiple currencies must be active.',
    ],
    businessRules: `<b>1. FCY Exchange GL Mapping</b>
<ol type="a" style="margin-left:20px">
  <li>Map specific GL accounts to handle realized foreign exchange gains.</li>
  <li>Map specific GL accounts to handle realized foreign exchange losses.</li>
  <li>Map specific GL accounts to handle unrealized foreign exchange gains.</li>
  <li>Map specific GL accounts to handle unrealized foreign exchange losses.</li>
  <li>GL search dialog is used for account selection - search button must be adjacent to GL Code field.</li>
  <li>Required for multi-currency transaction processing.</li>
</ol>`,
    postCondition: [
      'FCY gain/loss will be automatically posted to mapped GL accounts during currency conversion.',
    ],
    acceptanceCriteria: [
      'FCY GL mappings can be created and saved.',
      'GL search works correctly with adjacent search button.',
    ],
    priority: 'High',
  },
  {
    srsId: 'SRS-CC-1.5',
    title: 'Inter Branch Reconciliation Mapping',
    proposedRequirement: [
      'Users will be able to define GL account pairs for inter-branch reconciliation.',
      'Users will be able to view and manage existing inter-branch GL mappings.',
    ],
    precondition: [
      'At least two branches must be configured.',
      'GL accounts must be mapped to respective branches.',
    ],
    businessRules: `<b>1. Inter Branch Recon Mapping</b>
<ol type="a" style="margin-left:20px">
  <li>Map corresponding GL accounts between two branches for inter-branch transactions.</li>
  <li>Source Branch + Source GL → Destination Branch + Destination GL.</li>
  <li>Enables automated reconciliation of inter-branch balances.</li>
  <li>Each mapping must have a unique source-destination pair.</li>
  <li>Both source and destination GL accounts must be active.</li>
</ol>`,
    postCondition: [
      'Inter-branch transactions will auto-reconcile based on mapped GL pairs.',
    ],
    acceptanceCriteria: [
      'Mappings can be created between two different branches.',
      'Duplicate source-destination pairs are rejected.',
      'Only active GL accounts can be selected.',
    ],
    priority: 'Medium',
  },
  {
    srsId: 'SRS-CC-1.6',
    title: 'Airport / Station Setup',
    proposedRequirement: [
      'Users will be able to maintain airport and station master data.',
      'Users will be able to view, add, edit, and deactivate stations.',
    ],
    precondition: [
      'The user must have permission for master setup.',
    ],
    businessRules: `<b>1. Station List</b>
<ol type="a" style="margin-left:20px">
  <li>System shows: SL No, Station Name, IATA Code, City, Country, Status.</li>
  <li>Search by Station Name, IATA Code, City, Country.</li>
</ol>
<b>2. Station Setup Form</b>
<ol type="a" style="margin-left:20px">
  <li>Station Name - Required.</li>
  <li>IATA Code - Required, 3-letter code, unique.</li>
  <li>City - Required.</li>
  <li>Country - Required.</li>
  <li>Status - Toggle, default Active.</li>
</ol>`,
    postCondition: [
      'Stations will be available for ticket sales and POS setup.',
    ],
    acceptanceCriteria: [
      'Stations can be added with unique IATA codes.',
      'Station data appears in dependent dropdowns.',
    ],
    priority: 'Medium',
  },
  {
    srsId: 'SRS-CC-1.7',
    title: 'Point of Sale (POS) Setup',
    proposedRequirement: [
      'Users will be able to configure POS terminals for ticket sales.',
      'Users will be able to view, add, edit POS configurations.',
    ],
    precondition: [
      'Airport/Station setup must be completed.',
      'Branch setup must be completed.',
    ],
    businessRules: `<b>1. POS Configuration</b>
<ol type="a" style="margin-left:20px">
  <li>POS linked to specific branch and station.</li>
  <li>POS ID - Required, unique identifier.</li>
  <li>POS Name - Required.</li>
  <li>Linked Branch - Required, from branch master.</li>
  <li>Linked Station - Required, from station master.</li>
  <li>Status - Toggle, default Active.</li>
</ol>`,
    postCondition: [
      'POS terminals will be available for ticket sales transactions.',
    ],
    acceptanceCriteria: [
      'POS can be configured and linked to branch and station.',
    ],
    priority: 'Medium',
  },
  {
    srsId: 'SRS-CC-1.8',
    title: 'Policy Setup (Internal Controls)',
    proposedRequirement: [
      'Users will be able to configure internal control policies across branches.',
      'Users will be able to toggle policies as Allowed/Not Allowed per branch.',
    ],
    precondition: [
      'Branches must be configured in the system.',
      'User must have admin-level access.',
    ],
    businessRules: `<b>1. Policy Configuration</b>
<ol type="a" style="margin-left:20px">
  <li>Available Policies:
    <ol type="i" style="margin-left:20px">
      <li><b>Same Person Maker Checker</b> - Controls whether one user can both create and authorize the same transaction.</li>
      <li><b>Back Date Transaction</b> - Allows/disallows transactions with past dates.</li>
      <li><b>Holiday Transaction</b> - Allows/disallows transactions on holidays/weekends.</li>
    </ol>
  </li>
  <li>Each policy has an <b>Allowed</b> toggle (Yes/No).</li>
  <li>Policies are mapped to one or more specific branches.</li>
  <li>Policy enforcement is system-wide and cannot be overridden at user level.</li>
  <li>Changes to policies are logged in the audit trail.</li>
</ol>`,
    postCondition: [
      'Configured policies will be enforced during voucher entry and transaction processing.',
      'Policy violations will show error messages to users.',
    ],
    acceptanceCriteria: [
      'Policies can be toggled per branch.',
      'Policy enforcement works during voucher entry.',
      'Audit log captures policy changes.',
    ],
    priority: 'High',
  },
  {
    srsId: 'SRS-CC-1.9',
    title: 'Period Setup',
    proposedRequirement: [
      'Users will be able to define fiscal periods for financial reporting.',
      'Users will be able to open, close, or lock periods.',
    ],
    precondition: [
      'The user must have admin-level access.',
    ],
    businessRules: `<b>1. Period Management</b>
<ol type="a" style="margin-left:20px">
  <li>Define fiscal periods (monthly/quarterly/custom).</li>
  <li>Period states: Open, Closed, Locked.</li>
  <li><b>Open</b> - Transactions can be entered.</li>
  <li><b>Closed</b> - No new transactions, but can be reopened by admin.</li>
  <li><b>Locked</b> - Permanently locked, no modifications allowed.</li>
  <li>Period closing generates trial balance snapshots.</li>
  <li>Locked periods prevent any transaction entry or modification.</li>
</ol>`,
    postCondition: [
      'Only open periods will accept new transactions.',
      'Locked periods are permanently sealed.',
    ],
    acceptanceCriteria: [
      'Periods can be created and status changed.',
      'Transactions are blocked in closed/locked periods.',
      'Trial balance snapshot is generated on period close.',
    ],
    priority: 'High',
  },
];

const glSetupRSDs: RSDEntry[] = [
  {
    srsId: 'SRS-GL-2.1',
    title: 'Parent GL Setup',
    proposedRequirement: [
      'Users will be able to view the parent GL list.',
      'Users will be able to create and save parent-level GL codes.',
      'Users will be able to search / partially search parent GL information.',
    ],
    precondition: [
      'The user must have a valid user ID and Password to login into the system.',
      'The user must have permission for GL setup.',
    ],
    businessRules: `<b>1. Parent GL List</b>
<ol type="a" style="margin-left:20px">
  <li>System will show: SL No, Parent GL Code, Parent GL Name, GL Type, Status.</li>
  <li>Search by Parent GL Code, Parent GL Name, GL Type, Status.</li>
  <li>On clicking a row, system loads data in editable mode.</li>
  <li>Action: Active, Inactive, Delete (only if no child GLs exist).</li>
</ol>
<b>2. Parent GL Setup Form</b>
<ol type="a" style="margin-left:20px">
  <li>Parent GL Code - Required, unique hierarchical code.</li>
  <li>Parent GL Name - Required.</li>
  <li>GL Type - Required, select from: Asset, Liability, Equity, Revenue, Expense.</li>
  <li>Account Classification - Bank, Cash, or Other.</li>
  <li>Status - Toggle, default Active.</li>
  <li>Simplified structure: T-Acc Server, Ledger Scope, and Currency fields have been removed.</li>
</ol>`,
    postCondition: [
      'Parent GL codes will be available for child (subsidiary) GL creation.',
      'Chart of Accounts hierarchy will reflect new parent GLs.',
    ],
    acceptanceCriteria: [
      'Parent GL codes can be created with unique codes.',
      'Parent GL cannot be deleted if child GLs exist.',
      'GL Type is correctly classified.',
    ],
    priority: 'High',
  },
  {
    srsId: 'SRS-GL-2.2',
    title: 'General Ledger (Subsidiary GL) Setup',
    proposedRequirement: [
      'Users will be able to view the subsidiary GL list.',
      'Users will be able to create, edit, and manage subsidiary GL accounts.',
      'Users will be able to search / partially search GL information.',
    ],
    precondition: [
      'Parent GL must be configured.',
      'Currency must be configured.',
    ],
    businessRules: `<b>1. GL List</b>
<ol type="a" style="margin-left:20px">
  <li>System will show: SL No, GL Code, GL Name, GL Type, Currency, Parent GL, Recon GL, Branch Consolidation, Ledger Scope, Status.</li>
  <li>Search by GL Code, GL Name, GL Type, Status.</li>
  <li>On clicking a row, system loads data in editable mode.</li>
</ol>
<b>2. GL Setup Form</b>
<ol type="a" style="margin-left:20px">
  <li>GL Code - Required, unique code.</li>
  <li>GL Name - Required.</li>
  <li>GL Type - Auto-populated from Parent GL (Asset/Liability/Equity/Revenue/Expense).</li>
  <li>Currency - Required, from currency master.</li>
  <li>Parent GL Code - Required, searchable dropdown with search button adjacent to input field.</li>
  <li>Is Reconciliation GL - Toggle (Yes/No).</li>
  <li>Recon GL For - Conditional (Bank/Cash), visible only when Is Recon GL = Yes.</li>
  <li>Branch Consolidation - Required, select from:
    <ol type="i" style="margin-left:20px">
      <li><b>All</b> - Available in all branches.</li>
      <li><b>Unique</b> - Branch-specific, only in mapped branches.</li>
      <li><b>Consolidate</b> - Only in consolidated view.</li>
    </ol>
  </li>
  <li>Ledger Scope - Required, select from:
    <ol type="i" style="margin-left:20px">
      <li><b>Management</b> - Only visible in Management Accounting mode.</li>
      <li><b>Tax</b> - Only visible in Tax Accounting mode.</li>
      <li><b>Both</b> - Visible in both modes.</li>
    </ol>
  </li>
  <li>Status - Toggle, default Active.</li>
</ol>`,
    postCondition: [
      'GL accounts will be available for branch mapping and voucher entry.',
      'Ledger scope filtering will apply in respective accounting modes.',
    ],
    acceptanceCriteria: [
      'GL codes are unique.',
      'Recon GL For field only shows when Is Recon GL = Yes.',
      'Ledger scope correctly filters GLs in Management vs Tax mode.',
      'Parent GL search button is adjacent to input field.',
    ],
    priority: 'High',
  },
  {
    srsId: 'SRS-GL-2.3',
    title: 'Branch Wise GL Code Mapping',
    proposedRequirement: [
      'Users will be able to map GL accounts to specific branches.',
      'A single GL can be mapped to multiple branches simultaneously through a staging table.',
      'Users will be able to view and manage existing GL-branch mappings.',
    ],
    precondition: [
      'GL accounts must be configured.',
      'Branches must be configured.',
    ],
    businessRules: `<b>1. GL Branch Mapping List</b>
<ol type="a" style="margin-left:20px">
  <li>System will show: SL No, GL Code, GL Name, Currency, Branch Code, Branch Name, Status, Auto Transaction, Has Transaction.</li>
  <li>Search by GL Code, GL Name, Branch.</li>
</ol>
<b>2. Mapping Form</b>
<ol type="a" style="margin-left:20px">
  <li>GL Code - Required, with search button <b>immediately adjacent</b> to the input field (not far away).</li>
  <li>GL Name - Auto-populated from GL master.</li>
  <li>Currency - Display only, from GL master.</li>
  <li>Branch - Multi-select dropdown for mapping one GL to multiple branches.</li>
  <li>Status - Toggle, default Active.</li>
  <li>Auto Transaction - Toggle, allows automatic postings.</li>
  <li>Mapping status can be toggled without deletion.</li>
  <li>System will not allow deletion of a mapping that has transactions.</li>
</ol>`,
    postCondition: [
      'Mapped GL accounts will appear in voucher entry for the respective branches.',
      'Unmapped GL accounts will not be available for transaction entry in that branch.',
    ],
    acceptanceCriteria: [
      'GL can be mapped to multiple branches at once.',
      'Search button is adjacent to GL Code input.',
      'Mappings with transactions cannot be deleted.',
    ],
    priority: 'High',
  },
  {
    srsId: 'SRS-GL-2.4',
    title: 'Chart of Accounts',
    proposedRequirement: [
      'Users will be able to view the complete account structure in a hierarchical tree view.',
      'Users will be able to filter by visibility logic.',
    ],
    precondition: [
      'Parent GL and Subsidiary GL must be configured.',
    ],
    businessRules: `<b>1. Chart of Accounts Tree View</b>
<ol type="a" style="margin-left:20px">
  <li>Displays hierarchical structure: GL Type → Parent GL → Subsidiary GL.</li>
  <li>Expandable/collapsible tree nodes.</li>
  <li>Visibility filter options:
    <ol type="i" style="margin-left:20px">
      <li><b>Consolidate</b> - Shows only consolidated GLs.</li>
      <li><b>All</b> - Shows all GLs.</li>
      <li><b>Branch Wise</b> - Shows GLs mapped to selected branch.</li>
    </ol>
  </li>
  <li>Displays Reconciliation GL mappings based on Party Types.</li>
  <li>This is a <b>read-only</b> view. Modifications are done through GL Setup pages.</li>
  <li>Search/filter by GL Code, GL Name, GL Type.</li>
</ol>`,
    postCondition: [
      'Users can view the full account hierarchy.',
    ],
    acceptanceCriteria: [
      'Tree view correctly reflects Parent-Child GL hierarchy.',
      'Visibility filters work correctly.',
      'No edit functionality available on this page.',
    ],
    priority: 'Medium',
  },
  {
    srsId: 'SRS-GL-2.5',
    title: 'Voucher Type wise GL Mapping',
    proposedRequirement: [
      'Users will be able to map GL accounts to voucher types.',
      'Users will be able to control which GL accounts appear for specific voucher types.',
    ],
    precondition: [
      'GL accounts must be configured.',
      'GL accounts must be mapped to branches.',
    ],
    businessRules: `<b>1. Voucher Type GL Mapping List</b>
<ol type="a" style="margin-left:20px">
  <li>System will show: GL Code, GL Name, Voucher Type, Affects Tax Accounting, Status.</li>
  <li>Filter by Voucher Type, GL Code, Status.</li>
</ol>
<b>2. Mapping Form</b>
<ol type="a" style="margin-left:20px">
  <li>GL Code - Required, searchable.</li>
  <li>GL Name - Auto-populated.</li>
  <li>Voucher Type - Required, select from: Payment, Receipt, Journal, Contra.</li>
  <li>Affects Tax Accounting - Toggle (Yes/No). Determines visibility in Tax mode.</li>
  <li>Status - Toggle.</li>
  <li>Multiple GL accounts can be mapped to a single voucher type.</li>
  <li>Branch-based filtering controls which accounts are available for specific transaction types.</li>
</ol>`,
    postCondition: [
      'Only mapped GL accounts will appear in voucher entry for the selected voucher type.',
      'Tax mode will only show mappings where Affects Tax Accounting = Yes.',
    ],
    acceptanceCriteria: [
      'GL-voucher type mapping can be created.',
      'Tax filtering works correctly.',
      'Voucher entry only shows mapped GLs.',
    ],
    priority: 'High',
  },
];

const partyManagementRSDs: RSDEntry[] = [
  {
    srsId: 'SRS-PM-3.1',
    title: 'Party Type Setup',
    proposedRequirement: [
      'Users will be able to define party types (Customer, Supplier, Employee).',
      'Users will be able to link party types to Control Account GL accounts.',
    ],
    precondition: [
      'GL accounts must be configured.',
    ],
    businessRules: `<b>1. Party Type Configuration</b>
<ol type="a" style="margin-left:20px">
  <li>Party Type Name - Required (e.g., Customer, Supplier, Employee).</li>
  <li>Control Account GL - Searchable dropdown to select GL accounts.</li>
  <li>Selected GL is added to a linked list displayed below the dropdown.</li>
  <li>Each linked GL shows an 'X' removal button.</li>
  <li>UI uses a <b>dropdown-and-list interface</b> (not checkboxes).</li>
  <li>Multiple GL accounts can be linked to one Party Type.</li>
  <li>Status - Toggle, default Active.</li>
</ol>`,
    postCondition: [
      'Party Types will be available for party creation.',
      'Linked GL accounts will auto-populate when adding parties.',
    ],
    acceptanceCriteria: [
      'Party types can be created with linked Control Account GLs.',
      'GL dropdown-and-list interface works correctly.',
      'X button removes linked GLs.',
    ],
    priority: 'High',
  },
  {
    srsId: 'SRS-PM-3.2',
    title: 'Party List & Party Add',
    proposedRequirement: [
      'Users will be able to view all parties in a consolidated interface with categorized tabs.',
      'Users will be able to add new parties (Customers, Suppliers, Employees).',
    ],
    precondition: [
      'Party Types must be configured.',
      'Control Account GLs must be linked to Party Types.',
    ],
    businessRules: `<b>1. Party List</b>
<ol type="a" style="margin-left:20px">
  <li>Consolidated view with tabs: All, Customers, Suppliers, Employees.</li>
  <li>Columns: SL No, Party Name, Party Type, Linked GL Accounts, Status.</li>
  <li>Search by Party Name, Party Type, Status.</li>
  <li>Click on row to edit party details.</li>
</ol>
<b>2. Party Add Form</b>
<ol type="a" style="margin-left:20px">
  <li>Party Type - Required, from Party Type master.</li>
  <li>Party Name - Required.</li>
  <li>Contact Info - Phone, Email, Address (optional).</li>
  <li>Linked GL Accounts - Auto-populated from Party Type configuration but can be <b>manually overridden</b>.</li>
  <li>Status - Toggle, default Active.</li>
</ol>
<b>3. Voucher Entry Integration</b>
<ol type="a" style="margin-left:20px">
  <li>In voucher entry, Account Name selector shows consolidated format: <b>"GL Name - Party Type - Party Name"</b></li>
  <li>Example: "Adv.-Employee-Mahmudul"</li>
  <li>This enables SubGL transaction management.</li>
</ol>`,
    postCondition: [
      'Parties will be available in voucher entry account selector.',
      'Account Name will show in consolidated GL-PartyType-PartyName format.',
    ],
    acceptanceCriteria: [
      'Parties can be created with auto-populated GLs from Party Type.',
      'GL override works correctly.',
      'Voucher entry shows correct consolidated account name format.',
    ],
    priority: 'High',
  },
];

const operationsRSDs: RSDEntry[] = [
  {
    srsId: 'SRS-OP-4.1',
    title: 'Voucher Entry',
    proposedRequirement: [
      'Users will be able to create financial transactions (vouchers).',
      'Users will be able to enter multi-line debit/credit entries.',
      'Users will be able to exclude vouchers from Tax Accounting.',
    ],
    precondition: [
      'GL accounts must be configured and mapped to branches.',
      'Voucher Type GL mapping must be configured.',
      'The period must be open for the transaction date.',
      'Policy configurations must be set.',
    ],
    businessRules: `<b>1. Voucher Entry Form</b>
<ol type="a" style="margin-left:20px">
  <li>Voucher Type - Required, select from: Payment, Receipt, Journal, Contra.</li>
  <li>Voucher Date - Required, date picker. Subject to Back Date Transaction policy.</li>
  <li>Voucher Number - Auto-generated by system.</li>
  <li>Branch - Current branch (from session).</li>
  <li>Multi-line entry grid:
    <ol type="i" style="margin-left:20px">
      <li>Account Name - Searchable selector in consolidated format: "GL Name-Party Type-Party Name".</li>
      <li>Debit Amount</li>
      <li>Credit Amount</li>
      <li>Narration/Description per line</li>
    </ol>
  </li>
  <li>Total Debits must equal Total Credits (double-entry validation).</li>
  <li>GL accounts are filtered by:
    <ol type="i" style="margin-left:20px">
      <li>Voucher type mapping</li>
      <li>Branch GL mapping</li>
      <li>Ledger scope (Management/Tax mode)</li>
    </ol>
  </li>
</ol>
<b>2. Tax Exclusion</b>
<ol type="a" style="margin-left:20px">
  <li>Tax exclusion toggle available at voucher level or individual line-item level.</li>
  <li>Vouchers created in Management mode can be excluded from Tax Accounting.</li>
  <li>Vouchers created in Tax mode are included in Tax by default.</li>
  <li>Excluded vouchers can be re-included later via Voucher List.</li>
</ol>
<b>3. Policy Enforcement</b>
<ol type="a" style="margin-left:20px">
  <li>Same Person Maker Checker - If not allowed, same user cannot create and authorize.</li>
  <li>Back Date Transaction - If not allowed, past dates are rejected.</li>
  <li>Holiday Transaction - If not allowed, weekend/holiday dates are rejected.</li>
</ol>`,
    postCondition: [
      'Voucher will be saved and available in Voucher List.',
      'GL balances will be updated accordingly.',
      'Audit log will capture the transaction.',
    ],
    acceptanceCriteria: [
      'Voucher can be created with balanced debit/credit.',
      'Unbalanced vouchers are rejected.',
      'GL filtering works based on voucher type and branch.',
      'Tax exclusion toggle works at voucher and line level.',
      'Policy enforcement prevents unauthorized operations.',
    ],
    priority: 'High',
  },
  {
    srsId: 'SRS-OP-4.2',
    title: 'Voucher List (Search & Review)',
    proposedRequirement: [
      'Users will be able to view, search, filter, and manage all vouchers.',
      'Users will be able to re-include previously excluded Tax vouchers.',
      'Users will be able to approve or reject vouchers.',
    ],
    precondition: [
      'Vouchers must exist in the system.',
    ],
    businessRules: `<b>1. Voucher List</b>
<ol type="a" style="margin-left:20px">
  <li>Columns: Voucher No, Voucher Type, Date, Branch, Total Amount, Status, Tax Included, Created By.</li>
  <li>Filter by: Date Range, Voucher Type, Branch, Status (Draft/Posted/Approved/Rejected).</li>
  <li>Click on row to view voucher details in a dialog/popup.</li>
  <li>Export to Excel functionality.</li>
</ol>
<b>2. Voucher Actions</b>
<ol type="a" style="margin-left:20px">
  <li>View Details - Opens VoucherDetailsDialog with full debit/credit breakdown.</li>
  <li>Approve/Reject - Based on maker-checker policy.</li>
  <li>Re-include in Tax - Toggle tax inclusion for previously excluded vouchers.</li>
  <li>Print - Generate printable voucher format.</li>
</ol>`,
    postCondition: [
      'Voucher status will be updated based on action.',
      'Tax inclusion changes will reflect in Tax Accounting reports.',
    ],
    acceptanceCriteria: [
      'All vouchers are visible with correct filters.',
      'Voucher details dialog shows complete information.',
      'Tax re-inclusion works correctly.',
      'Maker-checker approval flow works.',
    ],
    priority: 'High',
  },
  {
    srsId: 'SRS-OP-4.3',
    title: 'Batch Voucher Entry',
    proposedRequirement: [
      'Users will be able to create multiple vouchers in bulk for recurring or batch transactions.',
      'Users will be able to upload batch data.',
    ],
    precondition: [
      'GL accounts and voucher type mappings must be configured.',
      'Period must be open.',
    ],
    businessRules: `<b>1. Batch Voucher Entry</b>
<ol type="a" style="margin-left:20px">
  <li>Batch Name/Reference - Required.</li>
  <li>Voucher Type - Required, applies to all vouchers in batch.</li>
  <li>Entry grid for multiple voucher lines.</li>
  <li>Each line: Account Name, Debit, Credit, Narration.</li>
  <li>Total debits must equal total credits per voucher.</li>
  <li>Batch can be saved as draft before final posting.</li>
  <li>All policy enforcements apply to batch vouchers.</li>
</ol>`,
    postCondition: [
      'Batch vouchers will appear in Batch Voucher List.',
      'Posted batch vouchers update GL balances.',
    ],
    acceptanceCriteria: [
      'Multiple vouchers can be created in one batch.',
      'Validation rules apply to each voucher in batch.',
      'Draft batches can be edited before posting.',
    ],
    priority: 'Medium',
  },
  {
    srsId: 'SRS-OP-4.4',
    title: 'Batch Voucher List',
    proposedRequirement: [
      'Users will be able to view and manage all batch vouchers.',
    ],
    precondition: [
      'Batch vouchers must exist.',
    ],
    businessRules: `<b>1. Batch Voucher List</b>
<ol type="a" style="margin-left:20px">
  <li>Columns: Batch ID, Batch Name, Voucher Type, Total Vouchers, Total Amount, Status, Created By, Date.</li>
  <li>Filter by: Date Range, Status, Voucher Type.</li>
  <li>Click to view individual vouchers within batch.</li>
  <li>Action: Post All, Delete (draft only).</li>
</ol>`,
    postCondition: [
      'Batch voucher status is updated.',
    ],
    acceptanceCriteria: [
      'Batch list shows all batches with correct counts.',
      'Individual vouchers within batch are viewable.',
    ],
    priority: 'Medium',
  },
  {
    srsId: 'SRS-OP-4.5',
    title: 'Fund Transfer (Instruction Processing)',
    proposedRequirement: [
      'Users will be able to process fund transfers between bank accounts.',
      'System will display account balances and OD limits.',
      'Amount in words will be automatically calculated.',
    ],
    precondition: [
      'Bank GL accounts (Recon GL with reconGLFor = Bank) must be configured.',
      'Bank GL accounts must be mapped to the current branch.',
    ],
    businessRules: `<b>1. Credit Account Details Section</b>
<ol type="a" style="margin-left:20px">
  <li>Account Code - Required, select from bank accounts (Recon GL = Bank).</li>
  <li>Account Name - Auto-populated from GL master.</li>
  <li>Current Balance - Display only, shows current account balance.</li>
  <li>OD Limit - Display only, shows overdraft limit.</li>
</ol>
<b>2. Debit Account Details Section</b>
<ol type="a" style="margin-left:20px">
  <li>Account Code - Required, select from bank accounts.</li>
  <li>Account Name - Auto-populated.</li>
  <li>Current Balance - Display only.</li>
  <li>OD Limit - Display only.</li>
</ol>
<b>3. Transaction Details Section</b>
<ol type="a" style="margin-left:20px">
  <li>Amount - Required, numeric.</li>
  <li>Amount in Words - Auto-calculated from Amount field (e.g., "One Lakh Fifty Thousand Only").</li>
  <li>Equivalent Credit Amount - For cross-currency transfers, calculated using daily rate.</li>
  <li>Equivalent Amount in Words - Auto-calculated.</li>
  <li>Reference Number - Optional.</li>
  <li>Remarks - Optional text.</li>
  <li>Transaction Date - Required.</li>
</ol>
<b>4. Validation Rules</b>
<ol type="a" style="margin-left:20px">
  <li>Credit and Debit accounts <b>cannot be the same</b>.</li>
  <li>All mandatory fields must be filled before submission.</li>
  <li>Amount must be greater than zero.</li>
  <li>Transfer creates a Contra voucher entry automatically.</li>
</ol>`,
    postCondition: [
      'Fund transfer creates corresponding voucher entries.',
      'Both account balances are updated.',
      'Transaction is logged in audit trail.',
    ],
    acceptanceCriteria: [
      'Fund transfer between two different bank accounts works.',
      'Same account transfer is rejected.',
      'Amount in words is correctly calculated.',
      'Cross-currency equivalent is calculated using daily rates.',
    ],
    priority: 'High',
  },
];

const reportRSDs: RSDEntry[] = [
  {
    srsId: 'SRS-RPT-5.1',
    title: 'Transaction Report',
    proposedRequirement: [
      'Users will be able to view detailed transaction listings with various filters.',
      'Users will be able to export report data.',
    ],
    precondition: ['Transactions must exist in the system.'],
    businessRules: `<b>1. Report Filters</b>
<ol type="a" style="margin-left:20px">
  <li>Date Range - From Date, To Date.</li>
  <li>Branch - Single or multi-branch selection.</li>
  <li>GL Code - Optional, specific GL filter.</li>
  <li>Voucher Type - Payment/Receipt/Journal/Contra/All.</li>
  <li>Currency filter.</li>
</ol>
<b>2. Report Output</b>
<ol type="a" style="margin-left:20px">
  <li>Columns: Date, Voucher No, Voucher Type, GL Code, GL Name, Debit, Credit, Narration, Branch.</li>
  <li>Subtotals per GL Code.</li>
  <li>Grand Total at bottom.</li>
  <li>Export to Excel, PDF.</li>
  <li>Print option.</li>
</ol>`,
    postCondition: ['Report data is displayed based on selected filters.'],
    acceptanceCriteria: [
      'Report generates correctly with applied filters.',
      'Totals are mathematically correct.',
      'Export functionality works.',
    ],
    priority: 'High',
  },
  {
    srsId: 'SRS-RPT-5.2',
    title: 'General Ledger Report',
    proposedRequirement: [
      'Users will be able to view GL-wise transaction reports showing opening balance, period transactions, and closing balance.',
    ],
    precondition: ['GL accounts and transactions must exist.'],
    businessRules: `<b>1. Report Structure</b>
<ol type="a" style="margin-left:20px">
  <li>GL-wise breakdown with:
    <ol type="i" style="margin-left:20px">
      <li>Opening Balance</li>
      <li>Period Transactions (Debit/Credit)</li>
      <li>Closing Balance</li>
    </ol>
  </li>
  <li>Filters: Date Range, Branch, GL Code, GL Type.</li>
  <li>Drill-down capability - click GL to see individual transactions.</li>
</ol>`,
    postCondition: ['Detailed GL report is displayed.'],
    acceptanceCriteria: [
      'Opening + Period Transactions = Closing Balance.',
      'Drill-down to individual transactions works.',
    ],
    priority: 'High',
  },
  {
    srsId: 'SRS-RPT-5.3',
    title: 'General Ledger Summary Report',
    proposedRequirement: [
      'Users will be able to view summarized GL balances across selected branches and periods.',
    ],
    precondition: ['GL accounts and transactions must exist.'],
    businessRules: `<b>1. Summary Report</b>
<ol type="a" style="margin-left:20px">
  <li>Aggregated GL balances grouped by Parent GL.</li>
  <li>Filters: Period, Branch (single/multi/consolidated).</li>
  <li>Shows: GL Code, GL Name, Total Debit, Total Credit, Net Balance.</li>
</ol>`,
    postCondition: ['Summary report is displayed.'],
    acceptanceCriteria: ['Summary totals match detailed transaction data.'],
    priority: 'Medium',
  },
  {
    srsId: 'SRS-RPT-5.4',
    title: 'Trial Balance Report',
    proposedRequirement: [
      'Users will be able to view standard trial balance showing all GL balances.',
    ],
    precondition: ['GL accounts and transactions must exist.'],
    businessRules: `<b>1. Trial Balance</b>
<ol type="a" style="margin-left:20px">
  <li>Standard format: GL Code, GL Name, Debit Balance, Credit Balance.</li>
  <li>Total Debits must equal Total Credits.</li>
  <li>Filters: Date/Period, Branch.</li>
  <li>Both summary and detailed versions available.</li>
</ol>`,
    postCondition: ['Trial balance is displayed with balanced totals.'],
    acceptanceCriteria: ['Total Debits = Total Credits.', 'Filter by branch works.'],
    priority: 'High',
  },
  {
    srsId: 'SRS-RPT-5.5',
    title: 'Trial Balance Extended Report',
    proposedRequirement: [
      'Users will be able to view extended trial balance with opening balance, movements, and closing balance columns.',
    ],
    precondition: ['GL accounts and transactions must exist.'],
    businessRules: `<b>1. Extended Trial Balance</b>
<ol type="a" style="margin-left:20px">
  <li>Columns: GL Code, GL Name, Opening Debit, Opening Credit, Movement Debit, Movement Credit, Closing Debit, Closing Credit.</li>
  <li>Opening Balance + Movement = Closing Balance (per GL).</li>
  <li>Filters: Period range, Branch.</li>
</ol>`,
    postCondition: ['Extended trial balance is displayed.'],
    acceptanceCriteria: ['Opening + Movement = Closing for each GL.', 'Balanced totals.'],
    priority: 'Medium',
  },
  {
    srsId: 'SRS-RPT-5.6',
    title: 'Payment & Receipt Report',
    proposedRequirement: [
      'Users will be able to view summary of all payment and receipt vouchers.',
    ],
    precondition: ['Payment/Receipt vouchers must exist.'],
    businessRules: `<ol type="a" style="margin-left:20px">
  <li>Separate sections for Payments and Receipts.</li>
  <li>Filters: Date Range, Branch, GL Account.</li>
  <li>Columns: Voucher No, Date, Account, Amount, Narration.</li>
  <li>Subtotals and Grand Total.</li>
</ol>`,
    postCondition: ['Report is displayed.'],
    acceptanceCriteria: ['Payment and Receipt totals are correct.'],
    priority: 'Medium',
  },
  {
    srsId: 'SRS-RPT-5.7',
    title: 'Income Statement (Profit & Loss)',
    proposedRequirement: [
      'Users will be able to view Profit & Loss statement.',
    ],
    precondition: ['Revenue and Expense GL transactions must exist.'],
    businessRules: `<ol type="a" style="margin-left:20px">
  <li>Structure: Revenue - COGS = Gross Profit - Operating Expenses = Operating Income +/- Other Income/Expenses = Net Income.</li>
  <li>Filters: Period, Branch.</li>
  <li>Comparative periods (current vs previous).</li>
  <li>Dashboard chart: Sales, COGS, OpEx visualization.</li>
</ol>`,
    postCondition: ['Income statement is displayed.'],
    acceptanceCriteria: ['Revenue - Expenses = Net Income.', 'Comparative data is correct.'],
    priority: 'High',
  },
  {
    srsId: 'SRS-RPT-5.8',
    title: 'Balance Sheet',
    proposedRequirement: [
      'Users will be able to view statement of financial position.',
    ],
    precondition: ['Asset, Liability, and Equity GL transactions must exist.'],
    businessRules: `<ol type="a" style="margin-left:20px">
  <li>Structure: Assets = Liabilities + Equity (Accounting equation).</li>
  <li>Current vs Non-Current classification.</li>
  <li>Filters: As-of Date, Branch.</li>
  <li>Dashboard chart: Asset, Liability, Equity visualization.</li>
</ol>`,
    postCondition: ['Balance sheet is displayed with balanced equation.'],
    acceptanceCriteria: ['Assets = Liabilities + Equity.'],
    priority: 'High',
  },
  {
    srsId: 'SRS-RPT-5.9',
    title: 'Cash Flow Report',
    proposedRequirement: [
      'Users will be able to view cash flow statement.',
    ],
    precondition: ['Cash/Bank transactions must exist.'],
    businessRules: `<ol type="a" style="margin-left:20px">
  <li>Three categories: Operating Activities, Investing Activities, Financing Activities.</li>
  <li>Direct method and Indirect method support.</li>
  <li>Filters: Period, Branch.</li>
  <li>Net Cash Flow = Operating + Investing + Financing.</li>
</ol>`,
    postCondition: ['Cash flow statement is displayed.'],
    acceptanceCriteria: ['Cash flow categories sum correctly.', 'Both methods produce consistent results.'],
    priority: 'High',
  },
  {
    srsId: 'SRS-RPT-5.10',
    title: 'Ratio Analysis Report',
    proposedRequirement: [
      'Users will be able to view financial ratio calculations.',
    ],
    precondition: ['Financial data must exist. Ratio formulas must be configured.'],
    businessRules: `<ol type="a" style="margin-left:20px">
  <li>Configurable ratio formulas via Ratio Analysis Config page.</li>
  <li>Standard ratios: Current Ratio, Quick Ratio, Debt-to-Equity, ROA, ROE, Gross Margin, Net Margin, etc.</li>
  <li>Dashboard visualization: AP Ratio Analysis Chart.</li>
  <li>Filters: Period, Branch.</li>
  <li>Trend analysis across multiple periods.</li>
</ol>`,
    postCondition: ['Ratio analysis is displayed.'],
    acceptanceCriteria: ['Ratios are mathematically correct.', 'Trend data is accurate.'],
    priority: 'Medium',
  },
  {
    srsId: 'SRS-RPT-5.11',
    title: 'Currency Rate Report',
    proposedRequirement: ['Users will be able to view historical exchange rate data.'],
    precondition: ['Daily rates must be configured.'],
    businessRules: `<ol type="a" style="margin-left:20px">
  <li>Historical exchange rate listing.</li>
  <li>Filters: Date Range, Branch, Currency pair.</li>
  <li>Trend visualization.</li>
</ol>`,
    postCondition: ['Rate history is displayed.'],
    acceptanceCriteria: ['Rate data matches configured rates.'],
    priority: 'Low',
  },
  {
    srsId: 'SRS-RPT-5.12',
    title: 'GL Aging Report',
    proposedRequirement: ['Users will be able to view aging analysis of GL balances.'],
    precondition: ['GL transactions must exist.'],
    businessRules: `<ol type="a" style="margin-left:20px">
  <li>Aging buckets: 0-30 days, 31-60 days, 61-90 days, 91-120 days, 120+ days.</li>
  <li>Applicable for Receivable and Payable GLs.</li>
  <li>Filters: GL Code, Branch, As-of Date.</li>
</ol>`,
    postCondition: ['Aging report is displayed.'],
    acceptanceCriteria: ['Aging buckets are correctly calculated.', 'Total matches GL balance.'],
    priority: 'Medium',
  },
];

const groundHandlingRSDs: RSDEntry[] = [
  {
    srsId: 'SRS-GH-6.1',
    title: 'Station Management',
    proposedRequirement: [
      'Users will be able to manage ground handling stations.',
      'Users will be able to add, edit, and deactivate stations.',
    ],
    precondition: ['User must have Ground Handling module access.'],
    businessRules: `<b>1. Station List</b>
<ol type="a" style="margin-left:20px">
  <li>Columns: IATA Code, ICAO Code, Station Name, Country, Region, Type (Domestic/International), Status.</li>
  <li>Search by IATA Code, Name, Country.</li>
  <li>Data stored in <b>gh_stations</b> database table with RLS policies.</li>
</ol>
<b>2. Station Setup</b>
<ol type="a" style="margin-left:20px">
  <li>IATA Code - Required, 3-letter, unique.</li>
  <li>ICAO Code - Required, 4-letter, unique.</li>
  <li>Station Name - Required.</li>
  <li>Country - Required.</li>
  <li>Region - Required, default "Asia".</li>
  <li>Type - Required, Domestic/International, default "Domestic".</li>
  <li>Status - Active/Inactive, default "Active".</li>
  <li>Uses standard list-and-edit-popup pattern.</li>
</ol>`,
    postCondition: ['Stations available for supplier and agreement configuration.'],
    acceptanceCriteria: ['Stations can be created with unique IATA/ICAO codes.', 'Edit popup works correctly.'],
    priority: 'High',
  },
  {
    srsId: 'SRS-GH-6.2',
    title: 'Supplier Management',
    proposedRequirement: [
      'Users will be able to manage ground handling suppliers.',
      'Users will be able to maintain supplier details including bank information.',
    ],
    precondition: ['Stations must be configured.'],
    businessRules: `<b>1. Supplier List</b>
<ol type="a" style="margin-left:20px">
  <li>Columns: Company Name, Supplier Type, Station, Contact, Email, Valid From/Till, Status.</li>
  <li>Data stored in <b>gh_suppliers</b> table.</li>
</ol>
<b>2. Supplier Form</b>
<ol type="a" style="margin-left:20px">
  <li>Company Name - Required.</li>
  <li>Supplier Type - Required (Ground Handling/Fuel/Catering/etc).</li>
  <li>Station IATA - Optional, linked to station master.</li>
  <li>Contact Details: Name, Designation, Email, Phone, Fax.</li>
  <li>Validity Period: Valid From, Valid Till dates.</li>
  <li>Bank Details: Bank Name, Branch, Account Name, Account Number, Swift Code, Routing Number.</li>
  <li>Country, Remarks, Status.</li>
</ol>`,
    postCondition: ['Suppliers available for agreements and invoicing.'],
    acceptanceCriteria: ['Suppliers can be created with all required fields.', 'Bank details are saved correctly.'],
    priority: 'High',
  },
  {
    srsId: 'SRS-GH-6.3',
    title: 'Service Management',
    proposedRequirement: [
      'Users will be able to define ground handling services.',
      'Users will be able to link services to criteria.',
    ],
    precondition: ['Ground Handling module access required.'],
    businessRules: `<b>1. Service List</b>
<ol type="a" style="margin-left:20px">
  <li>Data stored in <b>gh_services</b> table.</li>
  <li>Columns: Service Code, Service Name, Supplier Type, Unit of Measurement, Status.</li>
</ol>
<b>2. Service Form</b>
<ol type="a" style="margin-left:20px">
  <li>Service Name - Required.</li>
  <li>Service Code - Optional, unique.</li>
  <li>Supplier Type - Required (Ground Handling/Fuel/etc).</li>
  <li>Unit of Measurement - Required (Per Flight/Per PAX/Per Kg/etc).</li>
  <li>Description - Optional.</li>
  <li>Criteria Linking - Services can be linked to criteria via <b>gh_service_criteria</b> junction table.</li>
  <li>Status - Active/Inactive.</li>
</ol>`,
    postCondition: ['Services available for agreements and service data entry.'],
    acceptanceCriteria: ['Services can be created and linked to criteria.', 'Service-criteria junction works.'],
    priority: 'High',
  },
  {
    srsId: 'SRS-GH-6.4',
    title: 'Criteria Management',
    proposedRequirement: [
      'Users will be able to define pricing criteria for ground handling services.',
    ],
    precondition: ['Ground Handling module access required.'],
    businessRules: `<ol type="a" style="margin-left:20px">
  <li>Data stored in <b>gh_criteria</b> table.</li>
  <li>Criteria Name - Required.</li>
  <li>Description - Optional.</li>
  <li>Status - Active/Inactive.</li>
  <li>Examples: Aircraft Type, Flight Type, Season, Weight Category.</li>
  <li>Criteria are linked to services for pricing rule definition.</li>
</ol>`,
    postCondition: ['Criteria available for service pricing configuration.'],
    acceptanceCriteria: ['Criteria can be created and managed.'],
    priority: 'Medium',
  },
  {
    srsId: 'SRS-GH-6.5',
    title: 'Aircraft Setup',
    proposedRequirement: ['Users will be able to maintain aircraft type master data.'],
    precondition: ['Ground Handling module access.'],
    businessRules: `<ol type="a" style="margin-left:20px">
  <li>Aircraft Type, Registration Number, Capacity.</li>
  <li>Standard list-and-edit-popup pattern.</li>
  <li>Used in journey log and service data entry.</li>
</ol>`,
    postCondition: ['Aircraft types available for flight operations.'],
    acceptanceCriteria: ['Aircraft data can be added and edited.'],
    priority: 'Medium',
  },
  {
    srsId: 'SRS-GH-6.6',
    title: 'Route Setup',
    proposedRequirement: ['Users will be able to define flight routes.'],
    precondition: ['Stations must be configured.'],
    businessRules: `<ol type="a" style="margin-left:20px">
  <li>Origin Station - from station master.</li>
  <li>Destination Station - from station master.</li>
  <li>Flight Frequency.</li>
  <li>Standard list-and-edit-popup pattern.</li>
</ol>`,
    postCondition: ['Routes available for journey log and forecasting.'],
    acceptanceCriteria: ['Routes can be defined between two stations.'],
    priority: 'Medium',
  },
  {
    srsId: 'SRS-GH-6.7',
    title: 'Station Wise Agreement',
    proposedRequirement: [
      'Users will be able to create and manage service agreements with suppliers at specific stations.',
    ],
    precondition: ['Stations, Suppliers, Services, and Criteria must be configured.'],
    businessRules: `<ol type="a" style="margin-left:20px">
  <li>Station - Required, from station master.</li>
  <li>Supplier - Required, from supplier master.</li>
  <li>Service - Required, from service master.</li>
  <li>Pricing Rules: Rate, Criteria-based pricing, Validity period.</li>
  <li>Terms and Conditions management.</li>
  <li>Agreement Comparison view for cost optimization across suppliers.</li>
</ol>`,
    postCondition: ['Agreement pricing available for forecasted costing and invoice reconciliation.'],
    acceptanceCriteria: ['Agreements can be created with pricing rules.', 'Comparison view works.'],
    priority: 'High',
  },
  {
    srsId: 'SRS-GH-6.8',
    title: 'Journey Log',
    proposedRequirement: ['Users will be able to record flight operation details.'],
    precondition: ['Aircraft and Route setup must be completed.'],
    businessRules: `<ol type="a" style="margin-left:20px">
  <li>Flight Number, Date, Aircraft Type.</li>
  <li>Origin, Destination (from routes).</li>
  <li>Departure/Arrival Times.</li>
  <li>Passenger Count (PAX).</li>
  <li>Delay information.</li>
  <li>Remarks.</li>
</ol>`,
    postCondition: ['Journey data available for service data entry and costing.'],
    acceptanceCriteria: ['Journey log entries can be created and saved.'],
    priority: 'High',
  },
  {
    srsId: 'SRS-GH-6.9',
    title: 'Service Data Entry',
    proposedRequirement: ['Users will be able to record actual ground handling services consumed per flight.'],
    precondition: ['Journey log entries must exist.', 'Services must be configured.'],
    businessRules: `<ol type="a" style="margin-left:20px">
  <li>Link to Journey Log entry.</li>
  <li>Select services consumed.</li>
  <li>Enter quantity/units consumed.</li>
  <li>Used for forecasted costing calculation.</li>
</ol>`,
    postCondition: ['Service consumption data available for costing and reconciliation.'],
    acceptanceCriteria: ['Service data can be entered per flight.'],
    priority: 'High',
  },
  {
    srsId: 'SRS-GH-6.10',
    title: 'Invoice Management (Add, List, Reconciliation)',
    proposedRequirement: [
      'Users will be able to enter supplier invoices.',
      'Users will be able to view invoice list.',
      'Users will be able to reconcile forecasted vs actual costs.',
    ],
    precondition: ['Agreements and service data must exist.'],
    businessRules: `<b>1. Add Invoice</b>
<ol type="a" style="margin-left:20px">
  <li>Supplier, Station, Invoice Number, Invoice Date, Amount, Currency.</li>
  <li>Line items with service breakdown.</li>
</ol>
<b>2. Invoice List</b>
<ol type="a" style="margin-left:20px">
  <li>Filter by: Supplier, Station, Date Range, Status.</li>
  <li>Columns: Invoice No, Supplier, Station, Amount, Status, Date.</li>
</ol>
<b>3. Forecasted Costing</b>
<ol type="a" style="margin-left:20px">
  <li>Calculate expected costs based on agreements and actual service data.</li>
</ol>
<b>4. Invoice Reconciliation</b>
<ol type="a" style="margin-left:20px">
  <li>Compare forecasted costs vs actual invoice amounts.</li>
  <li>Identify discrepancies.</li>
  <li>Resolution workflow.</li>
</ol>`,
    postCondition: ['Invoices are tracked and reconciled against forecasted costs.'],
    acceptanceCriteria: ['Invoices can be added.', 'Reconciliation identifies discrepancies.', 'Forecasted costing matches agreement pricing.'],
    priority: 'High',
  },
  {
    srsId: 'SRS-GH-6.11',
    title: 'Ground Handling Reports (Dashboard, Station Wise, Service Utilization, Reconciliation)',
    proposedRequirement: [
      'Users will be able to view GH dashboard with KPIs.',
      'Users will be able to view station-wise cost reports.',
      'Users will be able to view service utilization analysis.',
      'Users will be able to view reconciliation summary.',
    ],
    precondition: ['Operational data must exist.'],
    businessRules: `<ol type="a" style="margin-left:20px">
  <li><b>Dashboard</b> - Key metrics, charts, KPIs for ground handling.</li>
  <li><b>Station Wise Report</b> - Cost and service analysis grouped by station.</li>
  <li><b>Service Utilization</b> - Usage patterns and cost analysis per service.</li>
  <li><b>Reconciliation Report</b> - Summary of invoice reconciliation results.</li>
  <li>All reports support date range and branch filters.</li>
  <li>Export to Excel/PDF.</li>
</ol>`,
    postCondition: ['Reports are displayed with accurate data.'],
    acceptanceCriteria: ['Dashboard shows correct KPIs.', 'Reports match operational data.'],
    priority: 'Medium',
  },
];

const fixedAssetRSDs: RSDEntry[] = [
  {
    srsId: 'SRS-FA-7.1',
    title: 'Asset Group Setup',
    proposedRequirement: [
      'Users will be able to define asset categories in a hierarchical tree structure.',
    ],
    precondition: ['User must have Fixed Asset module access.'],
    businessRules: `<ol type="a" style="margin-left:20px">
  <li>Hierarchical tree: e.g., Land → Building → Vehicle → Equipment.</li>
  <li>Asset Group Code - Required, unique.</li>
  <li>Asset Group Name - Required.</li>
  <li>Parent Group - Optional (for hierarchy).</li>
  <li>Default Useful Life, Default Depreciation Method, Default Salvage Value %.</li>
  <li>Status - Active/Inactive.</li>
</ol>`,
    postCondition: ['Asset groups available for asset registration.'],
    acceptanceCriteria: ['Tree hierarchy displays correctly.', 'Groups can be nested.'],
    priority: 'High',
  },
  {
    srsId: 'SRS-FA-7.2',
    title: 'Value Adjustment Rules (Depreciation Rules)',
    proposedRequirement: [
      'Users will be able to configure depreciation methods, rates, and useful life per asset group.',
    ],
    precondition: ['Asset groups must be configured.'],
    businessRules: `<ol type="a" style="margin-left:20px">
  <li>Depreciation Methods: Straight Line, Declining Balance, Units of Production.</li>
  <li>Depreciation Rate (%).</li>
  <li>Useful Life (years/months).</li>
  <li>Salvage Value (% or fixed amount).</li>
  <li>Linked to Asset Group.</li>
  <li>Effective Date for rule changes.</li>
</ol>`,
    postCondition: ['Depreciation rules applied during depreciation run.'],
    acceptanceCriteria: ['Rules can be configured per asset group.', 'Method calculations are correct.'],
    priority: 'High',
  },
  {
    srsId: 'SRS-FA-7.3',
    title: 'Employee Directory',
    proposedRequirement: ['Users will be able to maintain employee records for asset allocation.'],
    precondition: ['Fixed Asset module access.'],
    businessRules: `<ol type="a" style="margin-left:20px">
  <li>Employee ID, Name, Department, Designation, Branch.</li>
  <li>Used for asset allocation tracking.</li>
  <li>Status - Active/Inactive.</li>
</ol>`,
    postCondition: ['Employees available for asset allocation.'],
    acceptanceCriteria: ['Employee records can be managed.'],
    priority: 'Medium',
  },
  {
    srsId: 'SRS-FA-7.4',
    title: 'Asset Recon GL Mapping',
    proposedRequirement: ['Users will be able to map asset groups to GL accounts for automatic journal posting.'],
    precondition: ['Asset groups and GL accounts must be configured.'],
    businessRules: `<ol type="a" style="margin-left:20px">
  <li>Asset Group → Asset GL Account.</li>
  <li>Asset Group → Depreciation Expense GL Account.</li>
  <li>Asset Group → Accumulated Depreciation GL Account.</li>
  <li>Asset Group → Disposal Gain/Loss GL Account.</li>
  <li>Enables automatic voucher posting for depreciation and disposal.</li>
</ol>`,
    postCondition: ['Automatic GL posting works for asset operations.'],
    acceptanceCriteria: ['Mappings can be created.', 'Auto-posting uses correct GL accounts.'],
    priority: 'High',
  },
  {
    srsId: 'SRS-FA-7.5',
    title: 'Asset Registration',
    proposedRequirement: [
      'Users will be able to register new assets with detailed financial and physical information.',
    ],
    precondition: ['Asset groups and GL mappings must be configured.'],
    businessRules: `<ol type="a" style="margin-left:20px">
  <li>Asset Code - Auto-generated or manual, unique.</li>
  <li>Asset Name/Description - Required.</li>
  <li>Asset Group - Required, from tree hierarchy.</li>
  <li>Acquisition Date - Required.</li>
  <li>Acquisition Cost - Required.</li>
  <li>Useful Life - Auto-populated from group, editable.</li>
  <li>Salvage Value - Auto-populated, editable.</li>
  <li>Location/Branch - Required.</li>
  <li>Vendor/Supplier information.</li>
  <li>Serial Number, Model, Warranty details.</li>
  <li>Status: Active, Disposed, Under Maintenance.</li>
</ol>`,
    postCondition: ['Asset is registered and available for lifecycle operations.'],
    acceptanceCriteria: ['Assets can be registered with all required fields.', 'Defaults from group are applied.'],
    priority: 'High',
  },
  {
    srsId: 'SRS-FA-7.6',
    title: 'Asset Lifecycle Operations (Allocation, Depreciation, Disposal, Revaluation, Renovation, Maintenance, Transfer)',
    proposedRequirement: [
      'Users will be able to manage the full asset lifecycle.',
    ],
    precondition: ['Assets must be registered.'],
    businessRules: `<b>1. Asset Allocation</b> - Assign assets to employees/departments/locations.
<b>2. Depreciation & Amortization</b> - Run depreciation calculations, auto-post GL entries, period-based processing.
<b>3. Asset Disposal</b> - Record sale/write-off/donation, calculate gain/loss, post closing entries.
<b>4. Asset Revaluation</b> - Adjust book values to fair market value.
<b>5. Asset Renovation</b> - Record capital improvements that increase value/useful life.
<b>6. Asset Maintenance</b> - Track maintenance activities and costs.
<b>7. Asset Transfer</b> - Transfer between branches/departments/employees.
<br/><br/>All operations create audit trail entries.
All financial operations auto-post to mapped GL accounts.`,
    postCondition: ['Asset records reflect lifecycle changes.', 'GL balances updated automatically.'],
    acceptanceCriteria: ['Each lifecycle operation works correctly.', 'GL auto-posting is accurate.', 'Audit trail captures all changes.'],
    priority: 'High',
  },
  {
    srsId: 'SRS-FA-7.7',
    title: 'Fixed Asset Reports',
    proposedRequirement: [
      'Users will be able to view various fixed asset reports.',
    ],
    precondition: ['Asset data must exist.'],
    businessRules: `<ol type="a" style="margin-left:20px">
  <li><b>Asset Details Report</b> - Complete asset register with current values.</li>
  <li><b>Allocation Report</b> - Current asset-to-employee/dept assignments.</li>
  <li><b>Asset Schedule Report</b> - Fiscal year summary: Opening Value, Additions, Depreciation, Disposals, Closing Value.</li>
  <li><b>Disposal Report</b> - All disposed assets with gain/loss details.</li>
  <li><b>Maintenance Report</b> - Maintenance history and cost analysis.</li>
  <li>All reports support Branch, Period, and Asset Group filters.</li>
  <li>Export to Excel/PDF.</li>
</ol>`,
    postCondition: ['Reports display accurate asset data.'],
    acceptanceCriteria: ['Asset Schedule: Opening + Additions - Depreciation - Disposals = Closing.', 'Reports match operational data.'],
    priority: 'Medium',
  },
];

const adminRSDs: RSDEntry[] = [
  {
    srsId: 'SRS-ADM-8.1',
    title: 'User Branch Mapping',
    proposedRequirement: [
      'Admins will be able to assign users to branches with specific access levels.',
      'Admins will be able to view and manage existing user-branch mappings.',
    ],
    precondition: ['Users and branches must be configured.', 'Current user must have admin role.'],
    businessRules: `<ol type="a" style="margin-left:20px">
  <li>User - Required, from user list.</li>
  <li>Branch - Required, from branch master.</li>
  <li>Access Level - Required:
    <ol type="i" style="margin-left:20px">
      <li><b>Full</b> - All operations allowed.</li>
      <li><b>Read-only</b> - View only, no data modification.</li>
      <li><b>Restricted</b> - Limited operations as defined by admin.</li>
    </ol>
  </li>
  <li>Status - Active/Inactive.</li>
  <li>Users can be mapped to multiple branches.</li>
  <li>Only mapped branches appear in user's branch selector.</li>
</ol>`,
    postCondition: ['User can access mapped branches based on access level.'],
    acceptanceCriteria: ['Mapping can be created.', 'User only sees mapped branches.', 'Access levels are enforced.'],
    priority: 'High',
  },
  {
    srsId: 'SRS-ADM-8.2',
    title: 'System Setup (Module, Submodule, Menu, Menu Action)',
    proposedRequirement: [
      'Admins will be able to configure system modules, submodules, menus, and menu actions.',
    ],
    precondition: ['Admin role required.'],
    businessRules: `<ol type="a" style="margin-left:20px">
  <li><b>Module</b> - Define top-level system modules (Accounting, Ground Handling, Fixed Asset, Admin).</li>
  <li><b>Submodule</b> - Define sub-divisions within modules.</li>
  <li><b>Menu</b> - Configure navigation menu items and hierarchy.</li>
  <li><b>Menu Action</b> - Define available actions per menu (View, Create, Edit, Delete, Print, Export).</li>
  <li>These configurations control the dynamic menu rendering and access control.</li>
</ol>`,
    postCondition: ['System navigation and permissions are configured.'],
    acceptanceCriteria: ['Module/Menu hierarchy can be configured.', 'Menu actions control user capabilities.'],
    priority: 'Medium',
  },
];

const dashboardRSD: RSDEntry = {
  srsId: 'SRS-DASH-9.1',
  title: 'Dashboard',
  proposedRequirement: [
    'Users will be able to view key financial metrics and visualizations.',
    'Dashboard provides at-a-glance overview of financial health.',
  ],
  precondition: ['Transaction data must exist.', 'User must be logged in with branch selected.'],
  businessRules: `<b>1. Dashboard Widgets</b>
<ol type="a" style="margin-left:20px">
  <li><b>AP/AR Charts</b> - Accounts Payable vs Accounts Receivable visualization.</li>
  <li><b>AP Ratio Analysis Chart</b> - Key ratio trends.</li>
  <li><b>Asset Liability Equity Chart</b> - Balance sheet composition.</li>
  <li><b>Sales, COGS, OpEx Chart</b> - Income statement breakdown.</li>
  <li><b>Yearly Income vs Expense Chart</b> - Annual trend comparison.</li>
</ol>
<b>2. Dashboard Features</b>
<ol type="a" style="margin-left:20px">
  <li>Branch-filtered data based on selected branch.</li>
  <li>Consolidated view when Consolidated branch is selected.</li>
  <li>Interactive charts with hover tooltips.</li>
  <li>Quick navigation to detailed reports.</li>
</ol>`,
  postCondition: ['Dashboard displays accurate financial visualizations.'],
  acceptanceCriteria: ['All charts render correctly.', 'Data matches underlying reports.', 'Branch filtering works.'],
  priority: 'Medium',
};

export default function SRSDocument() {
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Print Controls - Hidden in print */}
      <div className="print:hidden sticky top-0 z-50 bg-white border-b p-4 flex items-center justify-between shadow-sm">
        <h1 className="text-lg font-bold text-gray-800">SRS Document - Foodi Integrated System</h1>
        <div className="flex gap-2">
          <Button onClick={handlePrint} variant="outline" className="gap-2">
            <Printer size={16} /> Print / Save as PDF
          </Button>
        </div>
      </div>

      {/* Document Content */}
      <div ref={contentRef} className="max-w-[210mm] mx-auto p-8 text-black print:p-[20mm]" style={{ fontFamily: 'Times New Roman, serif' }}>
        
        {/* Cover Page */}
        <div className="text-center mb-16 print:page-break-after" style={{ pageBreakAfter: 'always' }}>
          <h2 className="text-lg font-bold mt-20 mb-4">Requirement Scope Document</h2>
          <h3 className="text-base mb-16">[Requirements Specification Details – Integrated Financial & Operations System]</h3>
          
          <div className="text-2xl font-bold mb-20 text-orange-600">FOODI</div>

          <table className="w-[400px] mx-auto border-collapse border border-black text-sm mt-20">
            <tbody>
              <tr><td className="border border-black p-2 font-bold w-[200px]">Project ID & Name</td><td className="border border-black p-2">Integrated Financial System</td></tr>
              <tr><td className="border border-black p-2 font-bold">Project Manager</td><td className="border border-black p-2"></td></tr>
              <tr><td className="border border-black p-2 font-bold">Customer Request Reference</td><td className="border border-black p-2"></td></tr>
              <tr><td className="border border-black p-2 font-bold">Prepared by</td><td className="border border-black p-2">System Generated<span className="ml-8 font-bold">Date</span> March 8, 2026</td></tr>
              <tr><td className="border border-black p-2 font-bold">Reviewed by</td><td className="border border-black p-2"><span className="ml-32 font-bold">Date</span></td></tr>
            </tbody>
          </table>
        </div>

        {/* Table of Contents */}
        <div className="mb-12" style={{ pageBreakAfter: 'always' }}>
          <h2 className="text-xl font-bold mb-6">Table of Contents</h2>
          <h3 className="font-bold mb-2">1. Requirement Scope Summary</h3>
          <h3 className="font-bold mb-2">2. Functional Requirements Identification</h3>
          <div className="ml-4 text-sm space-y-1 mb-2">
            <p>2.1 Central Configuration (SRS-CC-1.1 to SRS-CC-1.9)</p>
            <p>2.2 GL Setup (SRS-GL-2.1 to SRS-GL-2.5)</p>
            <p>2.3 Party Management (SRS-PM-3.1 to SRS-PM-3.2)</p>
            <p>2.4 Operations (SRS-OP-4.1 to SRS-OP-4.5)</p>
            <p>2.5 Reports (SRS-RPT-5.1 to SRS-RPT-5.12)</p>
            <p>2.6 Ground Handling Module (SRS-GH-6.1 to SRS-GH-6.11)</p>
            <p>2.7 Fixed Asset Module (SRS-FA-7.1 to SRS-FA-7.7)</p>
            <p>2.8 Admin Portal (SRS-ADM-8.1 to SRS-ADM-8.2)</p>
            <p>2.9 Dashboard (SRS-DASH-9.1)</p>
          </div>
          <h3 className="font-bold mb-2">3. Dual Accounting Mode (Management & Tax)</h3>
          <h3 className="font-bold mb-2">4. Non-Functional Requirements</h3>
          <h3 className="font-bold mb-2">5. Approved by (Client)</h3>
        </div>

        {/* Requirement Scope Summary */}
        <div className="mb-8" style={{ pageBreakAfter: 'always' }}>
          <h2 className="text-xl font-bold mb-4">1. Requirement Scope Summary</h2>
          <p className="text-sm leading-relaxed mb-4">
            The Foodi Integrated Financial & Operations Management System is a comprehensive business management platform covering core accounting, ground handling operations, fixed asset lifecycle management, and administrative functions across multiple branches. The system supports dual accounting modes (Management and Tax), multi-currency operations, and branch-based access control.
          </p>
          <p className="text-sm leading-relaxed mb-4">
            Key features include general ledger management with hierarchical Parent-Child GL structure, multi-branch operations with consolidated views, party management with control accounts, voucher processing with maker-checker workflows, ground handling service management with invoice reconciliation, complete fixed asset lifecycle tracking, and comprehensive financial reporting including Trial Balance, Income Statement, Balance Sheet, Cash Flow, and Ratio Analysis.
          </p>
          
          <h2 className="text-xl font-bold mb-4 mt-8">2. Functional Requirements Identification</h2>
          <table className="w-full border-collapse border border-black text-sm mb-8">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black p-2 text-left">Module Name</th>
                <th className="border border-black p-2 text-left">SRS ID</th>
                <th className="border border-black p-2 text-left">UI & Reports Name</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Central Configuration', 'SRS-CC-1.1', 'Branch Setup'],
                ['', 'SRS-CC-1.2', 'Currency Setup'],
                ['', 'SRS-CC-1.3', 'Daily Rate Setup'],
                ['', 'SRS-CC-1.4', 'FCY Exchange GL Setup'],
                ['', 'SRS-CC-1.5', 'Inter Branch Recon Mapping'],
                ['', 'SRS-CC-1.6', 'Airport / Station Setup'],
                ['', 'SRS-CC-1.7', 'Point of Sale (POS) Setup'],
                ['', 'SRS-CC-1.8', 'Policy Setup'],
                ['', 'SRS-CC-1.9', 'Period Setup'],
                ['GL Setup', 'SRS-GL-2.1', 'Parent GL Setup'],
                ['', 'SRS-GL-2.2', 'General Ledger (Subsidiary GL)'],
                ['', 'SRS-GL-2.3', 'Branch Wise GL Code Mapping'],
                ['', 'SRS-GL-2.4', 'Chart of Accounts'],
                ['', 'SRS-GL-2.5', 'Voucher Type wise GL Mapping'],
                ['Party Management', 'SRS-PM-3.1', 'Party Type Setup'],
                ['', 'SRS-PM-3.2', 'Party List & Party Add'],
                ['Operations', 'SRS-OP-4.1', 'Voucher Entry'],
                ['', 'SRS-OP-4.2', 'Voucher List (Search & Review)'],
                ['', 'SRS-OP-4.3', 'Batch Voucher Entry'],
                ['', 'SRS-OP-4.4', 'Batch Voucher List'],
                ['', 'SRS-OP-4.5', 'Fund Transfer'],
                ['Reports', 'SRS-RPT-5.1', 'Transaction Report'],
                ['', 'SRS-RPT-5.2', 'General Ledger Report'],
                ['', 'SRS-RPT-5.3', 'GL Summary Report'],
                ['', 'SRS-RPT-5.4', 'Trial Balance Report'],
                ['', 'SRS-RPT-5.5', 'Trial Balance Extended'],
                ['', 'SRS-RPT-5.6', 'Payment & Receipt Report'],
                ['', 'SRS-RPT-5.7', 'Income Statement'],
                ['', 'SRS-RPT-5.8', 'Balance Sheet'],
                ['', 'SRS-RPT-5.9', 'Cash Flow Report'],
                ['', 'SRS-RPT-5.10', 'Ratio Analysis Report'],
                ['', 'SRS-RPT-5.11', 'Currency Rate Report'],
                ['', 'SRS-RPT-5.12', 'GL Aging Report'],
                ['Ground Handling', 'SRS-GH-6.1', 'Station Management'],
                ['', 'SRS-GH-6.2', 'Supplier Management'],
                ['', 'SRS-GH-6.3', 'Service Management'],
                ['', 'SRS-GH-6.4', 'Criteria Management'],
                ['', 'SRS-GH-6.5', 'Aircraft Setup'],
                ['', 'SRS-GH-6.6', 'Route Setup'],
                ['', 'SRS-GH-6.7', 'Station Wise Agreement'],
                ['', 'SRS-GH-6.8', 'Journey Log'],
                ['', 'SRS-GH-6.9', 'Service Data Entry'],
                ['', 'SRS-GH-6.10', 'Invoice Management'],
                ['', 'SRS-GH-6.11', 'GH Reports & Dashboard'],
                ['Fixed Asset', 'SRS-FA-7.1', 'Asset Group Setup'],
                ['', 'SRS-FA-7.2', 'Value Adjustment Rules'],
                ['', 'SRS-FA-7.3', 'Employee Directory'],
                ['', 'SRS-FA-7.4', 'Asset Recon GL Mapping'],
                ['', 'SRS-FA-7.5', 'Asset Registration'],
                ['', 'SRS-FA-7.6', 'Asset Lifecycle Operations'],
                ['', 'SRS-FA-7.7', 'Fixed Asset Reports'],
                ['Admin', 'SRS-ADM-8.1', 'User Branch Mapping'],
                ['', 'SRS-ADM-8.2', 'System Setup'],
                ['Dashboard', 'SRS-DASH-9.1', 'Dashboard'],
              ].map(([mod, id, name], i) => (
                <tr key={i}>
                  <td className="border border-black p-1.5 font-medium">{mod}</td>
                  <td className="border border-black p-1.5">{id}</td>
                  <td className="border border-black p-1.5">{name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 2.1: Central Configuration */}
        <h2 className="text-xl font-bold mb-4 mt-12">2.1 SRS - Central Configuration</h2>
        {centralConfigRSDs.map((rsd, i) => (
          <div key={i}>
            <h3 className="text-base font-bold mb-2">{rsd.srsId.replace('SRS-CC-', '2.1.')} RSD - {rsd.title}</h3>
            <RSDTable entry={rsd} />
          </div>
        ))}

        {/* Section 2.2: GL Setup */}
        <h2 className="text-xl font-bold mb-4 mt-12">2.2 SRS - GL Setup</h2>
        {glSetupRSDs.map((rsd, i) => (
          <div key={i}>
            <h3 className="text-base font-bold mb-2">{rsd.srsId.replace('SRS-GL-', '2.2.')} RSD - {rsd.title}</h3>
            <RSDTable entry={rsd} />
          </div>
        ))}

        {/* Section 2.3: Party Management */}
        <h2 className="text-xl font-bold mb-4 mt-12">2.3 SRS - Party Management</h2>
        {partyManagementRSDs.map((rsd, i) => (
          <div key={i}>
            <h3 className="text-base font-bold mb-2">{rsd.srsId.replace('SRS-PM-', '2.3.')} RSD - {rsd.title}</h3>
            <RSDTable entry={rsd} />
          </div>
        ))}

        {/* Section 2.4: Operations */}
        <h2 className="text-xl font-bold mb-4 mt-12">2.4 SRS - Operations</h2>
        {operationsRSDs.map((rsd, i) => (
          <div key={i}>
            <h3 className="text-base font-bold mb-2">{rsd.srsId.replace('SRS-OP-', '2.4.')} RSD - {rsd.title}</h3>
            <RSDTable entry={rsd} />
          </div>
        ))}

        {/* Section 2.5: Reports */}
        <h2 className="text-xl font-bold mb-4 mt-12">2.5 SRS - Reports</h2>
        {reportRSDs.map((rsd, i) => (
          <div key={i}>
            <h3 className="text-base font-bold mb-2">{rsd.srsId.replace('SRS-RPT-', '2.5.')} RSD - {rsd.title}</h3>
            <RSDTable entry={rsd} />
          </div>
        ))}

        {/* Section 2.6: Ground Handling */}
        <h2 className="text-xl font-bold mb-4 mt-12">2.6 SRS - Ground Handling Module</h2>
        {groundHandlingRSDs.map((rsd, i) => (
          <div key={i}>
            <h3 className="text-base font-bold mb-2">{rsd.srsId.replace('SRS-GH-', '2.6.')} RSD - {rsd.title}</h3>
            <RSDTable entry={rsd} />
          </div>
        ))}

        {/* Section 2.7: Fixed Asset */}
        <h2 className="text-xl font-bold mb-4 mt-12">2.7 SRS - Fixed Asset Module</h2>
        {fixedAssetRSDs.map((rsd, i) => (
          <div key={i}>
            <h3 className="text-base font-bold mb-2">{rsd.srsId.replace('SRS-FA-', '2.7.')} RSD - {rsd.title}</h3>
            <RSDTable entry={rsd} />
          </div>
        ))}

        {/* Section 2.8: Admin */}
        <h2 className="text-xl font-bold mb-4 mt-12">2.8 SRS - Admin Portal</h2>
        {adminRSDs.map((rsd, i) => (
          <div key={i}>
            <h3 className="text-base font-bold mb-2">{rsd.srsId.replace('SRS-ADM-', '2.8.')} RSD - {rsd.title}</h3>
            <RSDTable entry={rsd} />
          </div>
        ))}

        {/* Section 2.9: Dashboard */}
        <h2 className="text-xl font-bold mb-4 mt-12">2.9 SRS - Dashboard</h2>
        <h3 className="text-base font-bold mb-2">2.9.1 RSD - Dashboard</h3>
        <RSDTable entry={dashboardRSD} />

        {/* Section 3: Dual Accounting Mode */}
        <div className="mt-12" style={{ pageBreakBefore: 'always' }}>
          <h2 className="text-xl font-bold mb-4">3. Dual Accounting Mode (Management & Tax)</h2>
          <table className="w-full border-collapse border border-black text-sm mb-8">
            <tbody>
              <tr>
                <td className="border border-black p-2 font-bold w-[200px] align-top bg-gray-50">Feature</td>
                <td className="border border-black p-2 font-bold bg-gray-50">Management Mode</td>
                <td className="border border-black p-2 font-bold bg-gray-50">Tax Mode</td>
              </tr>
              <tr>
                <td className="border border-black p-2 font-bold">URL Prefix</td>
                <td className="border border-black p-2">/management/*</td>
                <td className="border border-black p-2">/tax/*</td>
              </tr>
              <tr>
                <td className="border border-black p-2 font-bold">GL Visibility</td>
                <td className="border border-black p-2">All ledgers (management + both)</td>
                <td className="border border-black p-2">Only ledgers scoped as 'tax' or 'both'</td>
              </tr>
              <tr>
                <td className="border border-black p-2 font-bold">Voucher Type Mapping</td>
                <td className="border border-black p-2">All mappings visible</td>
                <td className="border border-black p-2">Only mappings where affectsTaxAccounting = true</td>
              </tr>
              <tr>
                <td className="border border-black p-2 font-bold">Tax Exclusion</td>
                <td className="border border-black p-2">Can exclude vouchers/lines from tax</td>
                <td className="border border-black p-2">Included by default, can be excluded later</td>
              </tr>
              <tr>
                <td className="border border-black p-2 font-bold">Re-inclusion</td>
                <td className="border border-black p-2" colSpan={2}>Excluded vouchers can be re-included via Voucher List</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 4: Non-Functional Requirements */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">4. Non-Functional Requirements</h2>
          <table className="w-full border-collapse border border-black text-sm mb-8">
            <tbody>
              <tr><td className="border border-black p-2 font-bold w-[200px] bg-gray-50">Performance</td><td className="border border-black p-2">Page load &lt; 3s. Report generation &lt; 5s. Support 100+ concurrent users.</td></tr>
              <tr><td className="border border-black p-2 font-bold bg-gray-50">Security</td><td className="border border-black p-2">Row-Level Security (RLS) on all database tables. Role-based access control. Complete audit trail. Session management with timeout.</td></tr>
              <tr><td className="border border-black p-2 font-bold bg-gray-50">Usability</td><td className="border border-black p-2">Responsive layout (desktop-first). Consistent UI patterns. Sidebar navigation. Toast notifications. Keyboard-friendly forms.</td></tr>
              <tr><td className="border border-black p-2 font-bold bg-gray-50">Data Integrity</td><td className="border border-black p-2">Foreign key constraints. Double-entry validation (Debit = Credit). Period locking. Audit logging for all modifications.</td></tr>
              <tr><td className="border border-black p-2 font-bold bg-gray-50">Technology Stack</td><td className="border border-black p-2">React 18, TypeScript, Vite, Tailwind CSS, Lovable Cloud (Supabase), TanStack React Query.</td></tr>
              <tr><td className="border border-black p-2 font-bold bg-gray-50">Browser Support</td><td className="border border-black p-2">Chrome, Firefox, Edge (latest versions).</td></tr>
            </tbody>
          </table>
        </div>

        {/* Section 5: Approval */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6">5. Approved by (Client)</h2>
          <table className="w-full border-collapse border border-black text-sm">
            <tbody>
              <tr><td className="border border-black p-3 font-bold w-[200px]">Name</td><td className="border border-black p-3"></td></tr>
              <tr><td className="border border-black p-3 font-bold">Designation</td><td className="border border-black p-3"></td></tr>
              <tr><td className="border border-black p-3 font-bold">Signature</td><td className="border border-black p-3 h-16"></td></tr>
              <tr><td className="border border-black p-3 font-bold">Date</td><td className="border border-black p-3"></td></tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-12 border-t pt-4 text-xs text-gray-500 text-center">
          <p>Functional Requirements Details — Version 1.0</p>
          <p>© 2026 Foodi</p>
        </div>
      </div>
    </div>
  );
}
