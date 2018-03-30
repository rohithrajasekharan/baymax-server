
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
const app = express();
const PORT = process.env.PORT || 8080;
var config = require('./config');

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [config.keys]
}));

app.use(passport.initialize());
app.use(passport.session());



app.use('/auth', authRoutes);
app.use('/article', articleRoutes);

mongoose.connect(config.dbUrl, () => {
    console.log("connected to db");
});

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(PORT, () => {
  console.log('app listening on port 8080');
})
