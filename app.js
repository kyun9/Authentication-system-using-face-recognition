var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var session = require('express-session');
var MySQLStore =require('express-mysql-session')(session);


var app = express();
app.use(bodyParser.urlencoded({extended:false}));   /*------------post 사용을 위한 bodyParser등록----------*/

app.use(session({                     /*------------세션 설정부분----------*/
  secret:'1234DSFs@adf1234!@#$asd',
  resave: false,
  saveUninitialized:true,
  store:new MySQLStore({
    host:'localhost',
    port:3306,
    user:'root',
    password:'111111',
    database:'ticket'
  })
}));

app.set('view engine','ejs');                             /*------------views ejs사용----------*/
app.set('views', path.join(__dirname,'views'));           /*------------path 사용 views경로----------*/
app.use(express.static(path.join(__dirname, 'public')));/*------------path 사용 public경로----------*/

var passport = require('./routes/config/passport')(app);   //passport 맨위로


var index = require('./routes/index');   /*------------메인페이지----------*/
var ticketlist= require('./routes/ticketlist')(); /*------------티켓리스트페이지----------*/
var ticketcontent= require('./routes/ticketcontent')(); /*------------티켓콘텐츠페이지----------*/
var mypage = require('./routes/mypage')(passport);/*------------마이페이지----------*/
var auth = require('./routes/auth')(passport);/*------------인증(로그인/회원가입)----------*/


app.use('/', index);
app.use('/ticketlist', ticketlist);
app.use('/ticketcontent', ticketcontent);
app.use('/auth/', auth);
app.use('/mypage', mypage);

// app.get('/welcome', function(req, res){     /*@@@@@@@@@@@@임시 로그인 welcome 페이지@@@@@@@@@@@@@@@@@@@*/
//   if(req.user && req.user.displayName){
//     res.send(`
//       <h1>hello, ${req.user.displayName}</h1>
//       <a href="/auth/logout">logout</a>
//       `)
//     }
//     else{
//       res.send(`
//       <h1>welcome</h1>
//       <a href="/auth/login">login</a>
//     `)
//   }
// });



                                            /*------------콘솔에 포트 연결 알림.----------*/
app.listen(3003, function(){
  console.log('Connected 3003 port!!!');
});





module.exports = app;









// 잘못된 로그인을 시도하면 안됨.
//관리자 계정을 ejs에서 비교가 아니라 js에서 처리하기
