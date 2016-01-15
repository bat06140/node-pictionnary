var validator = require('validator');
var mysql = require('./../model/connectdb');
var logger = require('log4js').getLogger('Server');
var sha256 = require('sha256');


exports.get = function(req, res){
    if(req.session.authid){
        res.redirect('/home/welcome');
    }else{
        res.render('auth/signin');
    }
};

exports.post = function(req, res){
    if(req.session.authid)
        res.redirect('/home/welcome');
    else {
        errors = [];
        // Verification des champs
        if (!validator.isEmail(req.body.email))
            errors[errors.length] = "Format de l'email non valide";
        if (!validator.isAlphanumeric(req.body.passwd))
            errors[errors.length] = "Format du mot de passe non valide";

        // S'il y a des erreurs on les affiches dans la page home
        if (errors.length != 0)
            res.render('auth/signin', {errors: errors});
        else {
            // création de la requete SQL
            sql = 'SELECT id FROM users WHERE email = ' + mysql.escape(req.body.email) + ' AND password = ' + mysql.escape(sha256(req.body.passwd));

            // Sinon on regarde si l'utilisateur existe dans la base de donnée
            mysql.query(req, res, sql, function (response) {
                if (response.length != 1) {
                    res.render('auth/signin', {errors: ['Email ou mot de passe incorrect.']});
                } else {
                    req.session.authid = response[0].id;
                    res.redirect('/home/welcome');
                }
            });
        }
    }
};

exports.signout = function(req, res){
    if(req.session.authid){
        req.session.destroy(function(err) {
            if (err)
                logger.error(err);
            else
                res.redirect('/');
        });
    }else{
        req.redirect('/');
    }

};