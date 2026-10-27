import { z } from 'zod';

export const SupportedLanguage = z.enum(['English', 'Tamil', 'Hindi', 'Telugu']);
export const CheckInEvent = z.object({ type: z.enum(['in', 'out']), method: z.enum(['qr', 'geo', 'manual']).default('qr') });
export const HazardReport = z.object({ category: z.string().min(2).max(60), zone: z.string().min(1).max(80), text: z.string().max(2000).optional().default(''), language: SupportedLanguage.default('English') });
export const RulePackSchema = z.object({
  id: z.string().min(1), sector: z.enum(['construction', 'college', 'hospital', 'factory']), version: z.string().min(1),
  asOf: z.string().date(), verified: z.boolean(), dailyStandard: z.number().positive().max(24), weeklyStandard: z.number().positive().max(168),
  overtimeMultiplier: z.number().min(1).max(5), minRestHours: z.number().min(0).max(48), maxConsecutiveDays: z.number().int().min(1).max(31),
  source: z.string().min(1), kind: z.enum(['demo', 'policy', 'legal'])
});
export type SupportedLanguage = z.infer<typeof SupportedLanguage>;
export type RulePack = z.infer<typeof RulePackSchema>;

export type WorkInterval = { start: string | number | Date; end: string | number | Date; kind?: 'day' | 'night' | 'split' };
export function computeWorkedIntervals(receipts: Array<{type: 'in'|'out'; created_at: string; id?: number}>) {
  const sorted = [...receipts].sort((a,b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  const intervals: Array<{start:string;end:string;hours:number;flags:string[]}> = [];
  const anomalies: Array<{receiptId?:number;reason:string}> = [];
  let open: typeof sorted[number] | undefined;
  for (const receipt of sorted) {
    if (receipt.type === 'in') {
      if (open) { anomalies.push({receiptId:receipt.id, reason:'Repeated check-in before check-out'}); continue; }
      open = receipt;
    } else if (!open) anomalies.push({receiptId:receipt.id, reason:'Check-out without a preceding check-in'});
    else {
      const start = new Date(open.created_at).getTime(); const end = new Date(receipt.created_at).getTime();
      if (end <= start) anomalies.push({receiptId:receipt.id, reason:'Non-positive shift interval'});
      else intervals.push({start:open.created_at,end:receipt.created_at,hours:Number(((end-start)/3600000).toFixed(4)),flags:[]});
      open = undefined;
    }
  }
  if (open) anomalies.push({receiptId:open.id, reason:'Unclosed shift; waiting for check-out'});
  return { intervals, anomalies, totalHours: Number(intervals.reduce((s,i)=>s+i.hours,0).toFixed(2)) };
}

/** Daily and weekly overtime are combined by taking the larger total, preventing double-counting hours already counted daily. */
export function computeOvertime(hoursByDay: number[], dailyStandard = 8, weeklyStandard = 48) {
  if (!Array.isArray(hoursByDay) || hoursByDay.some(h => !Number.isFinite(h) || h < 0 || h > 24)) throw new Error('Each daily hours value must be between 0 and 24');
  if (!Number.isFinite(dailyStandard) || dailyStandard <= 0 || dailyStandard > 24 || !Number.isFinite(weeklyStandard) || weeklyStandard <= 0) throw new Error('Invalid standard hours');
  const regularTotal = hoursByDay.reduce((sum,h)=>sum+Math.min(h,dailyStandard),0);
  const dailyOvertime = hoursByDay.reduce((sum,h)=>sum+Math.max(0,h-dailyStandard),0);
  const weeklyOvertime = Math.max(0,hoursByDay.reduce((sum,h)=>sum+h,0)-weeklyStandard);
  const overtimeHours = Math.max(dailyOvertime, weeklyOvertime);
  return { totalHours: Number(hoursByDay.reduce((sum,h)=>sum+h,0).toFixed(2)), regularHours: Number(Math.max(0,hoursByDay.reduce((sum,h)=>sum+h,0)-overtimeHours).toFixed(2)), dailyOvertimeHours: Number(dailyOvertime.toFixed(2)), weeklyOvertimeHours: Number(weeklyOvertime.toFixed(2)), overtimeHours: Number(overtimeHours.toFixed(2)), note: 'Illustrative calculation; combined daily/weekly thresholds use the larger overtime total to avoid double-counting. Confirm local rules.' };
}

export function computeOvertimeAmount(hoursByDay:number[], hourlyRate:number, multiplier=2, dailyStandard=8, weeklyStandard=48) {
  if (!Number.isFinite(hourlyRate) || hourlyRate < 0 || !Number.isFinite(multiplier) || multiplier < 1 || multiplier > 5) throw new Error('Invalid pay rate or multiplier');
  const result = computeOvertime(hoursByDay,dailyStandard,weeklyStandard);
  return {...result, hourlyRate, multiplier, overtimeAmount: Number((result.overtimeHours*hourlyRate*multiplier).toFixed(2))};
}

export function fatigueScore(input:{hoursLast24h:number;hoursLast7d:number;restGapHours:number;consecutiveDays:number;nightShiftStreak:number;heatExposure?:number}) {
  const weights = {hoursLast24h:25,hoursLast7d:20,restGap:20,consecutiveDays:15,nightStreak:10,heat:10};
  const parts = {
    hoursLast24h: Math.min(1,Math.max(0,input.hoursLast24h/16))*weights.hoursLast24h,
    hoursLast7d: Math.min(1,Math.max(0,input.hoursLast7d/60))*weights.hoursLast7d,
    restGap: (1-Math.min(1,Math.max(0,input.restGapHours/11)))*weights.restGap,
    consecutiveDays: Math.min(1,Math.max(0,input.consecutiveDays/7))*weights.consecutiveDays,
    nightStreak: Math.min(1,Math.max(0,input.nightShiftStreak/4))*weights.nightStreak,
    heat: Math.min(1,Math.max(0,(input.heatExposure??0)/40))*weights.heat
  };
  const score = Math.round(Object.values(parts).reduce((a,b)=>a+b,0));
  return {score, band: score>=70?'red':score>=40?'amber':'green', parts, explanation: Object.entries(parts).filter(([,v])=>v>=8).map(([k])=>k)};
}

export function fairnessIndex(parts:{pay:number;overtime:number;safety:number;grievance:number;fatigue:number;workerConfirmed:number}) {
  const vals=[parts.pay,parts.overtime,parts.safety,parts.grievance,parts.fatigue,parts.workerConfirmed];
  if(vals.some(v=>!Number.isFinite(v)||v<0))throw new Error('Scores must be finite and non-negative');
  if(parts.pay>25||parts.overtime>25||parts.safety>20||parts.grievance>15||parts.fatigue>10||parts.workerConfirmed>5)throw new Error('A component exceeds its published weight');
  return Math.max(0,Math.min(100,Math.round(vals.reduce((a,b)=>a+b,0))));
}

export function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  const obj = value as Record<string, unknown>;
  return `{${Object.keys(obj).sort().map(k=>`${JSON.stringify(k)}:${canonicalJson(obj[k])}`).join(',')}}`;
}
