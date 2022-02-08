const mongoose = require('mongoose');

// 몽구를 이용하여 스키마 생성
const userSchema = mongoose.Schema({
    // 유저와 관련된 필드들
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, // email로 입력한 값에 공백 제거
        unique: 1 // 중복 방지
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    isAdmin: {
        // 관리자, 일반유저 구분용 컬럼
        type: Number,
        default: 0 // 기본값은 0(일반유저)
    },
    image: String,
    token: { // 유효성 관리용 컬럼
        type: String
    },
    tokenExp: { // 토큰 유효 기간
        type: Number
    }
})

// 모델로 스키마 감싸기
const User = mongoose.model('User', userSchema) // (모델이름, 스키마)

module.exports = { User } // 이 모델이 외부에서도 사용할 수 있도록 설정
