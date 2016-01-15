
module.exports = function (app) {

    authController = require('./controller/authController');

    app.get('/', function (req, res) {
        if(req.session.authid){
            res.redirect('/home/welcome');
        }else{
            res.redirect('/signin');
        }
    });

    app.route('/signin')
        .get(authController.get)
        .post(authController.post);


    app.route('/auth/signup')
        .get(function (req, res) {
            res.render('auth/signup');
        });

    app.get('/auth/signout', authController.signout);

    app.route('/home/welcome')
        .get(function(req, res){
           if(req.session.authid){
                res.render('home/index', {auth: true});
           }else{
               res.redirect('/signin');
           }
        });
};

