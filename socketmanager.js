module.exports = (ws)=> {
  const DiacareMessage = require('./models/message-model').DiacareMessage;
  const BabyandmeMessage = require('./models/message-model').BabyandmeMessage;
  const User = require('./models/user-model');
  const wss = require('./app.js').wss;
  console.log('connection is made');

  ws.isAlive = true;
  ws.on('pong', () => {
       ws.isAlive = true;
});
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
        time: new Date()
      });
      var count=0;
      newMessage.save().then((resp) => {
          wss.clients.forEach(function each(client) {
            count++;
            console.log(count);
            client.send(JSON.stringify(resp));
        })
      })
    }
  });

setInterval(() => {
  var count=0;
    wss.clients.forEach((client) => {
      count++;
      console.log(count);
        if (!client.isAlive) return client.terminate();
        client.isAlive = false;
        client.ping(null, false, true);
    });
}, 30000);
}
