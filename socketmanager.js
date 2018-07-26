
module.exports = (ws)=> {
  const WebSocket = require('ws');
  const DiabetesMessage = require('./models/message-model').DiabetesMessage;
  const BabyandmeMessage = require('./models/message-model').BabyandmeMessage;
  const User = require('./models/user-model');
  const wss = require('./app.js').wss;
  console.log('connection is made');
  ws.on('message', (raw)=> {
    var args = JSON.parse(raw);
    if (args.pageName=="Diacare") {
      let newMessage = new DiabetesMessage({
        message: args.data.message,
        userId: args.data.userId,
        type: args.data.type,
        replyto: args.data.replyto,
        createdAt: new Date()
      });
      newMessage.save().then((resp)=>{
        DiabetesMessage.find({_id:resp.id}).populate({path: 'userId',select: '_id name isDoc'}).then((message) => {
          wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
        })
      })
    }
    else if (args.pageName=="Babyandme") {
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
        client.send(message);
      }
    });
        })
      })
    }

  })

};
