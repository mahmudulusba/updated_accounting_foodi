import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useApp } from '@/contexts/AppContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Download, 
  X, 
  Search, 
  Edit2, 
  Trash2, 
  Plus,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Save,
  Check,
  X as XIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { GLSearchDialog } from '@/components/GLSearchDialog';
import { Badge } from '@/components/ui/badge';

// Ratio categories based on the SRS document
const ratioCategories = [
  { id: 'liquidity', name: 'Liquidity Ratios' },
  { id: 'profitability', name: 'Profitability Ratios' },
  { id: 'solvency', name: 'Solvency Ratios' },
  { id: 'efficiency', name: 'Efficiency Ratios / Activity Ratios' },
  { id: 'market', name: 'Market Ratios' },
];

// Predefined ratio definitions
const ratioDefinitions = [
  // Liquidity Ratios
  { id: 'current_ratio', category: 'liquidity', name: 'Current Ratio', formula: 'Current Assets ÷ Current Liabilities', components: ['current_assets', 'current_liabilities'] },
  { id: 'quick_ratio', category: 'liquidity', name: 'Quick Ratio', formula: '(Current Assets - Inventory) ÷ Current Liabilities', components: ['current_assets', 'inventory', 'current_liabilities'] },
  
  // Profitability Ratios
  { id: 'gross_profit_margin', category: 'profitability', name: 'Gross Profit Margin', formula: '(Gross Profit ÷ Net Sales) × 100', components: ['gross_profit', 'net_sales'] },
  { id: 'net_profit_margin', category: 'profitability', name: 'Net Profit Margin', formula: '(Net Profit ÷ Net Sales) × 100', components: ['net_profit', 'net_sales'] },
  
  // Solvency Ratios
  { id: 'debt_to_equity', category: 'solvency', name: 'Debt to Equity', formula: 'Total Liabilities ÷ Total Equity', components: ['total_liabilities', 'total_equity'] },
  { id: 'interest_coverage', category: 'solvency', name: 'Interest Coverage', formula: 'EBIT ÷ Interest Expense', components: ['ebit', 'interest_expense'] },
  
  // Efficiency Ratios
  { id: 'inventory_turnover', category: 'efficiency', name: 'Inventory Turnover', formula: 'COGS ÷ Average Inventory', components: ['cogs', 'avg_inventory'] },
  { id: 'receivables_turnover', category: 'efficiency', name: 'Receivables Turnover', formula: 'Net Credit Sales ÷ Avg Accounts Receivable', components: ['net_credit_sales', 'avg_accounts_receivable'] },
  
  // Market Ratios
  { id: 'eps', category: 'market', name: 'Earnings Per Share (EPS)', formula: 'Net Profit ÷ Shares Outstanding', components: ['net_profit', 'shares_outstanding'] },
  { id: 'pe_ratio', category: 'market', name: 'Price/Earnings (P/E)', formula: 'Market Price Per Share ÷ EPS', components: ['market_price_per_share', 'eps_value'] },
];

// Component definitions for mapping
const componentDefinitions: Record<string, string> = {
  current_assets: 'Current Assets',
  current_liabilities: 'Current Liabilities',
  inventory: 'Inventory',
  gross_profit: 'Gross Profit',
  net_sales: 'Net Sales',
  net_profit: 'Net Profit',
  total_liabilities: 'Total Liabilities',
  total_equity: 'Total Equity',
  ebit: 'EBIT (Earnings Before Interest & Tax)',
  interest_expense: 'Interest Expense',
  cogs: 'Cost of Goods Sold (COGS)',
  avg_inventory: 'Average Inventory',
  net_credit_sales: 'Net Credit Sales',
  avg_accounts_receivable: 'Average Accounts Receivable',
  shares_outstanding: 'Shares Outstanding',
  market_price_per_share: 'Market Price Per Share',
  eps_value: 'EPS Value',
};

interface GLMapping {
  glCode: string;
  glName: string;
}

interface ComponentMapping {
  componentId: string;
  componentName: string;
  parentGLCode: string;
  parentGLName: string;
  glMappings: GLMapping[]; // Changed to array for multiple GLs
}

interface RatioConfig {
  id: string;
  ratioId: string;
  ratioName: string;
  category: string;
  branchCode: string;
  componentMappings: ComponentMapping[];
  status: 'active' | 'inactive';
  createdAt: string;
}

