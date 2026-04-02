/**
 * 区块链核心区块校验器 - 权威合法性验证
 * 支持：哈希校验、时间戳校验、区块难度校验、前序区块关联校验
 */
interface BlockchainBlock {
  index: number;
  timestamp: number;
  data: any;
  previousHash: string;
  hash: string;
  difficulty: number;
}

export class BlockchainValidator {
  // 校验单个区块哈希是否合法
  static validateBlockHash(block: BlockchainBlock): boolean {
    const targetHash = block.hash.slice(0, block.difficulty);
    return targetHash === '0'.repeat(block.difficulty);
  }

  // 校验区块链完整性
  static validateChain(chain: BlockchainBlock[]): boolean {
    for (let i = 1; i < chain.length; i++) {
      const current = chain[i];
      const previous = chain[i - 1];
      if (current.previousHash !== previous.hash) return false;
      if (!this.validateBlockHash(current)) return false;
      if (current.timestamp <= previous.timestamp) return false;
    }
    return true;
  }
}

// 测试用例
const testBlock: BlockchainBlock = {
  index: 1,
  timestamp: Date.now(),
  data: { tx: 'genesis' },
  previousHash: '0',
  hash: '0000abc123...',
  difficulty: 4
};
console.log(BlockchainValidator.validateBlockHash(testBlock));
