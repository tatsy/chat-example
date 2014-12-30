// index.js
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.render('login');
});

app.post('/room', function(req, res) {
	res.render('index', {roomName: req.body.roomName, userName: req.body.userName, password: req.body.password});
});

io.on('connection', function(socket) {
	socket.emit('connected', {});

	socket.on('user login', function(chatinfo) {
		io.emit('chat message', chatinfo.userName + ' logged-in');
	    socket.on('disconnect', function() {
	    	io.emit('chat message', chatinfo.userName + ' logged-out');
	    });

	    socket.on('chat message', function(msg) {
	        io.emit('chat message', chatinfo.userName + ': ' + msg);
	    });

	    socket.on('start typing', function(data) {
	    	io.emit('chat message', chatinfo.userName + ' is typing');
	    });

	    socket.on('cancel typing', function(data) {
	    	io.emit('cancel typing', chatinfo.userName + ' is typing');
	    });
	});
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});
