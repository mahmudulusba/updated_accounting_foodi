/**
 * Pricing Engine: evaluates pricing rules against flight data
 * to compute forecasted service costs.
 */

import type { PricingRule, SlabRow, ConditionRow } from '@/components/ground-handling/PricingRulesModal';

export interface FlightContext {
  aircraftType: string;
  aircraftCategory: string;
  mtow: number;        // in KG
  seats: number;
  paxCount: number;
  delayMinutes: number;
  cancellationHours: number;
  flightType: string;  // Technical | Ferry | Commercial
  isInternational: boolean;
  isCargo: boolean;
  isCharter: boolean;
  turnaroundHours: number;
  bags: number;
}

export interface EvalResult {
  ruleName: string;
  ruleId: string;
  amount: number;
  breakdown: string;
}

// Get numeric context value for a condition field
function getContextValue(ctx: FlightContext, field: string): string | number | boolean {
  switch (field) {
    case 'Aircraft Type':      return ctx.aircraftType;
    case 'Aircraft Category':  return ctx.aircraftCategory;
    case 'MTOW':               return ctx.mtow;
    case 'Seats':              return ctx.seats;
    case 'Pax Count':          return ctx.paxCount;
    case 'Delay Minutes':      return ctx.delayMinutes;
    case 'Cancellation Hours': return ctx.cancellationHours;
    case 'Flight Type':        return ctx.flightType;
    case 'Is International':   return ctx.isInternational;
    case 'Is Cargo':           return ctx.isCargo;
    case 'Is Charter':         return ctx.isCharter;
    default: return '';
  }
}

function evalCondition(cond: ConditionRow, ctx: FlightContext): boolean {
  const val = getContextValue(ctx, cond.field);
  const target = cond.value;

  // Boolean fields
  if (typeof val === 'boolean') {
    return cond.operator === '=' ? val === (target === 'true') : val !== (target === 'true');
  }

  // Numeric comparisons
  if (typeof val === 'number') {
    const num = Number(target);
    switch (cond.operator) {
      case '=':  return val === num;
      case '!=': return val !== num;
      case '>':  return val > num;
      case '<':  return val < num;
      case '>=': return val >= num;
      case '<=': return val <= num;
      case 'between': {
        const [lo, hi] = target.split('-').map(Number);
        return val >= lo && val <= hi;
      }
      default: return false;
    }
  }

  // String comparisons
  const strVal = String(val).toLowerCase();
  switch (cond.operator) {
    case '=':  return strVal === target.toLowerCase();
    case '!=': return strVal !== target.toLowerCase();
    case 'in': return target.split(',').map(s => s.trim().toLowerCase()).includes(strVal);
    default: return false;
  }
}

function evalConditions(conditions: ConditionRow[], ctx: FlightContext): boolean {
  if (conditions.length === 0) return true;

  let result = evalCondition(conditions[0], ctx);

  for (let i = 1; i < conditions.length; i++) {
    const cond = conditions[i];
    const val = evalCondition(cond, ctx);
    if (cond.logic === 'AND') {
      result = result && val;
    } else {
      result = result || val;
    }
  }

  return result;
}

function getUnitMultiplier(perUnit: string, ctx: FlightContext): number {
  switch (perUnit) {
    case 'Turnaround': return 1;
    case 'Hour':       return ctx.turnaroundHours || 1;
    case 'Pax':        return ctx.paxCount;
    case 'Bag':        return ctx.bags;
    case 'Seat':       return ctx.seats;
    case 'KG':         return ctx.mtow;
    case 'Landing':    return 1;
    case 'Flight':     return 1;
    case 'Movement':   return 1;
    default:           return 1;
  }
}

function evalSlab(slabs: SlabRow[], value: number): number {
  let total = 0;
  for (const slab of slabs) {
    if (value < slab.from) break;
    const upper = slab.to !== null ? Math.min(value, slab.to) : value;
    const qty = upper - slab.from;
    const scale = slab.unitScale === 'Per 1000 KG' ? 1000 : 1;
    total += (qty / scale) * slab.rate;
  }
  return total;
}

/**
 * Evaluate all pricing rules for a service against flight context.
 * Returns the first matching rule result (by priority).
 */
export function evaluateServiceRules(
  rules: PricingRule[],
  ctx: FlightContext,
  resolveBaseServiceAmount?: (serviceName: string) => number,
): EvalResult | null {
  // Sort by priority ascending
  const sorted = [...rules].sort((a, b) => a.priority - b.priority);

  for (const rule of sorted) {
    // Check effective dates
    const now = new Date();
    if (rule.effectiveFrom && now < rule.effectiveFrom) continue;
    if (rule.effectiveTo && now > rule.effectiveTo) continue;

    // Evaluate conditions
    if (!evalConditions(rule.conditions, ctx)) continue;

    let amount = 0;
    let breakdown = '';

    switch (rule.rateStructureType) {
      case 'Fixed Amount':
        amount = rule.rate;
        breakdown = `Fixed: ${rule.rate}`;
        break;

      case 'Per Unit': {
        const mult = getUnitMultiplier(rule.perUnit, ctx);
        amount = rule.rate * mult;
        breakdown = `${rule.rate} × ${mult} ${rule.perUnit} = ${amount}`;
        break;
      }

      case 'Slab Based':
        amount = evalSlab(rule.slabs, ctx.mtow); // default slab on MTOW
        breakdown = `Slab on MTOW (${ctx.mtow} KG) = ${amount}`;
        break;

      case 'Percentage of Another Service': {
        const base = resolveBaseServiceAmount?.(rule.baseServiceRef) ?? 0;
        amount = base * (rule.percentage / 100);
        breakdown = `${rule.percentage}% of ${rule.baseServiceRef} (${base}) = ${amount}`;
        break;
      }

      case 'Rebate %':
        amount = -(rule.rate * (rule.percentage / 100));
        breakdown = `Rebate ${rule.percentage}% on ${rule.rate} = ${amount}`;
        break;

      case 'Cost + %': {
        const base2 = resolveBaseServiceAmount?.(rule.baseServiceRef) ?? 0;
        amount = base2 + base2 * (rule.percentage / 100);
        breakdown = `Cost (${base2}) + ${rule.percentage}% = ${amount}`;
        break;
      }

      case 'One-time':
        amount = rule.rate;
        breakdown = `One-time: ${rule.rate}`;
        break;

      case 'Annual':
        amount = rule.rate / 12; // monthly allocation
        breakdown = `Annual ${rule.rate} / 12 = ${amount.toFixed(2)}`;
        break;

      case 'Monthly Interest':
        amount = rule.rate * (rule.percentage / 100);
        breakdown = `Monthly interest ${rule.percentage}% on ${rule.rate} = ${amount}`;
        break;
    }

    return {
      ruleName: rule.name,
      ruleId: rule.id,
      amount: Math.round(amount * 100) / 100,
      breakdown,
    };
  }

  return null;
}
