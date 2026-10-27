import { describe, expect, it } from 'vitest';
import { canonicalJson, computeOvertime, computeOvertimeAmount, computeWorkedIntervals, fatigueScore, fairnessIndex, RulePackSchema } from '../packages/shared/src/index.js';

describe('FairShift shared engines',()=>{
  it('computes weekly overtime without daily double-counting',()=>{
    expect(computeOvertime([8,8,8,8,8,8,6]).overtimeHours).toBe(6);
    expect(computeOvertime([10,10,8,8,8,0,0]).overtimeHours).toBe(4);
  });
  it('computes overtime amount deterministically',()=>{
    expect(computeOvertimeAmount([9,9,8,8,8,8,0],100,2).overtimeAmount).toBe(400);
  });
  it('pairs check-ins and check-outs and reports anomalies',()=>{
    const result=computeWorkedIntervals([{type:'in',created_at:'2026-01-01T08:00:00Z'},{type:'out',created_at:'2026-01-01T17:00:00Z'}]);
    expect(result.totalHours).toBe(9); expect(result.anomalies).toHaveLength(0);
  });
  it('flags an unclosed shift',()=>expect(computeWorkedIntervals([{type:'in',created_at:'2026-01-01T08:00:00Z'}]).anomalies).toHaveLength(1));
  it('calculates explainable fatigue bands',()=>expect(fatigueScore({hoursLast24h:12,hoursLast7d:55,restGapHours:5,consecutiveDays:7,nightShiftStreak:4,heatExposure:35}).band).toBe('red'));
  it('keeps fairness components within their weights',()=>expect(fairnessIndex({pay:22,overtime:20,safety:13,grievance:9,fatigue:8,workerConfirmed:4})).toBe(76));
  it('rejects fairness component over-weight',()=>expect(()=>fairnessIndex({pay:26,overtime:20,safety:13,grievance:9,fatigue:8,workerConfirmed:4})).toThrow());
  it('canonical JSON sorts object keys',()=>expect(canonicalJson({z:1,a:2})).toBe('{"a":2,"z":1}'));
  it('validates versioned rule packs',()=>expect(RulePackSchema.safeParse({id:'demo',sector:'construction',version:'v1',asOf:'2026-10-27',verified:false,dailyStandard:8,weeklyStandard:48,overtimeMultiplier:2,minRestHours:11,maxConsecutiveDays:6,source:'demo',kind:'demo'}).success).toBe(true));
});
