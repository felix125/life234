// core.js
import { CONFIG } from './config.js';

export class SimulationCore {
  constructor() {
    this.updateCallbacks = [];
    this.snapshotSteps = [10000, 30000, 50000];
    this.snapshots = new Map();  // 用來存儲特定步數的快照
    this.reset();
  }

  reset() {
    this.money = new Array(CONFIG.peopleCount).fill(CONFIG.initialMoney);
    this.currentStep = 0;
    this.totalSteps = 50000;
    this.snapshots.clear();
  }

  // 添加這個方法
  getCurrentState() {
    return {
      money: [...this.money],
      step: this.currentStep,
      totalSteps: this.totalSteps,
      snapshots: this.snapshots  // 添加這行
    };
  }

  setTotalSteps(steps) {
    this.totalSteps = steps;
  }

  simulateOneStep() {
  // 檢查每個人
    for (let giver = 0; giver < CONFIG.peopleCount; giver++) {
      if (this.money[giver] > 0) {
        const receiver = Math.floor(Math.random() * CONFIG.peopleCount);
        this.money[giver]--;
        this.money[receiver]++;
      }
    }
  }

  simulate(steps) {
    if (this.currentStep >= this.totalSteps) {
      return false;
    }

    const stepsToRun = Math.min(steps, this.totalSteps - this.currentStep);

    for (let i = 0; i < stepsToRun; i++) {
      this.simulateOneStep();
      this.currentStep++;

      // 檢查是否需要儲存快照
      if (this.snapshotSteps.includes(this.currentStep)) {
        this.snapshots.set(this.currentStep, [...this.money]);
      }
    }

    this.notifyUpdate();
    return true;
  }

  notifyUpdate() {
    const data = {
      money: [...this.money],
      step: this.currentStep,
      totalSteps: this.totalSteps,
      snapshots: this.snapshots  // 添加這行
    };
    this.updateCallbacks.forEach(callback => callback(data));
  }

  onUpdate(callback) {
    this.updateCallbacks.push(callback);
  }
}
