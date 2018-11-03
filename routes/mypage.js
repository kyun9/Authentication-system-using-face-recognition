module.exports = function(passport) {
    var bkfd2Password =require('pbkdf2-password');
    var hasher = bkfd2Password();
    var route = require('express').Router();
    var conn = require('./config/db')();
    var formidable = require('formidable'); // form 태그 데이터들을 가져오는 모듈
    var fs = require('fs-extra'); // 파일을 복사하거나 디렉토리 복사하는 모듈
    
    route.get('/', function(req, res) {
        var userId = req.user.id;
        var sql = 'SELECT * FROM users WHERE id=?';
        if (req.user && req.user.displayName) { // req.user는
            conn.query(sql, [userId], function(err, results){
                if(err){
                    console.log("등록된 사진이 없습니다. "+err);
                } else {
                    res.render('mypage', {
                        user: req.user,
                        imgPath: results.ImgPath,
                        personId: results.personId,
                        faceId: results.faceId
                    });    
                }
            })
            // res.render('mypage', {
            //     user: req.user
            // });
        } else {
            res.redirect('/auth/login');
        }
    });

    route.post('/upload/:id', function(req, res) {
        var name = "";
        var ImgPath = "";
        var form = new formidable.IncomingForm();
        
        form.parse(req, function(err, fields, files) {
            name = req.user.displayName;
        });

        form.on('end', function(fields, files) {

            for (var i = 0; i < this.openedFiles.length; i++) {

                var temp_path = this.openedFiles[i].path;
                var file_name = this.openedFiles[i].name;
                var index = file_name.indexOf('/');
                var new_file_name = file_name.substring(index + 1);
                var new_location = 'public/resources/images/' + name + '/';
                var db_new_location = 'resources/images/' + name + '/';
                
                //실제 저장하는 경로와 db에 넣어주는 경로로 나눠 주었는데 나중에 편하게 불러오기 위해 따로 나눠 주었음
                ImgPath = db_new_location + file_name;
                fs.copy(temp_path, new_location + file_name, function(err) { // 이미지 파일 저장하는 부분임
                    if (err) {
                        console.error(err);
                    }
                });
            }
            var id = req.params.id;
            var img = {
                ImgPath: ImgPath
            };
            var sql = 'UPDATE users SET ? WHERE id=?';
            conn.query(sql, [img, id], function(err, results) {
                if (err) {
                    console.log(err);
                    res.status(500);
                } else {
                    res.redirect('/mypage');
                }
            });
        });
    });

    route.get('/getTicketData', function(req, res){
    
    });

    /**
     * return받은 faceId DB에 저장 
     */
    route.post('/saveFaceId/:id', function(req, res){
        var id = req.params.id;
        var returnfaceId = req.body.faceId;
        var face = {
            faceId : returnfaceId
        }
        var sql = 'UPDATE users SET ? WHERE id=?';
            conn.query(sql, [face, id], function(err, results) {
                if (err) {
                    console.log(err);
                    res.status(500);
                } else {
                    res.redirect('/mypage');
                }
            });
    });

    /**
     * 사용자 이미지 삭제
     */
    route.get('/deleteImg/:id', function(req, res){
        var id = req.params.id;
        var sql = 'UPDATE users SET ? WHERE id=?';
        var obj = {
            imgPath : "",
            faceId : ""
        }
        conn.query(sql, [obj, id], function(err, results){
            res.redirect('/mypage');
        });
    });

    /*--------POST방식----비밀번호변경----------*/
    route.post('/modify_password/:id', function(req, res) {
        var password_confirm = req.body.password_confirm;
        var password = req.body.password;
        if (password == password_confirm) {
            hasher({
                password: req.body.password
            }, function(err, pass, salt, hash) {
                    var password = {
                        password: hash,
                        salt: salt
                    };
                    var id = req.params.id;
                    var sql = 'UPDATE users SET ? WHERE id=?';
                    conn.query(sql, [password /*var password[]*/ , id], function(err, results) {
                        if (err) {
                            console.log(err);
                            res.status(500);
                        } else {

                            req.session.save(function() {
                            res.redirect('/mypage');
                            }); //원래는 없지만 passport모듈을 쓰므로서 사용가능.
                        }
                    });
            });
        } else {

        }
    });
  
    /**
     * 이메일 변경
     */
    route.post('/modify_email/:id', function(req, res) {
        var id = req.params.id;
        var email = req.body.email;
        //var id = req.user.id;
        var sql = 'UPDATE users SET  email=? WHERE id=?';
        conn.query(sql, [email, id], function(err, results) {
            if (err) {
            console.log(err);
            res.status(500);
            } else {

            req.session.save(function() {
                res.redirect('/mypage');
            }); //원래는 없지만 passport모듈을 쓰므로서 사용가능.
            }
        });
    });

    return route;
}
