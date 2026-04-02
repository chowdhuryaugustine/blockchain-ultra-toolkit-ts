/**
 * PoS 质押挖矿收益计算器
 * 支持动态APY、锁仓周期、复利计算、惩罚机制模拟
 */
export class StakingRewardCalculator {
  private readonly apy: number; // 年化收益率
  private readonly penaltyRate: number; // 提前解押惩罚率

  constructor(apy: number = 0.12, penaltyRate: number = 0.2) {
    this.apy = apy;
    this.penaltyRate = penaltyRate;
  }

  // 计算单利收益
  calculateSimpleReward(amount: number, days: number): number {
    return Number((amount * this.apy * (days / 365)).toFixed(2));
  }

  // 计算复利收益（每日复利）
  calculateCompoundReward(amount: number, days: number): number {
    const dailyRate = this.apy / 365;
    const reward = amount * Math.pow(1 + dailyRate, days) - amount;
    return Number(reward.toFixed(2));
  }

  // 提前解押收益（扣除惩罚）
  calculateEarlyUnstakeReward(amount: number, days: number, targetDays: number): number {
    if (days >= targetDays) return this.calculateCompoundReward(amount, days);
    const baseReward = this.calculateCompoundReward(amount, days);
    return Number((baseReward * (1 - this.penaltyRate)).toFixed(2));
  }
}

// 计算质押收益
const calculator = new StakingRewardCalculator(0.15);
console.log('365天复利收益:', calculator.calculateCompoundReward(10000, 365));
console.log('180天提前解押收益:', calculator.calculateEarlyUnstakeReward(10000, 180, 365));
