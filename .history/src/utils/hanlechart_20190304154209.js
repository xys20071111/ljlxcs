
function handleLine (chartData, whichEle) {
  console.log(chartData)
  let chartOption = {
    chart: {
      type: chartData.chartType,
      spacing: [30, 4, 30, 10],
      backgroundColor: 'transparent',
      showAxes: false
    },
    title: {
      text: chartData.text
    },
    credits: {
      enabled: false
    },
    navigation: {
      buttonOptions: {
        enabled: false
      }
    },
    exporting: {
      enabled: false
    },
    yAxis: {
      title: {
        text: '(' + chartData.title + ')',
        rotation: 0,
        align: 'high',
        x: 30,
        y: -30
      }
    },
    legend: {
      enabled: chartData.series.length > 1,
      align: 'center',
      verticalAlign: 'bottom',
      itemStyle: {
        fontSize: '12px'
      }
    },
    xAxis: {
      categories: chartData.cateArr,
      tickLength: 0,
      endOnTick: true,
      lineColor: 'transparent',
      labels: {
        style: {
          color: '#32b1fa',
          fontSize: '13px'
        }
      },
      visible: true
    },
    plotOptions: {
      spline: {
        dataLabels: {
          enabled: true    
        }
      }
    },
    tooltip: {
      style: {
        fontSize: '14px'
      },
      formatter: chartData.formatter
    },
    series: chartData.series
  }
  return chartOption
}
export {
  handleLine
}
