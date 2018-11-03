module.exports = function(passport){
    var conn = require('./config/db')();
    var route = require('express').Router();

    /**
     *  관리자 로그인 객체
     */
    var admin = {
        username: 'admin',
        password: 'gachon654321'
    }
    /**
     *  관리자 로그인 화면 render
     */
    route.get('/login', function(req, res){
        res.render('admin/login');
    });

    /**
     *  관리자 로그인 요청 처리
     */
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
    /**
     *  관리자 메인 화면 render
     */
    route.get('/main', function(req, res){
        var sql = 'select * from users';
        conn.query(sql, function(err, users, fields){
            if(err){
                console.log(err);
                res.status(500).send('Internal Server Error');
            } else {
                var sql = 'select * from tickets';
                conn.query(sql, function(err, results, fields){
                    if(err){
                        console.log(err);
                        res.status(500).send('Internal Server Error, Sql was failed..');
                    } else {
                        res.render('admin/main', {users:users, results:results});
                    }
                });
                // res.render('admin/main', {users:users});
            }
        });
    });

    /**
     * 사용자 삭제
     */
    route.get('/deleteUser/:id', function(req, res){
        var id = req.params.id;
        // var id = req.query.id;
        var userIdSession = req.user.id;

        var sql = 'DELETE FROM users WHERE id=?';
        if(userIdSession != id){
            conn.query(sql, id, function(err, users, fields){
                if(err){
                    console.log(err);
                    res.status(500).send('Internal Server Error');
                } else {
                    res.redirect('/admin/main');
                }
            });
        } else {
            // res.send('<script type="text/javascript">console.log("오류발생");</script>');
            // console.log("오륭로ㅛㅇ륨ㄴㅇ루넘ㅇ루");
            // res.redirect('/admin/main');
            res.send('<script>alert("이미 로그인 되어있는 아이디입니다.!");' +
                            'window.location.replace("/admin/main");</script>');
        }
        
    });

    return route;
};