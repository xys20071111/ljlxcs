# test4

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

```javascript
import API from './API.js'
const api = new API()
// 系统班级名称信息的转化，备用
const objectClassNum = () => {
  const classNum = []
  for (let i = 1; i <= 12; i++) {
    let v = {
      id: i,
      desc: i + '班'
    }
    classNum.push(v)
  }
  return classNum
}

const formatClass = (stage, grade, seqid, cb) => {
  let stagetemp, gradetemp, seqidtemp
  let params = {
    api: 'https://wxosscdn.ljlx.com/res/global/res_stages_1529604316.json'
  }
  api
    .get(params)
    .then(res => {
      let stages = res.data
      if (stages) {
        let errStages = stages.findIndex(function (value, index, arr) {
          return stage === value.stage ? stage === value.stage : stage === 0
        })
        if (errStages < 0) {
          console.log('err')
          return
        }
        for (let val of stages) {
          if (stage === val.stage) {
            stagetemp = val.desc
            for (let val1 of val.grades) {
              if (grade === val1.grade) {
                gradetemp = val1.desc
              }
            }
          }
        }
        let seqids = objectClassNum()
        for (let val of seqids) {
          if (seqid === val.id) {
            seqidtemp = val.desc
          }
        }
        cb(stagetemp + gradetemp + seqidtemp)
      }
    })
    .catch(err => {
      console.log(err)
    })
}

// for循环掉用调用
formatClass(val.stage, val.grade, val.seq_id, cb => val.clsnamsys = cb)


```