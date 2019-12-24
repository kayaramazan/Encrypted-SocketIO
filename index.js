var express = require('express');
var socket = require('socket.io');
var app = express();
var server = app.listen(4000, function(){
    console.log("merhaba port 4000");
}); 
// Static artik 

app.use(express.static('public'));


//Socket setup 
var users = [];
var socketlerim = [];
var io = socket(server);

io.on('connection',function(socket){
    console.log('connection succesful!!', socket.id);
    io.emit('surumkontrol', 1);
    io.emit('users',users); 
    socket.on('yeniGiris',function(data){
    if(data!=null)
    {
        socketlerim[socket.id] = data;
       users.push(data); 
       io.emit('users',users); 
    }
     });
    socket.on('chat',function(data){ 
        io.sockets.emit('chat',data);
        console.log(data);
    });

    socket.on('disconnect', () => {
        console.log(socketlerim[socket.id] + " disconnected");
        for (var i = 0; i < users.length; i++)
        if (users[i] === socketlerim[socket.id]) { 
            users.splice(i, 1);
            delete socketlerim[socket.id];
            io.emit('users', users);
            break;
        }
      });
          
    socket.on('typing',function(data){
        socket.broadcast.emit('typing',data)
        

    }); 
}); 
