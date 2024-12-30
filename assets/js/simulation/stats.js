// stats.js
export class SimulationStats {
  analyze(moneyArray) {
    const sortedMoney = [...moneyArray].sort((a, b) => a - b);
    const total = sortedMoney.reduce((sum, val) => sum + val, 0);
    const n = sortedMoney.length;

    return {
      mean: total / n,
      median: this.calculateMedian(sortedMoney),
      wealthShare: this.calculateWealthShare(sortedMoney),
      distribution: this.calculateDistribution(sortedMoney)
    };
  }

  calculateMedian(sortedArray) {
    const mid = Math.floor(sortedArray.length / 2);
    return sortedArray.length % 2 === 0
      ? (sortedArray[mid - 1] + sortedArray[mid]) / 2
      : sortedArray[mid];
  }

  calculateWealthShare(sortedArray) {
    const total = sortedArray.reduce((sum, val) => sum + val, 0);
    const n = Math.floor(sortedArray.length * 0.1);  // 10%的人數

    const top10Total = sortedArray.slice(-n).reduce((sum, val) => sum + val, 0);
    const bottom10Total = sortedArray.slice(0, n).reduce((sum, val) => sum + val, 0);

    return {
      top10Percent: (top10Total / total * 100).toFixed(1),
      bottom10Percent: (bottom10Total / total * 100).toFixed(1)
    };
  }

  calculateDistribution(sortedArray) {
    // 計算財富分布的區間
    const min = Math.min(...sortedArray);
    const max = Math.max(...sortedArray);
    const binCount = 20;  // 分 20 個區間
    const binSize = Math.ceil((max - min) / binCount);

    const bins = Array(binCount).fill(0);

    sortedArray.forEach(value => {
      const binIndex = Math.min(Math.floor((value - min) / binSize), binCount - 1);
      bins[binIndex]++;
    });

    return {
      bins,
      binSize,
      min,
      max
    };
  }
}
