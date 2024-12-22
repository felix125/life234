// ui.js
import { SIMULATION } from './config.js';

export class SimulationUI {
  constructor(simulation, charts, stats) {
    this.simulation = simulation;
    this.charts = charts;
    this.stats = stats;
    this.timer = null;
    this.isRunning = false;

    this.bindControls();
  }

  bindControls() {
    document.getElementById('startBtn').onclick = () => this.toggleSimulation();
    document.getElementById('resetBtn').onclick = () => this.resetSimulation();
    // document.getElementById('totalSteps').onchange = (e) => {
    //   this.simulation.setTotalSteps(parseInt(e.target.value));
    //   document.getElementById('totalStepsDisplay').textContent = e.target.value;
    // };
  }

  toggleSimulation() {
    this.isRunning = !this.isRunning;

    if (this.isRunning) {
      this.startSimulation();
    } else {
      this.stopSimulation();
    }
  }

  startSimulation() {
    this.timer = setInterval(() => {
      const isRunning = this.simulation.simulate(SIMULATION.stepsPerUpdate);
      if (!isRunning) {
        this.stopSimulation();
      }
    }, SIMULATION.updateInterval);
  }

  stopSimulation() {
    this.isRunning = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  resetSimulation() {
    this.stopSimulation();
    this.simulation.reset();
    this.updateDisplay();
  }

  updateDisplay() {
    const data = this.simulation.getCurrentState();
    const stats = this.stats.analyze(data.money);

    // 更新進度
    document.getElementById('progressCounter').textContent = data.step;

    // 更新圖表
    this.charts.heatmap.update(data.money);
    this.charts.line.update(data.money, data.snapshots);
    this.charts.histogram.update(stats.distribution);

    // 更新統計資訊
    document.getElementById('meanWealth').textContent = stats.mean.toFixed(1);
    document.getElementById('medianWealth').textContent = stats.median.toFixed(1);
    document.getElementById('top10Wealth').textContent = stats.wealthShare.top10Percent + '%';
    document.getElementById('bottom10Wealth').textContent = stats.wealthShare.bottom10Percent + '%';
  }
}
