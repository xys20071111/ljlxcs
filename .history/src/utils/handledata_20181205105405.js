import API from '@/api/API'
const api = new API()
function axios (host, method, data, cb, noData, get) {
  let params = {
    api: host,
    param: {
      method: method
    }
  }
  noData ? Object.assign(params.param, data) : (params.param.data = JSON.stringify(data))
  api[get ? 'get' : 'post'](params).then(
    res => { cb(res.data) }
  ).catch(
    err => { console.log(err) }
  )
}
// 处理表格所需要的数据
function handleStatis (data) {
  console.log(data)
  let dataArr = []
  for (let dataOne of data) {
    let dataArrObj = {}
    for (let [dataKey, dataValue] of Object.entries(dataOne)) {
      dataArrObj[dataKey] = dataValue
      dataKey === 'pubtime' && (dataArrObj[dataKey] = (dataValue + '').slice(0, 4) + '年' + (dataValue + '').slice(4, 6) + '月' + ((dataValue + '').slice(6, 8) ? (dataValue + '').slice(6, 8) + '日' : ''))
      dataKey === 'amount_status' && (dataArrObj[dataKey] = ['收入', '支出'][dataValue * 1 - 1])
      let avgBox = ['read_rate', 'submit_rate', 'avgreadrate', 'avgsubmitrate', 'maxreadrate', 'maxsubmitrate', 'perc']
      if (avgBox.indexOf(dataKey) !== -1) {
        dataArrObj[dataKey] = (dataValue || dataValue === 0) ? (dataValue * 1).toFixed(2) * 1 + '%' : ''
      }
    }
    dataArr.push(dataArrObj)
  }
  console.log(dataArr)
  return dataArr
}
// 处理常规统计所有的数据
function handleAlldata (data) {
  let allData = []
  for (let dataKey of ['Dau', 'Mau', 'Dru']) {
    let allDataOne = []
    if (dataKey === 'Dau' || dataKey === 'Mau') {
      for (let dataAll of data[dataKey].all) {
        let dataOneObj = {}
        let statisKeyBox = {'Dau': ['date_no', '_dau'], 'Mau': ['mon_no', '_mau']}
        for (let dataEle of ['all', 'parent', 'teacher']) {
          dataEle === 'all' && (dataOneObj = {pubtime: dataAll[statisKeyBox[dataKey][0]], all: dataAll[statisKeyBox[dataKey][1]], parent: null, teacher: null})
          if (dataEle !== 'all') {
            let includeParTea = data[dataKey][dataEle].findIndex(value => { return value[statisKeyBox[dataKey][0]] === dataAll[statisKeyBox[dataKey][0]] })
            includeParTea !== -1 && (dataOneObj[dataEle] = data[dataKey][dataEle][includeParTea][statisKeyBox[dataKey][1]])
          }
        }
        allDataOne.push(dataOneObj)
      }
    } else {
      for (let dataAll of data[dataKey]) {
        let dataOneObj = {}
        dataOneObj.pubtime = dataAll.date_no
        dataOneObj.trueLogin = dataAll.dru ? dataAll.dru.split('/')[0] : null
        dataOneObj.allLogin = dataAll.dru ? dataAll.dru.split('/')[1] : null
        dataOneObj.perc = dataAll.dru ? dataAll.dru.split('/')[0] * 100 / dataAll.dru.split('/')[1] * 1 : null
        allDataOne.push(dataOneObj)
      }
    }
    allData.push(allDataOne)
  }
  return allData
}
// 处理时间
function handleTime (timeMs) {
  let nowTime = new Date(timeMs)
  let nowTimeYear = nowTime.getFullYear()
  let nowTimeMonth = (nowTime.getMonth() + 1 + '').padStart(2, 0)
  let nowTimeDay = (nowTime.getDate() + '').padStart(2, 0)
  let nowTimeHour = (nowTime.getHours() + '').padStart(2, 0)
  let nowTimeMinute = (nowTime.getMinutes() + '').padStart(2, 0)
  let nowTimeSecond = (nowTime.getSeconds() + '').padStart(2, 0)
  return '' + nowTimeYear + '-' + nowTimeMonth + '-' + nowTimeDay + ' ' +
  nowTimeHour + ':' + nowTimeMinute + ':' + nowTimeSecond
}
// 处理折线图所需要的数据
function handleChartData (data, whichEle, whichMoney) {
  console.log(data, whichEle)
  if (!data.length) { return '' }
  let chartObj = {}
  let keyToName = {
    'avgreadrate': '平均阅读率',
    'avgsubmitrate': '平均提交率',
    'hwcounts': '作业数',
    'msgcounts': '通知数',
    'maxreadrate': '最高阅读率',
    'maxsubmitrate': '最高提交率',
    'amount': '班级空间数',
    'cnt_cls': '班级数量',
    'cnt_stu': '学生数量',
    'read_rate': '阅读率',
    'submit_rate': '提交率',
    'all': '全部',
    'parent': '家长',
    'teacher': '老师',
    'trueLogin': '手机认证量',
    'allLogin': '总注册量',
    'perc': '手机认证比例',
    'amount_status1': '收入金额',
    'amount_status2': '支出金额',
    'amounts': '变更金额',
    'before_amount': '变更前金额',
    'current_amount': '余额',
    'f_amounts': '发放金额',
    'f_humans': '发放人数',
    'f_times': '发放人次',
    'x_amounts': '消费金额',
    'x_humans': '消费人数',
    'x_times': '消费人次'
  }
  let seriesName = {
    'hw': ['hwcounts', 'avgreadrate', 'maxreadrate', 'avgsubmitrate', 'maxsubmitrate'],
    'hws': ['cnt_cls', 'read_rate', 'submit_rate'],
    'msg': ['msgcounts', 'avgreadrate', 'maxreadrate'],
    'msgs': ['cnt_cls', 'cnt_stu', 'read_rate'],
    'sp': ['amount'],
    'com0': ['all', 'parent', 'teacher'],
    'com1': ['all', 'parent', 'teacher'],
    'com2': ['trueLogin', 'allLogin', 'perc'],
    'allI0': ['amount_status1', 'amount_status2', 'amounts', 'before_amount', 'current_amount'],
    'allI1': ['amount_status1', 'amounts', 'before_amount', 'current_amount'],
    'allI2': ['amount_status2', 'amounts', 'before_amount', 'current_amount'],
    'allI3': ['f_amounts', 'x_amounts', 'f_humans', 'f_times', 'x_humans', 'x_times'],
    'allI4': ['amount_status1', 'amount_status2', 'amounts', 'before_amount', 'current_amount']
  }
  let Xtime = {
    'hw': 'pubtime',
    'hws': 'hw_id',
    'msg': 'pubtime',
    'msgs': 'm_id',
    'sp': 'class_name',
    'com0': 'pubtime',
    'com1': 'pubtime',
    'com2': 'pubtime',
    'allI0': 'in_time',
    'allI1': 'in_time',
    'allI2': 'in_time',
    'allI3': 'pubtime',
    'allI4': 'in_time'
  }
  let chartText = {
    'hw': '作业统计数据',
    'hws': '发布作业阅读率',
    'msg': '通知统计数据',
    'msgs': '发布通知阅读率',
    'sp': '班级空间数据',
    'com0': '日活跃量',
    'com1': '月活跃量',
    'com2': '日注册量',
    'allI0': '变更资产明细',
    'allI1': '收入资产明细',
    'allI2': '支出资产明细',
    'allI3': '（每日）资产总览',
    'allI4': '资产明细'
  }
  let chartTitle = {
    'hw': '次',
    'hws': '次',
    'msg': '次',
    'msgs': '次',
    'sp': '次',
    'com0': '次',
    'com1': '次',
    'com2': '个',
    'allI0': '积分',
    'allI1': '积分',
    'allI2': '积分',
    'allI3': ['积分', '元'][whichMoney],
    'allI4': ['积分', '元'][whichMoney]
  }
  let totalTip = {
    'hw': '发布时间：',
    'hws': '作业ID：',
    'msg': '发布时间：',
    'msgs': '通知ID：',
    'sp': '班级名称：',
    'com0': '时间：',
    'com1': '时间：',
    'com2': '时间：',
    'allI0': '时间：',
    'allI1': '时间：',
    'allI2': '时间：',
    'allI3': '时间：',
    'allI4': '时间：'
  }
  chartObj.chartType = 'spline'
  chartObj.text = chartText[whichEle]
  chartObj.title = chartTitle[whichEle]
  chartObj.cateArr = []
  chartObj.series = []
  for (let dataOne of data) {
    Xtime[whichEle] === 'pubtime' && chartObj.cateArr.push((dataOne.pubtime + '').slice(0, 4) + '年' + (dataOne.pubtime + '').slice(4, 6) + '月' + ((dataOne.pubtime + '').slice(6, 8) ? (dataOne.pubtime + '').slice(6, 8) + '日' : ''))
    Xtime[whichEle] !== 'pubtime' && chartObj.cateArr.push(dataOne[Xtime[whichEle]])
  }
  for (let seriesOne of seriesName[whichEle]) {
    let [chartOneData, visible, events] = [[], '', {}]
    for (let dataOne of data) {
      dataOne[seriesOne] !== '--' && chartOneData.push(dataOne[seriesOne] || dataOne[seriesOne] === 0 ? dataOne[seriesOne] * 1 : dataOne[seriesOne])
      dataOne[seriesOne] === '--' && chartOneData.push(null)
    }
    if (whichEle === 'hw' || whichEle === 'msg' || whichEle === 'hws') {
      visible = seriesOne === 'hwcounts' || seriesOne === 'msgcounts' || seriesOne === 'cnt_cls'
      events.legendItemClick = function () {
        if (seriesOne === 'hwcounts' || seriesOne === 'msgcounts' || seriesOne === 'cnt_cls') {
          seriesOne !== 'cnt_cls' && this.chart.yAxis[0].setTitle({text: '(次)'})
          seriesOne === 'cnt_cls' && this.chart.yAxis[0].setTitle({text: '(个)'})
          this.chart.series.forEach((oneChart, index) => {
            index !== 0 && oneChart.setVisible(false, false)
          })
        } else {
          this.chart.yAxis[0].setTitle({text: '(%)'})
          this.chart.series[0].setVisible(false, false)
        }
      }
    } else if (whichEle === 'msgs') {
      visible = seriesOne === 'cnt_cls'
      events.legendItemClick = function () {
        this.chart.yAxis[0].setTitle({text: '(' + {cnt_cls: '个', cnt_stu: '人', read_rate: '%'}[seriesOne] + ')'})
        this.chart.series.forEach((oneChart, index) => {
          ['cnt_cls', 'cnt_stu', 'read_rate'][index] !== seriesOne && oneChart.setVisible(false, false)
        })
      }
    } else if (whichEle === 'com2') {
      visible = seriesOne === 'trueLogin' || seriesOne === 'allLogin'
      events.legendItemClick = function () {
        if (seriesOne === 'trueLogin' || seriesOne === 'allLogin') {
          this.chart.yAxis[0].setTitle({text: '(个)'})
          this.chart.series[2].setVisible(false, false)
        } else {
          this.chart.yAxis[0].setTitle({text: '(%)'})
          this.chart.series[0].setVisible(false, false)
          this.chart.series[1].setVisible(false, false)
        }
      }
    } else if (whichEle === 'allI3') {
      visible = seriesOne === 'f_amounts' || seriesOne === 'x_amounts'
      events.legendItemClick = function () {
        if (seriesOne === 'f_amounts' || seriesOne === 'x_amounts') {
          this.chart.yAxis[0].setTitle({text: '(' + ['积分', '元'][whichMoney] + ')'})
          this.chart.series[2].setVisible(false, false)
          this.chart.series[3].setVisible(false, false)
          this.chart.series[4].setVisible(false, false)
          this.chart.series[5].setVisible(false, false)
        } else {
          this.chart.yAxis[0].setTitle({text: '(人)'})
          this.chart.series[0].setVisible(false, false)
          this.chart.series[1].setVisible(false, false)
        }
      }
    }
    chartObj.series.push({
      name: keyToName[seriesOne],
      data: chartOneData,
      visible: visible,
      events: events
    })
  }
  chartObj.formatter = function (e) {
    let unitTitle = this.point.series.yAxis.axisTitle.textStr.replace(/['(',')']/gi, '')
    return totalTip[whichEle] + this.x + '<br>' + this.series.name + '：' + this.y.toFixed(2) * 1 + unitTitle
  }
  return chartObj
}
export {
  axios,
  handleStatis,
  handleAlldata,
  handleTime,
  handleChartData
}
