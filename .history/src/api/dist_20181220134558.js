// 性别状态显示转换
const formatGender = (props) => {
  return props === 1 ? '男' : props === 2 ? '女' : '未知'
}
// 身份状态显示转换
const formatUserRole = (props) => {
  return props === 1 ? '学生' : props === 2 ? '家长' : props === 3 ? '老师' : '未知'
}
// 用户状态显示转换
const formatStatus = (props) => {
  return props === 200 ? '正常' : '异常'
}
// 班级状态显示转换
const formatClsStatus = (props) => {
  let status = '异常'
  status = props === 100 ? '初始状态' : status
  status = props === 200 ? '正常' : status
  status = props === 201 ? '正常-休假' : status
  status = props === 500 ? '封存' : status
  return status
}
// 用户头像显示转换avatar
const formatAvatar = (props) => {
  props = props || ''
  let temp = props.indexOf('https') === -1 ? 'https://wxosscdn.ljlx.com/ulogo/compress_' + props : props
  return props !== '' ? temp : 'https://wxosscdn.ljlx.com/ulogo/compress_uLogoNone.jpg'
}
// 班内身份显示转换
const formatEduRole = (props, propsOwn, propsStu) => {
  let edu = '未知'
  props === 0 && (edu = '学生')
  props && props & 1 && (edu = '家长')
  props && props & 2 && (edu = '老师')
  props && props & 4 && (edu = '管理员')
  props && props & 8 && (edu = '班主任')
  propsOwn && (edu = '创建者')
  propsStu && (edu = '学生')
  return edu
}
// 班级与学段转换
const formatStageGrade = (stage, grade) => {
  let stageGrade = ['无', '无', '无']
  const classes = [
    {},
    {name: '幼儿园', grade: ['', '小小班', '小班', '中班', '大班']},
    {name: '小学', grade: ['', '一年级', '二年级', '三年级', '四年级', '五年级', '六年级']},
    {name: '初中', grade: ['', '初一', '初二', '初三', '初四']},
    {name: '高中', grade: ['', '高一', '高二', '高三', '高四']},
    {name: '职高', grade: ['', '职一', '职二', '职三', '职四']},
    {name: '大专', grade: ['', '专一', '专二', '专三', '专四']},
    {name: '硕士', grade: ['', '研一', '研二', '研三', '研四']},
    {name: '博士', grade: ['', '博一', '博二', '博三', '博四']},
    {name: '博士后', grade: ['', '博后一', '博后二', '博后三']}
  ]
  stage && (stageGrade[0] = classes[stage].name) && (stageGrade[2] = classes[stage].name)
  stage && grade && (stageGrade[1] = classes[stage].grade[grade]) && (stageGrade[2] += ('-' + classes[stage].grade[grade]))
  return stageGrade
}

// 班级性质显示转换
const formatClassMode = (props) => {
  return props === 1 ? '正规教学班' : props === 2 ? '培训机构班级' : props === 3 ? '虚拟班级' : '未知'
}
// 拼接省市县
const getCountry = (country, province, city) => {
  let area = '*'
  country = country && (province || city) ? country + '-' : country
  province = province && city ? province + '-' : province
  area = country || province || city ? country + province + city : area
  return area
}
// 处理时间字符串
const getStrTime = (props) => {
  let time = ''
  let year = (props + '').slice(0, 4) ? (props + '').slice(0, 4) + '年' : ''
  let month = (props + '').slice(4, 6) ? (props + '').slice(4, 6) + '月' : ''
  let day = (props + '').slice(6, 8) ? (props + '').slice(6, 8) + '日' : ''
  time = year + month + day
  return time
}
// 处理小数
const getStrFixed = (props, fixed) => {
  fixed = fixed || 2
  let resultFixed = (props || props === 0) ? (props * 1).toFixed(2) * 1 + '%' : ''
  return resultFixed
}

export {
  formatGender,
  formatUserRole,
  formatStatus,
  formatClsStatus,
  formatAvatar,
  formatEduRole,
  formatStageGrade,
  formatClassMode,
  getCountry,
  getStrTime,
  getStrFixed
}
