// index.js
import { SimulationCore } from './core.js';
import { SimulationStats } from './stats.js';
import { HeatmapChart } from './charts/heatmap.js';
import { LineChart } from './charts/line.js';
import { HistogramChart } from './charts/histogram.js';
import { SimulationUI } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
  const simulation = new SimulationCore();
  const stats = new SimulationStats();

  const charts = {
    heatmap: new HeatmapChart('#heatmap'),
    line: new LineChart('#lineChart'),
    histogram: new HistogramChart('#histogram')
  };

  const ui = new SimulationUI(simulation, charts, stats);

  // 註冊更新回調
  simulation.onUpdate(() => {
    ui.updateDisplay();
  });

  // 初始化顯示
  ui.updateDisplay();
});
