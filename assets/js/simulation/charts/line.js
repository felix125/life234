// charts/line.js
import { CHART_DIMENSIONS, COLORS } from '../config.js';

export class LineChart {
  constructor(containerId) {
    this.svg = d3.select(containerId)
      .append('svg')
      .attr('width', CHART_DIMENSIONS.width)
      .attr('height', CHART_DIMENSIONS.height)
      .append('g')
      .attr('transform', `translate(${CHART_DIMENSIONS.margin.left},${CHART_DIMENSIONS.margin.top})`);

    this.setupScales();
    this.setupAxes();
    this.setupLine();
  }

  setupScales() {
    this.xScale = d3.scaleLinear()
      .range([0, CHART_DIMENSIONS.innerWidth])
      .domain([0, 99]);

    this.yScale = d3.scaleLinear()
      .range([CHART_DIMENSIONS.innerHeight, 0])
      .domain([0, 500]);
  }

  setupAxes() {
    this.xAxis = this.svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${CHART_DIMENSIONS.innerHeight})`);

    this.yAxis = this.svg.append('g')
      .attr('class', 'y-axis');

    // 添加軸標籤
    this.svg.append('text')
      .attr('transform', `translate(${CHART_DIMENSIONS.innerWidth/2},${CHART_DIMENSIONS.height - 10})`)
      .style('text-anchor', 'middle')
      .text('排名');

    this.svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -40)
      .attr('x', -CHART_DIMENSIONS.innerHeight/2)
      .style('text-anchor', 'middle')
      .text('財富');
  }

  setupLine() {
    this.line = d3.line()
      .x((d, i) => this.xScale(i))
      .y(d => this.yScale(d));
  }

  update(moneyArray, snapshots = new Map()) {
    const currentMoney = [...moneyArray].sort((a, b) => b - a);

    // 計算所有數據的最大值
    let maxMoney = Math.max(...currentMoney);
    snapshots.forEach(snapshot => {
      maxMoney = Math.max(maxMoney, Math.max(...snapshot));
    });

    // 更新比例尺
    this.yScale.domain([0, maxMoney]);

    // 更新軸
    this.xAxis.call(d3.axisBottom(this.xScale));
    this.yAxis.call(d3.axisLeft(this.yScale));

    // 創建一個組來包含所有線
    const linesGroup = this.svg.selectAll('.lines-group')
      .data([0])
      .join('g')
      .attr('class', 'lines-group');

    // 畫出快照線
    linesGroup.selectAll('.snapshot-line')
      .data(Array.from(snapshots.entries()))
      .join('path')
      .attr('class', 'snapshot-line')
      .attr('fill', 'none')
      .attr('stroke', (d, i) => d3.schemeCategory10[i])
      .attr('stroke-width', 1)
      .attr('stroke-opacity', 0.5)
      .attr('d', d => this.line(d[1].sort((a, b) => b - a)));

    // 畫出當前線
    linesGroup.selectAll('.current-line')
      .data([currentMoney])
      .join('path')
      .attr('class', 'current-line')
      .attr('fill', 'none')
      .attr('stroke', COLORS.line)
      .attr('stroke-width', 2)
      .transition()
      .duration(100)
      .attr('d', this.line);

    // 添加圖例
    const legend = this.svg.selectAll('.legend')
      .data(['現在', ...snapshots.keys()])
      .join('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => `translate(${CHART_DIMENSIONS.innerWidth - 100},${20 + i * 20})`);

    legend.selectAll('rect')
      .data(d => [d])
      .join('rect')
      .attr('x', 0)
      .attr('width', 18)
      .attr('height', 18)
      .style('fill', (d, i) => i === 0 ? COLORS.line : d3.schemeCategory10[i-1]);

    legend.selectAll('text')
      .data(d => [d])
      .join('text')
      .attr('x', 24)
      .attr('y', 9)
      .attr('dy', '.35em')
      .text(d => d === '現在' ? d : `${d}步`);
  }
}
