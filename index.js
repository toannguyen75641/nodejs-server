var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var cookies = require('cookies');
var mysql = require('mysql');

var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "nodejs-chat"
});

// conn.connect(function(err) {
  // if (err) throw err;
  // var sql = "SELECT message.*, users.name AS name FROM message LEFT JOIN users ON (users.id = message.user_id);"
  // con.query(sql, function(err, result) {
  //   if (err) throw err;
  //   // emit to client
  // });
// });

io.on('connection', function(socket){
	var sql1 = "SELECT message.*, users.name AS name FROM message LEFT JOIN users ON (users.id = message.user_id);";
	conn.query(sql1, function(err, result) {
	    if (err) throw err;

		io.emit('list message', result);
		console.log(result);
	});

	socket.on('chat message', function(data){

    io.emit('chat message', data);

    // insert msg into db
	  var sql2 = "INSERT INTO message(user_id, content) VALUES ("+data.user_id+",'"+data.msg+"');"
	  conn.query(sql2, function(err, result) {
	    if (err) throw err;
	  });
	});
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
