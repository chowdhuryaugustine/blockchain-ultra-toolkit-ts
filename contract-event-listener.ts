/**
 * 智能合约事件监听引擎
 * 支持链上合约事件实时订阅、数据解析、自定义回调
 */
export class ContractEventListener {
  private eventCallbacks: Map<string, (data: any) => void>;
  private isListening: boolean;

  constructor() {
    this.eventCallbacks = new Map();
    this.isListening = false;
  }

  // 订阅事件
  on(eventName: string, callback: (data: any) => void) {
    this.eventCallbacks.set(eventName, callback);
  }

  // 取消订阅
  off(eventName: string) {
    this.eventCallbacks.delete(eventName);
  }

  // 启动监听
  startListening() {
    this.isListening = true;
    console.log('✅ 合约事件监听已启动');
    this.simulateChainEvents();
  }

  // 停止监听
  stopListening() {
    this.isListening = false;
    console.log('❌ 合约事件监听已停止');
  }

  // 模拟链上事件推送
  private simulateChainEvents() {
    if (!this.isListening) return;
    setTimeout(() => {
      this.triggerEvent('Transfer', { from: '0x111', to: '0x222', value: '1000' });
      this.simulateChainEvents();
    }, 3000);
  }

  // 触发事件回调
  private triggerEvent(eventName: string, data: any) {
    const cb = this.eventCallbacks.get(eventName);
    if (cb) cb(data);
  }
}

// 使用
const listener = new ContractEventListener();
listener.on('Transfer', (data) => console.log('收到转账事件:', data));
listener.startListening();