// Default configurations
const defaultConfigs: RatioConfig[] = [
  {
    id: '1',
    ratioId: 'current_ratio',
    ratioName: 'Current Ratio',
    category: 'liquidity',
    branchCode: 'all',
    componentMappings: [
      { componentId: 'current_assets', componentName: 'Current Assets', parentGLCode: '11101', parentGLName: 'Cash & Cash Equivalents', glMappings: [{ glCode: '11101001', glName: 'Head Office Cash' }] },
      { componentId: 'current_liabilities', componentName: 'Current Liabilities', parentGLCode: '21101', parentGLName: 'Accounts Payable', glMappings: [{ glCode: '21101001', glName: 'Accounts Payable' }] },
    ],
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    ratioId: 'quick_ratio',
    ratioName: 'Quick Ratio',
    category: 'liquidity',
    branchCode: 'all',
    componentMappings: [
      { componentId: 'current_assets', componentName: 'Current Assets', parentGLCode: '11101', parentGLName: 'Cash & Cash Equivalents', glMappings: [{ glCode: '11101001', glName: 'Head Office Cash' }, { glCode: '11102001', glName: 'City Bank A/C' }] },
      { componentId: 'inventory', componentName: 'Inventory', parentGLCode: '11201', parentGLName: 'Receivables', glMappings: [{ glCode: '11201001', glName: 'Accounts Receivable' }] },
      { componentId: 'current_liabilities', componentName: 'Current Liabilities', parentGLCode: '21101', parentGLName: 'Accounts Payable', glMappings: [{ glCode: '21101001', glName: 'Accounts Payable' }] },
    ],
    status: 'active',
    createdAt: '2024-01-15',
  },
];

