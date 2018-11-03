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
    user:'20181team',
    password:'gachon654321',
    database:'20181team_G'
  })
}));

app.set('view engine','ejs');                             /*------------views ejs사용----------*/
app.set('views', path.join(__dirname,'views'));           /*------------path 사용 views경로----------*/
app.use(express.static(path.join(__dirname, 'public')));/*------------path 사용 public경로----------*/

var passport = require('./routes/config/passport')(app);   //passport 맨위로


var index = require('./routes/index');   /*------------메인페이지----------*/
var ticketlist= require('./routes/ticketlist')(); /*------------티켓리스트페이지----------*/
var ticketcontent= require('./routes/ticketcontent')(passport); /*------------티켓콘텐츠페이지----------*/
var mypage = require('./routes/mypage')(passport);/*------------마이페이지----------*/
var auth = require('./routes/auth')(passport);/*------------인증(로그인/회원가입)----------*/

app.use('/', index);
app.use('/ticketlist', ticketlist);
app.use('/ticketcontent', ticketcontent);
app.use('/auth/', auth);
app.use('/mypage', mypage);

// 관리자
var admin = require('./routes/admin')(); /*------------관리자 페이지----------*/

app.use('/admin', admin);

 /*------------콘솔에 포트 연결 알림.----------*/
app.listen(62001, function(){
  console.log('Connected 62001 port!!!');
});

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
//   });
  
//   // error handler
//   app.use(function(err, req, res, next) {
//     // set locals, only providing error in development

//     // res.locals.message = err.message;
//     // res.locals.error = req.app.get('env') === 'development' ? err : {};
  
//     // render the error page
//     res.status(err.status || 500);
//     res.render('error', { error : err});
//   });

module.exports = app;









// 잘못된 로그인을 시도하면 안됨.
//관리자 계정을 ejs에서 비교가 아니라 js에서 처리하기
