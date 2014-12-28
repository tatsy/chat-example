var socket = io();
var isType = false;

$('form').submit(function() {
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
});

socket.on('chat message', function(msg) {
    $('#messages').append($('<li>').text(msg));
});

socket.on('connected', function(data) {
	socket.emit('user login', user);
});

socket.on('cancel typing', function(msg) {
	$('#messages > li').each(function() {
		if($(this).text() == msg) {
			$(this).remove();
			return;
		}
	});
});

$('#m').keyup(function() {
	if($('#m').val() == '') {
		isType = false;
		socket.emit('cancel typing', {});
	} else if(!isType) {
		isType = true;
		socket.emit('start typing', {});
	}
});