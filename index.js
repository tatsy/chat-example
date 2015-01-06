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
	res.render('index', { userName: req.body.userName });
});

io.on('connection', function(socket) {
	socket.emit('connected', {});

	socket.on('user login', function(data) {
		io.emit('chat message', { who: 'System', message: data.user + ' entered' });
	    socket.on('disconnect', function() {
	    	io.emit('chat message', { who: 'System', message: data.user + ' exited' });
	    });

	    socket.on('chat message', function(msg) {
	        io.emit('chat message', { who: data.user, message: msg });
	    });

	    socket.on('start typing', function() {
	    	io.emit('chat message', { message: data.user + ' is typing' });
	    });

	    socket.on('cancel typing', function() {
	    	io.emit('cancel typing', data.user + ' is typing');
	    });
	});
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});
