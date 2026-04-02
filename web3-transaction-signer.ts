/**
 * Web3 离线交易签名器
 * 支持链下交易签名、签名验证，适用于钱包、DApp前端
 */
import { secp256k1 } from '@noble/curves/secp256k1';
import { keccak_256 } from '@noble/hashes/sha3';

export interface Web3Transaction {
  to: string;
  value: string;
  gas: string;
  nonce: number;
  chainId: number;
}

export class Web3TransactionSigner {
  // 序列化交易
  private static serializeTx(tx: Web3Transaction): string {
    return JSON.stringify(tx);
  }

  // 交易哈希
  private static getTxHash(tx: Web3Transaction): Uint8Array {
    return keccak_256(this.serializeTx(tx));
  }

  // 私钥签名交易
  static signTransaction(tx: Web3Transaction, privateKey: string): string {
    const key = privateKey.startsWith('0x') ? privateKey.slice(2) : privateKey;
    const hash = this.getTxHash(tx);
    const signature = secp256k1.sign(hash, key);
    return '0x' + signature.toCompactHex();
  }

  // 验证交易签名
  static verifySignature(tx: Web3Transaction, signature: string, publicKey: string): boolean {
    const hash = this.getTxHash(tx);
    const sig = secp256k1.Signature.fromCompact(signature.slice(2));
    return secp256k1.verify(sig, hash, publicKey.slice(2));
  }
}

// 测试签名
const tx: Web3Transaction = { to: '0x123', value: '100', gas: '21000', nonce: 0, chainId: 1 };
const pk = '0x' + 'a'.repeat(64);
const sig = Web3TransactionSigner.signTransaction(tx, pk);
console.log('交易签名:', sig);
