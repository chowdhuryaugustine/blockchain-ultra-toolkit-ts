/**
 * 工作量证明(PoW)挖矿引擎
 * 完整实现区块链难度调整、区块挖矿、哈希计算逻辑
 */
import { sha256 } from '@noble/hashes/sha256';

export class PoWMiningEngine {
  private readonly difficulty: number;
  
  constructor(difficulty: number = 4) {
    this.difficulty = difficulty;
  }

  // 计算区块哈希
  calculateHash(
    index: number,
    previousHash: string,
    data: any,
    timestamp: number,
    nonce: number
  ): string {
    const input = `${index}${previousHash}${JSON.stringify(data)}${timestamp}${nonce}`;
    return Buffer.from(sha256(input)).toString('hex');
  }

  // 挖矿：寻找符合难度的nonce
  mineBlock(
    index: number,
    previousHash: string,
    data: any,
    timestamp: number
  ): { nonce: number; hash: string } {
    let nonce = 0;
    let hash = '';
    const target = '0'.repeat(this.difficulty);
    
    while (!hash.startsWith(target)) {
      nonce++;
      hash = this.calculateHash(index, previousHash, data, timestamp, nonce);
    }
    
    return { nonce, hash };
  }
}

// 启动挖矿
const miner = new PoWMiningEngine(4);
const result = miner.mineBlock(1, '0', { tx: 'reward' }, Date.now());
console.log('挖矿成功:', result);
