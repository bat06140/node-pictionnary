var FacebookStrategy = require('passport-facebook').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var logger = require('log4js').getLogger('Server');
var mysql = require('./../model/connectdb');
var sha256 = require('sha256');

// load the auth variables
var configAuth = require('./auth');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });

    passport.use(new FacebookStrategy({
            clientID        : configAuth.facebookAuth.clientID,
            clientSecret    : configAuth.facebookAuth.clientSecret,
            callbackURL     : configAuth.facebookAuth.callbackURL,
            profileFields   : ['id', 'displayName', 'photos', 'emails']

        }, function(accessToken, refreshToken, profile, done) {
            process.nextTick(function() {
                mysql.findOrCreate(profile, function(result){
                    done(null, result);
                });
            });
    }));

    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'passwd',
            session: false
        },
        function(username, password, done) {
            mysql.verifLogin(username, function(result){
                if(sha256(password) == result[0].password){
                    result = result[0];
                    if(result.facebook_picture != null) {
                        logger.debug("[fb picture]");
                        user = {
                            id: result.id,
                            email: result.email,
                            picture: result.facebook_picture,
                            name: result.nom
                        };
                    }else if(result.profilepic.length == 0) {
                        logger.debug("[picture default]");
                        user = {
                            id: result.id,
                            email: result.email,
                            picture: "/images/default.png",
                            name: result.nom
                        };
                    }else {
                        logger.debug("[picture]");
                        // Convertie la photo en base64
                        str = "";
                        for(i = 0; i < result.profilepic.length; i++)
                            str += String.fromCharCode( result.profilepic[i] );

                        user = {
                            id: result.id,
                            email: result.email,
                            picture: str,
                            name: result.nom
                        };
                    }
                    done(null, user);
                }else{
                    done(null, false, {message : "Login ou mot de passe incorrect"});
                }
            });
        }
    ));

};