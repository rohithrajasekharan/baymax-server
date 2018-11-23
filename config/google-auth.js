
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user-model');

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(
    new GoogleStrategy({
        // options for google strategy
        clientID: '880942137557-nf8neek7jlbpb0t3fuobdd03jj9tk3sc.apps.googleusercontent.com',
        clientSecret: '6y5uXwV8gPW5StnKngAX_ace',
        callbackURL: '/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done) => {
        User.findOne({googleId: profile.id}).then((currentUser) => {
            if(currentUser){
                done(null, currentUser);
            } else {
                // if not, create user in our db
                new User({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    avatar: profile._json.image.url
                }).save().then((newUser) => {
                    done(null, newUser);
                });
            }
        });
    })
);
