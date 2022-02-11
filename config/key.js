// 환경변수(NODE_ENV)로 개발/운영 구분
if (process.env.NODE_ENV === 'production') {
    module.exports = require('./prod') // prod.js 에서 가져옴
} else {
    module.exports = require('./dev')
}