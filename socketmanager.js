module.exports = (socket)=> {
  const Messages = require('./models/message-model');
  const User = require('./models/user-model');
  const io = require('./app.js').io;
  console.log("made socket connection", socket.id);
  socket.on('chat message', (data)=> {
    let newMessage = new Messages({
      conversationId: data.conversationId,
      message: data.message,
      sendersId: data.handle,
      createdAt: new Date()
    });
    newMessage.save().then(()=>{
        io.sockets.emit('chat message',data)
    })

  })

  socket.on('typing', function(user){
      socket.broadcast.emit('typing', user);
  });

  socket.on('disconnect', function(){
      User.update({name:socket.username},{$set:{lasttimestamp:new Date()}}, {upsert: true});
  });
    socket.on('joinchat', function(username){
    socket.username=username;
    });


    socket.on('iamback',function(){
      User.find({name:socket.username}).then((resp) => {
          Messages.find({createdAt: {$gt: new Date(resp[0].lasttimestamp)}}).then((data) => {
            socket.emit('unreadmessages', data)
          })
      })
    })
};
