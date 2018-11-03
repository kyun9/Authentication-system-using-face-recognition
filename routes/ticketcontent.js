module.exports = function(passport) {
    var route = require('express').Router();
    var conn = require('./config/db')();

    
    // 티켓 상세 내용 렌더
    route.get('/:ticketId', function(req, res){
        var concertId = req.params.ticketId;
        var sql = 'SELECT * FROM concerts where id=?'
        conn.query(sql, concertId, function(err, results, fields){
            if(err){
                console.log(err);
                res.status(500).send('Internal Server Error');
            } else {
                res.render('ticketcontent', {user:req.user, results:results});
            }
        });
    });

    // 사용자 구매 요청 처리
    route.post('/buyTicket', function(req, res){
        var userId = req.user.id;
        var username = req.user.username;
        var concertId = req.body.concertId;
        var concertNm = req.body.concertNm;
        var time = req.body.time;
        
        var ticket = {
            u_id : req.user.id,
            c_id : req.body.concertId,
            buytime : req.body.time
        }
        console.log("req.body", req.body);
        console.log("userId: ", userId, ", username: ", username, ", concertId: ", concertId, ", concertNm: ", concertNm, ", time: ", time);
       
        // res.send('/ticketcontent/id='+concertId, username, concertNm);
        var sql = 'INSERT INTO tickets SET ?';
        conn.query(sql, ticket, function(err, results){
            if(err){
                console.log("error_message: ", err);
                res.status(500);
                res.redirect('/ticketcontent/id='+concertId);
            } else {
                res.redirect('/mypage');
            }
        });
    });
    
    return route;
};


