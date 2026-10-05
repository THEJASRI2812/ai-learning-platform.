/**
 * AI-POWERED PERSONALIZED LEARNING PLATFORM
 * Chart.js Integration Utility (charts.js)
 * 
 * Provides unified, beautifully styled Chart.js creation functions
 * for Line, Bar, Doughnut, and Radar charts.
 */

const ChartHelper = (function () {
  // Common theme color constants
  const COLORS = {
    primaryBlue: '#2563eb',
    blueLight: '#3b82f6',
    blueSoft: 'rgba(59, 130, 246, 0.15)',
    primaryPurple: '#7c3aed',
    purpleSoft: 'rgba(124, 58, 237, 0.15)',
    primaryGreen: '#10b981',
    greenSoft: 'rgba(16, 185, 129, 0.15)',
    accentAmber: '#f59e0b',
    accentRed: '#ef4444',
    textDark: '#0f172a',
    textMuted: '#64748b',
    gridBorder: '#e2e8f0'
  };

  /**
   * 1. Line Chart (Weekly Activity / Monthly Trends)
   */
  function createLineChart(canvasId, labels, data, labelName = 'Study Hours') {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return null;

    return new window.Chart(canvas, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: labelName,
          data: data,
          borderColor: COLORS.primaryBlue,
          backgroundColor: COLORS.blueSoft,
          fill: true,
          tension: 0.35,
          pointBackgroundColor: COLORS.primaryBlue,
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0f172a',
            padding: 10,
            cornerRadius: 8
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: COLORS.textMuted, font: { family: 'Inter', size: 11 } }
          },
          y: {
            grid: { color: COLORS.gridBorder, strokeDash: [4, 4] },
            ticks: { color: COLORS.textMuted, font: { family: 'Inter', size: 11 } },
            beginAtZero: true
          }
        }
      }
    });
  }

  /**
   * 2. Bar Chart (Assessment Scores / Department Performance)
   */
  function createBarChart(canvasId, labels, data, labelName = 'Score (%)') {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return null;

    return new window.Chart(canvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: labelName,
          data: data,
          backgroundColor: data.map(v => v >= 75 ? COLORS.primaryBlue : (v >= 50 ? COLORS.accentAmber : COLORS.accentRed)),
          borderRadius: 6,
          barPercentage: 0.6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0f172a',
            padding: 10,
            cornerRadius: 8
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: COLORS.textMuted, font: { family: 'Inter', size: 11 } }
          },
          y: {
            grid: { color: COLORS.gridBorder },
            ticks: { color: COLORS.textMuted, font: { family: 'Inter', size: 11 } },
            min: 0,
            max: 100
          }
        }
      }
    });
  }

  /**
   * 3. Doughnut Chart (Course Completion Breakdown)
   */
  function createDoughnutChart(canvasId, labels, data, colors = null) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return null;

    const defaultColors = [COLORS.primaryGreen, COLORS.primaryBlue, COLORS.accentAmber, '#94a3b8'];

    return new window.Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors || defaultColors,
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              padding: 14,
              font: { family: 'Inter', size: 12 },
              color: COLORS.textDark
            }
          }
        }
      }
    });
  }

  /**
   * 4. Radar Chart (Skill Growth vs Industry Benchmarks)
   */
  function createRadarChart(canvasId, labels, currentData, benchmarkData = null) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return null;

    const datasets = [
      {
        label: 'Current Skill Level',
        data: currentData,
        borderColor: COLORS.primaryBlue,
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        pointBackgroundColor: COLORS.primaryBlue,
        pointBorderColor: '#fff',
        pointHoverRadius: 5
      }
    ];

    if (benchmarkData) {
      datasets.push({
        label: 'Industry Target Benchmark',
        data: benchmarkData,
        borderColor: COLORS.primaryPurple,
        backgroundColor: 'rgba(124, 58, 237, 0.1)',
        borderDash: [4, 4],
        pointBackgroundColor: COLORS.primaryPurple,
        pointBorderColor: '#fff'
      });
    }

    return new window.Chart(canvas, {
      type: 'radar',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: { color: COLORS.gridBorder },
            grid: { color: COLORS.gridBorder },
            suggestedMin: 0,
            suggestedMax: 100,
            ticks: { display: false }
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              padding: 10,
              font: { family: 'Inter', size: 12 }
            }
          }
        }
      }
    });
  }

  return {
    createLineChart,
    createBarChart,
    createDoughnutChart,
    createRadarChart,
    COLORS
  };
})();

window.ChartHelper = ChartHelper;
