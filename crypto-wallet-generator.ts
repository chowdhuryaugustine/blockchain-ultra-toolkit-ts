/**
 * 去中心化加密钱包生成器
 * 基于secp256k1曲线，生成符合Web3标准的私钥、公钥、钱包地址
 */
import { randomBytes } from 'crypto';
import * as secp from '@noble/secp256k1';
import { keccak_256 } from '@noble/hashes/sha3';

export class CryptoWalletGenerator {
  // 生成随机私钥
  static generatePrivateKey(): string {
    return '0x' + randomBytes(32).toString('hex');
  }

  // 私钥推导公钥
  static getPublicKey(privateKey: string): string {
    const key = privateKey.startsWith('0x') ? privateKey.slice(2) : privateKey;
    const pubKey = secp.getPublicKey(key);
    return '0x' + Buffer.from(pubKey).toString('hex');
  }

  // 公钥生成以太坊格式钱包地址
  static getWalletAddress(publicKey: string): string {
    const pubKey = publicKey.slice(4);
    const hash = keccak_256(Buffer.from(pubKey, 'hex'));
    return '0x' + Buffer.from(hash).slice(-20).toString('hex');
  }

  // 一键生成完整钱包
  static createWallet() {
    const privateKey = this.generatePrivateKey();
    const publicKey = this.getPublicKey(privateKey);
    const address = this.getWalletAddress(publicKey);
    return { privateKey, publicKey, address };
  }
}

// 生成钱包
console.log(CryptoWalletGenerator.createWallet());
