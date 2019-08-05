//DB 모듈(mysql)
module.exports = function(){
  var mysql = require('mysql');
  var conn = mysql.createConnection({
    host :'HOSTID',
    user :'USERID',
    password:'PASSWORD',
    database:'DB_NAME'
  });
  conn.connect();;

  return conn;
}
