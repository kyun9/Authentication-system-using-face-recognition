module.exports = function(passport){
    var route = require('express').Router();
    var conn = require('./config/db')();

    //관리자 메인 페이지
    route.get('/', function(req, res){
        if(req.user && req.user.displayName){
            res.render('main', {user:req.user.displayName});
        } else{
            res.render('/manager/login');
        }
    });

    route.get('/')
}