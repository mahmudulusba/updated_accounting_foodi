import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Branch {
  id: string;
  name: string;
  code: string;
  contactPersonName: string;
  contactPersonEmail: string;
  baseCurrency: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  isConsolidated?: boolean; // Special branch for viewing all branch data
}

export type LedgerScope = 'management' | 'tax' | 'both';

export interface GLEntry {
  id: string;
  glName: string;
  glCode: string;
  glType: string;
  currency: string;
  parentGLCode: string;
  isReconGL: boolean;
  reconGLFor: string;
  status: 'active' | 'inactive';
  branchConsolidation: 'all' | 'unique' | 'consolidate';
  ledgerScope: LedgerScope; // Management / Tax / Both
}

export interface GLBranchMapping {
  id: string;
  glCode: string;
  glName: string;
  currency: string;
  branchCode: string;
  branchName: string;
  setupDate: Date;
  glLevel: string;
  status: 'active' | 'inactive';
  autoTransaction: boolean;
  hasTransaction: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  status: 'active' | 'inactive';
  createdAt: Date;
  canAccessTaxEntry: boolean; // Admin-controlled permission for Tax entry
}

export interface UserBranchMapping {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  branchId: string;
  branchCode: string;
  branchName: string;
  accessLevel: 'full' | 'read-only' | 'restricted';
  assignedDate: Date;
  status: 'active' | 'inactive';
}

export interface GLVoucherTypeMapping {
  id: string;
  glCode: string;
  glName: string;
  voucherType: string;
  voucherTypeName: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  hasTransaction: boolean;
  affectsTaxAccounting: boolean; // Whether this voucher type affects Tax Accounting
}

export interface CurrencyRate {
  branchCode: string;
  baseCurrency: string;
  rateToBDT: number;
  rateToUSD: number;
  conversionDate: string;
}

export type PortalType = 'accounting' | 'admin' | 'fixed-asset' | 'revenue-accounting' | 'cost-accounting' | 'budget' | 'lease' | 'purchase-inventory' | 'party-management' | 'foodi-integration' | 'reconciliation';
 export type SecondaryMenuType = 'configuration' | 'operations' | 'report' | 'purchase' | 'inventory' | 'party-config' | 'party-billing';

