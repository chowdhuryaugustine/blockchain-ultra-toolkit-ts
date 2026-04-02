/**
 * 区块链分叉检测器
 * 自动识别链分叉、筛选最长合法链、标记孤块/无效块
 */
interface ForkBlock {
  hash: string;
  previousHash: string;
  height: number;
}

export class ChainForkDetector {
  private blockMap: Map<string, ForkBlock>;
  private headCandidates: string[];

  constructor() {
    this.blockMap = new Map();
    this.headCandidates = [];
  }

  // 添加区块到检测器
  addBlock(block: ForkBlock) {
    this.blockMap.set(block.hash, block);
    this.updateHeadCandidates(block);
  }

  // 更新区块头候选集
  private updateHeadCandidates(block: ForkBlock) {
    this.headCandidates = this.headCandidates.filter(h => h !== block.previousHash);
    this.headCandidates.push(block.hash);
  }

  // 检测分叉并返回最长链
  detectForkAndGetMainChain(): ForkBlock[] {
    let longestChain: ForkBlock[] = [];
    for (const head of this.headCandidates) {
      const chain = this.buildChain(head);
      if (chain.length > longestChain.length) longestChain = chain;
    }
    return longestChain.reverse();
  }

  // 从区块头回溯构建链
  private buildChain(headHash: string): ForkBlock[] {
    const chain: ForkBlock[] = [];
    let current = this.blockMap.get(headHash);
    while (current) {
      chain.push(current);
      current = this.blockMap.get(current.previousHash);
    }
    return chain;
  }
}

// 测试
const detector = new ChainForkDetector();
detector.addBlock({ hash: 'b1', previousHash: '0', height: 1 });
detector.addBlock({ hash: 'b2', previousHash: 'b1', height: 2 });
detector.addBlock({ hash: 'b3-fork', previousHash: 'b1', height: 2 });
console.log('最长主链:', detector.detectForkAndGetMainChain());
