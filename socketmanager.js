module.exports = (socket)=> {
  const DiabetesMessage = require('../models/message-model').DiabetesMessage;
  const BabyandmeMessage = require('../models/message-model').BabyandmeMessage;
  const User = require('./models/user-model');
  const io = require('./app.js').io;
  console.log("made socket connection", socket.id);
  socket.on('chat Diacare', (data)=> {
    let newMessage = new DiabetesMessage({
      message: data.message,
      userId: data.userId,
      type: data.type,
      replyto: data.replyto,
      createdAt: new Date()
    });
    newMessage.save().then((resp)=>{
      DiabetesMessage.find({_id:resp.id}).populate({path: 'userId',select: '_id name isDoc'}).then((message) => {
        io.sockets.emit('chat Diacare',message)
      })



    })

  })
  socket.on('chat Babyandme', (data)=> {
    let newMessage = new BabyandmeMessage({
      message: data.message,
      userId: data.userId,
      type: data.type,
      replyto: data.replyto,
      createdAt: new Date()
    });
    newMessage.save().then((resp)=>{
      BabyandmeMessage.find({_id:resp.id}).populate({path: 'userId',select: '_id name isDoc'}).then((message) => {
        io.sockets.emit('chat Babyandme',message)
      })



    })

  })

  socket.on('typing', function(user){
    console.log(user+" is typing");
      socket.broadcast.emit('typing', user);
  });

  socket.on('disconnect', function(){
      User.update({name:socket.username},{$set:{lasttimestamp:new Date()}}, {upsert: true});
  });
    socket.on('joinchat', function(username){
    socket.username=username;
    });

};
