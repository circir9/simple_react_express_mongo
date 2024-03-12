const crypto = require('crypto');
const { User, UserProfile } = require("../models/userModel")
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy
const {v1 : uuidv1} = require('uuid')
const rsaKey = require('../routers/rsaProducer');
const bCrypt = require('bcrypt-nodejs');

const isValidPassword = function(user, password){
  return bCrypt.compareSync(password, user.password);
}

const createHash = function(password){
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

passport.use('login', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'encryptedPassword',
  passReqToCallback : true
},
  function(req, username, encryptedPassword, done) {
    const decryptedPassword = crypto.privateDecrypt(
      {
        key: rsaKey.privateKey,
        passphrase: '',
        padding: crypto.constants.RSA_PKCS1_PADDING
      },
      Buffer.from(encryptedPassword, 'base64')
    );

    const password = decryptedPassword.toString();
    // check in mongo if a user with username exists or not 
    User.findOne({username:username}).then((data) => {
      if (!data){
        console.log('User Not Found with username '+username);
        return done(null, false, req.flash('message', 'User Not found.'));       
      };
      if (!isValidPassword(data, password)){
        console.log('Invalid Password');
        return done(null, false, req.flash('message', 'Invalid Password'));
      }
      // User and password both match, return user from 
      // done method which will be treated like success
      console.log('User login successful');
      return done(null, data);
    })
    .catch((err) => {
      return done(err);
    });
  }
));

passport.use('signup', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'encryptedPassword',
  passReqToCallback : true
},
  function(req, username, encryptedPassword, done) {
    const findOrCreateUser = function(){
      const decryptedPassword = crypto.privateDecrypt(
        {
          key: rsaKey.privateKey,
          passphrase: '',
          padding: crypto.constants.RSA_PKCS1_PADDING
        },
        Buffer.from(encryptedPassword, 'base64')
      );

      const password = decryptedPassword.toString();
      // find a user in Mongo with provided username 
      User.findOne({username:username}).then((data) => {
        // already exists 
        if (!data) {
          // if there is no user with that username 
          // create the user 
          var newUser = new User();
          // set the user's local credentials 
          newUser.username = username;
          newUser.password = createHash(password);
          newUser.email = req.body.email;
          newUser.gender = req.body.gender;
          newUser.id = uuidv1();

          var newUserProfile = new UserProfile();
          newUserProfile.id = newUser.id;
          newUserProfile.message = "type something";
          newUserProfile.avatar_path = "";
          newUserProfile.save();

          // save the user 
          newUser.save().then(() => {
            console.log('User Registration succesful');
            return done(null, newUser);
          })
          .catch((err) => {
            if (err){
              console.log('Error in Saving user: '+err);  
              throw err;  
            }  
          });
        }
        else{
          console.log('User already exists');
          return done(null, false, req.flash('message','User Already Exists'));
        }
      })
      .catch((err) => {
        console.log('Error in SignUp: '+err);
        return done(err);
      });

    };
    // Delay the execution of findOrCreateUser and execute 
    // the method in the next tick of the event loop 
    process.nextTick(findOrCreateUser);
  }
));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id).then((res) => {
    done(null, res)
  })
  .catch((err) => done(err, null))
});

module.exports = passport;