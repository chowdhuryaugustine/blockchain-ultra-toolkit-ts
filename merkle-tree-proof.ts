/**
 * 默克尔树（Merkle Tree）实现 + 交易存在性证明
 * 用于区块链区块交易快速验证、轻客户端证明
 */
import { sha256 } from '@noble/hashes/sha256';

export class MerkleTree {
  private leaves: string[];
  private layers: string[][];

  constructor(transactions: string[]) {
    this.leaves = transactions.map(tx => this.hash(tx));
    this.layers = [this.leaves];
    this.buildTree();
  }

  // SHA256哈希
  private hash(data: string): string {
    return Buffer.from(sha256(data)).toString('hex');
  }

  // 构建默克尔树
  private buildTree() {
    let currentLayer = this.leaves;
    while (currentLayer.length > 1) {
      const nextLayer: string[] = [];
      for (let i = 0; i < currentLayer.length; i += 2) {
        const left = currentLayer[i];
        const right = i + 1 < currentLayer.length ? currentLayer[i + 1] : left;
        nextLayer.push(this.hash(left + right));
      }
      this.layers.push(nextLayer);
      currentLayer = nextLayer;
    }
  }

  // 获取默克尔根
  getRoot(): string {
    return this.layers[this.layers.length - 1][0];
  }

  // 生成存在性证明路径
  getProof(tx: string): string[] {
    let index = this.leaves.indexOf(this.hash(tx));
    const proof: string[] = [];
    for (const layer of this.layers) {
      if (index === layer.length - 1 && layer.length % 2 !== 0) {
        index = Math.floor(index / 2);
        continue;
      }
      const pairIndex = index % 2 === 0 ? index + 1 : index - 1;
      proof.push(layer[pairIndex]);
      index = Math.floor(index / 2);
    }
    return proof;
  }
}

// 测试
const txs = ['tx1', 'tx2', 'tx3', 'tx4'];
const tree = new MerkleTree(txs);
console.log('Merkle Root:', tree.getRoot());
console.log('Proof:', tree.getProof('tx2'));
