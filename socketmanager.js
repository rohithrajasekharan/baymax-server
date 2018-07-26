
module.exports = (ws)=> {
  const WebSocket = require('ws');
  const DiabetesMessage = require('./models/message-model').DiabetesMessage;
  const BabyandmeMessage = require('./models/message-model').BabyandmeMessage;
  const User = require('./models/user-model');
  const wss = require('./app.js').wss;
  ws.on('chat Diacare', (data)=> {
    let newMessage = new DiabetesMessage({
      message: data.message,
      userId: data.userId,
      type: data.type,
      replyto: data.replyto,
      createdAt: new Date()
    });
    newMessage.save().then((resp)=>{
      DiabetesMessage.find({_id:resp.id}).populate({path: 'userId',select: '_id name isDoc'}).then((message) => {
        wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send('chat Diacare',message);
    }
  });
      })



    })

  })
  ws.on('chat Babyandme', (data)=> {
    let newMessage = new BabyandmeMessage({
      message: data.message,
      userId: data.userId,
      type: data.type,
      replyto: data.replyto,
      createdAt: new Date()
    });
    newMessage.save().then((resp)=>{
      BabyandmeMessage.find({_id:resp.id}).populate({path: 'userId',select: '_id name isDoc'}).then((message) => {
        wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send('chat Babyandme',message);
    }
  });
      })



    })

  })

  ws.on('typing', function(user){
    console.log(user+" is typing");
    wss.clients.forEach(function each(client) {
if (client.readyState === WebSocket.OPEN) {
  client.send('typing',user);
}
});
  });


};
