
const express = require('express');
const WebSocket = require('ws');
const mongoose = require('mongoose');
const passport = require('passport');
const authRoutes = require('./routes/auth-routes');
const articleRoutes = require('./routes/article-routes');
const feedRoutes = require('./routes/feed-routes');
const pharmaRoutes = require('./routes/pharma-routes');
const chatRoutes = require('./routes/chat-routes');
const notifRoutes = require('./routes/notification-routes');
const hospitalRoutes = require('./routes/hospital-routes');
const indexRoutes = require('./routes/index-routes');
const localAuth = require('./config/local-auth');
const googleAuth = require('./config/google-auth');
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
app.use(cors({
  credentials: true,
  origin:"http://localhost:3000"
}));

app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: ['eagggggawgedsge']
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('public'));
app.use('/auth', authRoutes);
app.use('/article', articleRoutes);
app.use('/notification', notifRoutes);
app.use('/feed', feedRoutes);
app.use('/pharma', pharmaRoutes);
app.use('/chat', chatRoutes);
app.use('/hospital', hospitalRoutes);

mongoose.connect('mongodb://vijaicv:ucuredme@ds113179.mlab.com:13179/youcuredme', () => {
    console.log("connected to db");
});

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

const wss = module.exports.wss = new WebSocket.Server({server});
wss.on('connection', SocketManager);
