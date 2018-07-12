
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const authRoutes = require('./routes/auth-routes');
const articleRoutes = require('./routes/article-routes');
const localAuth = require('./config/local-auth');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');const cors = require('cors');
const cookieParser = require('cookie-parser');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const socket = require('socket.io');
const SocketManager = require('./socketmanager');
const app = express();
const PORT = process.env.PORT || 8080;
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: ['eagggggawgedsge']
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('public'));

app.use('/auth', authRoutes);
app.use('/article', articleRoutes);

mongoose.connect('mongodb://vijaicv:ucuredme@ds113179.mlab.com:13179/youcuredme', () => {
    console.log("connected to db");
});

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

const server = app.listen(PORT, () => {
  console.log('app listening on port '+PORT);
})
const io = module.exports.io = socket(server);
io.on('connection', SocketManager);
