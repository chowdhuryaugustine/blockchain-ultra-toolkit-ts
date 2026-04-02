/**
 * 跨链桥（Cross-Chain Bridge）模拟器
 * 实现资产锁定、跨链 mint、多链验证、提现解锁核心逻辑
 */
type ChainType = 'ETH' | 'BSC' | 'SOL';

export class CrossChainBridgeSimulator {
  private lockedAssets: Map<string, { chain: ChainType; amount: number }>;
  private mintedAssets: Map<string, { chain: ChainType; amount: number }>;

  constructor() {
    this.lockedAssets = new Map();
    this.mintedAssets = new Map();
  }

  // 源链锁定资产
  lockAsset(user: string, fromChain: ChainType, amount: number): string {
    const txId = 'lock-' + Math.random().toString(36).slice(2);
    this.lockedAssets.set(txId, { chain: fromChain, amount });
    console.log(`🔒 ${user} 在 ${fromChain} 锁定资产 ${amount} | TX: ${txId}`);
    return txId;
  }

  // 目标链 mint 包装资产
  mintWrappedAsset(user: string, toChain: ChainType, lockTxId: string): boolean {
    const lockData = this.lockedAssets.get(lockTxId);
    if (!lockData) return false;
    this.mintedAssets.set(lockTxId, { chain: toChain, amount: lockData.amount });
    console.log(`🪙 ${user} 在 ${toChain} mint 包装资产 ${lockData.amount}`);
    return true;
  }

  // 跨链提现：销毁包装资产 + 解锁原资产
  withdrawAsset(user: string, mintTxId: string): boolean {
    const mintData = this.mintedAssets.get(mintTxId);
    const lockData = this.lockedAssets.get(mintTxId);
    if (!mintData || !lockData) return false;
    this.mintedAssets.delete(mintTxId);
    this.lockedAssets.delete(mintTxId);
    console.log(`✅ ${user} 跨链提现成功，解锁 ${lockData.amount} 资产`);
    return true;
  }
}

// 测试跨链流程
const bridge = new CrossChainBridgeSimulator();
const lockTx = bridge.lockAsset('user01', 'ETH', 500);
bridge.mintWrappedAsset('user01', 'BSC', lockTx);
bridge.withdrawAsset('user01', lockTx);
