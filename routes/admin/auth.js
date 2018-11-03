module.exports = function(passport){
    var conn = require('./config/db')();
    var route = require('express').Router();

    // 관리자 로그인 객체
    var admin = {
        username: 'admin',
        password: 'gachon654321'
    }
    // 관리자 로그인 화면 render
    route.get('/login', function(req, res){
        res.render('admin/login');
    });

    // 관리자 로그인 value Post요청 처리
    route.post('/login', function(req, res){
        var uname = req.body.username;
        var pwd = req.body.password;
        if(uname == admin.username){
            if(pwd == admin.password){
                res.redirect('/admin/main');
            } else {
                res.redirect('/admin/login');
            }
        }
    });

    return route;
};