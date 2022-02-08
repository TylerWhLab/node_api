const express = require('express') // node_module에 다운로드된 express 모듈 가져오기
const app = express() // 새로운 express app 생성
const port = 5555 // 백엔드 포트 지정

// 몽고DB 연결
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://kimjeongkyun:kimjeongkyun@api.a0tda.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

// 루트로 접근하면 Hello World! 출력
app.get('/', (req, res) => {
  res.send('Hello World!')
})

// 5555 포트에서 app 실행
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})