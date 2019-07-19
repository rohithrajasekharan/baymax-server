
const express = require('express');
const WebSocket = require('ws');
const mongoose = require('mongoose');
const passport = require('passport');
const authRoutes = require('./routes/auth-routes');
const passportSetup = require('./config/google-auth');
const articleRoutes = require('./routes/article-routes');
const feedRoutes = require('./routes/feed-routes');
const pharmaRoutes = require('./routes/pharma-routes');
const chatRoutes = require('./routes/chat-routes');
const notifRoutes = require('./routes/notification-routes');
const hospitalRoutes = require('./routes/hospital-routes');
const indexRoutes = require('./routes/index-routes');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');const cors = require('cors');
const cookieParser = require('cookie-parser');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const SocketManager = require('./socketmanager');
const app = express();
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log('app listening on port '+PORT);
})
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cors({
//   credentials: true,
//   origin:"http://localhost:3000"
// }));

var whitelist = ['http://localhost:3000','http://localhost:5000', 'https://youcuredme-1521281583796.firebaseapp.com/']
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}


app.use(cors({corsOptionsDelegate}));

app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: ['eagggggawgedsge']
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://vijaicv:ucuredme@ds113179.mlab.com:13179/youcuredme',{ useNewUrlParser: true }, () => {
    console.log("connected to db");
});


app.use(express.static('public'));
app.use('/auth', authRoutes);
app.use('/article', articleRoutes);
app.use('/notification', notifRoutes);
app.use('/feed', feedRoutes);
app.use('/pharma', pharmaRoutes);
app.use('/chat', chatRoutes);
app.use('/hospital', hospitalRoutes);

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

const wss = module.exports.wss = new WebSocket.Server({server});
wss.on('connection', SocketManager);
