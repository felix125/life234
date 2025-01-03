import { CHART_DIMENSIONS, COLORS, CONFIG } from '../config.js';

export class HeatmapChart {
  constructor(containerId) {
    this.svg = d3.select(containerId)
      .append('svg')
      .attr('width', CHART_DIMENSIONS.width)
      .attr('height', CHART_DIMENSIONS.width)  // 使用正方形
      .append('g')
      .attr('transform', `translate(${CHART_DIMENSIONS.margin.left},${CHART_DIMENSIONS.margin.top})`);

    // 設置顏色比例尺
    //this.colorScale = d3.scaleLinear()
    //  .domain([0, CONFIG.maxMoney])
    //  .range(['#ffffff', '#ff0000']);

    this.colorScale = d3.scaleSequential()
      .domain([0, CONFIG.maxMoney])
      .interpolator(d3.interpolateYlOrRd);

    // 計算網格大小
    this.gridSize = Math.floor((CHART_DIMENSIONS.width - CHART_DIMENSIONS.margin.left - CHART_DIMENSIONS.margin.right) / 10);
    
    // 初始化網格
    this.initializeGrid();
  }

  initializeGrid() {
    // 創建初始的網格
    for (let i = 0; i < 100; i++) {
      this.svg.append('rect')
        .attr('class', 'cell')
        .attr('x', (i % 10) * this.gridSize)
        .attr('y', Math.floor(i / 10) * this.gridSize)
        .attr('width', this.gridSize - 1)
        .attr('height', this.gridSize - 1)
        .attr('fill', this.colorScale(CONFIG.initialMoney))
        .attr('stroke', 'white')
        .attr('stroke-width', 1);
    }

    // // 添加調試輸出
    // console.log('Grid size:', this.gridSize);
    // console.log('Initial money:', CONFIG.initialMoney);
    // console.log('Color for initial money:', this.colorScale(CONFIG.initialMoney));
  }

  update(moneyArray) {
    // // 添加調試輸出
    // console.log('Updating with:', moneyArray.slice(0, 5), '...');
    // console.log('Money range:', Math.min(...moneyArray), 'to', Math.max(...moneyArray));

    this.svg.selectAll('.cell')
      .data(moneyArray)
      .join('rect')
      .attr('class', 'cell')
      .attr('x', (d, i) => (i % 10) * this.gridSize)
      .attr('y', (d, i) => Math.floor(i / 10) * this.gridSize)
      .attr('width', this.gridSize - 1)
      .attr('height', this.gridSize - 1)
      .attr('fill', d => this.colorScale(d))
      .attr('stroke', 'white')
      .attr('stroke-width', 1);
  }
}
