//Authentication setup for google
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const User = require('../models/user-model');

//store user in the session (can be called from the app as one for all setup)
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

//Google Strategy setup
passport.use(
    new GoogleStrategy({
      callbackURL: '/auth/google/redirect',
      clientID: '880942137557-rndats23qikhetn9cg124ttlam0fr3e6.apps.googleusercontent.com',
      clientSecret: 'G2sf84QTqcCZkv9CrkkVThWc'
    }, (accessToken, refreshToken, profile, done) => {
        User.findOne({googleId: profile.id}).then((currentUser) => {
          console.log(profile);
            if(currentUser){
                console.log('user is: ', currentUser);
                done(null, currentUser);
            } else {
                new User({
                    googleId: profile.id,
                    name: profile.displayName,
                    avatar : profile.photos[0].value,
                }).save().then((newUser) => {
                    done(null, newUser);
                });
            }
        });
    })
);