export default function RatioAnalysisConfig() {
  const { selectedBranch, branches, glEntries } = useApp();
  const isConsolidated = selectedBranch?.isConsolidated === true;
  
  const [configs, setConfigs] = useState<RatioConfig[]>(defaultConfigs);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['liquidity']);
  const [editingConfig, setEditingConfig] = useState<RatioConfig | null>(null);
  const [showGLSearch, setShowGLSearch] = useState(false);
  const [currentMappingIndex, setCurrentMappingIndex] = useState<number>(-1);
  const [showForm, setShowForm] = useState(false);
  
  // Form state for new/edit config
  const [formData, setFormData] = useState({
    selectedRatio: '',
    selectedBranch: isConsolidated ? 'all' : (selectedBranch?.code || ''),
    componentMappings: [] as ComponentMapping[],
    status: true,
  });
  
  // Get unique parent GLs with their names derived from child GLs
  const parentGLs = React.useMemo(() => {
    const parentMap = new Map<string, { glType: string; sampleName: string }>();
    glEntries.forEach(gl => {
      if (gl.parentGLCode && !parentMap.has(gl.parentGLCode)) {
        // Use first child GL info to derive a meaningful parent name
        parentMap.set(gl.parentGLCode, { glType: gl.glType, sampleName: gl.glName });
      }
    });
    return Array.from(parentMap.entries()).map(([code, info]) => ({ 
      code, 
      name: `${info.glType} - ${info.sampleName.split(' ')[0]}` // Derive name from type and first word
    })).sort((a, b) => a.code.localeCompare(b.code));
  }, [glEntries]);
  
  // Get GLs filtered by parent GL code
  const getGLsByParentCode = (parentCode: string) => {
    return glEntries.filter(gl => gl.parentGLCode === parentCode && gl.status === 'active');
  };
  
  // Get parent GL name by code
  const getParentGLName = (parentCode: string) => {
    const parent = parentGLs.find(p => p.code === parentCode);
    return parent?.name || parentCode;
  };

  // Available branches based on consolidated status
  const availableBranches = isConsolidated 
    ? branches.filter(b => !b.isConsolidated)
    : branches.filter(b => b.code === selectedBranch?.code);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleRatioSelect = (ratioId: string) => {
    const ratio = ratioDefinitions.find(r => r.id === ratioId);
    if (ratio) {
      const componentMappings: ComponentMapping[] = ratio.components.map(comp => ({
        componentId: comp,
        componentName: componentDefinitions[comp] || comp,
        parentGLCode: '',
        parentGLName: '',
        glMappings: [],
      }));
      setFormData({ ...formData, selectedRatio: ratioId, componentMappings });
    }
  };
  
  const handleParentGLChange = (index: number, parentGLCode: string) => {
    const updatedMappings = [...formData.componentMappings];
    updatedMappings[index] = {
      ...updatedMappings[index],
      parentGLCode,
      parentGLName: getParentGLName(parentGLCode),
      glMappings: [], // Reset GL mappings when parent changes
    };
    setFormData({ ...formData, componentMappings: updatedMappings });
  };
  
  const handleGLToggle = (index: number, gl: { glCode: string; glName: string }) => {
    const updatedMappings = [...formData.componentMappings];
    const currentGLMappings = updatedMappings[index].glMappings;
    const existingIndex = currentGLMappings.findIndex(m => m.glCode === gl.glCode);
    
    if (existingIndex >= 0) {
      // Remove if already selected
      updatedMappings[index].glMappings = currentGLMappings.filter(m => m.glCode !== gl.glCode);
    } else {
      // Add if not selected
      updatedMappings[index].glMappings = [...currentGLMappings, gl];
    }
    
    setFormData({ ...formData, componentMappings: updatedMappings });
  };
  
  const removeGLMapping = (compIndex: number, glCode: string) => {
    const updatedMappings = [...formData.componentMappings];
    updatedMappings[compIndex].glMappings = updatedMappings[compIndex].glMappings.filter(m => m.glCode !== glCode);
    setFormData({ ...formData, componentMappings: updatedMappings });
  };

  // Keep for backward compatibility but not used in new flow
  const handleGLSelect = (gl: { glCode: string; glName: string; parentGLCode: string }) => {
    setShowGLSearch(false);
    setCurrentMappingIndex(-1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.selectedRatio) {
      toast.error('Please select a ratio');
      return;
    }

    const hasEmptyMappings = formData.componentMappings.some(m => !m.parentGLCode || m.glMappings.length === 0);
    if (hasEmptyMappings) {
      toast.error('Please select Parent GL and at least one GL for all components');
      return;
    }

    const ratio = ratioDefinitions.find(r => r.id === formData.selectedRatio);
    if (!ratio) return;

    const newConfig: RatioConfig = {
      id: editingConfig?.id || Date.now().toString(),
      ratioId: ratio.id,
      ratioName: ratio.name,
      category: ratio.category,
      branchCode: formData.selectedBranch,
      componentMappings: formData.componentMappings,
      status: formData.status ? 'active' : 'inactive',
      createdAt: editingConfig?.createdAt || new Date().toISOString().split('T')[0],
    };

    if (editingConfig) {
      setConfigs(configs.map(c => c.id === editingConfig.id ? newConfig : c));
      toast.success('Configuration updated successfully');
    } else {
      setConfigs([...configs, newConfig]);
      toast.success('Configuration created successfully');
    }
    
    handleClear();
    setShowForm(false);
  };

  const handleClear = () => {
    setFormData({
      selectedRatio: '',
      selectedBranch: isConsolidated ? 'all' : (selectedBranch?.code || ''),
      componentMappings: [],
      status: true,
    });
    setEditingConfig(null);
  };

  const handleEdit = (config: RatioConfig) => {
    setEditingConfig(config);
    setFormData({
      selectedRatio: config.ratioId,
      selectedBranch: config.branchCode,
      componentMappings: config.componentMappings,
      status: config.status === 'active',
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setConfigs(configs.filter(c => c.id !== id));
    toast.success('Configuration deleted successfully');
  };

  const getBranchName = (branchCode: string) => {
    if (branchCode === 'all') return 'All Branches';
    const branch = branches.find(b => b.code === branchCode);
    return branch?.name || branchCode;
  };

  const getConfigsByCategory = (categoryId: string) => {
    return configs.filter(c => c.category === categoryId);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <nav className="text-sm text-muted-foreground mb-2">
              <span className="text-primary">Report Configuration</span> / Ratio Analysis Config
            </nav>
            <h1 className="text-2xl font-bold">Ratio Analysis {showForm ? 'Configuration' : '/ List'}</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="default" size="icon">
              <Download className="h-4 w-4" />
            </Button>
            {!showForm ? (
              <Button variant="default" size="icon" onClick={() => { handleClear(); setShowForm(true); }} title="Add">
                <Plus className="h-4 w-4" />
              </Button>
            ) : (
              <Button variant="destructive" size="icon" onClick={() => { handleClear(); setShowForm(false); }} title="Close">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Info Alert for Consolidated Branch */}
        {isConsolidated && (
          <Alert className="bg-blue-50 border-blue-200">
            <AlertTriangle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              You are logged in from Consolidated Branch. Configurations created with "All Branches" will apply to all branches. 
              You can also create branch-specific configurations by selecting a specific branch.
            </AlertDescription>
          </Alert>
        )}

        {/* Configuration Form */}
        {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {editingConfig ? 'Edit Configuration' : 'New Configuration'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Ratio Category Selection */}
                <div className="space-y-2">
                  <Label>Ratio Category<span className="text-destructive">*</span></Label>
                  <Select 
                    value={ratioDefinitions.find(r => r.id === formData.selectedRatio)?.category || ''}
                    onValueChange={(categoryId) => {
                      // Reset ratio when category changes
                      setFormData({ ...formData, selectedRatio: '', componentMappings: [] });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border z-50">
                      {ratioCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Ratio Selection */}
                <div className="space-y-2">
                  <Label>Ratio<span className="text-destructive">*</span></Label>
                  <Select 
                    value={formData.selectedRatio} 
                    onValueChange={handleRatioSelect}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select ratio" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border z-50">
                      {ratioDefinitions.map((ratio) => (
                        <SelectItem key={ratio.id} value={ratio.id}>
                          {ratio.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Show formula if ratio selected */}
              {formData.selectedRatio && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-1">Formula:</p>
                  <p className="text-sm text-muted-foreground">
                    {ratioDefinitions.find(r => r.id === formData.selectedRatio)?.formula}
                  </p>
                </div>
              )}

              {/* Component Mappings */}
              {formData.componentMappings.length > 0 && (
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Component GL Mappings</Label>
                  <div className="space-y-4">
                    {formData.componentMappings.map((mapping, index) => {
                      const availableGLs = getGLsByParentCode(mapping.parentGLCode);
                      
                      return (
                        <div key={mapping.componentId} className="p-4 border rounded-lg bg-card">
                          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {/* Component Name */}
                            <div className="space-y-2">
                              <Label className="text-sm text-muted-foreground">Component</Label>
                              <div className="font-semibold text-foreground">{mapping.componentName}</div>
                            </div>
                            
                            {/* Parent GL Dropdown */}
                            <div className="space-y-2">
                              <Label>Parent GL<span className="text-destructive">*</span></Label>
                              <Select 
                                value={mapping.parentGLCode} 
                                onValueChange={(value) => handleParentGLChange(index, value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Parent GL">
                                    {mapping.parentGLCode && (
                                      <span>{mapping.parentGLCode} - {getParentGLName(mapping.parentGLCode)}</span>
                                    )}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent className="bg-background border z-50 max-h-60">
                                  {parentGLs.map((parent) => (
                                    <SelectItem key={parent.code} value={parent.code}>
                                      {parent.code} - {parent.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            {/* GL Multi-Select */}
                            <div className="space-y-2 lg:col-span-1 md:col-span-2">
                              <Label>GL Accounts<span className="text-destructive">*</span></Label>
                              {mapping.parentGLCode ? (
                                <Select 
                                  value="" 
                                  onValueChange={(glCode) => {
                                    const gl = availableGLs.find(g => g.glCode === glCode);
                                    if (gl) {
                                      handleGLToggle(index, { glCode: gl.glCode, glName: gl.glName });
                                    }
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select GL to add..." />
                                  </SelectTrigger>
                                  <SelectContent className="bg-background border z-50">
                                    {availableGLs.length === 0 ? (
                                      <div className="px-3 py-2 text-sm text-muted-foreground">No GLs found for this Parent GL</div>
                                    ) : (
                                      availableGLs.map((gl) => {
                                        const isSelected = mapping.glMappings.some(m => m.glCode === gl.glCode);
                                        return (
                                          <SelectItem 
                                            key={gl.glCode} 
                                            value={gl.glCode}
                                            disabled={isSelected}
                                          >
                                            <span className="flex items-center gap-2">
                                              {isSelected && <Check className="h-3 w-3 text-primary" />}
                                              {gl.glCode} - {gl.glName}
                                            </span>
                                          </SelectItem>
                                        );
                                      })
                                    )}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <div className="text-sm text-muted-foreground p-2 border rounded-md bg-muted">
                                  Select Parent GL first
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Selected GL Tags */}
                          {mapping.glMappings.length > 0 && (
                            <div className="mt-3 pt-3 border-t">
                              <Label className="text-sm text-muted-foreground mb-2 block">Selected GLs:</Label>
                              <div className="flex flex-wrap gap-2">
                                {mapping.glMappings.map((gl) => (
                                  <Badge 
                                    key={gl.glCode} 
                                    variant="secondary" 
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-primary/10 text-primary border border-primary/20"
                                  >
                                    <span className="font-mono text-xs">{gl.glCode}</span>
                                    <span className="text-muted-foreground">-</span>
                                    <span>{gl.glName}</span>
                                    <button 
                                      type="button"
                                      onClick={() => removeGLMapping(index, gl.glCode)}
                                      className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                                    >
                                      <XIcon className="h-3 w-3" />
                                    </button>
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-center gap-4 pt-4">
                <Button type="button" variant="secondary" onClick={handleClear}>
                  Clear
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {editingConfig ? 'Update' : 'Save Configuration'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        )}

        {/* Existing Configurations by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Configured Ratios</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {ratioCategories.map((category) => {
              const categoryConfigs = getConfigsByCategory(category.id);
              const isExpanded = expandedCategories.includes(category.id);
              
              return (
                <div key={category.id} className="border rounded-lg overflow-hidden">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between p-4 bg-muted hover:bg-muted/80 transition-colors"
                    onClick={() => toggleCategory(category.id)}
                  >
                    <div className="flex items-center gap-3">
                      {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                      <span className="font-semibold">{category.name}</span>
                      <span className="text-sm text-muted-foreground">({categoryConfigs.length} configured)</span>
                    </div>
                  </button>
                  
                  {isExpanded && categoryConfigs.length > 0 && (
                    <div className="border-t">
                      <TableWithSearch>
                        <TableHeader>
                          <TableRow className="bg-table-header hover:bg-table-header">
                            <TableHead className="text-table-header-foreground font-semibold">Ratio Name</TableHead>
                            <TableHead className="text-table-header-foreground font-semibold">Branch</TableHead>
                            <TableHead className="text-table-header-foreground font-semibold">Components Mapped</TableHead>
                            <TableHead className="text-table-header-foreground font-semibold">Status</TableHead>
                            <TableHead className="text-table-header-foreground font-semibold">Created</TableHead>
                            <TableHead className="text-table-header-foreground font-semibold">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {categoryConfigs.map((config, index) => (
                            <TableRow key={config.id} className={index % 2 === 1 ? 'bg-table-row-alt' : ''}>
                              <TableCell className="font-medium">{config.ratioName}</TableCell>
                              <TableCell>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  config.branchCode === 'all' 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {getBranchName(config.branchCode)}
                                </span>
                              </TableCell>
                              <TableCell>{config.componentMappings.length} components</TableCell>
                              <TableCell>
                                <span className={`inline-flex items-center gap-1.5 text-sm ${
                                  config.status === 'active' ? 'text-success' : 'text-muted-foreground'
                                }`}>
                                  <span className={`w-2 h-2 rounded-full ${
                                    config.status === 'active' ? 'bg-success' : 'bg-muted-foreground'
                                  }`}></span>
                                  {config.status === 'active' ? 'Active' : 'Inactive'}
                                </span>
                              </TableCell>
                              <TableCell>{config.createdAt}</TableCell>
                              <TableCell>
                                <div className="flex gap-1">
                                  <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="h-8 w-8 text-primary hover:text-primary"
                                    onClick={() => handleEdit(config)}
                                  >
                                    <Edit2 className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                    onClick={() => handleDelete(config.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </TableWithSearch>
                    </div>
                  )}
                  
                  {isExpanded && categoryConfigs.length === 0 && (
                    <div className="p-4 text-center text-muted-foreground">
                      No ratios configured in this category yet.
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* GL Search Dialog */}
        <GLSearchDialog
          open={showGLSearch}
          onOpenChange={setShowGLSearch}
          glEntries={glEntries}
          onSelect={(gl) => handleGLSelect({
            glCode: gl.glCode,
            glName: gl.glName,
            parentGLCode: gl.parentGLCode,
          })}
        />
      </div>
    </DashboardLayout>
  );
}
