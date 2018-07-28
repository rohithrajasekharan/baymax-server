module.exports = (ws)=> {
  const DiacareMessage = require('./models/message-model').DiacareMessage;
  const BabyandmeMessage = require('./models/message-model').BabyandmeMessage;
  const User = require('./models/user-model');
  const wss = require('./app.js').wss;
  console.log('connection is made');
  ws.on('message', function incoming(message) {
    var args = JSON.parse(message);
    if (args.pageName == "Diacare") {
      let newMessage = new DiacareMessage({
        message: args.message,
        sender: args.sender,
        userId: args.userId,
        type: args.type,
        replyto: args.replyto,
        reply: args.reply,
        replyId: args.replyId,
        isDoc: args.isDoc,
        createdAt: new Date()
      });
      newMessage.save().then((resp) => {
          wss.clients.forEach(function each(client) {
              console.log(resp);
              client.send(JSON.stringify(resp));
        })
      })
    }
  });
}
