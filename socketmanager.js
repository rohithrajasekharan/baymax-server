let WSServer = require('ws').Server;
let server = require('http').createServer();
let app = require('./app');
  const DiabetesMessage = require('./models/message-model').DiabetesMessage;
  const BabyandmeMessage = require('./models/message-model').BabyandmeMessage;
  const User = require('./models/user-model');

let wss = new WSServer({
  server: server
});

// Also mount the app here
server.on('request', app);

wss.on('connection', function connection(ws) {
  console.log('connection')
  ws.on('message', function incoming(message) {
    var args = JSON.parse(message);
    console.log(args);
    if (args.pageName == "Diacare") {
      let newMessage = new DiabetesMessage({
        message: args.message,
        sender: args.sender,
        userId: args.userId,
        type: args.type,
        replyto: args.replyto,
        reply: args.reply,
        replyId: args.replyId,
        createdAt: new Date()
      });
      newMessage.save().then((resp) => {
          wss.clients.forEach(function each(client) {
              console.log(resp);
              client.send(resp);
        })
      })
    }
  });
});


server.listen(process.env.PORT || 8080, function () {
  console.log(`http/ws server listening on ${process.env.PORT || 8080}`);
});
// module.exports = (ws)=> {
//   const WebSocket = require('ws');
//   const DiabetesMessage = require('./models/message-model').DiabetesMessage;
//   const BabyandmeMessage = require('./models/message-model').BabyandmeMessage;
//   const User = require('./models/user-model');
//   const wss = require('./app.js').wss;
//   console.log('connection is made');
//   ws.on('message', (raw)=> {
//     console.log(raw)
//     var args = JSON.parse(raw);
//     if (args.pageName=="Diacare") {
//       let newMessage = new DiabetesMessage({
//         message: args.data.message,
//         userId: args.data.userId,
//         type: args.data.type,
//         replyto: args.data.replyto,
//         createdAt: new Date()
//       });
//       newMessage.save().then((resp)=>{
//         DiabetesMessage.find({_id:resp.id}).populate({path: 'userId',select: '_id name isDoc'}).then((message) => {
//           wss.clients.forEach(function each(client) {
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(message);
//       }
//     });
//         })
//       })
//     }
//     else if (args.pageName=="Babyandme") {
//       let newMessage = new BabyandmeMessage({
//         message: data.message,
//         userId: data.userId,
//         type: data.type,
//         replyto: data.replyto,
//         createdAt: new Date()
//       });
//       newMessage.save().then((resp)=>{
//         BabyandmeMessage.find({_id:resp.id}).populate({path: 'userId',select: '_id name isDoc'}).then((message) => {
//           wss.clients.forEach(function each(client) {
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(message);
//       }
//     });
//         })
//       })
//     }

//   })

// };
