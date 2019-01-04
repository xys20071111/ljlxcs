const setCookie = (cname, cvalue, exdays) => {
  var d = new Date()
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
  var expires = 'expires=' + d.toUTCString()
  document.cookie = cname + '=' + cvalue + '; ' + expires
}

const getCookie = (cname) => {
  var reg = new RegExp('(^| )' + cname + '=([^;]*)(;|$)')
  var arr = document.cookie.match(reg)
  if (arr) return (arr[2])
  else return null
}

const delCookie = (name) => {
  var exp = new Date()
  exp.setTime(exp.getTime() - 1)
  var cval = getCookie(name)
  if (cval !== null) document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
}

const delCookieAll = () => {
  let keys = document.cookie.match(/[^ =;]+(?=)/g)
  if (keys) {
    for (var i = keys.length; i--;) {
      document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString() + ';path=/'
    }
  }
}
export { setCookie, getCookie, delCookie, delCookieAll }
