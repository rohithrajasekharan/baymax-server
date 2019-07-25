
const express = require('express');
const WebSocket = require('ws');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const authRoutes = require('./routes/auth-routes');
const passportSetup = require('./config/google-auth');
const articleRoutes = require('./routes/article-routes');
const feedRoutes = require('./routes/feed-routes');
const pharmaRoutes = require('./routes/pharma-routes');
const chatRoutes = require('./routes/chat-routes');
const notifRoutes = require('./routes/notification-routes');
const hospitalRoutes = require('./routes/hospital-routes');
const homeRoutes = require('./routes/home-routes');
const serviceRoutes = require('./routes/service-routes');
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
function verifyToken(req,res,next){
  const bearerHeader = req.headers['authorization'];
  if(typeof bearerHeader !== 'undefined'){
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    jwt.verify(req.token, 'secretkey',(err,authData)=>{
      if(err) {
        res.sendStatus(403);
      }else {
        req.userId = authData.user._id;
        req.community = authData.user.community;
        next();
      }
    })
  } else {
    res.sendStatus(403);
  }
}
app.use('/auth',verifyToken, authRoutes);
app.use('/article',verifyToken, articleRoutes);
app.use('/notification',verifyToken, notifRoutes);
app.use('/feed',verifyToken, feedRoutes);
app.use('/pharma',verifyToken, pharmaRoutes);
app.use('/chat',verifyToken, chatRoutes);
app.use('/hospital',verifyToken, hospitalRoutes);
app.use('/home',verifyToken, homeRoutes);
app.use('/service',verifyToken, serviceRoutes);

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.post('/communityreset', (req,res)=>{
  const token = req.body.token;
  const community = req.body.community;
  jwt.verify(token, 'secretkey',(err,authData)=>{
    if(err) {
      res.sendStatus(403);
    }else {
      const payload = {
        _id: authData.user._id,
        name: authData.user.name,
        email: authData.user.email,
        picture: authData.user.picture,
        community: community
      }
      jwt.sign({user:payload}, "secretkey", (err,token)=>{
        res.json({token});
      });
    }
  })
});

app.post('/tokensignin', (req,res)=>{
  const token = req.body.idtoken;
  const {OAuth2Client} = require('google-auth-library');
  const client = new OAuth2Client('597194758455-g6u8cs0vn352dn5shr0sfqgo6un07khe.apps.googleusercontent.com');
  async function verify() {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: '597194758455-g6u8cs0vn352dn5shr0sfqgo6un07khe.apps.googleusercontent.com',
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  User.findOne({email: payload.email}).then((currentUser) => {
      if(currentUser){
        jwt.sign({user:currentUser}, "secretkey", (err,token)=>{
          res.json({token});
        });
      } else {
          // if not, create user in our db
          new User({
              name: payload.name,
              email: payload.email,
              avatar: payload.picture,
              pageName: ""
          }).save().then((newUser) => {
            jwt.sign({user:newUser}, "secretkey", (err,token)=>{
              res.json({token,msg: "new user"});
            });
          });
      }
  });
}
verify().catch(console.error);
});

const wss = module.exports.wss = new WebSocket.Server({server});
wss.on('connection', SocketManager);
