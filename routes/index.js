var express = require('express');
var router = express.Router();
var conn = require('./config/db')();


/* GET home page. */
router.get('/', function(req, res, next) {
    var sql = 'select * from concerts';
    conn.query(sql, function(err, results, fields){
        if(err){
            res.send('<script>console.log("조회된 정보가 없습니다.");' +
                            'window.location.replace("/");</script>');
        } else {
            res.render('index', {user:req.user, results:results});
        }
    });
    
});

module.exports = router;
