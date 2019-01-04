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
const formatEduRole = (props) => {
  return props === 0 ? '学生' : props === 1 ? '家长' : props === 2 ? '老师' : props === 4 ? '管理员' : props === 8 ? '班主任' : '未知'
}
// 班内创建者显示转换
const formatIsOwner = (props) => {
  return props === 1 ? '创建者' : '未知'
}
// 班内学生显示转换
const formatIsStu = (props) => {
  return props === 1 ? '学生' : '未知'
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

export {
  formatGender,
  formatUserRole,
  formatStatus,
  formatClsStatus,
  formatAvatar,
  formatEduRole,
  formatIsOwner,
  formatIsStu,
  formatClassMode,
  getCountry
}
