const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const rsaKey = require('../routers/rsaProducer');
const passport = require('../middleware/passport')
const { User } = require("../models/userModel")
const bCrypt = require('bcrypt-nodejs');
const signature = require('cookie-signature');
const cookie = require('cookie');

const createHash = function(password){
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

router.patch("/change_password", async (req, res) => {
  const decryptedPassword = crypto.privateDecrypt(
    {
      key: rsaKey.privateKey,
      passphrase: '',
      padding: crypto.constants.RSA_PKCS1_PADDING
    },
    Buffer.from(req.body.encryptedPassword, 'base64')
  );

  const password = createHash(decryptedPassword.toString());
  const username = req.body.username;
  const email = req.body.email;

  try {
    const user = await User.findOneAndUpdate(
      { username, email },
      { password: password }
    );

    if (!user) {
      return res.status(404).json({
        message: "使用者未找到",
        success: false
      });
    }

    res.json({
      message: "密碼更新成功",
      success: true
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "伺服器錯誤",
      success: false
    });
  }
  
});

router.get('/forget/is_exist', async (req, res) => {
  try {
    const { username, email } = req.query;

    const user = await User.findOne({ username, email });

    if (user) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/login/success', function (req, res, next) {
  res.send(true);
})

router.get('/login/fail', function (req, res, next) {
  res.send(false);
});

router.post('/login', (req, res, next) => {
  passport.authenticate('login',
  function (err, user, info){
    if (err) {
      res.json({ IsLoginSuccess: false, cookie: null });
    }
    else {
      if (!user) {
        res.json({ IsLoginSuccess: false, cookie: null });
      } 
      else {
        req.login(user, function (err) {
          if (err) {
            res.json({ IsLoginSuccess: false, cookie: null });
          } else {
            // const signed = 's:' + signature.sign(req.sessionID, "mySecretKey");
            const signed = req.sessionID;
            // const data = cookie.serialize("connect.sid", signed);

            res.json({ IsLoginSuccess: true, cookie: signed });
          }
        });
      }
    }
  }
  // {
  //   successRedirect: '/authentication/login/success',
  //   failureRedirect: `/authentication/login/fail`,
  //   failureFlash : true}
  )(req, res, next)
});

router.get('/signup/success', function (req, res, next) {
  // res.send(req.flash('message'));
  res.send(true);
})

router.get('/signup/fail', function (req, res, next) {
  // res.send(req.flash('message'));
  res.send(false);
});

router.post('/signup', (req, res, next) => {
  passport.authenticate('signup', 
  function (err, user, info){
    if (err) {
      res.send(false);
    }
    else {
      if (!user) {
        res.send(false);
      } 
      else {
        res.send(true);
      }
    }
  }
  // {
  //   successRedirect: '/authentication/signup/success',
  //   failureRedirect: '/authentication/signup/fail',
  //   failureFlash : true
  // }
  )(req, res, next)
});

router.get('/signout/success', function (req, res, next) {
  req.flash('message', 'Sign out');
  res.send(req.flash('message'));
});

// 正常的signout
// router.get('/signout', (req, res, next) => {
//   req.logout(function(err) {
//     if (err) { return next(err); }
//     req.flash('message', 'Sign out');
//     res.send(req.flash('message'));
//     // res.redirect('/authentication/signout/success');
//   });
// })

// 應付不同domain下的處理
router.get('/signout', (req, res, next) => {
  const session_id = req.headers["authorization"];
  req.sessionStore.destroy(session_id, function(err){
    if(err){
      console.log(err);
    }
  });
  req.flash('message', 'Sign out');
  res.send(req.flash('message'));
})

// 正常的checkLoginStatus
// router.get('/checkLoginStatus', (req, res, next) => {
  // if (req.isAuthenticated()) {
  //   const { id, username, email, gender } = req.user;
  //   res.json({ 
  //     isLoggedIn: true,
  //     user: { id, username, email, gender }
  //   });
  // }
  // else {
  //   res.json({
  //     isLoggedIn: false,
  //     user: null
  //   });
  // }
// })

// 應付不同domain下的處理
router.get('/checkLoginStatus', (req, res, next) => {
  const session_id = req.headers["authorization"];

  req.sessionStore.get(session_id, function(err, session){
    if(err){
      res.json({
        isLoggedIn: false,
        user: null
      });
    }
    if(session){
      User.findById(session.passport.user).then((data) => {
        const { id, username, email, gender } = data;
        res.json({ 
          isLoggedIn: true,
          user: { id, username, email, gender }
        });
      })
    }
    else{
      res.json({ 
        isLoggedIn: false,
        user: null
      });
    }
  })
})

router.get('/unauthenticated', (req, res, next) => {
  req.flash('message', 'Unauthenticated');
  res.send(req.flash('message'));
})

const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  // res.redirect('/authentication/unauthenticated')
  req.flash('message', 'Unauthenticated');
  res.send(req.flash('message'));
}

const Router = router;

Router.authenticated = authenticated;

module.exports = Router;