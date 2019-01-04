import axios from 'axios'
const json2Form = (json) => {
  var str = []
  for (var p in json) {
    str.push(encodeURIComponent(p) + '=' + encodeURIComponent(json[p]))
  }
  return str.join('&')
}
class API {
  get (param) {
    return axios.get(param.api, {})
  }
  post (param) {
    return axios.post(param.api, json2Form(param.param), {})
  }
}
export default API
