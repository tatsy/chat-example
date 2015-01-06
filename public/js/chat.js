function decoMessage(data) {
    var msg = "";
    if(data.who !== undefined) {
        msg += '<span class="who">' + data.who + '</span>: ';
    }
    msg += data.message;
    return msg;
}

$(document).ready(function() {
    var socket = io();
    var isType = false;

    $('#msg-form').submit(function() {
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        isType = false;
        socket.emit('cancel typing', {});
        return false;
    });

    socket.on('chat message', function(data) {
        $('#messages').append($('<li>').html(decoMessage(data)));
    });

    socket.on('connected', function() {
    	socket.emit('user login', data);
    });

    socket.on('cancel typing', function(msg) {
    	$('#messages > li').each(function() {
            console.log($(this).text());
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
});
