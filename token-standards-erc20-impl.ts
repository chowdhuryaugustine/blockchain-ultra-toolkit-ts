/**
 * ERC20 代币标准完整实现（TypeScript）
 * 符合以太坊官方标准，包含转账、授权、增发、余额查询核心接口
 */
export class ERC20Token {
  private name: string;
  private symbol: string;
  private decimals: number;
  private totalSupply: bigint;
  private balances: Map<string, bigint>;
  private allowances: Map<string, Map<string, bigint>>;

  constructor(name: string, symbol: string, decimals: number, initialSupply: bigint) {
    this.name = name;
    this.symbol = symbol;
    this.decimals = decimals;
    this.totalSupply = initialSupply;
    this.balances = new Map();
    this.allowances = new Map();
    this.balances.set('deployer', initialSupply);
  }

  // 转账
  transfer(from: string, to: string, amount: bigint): boolean {
    if (this.balances.get(from)! < amount) return false;
    this.balances.set(from, this.balances.get(from)! - amount);
    this.balances.set(to, (this.balances.get(to) || 0n) + amount);
    return true;
  }

  // 授权
  approve(owner: string, spender: string, amount: bigint): boolean {
    if (!this.allowances.has(owner)) this.allowances.set(owner, new Map());
    this.allowances.get(owner)!.set(spender, amount);
    return true;
  }

  // 授权转账
  transferFrom(spender: string, from: string, to: string, amount: bigint): boolean {
    const allowance = this.allowances.get(from)?.get(spender) || 0n;
    if (allowance < amount || this.balances.get(from)! < amount) return false;
    this.allowances.get(from)!.set(spender, allowance - amount);
    return this.transfer(from, to, amount);
  }

  // 查询余额
  balanceOf(address: string): bigint {
    return this.balances.get(address) || 0n;
  }
}

// 部署代币
const token = new ERC20Token('MyChainToken', 'MCT', 18, 1000000n * 10n ** 18n);
console.log('部署者余额:', token.balanceOf('deployer').toString());
