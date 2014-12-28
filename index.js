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

// roomへのPOST通信
app.post('/room', function(req, res) {
	res.render('index', {user: req.body.user});
});

io.on('connection', function(socket) {
	socket.emit('connected', {});

	socket.on('user login', function(user) {
		io.emit('chat message', user.name + ' logged-in');
	    socket.on('disconnect', function() {
	    	io.emit('chat message', user.name + ' logged-out');
	    });

	    socket.on('chat message', function(msg) {
	        io.emit('chat message', user.name + ': ' + msg);
	    });

	    socket.on('start typing', function(data) {
	    	io.emit('chat message', user.name + ' is typing');
	    });

	    socket.on('cancel typing', function(data) {
	    	io.emit('cancel typing', user.name + ' is typing');
	    });
	});
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});
