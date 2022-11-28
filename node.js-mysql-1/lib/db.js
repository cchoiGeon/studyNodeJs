var mysql =require('mysql'); 
var db = mysql.createConnection({ 
    host     : '127.0.0.1',
    user     : 'nodejs',
    password : '111111',
    database : 'opentutorials'
  });
db.connect();
module.exports= db; // 변수 db  만 사용하겠다는 뜻