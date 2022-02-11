const express = require('express') // node_module에 다운로드된 express 모듈 가져오기
const app = express() // 새로운 express app 생성
const port = 5555 // 백엔드 포트 지정

// request data 처리를 위한 lib
const bodyParser = require('body-parser');
// application/x-www-urlencoded 형식의 데이터 받을 수 있도록 설정
app.use(bodyParser.urlencoded({extended: true}));
// json 형식 데이터 받을 수 있도록 설정
app.use(bodyParser.json());

// User Model 가져오기
const { User } = require('./models/User');

// 몽고DB 연결
const config = require('./config/key');
const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

// 루트로 접근하면 Hello World! 출력
app.get('/', (req, res) => {
  res.send('Hello World!')
})

// 회원가입 api
// post method 이용, 라우터의 엔드포인트는 register, 콜백 함수
app.post('/register', (req, res) => {

    // 회원가입 정보 받기

    // User Model instance 만들기
    // req.body를 json 형태로 구성하기 위해 bodyParser 활용
    const user = new User(req.body)

    // save : 몽고DB insert method
    // user Table에 insert
    // doc에는 request로 받아 insert한 data가 들어있음
    user.save((err, doc) => {

        // insert 실패 시 client에 json 형태로 err msg response
        if(err) return res.json({ success: false, err})

        // insert 성공 시 200 OK response, json 형태로 success response
        return res.status(200).json({
            success: true
        })

    })

})

// 5555 포트에서 app 실행
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})