var router = require('express').Router();
var passport = require('passport');

router.get('/',
  passport.authenticate('google', { session: false }));

router.get('/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/' }),
  function(req, res) {
    console.log('authentication worked', req.user);
    req.session.access_token = req.user.accessToken;
    res.redirect('/calendar');
});

module.exports = router;
