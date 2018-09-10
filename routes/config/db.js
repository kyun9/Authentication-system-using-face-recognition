//DB 모듈(mysql)
module.exports = function(){
  var mysql = require('mysql');
  var conn = mysql.createConnection({
    host :'localhost',
    user :'root',
    password:'111111',
    database:'ticket'
  });
  conn.connect();;

  return conn;
}
