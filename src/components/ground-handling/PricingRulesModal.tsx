import React, { useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { EnhancedCalendar } from '@/components/ui/enhanced-calendar';
import { format } from 'date-fns';
import {
  Plus, Trash2, ChevronDown, ChevronUp, Calendar, Copy, GripVertical,
  Settings2, Layers, ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';

// ─── Types ───────────────────────────────────────────────
export const RATE_STRUCTURE_TYPES = [
  'Fixed Amount',
  'Per Unit',
  'Slab Based',
  'Percentage of Another Service',
  'Rebate %',
  'Cost + %',
  'One-time',
  'Annual',
  'Monthly Interest',
] as const;

export type RateStructureType = (typeof RATE_STRUCTURE_TYPES)[number];

export const PER_UNIT_OPTIONS = ['Turnaround', 'Hour', 'Pax', 'Bag', 'Seat', 'KG', 'Landing', 'Flight', 'Movement'];

export const CONDITION_FIELDS = [
  'Aircraft Type',
  'Aircraft Category',
  'MTOW',
  'Seats',
  'Pax Count',
  'Delay Minutes',
  'Cancellation Hours',
  'Flight Type',
  'Is International',
  'Is Cargo',
  'Is Charter',
] as const;

export const CONDITION_OPERATORS = ['=', '!=', '>', '<', '>=', '<=', 'in', 'between'] as const;

const FLIGHT_TYPES = ['Technical', 'Ferry', 'Commercial'];
const AIRCRAFT_TYPES = ['B737-800', 'A330', 'ATR', 'B787', 'DHC-8', 'A320'];
const AIRCRAFT_CATEGORIES = ['Narrow Body', 'Wide Body', 'Turboprop', 'Regional Jet'];

export interface SlabRow {
  id: string;
  from: number;
  to: number | null;
  rate: number;
  unitScale: string;
}

export interface ConditionRow {
  id: string;
  field: string;
  operator: string;
  value: string;
  logic: 'AND' | 'OR';
}

export interface PricingRule {
  id: string;
  name: string;
  effectiveFrom?: Date;
  effectiveTo?: Date;
  conditions: ConditionRow[];
  rateStructureType: RateStructureType;
  rate: number;
  perUnit: string;
  baseServiceRef: string;
  percentage: number;
  slabs: SlabRow[];
  priority: number;
}

interface PricingRulesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceName: string;
  rules: PricingRule[];
  onSave: (rules: PricingRule[]) => void;
  allServices: string[];
}

const createEmptyCondition = (): ConditionRow => ({
  id: crypto.randomUUID(),
  field: '',
  operator: '=',
  value: '',
  logic: 'AND',
});

const createEmptySlab = (): SlabRow => ({
  id: crypto.randomUUID(),
  from: 0,
  to: null,
  rate: 0,
  unitScale: 'Per Unit',
});

const createEmptyRule = (priority: number): PricingRule => ({
  id: crypto.randomUUID(),
  name: '',
  effectiveFrom: undefined,
  effectiveTo: undefined,
  conditions: [],
  rateStructureType: 'Fixed Amount',
  rate: 0,
  perUnit: 'Turnaround',
  baseServiceRef: '',
  percentage: 0,
  slabs: [],
  priority,
});

// helper to get value options for a condition field
const getValueOptions = (field: string): string[] | null => {
  switch (field) {
    case 'Aircraft Type': return AIRCRAFT_TYPES;
    case 'Aircraft Category': return AIRCRAFT_CATEGORIES;
    case 'Flight Type': return FLIGHT_TYPES;
    case 'Is International':
    case 'Is Cargo':
    case 'Is Charter':
      return ['true', 'false'];
    default:
      return null; // free-text / numeric
  }
};

// ─── Sub-components ──────────────────────────────────────

function ConditionsBuilder({
  conditions,
  onChange,
}: {
  conditions: ConditionRow[];
  onChange: (c: ConditionRow[]) => void;
}) {
  const update = (id: string, patch: Partial<ConditionRow>) =>
    onChange(conditions.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Conditions
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 text-xs"
          onClick={() => onChange([...conditions, createEmptyCondition()])}
        >
          <Plus className="h-3 w-3 mr-1" /> Add Condition
        </Button>
      </div>

      {conditions.length === 0 && (
        <p className="text-xs text-muted-foreground italic">
          No conditions — rule applies to all flights.
        </p>
      )}

      {conditions.map((cond, idx) => {
        const valueOptions = getValueOptions(cond.field);
        return (
          <div key={cond.id} className="flex items-center gap-2">
            {idx > 0 && (
              <Select
                value={cond.logic}
                onValueChange={(v) => update(cond.id, { logic: v as 'AND' | 'OR' })}
              >
                <SelectTrigger className="w-16 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover z-[9999]">
                  <SelectItem value="AND">AND</SelectItem>
                  <SelectItem value="OR">OR</SelectItem>
                </SelectContent>
              </Select>
            )}
            {idx === 0 && <div className="w-16" />}

            {/* Field */}
            <Select value={cond.field} onValueChange={(v) => update(cond.id, { field: v, value: '' })}>
              <SelectTrigger className="w-40 h-8 text-xs">
                <SelectValue placeholder="Field" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-[9999]">
                {CONDITION_FIELDS.map((f) => (
                  <SelectItem key={f} value={f}>{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Operator */}
            <Select value={cond.operator} onValueChange={(v) => update(cond.id, { operator: v })}>
              <SelectTrigger className="w-20 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover z-[9999]">
                {CONDITION_OPERATORS.map((o) => (
                  <SelectItem key={o} value={o}>{o}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Value */}
            {valueOptions ? (
              <Select value={cond.value} onValueChange={(v) => update(cond.id, { value: v })}>
                <SelectTrigger className="flex-1 h-8 text-xs">
                  <SelectValue placeholder="Value" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-[9999]">
                  {valueOptions.map((v) => (
                    <SelectItem key={v} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                className="flex-1 h-8 text-xs"
                placeholder="Value"
                value={cond.value}
                onChange={(e) => update(cond.id, { value: e.target.value })}
              />
            )}

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive"
              onClick={() => onChange(conditions.filter((c) => c.id !== cond.id))}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        );
      })}
    </div>
  );
}

function SlabBuilder({
  slabs,
  onChange,
}: {
  slabs: SlabRow[];
  onChange: (s: SlabRow[]) => void;
}) {
  const update = (id: string, patch: Partial<SlabRow>) =>
    onChange(slabs.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Slab Configuration
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 text-xs"
          onClick={() => onChange([...slabs, createEmptySlab()])}
        >
          <Plus className="h-3 w-3 mr-1" /> Add Slab
        </Button>
      </div>

      {slabs.length > 0 && (
        <div className="border rounded-md overflow-hidden">
          <div className="grid grid-cols-[1fr_1fr_1fr_120px_40px] gap-2 px-3 py-2 bg-muted/50 text-xs font-medium text-muted-foreground">
            <span>From</span>
            <span>To</span>
            <span>Rate</span>
            <span>Unit Scale</span>
            <span />
          </div>
          {slabs.map((slab) => (
            <div
              key={slab.id}
              className="grid grid-cols-[1fr_1fr_1fr_120px_40px] gap-2 px-3 py-1.5 border-t items-center"
            >
              <Input
                type="number"
                className="h-7 text-xs"
                value={slab.from}
                onChange={(e) => update(slab.id, { from: Number(e.target.value) })}
              />
              <Input
                type="number"
                className="h-7 text-xs"
                placeholder="∞"
                value={slab.to ?? ''}
                onChange={(e) =>
                  update(slab.id, { to: e.target.value ? Number(e.target.value) : null })
                }
              />
              <Input
                type="number"
                className="h-7 text-xs"
                value={slab.rate}
                onChange={(e) => update(slab.id, { rate: Number(e.target.value) })}
              />
              <Select value={slab.unitScale} onValueChange={(v) => update(slab.id, { unitScale: v })}>
                <SelectTrigger className="h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover z-[9999]">
                  <SelectItem value="Per Unit">Per Unit</SelectItem>
                  <SelectItem value="Per KG">Per KG</SelectItem>
                  <SelectItem value="Per 1000 KG">Per 1000 KG</SelectItem>
                  <SelectItem value="Per Pax">Per Pax</SelectItem>
                  <SelectItem value="Per Bag">Per Bag</SelectItem>
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive"
                onClick={() => onChange(slabs.filter((s) => s.id !== slab.id))}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Single Rule Editor ──────────────────────────────────
function RuleEditor({
  rule,
  onChange,
  onDelete,
  onDuplicate,
  allServices,
  currentService,
}: {
  rule: PricingRule;
  onChange: (r: PricingRule) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  allServices: string[];
  currentService: string;
}) {
  const [expanded, setExpanded] = useState(true);

  const needsBaseService =
    rule.rateStructureType === 'Percentage of Another Service' ||
    rule.rateStructureType === 'Cost + %';
  const needsSlabs = rule.rateStructureType === 'Slab Based';
  const needsPerUnit = rule.rateStructureType === 'Per Unit';
  const needsPercentage =
    rule.rateStructureType === 'Percentage of Another Service' ||
    rule.rateStructureType === 'Rebate %' ||
    rule.rateStructureType === 'Cost + %' ||
    rule.rateStructureType === 'Monthly Interest';

  const otherServices = allServices.filter((s) => s !== currentService);

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Rule header */}
      <div
        className="flex items-center gap-2 px-4 py-3 bg-muted/30 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        <span className="font-medium text-sm flex-1">
          {rule.name || 'Untitled Rule'}
        </span>
        <Badge variant="outline" className="text-xs">
          {rule.rateStructureType}
        </Badge>
        {rule.conditions.length > 0 && (
          <Badge className="text-xs bg-primary/10 text-primary border-primary/20">
            {rule.conditions.length} condition{rule.conditions.length > 1 ? 's' : ''}
          </Badge>
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
          title="Duplicate rule"
        >
          <Copy className="h-3 w-3" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-destructive"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          title="Delete rule"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

      {expanded && (
        <div className="p-4 space-y-4">
          {/* Basic info */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <Label className="text-xs">Rule Name *</Label>
              <Input
                className="h-8 text-sm"
                placeholder="e.g. Standard Rate"
                value={rule.name}
                onChange={(e) => onChange({ ...rule, name: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Priority</Label>
              <Input
                type="number"
                className="h-8 text-sm"
                value={rule.priority}
                onChange={(e) => onChange({ ...rule, priority: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Effective From</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full h-8 text-xs justify-start">
                    <Calendar className="h-3 w-3 mr-1" />
                    {rule.effectiveFrom ? format(rule.effectiveFrom, 'dd-MMM-yyyy') : 'Select'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-popover z-[9999]" align="start">
                  <EnhancedCalendar
                    mode="single"
                    selected={rule.effectiveFrom}
                    onSelect={(d) => onChange({ ...rule, effectiveFrom: d })}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Effective To</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full h-8 text-xs justify-start">
                    <Calendar className="h-3 w-3 mr-1" />
                    {rule.effectiveTo ? format(rule.effectiveTo, 'dd-MMM-yyyy') : 'Select'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-popover z-[9999]" align="start">
                  <EnhancedCalendar
                    mode="single"
                    selected={rule.effectiveTo}
                    onSelect={(d) => onChange({ ...rule, effectiveTo: d })}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Conditions */}
          <ConditionsBuilder
            conditions={rule.conditions}
            onChange={(c) => onChange({ ...rule, conditions: c })}
          />

          {/* Rate Structure */}
          <div className="space-y-3">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Rate Structure
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label className="text-xs">Type *</Label>
                <Select
                  value={rule.rateStructureType}
                  onValueChange={(v) =>
                    onChange({
                      ...rule,
                      rateStructureType: v as RateStructureType,
                      slabs: v === 'Slab Based' && rule.slabs.length === 0 ? [createEmptySlab()] : rule.slabs,
                    })
                  }
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-[9999]">
                    {RATE_STRUCTURE_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {!needsSlabs && !needsPercentage && (
                <div className="space-y-1">
                  <Label className="text-xs">Rate / Amount</Label>
                  <Input
                    type="number"
                    className="h-8 text-sm"
                    value={rule.rate}
                    onChange={(e) => onChange({ ...rule, rate: Number(e.target.value) })}
                  />
                </div>
              )}

              {needsPerUnit && (
                <div className="space-y-1">
                  <Label className="text-xs">Per Unit Type</Label>
                  <Select value={rule.perUnit} onValueChange={(v) => onChange({ ...rule, perUnit: v })}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-[9999]">
                      {PER_UNIT_OPTIONS.map((u) => (
                        <SelectItem key={u} value={u}>{u}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {needsPercentage && (
                <div className="space-y-1">
                  <Label className="text-xs">Percentage (%)</Label>
                  <Input
                    type="number"
                    className="h-8 text-sm"
                    value={rule.percentage}
                    onChange={(e) => onChange({ ...rule, percentage: Number(e.target.value) })}
                  />
                </div>
              )}

              {needsBaseService && (
                <div className="space-y-1">
                  <Label className="text-xs">Base Service Reference</Label>
                  <Select
                    value={rule.baseServiceRef}
                    onValueChange={(v) => onChange({ ...rule, baseServiceRef: v })}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Select base service" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-[9999] max-h-60">
                      {otherServices.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          {/* Slab config */}
          {needsSlabs && (
            <SlabBuilder
              slabs={rule.slabs}
              onChange={(s) => onChange({ ...rule, slabs: s })}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Modal ──────────────────────────────────────────
export function PricingRulesModal({
  open,
  onOpenChange,
  serviceName,
  rules,
  onSave,
  allServices,
}: PricingRulesModalProps) {
  const [localRules, setLocalRules] = useState<PricingRule[]>(rules);

  // Reset local state when opening
  React.useEffect(() => {
    if (open) setLocalRules(rules.length > 0 ? rules : []);
  }, [open, rules]);

  const handleAddRule = () => {
    setLocalRules([...localRules, createEmptyRule(localRules.length + 1)]);
  };

  const handleUpdateRule = (id: string, updated: PricingRule) => {
    setLocalRules(localRules.map((r) => (r.id === id ? updated : r)));
  };

  const handleDeleteRule = (id: string) => {
    setLocalRules(localRules.filter((r) => r.id !== id));
  };

  const handleDuplicateRule = (rule: PricingRule) => {
    const dup: PricingRule = {
      ...JSON.parse(JSON.stringify(rule)),
      id: crypto.randomUUID(),
      name: `${rule.name} (Copy)`,
      priority: localRules.length + 1,
    };
    setLocalRules([...localRules, dup]);
  };

  const handleSave = () => {
    const unnamed = localRules.find((r) => !r.name.trim());
    if (unnamed) {
      toast.error('All rules must have a name');
      return;
    }
    onSave(localRules);
    onOpenChange(false);
    toast.success(`${localRules.length} pricing rule(s) saved for "${serviceName}"`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-primary" />
            Pricing Rules — {serviceName}
          </DialogTitle>
          <DialogDescription>
            Configure rule-based pricing with conditions, slabs, and dependency logic.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {localRules.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Layers className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No pricing rules configured yet.</p>
              <p className="text-xs">Click "Add Rule" to create your first pricing rule.</p>
            </div>
          )}

          {localRules.map((rule) => (
            <RuleEditor
              key={rule.id}
              rule={rule}
              onChange={(r) => handleUpdateRule(rule.id, r)}
              onDelete={() => handleDeleteRule(rule.id)}
              onDuplicate={() => handleDuplicateRule(rule)}
              allServices={allServices}
              currentService={serviceName}
            />
          ))}
        </div>

        <DialogFooter className="flex items-center justify-between gap-2 sm:justify-between">
          <Button type="button" variant="outline" onClick={handleAddRule}>
            <Plus className="h-4 w-4 mr-1" /> Add Rule
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSave}>
              Save Rules ({localRules.length})
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