interface AppContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  currentUser: { email: string; name: string } | null;
  setCurrentUser: (user: { email: string; name: string } | null) => void;
  currentUserDetails: User | null; // Full user details including tax permission
  selectedBranch: Branch | null;
  setSelectedBranch: (branch: Branch | null) => void;
  branches: Branch[];
  setBranches: (branches: Branch[]) => void;
  addBranch: (branch: Omit<Branch, 'id' | 'createdAt'>) => void;
  deleteBranch: (id: string) => void;
  glEntries: GLEntry[];
  setGLEntries: (entries: GLEntry[]) => void;
  addGLEntry: (entry: Omit<GLEntry, 'id'>) => void;
  glBranchMappings: GLBranchMapping[];
  addGLBranchMapping: (mapping: Omit<GLBranchMapping, 'id'>) => void;
  updateGLBranchMapping: (id: string, updates: Partial<GLBranchMapping>) => void;
  deleteGLBranchMapping: (id: string) => void;
  glVoucherTypeMappings: GLVoucherTypeMapping[];
  addGLVoucherTypeMapping: (mapping: Omit<GLVoucherTypeMapping, 'id' | 'createdAt'>) => void;
  updateGLVoucherTypeMapping: (id: string, updates: Partial<GLVoucherTypeMapping>) => void;
  deleteGLVoucherTypeMapping: (id: string) => void;
  users: User[];
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  userBranchMappings: UserBranchMapping[];
  addUserBranchMapping: (mapping: Omit<UserBranchMapping, 'id'>) => void;
  deleteUserBranchMapping: (id: string) => void;
  activePortal: PortalType;
  setActivePortal: (portal: PortalType) => void;
  activeSecondaryMenu: SecondaryMenuType;
  setActiveSecondaryMenu: (menu: SecondaryMenuType) => void;
  currencyRates: CurrencyRate[];
  setCurrencyRates: (rates: CurrencyRate[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultBranches: Branch[] = [
  {
    id: '1',
    name: 'FoodiBD',
    code: 'FOODIBD',
    contactPersonName: 'Foodi Admin',
    contactPersonEmail: 'admin@foodi.com',
    baseCurrency: 'BDT',
    status: 'active',
    createdAt: new Date('2024-01-01'),
  },
];

const defaultGLEntries: GLEntry[] = [
  {
    id: '1',
    glName: 'Head Office Cash',
    glCode: '11101001',
    glType: 'Asset',
    currency: 'BDT',
    parentGLCode: '11101',
    isReconGL: false,
    reconGLFor: '',
    status: 'active',
    branchConsolidation: 'consolidate',
    ledgerScope: 'both',
  },
  {
    id: '2',
    glName: 'City Bank A/C: 1233305341001',
    glCode: '11102001',
    glType: 'Asset',
    currency: 'BDT',
    parentGLCode: '11102',
    isReconGL: true,
    reconGLFor: 'Bank',
    status: 'active',
    branchConsolidation: 'unique',
    ledgerScope: 'both',
  },
  {
    id: '3',
    glName: 'IBBL Bank A/C: 20501770100479609',
    glCode: '11102010',
    glType: 'Asset',
    currency: 'BDT',
    parentGLCode: '11102',
    isReconGL: true,
    reconGLFor: 'Bank',
    status: 'active',
    branchConsolidation: 'all',
    ledgerScope: 'tax',
  },
  {
    id: '4',
    glName: 'SCB Bank A/C: 01357924601',
    glCode: '11102011',
    glType: 'Asset',
    currency: 'BDT',
    parentGLCode: '11102',
    isReconGL: true,
    reconGLFor: 'Bank',
    status: 'active',
    branchConsolidation: 'all',
    ledgerScope: 'management',
  },
  {
    id: '5',
    glName: 'UCB Bank A/C: 0901101000002235',
    glCode: '11102012',
    glType: 'Asset',
    currency: 'BDT',
    parentGLCode: '11102',
    isReconGL: true,
    reconGLFor: 'Bank',
    status: 'active',
    branchConsolidation: 'all',
    ledgerScope: 'both',
  },
  {
    id: '6',
    glName: 'Accounts Receivable',
    glCode: '11201001',
    glType: 'Asset',
    currency: 'BDT',
    parentGLCode: '11201',
    isReconGL: false,
    reconGLFor: '',
    status: 'active',
    branchConsolidation: 'unique',
    ledgerScope: 'both',
  },
  {
    id: '7',
    glName: 'Accounts Payable',
    glCode: '21101001',
    glType: 'Liability',
    currency: 'BDT',
    parentGLCode: '21101',
    isReconGL: false,
    reconGLFor: '',
    status: 'active',
    branchConsolidation: 'consolidate',
    ledgerScope: 'both',
  },
  {
    id: '8',
    glName: 'Sales Revenue',
    glCode: '41101001',
    glType: 'Income',
    currency: 'BDT',
    parentGLCode: '41101',
    isReconGL: false,
    reconGLFor: '',
    status: 'active',
    branchConsolidation: 'all',
    ledgerScope: 'both',
  },
  {
    id: '9',
    glName: 'Office Expenses',
    glCode: '51101001',
    glType: 'Expense',
    currency: 'BDT',
    parentGLCode: '51101',
    isReconGL: false,
    reconGLFor: '',
    status: 'active',
    branchConsolidation: 'unique',
    ledgerScope: 'management',
  },
  {
    id: '10',
    glName: 'Conveyance Expenses',
    glCode: '51102001',
    glType: 'Expense',
    currency: 'BDT',
    parentGLCode: '51102',
    isReconGL: false,
    reconGLFor: '',
    status: 'active',
    branchConsolidation: 'consolidate',
    ledgerScope: 'both',
  },
  {
    id: '11',
    glName: 'Employee Advance (Control)',
    glCode: '11301001',
    glType: 'Asset',
    currency: 'BDT',
    parentGLCode: '11301',
    isReconGL: true,
    reconGLFor: 'GL',
    status: 'active',
    branchConsolidation: 'consolidate',
    ledgerScope: 'both',
  },
  {
    id: '12',
    glName: 'Supplier Advance (Control)',
    glCode: '11302001',
    glType: 'Asset',
    currency: 'BDT',
    parentGLCode: '11302',
    isReconGL: true,
    reconGLFor: 'GL',
    status: 'active',
    branchConsolidation: 'consolidate',
    ledgerScope: 'both',
  },
  {
    id: '13',
    glName: 'Security Deposit - Supplier',
    glCode: '11303001',
    glType: 'Asset',
    currency: 'BDT',
    parentGLCode: '11303',
    isReconGL: true,
    reconGLFor: 'GL',
    status: 'active',
    branchConsolidation: 'consolidate',
    ledgerScope: 'both',
  },
  {
    id: '14',
    glName: 'Customer Advance (Control)',
    glCode: '21201001',
    glType: 'Liability',
    currency: 'BDT',
    parentGLCode: '21201',
    isReconGL: true,
    reconGLFor: 'GL',
    status: 'active',
    branchConsolidation: 'consolidate',
    ledgerScope: 'both',
  },
  {
    id: '15',
    glName: 'Salary & Wages',
    glCode: '51201001',
    glType: 'Expense',
    currency: 'BDT',
    parentGLCode: '51201',
    isReconGL: false,
    reconGLFor: '',
    status: 'active',
    branchConsolidation: 'all',
    ledgerScope: 'both',
  },
  {
    id: '16',
    glName: 'Utility Expenses',
    glCode: '51301001',
    glType: 'Expense',
    currency: 'BDT',
    parentGLCode: '51301',
    isReconGL: false,
    reconGLFor: '',
    status: 'active',
    branchConsolidation: 'unique',
    ledgerScope: 'both',
  },
];

const defaultUsers: User[] = [
  {
    id: '1',
    name: 'Farzana Islam',
    email: 'farzana@foodi.com',
    role: 'admin',
    status: 'active',
    createdAt: new Date('2024-01-01'),
    canAccessTaxEntry: true, // Admin has full access
  },
  {
    id: '2',
    name: 'Farzana Islam',
    email: 'farzana@foodi.com',
    role: 'manager',
    status: 'active',
    createdAt: new Date('2024-01-15'),
    canAccessTaxEntry: true, // Manager with tax access
  },
  {
    id: '3',
    name: 'Md. Mahmudul Hasan',
    email: 'hasan.mahmudul@foodi.com',
    role: 'user',
    status: 'active',
    createdAt: new Date('2024-02-01'),
    canAccessTaxEntry: false, // Regular user without tax access
  },
  {
    id: '4',
    name: 'Farzana Islam',
    email: 'farzana@foodi.com',
    role: 'manager',
    status: 'active',
    createdAt: new Date('2024-02-15'),
    canAccessTaxEntry: false, // Manager without tax access
  },
];

// Default GL-Voucher Type Mappings with dummy data
const defaultGLVoucherTypeMappings: GLVoucherTypeMapping[] = [
  {
    id: '1',
    glCode: '11101001',
    glName: 'Head Office Cash',
    voucherType: 'CP',
    voucherTypeName: 'Cash Payment (CP)',
    status: 'active',
    createdAt: new Date('2024-01-15'),
    hasTransaction: true,
    affectsTaxAccounting: true,
  },
  {
    id: '2',
    glCode: '11101001',
    glName: 'Head Office Cash',
    voucherType: 'CR',
    voucherTypeName: 'Cash Receipt (CR)',
    status: 'active',
    createdAt: new Date('2024-01-15'),
    hasTransaction: true,
    affectsTaxAccounting: true,
  },
  {
    id: '3',
    glCode: '11102001',
    glName: 'City Bank A/C: 1233305341001',
    voucherType: 'BP',
    voucherTypeName: 'Bank Payment (BP)',
    status: 'active',
    createdAt: new Date('2024-01-20'),
    hasTransaction: false,
    affectsTaxAccounting: false,
  },
  {
    id: '4',
    glCode: '11102001',
    glName: 'City Bank A/C: 1233305341001',
    voucherType: 'BR',
    voucherTypeName: 'Bank Receipt (BR)',
    status: 'active',
    createdAt: new Date('2024-01-20'),
    hasTransaction: false,
    affectsTaxAccounting: true,
  },
  {
    id: '5',
    glCode: '11102010',
    glName: 'IBBL Bank A/C: 20501770100479609',
    voucherType: 'BP',
    voucherTypeName: 'Bank Payment (BP)',
    status: 'active',
    createdAt: new Date('2024-02-01'),
    hasTransaction: true,
    affectsTaxAccounting: true,
  },
  {
    id: '6',
    glCode: '11102010',
    glName: 'IBBL Bank A/C: 20501770100479609',
    voucherType: 'BR',
    voucherTypeName: 'Bank Receipt (BR)',
    status: 'active',
    createdAt: new Date('2024-02-01'),
    hasTransaction: false,
    affectsTaxAccounting: false,
  },
  {
    id: '7',
    glCode: '51101001',
    glName: 'Office Expenses',
    voucherType: 'JE',
    voucherTypeName: 'Journal Entry (JE)',
    status: 'active',
    createdAt: new Date('2024-02-05'),
    hasTransaction: false,
    affectsTaxAccounting: false,
  },
  {
    id: '8',
    glCode: '51101001',
    glName: 'Office Expenses',
    voucherType: 'CP',
    voucherTypeName: 'Cash Payment (CP)',
    status: 'active',
    createdAt: new Date('2024-02-05'),
    hasTransaction: false,
    affectsTaxAccounting: false,
  },
  {
    id: '9',
    glCode: '41101001',
    glName: 'Sales Revenue',
    voucherType: 'JE',
    voucherTypeName: 'Journal Entry (JE)',
    status: 'active',
    createdAt: new Date('2024-02-10'),
    hasTransaction: true,
    affectsTaxAccounting: true,
  },
  {
    id: '10',
    glCode: '41101001',
    glName: 'Sales Revenue',
    voucherType: 'CR',
    voucherTypeName: 'Cash Receipt (CR)',
    status: 'active',
    createdAt: new Date('2024-02-10'),
    hasTransaction: false,
    affectsTaxAccounting: true,
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string } | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [branches, setBranches] = useState<Branch[]>(defaultBranches);
  const [glEntries, setGLEntries] = useState<GLEntry[]>(defaultGLEntries);
  // Default GL-Branch Mappings with dummy data
  const defaultGLBranchMappings: GLBranchMapping[] = [
    {
      id: '1',
      glCode: '11101001',
      glName: 'Head Office Cash',
      currency: 'BDT',
      branchCode: 'DHK',
      branchName: 'Dhaka',
      setupDate: new Date('2024-01-15'),
      glLevel: '3',
      status: 'active',
      autoTransaction: true,
      hasTransaction: true, // Has transactions - cannot be edited/deleted
    },
    {
      id: '2',
      glCode: '11102001',
      glName: 'City Bank A/C: 1233305341001',
      currency: 'BDT',
      branchCode: 'DHK',
      branchName: 'Dhaka',
      setupDate: new Date('2024-01-20'),
      glLevel: '3',
      status: 'active',
      autoTransaction: true,
      hasTransaction: false,
    },
    {
      id: '3',
      glCode: '11102010',
      glName: 'IBBL Bank A/C: 20501770100479609',
      currency: 'BDT',
      branchCode: 'DHK',
      branchName: 'Dhaka',
      setupDate: new Date('2024-02-01'),
      glLevel: '3',
      status: 'active',
      autoTransaction: true,
      hasTransaction: true,
    },
    {
      id: '4',
      glCode: '11101001',
      glName: 'Head Office Cash',
      currency: 'SGD',
      branchCode: 'SGP',
      branchName: 'Singapore',
      setupDate: new Date('2024-01-25'),
      glLevel: '3',
      status: 'active',
      autoTransaction: true,
      hasTransaction: false,
    },
    {
      id: '5',
      glCode: '11102001',
      glName: 'City Bank A/C: 1233305341001',
      currency: 'SGD',
      branchCode: 'SGP',
      branchName: 'Singapore',
      setupDate: new Date('2024-02-05'),
      glLevel: '3',
      status: 'active',
      autoTransaction: false,
      hasTransaction: true,
    },
    {
      id: '6',
      glCode: '41101001',
      glName: 'Sales Revenue',
      currency: 'BDT',
      branchCode: 'DHK',
      branchName: 'Dhaka',
      setupDate: new Date('2024-02-10'),
      glLevel: '3',
      status: 'active',
      autoTransaction: true,
      hasTransaction: false,
    },
    {
      id: '7',
      glCode: '51101001',
      glName: 'Office Expenses',
      currency: 'BDT',
      branchCode: 'DHK',
      branchName: 'Dhaka',
      setupDate: new Date('2024-02-15'),
      glLevel: '3',
      status: 'active',
      autoTransaction: true,
      hasTransaction: false,
    },
    {
      id: '8',
      glCode: '41101001',
      glName: 'Sales Revenue',
      currency: 'INR',
      branchCode: 'KOL',
      branchName: 'Kolkata',
      setupDate: new Date('2024-02-20'),
      glLevel: '3',
      status: 'active',
      autoTransaction: true,
      hasTransaction: true,
    },
    {
      id: '9',
      glCode: '21101001',
      glName: 'Accounts Payable',
      currency: 'BDT',
      branchCode: 'DHK',
      branchName: 'Dhaka',
      setupDate: new Date('2024-03-01'),
      glLevel: '3',
      status: 'active',
      autoTransaction: false,
      hasTransaction: false,
    },
    {
      id: '10',
      glCode: '11201001',
      glName: 'Accounts Receivable',
      currency: 'INR',
      branchCode: 'KOL',
      branchName: 'Kolkata',
      setupDate: new Date('2024-03-05'),
      glLevel: '3',
      status: 'inactive',
      autoTransaction: true,
      hasTransaction: false,
    },
  ];

  const [glBranchMappings, setGLBranchMappings] = useState<GLBranchMapping[]>(defaultGLBranchMappings);
  const [glVoucherTypeMappings, setGLVoucherTypeMappings] = useState<GLVoucherTypeMapping[]>(defaultGLVoucherTypeMappings);
  const [users, setUsers] = useState<User[]>(defaultUsers);
  const [userBranchMappings, setUserBranchMappings] = useState<UserBranchMapping[]>([]);
  const [activePortal, setActivePortal] = useState<PortalType>('accounting');
  const [activeSecondaryMenu, setActiveSecondaryMenu] = useState<SecondaryMenuType>('configuration');
  const [currencyRates, setCurrencyRates] = useState<CurrencyRate[]>([
    { branchCode: 'DHK', baseCurrency: 'BDT', rateToBDT: 1, rateToUSD: 0.0084, conversionDate: '2026-01-17' },
    { branchCode: 'SGP', baseCurrency: 'SGD', rateToBDT: 95.1, rateToUSD: 0.78, conversionDate: '2026-01-17' },
    { branchCode: 'KOL', baseCurrency: 'INR', rateToBDT: 1.35, rateToUSD: 0.011, conversionDate: '2026-01-17' },
  ]);

  const addBranch = (branch: Omit<Branch, 'id' | 'createdAt'>) => {
    const newBranch: Branch = {
      ...branch,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setBranches([...branches, newBranch]);
  };

  const deleteBranch = (id: string) => {
    setBranches(branches.filter(b => b.id !== id));
  };

  const addGLEntry = (entry: Omit<GLEntry, 'id'>) => {
    const newEntry: GLEntry = {
      ...entry,
      id: Date.now().toString(),
    };
    setGLEntries([...glEntries, newEntry]);
  };

  const addGLBranchMapping = (mapping: Omit<GLBranchMapping, 'id'>) => {
    const newMapping: GLBranchMapping = {
      ...mapping,
      id: Date.now().toString(),
    };
    setGLBranchMappings([...glBranchMappings, newMapping]);
  };

  const updateGLBranchMapping = (id: string, updates: Partial<GLBranchMapping>) => {
    setGLBranchMappings(glBranchMappings.map(m => 
      m.id === id ? { ...m, ...updates } : m
    ));
  };

  const deleteGLBranchMapping = (id: string) => {
    setGLBranchMappings(glBranchMappings.filter(m => m.id !== id));
  };

  const addGLVoucherTypeMapping = (mapping: Omit<GLVoucherTypeMapping, 'id' | 'createdAt'>) => {
    const newMapping: GLVoucherTypeMapping = {
      ...mapping,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setGLVoucherTypeMappings([...glVoucherTypeMappings, newMapping]);
  };

  const updateGLVoucherTypeMapping = (id: string, updates: Partial<GLVoucherTypeMapping>) => {
    setGLVoucherTypeMappings(glVoucherTypeMappings.map(m => 
      m.id === id ? { ...m, ...updates } : m
    ));
  };

  const deleteGLVoucherTypeMapping = (id: string) => {
    setGLVoucherTypeMappings(glVoucherTypeMappings.filter(m => m.id !== id));
  };

  const addUser = (user: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setUsers([...users, newUser]);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(users.map(u => u.id === id ? { ...u, ...updates } : u));
  };

  const deleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  // Get current user full details based on email
  const currentUserDetails = currentUser 
    ? users.find(u => u.email === currentUser.email) || null 
    : null;

  const addUserBranchMapping = (mapping: Omit<UserBranchMapping, 'id'>) => {
    const newMapping: UserBranchMapping = {
      ...mapping,
      id: Date.now().toString(),
    };
    setUserBranchMappings([...userBranchMappings, newMapping]);
  };

  const deleteUserBranchMapping = (id: string) => {
    setUserBranchMappings(userBranchMappings.filter(m => m.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        currentUser,
        setCurrentUser,
        currentUserDetails,
        selectedBranch,
        setSelectedBranch,
        branches,
        setBranches,
        addBranch,
        deleteBranch,
        glEntries,
        setGLEntries,
        addGLEntry,
        glBranchMappings,
        addGLBranchMapping,
        updateGLBranchMapping,
        deleteGLBranchMapping,
        glVoucherTypeMappings,
        addGLVoucherTypeMapping,
        updateGLVoucherTypeMapping,
        deleteGLVoucherTypeMapping,
        users,
        addUser,
        updateUser,
        deleteUser,
        userBranchMappings,
        addUserBranchMapping,
        deleteUserBranchMapping,
        activePortal,
        setActivePortal,
        activeSecondaryMenu,
        setActiveSecondaryMenu,
        currencyRates,
        setCurrencyRates,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
