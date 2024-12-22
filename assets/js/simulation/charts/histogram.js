// charts/histogram.js
import { CHART_DIMENSIONS, COLORS } from '../config.js';

export class HistogramChart {
  constructor(containerId) {
    this.svg = d3.select(containerId)
      .append('svg')
      .attr('width', CHART_DIMENSIONS.width)
      .attr('height', CHART_DIMENSIONS.height)
      .append('g')
      .attr('transform', `translate(${CHART_DIMENSIONS.margin.left},${CHART_DIMENSIONS.margin.top})`);

    this.setupScales();
    this.setupAxes();
  }

  setupScales() {
    this.xScale = d3.scaleLinear()
      .range([0, CHART_DIMENSIONS.innerWidth]);

    this.yScale = d3.scaleLinear()
      .range([CHART_DIMENSIONS.innerHeight, 0]);
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
      .text('財富');

    this.svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -40)
      .attr('x', -CHART_DIMENSIONS.innerHeight/2)
      .style('text-anchor', 'middle')
      .text('人數');
  }

  update(distribution) {
    // 更新比例尺
    this.xScale.domain([distribution.min, distribution.max]);
    this.yScale.domain([0, Math.max(...distribution.bins)]);

    // 更新軸
    this.xAxis.call(d3.axisBottom(this.xScale));
    this.yAxis.call(d3.axisLeft(this.yScale));

    // 更新直方圖
    this.svg.selectAll('.bar')
      .data(distribution.bins)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', (d, i) => this.xScale(distribution.min + i * distribution.binSize))
      .attr('width', CHART_DIMENSIONS.innerWidth / distribution.bins.length - 1)
      .attr('y', d => this.yScale(d))
      .attr('height', d => CHART_DIMENSIONS.innerHeight - this.yScale(d))
      .attr('fill', COLORS.line)
      .attr('opacity', 0.7);
  }
}
