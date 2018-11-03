//DB 모듈(mysql)
module.exports = function(){
  var mysql = require('mysql');
  var conn = mysql.createConnection({
    host :'localhost',
    user :'20181team',
    password:'gachon654321',
    database:'20181team_G'
  });
  conn.connect();;

  return conn;
}
