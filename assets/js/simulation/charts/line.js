// charts/line.js
import { CHART_DIMENSIONS, COLORS } from '../config.js';

    // 自定義顏色
const legendColors = [
  'steelblue',
  '#e41a1c',
  '#4daf4a',
  '#984ea3'
];

const legendFontSize = CHART_DIMENSIONS.width < 400 ? '0.6em' : '0.8em';

export class LineChart {
  constructor(containerId) {

    this.container = d3.select(containerId);

    this.svg = this.container
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
      .style('fill', 'currentColor')
      .style('font-size', legendFontSize)  // 設定字體大小
      .text('Rank');

    this.svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -40)
      .attr('x', -CHART_DIMENSIONS.innerHeight/2)
      .style('text-anchor', 'middle')
      .style('fill', 'currentColor')
      .style('font-size', legendFontSize)  // 設定字體大小
      .text('Wealth');
  }

  setupLine() {
    this.line = d3.line()
      .x((d, i) => this.xScale(i))
      .y(d => this.yScale(d));
  }

  update(moneyArray, snapshots = new Map(), isCompleted = false) {
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
      .attr('stroke', (d, i) => legendColors[i + 1])
      .attr('stroke-width', 1)
      .attr('stroke-opacity', 0.7)
      .attr('d', d => this.line(d[1].sort((a, b) => b - a)));

    // 畫出當前線
    if (!isCompleted) {
      linesGroup.selectAll('.current-line')
                .data([currentMoney])
                .join('path')
                .attr('class', 'current-line')
                .attr('fill', 'none')
                .attr('stroke', COLORS.line)
                .attr('stroke-width', 1.2)
                .transition()
                .duration(100)
                .attr('d', this.line);
    } else {
      linesGroup.selectAll('.current-line').remove();
    }

    // update 方法中的圖例部分
    const legendRectSize = CHART_DIMENSIONS.width < 400 ? 12 : 16;  // 調整方塊大小

    // 添加圖例
    const legend = this.svg.selectAll('.legend')
      .data([...snapshots.keys()])
      .join('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => `translate(${CHART_DIMENSIONS.innerWidth - 100},${20 + i * 20})`);

    // 更新圖例的矩形
    legend.selectAll('rect')
      .data(d => [d])
      .join('rect')
      .attr('x', 0)
      .attr('width', legendRectSize)
      .attr('height', legendRectSize)
      .style('fill', (d, i, nodes) => {
        const parentIndex = Array.from(snapshots.keys()).indexOf(d) + 1;
        return legendColors[parentIndex];
      });

    // 更新圖例的文字
    legend.selectAll('text')
      .data(d => [d])
      .join('text')
      .attr('x', legendRectSize + 4)
      .attr('y', legendRectSize / 2)
      .attr('dy', '.35em')
      .style('fill', 'currentColor')  // 這行確保文字顏色會跟隨系統主題
      .style('font-size', legendFontSize)  // 設定字體大小
      .text(d => `${d/1000}k steps`);
  }
}
