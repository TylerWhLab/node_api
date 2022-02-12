const express = require('express') // node_module에 다운로드된 express 모듈 가져오기
const app = express() // 새로운 express app 생성
const port = 5555 // 백엔드 포트 지정

// request data 처리를 위한 lib
const bodyParser = require('body-parser');

// application/x-www-urlencoded 형식의 데이터 받을 수 있도록 설정
app.use(bodyParser.urlencoded({extended: true}));

// json 형식 데이터 받을 수 있도록 설정
app.use(bodyParser.json());


// cookie 사용할 때 필요한 lib
const cookieParser = require('cookie-parser');
app.use(cookieParser()); // 쿠키 파서 사용할 수 있도록 설정, () 빠지면 아무 메시지 없이 서버 응답 없음

// User Model 가져오기
const { User } = require('./models/User');

// 인증 모듈 가져오기
const { auth } = require('./middleware/auth')

// 몽고DB 연결
const config = require('./config/key');
const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

// 루트로 접근하면 Hello World! 출력
app.get('/api/hello', (req, res) => {
  res.send('api Home')
})

// 회원가입 api
// post method 이용, 라우터의 엔드포인트는 register, 콜백 함수
app.post('/api/user/register', (req, res) => {

    // 회원가입 정보 받기

    // User Model instance 만들기
    // req.body를 json 형태로 구성하기 위해 bodyParser 활용
    // User Model에 request data 넣기
    const user = new User(req.body)


    // 비밀번호 암호화(model에서 작성)


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


// 로그인
app.post('/api/user/login', (req, res) => {

    // SELECT * FROM USER WHERE email = req.body.email;
    User.findOne({ email: req.body.email }, (err, queryResult) => { // queryResult = user model instance 하나
      if(!queryResult) {
        return res.json({
          loginSuccess: false,
          message: '이메일을 다시 확인하세요.'
        })
      }

      // pw 비교, User.js Model에 메서드 구현
      queryResult.comparePw(req.body.password, (err, isMatch) => {
          if(!isMatch) return res.json({loginSuccess: false, message: '비밀번호가 틀렸습니다.'})
      })

      /*
        callback은 comparePw() 인자에서 구현, comparePw() 구현코드에서 callback 호출
        comparePw() 구현코드에서 가공한 값을 callback 인자에 넣으면 isMatch 처럼 결과를 인자로 받을 수 있다.
      */

      // 토큰 생성, User.js Model에 메서드 구현
      queryResult.genToken((err, user) => {
          if(err) return res.status(400).send(err); // bad request

          // token 저장(cookie, local storage, session)
          // 여기선 cookie
          res.cookie('x_auth', user.token)
            .status(200)
            .json({ loginSuccess: true, userId: user._id })
      })

    })

})



// auth
app.get('/api/user/auth', auth, (req, res) => { // auth라는 미들웨어 : request를 받고, callback 실행 이전에 수행할 작업

    // auth에 성공해야만 이후 코드가 실행됨
    res.status(200).json({
        _id: req.user._id, // auth.js에서 req에 user를 담았기 때문에 이렇게 사용
        isAdmin: req.user.isAdmin === 1 ? true : false,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        image: req.user.image
    })

})


// logout : token 삭제
app.get('/api/user/logout', auth, (req, res) => { // 로그인 된 상태에서 로그아웃 해야하기 때문에 auth middleware 사용

    User.findOneAndUpdate(
        { _id: req.user._id}, // auth middleware에서 req 에 user를 넣어줌
        {token: ''}, 
        (err, user) => {
          if(err) return res.json({ success: false, err });
          return res.status(200).send({ success: true })
        }
    )
    
})



// 5555 포트에서 app 실행
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})