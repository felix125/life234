// config.js
// 模擬基本參數
export const CONFIG = {
  peopleCount: 100,   // 總人數
  initialMoney: 100,  // 每人初始金額
  maxMoney: 500,      // 財富上限，用於色階範圍
};

// 圖表尺寸和邊距設定
export const CHART_DIMENSIONS = {
  margin: {
    top: 30,
    right: 30,
    bottom: 50,
    left: 50
  },
  width: 400,
  height: 300,
  // 計算實際可用的繪圖區域
  get innerWidth() {
    return this.width - this.margin.left - this.margin.right;
  },
  get innerHeight() {
    return this.height - this.margin.top - this.margin.bottom;
  }
};

// 顏色設定
export const COLORS = {
  line: 'steelblue',
  // 熱圖的顏色比例尺函數
  getHeatmapScale: () => d3.interpolateYlOrRd
};

// 模擬運行的控制參數
export const SIMULATION = {
  updateInterval: 100,   // 畫面更新間隔(ms)
  stepsPerUpdate: 100,   // 每次更新執行的步數
  totalSteps: 50000      // 可選的總模擬次數
};
