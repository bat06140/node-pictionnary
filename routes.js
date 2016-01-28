var logger = require('log4js').getLogger('Server');
var passport = require('passport');

module.exports = function (app) {

    authController = require('./controller/authController');
    userController = require('./controller/userController');


    app.get('/', function (req, res) {
        if(req.isAuthenticated()){
            res.redirect('/home/welcome');
        }else{
            res.redirect('/signin');
        }
    });

    // Connexion
    app.get('/signin', authController.signInGet);
    app.get('/auth/facebook', passport.authenticate('facebook', {
        failureRedirect: '/signin'
    }));

    app.post('/signin', passport.authenticate('local', {
        failureRedirect: '/signin',
        successRedirect: '/home/welcome',
        failureFlash: true
    }));

    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/home/welcome',
        failureRedirect: '/signin'
    }));


    // Inscription
    app.get('/auth/signup', authController.signUpGet);
    app.post('/auth/signup', authController.signUpPost);


    // Deconnexion
    app.get('/auth/signout', authController.signOut);


    // User regular
    app.get('/home/welcome', ensureAuthenticated, userController.welcomeGet);
    app.get('/draw/view/:paint', ensureAuthenticated, userController.viewPaint);
    app.get('/draw/paint', ensureAuthenticated, userController.drawPaintGet);
    app.post('/draw/paint', ensureAuthenticated, userController.drawPaintPost);



    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) { return next(); }
        res.redirect('/signin');
    }
};

