var logger = require('log4js').getLogger('Server');
var passport = require('passport');

module.exports = function (app) {

    authController = require('./controller/authController');
    userController = require('./controller/userController');
    adminController = require('./controller/adminController');


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

    // Error
    app.get('/error', function(req, res){
       res.render('error/500', {user: req.user});
    });

    // User regular
    app.get('/home/welcome', ensureAuthenticated, userController.welcomeGet);
    app.post('/home/welcome', ensureAuthenticated, userController.welcomePost);
    app.get('/draw/view/:paint', ensureAuthenticated, userController.viewPaint);
    app.get('/draw/paint', ensureAuthenticated, userController.drawPaintGet);
    app.post('/draw/paint', ensureAuthenticated, userController.drawPaintPost);
    app.get('/user/setting', ensureAuthenticated, userController.settingGet);
    app.post('/user/setting', ensureAuthenticated, userController.settingPost);

    // Admin
    app.get('/admin', isAdmin, adminController.index);
    app.get('/admin/user/:user', isAdmin, adminController.viewUser);
    app.post('/admin/user/:user', isAdmin, adminController.updateUser);
    app.get('/admin/user/delete/:user', isAdmin, adminController.deleteUser);


    function isAdmin(req, res, next){
        if (req.isAuthenticated())
            if(req.user.admin == 1)
                return next();
        res.render('/');
    }

    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) { return next(); }
        res.redirect('/');
    }
};

