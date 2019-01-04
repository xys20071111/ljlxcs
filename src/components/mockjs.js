import Mock from 'mockjs'
var Random = Mock.Random
const userinfo = () => {
  return Mock.mock({
    'userinfo|1-100': [{
      'id|+1': 1,
      'user_id': '@INT(60000,70000)',
      'user_role': '@INT(1,3)',
      'status': 200,
      'mobile': '@INT(13810000001,13820000001)',
      'uname|+1': Random.cname() + '@INT(1,1000)',
      'realname': '*',
      'last_time': Random.datetime(),
      'gender': '@INT(0,2)',
      'avatar': Random.image('125x125'),
      'city': Random.city(),
      'province': Random.province(),
      'country': Random.county(),
      'intro': Random.cparagraph(),
      'p_id': '@INT(1000,7000)'
    }]
  })
}

const userinfoTest = () => {
  var data = {
    userinfo: userinfo().userinfo,
    code: 0,
    msg: '成功'
  }
  return Mock.mock('/userinfoTest', data)
}

export { userinfo, userinfoTest }
